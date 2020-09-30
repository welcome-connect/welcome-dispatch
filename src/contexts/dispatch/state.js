export const types = {
	SET_PLACE_TO_BE_ADDED: 'SET_PLACE_TO_BE_ADDED',
}

export const initialState = {
	placeToBeAdded: null,
}

export const dispatchReducer = (state, action) => {
	switch (action.type) {
		case types.SET_PLACE_TO_BE_ADDED:
			return { ...state, placeToBeAdded: action.payload }

		default:
			return { ...state }
	}
}
