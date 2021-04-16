const functions = require('firebase-functions')
const { getUnixTime } = require('date-fns')
const { db, admin } = require('../admin')
const { sendSMS } = require('../services/twilio/sendSMS')

exports.updateOutingStatusOnShowingChange = functions.firestore.document('showings/{showingId}').onUpdate(async change => {
	const newData = change.after.data()
	const currentData = change.before.data()
	console.log({ newData, currentData })

	const isStatusChange = newData.status !== currentData.status
	const time = getUnixTime(Date.now())

	if (isStatusChange) {
		const outingRef = db.collection('outings').doc(newData.outingId)
		const outingDoc = (await outingRef.get()).data()

		if (outingDoc.status === 'pending') {
			return outingRef.update({ status: 'inProgress', inProgressTime: time })
		}
	}
})

exports.notifyAgentOnShowingCreation = functions.firestore
	.document('showings/{showingId}')
	.onWrite(async (change, context) => {
		const newData = change.after.data()
		const currentData = change.before.data()

		const outingIdAdded = !currentData.outingId && newData.outingId
		console.log({ currentData, newData, outingIdAdded })
		const agent = (await db.collection('users').doc(newData.agentId).get()).data()

		if (outingIdAdded) {
			const message = `New showing assignment. For details click in the link below: \nhttps://agents.welcome.org/outings/${newData.outingId}/showings/${newData.id}`
			const res = await sendSMS(agent.phoneNumber, message)
			console.log({ res })
			return
		}
	})

async function getShowing(id) {
	if (!id) return new Error('Id required')

	try {
		const showingDocument = await db.collection('showings').doc(id).get()
		return showingDocument.data()
	} catch (error) {
		console.error('Error fetching showing: ', error.message)
	}
}

async function getOutingShowings(outingId) {
	const { showings } = (await db.collection('outings').doc(outingId).get()).data()
	return Promise.all(showings.map(showingId => getShowing(showingId)))
}

async function updateOutingTimeSlot(outingId) {
	const outingRef = db.collection('outings').doc(outingId)
	const showings = await getOutingShowings(outingId)

	let earliestTime = showings[0].preStartTime
	let latestTime = showings[0].preEndTime

	showings.forEach(showing => {
		if (showing.preStartTime < earliestTime) earliestTime = showing.preStartTime
		if (showing.preEndTime > latestTime) latestTime = showing.preEndTime
	})

	await outingRef.update({ preStartTime: earliestTime, preEndTime: latestTime })
}

exports.removeShowingRefsOnShowingDeletion = functions.firestore
	.document('showings/{showingId}')
	.onDelete(async (snap, _) => {
		const UNASSIGNED = 'unassigned'
		const showing = snap.data()

		if (showing.agentId !== UNASSIGNED) {
			try {
				const outingRef = await db.collection('outings').doc(showing.outingId)
				await outingRef.update({
					showings: admin.firestore.FieldValue.arrayRemove(showing.id)
				})

				const updatedOutingRef = db.collection('outings').doc(showing.outingId)
				const updatedOuting = (await updatedOutingRef.get()).data()

				if (updatedOuting.showings.length > 0) await updateOutingTimeSlot(showing.outingId)

				if (updatedOuting.showings.length === 0) {
					await db.collection('outings').doc(showing.outingId).delete()
					const scheduleRef = (
						await db.collection('schedules').where('outings', 'array-contains', showing.outingId).get()
					).docs[0].ref
					const schedule = (await scheduleRef.get()).data()

					await scheduleRef.update({ outings: admin.firestore.FieldValue.arrayRemove(showing.outingId) })
					const updatedScheduleRef = db.collection('schedules').doc(schedule.id)
					const updatedSchedule = (await updatedScheduleRef.get()).data()

					if (updatedSchedule.outings.length === 0) {
						await updatedScheduleRef.delete()
					}
				}
			} catch (error) {
				console.error('Error removing outing from outings array', error)
			}
		}
	})
