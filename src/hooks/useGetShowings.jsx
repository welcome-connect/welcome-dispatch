import { useEffect, useState } from 'react'
import { db } from '../services/firebase'
import { useFirestoreSub } from './useFirestoreSub'

export const useGetShowings = teamId => {
	const [data, setData] = useState(null)
	const [agents] = useFirestoreSub('users', {
		where: [
			['teams', 'array-contains', teamId],
			['role', '==', 'agent'],
		],
	})

	useEffect(() => {
		const agentsWithShowings = agents.map(agent => {
			const showings = []
			db.collection('showings')
				.where('agentId', '==', agent.id)
				.onSnapshot(snapshot => {
					snapshot.forEach(doc => showings.push(doc.data()))
				})

			return { ...agent, showings }
		})

		setData(agentsWithShowings)
	}, [agents, teamId])

	return [data]
}
