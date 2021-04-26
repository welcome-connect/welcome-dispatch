import styled from 'styled-components'
import { useFirestoreSub } from '@hooks/useFirestoreSub'
import { ShowingNote } from '../ShowingNote/ShowingNote'

export function OutingNotes({ showing }) {
	const [outingNotes] = useFirestoreSub('outing-notes', {
		where: ['outingId', '==', showing.outingId]
	})

	return (
		<Container>
			<h1>Outing notes</h1>
			{outingNotes.length ? (
				outingNotes.map(note => {
					return (
						<ShowingNote
							note={{ message: note.message, date: note.createdAt.seconds, createdBy: showing.agentName }}
							key={note.id}
						/>
					)
				})
			) : (
				<NoNotes>No notes available</NoNotes>
			)}
		</Container>
	)
}

const Container = styled.section`
	grid-area: outing-notes;
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
