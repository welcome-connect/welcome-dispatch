const functions = require('firebase-functions')
const { db, admin } = require('../admin')

exports.addToSOSHistoryOnSOSDismissal = functions.firestore.document('sos-signal/{sosSignalId}').onUpdate(async change => {
	const newData = change.after.data()
	const currentData = change.before.data()

	console.log({ newData, currentData })
	if (newData.dismissed) {
		await createSOSHistoryDoc(newData)
    await change.after.ref.delete()
	}
})

async function createSOSHistoryDoc(data) {
	await db.collection('sos-history').doc(data.id).set(data)
}
