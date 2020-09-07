export const types = {
	SET_TEAM_IS_EDITING: 'SET_TEAM_IS_EDITING',
	SET_TEAM_IS_CREATING: 'SET_TEAM_IS_CREATING',

	SET_TEAM_IS_NOT_EDITING: 'SET_TEAM_IS_NOT_EDITING',
	SET_TEAM_IS_NOT_CREATING: 'SET_TEAM_IS_NOT_CREATING',
}

export const initialState = {
	isEditingTeam: false,
	isCreatingTeam: false,
}

export const settingsReducer = (state, action) => {
	switch (action.type) {
		case types.SET_TEAM_IS_EDITING:
			return { ...state, isEditingTeam: true }

		case types.SET_TEAM_IS_NOT_EDITING:
			return { ...state, isEditingTeam: false }

		case types.SET_TEAM_IS_CREATING:
			return { ...state, isCreatingTeam: true }

		case types.SET_TEAM_IS_NOT_CREATING:
			return { ...state, isCreatingTeam: false }

		default:
			return state
	}
}
