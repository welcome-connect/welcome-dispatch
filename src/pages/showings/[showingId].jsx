import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { format, fromUnixTime } from 'date-fns'

import { db } from '@services/firebase'
import { useFirestoreSub } from '@hooks/useFirestoreSub'

import { Layout } from '@components/common'
import { ShowingsIcon } from '@components/icons'
import { OutingNotes, ShowingDetails, ShowingFinalNotes } from '@components/showings'
import { Button, Flex } from '@styles/styled-components'

export default function ShowingPage() {
	const [showing, setShowing] = useState({})
	const [status, setStatus] = useState('loading')

	const router = useRouter()
	const { showingId } = router.query

	const [[partialShowing]] = useFirestoreSub('showings', {
		where: ['id', '==', showingId]
	})

	const from = () => format(fromUnixTime(showing.preStartTime), 'hh:mm a')
	const to = () => format(fromUnixTime(showing.preEndTime), 'hh:mm a')

	async function fetchCompleteShowing() {
		const getCompleteShowing = async () => {
			const agent = (await db.collection('users').doc(partialShowing.agentId).get()).data()
			const lead = (await db.collection('leads').doc(partialShowing.leadId).get()).data()
			return {
				...partialShowing,
				agentEmail: agent.email,
				agentPhoneNumber: agent.phoneNumber,
				agentName: agent.displayName,
				leadName: lead.displayName,
				leadPhoneNumber: lead.phoneNumber
			}
		}
		const completeShowing = await getCompleteShowing()
		setShowing(completeShowing)
		setStatus('success')
	}

	useEffect(() => {
		if (partialShowing) fetchCompleteShowing()
	}, [partialShowing])

	console.log(showing)

	return (
		<Layout title="Showings" icon={<ShowingsIcon fill="#383F51" />}>
			<Container>
				{status === 'loading' ? (
					<div>Loading...</div>
				) : (
					<>
						<ShowingDetails showing={showing} />
						<ShowingFinalNotes showing={showing} />
						<OutingNotes showing={showing} />

					</>
				)}
			</Container>
		</Layout>
	)
}

const Container = styled.div`
	height: 100%;
	width: 100%;
	padding: 2rem;
	position: relative;

	display: grid;
	grid-template-columns: 3.5fr 1fr;
	grid-template-rows: 1fr 3fr;
	grid-template-areas:
		'details showing-notes'
		'details outing-notes';
	grid-gap: 2rem;

	h1 {
		margin-bottom: 32px;
	}
`
