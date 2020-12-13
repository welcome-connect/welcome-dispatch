import { Marker } from '@react-google-maps/api'
import { format } from 'date-fns'
import { useDispatch } from '@contexts/dispatch'
import { useFirestoreSub } from '@hooks/index'

export const MarkerSet = ({ agent, handleMarkerClick, setHoveredShowing }) => {
	const { observedDate } = useDispatch()
	const [showings] = useFirestoreSub('showings', {
		where: [
			['agentId', '==', agent.id],
			['date.string', '==', format(observedDate, 'MM/dd/yyyy')],
		],
	})

	return showings.map(showing => {
		const lat = showing.places.coords.lat
		const lng = showing.places.coords.lng

		return (
			<Marker
				key={showing.id}
				position={{ lat, lng }}
				icon="./icons/assignedPin.svg"
				onClick={() => handleMarkerClick(showing)}
				onMouseOver={() => setHoveredShowing(showing)}
				onMouseOut={() => setHoveredShowing(null)}
			/>
		)
	})
}
