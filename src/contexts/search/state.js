export const types = {
	ADD_TO_FILTERS: 'ADD_TO_FILTERS',
	REMOVE_FROM_FILTERS: 'REMOVE_FROM_FILTERS',
	CHANGE_QUERY: 'CHANGE_QUERY',
	SET_DATA: 'SET_DATA',
	SET_DISPLAY: 'SET_DISPLAY',
	SET_HITS_PER_PAGE: 'SET_HITS_PER_PAGE',
}

export const initialState = {
	data: [],
	filters: [],
	query: '',
	display: true,
	displayTrigger: true,
	hitsPerPage: 0,
}

export const searchReducer = (state, action) => {
	const currFilters = state.filters

	switch (action.type) {
		case types.CHANGE_QUERY:
			if (state.display === false) {
				if (action.payload === '') return { ...state, query: action.payload, displayTrigger: false }
				return { ...state, query: action.payload, displayTrigger: true }
			}

			return { ...state, query: action.payload }

		case types.SET_DISPLAY:
			return { ...state, display: action.payload, displayTrigger: action.payload }

		case types.SET_HITS_PER_PAGE:
			return { ...state, hitsPerPage: action.payload }

		case types.SET_DATA:
			return { ...state, data: action.payload }

		case types.ADD_TO_FILTERS:
			const toBeAdded = Array.isArray(action.payload) ? [...action.payload] : [action.payload]
			const newFilters = Array.from(new Set([...toBeAdded, ...currFilters]))

			return { ...state, filters: newFilters }

		case types.REMOVE_FROM_FILTERS:
			const toBeRemoved = Array.isArray(action.payload) ? [...action.payload] : [action.payload]
			return { ...state, filters: currFilters.filter(attr => !toBeRemoved.includes(attr)) }

		default:
			return state
	}
}
