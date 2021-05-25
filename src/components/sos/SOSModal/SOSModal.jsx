import { Modal } from '@components/common'
import { useFirestoreSub } from '@hooks/useFirestoreSub'
import { dismissSOSSignal } from '@services/firebase/sos-signal'
import { Button } from '@styles/styled-components'
import { format } from 'date-fns'
import { useState } from 'react'
import styled from 'styled-components'
import { SOSMap } from '../SOSMap'

export function SOSModal({ sosSignal }) {
	const [isLoading, setIsLoading] = useState(false)

	async function handleDismiss() {
		setIsLoading(true)
		await dismissSOSSignal(sosSignal.id)
	}

	const [[agent]] = useFirestoreSub('users', {
		where: ['id', '==', sosSignal.createdBy]
	})

	console.log({ agent, today: format(Date.now(), 'MM/dd/yyyy') })

	if (!sosSignal) return null

	return (
		<MModal>
			<h1>SOS Call !</h1>
			<h2>{sosSignal.message}</h2>
			<SOSMap center={{ lat: sosSignal.latitude, lng: sosSignal.longitude }} agentId={sosSignal.createdBy} />
			<ButtonContainer>
				<Button isPrimary onClick={handleDismiss}>
					Dismiss
				</Button>
				{isLoading ? <p>Dismissing SOS Call...</p> : null}
			</ButtonContainer>
		</MModal>
	)
}

const MModal = styled(Modal)`
	h1 {
		color: ${({ theme }) => theme.colors.error_text};
	}

	h2 {
		margin-bottom: 2rem;
	}
`

const ButtonContainer = styled.div`
	display: flex;
  align-items: center;
	margin-top: 2rem;
	button {
		margin-right: 1rem;
	}
`
