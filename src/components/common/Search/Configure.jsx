import { useEffect } from 'react'
import { useSearch } from '@contexts/search'

export const Configure = ({ filters = [], display = true, hitsPerPage = 10, displayQuery = '', getData = () => {} }) => {
	const {
		addToFilters,
		setDisplay,
		setHitsPerPage,
		setDisplayQuery,
		state: { data }
	} = useSearch()
	useEffect(() => {
		setHitsPerPage(hitsPerPage)
		setDisplay(display)
		addToFilters(filters)
		setDisplayQuery(displayQuery)
	}, [])

	useEffect(() => {
		if (data) getData(data)
	}, [data])

	return <></>
}
