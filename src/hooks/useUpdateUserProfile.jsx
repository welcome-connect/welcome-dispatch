import { useState } from 'react'
import { useAuth } from '../contexts/auth'
import { changeDisplayName, changeAuthEmail, changePhoneNumber } from '../services/firebase/users'

export const useUpdateUserProfile = () => {
	const [isLoading, setLoading] = useState(false)
	const [isSuccess, setSuccess] = useState(false)
	const [hasNoChanges, setHasNoChanges] = useState(false)
	const [authRequired, setAuthRequired] = useState(false)

	const { setUserDoc, userAuth, userDoc } = useAuth()

	const updateUserProfile = async ({ displayName, email, phoneNumber }) => {
		console.log({ displayName, email, phoneNumber })
		setLoading(true)
		setSuccess(false)
		setHasNoChanges(false)
		setAuthRequired(false)

		let updatedUser

		if (
			displayName === userAuth.displayName &&
			email === userAuth.email &&
			phoneNumber === userDoc.phoneNumber
		) {
			setLoading(false)
			setHasNoChanges(true)
			return
		}

		try {
			if (displayName !== userAuth.displayName)
				updatedUser = await changeDisplayName(userAuth, displayName)
			if (email !== userAuth.email) updatedUser = await changeAuthEmail(userAuth, email)
			if (phoneNumber !== userDoc.phoneNumber)
				updatedUser = await changePhoneNumber(userAuth, phoneNumber)

			setUserDoc(updatedUser)
			setLoading(false)
			setSuccess(true)
		} catch (error) {
			if (error.code === 'auth/requires-recent-login') {
				setAuthRequired(true)
				setLoading(false)
				console.error(error)
			}
			console.error(error)
		}
	}

	return { isLoading, isSuccess, hasNoChanges, authRequired, updateUserProfile }
}
