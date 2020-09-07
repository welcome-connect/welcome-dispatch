import { ModalContainer } from '../ModalContainer'
import styled from 'styled-components'
import { Button } from '../../styles/styled-components'
import { useNavigation } from '../../contexts/navigation'

export const TeamModal = () => {
	const { toggleTeamEditModal } = useNavigation()
	const handleSave = () => {
		toggleTeamEditModal()
	}
	return (
		<Container>
			<h1>Team Modal</h1>
			<Button isPrimary onClick={handleSave}>
				Save
			</Button>
		</Container>
	)
}
const Container = styled.div`
	height: 100%;
	width: 100%;
  padding: 0 16px;
`
