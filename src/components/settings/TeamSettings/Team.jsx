import styled, { css } from 'styled-components'
import { useSettings } from '@contexts/settings'

export const Team = ({ team: { name, dispatcher_count, agent_count, id }, team }) => {
	const { setSelected, isSelected } = useSettings()
	const isCardSelected = isSelected?.id === id

	return (
		<TeamCard isCardSelected={isCardSelected} onClick={() => setSelected(team)}>
			<Title>{name}</Title>
			<CountContainer>
				<Count>{`Dispatchers: ${dispatcher_count}`}</Count>
				<Count>{`Agents: ${agent_count}`}</Count>
			</CountContainer>
		</TeamCard>
	)
}

const TeamCard = styled.div`
	background: white;
	border-radius: 4px;
	padding: 8px;
	margin-bottom: 8px;

	cursor: pointer;

	&:hover {
		background: ${({ theme }) => theme.colors.bg.hover};
	}

	${({ isCardSelected }) =>
		isCardSelected &&
		css`
			background: ${({ theme }) => theme.colors.bg.hover};
		`}
`

const Title = styled.span``
const CountContainer = styled.div``
const Count = styled.span`
	margin-right: 16px;
	font-size: 14px;
	color: #4d5770;
`
