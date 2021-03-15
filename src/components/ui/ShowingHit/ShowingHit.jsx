import { Status } from '@components/common'
import { formatPhoneNumber } from '@utils/formatPhoneNumber'
import { format, fromUnixTime } from 'date-fns'
import styled from 'styled-components'

export function ShowingHit({ hit }) {
	return (
		<ShowingCard href={`/showings/${hit.id}`} target="_blank">
			<p>{hit.address.split(',').slice(0, 3).concat()}</p>
			<p>{format(fromUnixTime(hit.date.seconds), 'MM-dd-yyyy')}</p>
			<p>{format(fromUnixTime(hit.preStartTime), 'hh:mm a')}</p>
			<p>{format(fromUnixTime(hit.preEndTime), 'hh:mm a')}</p>
			<p>{hit.agentName}</p>
			<p>{hit.leadName}</p>
			<p>{formatPhoneNumber(hit.leadPhoneNumber, '($2) $3-$4')}</p>
			<p>{hit.price}</p>
			<StatusContainer>
				<Status status={hit.status} size="12px" />
			</StatusContainer>
		</ShowingCard>
	)
}

const ShowingCard = styled.a`
	background: ${({ theme }) => theme.colors.bg.white};
	text-decoration: none;
	font-size: 1rem;
	padding: 16px 0;
	border-radius: 4px;
	height: 100%;
	display: grid;
	grid-template-columns: 2.5fr repeat(5, 1fr) 1.5fr repeat(2, 1fr);
	align-items: center;
	transition: background 50ms ease-in-out;
	cursor: pointer;

	p {
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;

		&:first-of-type {
			text-align: start;
			padding-left: 16px;
		}
	}

	&:hover {
		background: ${({ theme }) => theme.colors.bg.hover};
	}
`

const StatusContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`
