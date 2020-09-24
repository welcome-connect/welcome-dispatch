import { useEffect, useState } from 'react'
import { db } from '../services/firebase'

export const useUsersSub = () => {
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		const unsubscribe = db.collection('users').onSnapshot(snapshot => {
			const id = setTimeout(() => setRefresh(false), 2000)
			setRefresh(true)

			return clearTimeout(id)
		})

		return () => unsubscribe()
	}, [db])

	return { refresh }
}
