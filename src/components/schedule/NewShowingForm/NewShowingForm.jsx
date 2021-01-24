import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

import { useNavigation } from '@contexts/navigation'
import { useDispatch } from '@contexts/dispatch'

import { formatPhoneNumber, getAddress, validateShowingForm } from '@utils/index'
import { createShowing, updateShowing } from '@services/firebase/showings'

import { Button, Form } from '@styles/styled-components'
import { getLead } from '@services/firebase/leads'
import { getUserDocument } from '@services/firebase'
import { StageOne } from './StageOne'
import { StageTwo } from './StageTwo'
import { StageThree } from './StageThree'

export const NewShowingForm = () => {
	const { toggleNewShowingModal } = useNavigation()
	const {
		placeToBeAdded,
		setPlaceToBeAdded,
		editShowing,
		setEditShowing,
		editShowingLead,
		editShowingAgent,
		setEditShowingLead,
		setEditShowingAgent,
	} = useDispatch()

	const [selectedAgent, setSelectedAgent] = useState(null)
	const [selectedLead, setSelectedLead] = useState(null)
	const [formData, setFormData] = useState({})
	const [formErrors, setFormErrors] = useState({})
	const [submitError, setSubmitError] = useState(null)
	const [stage, setStage] = useState(1)

	useEffect(() => {
		if (editShowing) {
			const asyncFetch = async () => {
				const l = await getLead(editShowing.leadId)
				const a = await getUserDocument(editShowing.agentId)
				setEditShowingLead(l)
				setEditShowingAgent(a)
			}

			asyncFetch()
		}
	}, [editShowing])

	useEffect(() => {
		if (editShowing && editShowingLead && editShowingAgent) {
			if (editShowingAgent !== 'unassigned') setSelectedAgent(editShowingAgent)
			setSelectedLead(editShowingLead)
			setPlaceToBeAdded({
				...editShowing.places,
				geometry: {
					location: {
						lat: () => editShowing.places.coords.lat,
						lng: () => editShowing.places.coords.lng,
					},
				},
				address_components: [],
			})
			setFormData({
				lead_name: editShowingLead.displayName,
				phone_number: formatPhoneNumber(editShowingLead.phoneNumber, '($2) $3-$4'),
				formatted_address: editShowing.propertyDetails.address,
				price: editShowing.propertyDetails.price,
				sqft: editShowing.propertyDetails.sqft,
				bedrooms: editShowing.propertyDetails.bedrooms,
				bathrooms: editShowing.propertyDetails.bathrooms,
				construction_age: editShowing.propertyDetails.constructionAge || '',
				days_on_market: editShowing.propertyDetails.daysOnMarket || '',
				financing_considered: editShowing.propertyDetails.financingConsidered || '',
				tax_rate: editShowing.propertyDetails.taxRate || '',
				maintenance_fee: editShowing.propertyDetails.maintenanceFee || '',
				other_fees: editShowing.propertyDetails.otherFees || '',
				flooded: editShowing.propertyDetails.flooded || '',
				date: format(new Date(editShowing.date.string), 'yyyy-MM-dd'),
				start_time: editShowing.startTime,
				end_time: editShowing.endTime,
			})
		}
	}, [editShowing, editShowingLead, editShowingAgent])

	useEffect(() => {
		if (!placeToBeAdded) {
			document.querySelector('#formatted_address')?.focus()
		} else {
			setFormData({
				...formData,
				formatted_address: getAddress(placeToBeAdded).formatted_address,
			})
		}
	}, [placeToBeAdded])

	useEffect(() => {
		if (!selectedLead) {
			document.querySelector("input[name='search']")?.focus()
		} else {
			setFormData({
				...formData,
				phone_number: formatPhoneNumber(selectedLead.phoneNumber, '($2) $3-$4'),
				lead_name: selectedLead.displayName,
			})
		}
	}, [selectedLead])

	useEffect(() => {
		if (!selectedAgent) {
			document.querySelector("input[name='search']")?.focus()
		} else {
			setFormData({
				...formData,
				agent_name: selectedAgent.displayName,
			})
		}
	}, [selectedAgent])

	useEffect(() => {
		if (formData.formatted_address === '') {
			setPlaceToBeAdded(null)
		}
	}, [formData.formatted_address])

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleStage = e => {
		e.preventDefault()
		if (stage === 3) onSubmit(formData)
		else setStage(stage + 1)
	}

	const onCancel = () => {
		setEditShowing(null)
		setPlaceToBeAdded(null)
		toggleNewShowingModal()
	}

	const onSubmit = async data => {
		const valid = validateShowingForm(data, setFormErrors)
		const dataObj = {
			data,
			places: getAddress(placeToBeAdded),
			placeToBeAdded,
			agent: selectedAgent,
			lead: selectedLead,
		}

		try {
			if (valid && !editShowing) {
				const newShowing = await createShowing({ ...dataObj, status: 'pending' })
				console.log({ newShowing })
				toggleNewShowingModal()
				setPlaceToBeAdded(null)
			}

			if (valid && editShowing) {
				const updatedShowing = await updateShowing(editShowing.id, dataObj)
				console.log({ updatedShowing })
				toggleNewShowingModal()
				setPlaceToBeAdded(null)
				setEditShowing(null)
			}
		} catch (error) {
			console.error('Error submitting showing: ', error.message)
			setSubmitError({ message: error.message })
		}
	}

	return (
		<Container>
			<h1>{editShowing ? `Edit Showing` : 'New Showing'}</h1>

			<ModifiedForm>
				{stage === 1 ? (
					<StageOne
						selectedLead={selectedLead}
						setSelectedLead={setSelectedLead}
						formData={formData}
						handleChange={handleChange}
					/>
				) : null}

				{stage === 2 ? <StageTwo formData={formData} handleChange={handleChange} /> : null}

				{stage === 3 ? (
					<StageThree
						formData={formData}
						handleChange={handleChange}
						setSelectedAgent={setSelectedAgent}
						selectedAgent={selectedAgent}
						submitError={submitError}
						formErrors={formErrors}
						setFormData={setFormData}
					/>
				) : null}

				<ButtonContainer>
					<Button isPrimary type="button" onClick={onCancel}>
						Cancel
					</Button>
					<div>
						{stage === 2 || stage === 3 ? (
							<Button isPrimary type="button" onClick={() => setStage(stage - 1)}>
								Back
							</Button>
						) : null}
						<Button isPrimary type="submit" onClick={handleStage}>
							{stage < 3 ? 'Next' : stage === 3 && !editShowing ? 'Add' : 'Save'}
						</Button>
					</div>
				</ButtonContainer>
			</ModifiedForm>
		</Container>
	)
}

const Container = styled.div`
	height: 100%;
	width: 100%;
	padding: 8px 32px;
	position: relative;
`

const ButtonContainer = styled.div`
	bottom: 12px;
	width: calc(100% - 64px);
	position: absolute;
	display: flex;
	justify-content: space-between;

	div {
		button {
			margin-left: 32px;
		}
	}
`

const ModifiedForm = styled(Form)`
	padding: 1rem 0;
	background-color: transparent;
	height: 85%;
	width: 100%;
	margin-top: 0.5rem;
	overflow: auto;
`
