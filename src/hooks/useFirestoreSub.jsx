import { useEffect, useState } from 'react'
import { db } from '../services/firebase'

export const useFirestoreSub = (path, options = {}) => {
	const [error, setError] = useState(undefined)
	const [status, setStatus] = useState('idle')
	const [data, setData] = useState([])

	const { where } = options

	const hasMultipleConditions = conditions => Array.isArray(conditions[0])

	useEffect(() => {
		setStatus('loading')
		let ref = db.collection(path)

		if (where) {
			if (hasMultipleConditions(where)) {
				where.forEach(w => {
					ref = ref.where(w[0], w[1], w[2] || '')
				})
			} else {
				ref = ref.where(w[0], w[1], w[2] || '')
			}
		}

		const unsubscribe = ref.onSnapshot(
			snapshot => {
				const data = []
				snapshot.forEach(doc => data.push(doc.data()))
				setStatus('success')
				setData(data)
			},
			error => {
				setError(error)
				setStatus('error')
			},
		)

		return () => unsubscribe()
	}, [db])

	return [data, status, error]
}
