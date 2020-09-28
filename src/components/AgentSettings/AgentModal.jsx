import { useSettings } from '../../contexts/settings'
import styled from 'styled-components'

import { useNavigation } from '../../contexts/navigation'

import { Button, Form } from '../../styles/styled-components'

import { EditUserForm } from '../EditUserForm'
import { updateUserDocument } from '../../services/firebase'
import { Configure, Hits, SearchBox } from '../Search'
import { UserHit } from '../UserHit'
import { useFirestoreSub } from '../../hooks'
import { SearchProvider } from '../../contexts/search/SearchProvider'

export const AgentModal = () => {
	const { isEditing, setSelected, isSelected } = useSettings()
	const { toggleAgentModal } = useNavigation()

	const [users] = useFirestoreSub('users', {
		where: ['role', '==', ''],
	})

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
			<SearchProvider data={users}>
				<Configure filters={['displayName', 'email']} display={false} />
				<SearchBox label="Search users" />
				<Hits hitComponent={UserHit} />
			</SearchProvider>
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
