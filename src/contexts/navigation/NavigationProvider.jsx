import { createContext, useReducer, useContext } from 'react'
import { types, navigationReducer, initialState } from './state'

export const NavigationContext = createContext()

export const useNavigation = () => useContext(NavigationContext)

export const NavigationProvider = ({ children }) => {
	const [state, dispatch] = useReducer(navigationReducer, initialState)

	const closeSideNav = () => dispatch({ type: types.CLOSE_SIDENAV })
	const openSideNav = () => dispatch({ type: types.EXPAND_SIDENAV })

	const toggleUserDropdownMenu = () => dispatch({ type: types.TOGGLE_USERDROPDOWN_MENU })
	const toggleSettingsModal = () => dispatch({ type: types.TOGGLE_SETTINGS_MODAL })
	const toggleTeamModal = () => dispatch({ type: types.TOGGLE_TEAM_MODAL })
	const toggleAgentModal = () => dispatch({ type: types.TOGGLE_AGENT_MODAL })
	const toggleDispatcherModal = () => dispatch({ type: types.TOGGLE_DISPATCHER_MODAL })

	return (
		<NavigationContext.Provider
			value={{
				...state,
				closeSideNav,
				openSideNav,
				toggleUserDropdownMenu,
				toggleSettingsModal,
				toggleTeamModal,
				toggleAgentModal,
				toggleDispatcherModal,
			}}>
			{children}
		</NavigationContext.Provider>
	)
}
