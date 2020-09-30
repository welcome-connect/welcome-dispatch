import { auth, db, firebase } from './index'
import { getUserDocument } from './users'

// CREATE TEAM
export const createTeam = async team => {
	console.log({ team })
	if (!team) throw new Error('Team information required')

	let teamRef
	if (team.id) teamRef = db.collection('teams').doc(team.id)
	else teamRef = db.collection('teams').doc()

	const teamSnapshot = await teamRef.get()
	console.log({ teamSnapshot: teamSnapshot.data(), teamRef })

	if (!teamSnapshot.exists) {
		console.log('TEAM DOESNT EXISTS', teamSnapshot.exists)
		const createdAt = firebase.firestore.FieldValue.serverTimestamp()
		const teamModel = { id: teamRef.id, createdAt, agent_count: 0, dispatcher_count: 0, ...team }

		try {
			await teamRef.set(teamModel)
			return getTeam(teamRef.id)
		} catch (error) {
			console.error('Error creating new team: ', error.message)
		}
	} else {
		return getTeam(team.id)
	}
}

// GET TEAM DOCUMENT
export const getTeam = async id => {
	if (!id) return new Error('Id required')

	try {
		const teamDocument = await db.collection('teams').doc(id).get()
		return { id, ...teamDocument.data() }
	} catch (error) {
		console.error('Error fetching team: ', error.message)
	}
}

// UPDATE / EDIT TEAM
export const updateTeam = async (id, data) => {
	try {
		await db
			.collection('teams')
			.doc(id)
			.update({ ...data })
	} catch (error) {
		console.error('Error updating team: ', error.message)
	}

	return getTeam(id)
}

// DELETE TEAM

// ADD AGENT TO TEAM
export const addUserToTeam = async (teamId, userId) => {
	if (!teamId || !userId) return new Error('Team id and agent id are required')

	const userRef = db.collection('users').doc(userId)
	console.log({ userRef })

	try {
		await userRef.update({ teams: firebase.firestore.FieldValue.arrayUnion(teamId) })
	} catch (error) {
		console.error('Error updating team and/or agent: ', error.message)
	}

	return { updated_team: getTeam(teamId), updated_agent: getUserDocument(userId) }
}

// REMOVE AGENT FROM TEAM
