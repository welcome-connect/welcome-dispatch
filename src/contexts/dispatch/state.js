import { addDays, subDays } from 'date-fns'

export const types = {
	SET_PLACE_TO_BE_ADDED: 'SET_PLACE_TO_BE_ADDED',
	SET_SELECTED_TEAM: 'SET_SELECTED_TEAM',
	SET_TEAM_AGENTS: 'SET_TEAM_AGENTS',
	SET_EDIT_SHOWING: 'SET_EDIT_SHOWING',
	ADD_TO_OBSERVED_DATE: 'ADD_TO_OBSERVED_DATE',
	SUB_TO_OBSERVED_DATE: 'SUB_TO_OBSERVED_DATE',
}

export const initialState = {
	placeToBeAdded: null,
	selectedTeam: '',
	teamAgents: [],
	editShowing: null,
	observedDate: Date.now(),
}

export const dispatchReducer = (state, action) => {
	switch (action.type) {
		case types.SET_PLACE_TO_BE_ADDED:
			return { ...state, placeToBeAdded: action.payload }

		case types.SET_SELECTED_TEAM:
			return { ...state, selectedTeam: action.payload }

		case types.SET_TEAM_AGENTS:
			return { ...state, teamAgents: action.payload }

		case types.SET_EDIT_SHOWING:
			return { ...state, editShowing: action.payload }

		case types.ADD_TO_OBSERVED_DATE:
			return { ...state, observedDate: addDays(state.observedDate, action.payload) }

		case types.SUB_TO_OBSERVED_DATE:
			return { ...state, observedDate: subDays(state.observedDate, action.payload) }

		default:
			return { ...state }
	}
}
