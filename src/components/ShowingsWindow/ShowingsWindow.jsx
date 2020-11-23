import styled, { css } from 'styled-components'
import { stringTimeComparison } from '../../utils'
import { ShowingCard } from '../ShowingCard/ShowingCard'

export const ShowingsWindow = ({ showings, toggleShowingWindow, outing: { startFirstShowing } }) => {
	const atEdge = stringTimeComparison(startFirstShowing, '09:30') < 0

	return (
		<Container atEdge={atEdge}>
			{showings.map(showing => (
				<ShowingCard key={showing.id} showingId={showing.id} toggleShowingWindow={toggleShowingWindow}/>
			))}
		</Container>
	)
}

const Container = styled.div`
	position: absolute;
	background-color: ${({ theme }) => theme.colors.bg.primary};

	left: 50%;
	transform: translateX(-50%);
	top: 115%;

	${({ atEdge }) =>
		atEdge &&
		css`
			left: 0;
			transform: translateX(0);
		`}

	padding: 12px;
	border-radius: 8px;

	display: grid;
	grid-template-rows: auto;
	grid-gap: 12px;
	cursor: default;
`
