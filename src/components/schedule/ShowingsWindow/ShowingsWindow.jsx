import styled, { css } from 'styled-components'
import { stringTimeComparison } from '@utils/index'
import { ShowingCard } from '../ShowingCard/ShowingCard'
import { format, fromUnixTime } from 'date-fns'
import { useEffect, useState } from 'react'
import { getShowing } from '@services/firebase/showings'

export const ShowingsWindow = ({ showings, toggleShowingWindow, outing: { preStartTime } }) => {
	const [showingDocs, setShowingDocs] = useState([])
	const atEdge = stringTimeComparison(format(fromUnixTime(preStartTime), 'HH:mm'), '09:30') < 0

	useEffect(function fetchShowingsDocs() {
		async function asyncFetch() {
			const requests = showings.map(showingId => getShowing(showingId))
			const docs = await Promise.all(requests)
			setShowingDocs(docs.sort((a, b) => a.preStartTime - b.preStartTime))
		}

		asyncFetch()
	}, [showings])

	return (
		<Container atEdge={atEdge}>
			{showingDocs.map(showing => (
				<ShowingCard key={showing.id} showing={showing} toggleShowingWindow={toggleShowingWindow} />
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
	z-index: 5;
`
