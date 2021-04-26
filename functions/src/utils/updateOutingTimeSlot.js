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

module.exports = updateOutingTimeSlot
