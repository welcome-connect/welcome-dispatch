import { createContext, useReducer, useContext } from 'react'
import { settingsReducer, initialState, types } from './state'

export const SettingsContext = createContext()

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
	const [state, dispatch] = useReducer(settingsReducer, initialState)

	const setIsEditingTeam = status => dispatch({ type: types.SET_TEAM_EDITING, payload: status })
	const setSelectedTeam = team => dispatch({ type: types.SET_SELECTED_TEAM, payload: team })

	const setSelectedAgents = agentsArr =>
		dispatch({ type: types.SET_SELECTED_AGENTS, payload: agentsArr })

	const setSelectedDispatchers = dispatchersArr =>
		dispatch({ type: types.SET_SELECTED_DISPATCHERS, payload: dispatchersArr })

	return (
		<SettingsContext.Provider
			value={{
				...state,
				setIsEditingTeam,
				setSelectedTeam,
				setSelectedAgents,
				setSelectedDispatchers,
			}}>
			{children}
		</SettingsContext.Provider>
	)
}
