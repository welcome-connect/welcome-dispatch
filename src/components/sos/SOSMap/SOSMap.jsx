import mapStyles from '@components/map/Map/mapStyles'
import { useFirestoreSub } from '@hooks/useFirestoreSub'
import { useLoadScript, Marker, GoogleMap } from '@react-google-maps/api'
import { useCallback, useRef } from 'react'
import styled from 'styled-components'
import { SOSAgentShowings } from '../SOSAgentShowings/SOSAgentShowings'

const libraries = ['places']
const mapContainerStyle = {
	width: '100%',
	height: '100%'
}

const options = {
	styles: mapStyles,
	disableDefaultUI: true,
	zoomControl: true,
	draggable: false
}

export function SOSMap({ center, agentId, zoomControl = true, zoom = 11, ...props }) {
	const mapRef = useRef()

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.FIREBASE_API_KEY,
		libraries
	})

	const [[agent]] = useFirestoreSub('users', {
		where: ['id', '==', agentId]
	})

	const onMapLoad = useCallback(map => {
		mapRef.current = map
	}, [])

	if (loadError) return 'Error loading maps'
	if (!isLoaded) return 'Loading Maps'

	return (
		<MapContainer {...props}>
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				zoom={zoom}
				center={center}
				options={{ ...options, zoomControl }}
				onLoad={onMapLoad}>
				<Marker position={center} icon="./icons/completedPin.svg" />
				{agent ? <SOSAgentShowings key={agent.id} agent={agent} handleMarkerClick={() => {}} /> : null}
			</GoogleMap>
		</MapContainer>
	)
}

const MapContainer = styled.div`
	height: 450px;
	width: 600px;
	border-radius: 16px;
	overflow: hidden;
	border: none;
	outline: none;

	iframe + div {
		display: none;
	}

	.gm-style-iw {
		border-radius: 16px;
		box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04);
	}

	.gm-ui-hover-effect {
		top: 4px !important;
		right: 4px !important;
	}

	.gmnoprint {
		display: none;
	}

	a[rel='noopener'] {
		display: none !important;
	}
`
