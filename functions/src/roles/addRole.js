const functions = require('firebase-functions')
const { admin } = require('../admin')

exports.addRole = functions.https.onCall((data, context) => {
	//check request is made by admin
	if (context.auth.token.admin !== true) {
		return { error: 'only admins can add other admins' }
	}
	//get user and add custom claim (admin)
	return admin
		.auth()
		.getUserByEmail(data.email)
		.then(user => admin.auth().setCustomUserClaims(user.uid, { admin: data.role }))
		.then(() => {
			return { message: 'success!' }
		})
		.catch(error => {
			return { message: error.message }
		})
})
