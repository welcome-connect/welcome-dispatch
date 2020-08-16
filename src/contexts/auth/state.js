export const types = {
	FETCH_REQ: 'FETCH_REQ',
	FETCH_FAILED: 'FETCH_FAILED',

	SIGN_IN_UP_SUCCESS: 'SIGN_IN_UP_SUCCESS',
	SIGNOUT_SUCCESS: 'SIGNOUT_SUCCESS',

	SET_USER: 'SET_USER',

	IS_NOT_LOGGED_IN: 'IS_NOT_LOGGED_IN',
}

export const initialState = {
	user: false,
	isLoggedIn: false,
	isLoading: false,
	error: null,
}

export const authReducer = (state, action) => {
	return action.type === types.FETCH_REQ
		? { ...state, isLoading: true }
		: action.type === types.FETCH_FAILED
		? { ...state, isLoading: false, error: action.payload }
		: action.type === types.SIGN_IN_UP_SUCCESS
		? { ...state, isLoading: false, isLoggedIn: true }
		: action.type === types.SIGNOUT_SUCCESS
		? { ...state, isLoading: false, isLoggedIn: false, user: false }
		: action.type === types.SET_USER
		? { ...state, user: action.payload, isLoggedIn: true }
		: action.type === types.IS_NOT_LOGGED_IN
		? { ...state, isLoggedIn: false }
		: state
}
