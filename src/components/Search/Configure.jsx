import { useEffect } from 'react'
import { useSearch } from '../../contexts/search/SearchProvider'

export const Configure = ({
	filters = [],
	display = true,
	hitsPerPage = 10,
	displayQuery = '',
}) => {
	const { addToFilters, setDisplay, setHitsPerPage, setDisplayQuery } = useSearch()
	useEffect(() => {
		setHitsPerPage(hitsPerPage)
		setDisplay(display)
		addToFilters(filters)
		setDisplayQuery(displayQuery)
	}, [])

	return <></>
}
