import { createContext, useEffect, useReducer, useContext, ReactChildren, ReactChild } from 'react'
import { useRouter } from 'next/router'

import { auth, createUserDocument } from '../../services/firebase'
import { types, initialState, authReducer } from './state'

// Creates context
export const AuthStateContext = createContext()
export const AuthSetterContext = createContext()

// Hooks for child components to get access to the auth state and setters
export const useAuthState = () => useContext(AuthStateContext)
export const useAuthSetters = () => useContext(AuthSetterContext)

// Auth provider that makes auth object and makes it available when calling useAuth()
const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState)
	const router = useRouter()

	// Signs user in
	const signin = async (email, password) => {
		dispatch({ type: types.FETCH_REQ })

		try {
			await auth.signInWithEmailAndPassword(email, password)
			dispatch({ type: types.SIGN_IN_UP_SUCCESS })
		} catch (error) {
			console.error('Error signing in: ', error.message)
			dispatch({ type: types.FETCH_FAILED, payload: error.message })
		}
	}

	// Signs user out
	const signout = async () => {
		dispatch({ type: types.FETCH_REQ })

		try {
			await auth.signOut()
			dispatch({ type: types.SIGNOUT_SUCCESS })
			router.push('/')
		} catch (error) {
			console.error('Error signing out: ', error.message)
			dispatch({ type: types.FETCH_FAILED, payload: error.message })
		}
	}

	// Signs user up
	const signup = async data => {
		dispatch({ type: types.FETCH_REQ })
		const { email, password, name } = data

		try {
			const newUser = await auth.createUserWithEmailAndPassword(email, password)

			await createUserDocument(newUser.user, {
				displayName: name,
			})

			dispatch({ type: types.SIGN_IN_UP_SUCCESS })
		} catch (error) {
			console.error('Error signing up: ', error.message)
			dispatch({ type: types.FETCH_FAILED, payload: error.message })
		}
	}

	// Handles user on user change and on app mount / unmount
	const handleUser = user => {
		if (!user) {
			if (router.pathname.indexOf('/signup') > -1) {
				return
			} else {
				router.push('/')
			}
		}

		// Setting user to auth state
		dispatch({ type: types.SET_USER, payload: user })
	}

	useEffect(() => {
		// Subscribes to auth user on mount
		const unsubscribeFromAuth = auth.onAuthStateChanged(handleUser)

		// Unsubscribes to auth on unmount
		return () => unsubscribeFromAuth()
	}, [router.pathname])

	return (
		<AuthStateContext.Provider value={{ ...state }}>
			<AuthSetterContext.Provider value={{ signin, signup, signout }}>
				{children}
			</AuthSetterContext.Provider>
		</AuthStateContext.Provider>
	)
}

export default AuthProvider