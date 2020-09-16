import styled, { css } from 'styled-components'
import { useEffect } from 'react'

import { useNavigation } from '../../contexts/navigation'
import { useSettings } from '../../contexts/settings'

import { EditIcon, LessIcon, AddIcon } from '../_icons'
import { Team } from './Team'
import { useTeams } from '../../hooks'

export const TeamSettings = () => {
	const { toggleTeamEditModal } = useNavigation()
	const { setSelectedTeam, selectedTeam, setIsEditingTeam } = useSettings()
	const { teams, loading } = useTeams()

	useEffect(() => {
		setSelectedTeam(null)
	}, [])

	const handleEdit = () => {
		setIsEditingTeam(true)
		toggleTeamEditModal()
	}

	const handleAdd = () => {
		setIsEditingTeam(false)
		toggleTeamEditModal()
	}

	const handleMinus = () => {}

	return (
		<Container>
			<p>Teams</p>
			{loading ? (
				<p>loading...</p>
			) : (
				<Teams>
					{teams?.map(team => (
						<Team team={team} key={team.id} />
					))}
				</Teams>
			)}
			<IconRow>
				<IconWrapper onClick={selectedTeam ? handleEdit : null} isDisabled={!selectedTeam}>
					<EditIcon />
				</IconWrapper>
				<IconWrapper onClick={selectedTeam ? handleMinus : null} isDisabled={!selectedTeam}>
					<LessIcon />
				</IconWrapper>
				<IconWrapper onClick={handleAdd}>
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

	${({ isDisabled }) =>
		isDisabled &&
		css`
			cursor: initial;
			svg {
				path {
					stroke: ${({ theme }) => theme.colors.gray.accent};
				}
			}
		`}
`

const Teams = styled.div`
	width: 100%;
	height: min(200px, 85%);
	margin-top: 8px;
`
