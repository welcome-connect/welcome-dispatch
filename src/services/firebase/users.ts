import { auth, db, functions, firebase } from './index'
import { User } from 'firebase'

// CREATE OR FIND USER
export const createUserDocument = async (newUser: User, data: User) => {
	if (!newUser) return

	const userRef = db.doc(`users/${newUser.uid}`)
	const snapshot = await userRef.get()

	if (!snapshot.exists) {
		const { email } = newUser
		const createdAt = firebase.firestore.FieldValue.serverTimestamp()

		try {
			await userRef.set({
				id: newUser.uid,
				email,
				createdAt,
				...data,
			})
		} catch (error) {
			console.error('Error creating new user: ', error.message)
		}
	}

	return getUserDocument(newUser.uid)
}

// GET USER DOCUMENT
export const getUserDocument = async (uid: string) => {
	if (!uid) return null

	try {
		const userDocument = await db.collection('users').doc(uid).get()

		return { uid, ...userDocument.data() }
	} catch (error) {
		console.error('Error fetching user: ', error.message)
	}
}

// UPDATE USER
export const updateUser = async (uid: string, data: User) => {
	try {
		await db.collection('users').doc(uid).update(data)
	} catch (error) {
		console.error('Error updating user', error.message)
	}

	return getUserDocument(uid)
}
