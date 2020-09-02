export const types = {
	FETCH_REQ: 'FETCH_REQ',
	FETCH_FAILED: 'FETCH_FAILED',

	SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
	SIGNOUT_SUCCESS: 'SIGNOUT_SUCCESS',

	SET_USER: 'SET_USER',
	SET_USER_OBJ: 'SET_USER_OBJ',

	IS_NOT_LOGGED_IN: 'IS_NOT_LOGGED_IN',
}

export const initialState = {
	user: null,
	userObj: null,
	isLoggedIn: false,
	isLoading: false,
	error: null,
}

export const authReducer = (state, action) => {
	switch (action.type) {
		case types.FETCH_REQ:
			return { ...state, isLoading: true }

		case types.FETCH_FAILED:
			return { ...state, isLoading: false, error: action.payload }

		case types.SIGN_IN_SUCCESS:
			return { ...state, isLoading: false, isLoggedIn: true }

		case types.SIGNOUT_SUCCESS:
			return { ...state, isLoading: false, isLoggedIn: false, user: null }

		case types.SET_USER:
			return { ...state, user: action.payload, isLoggedIn: true }

		case types.SET_USER_OBJ:
			return { ...state, userObj: action.payload }

		case types.IS_NOT_LOGGED_IN:
			return { ...state, isLoggedIn: false }

		default:
			return state
	}
}
