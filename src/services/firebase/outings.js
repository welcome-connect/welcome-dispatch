import { isEqual } from 'date-fns'
import { db, firebase } from './index'

// HANDLE OUTING CREATION
export const addShowingToOuting = async (showing, outing) => {
	if (!showing) throw new Error('Showing details are required')
	if (!outing) throw new Error('Outing details are required')

	const outingRef = db.collection('outings').doc(outing.id)

	try {
		const isLatestShowing = isEqual(showing.preStartTime, outing.preEndTime)
		const isEarliestShowing = isEqual(showing.preEndTime, outing.preStartTime)

		await outingRef.update({
			showings: firebase.firestore.FieldValue.arrayUnion(showing.id)
		})

		if (isLatestShowing) await outingRef.update({ preEndTime: showing.preEndTime })
		if (isEarliestShowing) await outingRef.update({ preStartTime: showing.preStartTime })

		return getOuting(outing.id)
	} catch (error) {
		console.error('Error updating outing: ', error.message)
	}
}

// CREATE OUTING
export const createOuting = async outingModel => {
	if (!outingModel) throw new Error('Outing required')

	const outingRef = db.collection('outings').doc()
	const outingSnap = await outingRef.get()

	console.log('createOuting: Ln 35 - OUTING MODEL: ', outingModel)

	if (!outingSnap.exists) {
		try {
			await outingRef.set({ ...outingModel, id: outingRef.id })
			return getOuting(outingRef.id)
		} catch (error) {
			console.error('Error creating outing: ', error.message)
		}
	}
}

// GET OUTING
export const getOuting = async id => {
	if (!id) return new Error('Id required')

	try {
		const outingDocument = await db.collection('outings').doc(id).get()
		return { id, ...outingDocument.data() }
	} catch (error) {
		console.error('Error fetching outing: ', error.message)
	}
}

export function removeOutingShowing(outingId, showingId) {
	try {
		const outingRef = db.collection('outings').doc(outingId)
		outingRef.update({
			showings: firebase.firestore.FieldValue.arrayRemove(showingId)
		})

		return getOuting(outingId)
	} catch (error) {
		console.error('Error removing showing from outing: ', error.message)
	}
}
