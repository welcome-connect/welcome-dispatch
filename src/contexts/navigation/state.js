export const types = {
	EXPAND_SIDENAV: 'EXPAND_SIDENAV',
	CLOSE_SIDENAV: 'CLOSE_SIDENAV',

	TOGGLE_USERDROPDOWN_MENU: 'TOGGLE_USERDROPDOWN_MENU',
	TOGGLE_SETTINGS_MODAL: 'TOGGLE_SETTINGS_MODAL',
	TOGGLE_TEAM_MODAL: 'TOGGLE_TEAM_MODAL',
	TOGGLE_AGENT_MODAL: 'TOGGLE_AGENT_MODAL',
	TOGGLE_DISPATCHER_MODAL: 'TOGGLE_DISPATCHER_MODAL',
	TOGGLE_NEW_SHOWING_MODAL: 'TOGGLE_NEW_SHOWING_MODAL',
	TOGGLE_NEW_LEAD_MODAL: 'TOGGLE_NEW_LEAD_MODAL',
}

export const initialState = {
	isSideNavExpanded: false,
	isUserDropdownOpen: false,
	isSettingsOpen: false,
	isTeamModalOpen: false,
	isAgentModalOpen: false,
	isDispatcherModalOpen: false,
	isNewShowingModalOpen: false,
	isNewLeadModalOpen: false,
}

export const navigationReducer = (state, action) => {
	console.log({ state, action })
	switch (action.type) {
		case types.EXPAND_SIDENAV:
			return { ...state, isSideNavExpanded: true, isUserDropdownOpen: false }

		case types.CLOSE_SIDENAV:
			return { ...state, isSideNavExpanded: false, isUserDropdownOpen: false }

		case types.TOGGLE_USERDROPDOWN_MENU:
			return { ...state, isUserDropdownOpen: !state.isUserDropdownOpen }

		case types.TOGGLE_SETTINGS_MODAL:
			return { ...state, isSettingsOpen: !state.isSettingsOpen }

		case types.TOGGLE_TEAM_MODAL:
			return { ...state, isTeamModalOpen: !state.isTeamModalOpen, isUserDropdownOpen: false }

		case types.TOGGLE_AGENT_MODAL:
			return { ...state, isAgentModalOpen: !state.isAgentModalOpen, isUserDropdownOpen: false }

		case types.TOGGLE_DISPATCHER_MODAL:
			return {
				...state,
				isDispatcherModalOpen: !state.isDispatcherModalOpen,
				isUserDropdownOpen: false,
			}

		case types.TOGGLE_NEW_SHOWING_MODAL:
			return {
				...state,
				isNewShowingModalOpen: !state.isNewShowingModalOpen,
				isUserDropdownOpen: false,
			}

		case types.TOGGLE_NEW_LEAD_MODAL:
			return {
				...state,
				isNewLeadModalOpen: !state.isNewLeadModalOpen,
				isUserDropdownOpen: false,
			}

		default:
			return state
	}
}
