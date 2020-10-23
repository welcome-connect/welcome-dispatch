import { createContext, useEffect, useReducer, useContext } from 'react'
import { useRouter } from 'next/router'

import { auth, createUserDocument, getUserDocument } from '../../services/firebase'
import { types, initialState, authReducer } from './state'
import { getTeam } from '../../services/firebase/teams'

// Creates context
export const AuthContext = createContext()

// Hooks for child components to get access to the auth state and setters
export const useAuth = () => useContext(AuthContext)

// Auth provider that makes auth object and makes it available when calling useAuth()
export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState)
	const router = useRouter()

	// Signs user in
	const signin = async (email, password) => {
		dispatch({ type: types.FETCH_REQ })

		try {
			await auth.signInWithEmailAndPassword(email, password)
			dispatch({ type: types.SIGN_IN_SUCCESS })
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

			dispatch({ type: types.SIGN_IN_SUCCESS })
		} catch (error) {
			console.error('Error signing up: ', error.message)
			dispatch({ type: types.FETCH_FAILED, payload: error.message })
		}
	}

	// Set user object
	const setUserDoc = user => dispatch({ type: types.SET_USER_DOC, payload: user })

	// Handles user on user change and on app mount / unmount
	const handleUser = async user => {
		if (!user) {
			if (router.pathname.indexOf('/signup') > -1) {
				return
			} else {
				router.push('/')
				return
			}
		}

		const userDoc = await getUserDocument(user.uid)
		let userTeam
		if (userDoc?.teams?.length > 0) {
			userTeam = await getTeam(userDoc?.teams[0])
		}
		// Setting user to auth state
		dispatch({ type: types.SET_USER, payload: user })
		dispatch({ type: types.SET_USER_DOC, payload: userDoc })
		dispatch({ type: types.SET_USER_TEAM, payload: userTeam })
		router.push('/dispatch')
	}

	useEffect(() => {
		// Subscribes to auth user on mount
		const unsubscribeFromAuth = auth.onAuthStateChanged(handleUser)

		// Unsubscribes to auth on unmount
		return () => unsubscribeFromAuth()
	}, [router.pathname])

	return (
		<AuthContext.Provider value={{ ...state, signin, signup, signout, setUserDoc }}>
			{children}
		</AuthContext.Provider>
	)
}
