import styled from 'styled-components'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLoadScript, Marker, InfoWindow, GoogleMap } from '@react-google-maps/api'

import { SearchPlaces } from '../SearchPlaces'
import mapStyles from './mapStyles'
import { useDispatch } from '../../contexts/dispatch'
import { useNavigation } from '../../contexts/navigation'
import { MarkerSet } from './MarkerSet'
import { useFirestoreSub } from '../../hooks'
import { format } from 'date-fns'

const libraries = ['places']
const mapContainerStyle = {
	width: '100%',
	height: '100%',
}
const center = { lat: 29.749907, lng: -95.358421 }
const options = {
	styles: mapStyles,
	disableDefaultUI: true,
	zoomControl: true,
}

export const Map = () => {
	const mapRef = useRef()

	const {
		placeToBeAdded,
		teamAgents,
		setEditShowing,
		editShowing,
		observedDate,
		selectedTeam,
	} = useDispatch()
	const { toggleNewShowingModal } = useNavigation()

	const [hoveredShowing, setHoveredShowing] = useState(null)

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.FIREBASE_API_KEY,
		libraries,
	})

	const onMapLoad = useCallback(map => {
		mapRef.current = map
	}, [])

	const panTo = useCallback(({ lat, lng }, zoom = 13) => {
		if (!isLoaded) {
			mapRef?.current?.panTo({ lat, lng })
			mapRef?.current?.setZoom(zoom)
		}
	}, [])

	const hanleEditShowing = showing => {
		setEditShowing(showing)
		toggleNewShowingModal()
	}

	useEffect(() => {
		if (placeToBeAdded) {
			panTo({
				lat: placeToBeAdded.geometry.location.lat(),
				lng: placeToBeAdded.geometry.location.lng(),
			})
		}
	}, [placeToBeAdded])

	useEffect(() => {
		if (selectedTeam) {
			panTo(
				{
					lat: selectedTeam.coords.latitude,
					lng: selectedTeam.coords.longitude,
				},
				10,
			)
		}
	}, [selectedTeam])

	const [unAssignedShowings] = useFirestoreSub('showings', {
		where: [
			['agent', '==', 'unassigned'],
			['date.string', '==', format(observedDate, 'MM/dd/yyyy')],
		],
	})

	if (loadError) return 'Error loading maps'
	if (!isLoaded) return 'Loading Maps'

	return (
		<Container>
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				zoom={10}
				center={center}
				options={options}
				onLoad={onMapLoad}>
				<SearchPlaces panTo={panTo} />
				{placeToBeAdded && !editShowing ? (
					<Marker
						position={{
							lat: placeToBeAdded.geometry.location.lat(),
							lng: placeToBeAdded.geometry.location.lng(),
						}}
						onClick={toggleNewShowingModal}
						icon="./icons/addPin.svg"
					/>
				) : null}

				{teamAgents.map(agent => (
					<MarkerSet
						key={agent.id}
						agent={agent}
						hanleEditShowing={hanleEditShowing}
						setHoveredShowing={setHoveredShowing}
					/>
				))}

				{unAssignedShowings.map(showing => (
					<Marker
						key={showing.id}
						position={{
							lat: showing.places.coords.lat,
							lng: showing.places.coords.lng,
						}}
						icon="./icons/unassignedPin.svg"
						onClick={() => hanleEditShowing(showing)}
						onMouseOver={() => setHoveredShowing(showing)}
						onMouseOut={() => setHoveredShowing(null)}
					/>
				))}

				{hoveredShowing ? (
					<InfoWindow
						position={{
							lat: hoveredShowing.places.coords.lat,
							lng: hoveredShowing.places.coords.lng,
						}}
						options={{ pixelOffset: { height: -40, width: 0 } }}>
						<InfoWindowContent>
							<h3>{hoveredShowing.propertyDetails.address.split(',').slice(0, 3).concat()}</h3>
							<p>
								{hoveredShowing.agent !== 'unassigned'
									? `Assigned to ${hoveredShowing.agent.displayName}`
									: 'Unassigned'}
							</p>
							<p>{`Starts at ${hoveredShowing.startTime} until ${hoveredShowing.endTime}`}</p>
							<p>{`Lead: ${hoveredShowing.lead.displayName}`}</p>
						</InfoWindowContent>
					</InfoWindow>
				) : null}
			</GoogleMap>
		</Container>
	)
}

const Container = styled.div`
	border-left: 1px solid ${({ theme }) => theme.colors.border_darker};
`

const InfoWindowContent = styled.div`
	p {
		font-size: 0.9rem;
	}
`
