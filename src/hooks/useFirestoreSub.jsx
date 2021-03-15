import { useEffect, useState } from 'react'
import { db } from '../services/firebase'
import { deepEqual } from '../utils'
import { useMemoCompare } from './useMemoCompare'

export const useFirestoreSub = (path, options = {}) => {
	const [error, setError] = useState(null)
	const [status, setStatus] = useState('idle')
	const [data, setData] = useState([])

	const { where } = options

	const optionsCache = useMemoCompare(options, prevOptions => {
		return prevOptions && options && deepEqual(options, prevOptions)
	})

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
				ref = ref.where(where[0], where[1], where[2] || '')
			}
		}

		const unsubscribe = ref.onSnapshot(
			snapshot => {
				const data = []
				// console.log(path, { ref, where, snapshot: snapshot.docs })
				snapshot.forEach(doc => data.push(doc.data()))
				setStatus('success')
				setData(data)
			},
			error => {
				setError(error)
				setStatus('error')
			}
		)

		return () => unsubscribe()
	}, [optionsCache])

	return [data, status, error]
}
