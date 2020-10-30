import { createContext, useReducer, useContext, useCallback, useMemo } from 'react'
import { settingsReducer, initialState, types } from './state'

export const SettingsContext = createContext()
SettingsContext.displayName = 'SettingsContext'

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
	const [state, dispatch] = useReducer(settingsReducer, initialState)

	const setIsEditing = useCallback(status => dispatch({ type: types.SET_TEAM_EDITING, payload: status }), [dispatch])
	const setSelected = useCallback(team => dispatch({ type: types.SET_SELECTED, payload: team }), [dispatch])

	const setSelectedAgents = useCallback(agentsArr => dispatch({ type: types.SET_SELECTED_AGENTS, payload: agentsArr }), [
		dispatch,
	])

	const setSelectedDispatchers = useCallback(
		dispatchersArr => dispatch({ type: types.SET_SELECTED_DISPATCHERS, payload: dispatchersArr }),
		[dispatch],
	)

	const value = useMemo(() => {
		return {
			...state,
			setIsEditing,
			setSelected,
			setSelectedAgents,
			setSelectedDispatchers,
		}
	}, [state, setIsEditing, setSelected, setSelectedAgents, setSelectedDispatchers])

	return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
