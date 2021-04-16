import styled from 'styled-components'
import { FieldGroup, Label, SettingsInput } from '@styles/styled-components'

export function EditShowingStageOne({ formData, handleChange }) {
	return (
		<>
			<Section>
				<h2>Lead Details</h2>
				<SingleFieldGroup>
					<Label htmlFor="leadName">Name</Label>
					<SettingsInput disabled value={formData.leadName} type="text" name="leadName" />
				</SingleFieldGroup>
				<SingleFieldGroup>
					<Label htmlFor="phoneNumber">Phone number</Label>
					<SettingsInput disabled value={formData.phoneNumber} type="text" name="phoneNumber" />
				</SingleFieldGroup>
			</Section>

			<Section>
				<h2>Property Details</h2>
				<SingleFieldGroup>
					<Label htmlFor="address">Address</Label>
					<SettingsInput disabled value={formData.address} type="text" name="address" />
				</SingleFieldGroup>
				<Grid>
					<SingleFieldGroup>
						<Label htmlFor="price">Price</Label>
						<SettingsInput value={formData.price} type="text" name="price" onChange={e => handleChange(e)} />
					</SingleFieldGroup>
					<SingleFieldGroup>
						<Label htmlFor="sqft">Sqft</Label>
						<SettingsInput value={formData.sqft} type="text" name="sqft" onChange={e => handleChange(e)} />
					</SingleFieldGroup>
				</Grid>
				<Grid>
					<SingleFieldGroup>
						<Label htmlFor="bedrooms">Bedrooms</Label>
						<SettingsInput
							value={formData.bedrooms}
							type="number"
							name="bedrooms"
							onChange={e => handleChange(e)}
						/>
					</SingleFieldGroup>
					<SingleFieldGroup>
						<Label htmlFor="bathrooms">Bathrooms</Label>
						<SettingsInput
							value={formData.bathrooms}
							type="number"
							name="bathrooms"
							step="0.5"
							onChange={e => handleChange(e)}
						/>
					</SingleFieldGroup>
				</Grid>
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

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 32px;
`
