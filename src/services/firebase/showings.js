import { format, getUnixTime } from 'date-fns'
import { auth, db, firebase } from './index'
import { handleOutingCreation } from './outings'
import { checkSchedule, createSchedule, updateScheduleOutings } from './schedules'

// CREATE SHOWING
export const createShowing = async showing => {
	if (!showing) throw new Error('Showing information required')
	const { data, agent, lead, places } = showing

	let showingRef
	if (!showing.id) showingRef = db.collection('showings').doc()
	else showingRef = db.collection('showings').doc(showing.id)

	const showingSnapshot = await showingRef.get()
	const showingDate = new Date(`${data.date} ${data.start_time}`)

	const partialShowing = {
		id: showingRef.id,
		date: { seconds: getUnixTime(showingDate), string: format(showingDate, 'MM/dd/yyyy') },
		startTime: data.start_time,
		endTime: data.end_time,
		leadId: lead.id,
	}

	const { isAvailable, schedule } = await checkSchedule(agent?.id, partialShowing)
	console.log({ isAvailable, schedule })
	if (!isAvailable) throw new Error('Agent is unavailable at this time')

	if (!showingSnapshot.exists) {
		const createdAt = firebase.firestore.FieldValue.serverTimestamp()
		const showingModel = {
			id: showingRef.id,
			agent: agent ? { id: agent.id, displayName: agent.displayName, phoneNumber: agent.phoneNumber } : 'unassigned',
			lead: {
				id: lead.id,
				displayName: lead.displayName,
				phoneNumber: lead.phoneNumber,
			},
			createdBy: auth.currentUser.uid,
			createdAt,
			places,
			propertyDetails: {
				address: data.formatted_address,
				bathrooms: data.bathrooms,
				bedrooms: data.bedrooms,
				price: data.price,
				sqft: data.sqft,
				constructionAge: data.construction_age || '',
				daysOnMarket: data.days_on_market || '',
				flooded: data.flooded || '',
				financingConsidered: data.financing_considered || '',
				maintenanceFee: data.maintenance_fee || '',
				otherFees: data.other_fees || '',
				taxRate: data.tax_rate || '',
				city: places.locality || '',
				state: places.administrative_area_level_1 || '',
				county: places.administrative_area_level_2 || '',
				neighborhood: places.neighborhood || '',
				zipCode: places.postal_code,
			},
			date: { seconds: getUnixTime(showingDate), string: format(showingDate, 'MM/dd/yyyy') },
			startTime: data.start_time,
			endTime: data.end_time,
			status: 'pending',
		}

		try {
			await showingRef.set(showingModel)
			const submitedShowing = await getShowing(showingRef.id)
			const outing = await handleOutingCreation(submitedShowing)
			await updateShowing(showingRef.id, { ...submitedShowing, outingId: outing.id })

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

// EDIT SHOWING
export const updateShowing = async (id, data, checkAvail = false) => {
	const showingDate = new Date(data.date.string)
	const partialShowing = {
		id,
		date: { seconds: getUnixTime(showingDate), string: format(showingDate, 'MM/dd/yyyy') },
		startTime: data.startTime,
		endTime: data.endTime,
		leadId: data.lead.id,
	}

	if (data.agent && checkAvail) {
		const { isAvailable } = await checkSchedule(data.agent.id, partialShowing)
		if (!isAvailable) throw new Error('Agent is unavailable at this time')
	}

	try {
		await db
			.collection('showings')
			.doc(id)
			.update({ ...data })
		return getShowing(id)
	} catch (error) {
		console.error('Error updating showing: ', error.message)
	}

	return getShowing(id)
}
