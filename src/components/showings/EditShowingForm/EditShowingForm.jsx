import { Button } from '@styles/styled-components'
import { formatPhoneNumber } from '@utils/formatPhoneNumber'
import { format, fromUnixTime, getUnixTime } from 'date-fns'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { EditShowingStageOne } from './EditShowingStageOne'
import { StageTwo } from '@components/schedule/NewShowingForm/StageTwo'
import { EditShowingStageThree } from './EdirShowingStageThree'
import { getShowing, updateShowing, updateShowingAgent } from '@services/firebase/showings'
import { functions } from '@services/firebase'

export function EditShowingForm({ showing, handleClose }) {
	const [formData, setFormData] = useState({})
	const [changedData, setChangedData] = useState({})
	const [stage, setStage] = useState(1)
	const [agent, setAgent] = useState(null)
	const [formErrors, setFormErrors] = useState(null)
	const [submitError, setSubmitError] = useState(null)

	function handleChange(e) {
		setFormData({ ...formData, [e.target.name]: e.target.value })
		setChangedData({ ...changedData, [e.target.name]: e.target.value })
	}

	async function onSubmit() {
		const isUpdatingAgent = changedData.agentId

		if (changedData.toMarketDate) {
			const toMarketDate = new Date(`${changedData.toMarketDate}`)
			changedData.toMarketDate = {
				seconds: getUnixTime(toMarketDate),
				string: format(toMarketDate, 'MM/dd/yyyy')
			}
		}

		if (isUpdatingAgent) {
			if (showing.status === 'pending') {
				await updateShowingAgent(showing.id, changedData.agentId)
				await updateShowing(showing.id, changedData)
				const { agentId, outingId, id } = await getShowing(showing.id)
				const sendSMS = functions.httpsCallable('callSendSMS')
				await sendSMS({ agentId, outingId, showingId: id })
			} else {
				setSubmitError({
					message: `Agent cannot be reassigned to 'in-progress' showings - Agent must cancel showing themselves`
				})
				return
			}
		} else {
			await updateShowing(showing.id, changedData)
		}

		handleClose()
	}

	function handleStage(e) {
		e.preventDefault()
		if (stage === 3) onSubmit(formData)
		else setStage(stage + 1)
	}

	useEffect(
		function setInitialFormState() {
			setFormData({
				leadName: showing.leadName,
				phoneNumber: formatPhoneNumber(showing.leadPhoneNumber, '($2) $3-$4'),
				address: showing.address,
				price: showing.price,
				sqft: showing.sqft,
				bedrooms: showing.bedrooms,
				bathrooms: showing.bathrooms,
				builtIn: showing.builtIn || '',
				toMarketDate: showing.toMarketDate?.seconds
					? format(new Date(showing.toMarketDate.string), 'yyyy-MM-dd')
					: '',
				financingConsidered: showing.financingConsidered || '',
				taxRate: showing.taxRate || '',
				maintenanceFee: showing.maintenanceFee || '',
				otherFees: showing.otherFees || '',
				flooded: showing.flooded || '',
				date: format(new Date(showing.date.string), 'yyyy-MM-dd'),
				preStartTime: format(fromUnixTime(showing.preStartTime), 'HH:mm'),
				preEndTime: format(fromUnixTime(showing.preEndTime), 'HH:mm'),
				additionalNotes: showing.additionalNotes || ''
			})

			if (showing.agentId !== 'unassigned') {
				setAgent({ displayName: showing.agentName, id: showing.agentId, phoneNumber: showing.agentPhoneNumber })
			}
		},
		[showing]
	)

	console.log({ formData, showing, changedData, agent })

	return (
		<Container>
			<h1>Edit Showing</h1>
			{stage === 1 ? <EditShowingStageOne formData={formData} handleChange={handleChange} /> : null}
			{stage === 2 ? <StageTwo formData={formData} handleChange={handleChange} /> : null}
			{stage === 3 ? (
				<EditShowingStageThree
					formData={formData}
					handleChange={handleChange}
					agent={agent}
					setAgent={setAgent}
					submitError={submitError}
					formErrors={formErrors}
					setChangedData={setChangedData}
				/>
			) : null}

			<ButtonRow>
				{stage === 2 || stage === 3 ? (
					<Button isPrimary type="button" onClick={() => setStage(stage - 1)}>
						Back
					</Button>
				) : (
					<div />
				)}
				<Button isPrimary type="submit" onClick={handleStage}>
					{stage < 3 ? 'Next' : 'Save'}
				</Button>
			</ButtonRow>
		</Container>
	)
}

const Container = styled.form`
	height: min(700px, 90vh);
	width: 700px;
	padding: 0.5rem 1rem;
	position: relative;

	h1 {
		margin-bottom: 12px;
		font-weight: 600;
	}
`

const ButtonRow = styled.div`
	bottom: 12px;
	width: calc(100% - 32px);
	position: absolute;
	display: flex;
	justify-content: space-between;

	div {
		button {
			margin-left: 32px;
		}
	}
`
