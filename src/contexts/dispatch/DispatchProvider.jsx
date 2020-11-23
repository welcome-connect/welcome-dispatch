import { createContext, useContext, useEffect, useReducer, useCallback, useMemo } from 'react'
import { useFirestoreSub } from '../../hooks'
import { useAuth } from '../auth'
import { dispatchReducer, initialState, types } from './state'

export const DispatchContext = createContext()
DispatchContext.displayName = 'DispatchContext'

export const useDispatch = () => useContext(DispatchContext)

export const DispatchProvider = ({ children }) => {
	const [state, dispatch] = useReducer(dispatchReducer, initialState)
	const { userTeam } = useAuth()

	const setPlaceToBeAdded = useCallback(place => dispatch({ type: types.SET_PLACE_TO_BE_ADDED, payload: place }), [
		dispatch,
	])
	const setSelectTeam = useCallback(team => dispatch({ type: types.SET_SELECTED_TEAM, payload: team }), [dispatch])
	const setTeamAgents = useCallback(agents => dispatch({ type: types.SET_TEAM_AGENTS, payload: agents }), [dispatch])
	const setEditShowing = useCallback(showing => dispatch({ type: types.SET_EDIT_SHOWING, payload: showing }), [dispatch])
	const addObservedDays = useCallback(num => dispatch({ type: types.ADD_TO_OBSERVED_DATE, payload: num }), [dispatch])
	const subObservedDays = useCallback(num => dispatch({ type: types.SUB_TO_OBSERVED_DATE, payload: num }), [dispatch])
	const selectOuting = useCallback(outing => dispatch({ type: types.SELECT_OUTING, payload: outing }), [dispatch])
	const selectShowing = useCallback(showing => dispatch({ type: types.SELECT_SHOWING, payload: showing }), [dispatch])

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

	const value = useMemo(() => {
		return {
			...state,
			setPlaceToBeAdded,
			setSelectTeam,
			setTeamAgents,
			setEditShowing,
			addObservedDays,
			subObservedDays,
			selectOuting,
			selectShowing,
		}
	}, [
		state,
		setPlaceToBeAdded,
		setSelectTeam,
		setTeamAgents,
		setEditShowing,
		addObservedDays,
		subObservedDays,
		selectOuting,
		selectShowing,
	])

	return <DispatchContext.Provider value={value}>{children}</DispatchContext.Provider>
}
