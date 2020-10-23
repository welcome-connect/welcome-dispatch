import { format } from 'date-fns'
import styled from 'styled-components'
import { useDispatch } from '../../contexts/dispatch'
import { useFirestoreSub } from '../../hooks'
import { getColumnSpan } from '../../utils'

export const ShowingsRow = ({ agent }) => {
	const { observedDate } = useDispatch()
	const [showings] = useFirestoreSub('showings', {
		where: [
			['agent.id', '==', agent.id],
			['date.string', '==', format(observedDate, 'MM/dd/yyyy')],
		],
	})

	showings.sort(
		(a, b) => Number(a.startTime.split(':').join('')) - Number(b.startTime.split(':').join('')),
	)

	return (
		<Container>
			{showings.map(showing => (
				<ShowingSlot key={showing.id} startTime={showing.startTime} endTime={showing.endTime}>
					<span>
						{showing.startTime} - {showing.endTime}
					</span>
				</ShowingSlot>
			))}
		</Container>
	)
}

const ShowingSlot = styled.div`
	grid-column: ${({ startTime, endTime }) => getColumnSpan(startTime, endTime)};

	background: ${({ theme }) => theme.colors.border_darker};
	height: 48px;
	padding: 8px 12px;
	border-radius: 4px;

	display: flex;
	align-items: center;
	justify-content: center;
	/* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.09); */

	span {
		display: block;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: 0.9rem;
	}
`

const Container = styled.div`
	display: grid;
	grid-template-columns: repeat(120, 24px);
	height: 56px;
	align-items: center;
	width: fit-content;

	border-bottom: 1px solid rgba(203,213,224,0.4);
`
