import styled from 'styled-components'
import { useCallback, useEffect, useState } from 'react'
import { Autocomplete } from '@react-google-maps/api'

import { SettingsInput } from '../../styles/styled-components'
import { useDispatch } from '../../contexts/dispatch'

export const SearchPlaces = ({ panTo }) => {
	const [autocomplete, setAutocomplete] = useState(null)
	const { setPlaceToBeAdded, placeToBeAdded } = useDispatch()

	const [query, setQuery] = useState('')

	const onPlacesLoad = useCallback(autocomplete => {
		setAutocomplete(autocomplete)
	})

	const onPlaceChanged = () => {
		const place = autocomplete.getPlace()
		const lat = place.geometry.location.lat()
		const lng = place.geometry.location.lng()

		setPlaceToBeAdded(place)
		panTo({ lat, lng })
	}

	useEffect(() => {
		if (placeToBeAdded?.formatted_address) setQuery(placeToBeAdded?.formatted_address)
		else setQuery('')
	}, [placeToBeAdded])

	return (
		<Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onPlacesLoad}>
			<Input
				type="text"
				placeholder="🔍  Search for an address"
				value={query}
				onChange={e => setQuery(e.target.value)}
			/>
		</Autocomplete>
	)
}

const Input = styled(SettingsInput)`
	width: 60%;
	border-radius: 4px;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
	position: absolute;
	top: 2rem;
	left: 50%;
	transform: translateX(-50%);
	font-size: 1rem;
`
