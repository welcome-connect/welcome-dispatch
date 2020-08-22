import { createContext, useReducer, useContext } from 'react'
import { types, navigationReducer, initialState } from './state'

export const NavigationStateContext = createContext()
export const NavigationSetContext = createContext()

export const useStateNavigation = () => useContext(NavigationStateContext)
export const useSetNavigation = () => useContext(NavigationSetContext)

const NavigationProvider = ({ children }) => {
	const [state, dispatch] = useReducer(navigationReducer, initialState)

	const closeSideNav = () => dispatch({ type: types.CLOSE_SIDENAV })
	const openSideNav = () => dispatch({ type: types.EXPAND_SIDENAV })

	return (
		<NavigationStateContext.Provider value={{ ...state }}>
			<NavigationSetContext.Provider
				value={{
					closeSideNav,
					openSideNav,
				}}>
				{children}
			</NavigationSetContext.Provider>
		</NavigationStateContext.Provider>
	)
}

export default NavigationProvider
