import styled, { css } from 'styled-components'

import { useNavigation } from '@contexts/navigation'
import { SettingsProvider } from '@contexts/settings'
import { DispatchProvider } from '@contexts/dispatch'

import { Settings, AgentModal, DispatcherModal, TeamModal } from '@components/settings'
import { TopNavigation, SideNavigation } from '../'
import { ModalContainer, NewLeadModal, NewShowingModal, ShowingModal } from '@components/ui'
import { NewShowingForm, NewLeadForm } from '@components/schedule'
import { ShowingContent } from '@components/schedule'

export const Layout = ({ children, title, icon }) => {
	const {
		toggleUserDropdownMenu,
		toggleSettingsModal,
		toggleTeamModal,
		toggleAgentModal,
		toggleDispatcherModal,
		toggleNewLeadModal,
		toggleShowingModal,
		isSideNavExpanded,
		isUserDropdownOpen,
		isSettingsOpen,
		isTeamModalOpen,
		isAgentModalOpen,
		isDispatcherModalOpen,
		isNewShowingModalOpen,
		isNewLeadModalOpen,
		isShowingModalOpen,
	} = useNavigation()

	const handleBgClick = e => {
		e.stopPropagation()
		if (isUserDropdownOpen) toggleUserDropdownMenu()
		if (isSettingsOpen) toggleSettingsModal()
		if (isTeamModalOpen) toggleTeamModal()
		if (isAgentModalOpen) toggleAgentModal()
		if (isDispatcherModalOpen) toggleDispatcherModal()
		if (isNewLeadModalOpen) toggleNewLeadModal()
		if (isShowingModalOpen) toggleShowingModal()
	}

	return (
		<Container className={isSideNavExpanded ? 'menu-open' : null}>
			<SettingsProvider>
				{isUserDropdownOpen ||
				isSettingsOpen ||
				isNewShowingModalOpen ||
				isNewLeadModalOpen ||
				isShowingModalOpen ? (
					<ModalBackground onClick={handleBgClick} isUserDropdownOpen={isUserDropdownOpen} />
				) : null}
				{isSettingsOpen ? (
					<ModalContainer>
						<Settings />
					</ModalContainer>
				) : null}
				{isTeamModalOpen ? (
					<ModalContainer>
						<TeamModal />
					</ModalContainer>
				) : null}
				{isAgentModalOpen ? (
					<ModalContainer>
						<AgentModal />
					</ModalContainer>
				) : null}
				{isDispatcherModalOpen ? (
					<ModalContainer>
						<DispatcherModal />
					</ModalContainer>
				) : null}
			</SettingsProvider>

			{isNewLeadModalOpen ? (
				<NewLeadModal>
					<NewLeadForm />
				</NewLeadModal>
			) : null}

			<TopNavigation title={title} icon={icon} />
			<SideNavigation />

			<DispatchProvider>
				{isNewShowingModalOpen ? (
					<NewShowingModal>
						<NewShowingForm />
					</NewShowingModal>
				) : null}
				{isShowingModalOpen ? (
					<ShowingModal>
						<ShowingContent />
					</ShowingModal>
				) : null}
				<PageContainer>{children}</PageContainer>
			</DispatchProvider>
		</Container>
	)
}

const Container = styled.div`
	height: 100vh;
	max-width: 100vw;
	display: grid;
	grid-template-rows: 60px auto;
	grid-template-columns: 56px auto;
	transition: all 150ms ease-in-out;

	grid-template-areas:
		'side-nav top-nav'
		'side-nav .';

	.top-nav {
		grid-area: top-nav;
	}

	.side-nav {
		grid-area: side-nav;
	}

	&.menu-open {
		grid-template-columns: 180px auto;
	}

	@media only screen and (max-width: ${({ theme: { media } }) => media.tablet_portrait}) {
		grid-template-rows: 50px auto 50px;
		grid-template-columns: auto;
		grid-template-areas:
			'top-nav'
			'.'
			'side-nav';

		&.menu-open {
			grid-template-columns: auto;
		}
	}
`

const ModalBackground = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 10;
	background: rgba(0, 0, 0, 0.3);
	transition: all 150ms ease-in-out;

	${({ isUserDropdownOpen }) =>
		isUserDropdownOpen &&
		css`
			z-index: 0;
			background: transparent;
		`}
`

const PageContainer = styled.main`
	background-color: ${({ theme: { colors } }) => colors.bg.primary};
`
