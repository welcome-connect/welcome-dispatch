import { db, firebase } from '.'

export const createSchedule = async (agentId, showing) => {
	if (!showing) throw new Error('Showing required')
	const { date, startTime, endTime, id: showingId } = showing

	const scheduleRef = db.collection('schedules').doc()
	const scheduleSnap = await scheduleRef.get()
	const scheduleModel = {
		id: scheduleRef.id,
		date,
		showings: firebase.firestore.FieldValue.arrayUnion(showing),
		agentId,
	}

	if (!scheduleSnap.exists) {
		try {
			await scheduleRef.set(scheduleModel)
			return getSchedule(scheduleRef.id)
		} catch (error) {
			console.error('Error creating schedule: ', error.message)
		}
	} else {
		return getSchedule(id)
	}
}

export const checkAgentSchedule = async (agentId, showing) => {
	const { date, startTime, endTime, id: showingId } = showing
	let isAvailable

	const scheduleRef = db
		.collection('schedules')
		.where('agentId', '==', agentId)
		.where('date.string', '==', date.string)

	const scheduleSnapshot = await scheduleRef.get()
	const isEmpty = scheduleSnapshot.empty

	if (isEmpty) {
		await createSchedule(agentId, { showingId, date, startTime, endTime })
		isAvailable = true
	} else {
		const currShowings = scheduleSnapshot.docs[0].data().showings
		currShowings.forEach(showing => {
			console.log({ showing, startTime, endTime })
			if (showingId !== showing.id) {
				if (startTime >= showing.startTime && startTime <= showing.endTime) {
					console.log('Showing is in between an existing showing...')
					isAvailable = false
				} else if (endTime >= showing.startTime && endTime <= showing.endTime) {
					console.log('endTime >= showing.startTime && endTime <= showing.endTime')
					isAvailable = false
				} else if (startTime <= showing.startTime && endTime >= showing.endTime) {
					console.log('startTime <= showing.startTime && endTime >= showing.endTime')
					isAvailable = false
				} else {
					console.log('Agent is available')
					isAvailable = true
				}
			}
		})
	}

	return isAvailable
}

export const getSchedule = async id => {
	if (!id) return new Error('Id required')

	try {
		const scheduleDocument = await db.collection('schedules').doc(id).get()
		return { id, ...scheduleDocument.data() }
	} catch (error) {
		console.error('Error fetching schedule: ', error.message)
	}
}
