import styled from 'styled-components'
import { useCallback, useEffect, useState } from 'react'
import { Autocomplete } from '@react-google-maps/api'

import { SettingsInput } from '../../styles/styled-components'
import { useDispatch } from '../../contexts/dispatch'

export const SearchPlacesInput = () => {
	const [autocomplete, setAutocomplete] = useState(null)
	const { setPlaceToBeAdded, placeToBeAdded } = useDispatch()

	const [query, setQuery] = useState('')

	const onPlacesLoad = useCallback(autocomplete => {
		setAutocomplete(autocomplete)
	})

	const onPlaceChanged = () => {
		const place = autocomplete.getPlace()

		setPlaceToBeAdded(place)
	}

	useEffect(() => {
		if (placeToBeAdded?.formatted_address) setQuery(placeToBeAdded?.formatted_address)
		else setQuery('')
	}, [placeToBeAdded])

	return (
		<Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onPlacesLoad}>
			<SettingsInput
				type="text"
				placeholder="🔍  Search for an address"
				value={query}
				onChange={e => setQuery(e.target.value)}
			/>
		</Autocomplete>
	)
}
