import { useFirestoreSub } from '@hooks/useFirestoreSub'
import { db } from '@services/firebase'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ShowingNote } from '@components/showings'

export function ShowingFinalNotes({ showing }) {
	const [note, setNote] = useState(null)

	const [[finalNote]] = useFirestoreSub('showing-final-notes', {
		where: ['showingId', '==', showing.id]
	})

	useEffect(() => {
		if (showing.status === 'cancelled') {
			setNote({
				message: showing.cancelReason,
				createdBy: showing.agentName,
				date: showing.cancelledTime
			})
		}

		if (showing.status === 'completed' && finalNote) {
			setNote({
				message: finalNote.message,
				createdBy: showing.agentName,
				date: finalNote.createdAt.seconds
			})
		}
	}, [showing, finalNote])

	return (
		<Container>
			<h1>{`${showing.status === 'cancelled' ? 'Cancellation' : 'Completion'}`} notes</h1>
			{note ? <ShowingNote note={note} /> : <NoNotes>No notes available</NoNotes>}
		</Container>
	)
}

const Container = styled.section`
	grid-area: showing-notes;
	background: ${({ theme }) => theme.colors.bg.white};
	border-radius: 8px;
	padding: 2rem;

	h1 {
		margin-bottom: 0;
		font-weight: 600;
	}
`

const NoNotes = styled.p`
	font-style: italic;
	color: ${({ theme }) => theme.colors.text_light};
	padding: 24px 0;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border_light};
`
