import styled from 'styled-components'
import { FieldGroup, Label, SettingsInput } from '@styles/styled-components'

export function StageTwo({ formData, handleChange }) {
	return (
		<>
			<Section>
				<h2>Additional Property Details</h2>
				<Col>
					<SingleFieldGroup>
						<Label htmlFor="construction_age">Construction year</Label>
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
						<SettingsInput type="text" name="flooded" value={formData.flooded} onChange={e => handleChange(e)} />
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

const Col = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 32px;
`

const SingleFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`
