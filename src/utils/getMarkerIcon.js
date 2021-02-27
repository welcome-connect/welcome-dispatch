export function getMarkerIcon(status) {
	switch (status) {
		case 'completed':
			return './icons/completedPin.svg'
		case 'inRoute':
			return './icons/inRoutePin.svg'
		case 'inProgress':
			return './icons/inProgressPin.svg'
		case 'pending':
			return './icons/pendingPin.svg'
		case 'cancelled':
			return './icons/cancelledPin.svg'
	}
}
