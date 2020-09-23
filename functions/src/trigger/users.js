const functions = require('firebase-functions')
const { db, admin } = require('../admin')
const findSymmetricDiff = require('../utils')

exports.updateTeamCount = functions.firestore.document('users/{userId}').onUpdate(change => {
	const newData = change.after.data()
	const currentData = change.before.data()

	const teamsHasChange = newData.teams.length !== currentData.teams.length
	if (!teamsHasChange) return

	const [newTeamId] = findSymmetricDiff(newData.teams, currentData.teams)

	const teamRef = db.collection('teams').doc(newTeamId)

	if (newData.role === 'agent') {
		teamRef.update({ agent_count: admin.firestore.FieldValue.increment(1) })
	}

	if (newData.role === 'dispatcher') {
		teamRef.update({ dispatcher_count: admin.firestore.FieldValue.increment(1) })
	}

	console.log({
		message: 'THERE HAS BEEN A CHANGE TO THE TEAMS',
		newData,
		currentData,
		newTeamId,
	})
	return
})
