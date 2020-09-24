import { connectHits } from 'react-instantsearch-dom'
import styled, { css } from 'styled-components'
import { Agent } from '../AgentSettings/Agent'

export const AgentHits = connectHits(({ hits }) => {
	return (
		<Container>
			{hits.map(hit => (
				<Agent key={hit.objectID} agent={hit} />
			))}
		</Container>
	)
})

const Container = styled.ul`
	list-style: none;
`
