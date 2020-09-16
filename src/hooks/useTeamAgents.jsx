import { useEffect, useState } from 'react'
import { db } from '../services/firebase'

export const useTeamAgents = teamId => {
	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(true)
	const [agents, setAgents] = useState([])

	useEffect(() => {
		let unsubscribe = () => {}
		if (teamId) {
			unsubscribe = db
				.collection('users')
				.where('teams', 'array-contains', teamId)
				.where('role', '==', 'agent')
				.onSnapshot(
					snapshot => {
						const agents = []
						snapshot.forEach(doc => agents.push(doc.data()))
						setLoading(false)
						setAgents(agents)
					},
					error => setError(error),
				)
		}

		return () => unsubscribe()
	}, [db])

	return { agents, loading, error }
}
