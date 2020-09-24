import styled, { css } from 'styled-components'
import { memo, useEffect } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-dom'

import { searchClient } from '../../services/algolia'

import { useNavigation } from '../../contexts/navigation'
import { useSettings } from '../../contexts/settings'

import { AddIcon, EditIcon, LessIcon } from '../_icons'
import { AgentHits } from '../AgentSettings'
import { CustomSearchBox } from '../Algolia'

export const DispatcherSettings = memo(() => {
	const { toggleAgentModal } = useNavigation()
	const { setSelected, isSelected, setIsEditing } = useSettings()

	useEffect(() => {
		setSelected(null)
	}, [])

	const handleEdit = () => {
		setIsEditing(true)
		toggleAgentModal()
	}

	const handleAdd = () => {
		setIsEditing(false)
		setSelected(null)
		toggleAgentModal()
	}

	const handleMinus = () => {}

	return (
		<Container>
			<InstantSearch indexName="prod_USERS" searchClient={searchClient}>
				<Configure filters="role:dispatcher" />
				<CustomSearchBox label="Search User" placeholder="Enter user name" />
				<AgentHits />
			</InstantSearch>

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
