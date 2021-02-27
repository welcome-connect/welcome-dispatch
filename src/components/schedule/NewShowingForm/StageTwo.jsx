import styled from 'styled-components'
import { FieldGroup, Label, SettingsInput } from '@styles/styled-components'

export function StageTwo({ formData, handleChange }) {
	return (
		<>
			<Section>
				<h2>Additional Property Details</h2>
				<Col>
					<SingleFieldGroup>
						<Label htmlFor="builtIn">Construction year</Label>
						<SettingsInput type="text" name="builtIn" value={formData.builtIn} onChange={e => handleChange(e)} />
					</SingleFieldGroup>
					<SingleFieldGroup>
						<Label htmlFor="toMarketDate">Date to market</Label>
						<SettingsInput
							type="date"
							name="toMarketDate"
							value={formData.toMarketDate}
							onChange={e => handleChange(e)}
						/>
					</SingleFieldGroup>
				</Col>

				<Col>
					<SingleFieldGroup>
						<Label htmlFor="financingConsidered">Financing considered</Label>
						<SettingsInput
							type="text"
							name="financingConsidered"
							value={formData.financingConsidered}
							onChange={e => handleChange(e)}
						/>
					</SingleFieldGroup>
					<SingleFieldGroup>
						<Label htmlFor="taxRate">Tax rate</Label>
						<SettingsInput type="text" name="taxRate" value={formData.taxRate} onChange={e => handleChange(e)} />
					</SingleFieldGroup>
				</Col>
				<Col>
					<SingleFieldGroup>
						<Label htmlFor="maintenanceFee">Maintenance fee</Label>
						<SettingsInput
							type="text"
							name="maintenanceFee"
							value={formData.maintenanceFee}
							onChange={e => handleChange(e)}
						/>
					</SingleFieldGroup>
					<SingleFieldGroup>
						<Label htmlFor="otherFees">Other fees</Label>
						<SettingsInput
							type="text"
							name="otherFees"
							value={formData.otherFees}
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
