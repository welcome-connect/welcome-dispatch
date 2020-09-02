import { useState } from 'react'
import { formatPhoneNumber } from '../utils'
import { useAuthSetters, useAuthState } from '../contexts/auth'
import { changeDisplayName, changeAuthEmail, changePhoneNumber } from '../services/firebase/users'

export const useUpdateUserProfile = () => {
	const [isLoading, setLoading] = useState(false)
	const [isSuccess, setSuccess] = useState(false)
	const [hasNoChanges, setHasNoChanges] = useState(false)
	const [authRequired, setAuthRequired] = useState(false)

	const { user, userObj } = useAuthState()
	const { setUserObj } = useAuthSetters()

	const updateUserProfile = async ({ displayName, email, phoneNumber }) => {
		setLoading(true)
		setSuccess(false)
		setHasNoChanges(false)
		setAuthRequired(false)

		const formattedPhone = formatPhoneNumber(phoneNumber)
		let updatedUser

		if (
			displayName === user.displayName &&
			email === user.email &&
			formattedPhone === userObj.phoneNumber
		) {
			setLoading(false)
			setHasNoChanges(true)
			return
		}

		try {
			if (displayName !== user.displayName) updatedUser = await changeDisplayName(user, displayName)
			if (email !== user.email) updatedUser = await changeAuthEmail(user, email)
			if (formattedPhone !== userObj.phoneNumber)
				updatedUser = await changePhoneNumber(user, formattedPhone)

			setUserObj(updatedUser)
			setLoading(false)
			setSuccess(true)
		} catch (error) {
			console.log(error)
			if (error.code === 'auth/requires-recent-login') {
				setAuthRequired(true)
				setLoading(false)
			}
		}
	}

	return { isLoading, isSuccess, hasNoChanges, authRequired, updateUserProfile }
}
