export const types = {
	SET_TEAM_EDITING: 'SET_TEAM_EDITING',

	SET_SELECTED_TEAM: 'SET_SELECTED_TEAM',

	SET_SELECTED_AGENTS: 'SET_SELECTED_AGENTS',
	SET_SELECTED_DISPATCHERS: 'SET_SELECTED_DISPATCHERS',
}

export const initialState = {
	isEditingTeam: false,
	selectedTeam: null,
	selectedAgents: [],
	selectedDispatchers: [],
}

export const settingsReducer = (state, action) => {
	switch (action.type) {
		case types.SET_TEAM_EDITING:
			return { ...state, isEditingTeam: action.payload }

		case types.SET_SELECTED_TEAM:
			return { ...state, selectedTeam: action.payload }

		case types.SET_SELECTED_AGENTS:
			return {
				...state,
				selectedAgents:
					action.payload === undefined ? [] : [...state.selectedAgents, action.payload],
			}

		case types.SET_SELECTED_DISPATCHERS:
			return {
				...state,
				selectedDispatchers:
					action.payload === undefined ? [] : [...state.selectedDispatchers, action.payload],
			}

		default:
			return state
	}
}
