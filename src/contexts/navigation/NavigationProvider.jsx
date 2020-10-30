import { createContext, useReducer, useContext, useCallback, useMemo } from 'react'
import { types, navigationReducer, initialState } from './state'

export const NavigationContext = createContext()
NavigationContext.displayName = 'NavigationContext'

export const useNavigation = () => useContext(NavigationContext)

export const NavigationProvider = ({ children }) => {
	const [state, dispatch] = useReducer(navigationReducer, initialState)

	const closeSideNav = useCallback(() => dispatch({ type: types.CLOSE_SIDENAV }), [dispatch])
	const openSideNav = useCallback(() => dispatch({ type: types.EXPAND_SIDENAV }), [dispatch])

	const toggleUserDropdownMenu = useCallback(() => dispatch({ type: types.TOGGLE_USERDROPDOWN_MENU }), [dispatch])
	const toggleSettingsModal = useCallback(() => dispatch({ type: types.TOGGLE_SETTINGS_MODAL }), [dispatch])
	const toggleTeamModal = useCallback(() => dispatch({ type: types.TOGGLE_TEAM_MODAL }), [dispatch])
	const toggleAgentModal = useCallback(() => dispatch({ type: types.TOGGLE_AGENT_MODAL }), [dispatch])
	const toggleDispatcherModal = useCallback(() => dispatch({ type: types.TOGGLE_DISPATCHER_MODAL }), [dispatch])
	const toggleNewShowingModal = useCallback(() => dispatch({ type: types.TOGGLE_NEW_SHOWING_MODAL }), [dispatch])
	const toggleNewLeadModal = useCallback(() => dispatch({ type: types.TOGGLE_NEW_LEAD_MODAL }), [dispatch])

	const value = useMemo(() => {
		return {
			...state,
			closeSideNav,
			openSideNav,
			toggleUserDropdownMenu,
			toggleSettingsModal,
			toggleTeamModal,
			toggleAgentModal,
			toggleDispatcherModal,
			toggleNewShowingModal,
			toggleNewLeadModal,
		}
	}, [
		state,
		closeSideNav,
		openSideNav,
		toggleUserDropdownMenu,
		toggleSettingsModal,
		toggleTeamModal,
		toggleAgentModal,
		toggleDispatcherModal,
		toggleNewShowingModal,
		toggleNewLeadModal,
	])

	return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}
