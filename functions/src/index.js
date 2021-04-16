require('firebase-functions/lib/logger/compat')
const c = require('./callable')
const t = require('./trigger')

// CALLABLES
exports.callAddRole = c.addRole

// USER TRIGGERS
exports.triggerUpdateTeamCount = t.users.updateTeamCount
exports.triggerUpdateOutingStatus = t.outings.updateOutingStatus
exports.triggerUpdateOutingStatusOnShowingChange = t.showings.updateOutingStatusOnShowingChange
exports.triggerNotifyAgentOnShowingCreation = t.showings.notifyAgentOnShowingCreation
exports.triggerRemoveShowingRefsOnShowingDeletion = t.showings.removeShowingRefsOnShowingDeletion
