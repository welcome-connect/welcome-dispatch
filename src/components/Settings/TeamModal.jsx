import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSettings } from '../../contexts/settings'
import { InstantSearch, Configure } from 'react-instantsearch-dom'
import styled from 'styled-components'

import { searchClient } from '../../services/algolia'
import { useNavigation } from '../../contexts/navigation'
import { useTeamAgents, useTeamDispatchers, useUsersSub } from '../../hooks'

import {
	Button,
	Form,
	Input,
	FieldGroup,
	Label,
	SettingsInput,
} from '../../styles/styled-components'

import { CustomHits } from './CustomHit'
import { CustomSearchBox } from './CustomSearchBox'

export const TeamModal = () => {
	const { toggleTeamEditModal } = useNavigation()
	const { register, errors, handleSubmit, setValue } = useForm()
	const {
		isEditingTeam,
		selectedTeam,
		setSelectedTeam,
		selectedAgents,
		selectedDispatchers,
		setSelectedAgents,
		setSelectedDispatchers,
	} = useSettings()

	const { refresh } = useUsersSub()
	const { agents } = useTeamAgents(selectedTeam?.id)
	const { dispatchers } = useTeamDispatchers(selectedTeam?.id)

	const onSubmit = () => {
		setSelectedTeam(null)
		setSelectedAgents()
		setSelectedDispatchers()
		toggleTeamEditModal()
	}

	useEffect(() => {
		if (isEditingTeam) {
			setValue('name', selectedTeam.name)
		}
	}, [])

	console.log('RE-RENDERING!!!', {
		agents,
		dispatchers,
		selectedTeam,
		selectedAgents,
		selectedDispatchers,
		isEditingTeam,
	})

	return (
		<Container>
			<h1>{isEditingTeam ? `Editing ${selectedTeam?.name} Team` : 'Adding New Team'}</h1>
			<ModifiedForm onSubmit={handleSubmit(onSubmit)}>
				<ModifiedFieldGroup>
					<Label htmlFor="name">Name</Label>
					<SettingsInput type="text" name="name" ref={register} hasError={errors.name} />
				</ModifiedFieldGroup>
				<ModifiedButton isPrimary>{isEditingTeam ? 'Save' : 'Add'}</ModifiedButton>
			</ModifiedForm>
			<ListContainer>
				<ModifiedLabel>Agents</ModifiedLabel>
				<List>
					{agents.map(agent => (
						<ListItem key={agent.id}>
							<p>{agent.displayName}</p>
						</ListItem>
					))}
					{selectedAgents.map(agent => (
						<ListItem key={agent.id}>
							<p>{agent.displayName}</p>
						</ListItem>
					))}
				</List>
			</ListContainer>
			<ListContainer>
				<ModifiedLabel>Dispatchers</ModifiedLabel>
				<List>
					{dispatchers.map(dispatcher => (
						<ListItem key={dispatcher.id}>
							<p>{dispatcher.displayName}</p>
						</ListItem>
					))}
					{selectedDispatchers.map(dispatcher => (
						<ListItem key={dispatcher.id}>
							<p>{dispatcher.displayName}</p>
						</ListItem>
					))}
				</List>
			</ListContainer>
			<InstantSearch indexName="prod_USERS" searchClient={searchClient} refresh={refresh}>
				<Configure hitsPerPage={4} />
				<CustomSearchBox label="Search User" placeholder="Enter user name" />
				<CustomHits />
			</InstantSearch>
		</Container>
	)
}
const Container = styled.div`
	height: 100%;
	width: 100%;
	padding: 8px 32px;
	position: relative;
`

const ModifiedForm = styled(Form)`
	padding: 1rem 0;
	background-color: transparent;
	width: 100%;
`

const ModifiedFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`

const ModifiedButton = styled(Button)`
	position: absolute;
	right: 32px;
	bottom: 12px;
`

const ListContainer = styled.ul``
const List = styled(FieldGroup)`
	background: white;
	padding: 8px 8px;
	border-radius: 4px;
	margin-top: 4px;
	min-height: 96px;
`

const ListItem = styled.li`
	display: flex;
	justify-content: space-between;
`
const ModifiedLabel = styled(Label)`
	color: ${({ theme: { colors } }) => colors.text};
`
