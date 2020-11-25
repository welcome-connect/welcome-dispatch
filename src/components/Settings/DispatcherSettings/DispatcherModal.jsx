import styled from 'styled-components'

import { useSettings } from '@contexts/settings'
import { useNavigation } from '@contexts/navigation'
import { useFirestoreSub } from '@hooks/index'
import { SearchProvider } from '@contexts/search'

import { updateUserDocument } from '@services/firebase'

import { Button, Form } from '@styles/styled-components'
import { Configure, Hits, SearchBox } from '@components/common'
import { EditUserForm } from '../EditUserForm'
import { UserHit } from '@components/ui'

export const DispatcherModal = () => {
	const { isEditing, setSelected, isSelected } = useSettings()
	const { toggleDispatcherModal } = useNavigation()

	const [users] = useFirestoreSub('users', {
		where: ['role', '==', ''],
	})

	if (isEditing) {
		return <EditUserForm />
	}

	const onAdd = async dispatcher => {
		if (dispatcher) await updateUserDocument(dispatcher.id, { role: 'dispatcher' })
		setSelected(null)
		toggleDispatcherModal()
	}

	const onCancel = () => {
		setSelected(null)
		toggleDispatcherModal()
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
