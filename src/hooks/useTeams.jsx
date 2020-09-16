import { useEffect, useState } from 'react'
import { db } from '../services/firebase'

export const useTeams = () => {
	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(true)
	const [teams, setTeams] = useState([])

	useEffect(() => {
		const unsubscribe = db.collection('teams').onSnapshot(
			snapshot => {
				const teams = []
				snapshot.forEach(doc => teams.push(doc.data()))
				setLoading(false)
				setTeams(teams)
			},
			error => setError(error),
		)

		return () => unsubscribe()
	}, [db])

	return { teams, loading, error }
}
