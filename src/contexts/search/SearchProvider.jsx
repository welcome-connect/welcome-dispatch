import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { initialState, searchReducer, types } from './state'

export const SearchContext = createContext()
SearchContext.displayName = 'SearchContext'

export const useSearch = () => useContext(SearchContext)

const search = (data, filters, query, hitsPerPage) => {
	const attributes = data[0] && Object.keys(data[0])
	const columns = filters.length === 0 ? attributes : filters

	const results = data?.filter(object =>
		columns.some(column => object[column]?.toString().toLowerCase().indexOf(query.toLowerCase()) > -1),
	)

	return results.slice(0, hitsPerPage)
}

export const SearchProvider = ({ children, data = [] }) => {
	const [state, dispatch] = useReducer(searchReducer, initialState)

	useEffect(() => {
		const searchedData = search(data, state.filters, state.query, state.hitsPerPage)
		setData(searchedData)
	}, [data, state.query, state.filters, state.hitsPerPage])

	const setQuery = useCallback(query => dispatch({ type: types.CHANGE_QUERY, payload: query }), [dispatch])
	const setData = useCallback(data => dispatch({ type: types.SET_DATA, payload: data }), [dispatch])
	const addToFilters = useCallback(filters => dispatch({ type: types.ADD_TO_FILTERS, payload: filters }), [dispatch])
	const removeFromFilters = useCallback(filters => dispatch({ type: types.REMOVE_FROM_FILTERS, payload: filters }), [
		dispatch,
	])
	const setDisplay = useCallback(bool => dispatch({ type: types.SET_DISPLAY, payload: bool }), [dispatch])
	const setHitsPerPage = useCallback(num => dispatch({ type: types.SET_HITS_PER_PAGE, payload: num }), [dispatch])
	const setSelectedHit = useCallback(hit => dispatch({ type: types.SET_SELECTED_HIT, payload: hit }), [dispatch])
	const setDisplayQuery = useCallback(query => dispatch({ type: types.SET_DISPLAY_QUERY, payload: query }), [dispatch])

	const value = useMemo(
		() => ({
			state,
			setQuery,
			addToFilters,
			removeFromFilters,
			setDisplay,
			setHitsPerPage,
			setSelectedHit,
			setDisplayQuery,
		}),
		[state, addToFilters, removeFromFilters, setDisplay, setHitsPerPage, setSelectedHit, setDisplayQuery],
	)

	return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}
