import { auth, db, firebase } from './index'

// CREATE LEAD
export const createLead = async lead => {
	if (!lead) throw new Error('Lead information required')

	const leadExists = await getLeadByPhoneNumber(lead.phoneNumber)

	if (!leadExists) {
		const leadRef = db.collection('leads').doc()
		const leadSnapshot = await leadRef.get()

		const createdAt = firebase.firestore.FieldValue.serverTimestamp()
		const createdBy = auth.currentUser.uid
		const leadModel = { id: leadRef.id, createdAt, createdBy, ...lead }

		try {
			await leadRef.set(leadModel)
			return { lead: await getLead(leadSnapshot.id), alreadyExist: false }
		} catch (error) {
			console.error('Error creating lead: ', error.message)
		}
	} else {
		return { lead: leadExists, alreadyExist: true }
	}
}

// GET LEAD
export const getLead = async id => {
	if (!id) return new Error('Id required')

	try {
		const leadDocument = await db.collection('leads').doc(id).get()
		return { id, ...leadDocument.data() }
	} catch (error) {
		console.error('Error fetching lead: ', error.message)
	}
}

export const getLeadByPhoneNumber = async phoneNumber => {
	if (!phoneNumber) return new Error('Phone number required')

	try {
		const leadDocument = await db.collection('leads').where('phoneNumber', '==', phoneNumber).get()
		if (leadDocument.empty) return null
		return leadDocument.docs[0].data()
	} catch (error) {
		console.error('Error fetching lead: ', error.message)
	}
}
