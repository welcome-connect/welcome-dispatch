const functions = require('firebase-functions')
const { db, admin } = require('../admin')

exports.updateOnShowingChange = functions.firestore.document('showings/{showingId}').onUpdate((change, context) => {
	const newData = change.after.data()
    const currentData = change.before.data()
    
    

	const removedFromTeam = newData.teams.length < currentData.teams.length
	const addedToTeam = newData.teams.length > currentData.teams.length

	const [teamId] = findSymmetricDiff(newData.teams, currentData.teams)
	const teamRef = db.collection('teams').doc(teamId)
	const attribute = `${newData.role}_count`

	if (addedToTeam) teamRef.update({ [attribute]: admin.firestore.FieldValue.increment(1) })
	if (removedFromTeam) teamRef.update({ [attribute]: admin.firestore.FieldValue.increment(-1) })

	console.log({
		message: 'THERE HAS BEEN A CHANGE TO THE TEAMS',
		newData,
		currentData,
		teamId,
	})

	return
})
