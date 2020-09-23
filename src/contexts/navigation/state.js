export const types = {
	EXPAND_SIDENAV: 'EXPAND_SIDENAV',
	CLOSE_SIDENAV: 'CLOSE_SIDENAV',

	TOGGLE_USERDROPDOWN_MENU: 'TOGGLE_USERDROPDOWN_MENU',
	TOGGLE_SETTINGS_MODAL: 'TOGGLE_SETTINGS_MODAL',
	TOGGLE_TEAM_MODAL: 'TOGGLE_TEAM_MODAL',
	TOGGLE_AGENT_MODAL: 'TOGGLE_AGENT_MODAL',
}

export const initialState = {
	isSideNavExpanded: false,
	isUserDropdownOpen: false,
	isSettingsOpen: false,
	isTeamModalOpen: false,
	isAgentModalOpen: false,
}

export const navigationReducer = (state, action) => {
	switch (action.type) {
		case types.EXPAND_SIDENAV:
			return { ...state, isSideNavExpanded: true }

		case types.CLOSE_SIDENAV:
			return { ...state, isSideNavExpanded: false }

		case types.TOGGLE_USERDROPDOWN_MENU:
			return { ...state, isUserDropdownOpen: !state.isUserDropdownOpen }

		case types.TOGGLE_SETTINGS_MODAL:
			return { ...state, isSettingsOpen: !state.isSettingsOpen }

		case types.TOGGLE_TEAM_MODAL:
			return { ...state, isTeamModalOpen: !state.isTeamModalOpen }

		case types.TOGGLE_AGENT_MODAL:
			return { ...state, isAgentModalOpen: !state.isAgentModalOpen }

		default:
			return state
	}
}
