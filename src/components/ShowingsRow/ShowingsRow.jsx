import { format } from 'date-fns'
import styled from 'styled-components'
import { useDispatch } from '../../contexts/dispatch'
import { useFirestoreSub } from '../../hooks'
import { getColumnSpan } from '../../utils'
import { ShowingsWindow } from '../ShowingsWindow'

export const ShowingsRow = ({ agent }) => {
	const { observedDate, selectOuting, selectedOuting } = useDispatch()
	const [outings] = useFirestoreSub('outings', {
		where: [
			['agent.id', '==', agent.id],
			['date.string', '==', format(observedDate, 'MM/dd/yyyy')],
		],
	})

	outings.sort((a, b) => Number(a.startFirstShowing.split(':').join('')) - Number(b.startFirstShowing.split(':').join('')))

	const toggleShowingWindow = outing => {
		if (selectedOuting?.id && outing.id === selectedOuting.id) {
			selectOuting(null)
		} else {
			selectOuting(outing)
		}
	}
	return (
		<Container>
			{outings.map(outing => (
				<ShowingSlot key={outing.id} startTime={outing.startFirstShowing} endTime={outing.endLastShowing}>
					<ShowingSlotInner onClick={() => toggleShowingWindow(outing)}>
						<span>{`${outing.showings.length} Showings`}</span>
					</ShowingSlotInner>
					{selectedOuting?.id === outing?.id ? (
						<ShowingsWindow
							showings={selectedOuting.showings}
							toggleShowingWindow={toggleShowingWindow}
							outing={outing}
						/>
					) : null}
				</ShowingSlot>
			))}
		</Container>
	)
}

const ShowingSlot = styled.div`
	grid-column: ${({ startTime, endTime }) => getColumnSpan(startTime, endTime)};

	background: ${({ theme }) => theme.colors.border_darker};
	height: 48px;

	border-radius: 4px;

	position: relative;
	cursor: pointer;

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

	border-bottom: 1px solid rgba(203, 213, 224, 0.4);
`

const ShowingSlotInner = styled.div`
	width: 100%;
	height: 100%;

	padding: 8px 12px;
	display: flex;
	align-items: center;
	justify-content: center;
`