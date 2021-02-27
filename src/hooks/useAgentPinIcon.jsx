import { useFirestoreSub } from '@hooks/useFirestoreSub'

export function useAgentIcon(agent) {
	const [[inProgressShowing]] = useFirestoreSub('showings', {
		where: [
			['agentId', '==', agent?.id],
			['status', 'in', ['inRoute', 'inProgress']]
		]
	})

	if (inProgressShowing) {
		if (inProgressShowing.status === 'inRoute') {
			return './icons/agentPinInRoute.svg'
		}

		if (inProgressShowing.status === 'inProgress') {
			return './icons/agentPinAtLocation.svg'
		}
	}

	if (agent.active) {
		return './icons/agentPinActive.svg'
	} else {
		return './icons/agentPinInactive.svg'
	}
}
