import { useState } from 'react'
import { updateUser } from '../services/firebase'
import { formatPhoneNumber } from '../utils'

export const useUpdateAgent = () => {
	const [isLoading, setLoading] = useState(false)
	const [isSuccess, setSuccess] = useState(false)
	const [hasNoChanges, setHasNoChanges] = useState(false)
	const [authRequired, setAuthRequired] = useState(false)

	const updateAgent = async (agent, changes) => {
		console.log({ agent, changes })
		setLoading(true)
		setSuccess(false)
		setHasNoChanges(false)
		setAuthRequired(false)

		const formattedPhone = formatPhoneNumber(changes.phoneNumber)
		let updatedUser

		if (
			agent.displayName === changes.displayName &&
			agent.email === changes.email &&
			formattedPhone === agent.phoneNumber
		) {
			setLoading(false)
			setHasNoChanges(true)
			return
		}

		try {
			console.log('UPDATING USER')
			updatedUser = await updateUser(agent.id, changes)
			console.log({ updatedUser })
			setLoading(false)
			setSuccess(true)
			return updatedUser
		} catch (error) {
			if (error.code === 'auth/requires-recent-login') {
				setAuthRequired(true)
				setLoading(false)
			}
			console.error(error)
		}
	}

	return { isLoading, isSuccess, hasNoChanges, authRequired, updateAgent }
}
