import { useEffect, useState } from 'react'
import { db } from '../services/firebase'

export const useUsersSub = () => {
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		const unsubscribe = db.collection('users').onSnapshot(snapshot => {
			setTimeout(() => setRefresh(false), 100)
			setRefresh(true)
		})

		return () => unsubscribe()
	}, [db])

	return { refresh }
}
