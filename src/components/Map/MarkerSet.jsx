import { Marker } from '@react-google-maps/api'
import { format } from 'date-fns'
import { useDispatch } from '../../contexts/dispatch'
import { useFirestoreSub } from '../../hooks'

export const MarkerSet = ({ agent, hanleEditShowing, setHoveredShowing }) => {
	const { observedDate } = useDispatch()
	const [showings] = useFirestoreSub('showings', {
		where: [
			['agent.id', '==', agent.id],
			['date.string', '==', format(observedDate, 'MM/dd/yyyy')],
		],
	})

	const getCoords = showing => {
		const lat = showing.places.coords.lat
		const lng = showing.places.coords.lng

		return { lat, lng }
	}

	return showings.map(showing => (
		<Marker
			key={showing.id}
			position={getCoords(showing)}
			icon="./icons/assignedPin.svg"
			onClick={() => hanleEditShowing(showing)}
			onMouseOver={() => setHoveredShowing(showing)}
			onMouseOut={() => setHoveredShowing(null)}
		/>
	))
}
