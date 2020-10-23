import styled, { css } from 'styled-components'
import { useSettings } from '../../contexts/settings'
import { capitalize } from '../../utils'

export const TeamUsersHit = ({ hit }) => {
	const {
		setSelectedAgents,
		setSelectedDispatchers,
		isSelected,
		selectedAgents,
		selectedDispatchers,
	} = useSettings()

	const isInTeam =
		hit.teams.includes(isSelected?.id) ||
		[...selectedAgents, ...selectedDispatchers].find(user => user.id === hit.id)

	const handleClick = hit => {
		if (hit.role === 'agent' && !isInTeam) setSelectedAgents(hit)
		if (hit.role === 'dispatcher' && !isInTeam) setSelectedDispatchers(hit)
	}

	return (
		<ListItem key={hit.id} onClick={() => handleClick(hit)} hasUser={isInTeam}>
			<span>{hit.displayName}</span>
			<span>
				{capitalize(hit.role)}
				{isInTeam ? ' - on team' : ''}
			</span>
		</ListItem>
	)
}

const ListItem = styled.div`
	margin-bottom: 4px;
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.primary};

	${({ hasUser }) =>
		hasUser &&
		css`
			cursor: initial;
			span {
				color: ${({ theme }) => theme.colors.text_disabled};
			}
		`}
`
