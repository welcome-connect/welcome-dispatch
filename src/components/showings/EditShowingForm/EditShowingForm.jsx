import styled from 'styled-components'

import { FieldGroup, Label, SettingsInput } from '@styles/styled-components'
import { formatPhoneNumber } from '@utils/formatPhoneNumber'

export function EditShowingForm({ showing }) {
	console.log({ showing })

	return (
		<Container>
			<h1>Edit Showing</h1>

			<Section>
				<h2>Lead Details</h2>
				<SingleFieldGroup>
					<Label>Name</Label>
					<SettingsInput disabled value={showing.leadName} />
				</SingleFieldGroup>
				<SingleFieldGroup>
					<Label>Phone number</Label>
					<SettingsInput disabled value={formatPhoneNumber(showing.leadPhoneNumber, '($2) $3-$4')} />
				</SingleFieldGroup>
			</Section>

			<Section>
				<h2>Property Details</h2>
				<SingleFieldGroup>
					<Label>Address</Label>
					<SettingsInput disabled value={showing.address} />
				</SingleFieldGroup>
				<Grid>
					<SingleFieldGroup>
						<Label>Price</Label>
						<SettingsInput value={showing.price} />
					</SingleFieldGroup>
					<SingleFieldGroup>
						<Label>Sqft</Label>
						<SettingsInput value={showing.sqft} />
					</SingleFieldGroup>
				</Grid>
				<Grid>
					<SingleFieldGroup>
						<Label>Bedrooms</Label>
						<SettingsInput value={showing.bedrooms} />
					</SingleFieldGroup>
					<SingleFieldGroup>
						<Label>Bathrooms</Label>
						<SettingsInput value={showing.bathrooms} />
					</SingleFieldGroup>
				</Grid>
			</Section>
		</Container>
	)
}

const Container = styled.div`
	height: min(700px, 90vh);
	width: 700px;
	padding: 0.5rem 1rem;
	position: relative;

	h1 {
		margin-bottom: 12px;
		font-weight: 600;
	}
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

const SingleFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 32px;
`
