import { useState } from 'react'
import { updateUserDocument } from '../services/firebase'

export const useUpdateUser = () => {
	const [isLoading, setLoading] = useState(false)
	const [isSuccess, setSuccess] = useState(false)
	const [hasNoChanges, setHasNoChanges] = useState(false)
	const [authRequired, setAuthRequired] = useState(false)

	const updateUser = async (user, changes) => {
		setLoading(true)
		setSuccess(false)
		setHasNoChanges(false)
		setAuthRequired(false)

		let updatedUser

		if (
			user.displayName === changes.displayName &&
			user.email === changes.email &&
			user.phoneNumber === changes.phoneNumber
		) {
			setLoading(false)
			setHasNoChanges(true)
			return user
		}

		try {
			console.log('UPDATING USER')
			updatedUser = await updateUserDocument(user.id, changes)
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

	return { isLoading, isSuccess, hasNoChanges, authRequired, updateUser }
}
