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
			} catch (error) {
				console.error('Error removing outing from outings array', error)
			}
		}
	})
