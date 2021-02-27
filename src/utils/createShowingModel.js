import { auth } from '@services/firebase'
import { format, getUnixTime } from 'date-fns'

export const createShowingModel = showing => {
	const { data, agent, lead, places, status, createdAt, id } = showing
	console.log({ showing })

	const showingDate = new Date(`${data.date} ${data.preStartTime}`)
	const preStartTime = new Date(`${data.date} ${data.preStartTime}`)
	const preEndTime = new Date(`${data.date} ${data.preEndTime}`)

	let toMarketDate
	if (data.toMarketDate) toMarketDate = new Date(`${data.toMarketDate}`)

	console.log({ toMarketDate })

	const showingModel = {}

	Object.entries(data).forEach(([key, value]) => {
		showingModel[key] = value
	})

	delete showingModel.leadName
	delete showingModel.agentName

	console.log({ showingModel })

	showingModel.id = id
	showingModel.agentId = agent ? agent.id : 'unassigned'
	showingModel.leadId = lead.id
	showingModel.createdBy = auth.currentUser.uid
	showingModel.createdAt = createdAt
	showingModel.places = places
	showingModel.date = { seconds: getUnixTime(showingDate), string: format(showingDate, 'MM/dd/yyyy') }
	showingModel.preStartTime = getUnixTime(preStartTime)
	showingModel.preEndTime = getUnixTime(preEndTime)
	showingModel.status = status

	if (data.toMarketDate) {
		showingModel.toMarketDate = { seconds: getUnixTime(toMarketDate), string: format(toMarketDate, 'MM/dd/yyyy') }
	}

	console.log({ showingModel })
	return showingModel
}
