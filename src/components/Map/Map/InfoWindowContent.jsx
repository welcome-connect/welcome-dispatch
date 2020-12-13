import { useFirestoreSub } from '@hooks/useFirestoreSub'
import { getUserDocument } from '@services/firebase'
import { getLead } from '@services/firebase/leads'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

export const InfoWindowContent = ({ showing }) => {
	const [agent, setAgent] = useState(null)
	const [lead, setLead] = useState(null)

	useEffect(() => {
		const asyncFetch = async () => {
			const l = await getLead(showing.leadId)
			const a = await getUserDocument(showing.agentId)
			setLead(l)
			setAgent(a)
		}

		asyncFetch()
	}, [])

	return agent && lead ? (
		<Container>
			<h3>{showing.propertyDetails.address.split(',').slice(0, 3).concat()}</h3>
			<p>{agent !== 'unassigned' ? `Assigned to ${agent.displayName}` : 'Unassigned'}</p>
			<p>{`Starts at ${showing.startTime} until ${showing.endTime}`}</p>
			<p>{`Lead: ${lead.displayName}`}</p>
		</Container>
	) : null
}

const Container = styled.div`
	p {
		font-size: 0.9rem;
	}
`
