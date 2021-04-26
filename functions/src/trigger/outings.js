const { getUnixTime } = require('date-fns')
const functions = require('firebase-functions')
const { db, admin } = require('../admin')
const { updateOutingTimeSlot } = require('../utils')

exports.updateOutingStatus = functions.firestore.document('outings/{outingId}').onUpdate(async change => {
	const newData = change.after.data()
	const currentData = change.before.data()

	console.log({ newData, currentData })

	const isShowingFinalChange =
		newData.cancelledShowings.length !== currentData.cancelledShowings.length ||
		newData.completedShowings.length !== currentData.completedShowings.length

	const hasBeenCancelled = newData.status !== currentData.status && newData.status === 'cancelled'
	const time = getUnixTime(Date.now())

	if (hasBeenCancelled) {
		const showingSnapshots = (await db.collection('showings').where('outingId', '==', newData.id).get()).docs

		return Promise.all(
			showingSnapshots.map(async showingSnapshot => {
				await showingSnapshot.ref.update({
					status: 'cancelled',
					cancelledTime: time
				})
			})
		)
	}

	if (isShowingFinalChange) {
		if (newData.cancelledShowings.length + newData.completedShowings.length === newData.showings.length) {
			return change.after.ref.set(
				{
					status: 'readyToComplete',
					readyToCompleteTime: time
				},
				{ merge: true }
			)
		}
	}
})

exports.deleteOutingOnShowingRemoval = functions.firestore.document('outings/{outingId}').onUpdate(async change => {
	const changedOuting = change.after.data()
	const hasNoMoreShowings = changedOuting.showings.length === 0

	if (hasNoMoreShowings) {
		await db.collection('outings').doc(changedOuting.id).delete()
		const scheduleRef = (await db.collection('schedules').where('outings', 'array-contains', changedOuting.id).get())
			.docs[0].ref
		await scheduleRef.update({ outings: admin.firestore.FieldValue.arrayRemove(changedOuting.id) })
	} else {
		await updateOutingTimeSlot(changedOuting.id)
	}
})
