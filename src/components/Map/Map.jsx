import styled from 'styled-components'
import { useCallback, useEffect, useRef } from 'react'
import { useLoadScript, Marker, InfoWindow, GoogleMap } from '@react-google-maps/api'

import { SearchPlaces } from '../SearchPlaces'
import mapStyles from './mapStyles'
import { useDispatch } from '../../contexts/dispatch'
import { useNavigation } from '../../contexts/navigation'

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

	const { placeToBeAdded, setPlaceToBeAdded } = useDispatch()
	const { toggleNewShowingModal } = useNavigation()

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.FIREBASE_API_KEY,
		libraries,
	})

	const onMapLoad = useCallback(map => {
		mapRef.current = map
	}, [])

	const panTo = useCallback(({ lat, lng }) => {
		mapRef.current.panTo({ lat, lng })
		mapRef.current.setZoom(13)
	}, [])

	useEffect(() => {
		if (placeToBeAdded) {
			panTo({
				lat: placeToBeAdded.geometry.location.lat(),
				lng: placeToBeAdded.geometry.location.lng(),
			})
		}
	}, [placeToBeAdded])

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
				{placeToBeAdded ? (
					<Marker
						position={{
							lat: placeToBeAdded.geometry.location.lat(),
							lng: placeToBeAdded.geometry.location.lng(),
						}}
						onClick={toggleNewShowingModal}
						icon="./icons/addPin.svg"
					/>
				) : null}
			</GoogleMap>
		</Container>
	)
}

const Container = styled.div`
	border-left: 1px solid ${({ theme }) => theme.colors.border_darker};
`
