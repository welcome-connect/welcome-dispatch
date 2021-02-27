import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { format, fromUnixTime, formatDistance } from 'date-fns'

import { useDispatch } from '@contexts/dispatch'
import { useNavigation } from '@contexts/navigation'

import { getLead } from '@services/firebase/leads'
import { getUserDocument } from '@services/firebase'
import { formatPhoneNumber } from '@utils/index'

import { Button, FieldGroup } from '@styles/styled-components'

export const ShowingContent = () => {
	const [lead, setLead] = useState(null)
	const [agent, setAgent] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	const { selectedShowing, selectShowing, setEditShowing } = useDispatch()
	const { toggleNewShowingModal, toggleShowingModal } = useNavigation()

	useEffect(() => {
		const asyncFetch = async () => {
			const l = await getLead(selectedShowing.leadId)
			const a = await getUserDocument(selectedShowing.agentId)
			setLead(l)
			setAgent(a)
			setIsLoading(false)
		}

		asyncFetch()
	}, [])

	const handleEdit = showing => {
		setEditShowing(showing)
		toggleShowingModal()
		toggleNewShowingModal()
		selectShowing(null)
	}

	const from = format(fromUnixTime(selectedShowing.preStartTime), 'hh:mm a')
	const to = format(fromUnixTime(selectedShowing.preEndTime), 'hh:mm a')

	return (
		<Container>
			{!isLoading ? (
				<>
					<h1>{selectedShowing.address.split(',').slice(0, 3).concat()}</h1>

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
								<p>Start time: {from}</p>
								<p>End time: {to}</p>
							</DoubleCol>
						</Section>
					</SingleCol>
					<SingleCol>
						<Section>
							<h2>Property Details</h2>
							<DoubleCol>
								<p>Price: {selectedShowing.price}</p>
								<p>Sqft: {selectedShowing.sqft}</p>
							</DoubleCol>
							<DoubleCol>
								<p>Bedrooms: {selectedShowing.bedrooms}</p>
								<p>Bathrooms: {selectedShowing.bathrooms}</p>
							</DoubleCol>
							<DoubleCol>
								<p>Neighborhood: {selectedShowing.neighborhood}</p>
								<p>County: {selectedShowing.county}</p>
							</DoubleCol>
						</Section>
					</SingleCol>
					<SingleCol>
						<Section>
							<h2>Additional Property Details</h2>
							<DoubleCol>
								<p>Construction year: {selectedShowing.builtIn}</p>
								<p>
									Date on market:{' '}
									{selectedShowing.toMarketDate
										? formatDistance(fromUnixTime(selectedShowing.toMarketDate.seconds), Date.now())
										: ''}
								</p>
							</DoubleCol>
							<DoubleCol>
								<p>Financing considered: {selectedShowing.financingConsidered}</p>
								<p>Tax rate: {selectedShowing.taxRate}</p>
							</DoubleCol>
							<DoubleCol>
								<p>Maintenance fee: {selectedShowing.maintenanceFee}</p>
								<p>Other fees: {selectedShowing.otherFees}</p>
							</DoubleCol>
							<SingleCol>
								<p>Flooded: {selectedShowing.flooded}</p>
							</SingleCol>
						</Section>
					</SingleCol>
					<SingleCol>
						<Section>
							<h2>Additional Notes</h2>
							<DoubleCol>
								<p>{selectedShowing.add_notes}</p>
							</DoubleCol>
						</Section>
					</SingleCol>
					<ButtonContainer>
						<Button isPrimary type="button" onClick={() => handleEdit(selectedShowing)}>
							Edit
						</Button>
					</ButtonContainer>
				</>
			) : (
				<span>Loading...</span>
			)}
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
