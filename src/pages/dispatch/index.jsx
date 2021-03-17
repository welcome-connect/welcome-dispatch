import styled, { css } from 'styled-components'
import { useEffect, useState } from 'react'

import { useAuth } from '@contexts/auth/AuthProvider'
import { useNavigation } from '@contexts/navigation/NavigationProvider'
import { DispatchProvider } from '@contexts/dispatch/DispatchProvider'

import { Map } from '@components/map'
import { Layout, Portal, Modal } from '@components/common'
import { NewLeadForm, NewShowingForm, ScheduleView } from '@components/schedule'
import { CalendarIcon } from '@components/icons'
import { Settings } from '@components/settings'

export default function DispatchPage() {
	const [loading, setLoading] = useState(true)
	const [isDispatcher, setIsDispatcher] = useState(false)
	const { userDoc } = useAuth()

	const {
		isSettingsOpen,
		isUserDropdownOpen,
		isAgentModalOpen,
		isDispatcherModalOpen,
		isTeamModalOpen,
		isNewLeadModalOpen,
		isNewShowingModalOpen,
		toggleSettingsModal,
		toggleUserDropdownMenu,
		toggleAgentModal,
		toggleDispatcherModal,
		toggleTeamModal,
		toggleNewLeadModal,
		toggleNewShowingModal
	} = useNavigation()

	useEffect(
		function endLoading() {
			if (userDoc?.role === 'dispatcher') setIsDispatcher(true)
			if (userDoc) setLoading(false)
		},
		[userDoc]
	)

	function handleSettingsOnClose() {
		if (isUserDropdownOpen) toggleUserDropdownMenu()
		if (isAgentModalOpen) toggleAgentModal()
		if (isDispatcherModalOpen) toggleDispatcherModal()
		if (isTeamModalOpen) toggleTeamModal()

		toggleSettingsModal()
	}

	return (
		<DispatchProvider>
			<Layout title="Dispatch" icon={<CalendarIcon />}>
				<Grid isAgent={loading || !isDispatcher}>
					{loading ? (
						<h1>Loading...</h1>
					) : (
						<>
							{!isDispatcher ? (
								<FlexColumn>
									<h1>YOU SHALL NOT PASS</h1>
									<h2>Dispatchers only</h2>
								</FlexColumn>
							) : (
								<>
									<ScheduleView />
									<Map />
								</>
							)}
						</>
					)}
				</Grid>

				{isSettingsOpen ? (
					<Portal id="settings-modal">
						<Modal onClose={handleSettingsOnClose}>
							<Settings />
						</Modal>
					</Portal>
				) : null}

				{isNewLeadModalOpen ? (
					<Portal id="new-lead-modal">
						<Modal onClose={toggleNewLeadModal}>
							<NewLeadForm />
						</Modal>
					</Portal>
				) : null}

				{isNewShowingModalOpen ? (
					<Portal id="new-showing-modal">
						<Modal onClose={toggleNewShowingModal}>
							<NewShowingForm />
						</Modal>
					</Portal>
				) : null}
			</Layout>
		</DispatchProvider>
	)
}

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	height: 100%;

	${({ isAgent }) =>
		isAgent &&
		css`
			place-items: center;
			grid-template-columns: 1fr;
		`}
`

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`
