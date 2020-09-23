import { connectHits } from 'react-instantsearch-dom'
import styled, { css } from 'styled-components'
import { useSettings } from '../../contexts/settings'
import { useTeamAgents, useTeamDispatchers } from '../../hooks'
import { capitalize } from '../../utils'
import { Agent } from './Agent'

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
