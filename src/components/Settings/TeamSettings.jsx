import styled from 'styled-components'
import { useNavigation } from '../../contexts/navigation'
import { EditIcon, LessIcon, AddIcon } from '../_icons'

export const TeamSettings = () => {
	const { toggleTeamEditModal } = useNavigation()

	const teams = [
		{ name: 'Houston', dispatcher_count: 5, agent_count: 3, id: '6a54sd6f87a6s5d4f1' },
		{ name: 'Dallas', dispatcher_count: 8, agent_count: 16, id: '6a54sdasdf6f87a6s5d4f1' },
		{
			name: 'San Antonio',
			dispatcher_count: 2,
			agent_count: 2,
			id: '6a54sdasdf6f8oiuw9e7r6s5d4f1',
		},
	]

	return (
		<Container>
			<p>Teams</p>
			<Teams>
				{teams.map(team => (
					<Team key={team.id}>
						<span>{team.name}</span>
						<div>
							<span>{`Dispatchers: ${team.dispatcher_count}`}</span>
							<span>{`Agents: ${team.agent_count}`}</span>
						</div>
					</Team>
				))}
			</Teams>
			<IconRow>
				<IconWrapper onClick={toggleTeamEditModal}>
					<EditIcon />
				</IconWrapper>
				<IconWrapper>
					<LessIcon />
				</IconWrapper>
				<IconWrapper onClick={toggleTeamEditModal}>
					<AddIcon />
				</IconWrapper>
			</IconRow>
		</Container>
	)
}

const Container = styled.div`
	height: 100%;
	position: relative;
	padding: 8px 0;
`
const IconRow = styled.div`
	display: flex;
	margin-top: auto;
	position: absolute;
	bottom: 8px;
	right: 0;
`
const IconWrapper = styled.span`
	display: block;
	margin-left: 16px;
	cursor: pointer;

	svg {
		height: 24px;
		width: auto;
	}
`

const Teams = styled.div`
	width: 100%;
	height: min(200px, 85%);
	margin-top: 8px;
`

const Team = styled.div`
	background: white;
	border-radius: 4px;
	padding: 8px;
	margin-bottom: 8px;

	cursor: pointer;
	div {
		span {
			margin-right: 16px;
			font-size: 14px;
			color: ${({ theme }) => theme.colors.text_light};
		}
	}

	&:hover {
		background: ${({ theme }) => theme.colors.bg.hover};
	}
`
