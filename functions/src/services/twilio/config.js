const functions = require('firebase-functions')
const twilio = require('twilio')

const accountSid = functions.config().twilio.account_sid
const authToken = functions.config().twilio.auth_token

const twilioNumber = '+18324476622'

const TwilioClient = new twilio(accountSid, authToken)

module.exports = { twilioNumber, TwilioClient }
