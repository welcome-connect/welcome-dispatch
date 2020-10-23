import { createContext, useContext, useEffect, useReducer } from 'react'
import { useFirestoreSub } from '../../hooks'
import { useAuth } from '../auth'
import { dispatchReducer, initialState, types } from './state'

export const DispatchContext = createContext()

export const useDispatch = () => useContext(DispatchContext)

export const DispatchProvider = ({ children }) => {
	const [state, dispatch] = useReducer(dispatchReducer, initialState)
	const { userTeam } = useAuth()

	const setPlaceToBeAdded = place => dispatch({ type: types.SET_PLACE_TO_BE_ADDED, payload: place })
	const setSelectTeam = team => dispatch({ type: types.SET_SELECTED_TEAM, payload: team })
	const setTeamAgents = agents => dispatch({ type: types.SET_TEAM_AGENTS, payload: agents })
	const setEditShowing = showing => dispatch({ type: types.SET_EDIT_SHOWING, payload: showing })
	const addObservedDays = num => dispatch({ type: types.ADD_TO_OBSERVED_DATE, payload: num })
	const subObservedDays = num => dispatch({ type: types.SUB_TO_OBSERVED_DATE, payload: num })

	const [agents] = useFirestoreSub('users', {
		where: [
			['teams', 'array-contains', state.selectedTeam.id],
			['role', '==', 'agent'],
		],
	})

	useEffect(() => {
		if (userTeam) setSelectTeam(userTeam)
	}, [userTeam])

	useEffect(() => {
		if (agents) setTeamAgents(agents)
	}, [agents])

	return (
		<DispatchContext.Provider
			value={{
				...state,
				setPlaceToBeAdded,
				setSelectTeam,
				setTeamAgents,
				setEditShowing,
				addObservedDays,
				subObservedDays,
			}}>
			{children}
		</DispatchContext.Provider>
	)
}
