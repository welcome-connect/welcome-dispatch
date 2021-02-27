const { TwilioClient, twilioNumber } = require('./config')

async function sendSMS(toNum, message) {
	return await TwilioClient.messages.create({
		body: message,
		to: toNum,
		from: twilioNumber
	})
}

module.exports = { sendSMS }
