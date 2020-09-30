import { createContext, useContext, useReducer } from 'react'
import { dispatchReducer, initialState, types } from './state'

export const DispatchContext = createContext()

export const useDispatch = () => useContext(DispatchContext)

export const DispatchProvider = ({ children }) => {
	const [state, dispatch] = useReducer(dispatchReducer, initialState)

	const setPlaceToBeAdded = place => dispatch({ type: types.SET_PLACE_TO_BE_ADDED, payload: place })

	return (
		<DispatchContext.Provider value={{ ...state, setPlaceToBeAdded }}>
			{children}
		</DispatchContext.Provider>
	)
}
