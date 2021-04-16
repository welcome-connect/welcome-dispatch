import { createShowingModel } from '@utils/index'
import { db, firebase } from './index'
import { createOuting, addShowingToOuting } from './outings'
import { checkAgentSchedule, createSchedule, updateScheduleOutings } from './schedules'

// CREATE SHOWING
export const createShowing = async showing => {
	if (!showing) throw new Error('Showing information required')
	const { agent } = showing

	const showingRef = db.collection('showings').doc()
	const createdAt = firebase.firestore.FieldValue.serverTimestamp()
	const showingModel = createShowingModel({ ...showing, createdAt, id: showingRef.id })

	const { isAvailable, schedule, adjecentOuting } = await checkAgentSchedule(agent?.id, showingModel)
	console.log({ isAvailable, schedule })
	if (!isAvailable) throw new Error('Agent is unavailable at this time')

	const showingSnapshot = await showingRef.get()

	if (!showingSnapshot.exists) {
		try {
			await showingRef.set(showingModel)
			const submitedShowing = await getShowing(showingRef.id)
			console.log('createShowing: Ln 25 - NEW SHOWING', submitedShowing)

			if (!schedule && !agent) {
				return { showing: submitedShowing }
			}

			let newOuting
			if (!adjecentOuting) {
				const { agentId, leadId, date, preStartTime, preEndTime } = submitedShowing
				const newOutingModel = {
					agentId,
					leadId,
					date,
					preStartTime,
					preEndTime,
					showings: [submitedShowing.id],
					cancelledShowings: [],
					completedShowings: [],
					status: 'pending'
				}
				newOuting = await createOuting(newOutingModel)
			} else {
				newOuting = await addShowingToOuting(submitedShowing, adjecentOuting)
			}

			console.log('createShowing: Ln 48 - newOuting:', newOuting)
			await updateShowingOutingId(showingRef.id, newOuting.id)

			if (!schedule && agent) {
				const newSchedule = await createSchedule(agent.id, newOuting)
				return { showing: submitedShowing, newOuting, schedule: newSchedule }
			}

			if (schedule && agent) {
				const updatedSchedule = await updateScheduleOutings(schedule.id, newOuting)
				return { showing: submitedShowing, newOuting, schedule: updatedSchedule }
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

	if (data.agent && checkAvail) {
		const { isAvailable } = await checkAgentSchedule(data.agent.id, showingModel)
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

export function deleteShowing(showingId) {
	return db
		.collection('showings')
		.doc(showingId)
		.delete()
		.then(() => {
			return { success: true }
		})
		.catch(error => console.error('Error removing showing document', error))
}
