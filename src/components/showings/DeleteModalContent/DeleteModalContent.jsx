import { deleteShowing } from '@services/firebase/showings'
import { Button } from '@styles/styled-components'
import { useRouter } from 'next/router'
import styled from 'styled-components'

export function DeleteModalContent({ showingId }) {
	const router = useRouter()

	async function handleDeleteShowing() {
		const deleted = await deleteShowing(showingId)
		if (deleted) router.push('/showings')
	}

	return (
		<Container>
			<p>Are you absolutely sure?</p>
			<Info>Unexpected bad things will happen if you don’t read this! </Info>
			<p>This action cannot be undone. This will permanently delete the showing.</p>
			<Button isPrimary onClick={handleDeleteShowing}>
				Delete
			</Button>
		</Container>
	)
}

const Container = styled.div`
	max-width: 440px;
	p {
		padding: 0 1rem;
		&:first-child {
			margin-bottom: 1rem;
		}
	}

	button {
		width: 100%;
		margin-top: 2rem;
		background-color: ${({ theme }) => theme.colors.red.accent};

		&.active,
		&:hover,
		&:active,
		&:focus {
			background-color: ${({ theme: { colors } }) => colors.red.bg_hover};
		}
	}
`

const Info = styled.p`
	margin: 0.5rem 0;
	padding-top: 1rem !important;
	padding-bottom: 1rem !important;
	border-top: 1px solid ${({ theme }) => theme.colors.yellow.accent};
	border-bottom: 1px solid ${({ theme }) => theme.colors.yellow.accent};
	color: ${({ theme }) => theme.colors.yellow.text};
	font-weight: 500;
	background-color: ${({ theme }) => theme.colors.yellow.bg};
`
