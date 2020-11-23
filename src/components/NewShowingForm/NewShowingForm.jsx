import styled, { css } from 'styled-components'
import { useCallback, useEffect, useState } from 'react'
import { Autocomplete } from '@react-google-maps/api'

import { useNavigation } from '../../contexts/navigation'

import { Button, ErrorMessage, FieldGroup, Form, Label, SettingsInput, Textarea } from '../../styles/styled-components'
import { capitalize, formatPhoneNumber, getAddress } from '../../utils'
import { useDispatch } from '../../contexts/dispatch'
import { SearchProvider, useSearch } from '../../contexts/search/SearchProvider'
import { Configure, Hits, SearchBox } from '../Search'
import { useFirestoreSub } from '../../hooks'
import { format } from 'date-fns'
import { createShowing, updateShowing } from '../../services/firebase/showings'

export const NewShowingForm = () => {
	const { toggleNewShowingModal } = useNavigation()
	const { placeToBeAdded, setPlaceToBeAdded, editShowing, setEditShowing } = useDispatch()

	const [autocomplete, setAutocomplete] = useState(null)
	const [selectedAgent, setSelectedAgent] = useState(null)
	const [selectedLead, setSelectedLead] = useState(null)
	const [formData, setFormData] = useState({})
	const [formErrors, setFormErrors] = useState({})
	const [submitError, setSubmitError] = useState(null)
	const [stage, setStage] = useState(1)

	const onPlacesLoad = useCallback(autocomplete => {
		setAutocomplete(autocomplete)
	})

	const onPlaceChanged = () => {
		const place = autocomplete.getPlace()

		setPlaceToBeAdded(place)
	}

	const [agents] = useFirestoreSub('users', {
		where: ['role', '==', 'agent'],
	})

	const [leads] = useFirestoreSub('leads')

	useEffect(() => {
		if (editShowing) {
			if (editShowing.agent !== 'unassigned') setSelectedAgent(editShowing.agent)
			setSelectedLead(editShowing.lead)
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
				lead_name: editShowing.lead.displayName,
				phone_number: formatPhoneNumber(editShowing.lead.phoneNumber, '($2) $3-$4'),
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
	}, [editShowing])

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

	const validateForm = data => {
		const required = [
			'formatted_address',
			'price',
			'sqft',
			'phone_number',
			'lead_name',
			'bedrooms',
			'bathrooms',
			'date',
			'start_time',
			'end_time',
		]

		const difference = required.filter(x => !data[x] && data[x]?.legnth !== 0)

		const errors = difference.map(key => {
			return {
				[key]: {
					message: `${key
						.replace('_', ' ')
						.split(' ')
						.map((word, i) => (i === 0 ? capitalize(word) : word))
						.join(' ')} is required`,
				},
			}
		})

		if (errors.length > 0) {
			setFormErrors(errors)
			return false
		} else {
			setFormErrors({})
			return true
		}
	}

	const onSubmit = async data => {
		const valid = validateForm(data)
		const dataObj = {
			data,
			places: getAddress(placeToBeAdded),
			placeToBeAdded,
			agent: selectedAgent,
			lead: selectedLead,
		}

		try {
			if (valid && !editShowing) {
				const newShowing = await createShowing(dataObj)
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
					<>
						<Section>
							<h2>Lead Details</h2>
							{!selectedLead ? (
								<SearchProvider data={leads}>
									<Configure
										filters={['displayName', 'phoneNumber']}
										display={false}
										hitsPerPage={3}
										displayQuery="displayName"
									/>
									<SearchBox label="Name" />
									<Hits hitComponent={Hit} selected={selectedLead} setSelected={setSelectedLead} />
								</SearchProvider>
							) : (
								<SingleFieldGroup>
									<Label htmlFor="lead_name">Name</Label>
									<SettingsInput
										type="text"
										name="lead_name"
										value={formData.lead_name}
										onChange={() => setSelectedLead(null)}
										required
									/>
								</SingleFieldGroup>
							)}
							<SingleFieldGroup>
								<Label htmlFor="phone_number">Phone number</Label>
								<SettingsInput
									type="text"
									name="phone_number"
									value={formData.phone_number}
									onChange={e => handleChange(e)}
									required
								/>
							</SingleFieldGroup>
						</Section>

						<Section>
							<h2>Property Details</h2>
							{!placeToBeAdded ? (
								<Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onPlacesLoad}>
									<SingleFieldGroup>
										<Label htmlFor="formatted_address">Address</Label>
										<SettingsInput
											type="text"
											placeholder="🔍  Search for an address"
											name="formatted_address"
											id="formatted_address"
											value={formData.formatted_address}
											onChange={e => handleChange(e)}
										/>
									</SingleFieldGroup>
								</Autocomplete>
							) : (
								<SingleFieldGroup>
									<Label htmlFor="formatted_address">Address</Label>
									<SettingsInput
										type="text"
										name="formatted_address"
										value={formData.formatted_address}
										onChange={e => handleChange(e)}
										required
									/>
								</SingleFieldGroup>
							)}
							<Col>
								<SingleFieldGroup>
									<Label htmlFor="price">Price</Label>
									<SettingsInput
										type="text"
										name="price"
										value={formData.price}
										onChange={e => handleChange(e)}
										required
									/>
								</SingleFieldGroup>
								<SingleFieldGroup>
									<Label htmlFor="sqft">Sqft</Label>
									<SettingsInput
										type="text"
										name="sqft"
										value={formData.sqft}
										onChange={e => handleChange(e)}
										required
									/>
								</SingleFieldGroup>
							</Col>
							<Col>
								<SingleFieldGroup>
									<Label htmlFor="bedrooms">Bedrooms</Label>
									<SettingsInput
										type="number"
										name="bedrooms"
										value={formData.bedrooms}
										onChange={e => handleChange(e)}
										required
									/>
								</SingleFieldGroup>
								<SingleFieldGroup>
									<Label htmlFor="bathrooms">Bathrooms</Label>
									<SettingsInput
										type="number"
										name="bathrooms"
										value={formData.bathrooms}
										onChange={e => handleChange(e)}
										required
									/>
								</SingleFieldGroup>
							</Col>
						</Section>
					</>
				) : null}
				{stage === 2 ? (
					<>
						<Section>
							<h2>Additional Property Details</h2>
							<Col>
								<SingleFieldGroup>
									<Label htmlFor="construction_age">Age of construction</Label>
									<SettingsInput
										type="text"
										name="construction_age"
										value={formData.construction_age}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
								<SingleFieldGroup>
									<Label htmlFor="days_on_market">Days on market</Label>
									<SettingsInput
										type="text"
										name="days_on_market"
										value={formData.days_on_market}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
							</Col>

							<Col>
								<SingleFieldGroup>
									<Label htmlFor="financing_considered">Financing considered</Label>
									<SettingsInput
										type="text"
										name="financing_considered"
										value={formData.financing_considered}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
								<SingleFieldGroup>
									<Label htmlFor="tax_rate">Tax rate</Label>
									<SettingsInput
										type="text"
										name="tax_rate"
										value={formData.tax_rate}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
							</Col>
							<Col>
								<SingleFieldGroup>
									<Label htmlFor="maintenance_fee">Maintenance fee</Label>
									<SettingsInput
										type="text"
										name="maintenance_fee"
										value={formData.maintenance_fee}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
								<SingleFieldGroup>
									<Label htmlFor="other_fees">Other fees</Label>
									<SettingsInput
										type="text"
										name="other_fees"
										value={formData.other_fees}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
							</Col>
							<Col>
								<SingleFieldGroup>
									<Label htmlFor="flooded">Flooded</Label>
									<SettingsInput
										type="text"
										name="flooded"
										value={formData.flooded}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
							</Col>
						</Section>
					</>
				) : null}

				{stage === 3 ? (
					<>
						<Section>
							<h2>Assignment</h2>

							<SingleFieldGroup>
								<Label htmlFor="date">Date</Label>
								<SettingsInput
									type="date"
									name="date"
									value={formData.date}
									onChange={e => handleChange(e)}
									required
								/>
							</SingleFieldGroup>
							<Col>
								<SingleFieldGroup>
									<Label htmlFor="start_time">Start time</Label>
									<SettingsInput
										type="time"
										name="start_time"
										step="300"
										min="09:00"
										max="19:30"
										value={formData.start_time}
										onChange={e => handleChange(e)}
										required
									/>
								</SingleFieldGroup>
								<SingleFieldGroup>
									<Label htmlFor="end_time">End time</Label>
									<SettingsInput
										type="time"
										name="end_time"
										step="300"
										min="09:00"
										max="19:30"
										value={formData.end_time}
										onChange={e => handleChange(e)}
										required
									/>
								</SingleFieldGroup>
							</Col>
							<SingleFieldGroup>
								<Label htmlFor="additional_notes">Additional notes</Label>
								<Textarea
									type="text"
									name="additional_notes"
									value={formData.additional_notes}
									onChange={e => handleChange(e)}
								/>
							</SingleFieldGroup>
							{!selectedAgent ? (
								<SearchProvider data={agents}>
									<Configure
										filters={['displayName', 'email']}
										display={false}
										hitsPerPage={3}
										displayQuery="displayName"
									/>
									<SearchBox label="Agent" />
									<Hits hitComponent={Hit} setSelected={setSelectedAgent} selected={selectedAgent} />
								</SearchProvider>
							) : (
								<SingleFieldGroup>
									<Label htmlFor="agent_name">Agent</Label>
									<SettingsInput
										type="text"
										name="agent_name"
										value={selectedAgent.displayName}
										onChange={e => setSelectedAgent(null)}
										required
									/>
								</SingleFieldGroup>
							)}
							{submitError ? <ModifiedErrorMessage>{submitError.message}</ModifiedErrorMessage> : null}
						</Section>
					</>
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
							{stage < 3 ? 'Next' : 'Add'}
						</Button>
					</div>
				</ButtonContainer>
			</ModifiedForm>
		</Container>
	)
}

const Hit = ({ hit, setSelected, selected }) => {
	const isCardSelected = selected?.id === hit.id
	const { setSelectedHit } = useSearch()

	const handleClick = hit => {
		setSelected(hit)
		setSelectedHit(hit)
	}

	return (
		<UserCard isCardSelected={isCardSelected} onClick={() => handleClick(hit)}>
			<Name>{hit.displayName}</Name>
			{hit.phoneNumber ? <Name>{formatPhoneNumber(hit.phoneNumber, '($2) $3-$4')}</Name> : null}
		</UserCard>
	)
}

const ModifiedErrorMessage = styled(ErrorMessage)`
	position: static;
	margin-top: 1rem;
	font-size: 0.9rem;
`

const UserCard = styled.div`
	background: white;
	border-radius: 4px;
	padding: 8px;
	margin-bottom: 8px;
	display: flex;
	justify-content: space-between;
	font-size: 14px;

	cursor: pointer;

	&:hover {
		background: ${({ theme }) => theme.colors.bg.hover};
	}

	${({ isCardSelected }) =>
		isCardSelected &&
		css`
			background: ${({ theme }) => theme.colors.bg.hover};
		`}
`

const Name = styled.span``

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

const SingleFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`

const Section = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 2rem;

	h2 {
		margin-bottom: 12px;
		font-size: 16px;
		font-weight: 300;
	}
`

const Col = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 32px;
`
