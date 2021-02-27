import styled from 'styled-components'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLoadScript, Marker, InfoWindow, GoogleMap } from '@react-google-maps/api'
import { format } from 'date-fns'

import { SearchPlaces } from '../SearchPlaces'
import mapStyles from './mapStyles'
import { useDispatch } from '@contexts/dispatch'
import { useNavigation } from '@contexts/navigation'
import { MarkerSet } from './MarkerSet'
import { useFirestoreSub } from '@hooks/index'
import { InfoWindowContent } from './InfoWindowContent'
import { AgentMarkers } from './AgentMarkers'

const libraries = ['places']
const mapContainerStyle = {
	width: '100%',
	height: '100%'
}
const center = { lat: 29.749907, lng: -95.358421 }
const options = {
	styles: mapStyles,
	disableDefaultUI: true,
	zoomControl: true
}

export const Map = () => {
	const mapRef = useRef()

	const { placeToBeAdded, teamAgents, editShowing, observedDate, selectedTeam, selectShowing } = useDispatch()
	const { toggleShowingModal, toggleNewShowingModal } = useNavigation()

	const [hoveredShowing, setHoveredShowing] = useState(null)

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.FIREBASE_API_KEY,
		libraries
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

	const handleMarkerClick = showing => {
		selectShowing(showing)
		toggleShowingModal()
	}

	useEffect(() => {
		if (placeToBeAdded) {
			panTo({
				lat: placeToBeAdded.geometry.location.lat(),
				lng: placeToBeAdded.geometry.location.lng()
			})
		}
	}, [placeToBeAdded])

	useEffect(() => {
		if (selectedTeam) {
			panTo(
				{
					lat: selectedTeam.coords.latitude,
					lng: selectedTeam.coords.longitude
				},
				10
			)
		}
	}, [selectedTeam])

	const [unAssignedShowings] = useFirestoreSub('showings', {
		where: [
			['agentId', '==', 'unassigned'],
			['date.string', '==', format(observedDate, 'MM/dd/yyyy')]
		]
	})

	if (loadError) return 'Error loading maps'
	if (!isLoaded) return 'Loading Maps'

	return (
		<Container>
			<GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center} options={options} onLoad={onMapLoad}>
				<SearchPlaces panTo={panTo} />
				{placeToBeAdded && !editShowing ? (
					<Marker
						position={{
							lat: placeToBeAdded.geometry.location.lat(),
							lng: placeToBeAdded.geometry.location.lng()
						}}
						onClick={toggleNewShowingModal}
						icon="./icons/addPin.svg"
					/>
				) : null}

				{teamAgents.map(agent => (
					<MarkerSet
						key={agent.id}
						agent={agent}
						handleMarkerClick={handleMarkerClick}
						setHoveredShowing={setHoveredShowing}
					/>
				))}

				{teamAgents.map(agent => (
					<AgentMarkers key={agent.id} agent={agent} />
				))}

				{unAssignedShowings.map(showing => (
					<Marker
						key={showing.id}
						position={{
							lat: showing.places.coords.lat,
							lng: showing.places.coords.lng
						}}
						icon="./icons/unassignedPin.svg"
						onClick={() => handleMarkerClick(showing)}
						onMouseOver={() => setHoveredShowing(showing)}
						onMouseOut={() => setHoveredShowing(null)}
					/>
				))}
			</GoogleMap>
		</Container>
	)
}

const Container = styled.div`
	border-left: 1px solid ${({ theme }) => theme.colors.border_darker};

	iframe + div {
		display: none;
	}

	.gm-style {
		outline: none !important;
	}

	.gm-style-iw {
		border-radius: 16px;
		box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04);

		button {
			display: none !important;
		}
	}
`
