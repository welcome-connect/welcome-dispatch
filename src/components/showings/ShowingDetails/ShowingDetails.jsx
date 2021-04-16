import styled from 'styled-components'
import { format, fromUnixTime, formatDistance } from 'date-fns'
import { useState } from 'react'

import { capitalize } from '@utils/capitalize'

import { Modal, Portal, Status } from '@components/common'
import { UserAvatar } from '@components/ui'
import { Button, Flex } from '@styles/styled-components'
import { EditShowingForm, DeleteModalContent } from '@components/showings'

function getFields(showing) {
	return [
		{ label: 'Date', data: format(fromUnixTime(showing.date.seconds), 'MM-dd-yyyy'), area: 'date' },
		{ label: 'Start Time', data: format(fromUnixTime(showing.preStartTime), 'hh:mm a'), area: 'start-time' },
		{ label: 'End Time', data: format(fromUnixTime(showing.preEndTime), 'hh:mm a'), area: 'end-time' },
		{ label: 'Bedrooms', data: showing.bedrooms, area: 'bedrooms' },
		{ label: 'Bathrooms', data: showing.bathrooms, area: 'bathrooms' },
		{ label: 'Sqft', data: showing.sqft, area: 'sqft' },
		{ label: 'Construction Year', data: showing.builtIn, area: 'construction-year' },
		{
			label: 'Days on Market',
			data: showing.toMarketDate ? formatDistance(fromUnixTime(showing.toMarketDate.seconds), Date.now()) : null,
			area: 'days-on-market'
		},
		{ label: 'Flooded', data: showing.flooded, area: 'flooded' },
		{ label: 'Tax Rate', data: `${showing.taxRate} %`, area: 'tax-rate' },
		{ label: 'Financing', data: showing.financingConsidered, area: 'financing' },
		{ label: 'Maintenance Fee', data: showing.maintenanceFee, area: 'mtn-fee' },
		{ label: 'Other Fees', data: showing.otherFees, area: 'other-fee' },
		{ label: 'Additional Notes', data: showing.additionalNotes, area: 'add-notes' }
	]
}

export function ShowingDetails({ showing }) {
	const [isShowingEditModalOpen, setIsShowingEditModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	function toggleShowingEditModal() {
		setIsShowingEditModalOpen(!isShowingEditModalOpen)
	}

	function toggleDeleteModal() {
		setIsDeleteModalOpen(!isDeleteModalOpen)
	}

	return (
		<Container>
			<div>
				<MFlex>
					<Address>{showing.address}</Address>
					<MStatus status={showing.status} size="12px" />
					<p>{capitalize(showing.status)}</p>
				</MFlex>
				<Price>$ {showing.price}</Price>

				<AvatarsContainer>
					<UserAvatar user={{ name: showing.leadName, phoneNumber: showing.leadPhoneNumber, role: 'Lead' }} />
					{showing.agentId !== 'unassigned' ? (
						<UserAvatar
							user={{
								name: showing.agentName || '',
								phoneNumber: showing.agentPhoneNumber || '',
								role: 'Agent'
							}}
						/>
					) : null}
				</AvatarsContainer>

				<PropertyDetails>
					{getFields(showing).map(field => (
						<Info key={field.label} area={field.area}>
							<p>{field.label}</p>
							<strong>{field.data}</strong>
						</Info>
					))}
				</PropertyDetails>
			</div>

			<ButtonRow>
				<div>
					<Button isTertiary>Cancel</Button>
					<Button isTertiary onClick={() => setIsDeleteModalOpen(true)}>
						Delete
					</Button>
				</div>
				<Button isPrimary onClick={toggleShowingEditModal}>
					Edit
				</Button>
			</ButtonRow>

			{isShowingEditModalOpen ? (
				<Portal id="edit-showing-modal">
					<Modal onClose={toggleShowingEditModal}>
						<EditShowingForm showing={showing} />
					</Modal>
				</Portal>
			) : null}

			{isDeleteModalOpen ? (
				<Portal id="delete-modal">
					<Modal onClose={toggleDeleteModal}>
						<DeleteModalContent showingId={showing.id} />
					</Modal>
				</Portal>
			) : null}
		</Container>
	)
}

const Container = styled.section`
	grid-area: details;
	background: ${({ theme }) => theme.colors.bg.white};
	border-radius: 8px;
	padding: 2rem;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	h1 {
		margin-bottom: 0;
		font-weight: 600;
	}
`

const ButtonRow = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;

	div {
		button:first-child {
			margin-right: 1rem;
		}
	}
`

const Address = styled.h1`
	font-weight: 500;
	margin-right: 1rem;
`

const Price = styled.h2`
	color: ${({ theme }) => theme.colors.accent};
	margin-bottom: 42px;
	font-weight: 600;
`

const AvatarsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	width: fit-content;
	grid-gap: 2rem;
	margin-bottom: 42px;
`

const MFlex = styled(Flex)`
	justify-content: flex-start;
	width: fit-content;
`

const MStatus = styled(Status)`
	margin-right: 0.5rem;
`

const PropertyDetails = styled.div`
	max-width: 1000px;
	display: grid;
	grid-template-columns: repeat(3, 1fr) 1.25fr repeat(2, 1fr);
	grid-template-rows: repeat(5, 1fr);
	grid-gap: 1rem;
	grid-template-areas:
		'date start-time end-time . . .'
		'bedrooms bathrooms sqft construction-year days-on-market flooded'
		'tax-rate financing financing finanting . .'
		'mtn-fee mtn-fee mtn-fee other-fee other-fee other-fee'
		'add-notes add-notes add-notes add-notes add-notes add-notes';
`

const Info = styled.div`
	grid-area: ${({ area }) => area};

	p {
		color: ${({ theme }) => theme.colors.text_light};
		margin-bottom: 4px;
	}
	strong {
		font-size: 18px;
		font-weight: 600;
		color: ${({ theme }) => theme.colors.primary};
	}
`
