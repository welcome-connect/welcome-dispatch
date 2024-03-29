import { auth, db, functions, firebase } from './index'
import { getTeam } from './teams'

// CREATE OR FIND USER
export const createUserDocument = async (newUser, data) => {
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
				teams: [],
				role: '',
				...data
			})

			await newUser.updateProfile({ ...data })
		} catch (error) {
			console.error('Error creating new user: ', error.message)
		}
	}

	return getUserDocument(newUser.uid)
}

// GET USER DOCUMENT
export const getUserDocument = async uid => {
	if (!uid) return null

	try {
		const userDocument = await db.collection('users').doc(uid).get()
		return { uid, ...userDocument.data() }
	} catch (error) {
		console.error('Error fetching user: ', error.message)
	}
}

// UPDATE USER
export const updateUserDocument = async (uid, data) => {
	try {
		await db.collection('users').doc(uid).update(data)
	} catch (error) {
		console.error('Error updating user', error.message)
	}

	return getUserDocument(uid)
}

// CHANGE AUTH EMAIL
export const changeAuthEmail = async (user, newEmail) => {
	if (!user) throw new Error('User object required')
	if (!newEmail) throw new Error('New email required')

	await user.updateEmail(newEmail)
	await updateUserDocument(user.uid, { email: newEmail })

	const updated_user = await getUserDocument(user.uid)

	return updated_user
}

// CHANGE AUTH DISPLAY NAME
export const changeDisplayName = async (user, newDisplayName) => {
	if (!user) throw new Error('User object required')
	if (!newDisplayName) throw new Error('New display name required')

	await user.updateProfile({ displayName: newDisplayName })
	await updateUserDocument(user.uid, { displayName: newDisplayName })

	const updated_user = await getUserDocument(user.uid)

	return updated_user
}

//CHAGE HONE NUMBER
export const changePhoneNumber = async (user, newPhoneNumber) => {
	if (!user) throw new Error('User object required')
	if (!newPhoneNumber) throw new Error('New phone number required')

	await user.updateProfile({ phoneNumber: newPhoneNumber })
	await updateUserDocument(user.uid, { phoneNumber: newPhoneNumber })

	const updated_user = await getUserDocument(user.uid)
	return updated_user
}

// GET USER TEAMS DOCUMENTS
export const getUserTeams = async id => {
	const user = await getUserDocument(id)
	const requests = user.teams.map(teamId => getTeam(teamId))

	const teams = await Promise.all(requests)
	return teams
}
