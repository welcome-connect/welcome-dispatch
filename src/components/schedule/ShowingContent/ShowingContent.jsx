import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

import { useDispatch } from '@contexts/dispatch'
import { useNavigation } from '@contexts/navigation'

import { getLead } from '@services/firebase/leads'
import { getUserDocument } from '@services/firebase'
import { formatPhoneNumber } from '@utils/index'

import { Button, FieldGroup } from '@styles/styled-components'

export const ShowingContent = () => {
	const [lead, setLead] = useState(null)
	const [agent, setAgent] = useState(null)

	const { selectedShowing, selectShowing, setEditShowing } = useDispatch()
	const { toggleNewShowingModal, toggleShowingModal } = useNavigation()

	useEffect(() => {
		const asyncFetch = async () => {
			const l = await getLead(selectedShowing.leadId)
			const a = await getUserDocument(selectedShowing.agentId)
			setLead(l)
			setAgent(a)
		}

		asyncFetch()
	}, [])

	const handleEdit = showing => {
		setEditShowing(showing)
		toggleShowingModal()
		toggleNewShowingModal()
		selectShowing(null)
	}

	return (
		<Container>
			<h1>{selectedShowing.propertyDetails.address.split(',').slice(0, 3).concat()}</h1>

			<DoubleCol>
				<Section>
					<h2>Lead Details</h2>
					{lead ? (
						<SingleCol>
							<p>{lead.displayName}</p>
							<p>{formatPhoneNumber(lead.phoneNumber, '($2) $3-$4')}</p>
						</SingleCol>
					) : null}
				</Section>
				<Section>
					<h2>Agent Details</h2>
					{agent ? (
						<SingleCol>
							<p>{agent.displayName}</p>
							<p>{formatPhoneNumber(agent.phoneNumber, '($2) $3-$4')}</p>
						</SingleCol>
					) : null}
				</Section>
			</DoubleCol>
			<SingleCol>
				<Section>
					<h2>Assignment</h2>
					<SingleCol>
						<p>Date: {format(new Date(selectedShowing.date.string), 'yyyy/MM/dd')}</p>
					</SingleCol>
					<DoubleCol>
						<p>Start time: {selectedShowing.startTime}</p>
						<p>End time: {selectedShowing.endTime}</p>
					</DoubleCol>
				</Section>
			</SingleCol>
			<SingleCol>
				<Section>
					<h2>Property Details</h2>
					<DoubleCol>
						<p>Price: {selectedShowing.propertyDetails.price}</p>
						<p>Sqft: {selectedShowing.propertyDetails.sqft}</p>
					</DoubleCol>
					<DoubleCol>
						<p>Bedrooms: {selectedShowing.propertyDetails.bedrooms}</p>
						<p>Bathrooms: {selectedShowing.propertyDetails.bathrooms}</p>
					</DoubleCol>
					<DoubleCol>
						<p>Neighborhood: {selectedShowing.propertyDetails.neighborhood}</p>
						<p>County: {selectedShowing.propertyDetails.county}</p>
					</DoubleCol>
				</Section>
			</SingleCol>
			<SingleCol>
				<Section>
					<h2>Additional Property Details</h2>
					<DoubleCol>
						<p>Construction year: {selectedShowing.propertyDetails.constructionAge}</p>
						<p>Days on market: {selectedShowing.propertyDetails.daysOnMarket}</p>
					</DoubleCol>
					<DoubleCol>
						<p>Financing considered: {selectedShowing.propertyDetails.financingConsidered}</p>
						<p>Tax rate: {selectedShowing.propertyDetails.taxRate}</p>
					</DoubleCol>
					<DoubleCol>
						<p>Maintenance fee: {selectedShowing.propertyDetails.maintenanceFee}</p>
						<p>Other fees: {selectedShowing.propertyDetails.otherFees}</p>
					</DoubleCol>
					<SingleCol>
						<p>Flooded: {selectedShowing.propertyDetails.flooded}</p>
					</SingleCol>
				</Section>
			</SingleCol>
			<SingleCol>
				<Section>
					<h2>Additional Notes</h2>
					<DoubleCol>
						<p>{selectedShowing.propertyDetails.add_notes}</p>
					</DoubleCol>
				</Section>
			</SingleCol>
			<ButtonContainer>
				<Button isPrimary type="button" onClick={() => handleEdit(selectedShowing)}>
					Edit
				</Button>
			</ButtonContainer>
		</Container>
	)
}

const Container = styled.div`
	height: 100%;
	width: 100%;
	padding: 8px 32px;
	position: relative;

	h1 {
		margin-bottom: 32px;
	}
`

const Section = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 2rem;

	h2 {
		margin-bottom: 16px;
		font-size: 0.9rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05rem;
	}

	p {
		margin-bottom: 4px;
		font-size: 1rem;
		font-weight: 300;
	}
`

const SingleCol = styled(FieldGroup)`
	margin-bottom: 0;
`

const DoubleCol = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 32px;
`

const ButtonContainer = styled.div`
	width: 100%;
	margin-bottom: 8px;

	button {
		margin-top: 0;
	}
`
