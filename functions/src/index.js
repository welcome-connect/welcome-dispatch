const c = require('./callable')
const t = require('./trigger')

// CALLABLES
exports.callAddRole = c.addRole

// ALGOLIA TRIGGERS
exports.triggerAddToUserIndex = t.algolia.addToUsersIndex
exports.triggerUpdateUserIndex = t.algolia.updateUsersIndex
exports.triggerDeleteFromUserIndex = t.algolia.deleteFromUsersIndex

exports.triggerAddToShowingsIndex = t.algolia.addToShowingsIndex
exports.triggerUpdateShowingsIndex = t.algolia.updateShowingsIndex
exports.triggerDeleteFromShowingsIndex = t.algolia.deleteFromShowingsIndex

exports.triggerAddToTeamsIndex = t.algolia.addToTeamsIndex
exports.triggerUpdateTeamsIndex = t.algolia.updateTeamsIndex
exports.triggerDeleteFromTeamsIndex = t.algolia.deleteFromTeamsIndex
