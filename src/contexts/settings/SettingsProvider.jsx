import { createContext, useReducer, useContext } from 'react'
import { settingsReducer, initialState, types } from './state'

export const SettingsContext = createContext()

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
	const [state, dispatch] = useReducer(settingsReducer, initialState)

	const setIsEditing = status => dispatch({ type: types.SET_TEAM_EDITING, payload: status })
	const setSelected = team => dispatch({ type: types.SET_SELECTED, payload: team })

	const setSelectedAgents = agentsArr =>
		dispatch({ type: types.SET_SELECTED_AGENTS, payload: agentsArr })

	const setSelectedDispatchers = dispatchersArr =>
		dispatch({ type: types.SET_SELECTED_DISPATCHERS, payload: dispatchersArr })

	return (
		<SettingsContext.Provider
			value={{
				...state,
				setIsEditing,
				setSelected,
				setSelectedAgents,
				setSelectedDispatchers,
			}}>
			{children}
		</SettingsContext.Provider>
	)
}
