import { db, firebase } from '.'
import { stringTimeComparison } from '../../utils'
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
			const id = outings[i]
			const outing = await getOuting(id)

			if (
				isOutOfBound({ startTime, endTime }, { startTime: outing.startFirstShowing, endTime: outing.endLastShowing })
			) {
				return { isAvailable, schedule }
			}

			if (outing.showings.indexOf(showingId) > -1) {
				for (let j = 0; j < outing.showings.length; j++) {
					const currShowing = await getShowing(outing.showings[j])
					if (currShowing.id === showingId) continue

					if (
						isOutOfBound(
							{ startTime, endTime },
							{ startTime: currShowing.startTime, endTime: currShowing.endTime },
						)
					) {
						return { isAvailable, schedule }
					}
				}
			}
		}
	} else {
		return { isAvailable, schedule }
	}

	isAvailable = false
	return { isAvailable, schedule }
}

function isOutOfBound(newShowing, currShowing) {
	return (
		stringTimeComparison(newShowing.startTime, currShowing.endTime) >= 0 ||
		stringTimeComparison(newShowing.endTime, currShowing.startTime) <= 0
	)
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
