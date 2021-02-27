import { matchLength } from '@utils/index'
import { fromUnixTime, isAfter, isBefore, isEqual } from 'date-fns'
import { db, firebase } from '.'
import { getOuting } from './outings'
import { getShowing } from './showings'

export const createSchedule = async (agentId, outing) => {
	if (!outing) throw new Error('Showing required')

	const scheduleRef = db.collection('schedules').doc()
	const scheduleSnap = await scheduleRef.get()
	const scheduleModel = {
		id: scheduleRef.id,
		date: outing.date,
		outings: firebase.firestore.FieldValue.arrayUnion(outing.id),
		agentId
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

export const checkAgentSchedule = async (agentId = null, showing) => {
	const { date } = showing
	console.log('checkAgentSchedule: Ln 33', { showing })
	let isAvailable = true
	if (!agentId) return { isAvailable, schedule: null }

	const schedulesRef = db.collection('schedules').where('agentId', '==', agentId).where('date.string', '==', date.string)
	const schedulesSnapshot = await schedulesRef.get()
	const isEmpty = schedulesSnapshot.empty
	const schedule = schedulesSnapshot.docs[0]?.data() || null

	let adjecentOuting
	if (!isEmpty) {
		const outings = schedule.outings

		for (let i = 0; i < outings.length; i++) {
			const id = outings[i]
			const currOuting = await getOuting(id)

			if (!isOutOfBound(showing, currOuting)) {
				console.log('checkAgentSchedule: Ln 56 - OUTING CONFLICT WITH REQUESTED TIMES', currOuting)
				isAvailable = false
			}

			if (isAdjecentToExistingOuting(showing, currOuting)) {
				if (isSameLead(showing, currOuting)) {
					adjecentOuting = currOuting
				}
			}
		}
	} else {
		console.log('checkAgentSchedule: Ln 112 - HAS NO SCHEDULE')
		return { isAvailable, schedule }
	}

	return { isAvailable, schedule, adjecentOuting }
}

function isOutOfBound(newShowing, showing) {
	if (newShowing.id === showing.id) return true

	console.log('isOutOfBound: Ln 132', {
		requestedPreStartTime: fromUnixTime(newShowing.preStartTime),
		requestedPreEndTime: fromUnixTime(newShowing.preEndTime),
		againstPreStartTime: fromUnixTime(showing.preStartTime),
		againstPreEndTime: fromUnixTime(showing.preEndTime)
	})

	return (
		isAfter(newShowing.preStartTime, showing.preEndTime) ||
		isBefore(newShowing.preEndTime, showing.preStartTime) ||
		isEqual(newShowing.preEndTime, showing.preStartTime) ||
		isEqual(newShowing.preStartTime, showing.preEndTime)
	)
}

function isAdjecentToExistingOuting(showing, outing) {
	return isEqual(showing.preStartTime, outing.preEndTime) || isEqual(showing.preEndTime, outing.preStartTime)
}

function isSameLead(showing, outing) {
	return showing.leadId === outing.leadId
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

	const scheduleSnapshot = await db.collection('schedules').doc(id).get()
	const scheduleDoc = scheduleSnapshot.data()
	const [hasOuting] = scheduleDoc.outings.filter(elem => elem.id === outing.id)

	try {
		if (!hasOuting) {
			await db
				.collection('schedules')
				.doc(id)
				.update({ outings: firebase.firestore.FieldValue.arrayUnion(outing.id) })
		}
		return getSchedule(id)
	} catch (error) {
		console.error('Error updating team: ', error.message)
	}
}
