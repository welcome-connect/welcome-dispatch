const { getUnixTime } = require('date-fns')
const functions = require('firebase-functions')
const { db, admin } = require('../admin')

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
