import { auth } from '@services/firebase'
import { format, getUnixTime } from 'date-fns'

export const getShowingModel = showing => {
	console.log({ showing })
	const { data, agent, lead, places, status, createdAt, id } = showing

	const showingDate = new Date(`${data.date} ${data.start_time}`)

	const showingModel = {
		id,
		agentId: agent ? agent.id : 'unassigned',
		leadId: lead.id,
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
			add_notes: data.additional_notes || '',
		},
		date: { seconds: getUnixTime(showingDate), string: format(showingDate, 'MM/dd/yyyy') },
		startTime: data.start_time,
		endTime: data.end_time,
		status,
	}

	return showingModel
}
