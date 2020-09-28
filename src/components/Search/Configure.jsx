import { useEffect } from 'react'
import { useSearch } from '../../contexts/search/SearchProvider'

export const Configure = ({ filters = [], display = true, hitsPerPage = 10 }) => {
	const { addToFilters, setDisplay, setHitsPerPage } = useSearch()
	useEffect(() => {
		setHitsPerPage(hitsPerPage)
		setDisplay(display)
		addToFilters(filters)
	}, [])

	return <></>
}
