import { getUserDocument } from '@services/firebase'
import { getLead } from '@services/firebase/leads'
import { format, fromUnixTime } from 'date-fns'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

export const InfoWindowContent = ({ showing }) => {
	const [agent, setAgent] = useState(null)
	const [lead, setLead] = useState(null)

	useEffect(() => {
		let isActive = true
		const asyncFetch = async () => {
			const l = await getLead(showing.leadId)
			const a = await getUserDocument(showing.agentId)

			if (isActive) {
				setLead(l)
				setAgent(a)
			}
		}

		asyncFetch()

		return () => {
			isActive = false
		}
	}, [])

	const from = format(fromUnixTime(showing.preStartTime), 'hh:mm a')
	const to = format(fromUnixTime(showing.preEndTime), 'hh:mm a')

	return agent && lead ? (
		<Container>
			<h3>{showing.address.split(',').slice(0, 3).concat()}</h3>
			<p>{agent.displayName ? `Assigned to ${agent.displayName}` : 'Unassigned'}</p>
			<p>
				{from} - {to}
			</p>
			<p>{`Lead: ${lead.displayName}`}</p>
		</Container>
	) : null
}

const Container = styled.div`
	p {
		font-size: 0.9rem;
	}
`
