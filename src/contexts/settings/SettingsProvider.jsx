import { createContext, useEffect, useReducer, useContext } from 'react'
import { settingsReducer, initialState, types } from './state'

export const SettingsContext = createContext()

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
	const [state, dispatch] = useReducer(settingsReducer, initialState)

	const isEditingTeam = () => dispatch({ type: types.SET_TEAM_IS_EDITING })
	const hasEditedTeam = () => dispatch({ type: types.SET_TEAM_IS_NOT_EDITING })
	const isCreatingTeam = () => dispatch({ type: types.SET_TEAM_IS_CREATING })
	const hasCreatedTeam = () => dispatch({ type: types.SET_TEAM_IS_NOT_CREATING })

	return (
		<SettingsContext.Provider
			value={{ ...state, isEditingTeam, hasEditedTeam, isCreatingTeam, hasCreatedTeam }}>
			{children}
		</SettingsContext.Provider>
	)
}
