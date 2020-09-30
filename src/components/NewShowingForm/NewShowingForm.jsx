import styled, { css } from 'styled-components'
import { useForm } from 'react-hook-form'

import { useNavigation } from '../../contexts/navigation'

import {
	Button,
	ErrorMessage,
	FieldGroup,
	Form,
	Label,
	SettingsInput,
	Textarea,
} from '../../styles/styled-components'
import { formatPhoneNumber, getAddress } from '../../utils'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from '../../contexts/dispatch'
import { Autocomplete } from '@react-google-maps/api'
import { SearchProvider } from '../../contexts/search/SearchProvider'
import { Configure, Hits, SearchBox } from '../Search'
import { useFirestoreSub } from '../../hooks'

export const NewShowingForm = () => {
	const { toggleNewShowingModal } = useNavigation()
	const { placeToBeAdded, setPlaceToBeAdded } = useDispatch()

	const [autocomplete, setAutocomplete] = useState(null)
	const [selected, setSelected] = useState(null)
	const [formData, setFormData] = useState({})
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

	useEffect(() => {
		if (placeToBeAdded) {
			setFormData({
				...formData,
				formatted_address: getAddress(placeToBeAdded).formatted_address,
			})
		}
	}, [])

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleStage = e => {
		e.preventDefault()
		if (stage === 3) onSubmit(formData)
		else setStage(stage + 1)
	}

	const onCancel = () => {
		toggleNewShowingModal()
	}

	const onSubmit = data => {
		console.log(data)
		toggleNewShowingModal()
		setPlaceToBeAdded(null)
	}

	console.log({ formData })

	return (
		<Container>
			<h1>New Showing</h1>

			<ModifiedForm>
				{stage === 1 ? (
					<>
						<Section>
							<h2>Lead Details</h2>
							<Col>
								<SingleFieldGroup>
									<Label htmlFor="first_name">First name</Label>
									<SettingsInput
										type="text"
										name="first_name"
										value={formData.first_name}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
								<SingleFieldGroup>
									<Label htmlFor="last_name">Last name</Label>
									<SettingsInput
										type="text"
										name="last_name"
										value={formData.last_name}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
							</Col>
							<SingleFieldGroup>
								<Label htmlFor="phone_number">Phone number</Label>
								<SettingsInput
									type="text"
									name="phone_number"
									value={formData.phone_number}
									onChange={e => handleChange(e)}
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
									/>
								</SingleFieldGroup>
								<SingleFieldGroup>
									<Label htmlFor="sqft">Sqft</Label>
									<SettingsInput
										type="text"
										name="sqft"
										value={formData.sqft}
										onChange={e => handleChange(e)}
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
									/>
								</SingleFieldGroup>
								<SingleFieldGroup>
									<Label htmlFor="bathrooms">Bathrooms</Label>
									<SettingsInput
										type="number"
										name="bathrooms"
										value={formData.bathrooms}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
							</Col>
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
				{stage === 2 ? (
					<>
						<Section>
							<h2>Property Financial Details</h2>
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
								/>
							</SingleFieldGroup>
							<Col>
								<SingleFieldGroup>
									<Label htmlFor="start_time">Start time</Label>
									<SettingsInput
										type="time"
										name="start_time"
										value={formData.start_time}
										onChange={e => handleChange(e)}
									/>
								</SingleFieldGroup>
								<SingleFieldGroup>
									<Label htmlFor="end_time">End time</Label>
									<SettingsInput
										type="time"
										name="end_time"
										value={formData.end_time}
										onChange={e => handleChange(e)}
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
							<SearchProvider data={agents}>
								<Configure filters={['displayName', 'email']} display={false} hitsPerPage={3} />
								<SearchBox label="Search users" />
								<Hits hitComponent={Hit} setSelected={setSelected} selected={selected} />
							</SearchProvider>
						</Section>{' '}
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
	const handleClick = hit => {
		setSelected(hit)
	}

	return (
		<UserCard isCardSelected={isCardSelected} onClick={() => handleClick(hit)}>
			<Name>{hit.displayName}</Name>
		</UserCard>
	)
}

const UserCard = styled.div`
	background: white;
	border-radius: 4px;
	padding: 8px;
	margin-bottom: 8px;

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

const ModifiedErrorMessage = styled(ErrorMessage)`
	position: static;
	font-size: 1rem;
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
