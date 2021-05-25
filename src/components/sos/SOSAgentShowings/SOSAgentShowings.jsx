import { InfoWindow, Marker } from '@react-google-maps/api'
import { format } from 'date-fns'
import { useFirestoreSub } from '@hooks/index'
import { getMarkerIcon } from '@utils/index'
import { useState } from 'react'
import { InfoWindowContent } from '@components/map/Map/InfoWindowContent'

export const SOSAgentShowings = ({ agent, handleMarkerClick }) => {
	const [showInfoWindow, setShowInfoWindow] = useState(null)

	function onMouseOver(showing) {
		setShowInfoWindow(showing)
	}

	function onMouseOut() {
		setShowInfoWindow(null)
	}

	const [showings] = useFirestoreSub('showings', {
		where: [
			['agentId', '==', agent.id],
			['date.string', '==', format(Date.now(), 'MM/dd/yyyy')]
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
