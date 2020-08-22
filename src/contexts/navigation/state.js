export const types = {
	EXPAND_SIDENAV: 'EXPAND_SIDENAV',
	CLOSE_SIDENAV: 'CLOSE_SIDENAV',
}

export const initialState = {
	isSideNavExpanded: false,
}

export const navigationReducer = (state, action) => {
	switch (action.type) {
		case types.EXPAND_SIDENAV:
			return { ...state, isSideNavExpanded: true }

		case types.CLOSE_SIDENAV:
			return { ...state, isSideNavExpanded: false }

		default:
			return state
	}
}
