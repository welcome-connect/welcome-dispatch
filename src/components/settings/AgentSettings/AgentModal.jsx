import styled from 'styled-components'

import { useSettings } from '@contexts/settings'
import { useNavigation } from '@contexts/navigation'
import { useFirestoreSub } from '@hooks/index'

import { SearchProvider } from '@contexts/search'
import { updateUserDocument } from '@services/firebase'

import { Button, Form } from '@styles/styled-components'
import { EditUserForm } from '../EditUserForm'
import { Configure, Hits, SearchBox } from '@components/common'
import { UserHit } from '@components/ui'

export const AgentModal = () => {
	const { isEditing, setSelected, isSelected } = useSettings()
	const { toggleAgentModal } = useNavigation()

	const [users] = useFirestoreSub('users', {
		where: ['role', '==', '']
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
				<ul>
					<Hits hitComponent={UserHit} />
				</ul>
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
