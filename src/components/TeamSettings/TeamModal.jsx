import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSettings } from '../../contexts/settings'
import styled from 'styled-components'

import { useNavigation } from '../../contexts/navigation'
import { useFirestoreSub } from '../../hooks'

import { Button, Form, FieldGroup, Label, SettingsInput } from '../../styles/styled-components'

import { TeamUsersHit } from './TeamUsersHit'
import { addUserToTeam, createTeam } from '../../services/firebase/teams'
import { SearchProvider } from '../../contexts/search/SearchProvider'
import { Configure, Hits, SearchBox } from '../Search'

export const TeamModal = () => {
	const { toggleTeamModal } = useNavigation()
	const { register, errors, handleSubmit, setValue } = useForm()
	const {
		isEditing,
		isSelected,
		setSelected,
		selectedAgents,
		selectedDispatchers,
		setSelectedAgents,
		setSelectedDispatchers,
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

	const [users] = useFirestoreSub('users', {
		where: ['role', '!=', ''],
	})

	const onSubmit = async ({ name }) => {
		try {
			let newTeam
			if (isEditing) newTeam = await createTeam({ name, id: isSelected.id })
			else newTeam = await createTeam({ name })

			const users = [...selectedAgents, ...selectedDispatchers]
			const requests = users.map(user => addUserToTeam(newTeam.id, user.id))
			await Promise.all(requests)
		} catch (error) {
			console.error('Error creating new team: ', error.message)
		}

		onCancel()
	}

	const onCancel = () => {
		setSelected(null)
		setSelectedAgents()
		setSelectedDispatchers()
		toggleTeamModal()
	}

	useEffect(() => {
		setSelectedAgents()
		setSelectedDispatchers()
		if (isEditing) {
			setValue('name', isSelected.name)
		}
	}, [])

	return (
		<Container>
			<h1>{isEditing ? `Editing ${isSelected?.name} Team` : 'Adding New Team'}</h1>
			<ModifiedForm onSubmit={handleSubmit(onSubmit)}>
				<ModifiedFieldGroup>
					<Label htmlFor="name">Name</Label>
					<SettingsInput
						type="text"
						name="name"
						ref={register({ required: 'Name is required' })}
						hasError={errors.name}
						placeholder="Enter team name"
					/>
				</ModifiedFieldGroup>
				<ModifiedButton isPrimary>{isEditing ? 'Save' : 'Add'}</ModifiedButton>
				<ModifiedButton isPrimary className="cancel" onClick={onCancel}>
					Cancel
				</ModifiedButton>
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
			<SearchProvider data={users}>
				<Configure filters={['displayName', 'email', 'role']} display={false} hitsPerPage={4} />
				<SearchBox label="Search users" />
				<Hits hitComponent={TeamUsersHit} />
			</SearchProvider>
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

	&.cancel {
		left: 32px;
	}
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
	font-size: 14px;
`
const ModifiedLabel = styled(Label)`
	color: ${({ theme: { colors } }) => colors.text};
`
