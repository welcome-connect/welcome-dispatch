import { InfoWindow, Marker } from '@react-google-maps/api'
import { format } from 'date-fns'
import { useDispatch } from '@contexts/dispatch'
import { useFirestoreSub } from '@hooks/index'
import { getMarkerIcon } from '@utils/index'
import { useState } from 'react'
import { InfoWindowContent } from './InfoWindowContent'

export const MarkerSet = ({ agent, handleMarkerClick }) => {
	const [showInfoWindow, setShowInfoWindow] = useState(null)
	const { observedDate } = useDispatch()

	function onMouseOver(showing) {
		setShowInfoWindow(showing)
	}

	function onMouseOut() {
		setShowInfoWindow(null)
	}

	const [showings] = useFirestoreSub('showings', {
		where: [
			['agentId', '==', agent.id],
			['date.string', '==', format(observedDate, 'MM/dd/yyyy')]
		]
	})

	return showings.map(showing => {
		const lat = showing.places.coords.lat
		const lng = showing.places.coords.lng
		const icon = getMarkerIcon(showing.status)

		return (
			<div key={showing.id}>
				<Marker
					position={{ lat, lng }}
					icon={icon}
					onClick={() => handleMarkerClick(showing)}
					onMouseOver={() => onMouseOver(showing)}
					onMouseOut={onMouseOut}
				/>
				{showInfoWindow?.id === showing.id ? (
					<InfoWindow position={{ lat, lng }} options={{ pixelOffset: { height: -40, width: 0 } }}>
						<InfoWindowContent showing={showing} />
					</InfoWindow>
				) : null}
			</div>
		)
	})
}
