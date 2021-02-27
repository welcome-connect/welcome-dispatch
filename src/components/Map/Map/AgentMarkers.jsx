import { useAgentIcon } from '@hooks/useAgentPinIcon'
import { InfoWindow, Marker } from '@react-google-maps/api'
import { useState } from 'react'
import styled from 'styled-components'

export function AgentMarkers({ agent }) {
	const [showInfoWindow, setShowInfoWindow] = useState(false)
	const lat = agent?.location?.latitude
	const lng = agent?.location?.longitude

	const icon = useAgentIcon(agent)

	function onMouseOver() {
		setShowInfoWindow(true)
	}

	function onMouseOut() {
		setShowInfoWindow(false)
	}

	return lat && lng ? (
		<>
			<Marker key={agent.id} position={{ lat, lng }} icon={icon} onMouseOver={onMouseOver} onMouseOut={onMouseOut} />
			{showInfoWindow ? (
				<InfoWindow position={{ lat, lng }} options={{ pixelOffset: { height: -40, width: 0 } }}>
					<Name>{agent.displayName}</Name>
				</InfoWindow>
			) : null}
		</>
	) : null
}

const Name = styled.strong`
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.primary};
`
