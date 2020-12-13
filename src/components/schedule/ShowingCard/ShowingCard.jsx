import styled from 'styled-components'

import { useFirestoreSub } from '@hooks/index'
import { useDispatch } from '@contexts/dispatch'
import { useNavigation } from '@contexts/navigation'

import { capitalize } from '@utils/index'

export const ShowingCard = ({ showingId, toggleShowingWindow }) => {
	const { selectShowing } = useDispatch()
	const { toggleShowingModal } = useNavigation()
	const [[showing]] = useFirestoreSub('showings', {
		where: ['id', '==', showingId],
	})

	const handleClick = showing => {
		console.log(showing)
		selectShowing(showing)
		toggleShowingModal()
		toggleShowingWindow(showing.outingId)
	}

	if (showing) {
		return (
			<Showing onClick={() => handleClick(showing)}>
				<Address>{showing.propertyDetails.address}</Address>
				<BotLine>
					<Time>
						{showing.startTime} - {showing.endTime}
					</Time>
					<Status>{capitalize(showing.status)}</Status>
				</BotLine>
			</Showing>
		)
	} else return <Showing />
}

const Showing = styled.div`
	padding: 8px 12px;
	border-radius: 4px;
	font-size: 0.9rem;

	background-color: ${({ theme }) => theme.colors.bg.white};

	display: flex;
	justify-content: center;
	align-items: flex-start;
	flex-direction: column;

	height: fit-content;
	width: 280px;
	cursor: pointer;
`

const Address = styled.div`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	width: 100%;

	margin-bottom: 12px;
`
const BotLine = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`
const Time = styled.div``
const Status = styled.div``
