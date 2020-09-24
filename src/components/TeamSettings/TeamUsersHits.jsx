import { connectHits } from 'react-instantsearch-dom'
import styled, { css } from 'styled-components'
import { useSettings } from '../../contexts/settings'
import { useFirestoreSub } from '../../hooks'
import { capitalize } from '../../utils'

export const TeamUsersHits = connectHits(({ hits }) => {
	const {
		setSelectedAgents,
		setSelectedDispatchers,
		isSelected,
		selectedAgents,
		selectedDispatchers,
	} = useSettings()

	const [agents] = useFirestoreSub('users', {
		where: [
			['teams', 'array-contains', isSelected?.id],
			['role', '==', 'agent'],
		],
	})

	const [dispatchers] = useFirestoreSub('users', {
		where: [
			['teams', 'array-contains', isSelected?.id],
			['role', '==', 'dispatcher'],
		],
	})

	const handleClick = hit => {
		if (hit.role === 'agent') {
			const hasValue =
				agents.find(agent => agent.id === hit.id) ||
				selectedAgents.find(agent => agent.id === hit.id)
			if (!hasValue) setSelectedAgents(hit)
		} else if (hit.role === 'dispatcher') {
			const hasValue =
				dispatchers.find(dispatcher => dispatcher.id === hit.id) ||
				selectedDispatchers.find(dispatcher => dispatcher.id === hit.id)
			if (!hasValue) setSelectedDispatchers(hit)
		} else {
			console.log('User does not have a role assigned')
		}
	}

	return (
		<Container>
			{hits.map(hit => {
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
						<span>{hit.name || hit.displayName}</span>
						<span>
							{capitalize(hit.role)}
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
	padding: 0 4px;
`

const ListItem = styled.li`
	margin-bottom: 4px;
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.primary};

	${({ hasUser }) =>
		hasUser &&
		css`
			color: ${({ theme }) => theme.colors.accent};
			cursor: initial;
		`}
`
