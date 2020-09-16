import { useEffect, useState } from 'react'
import { db } from '../services/firebase'

export const useTeamDispatchers = teamId => {
	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(true)
	const [dispatchers, setDispatchers] = useState([])

	useEffect(() => {
		let unsubscribe = () => {}
		if (teamId) {
			unsubscribe = db
				.collection('users')
				.where('teams', 'array-contains', teamId)
				.where('role', '==', 'dispatcher')
				.onSnapshot(
					snapshot => {
						const dispatchers = []
						snapshot.forEach(doc => dispatchers.push(doc.data()))
						setLoading(false)
						setDispatchers(dispatchers)
					},
					error => setError(error),
				)
		}

		return () => unsubscribe()
	}, [db])

	return { dispatchers, loading, error }
}
