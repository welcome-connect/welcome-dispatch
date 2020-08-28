import { createContext, useReducer, useContext } from 'react'
import { types, navigationReducer, initialState } from './state'

export const NavigationStateContext = createContext()
export const NavigationSetContext = createContext()

export const useNavigationState = () => useContext(NavigationStateContext)
export const useNavigationSetters = () => useContext(NavigationSetContext)

export const NavigationProvider = ({ children }) => {
	const [state, dispatch] = useReducer(navigationReducer, initialState)

	const closeSideNav = () => dispatch({ type: types.CLOSE_SIDENAV })
	const openSideNav = () => dispatch({ type: types.EXPAND_SIDENAV })

	const toggleUserDropdownMenu = () => dispatch({ type: types.TOGGLE_USERDROPDOWN_MENU })
	const toggleSettingsModal = () => dispatch({ type: types.TOGGLE_SETTINGS_MODAL })

	return (
		<NavigationStateContext.Provider value={{ ...state }}>
			<NavigationSetContext.Provider
				value={{
					closeSideNav,
					openSideNav,
					toggleUserDropdownMenu,
					toggleSettingsModal,
				}}>
				{children}
			</NavigationSetContext.Provider>
		</NavigationStateContext.Provider>
	)
}
