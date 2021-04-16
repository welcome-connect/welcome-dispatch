import styled from 'styled-components'
import { SearchBox, Configure, Hits, UserHit } from '@components/common'
import { SearchProvider } from '@contexts/search/SearchProvider'
import { Autocomplete } from '@react-google-maps/api'
import { FieldGroup, Label, SettingsInput } from '@styles/styled-components'
import { useFirestoreSub } from '@hooks/useFirestoreSub'
import { useCallback, useState } from 'react'
import { useDispatch } from '@contexts/dispatch/DispatchProvider'

export function StageOne({ selectedLead, setSelectedLead, formData, handleChange }) {
	const [autocomplete, setAutocomplete] = useState(null)
	const { placeToBeAdded, setPlaceToBeAdded } = useDispatch()

	const onPlacesLoad = useCallback(autocomplete => {
		setAutocomplete(autocomplete)
	})

	const onPlaceChanged = () => {
		const place = autocomplete.getPlace()
		setPlaceToBeAdded(place)
	}

	const [leads] = useFirestoreSub('leads')

	return (
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
						<ul>
							<Hits hitComponent={UserHit} selected={selectedLead} setSelected={setSelectedLead} />
						</ul>
					</SearchProvider>
				) : (
					<SingleFieldGroup>
						<Label htmlFor="leadName">Name</Label>
						<SettingsInput
							type="text"
							name="leadName"
							value={formData.leadName}
							onChange={() => setSelectedLead(null)}
							required
						/>
					</SingleFieldGroup>
				)}
				<SingleFieldGroup>
					<Label htmlFor="phoneNumber">Phone number</Label>
					<SettingsInput
						type="text"
						name="phoneNumber"
						value={formData.phoneNumber}
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
							<Label htmlFor="address">Address</Label>
							<SettingsInput
								type="text"
								placeholder="🔍  Search for an address"
								name="address"
								id="address"
								value={formData.address}
								onChange={e => handleChange(e)}
							/>
						</SingleFieldGroup>
					</Autocomplete>
				) : (
					<SingleFieldGroup>
						<Label htmlFor="address">Address</Label>
						<SettingsInput
							type="text"
							name="address"
							value={formData.address}
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
							step="0.5"
							value={formData.bathrooms}
							onChange={e => handleChange(e)}
							required
						/>
					</SingleFieldGroup>
				</Col>
			</Section>
		</>
	)
}

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

const SingleFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`

const Col = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 32px;
`
