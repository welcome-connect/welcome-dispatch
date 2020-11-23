import { addMinsToStringTime, stringTimeComparison } from '../../utils'
import { auth, db, firebase } from './index'

// HANDLE OUTING CREATION
export const handleOutingCreation = async showing => {
	if (!showing) throw new Error('Showing details are required')

	const { agent, lead, startTime, endTime, date, status } = showing
	const outingShowing = { startTime, endTime, id: showing.id, address: showing.propertyDetails.address, status }
	const newOutingModel = {
		agent,
		lead,
		date,
		startFirstShowing: startTime,
		endLastShowing: endTime,
		showings: [outingShowing],
	}

	const outingsRef = db
		.collection('outings')
		.where('lead.id', '==', lead.id)
		.where('agent.id', '==', agent.id)
		.where('date.string', '==', date.string)

	const outingsSnapshot = await outingsRef.get()
	const isEmpty = outingsSnapshot.empty
	const outings = outingsSnapshot.docs

	try {
		if (isEmpty) {
			const newOuting = await createOuting(newOutingModel)
			return newOuting
		}

		if (outings.length > 0) {
			let currOuting
			let wasUpdated = false
			outings.forEach(async outingDoc => {
				currOuting = outingDoc.data()
				if (
					currOuting.endLastShowing >= addMinsToStringTime(startTime, -10) &&
					currOuting.startFirstShowing <= startTime
				) {
					await outingDoc.ref.update({
						showings: firebase.firestore.FieldValue.arrayUnion(outingShowing),
					})
					wasUpdated = true
				}

				if (
					stringTimeComparison(currOuting.endLastShowing, endTime) < 0 &&
					stringTimeComparison(currOuting.endLastShowing, endTime) >= -10
				) {
					await outingDoc.ref.update({ endLastShowing: endTime })
					wasUpdated = true
				}
			})

			if (!wasUpdated) {
				const newOuting = await createOuting(newOutingModel)
				return newOuting
			}

			return getOuting(currOuting.id)
		}
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
