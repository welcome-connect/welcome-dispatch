const functions = require('firebase-functions')
const algoliasearch = require('algoliasearch')

const APP_ID = functions.config().algolia.app
const ADMIN_KEY = functions.config().algolia.key

const client = algoliasearch(APP_ID, ADMIN_KEY)
const usersIndex = client.initIndex('prod_USERS')
const showingsIndex = client.initIndex('prod_SHOWINGS')
const teamsIndex = client.initIndex('prod_TEAMS')

// USERS
exports.addToUsersIndex = functions.firestore.document('users/{userId}').onCreate(snapshot => {
	const data = snapshot.data()
	const objectID = snapshot.id

	return usersIndex.saveObject({ ...data, objectID })
})

exports.updateUsersIndex = functions.firestore.document('users/{userId}').onUpdate(change => {
	const newData = change.after.data()
	const objectID = change.after.id

	return usersIndex.saveObject({ ...newData, objectID })
})

exports.deleteFromUsersIndex = functions.firestore
	.document('users/{userId}')
	.onDelete(snapshot => usersIndex.deleteObject(snapshot.id))

// SHOWINGS
exports.addToShowingsIndex = functions.firestore.document('showings/{showingId}').onCreate(snapshot => {
	const data = snapshot.data()
	const objectID = snapshot.id

	return showingsIndex.saveObject({ ...data, objectID })
})

exports.updateShowingsIndex = functions.firestore.document('showings/{showingId}').onUpdate(change => {
	const newData = change.after.data()
	const objectID = change.after.id

	return showingsIndex.saveObject({ ...newData, objectID })
})

exports.deleteFromShowingsIndex = functions.firestore
	.document('showings/{showingId}')
	.onDelete(snapshot => showingsIndex.deleteObject(snapshot.id))

// TEAMS
exports.addToTeamsIndex = functions.firestore.document('teams/{teamId}').onCreate(snapshot => {
	const data = snapshot.data()
	const objectID = snapshot.id

	return teamsIndex.saveObject({ ...data, objectID })
})

exports.updateTeamsIndex = functions.firestore.document('teams/{teamId}').onUpdate(change => {
	const newData = change.after.data()
	const objectID = change.after.id

	return teamsIndex.saveObject({ ...newData, objectID })
})

exports.deleteFromTeamsIndex = functions.firestore
	.document('teams/{teamId}')
	.onDelete(snapshot => teamsIndex.deleteObject(snapshot.id))
