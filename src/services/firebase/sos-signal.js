import { db } from '.'

export async function dismissSOSSignal(id) {
	const sosSignalRef = db.collection('sos-signal').doc(id)
	await sosSignalRef.update({ dismissed: true })
}
