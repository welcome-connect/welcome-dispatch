import styled, { css } from 'styled-components'
import { memo, useEffect } from 'react'

import { useNavigation } from '@contexts/navigation'
import { useSettings } from '@contexts/settings'

import { EditIcon, LessIcon, AddIcon } from '@components/icons'
import { Team } from './Team'
import { useFirestoreSub } from '@hooks/index'

export const TeamSettings = memo(() => {
	const { toggleTeamModal } = useNavigation()
	const { setSelected, isSelected, setIsEditing } = useSettings()

	const [teams, status] = useFirestoreSub('teams')

	const isLoading = status === 'loading'

	useEffect(() => {
		setSelected(null)
	}, [])

	const handleEdit = () => {
		setIsEditing(true)
		toggleTeamModal()
	}

	const handleAdd = () => {
		setIsEditing(false)
		setSelected(null)
		toggleTeamModal()
	}

	const handleMinus = () => {}

	return (
		<Container>
			<p>Teams</p>
			{isLoading ? (
				<p>loading...</p>
			) : (
				<Teams>
					{teams?.map(team => (
						<Team team={team} key={team.id} />
					))}
				</Teams>
			)}
			<IconRow>
				<IconWrapper onClick={isSelected ? handleEdit : null} isDisabled={!isSelected}>
					<EditIcon />
				</IconWrapper>
				<IconWrapper onClick={isSelected ? handleMinus : null} isDisabled={!isSelected}>
					<LessIcon />
				</IconWrapper>
				<IconWrapper onClick={handleAdd}>
					<AddIcon />
				</IconWrapper>
			</IconRow>
		</Container>
	)
})

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
	height: max(200px, 88%);
	margin-top: 8px;
	overflow-y: scroll;
`
