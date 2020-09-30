import { auth, db, firebase } from './index'

// CREATE SHOWING
export const createShowing = async showing => {
	if (!showing) throw new Error('Showing information required')

	let showingRef
	if (showing.id) showingRef = db.collection('showings').doc()
	else showingRef = db.collection('showings').doc(showing.id)

	const showingSnapshot = showingRef.get()

	if (!showingSnapshot.exists) {
		const createdAt = firebase.firestore.FieldValue.serverTimestamp()
		const showingModel = {
			id: showingRef.id,
			agentId: showing.agentId,
			leadId: showing.leadId,
			createdBy: auth.currentUser.uid,
			createdAt,
			title: showing.title,
			notes: showing.notes,
			coords: showing.coords,
			date: showing.date,
			startTime: showing.startTime,
			endTime: showing.endTime,
			streetAddress: showing.streetAddress,
			city: showing.city,
			state: showing.state,
			zipCode: showing.zipCode,
		}

		try {
			await showingRef.set(showingModel)
			return getShowing(showingRef.id)
		} catch (error) {
			console.error('Error creating showing: ', error.message)
		}
	} else {
		return getShowing(showingRef.id)
	}
}

// GET SHOWING
export const getShowing = async id => {
	if (!id) return new Error('Id required')

	try {
		const showingDocument = await db.collection('showings').doc(id).get()
		return { id, ...showingDocument.data() }
	} catch (error) {
		console.error('Error fetching showing: ', error.message)
	}
}

// EDIT SHOWING
export const updateShowing = async (id, data) => {
	try {
		await db
			.collection('showings')
			.doc(id)
			.update({ ...data })
	} catch (error) {
		console.error('Error updating showing: ', error.message)
	}

	return getTeam(id)
}
