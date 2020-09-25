import { useSettings } from '../../contexts/settings'
import { InstantSearch, Configure } from 'react-instantsearch-dom'
import styled from 'styled-components'

import { searchClient } from '../../services/algolia'
import { useNavigation } from '../../contexts/navigation'

import { Button, Form, FieldGroup, ErrorMessage } from '../../styles/styled-components'

import { CustomSearchBox } from '../Algolia'
import { IndexResults } from '../Algolia/IndexResults'
import { EditUserForm } from '../EditUserForm'
import { updateUserDocument } from '../../services/firebase'
import { AgentHits } from './AgentHits'

export const AgentModal = () => {
	const { isEditing, setSelected, isSelected } = useSettings()
	const { toggleAgentModal } = useNavigation()

	if (isEditing) {
		return <EditUserForm />
	}

	const onAdd = async agent => {
		if (agent) await updateUserDocument(agent.id, { role: 'agent' })
		setSelected(null)
		toggleAgentModal()
	}

	const onCancel = () => {
		setSelected(null)
		toggleAgentModal()
	}

	return (
		<Container>
			<InstantSearch indexName="prod_USERS" searchClient={searchClient}>
				<CustomSearchBox label="Search User" placeholder="Enter user name" />
				<IndexResults>
					<Configure hitsPerPage={4} />
					<AgentHits />
				</IndexResults>
			</InstantSearch>
			<ModifiedButton isPrimary className="cancel" onClick={onCancel}>
				Cancel
			</ModifiedButton>
			<ModifiedButton isPrimary onClick={() => onAdd(isSelected)}>
				Add
			</ModifiedButton>
		</Container>
	)
}

const Container = styled.div`
	height: 100%;
	width: 100%;
	padding: 8px 32px;
	position: relative;
`
const ModifiedButton = styled(Button)`
	position: absolute;
	right: 32px;
	bottom: 12px;

	&.cancel {
		left: 32px;
	}
`

const ModifiedForm = styled(Form)`
	padding: 1rem 0;
	background-color: transparent;
	width: 100%;
`

const ModifiedFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`

const ModifiedErrorMessage = styled(ErrorMessage)`
	position: static;
	font-size: 1rem;
`
