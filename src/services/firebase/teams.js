import { FieldValue } from '@google-cloud/firestore'
import { auth, db, functions, firebase } from './index'
import { getUserDocument } from './users'

// CREATE TEAM
export const createTeam = async newTeam => {
	if (!newTeam) throw new Error('Team information required')

	const teamRef = db.collection('teams').doc()
	const teamSnapshot = await teamRef.get()

	if (!teamSnapshot.exists) {
		const createdAt = firebase.firestore.FieldValue.serverTimestamp()
		const teamModel = { id: teamRef.id, createdAt, ...newTeam }

		try {
			await teamRef.set(teamModel)
			return getTeamDocument()
		} catch (error) {
			console.error('Error creating new team: ', error.message)
		}
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
export const addAgentToTeam = async (teamId, agentId) => {
	if (!teamId || !agentId) return new Error('Team id and agent id are required')

	const teamRef = db.collection('teams').doc(teamId)
	const agentRef = db.collection('users').doc(agentId)

	try {
		await agentRef.update({ teams: FieldValue.arrayUnion(teamId) })
		await teamRef.update({ agent_count: FieldValue.increment(1) })
	} catch (error) {
		console.error('Error updating team and/or agent: ', error.message)
	}

	return { updated_team: getTeam(teamId), updated_agent: getUserDocument(agentId) }
}

// REMOVE AGENT FROM TEAM
