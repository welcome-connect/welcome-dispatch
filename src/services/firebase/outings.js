import { addMinsToStringTime, stringTimeComparison } from '../../utils'
import { db, firebase } from './index'

// HANDLE OUTING CREATION
export const handleOutingCreation = async showing => {
	if (!showing) throw new Error('Showing details are required')

	const { agentId, leadId, startTime, endTime, date } = showing
	const newOutingModel = {
		agentId,
		leadId,
		date,
		startFirstShowing: startTime,
		endLastShowing: endTime,
		showings: [showing.id],
		status: 'pending',
	}

	const outingsRef = db
		.collection('outings')
		.where('leadId', '==', leadId)
		.where('agentId', '==', agentId)
		.where('date.string', '==', date.string)

	const outingsSnapshot = await outingsRef.get()
	const outings = outingsSnapshot.docs.map(doc => doc.data())

	try {
		let updatedOuting
		if (outings.length > 0) {
			for (let i = 0; i < outings.length; i++) {
				const currOuting = outings[i]
				const currOutingRef = db.collection('outings').doc(currOuting.id)
				const isNextTo =
					currOuting.endLastShowing >= addMinsToStringTime(startTime, -10) &&
					currOuting.startFirstShowing <= startTime
				const isLatestShowing =
					stringTimeComparison(currOuting.endLastShowing, endTime) < 0 &&
					stringTimeComparison(currOuting.endLastShowing, startTime) >= -10

				if (isNextTo) {
					updatedOuting = currOuting
					await currOutingRef.update({
						showings: firebase.firestore.FieldValue.arrayUnion(showing.id),
					})
				}

				if (isLatestShowing) {
					updatedOuting = currOuting
					await currOutingRef.update({ endLastShowing: endTime })
				}
			}
		}

		if (!updatedOuting) {
			const newOuting = await createOuting(newOutingModel)
			return newOuting
		}

		return getOuting(updatedOuting.id)
	} catch (error) {
		console.error('Error updating outing: ', error.message)
	}
}

// CREATE OUTING
export const createOuting = async outingModel => {
	if (!outingModel) throw new Error('Outing required')

	const outingRef = db.collection('outings').doc()
	const outingSnap = await outingRef.get()

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
