const functions = require('firebase-functions')
const { db, admin } = require('../admin')
const { sendSMS } = require('../services/twilio/sendSMS')

module.exports = functions.https.onCall(async ({ agentId, outingId, showingId }, context) => {
	const agent = (await db.collection('users').doc(agentId).get()).data()
	const message = `New showing assignment. For details click in the link below: \nhttps://agents.welcome.org/outings/${outingId}/showings/${showingId}`
	if (agent.phoneNumber) {
		await sendSMS(agent.phoneNumber, message)
		return
	}
})
