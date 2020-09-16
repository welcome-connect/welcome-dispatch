import { useState } from 'react'
import { connectHits } from 'react-instantsearch-dom'
import styled, { css } from 'styled-components'
import { useSettings } from '../../contexts/settings'
import { useTeamAgents, useTeamDispatchers } from '../../hooks'

export const CustomHits = connectHits(props => {
	const {
		setSelectedAgents,
		setSelectedDispatchers,
		selectedTeam,
		selectedAgents,
		selectedDispatchers,
	} = useSettings()
	const { agents } = useTeamAgents(selectedTeam?.id)
	const { dispatchers } = useTeamDispatchers(selectedTeam?.id)

	const handleClick = hit => {
		if (hit.role === 'agent') {
			const hasValue =
				agents.find(agent => agent.id === hit.id) ||
				selectedAgents.find(agent => agent.id === hit.id)
			if (!hasValue) setSelectedAgents(hit)
		} else {
			const hasValue =
				dispatchers.find(dispatcher => dispatcher.id === hit.id) ||
				selectedDispatchers.find(dispatcher => dispatcher.id === hit.id)
			if (!hasValue) setSelectedDispatchers(hit)
		}
	}

	return (
		<Container>
			{props.hits.map(hit => {
				const hasAgent =
					agents.find(agent => agent.id === hit.id) ||
					selectedAgents.find(agent => agent.id === hit.id)
				const hasDispatcher =
					dispatchers.find(dispatcher => dispatcher.id === hit.id) ||
					selectedDispatchers.find(dispatcher => dispatcher.id === hit.id)
				return (
					<ListItem
						key={hit.objectID}
						onClick={() => handleClick(hit)}
						hasUser={hit.role === 'agent' ? hasAgent : hasDispatcher}>
						<strong>{hit.name || hit.displayName}</strong>
						<span>
							{hit.role.charAt(0).toUpperCase() + hit.role.slice(1)}
							{hasAgent || hasDispatcher ? ' - on team' : ''}
						</span>
					</ListItem>
				)
			})}
		</Container>
	)
})

const Container = styled.ul`
	list-style: none;
`

const ListItem = styled.li`
	margin-bottom: 4px;
	display: flex;
	justify-content: space-between;
	cursor: pointer;

	${({ hasUser }) =>
		hasUser &&
		css`
			color: ${({ theme }) => theme.colors.indigo.accent};
      cursor: initial;
		`}
`
