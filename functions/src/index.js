require('firebase-functions/lib/logger/compat')
const c = require('./callable')
const t = require('./trigger')

// CALLABLES
exports.callAddRole = c.addRole

// USER TRIGGERS
exports.triggerUpdateTeamCount = t.users.updateTeamCount
