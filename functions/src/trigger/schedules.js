const functions = require('firebase-functions')
const { db, admin } = require('../admin')

exports.deleteScheduleOnOutingRemoval = functions.firestore.document('schedules/{scheduleId}').onUpdate(async change => {
  const changedSchedule = change.after.data()
  const hasNoMoreOutings = changedSchedule.outings.length === 0

  if (hasNoMoreOutings) {
    await db.collection('schedules').doc(changedSchedule.id).delete()
  }
})