import styled from 'styled-components'
import { format } from 'date-fns'

import { useDispatch } from '@contexts/dispatch'
import { useFirestoreSub } from '@hooks/index'

import { getColumnSpan } from '@utils/index'

import { ShowingsWindow } from '../ShowingsWindow'

export const ShowingsRow = ({ agent }) => {
	const { observedDate, selectOuting, selectedOuting } = useDispatch()
	const [outings] = useFirestoreSub('outings', {
		where: [
			['agentId', '==', agent.id],
			['date.string', '==', format(observedDate, 'MM/dd/yyyy')],
		],
	})

	outings.sort((a, b) => a.preStartTime - b.preStartTime)

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
				<ShowingSlot key={outing.id} startTime={outing.preStartTime} endTime={outing.preEndTime}>
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
	grid-template-columns: repeat(130, 24px);
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
