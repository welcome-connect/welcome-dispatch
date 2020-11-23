import { db, firebase } from '.'
import { stringTimeComparison } from '../../utils'
import { getOuting } from './outings'

export const createSchedule = async (agentId, outing) => {
	if (!outing) throw new Error('Showing required')

	const partialOuting = {
		id: outing.id,
		endLastShowing: outing.endLastShowing,
		startFirstShowing: outing.startFirstShowing,
		agentId: outing.agent?.id || 'unassigned',
		leadId: outing.lead.id,
	}

	const scheduleRef = db.collection('schedules').doc()
	const scheduleSnap = await scheduleRef.get()
	const scheduleModel = {
		id: scheduleRef.id,
		date: outing.date,
		outings: firebase.firestore.FieldValue.arrayUnion(partialOuting),
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

export const checkSchedule = async (agentId = null, showing) => {
	const { date, startTime, endTime, id: showingId } = showing
	let isAvailable = true
	if (!agentId) return { isAvailable, schedule: null }

	const schedulesRef = db.collection('schedules').where('agentId', '==', agentId).where('date.string', '==', date.string)
	const schedulesSnapshot = await schedulesRef.get()
	const isEmpty = schedulesSnapshot.empty
	const schedule = schedulesSnapshot.docs[0]?.data() || null

	if (!isEmpty) {
		const outings = schedule.outings

		for (let i = 0; i < outings.length; i++) {
			const { id, leadId } = outings[i]
			const outing = await getOuting(id)

			if (outing.showings.indexOf(showingId) > -1 || leadId !== showing.leadId) {
				if (
					stringTimeComparison(startTime, outing.startFirstShowing) >= 0 &&
					stringTimeComparison(startTime, outing.endLastShowing) <= 0
				) {
					isAvailable = false
				}

				if (
					stringTimeComparison(endTime, outing.startFirstShowing) >= 0 &&
					stringTimeComparison(endTime, outing.endLastShowing) <= 0
				) {
					isAvailable = false
				}

				if (
					stringTimeComparison(startTime, outing.startFirstShowing) <= 0 &&
					stringTimeComparison(endTime, outing.endLastShowing) >= 0
				) {
					isAvailable = false
				}
			}
		}
	}

	return { isAvailable, schedule }
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

export const updateScheduleOutings = async (id, outing) => {
	if (!id) throw new Error('Schedule id required')

	const partialOuting = {
		id: outing.id,
		endLastShowing: outing.endLastShowing,
		startFirstShowing: outing.startFirstShowing,
		agentId: outing.agent?.id || 'unassigned',
		leadId: outing.lead.id,
	}

	const scheduleSnapshot = await db.collection('schedules').doc(id).get()
	const scheduleDoc = scheduleSnapshot.data()
	const [hasOuting] = scheduleDoc.outings.filter(elem => elem.id === outing.id)

	const scheduleModel = {
		id,
		date: outing.date,
		outings: firebase.firestore.FieldValue.arrayUnion(partialOuting),
		agentId: outing.agent.id,
	}

	try {
		if (!hasOuting) {
			await db.collection('schedules').doc(id).update(scheduleModel)
		}
		return getSchedule(id)
	} catch (error) {
		console.error('Error updating team: ', error.message)
	}
}
