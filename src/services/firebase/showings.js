import { getShowingModel } from '@utils/index'
import { db, firebase } from './index'
import { handleOutingCreation } from './outings'
import { checkSchedule, createSchedule, updateScheduleOutings } from './schedules'

// CREATE SHOWING
export const createShowing = async showing => {
	if (!showing) throw new Error('Showing information required')
	const { agent } = showing

	let showingRef
	if (!showing.id) showingRef = db.collection('showings').doc()
	else showingRef = db.collection('showings').doc(showing.id)

	const createdAt = firebase.firestore.FieldValue.serverTimestamp()
	const showingModel = getShowingModel({ ...showing, createdAt, id: showingRef.id })

	const { isAvailable, schedule } = await checkSchedule(agent?.id, showingModel)
	console.log({ isAvailable, schedule })
	if (!isAvailable) throw new Error('Agent is unavailable at this time')

	const showingSnapshot = await showingRef.get()

	if (!showingSnapshot.exists) {
		try {
			await showingRef.set(showingModel)
			const submitedShowing = await getShowing(showingRef.id)
			const outing = await handleOutingCreation(submitedShowing)
			await updateShowingOutingId(showingRef.id, outing.id)

			if (!schedule && agent) {
				const newSchedule = await createSchedule(agent.id, outing)
				return { showing: submitedShowing, outing, schedule: newSchedule }
			}

			if (schedule && agent) {
				const updatedSchedule = await updateScheduleOutings(schedule.id, outing)
				return { showing: submitedShowing, outing, schedule: updatedSchedule }
			}
		} catch (error) {
			console.error('Error creating showing: ', error.message)
		}
	} else {
		return getShowing(showingRef.id)
	}
}

// GET SHOWING
export const getShowing = async id => {
	if (!id) return new Error('Id required')

	try {
		const showingDocument = await db.collection('showings').doc(id).get()
		return { id, ...showingDocument.data() }
	} catch (error) {
		console.error('Error fetching showing: ', error.message)
	}
}

// UPDATE SHOWING
export const updateShowing = async (id, data, checkAvail = false) => {
	const { createdAt, status } = await getShowing(id)
	const showingModel = getShowingModel({ ...data, id, createdAt, status })

	if (data.agent && checkAvail) {
		const { isAvailable } = await checkSchedule(data.agent.id, showingModel)
		if (!isAvailable) throw new Error('Agent is unavailable at this time')
	}

	try {
		await db.collection('showings').doc(id).update(showingModel)
		return getShowing(id)
	} catch (error) {
		console.error('Error updating showing: ', error.message)
	}

	return getShowing(id)
}

export const updateShowingOutingId = async (id, outingId) => {
	try {
		await db.collection('showings').doc(id).update({ outingId })
		return getShowing(id)
	} catch (error) {
		console.error('Error updating showing: ', error.message)
	}

	return getShowing(id)
}
