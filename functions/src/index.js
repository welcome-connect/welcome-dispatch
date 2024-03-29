require('firebase-functions/lib/logger/compat')
const c = require('./callable')
const t = require('./trigger')

// CALLABLES
exports.callAddRole = c.addRole
exports.callSendSMS = c.sendSMS

// USER TRIGGERS
exports.triggerUpdateTeamCount = t.users.updateTeamCount
exports.triggerUpdateOutingStatus = t.outings.updateOutingStatus
exports.triggerUpdateOutingStatusOnShowingChange = t.showings.updateOutingStatusOnShowingChange
exports.triggerNotifyAgentOnShowingCreation = t.showings.notifyAgentOnShowingCreation
exports.triggerRemoveShowingRefsOnShowingDeletion = t.showings.removeShowingRefsOnShowingDeletion
exports.triggerDeleteOutingOnShowingRemoval = t.outings.deleteOutingOnShowingRemoval
exports.triggerDeleteScheduleOnOutingRemoval = t.schedules.deleteScheduleOnOutingRemoval
exports.triggerAddToSOSHistoryOnSOSDismissal = t.sosSignal.addToSOSHistoryOnSOSDismissal
