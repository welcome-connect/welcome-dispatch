import { createContext, useContext, useEffect, useReducer } from 'react'
import { initialState, searchReducer, types } from './state'

export const SearchContext = createContext()

export const useSearch = () => useContext(SearchContext)

const search = (data, filters, query, hitsPerPage) => {
	const attributes = data[0] && Object.keys(data[0])
	const columns = filters.length === 0 ? attributes : filters

	const results = data?.filter(object =>
		columns.some(
			column => object[column].toString().toLowerCase().indexOf(query.toLowerCase()) > -1,
		),
	)

	return results.slice(0, hitsPerPage)
}

export const SearchProvider = ({ children, data = [] }) => {
	const [state, dispatch] = useReducer(searchReducer, initialState)

	useEffect(() => {
		const searchedData = search(data, state.filters, state.query, state.hitsPerPage)
		setData(searchedData)
	}, [data, state.query, state.filters, state.hitsPerPage])

	const setQuery = query => dispatch({ type: types.CHANGE_QUERY, payload: query })
	const setData = data => dispatch({ type: types.SET_DATA, payload: data })
	const addToFilters = filters => dispatch({ type: types.ADD_TO_FILTERS, payload: filters })
	const removeFromFilters = filters =>
		dispatch({ type: types.REMOVE_FROM_FILTERS, payload: filters })
	const setDisplay = bool => dispatch({ type: types.SET_DISPLAY, payload: bool })
	const setHitsPerPage = num => dispatch({ type: types.SET_HITS_PER_PAGE, payload: num })

	return (
		<SearchContext.Provider
			value={{ ...state, setQuery, addToFilters, removeFromFilters, setDisplay, setHitsPerPage }}>
			{children}
		</SearchContext.Provider>
	)
}
