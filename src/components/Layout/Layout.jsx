import styled, { css } from 'styled-components'

import { TopNavigation } from '../TopNavigation'
import { SideNavigation } from '../SideNavigation'
import { useNavigation } from '../../contexts/navigation'
import { ModalContainer } from '../ModalContainer'
import { Settings } from '../Settings'
import { TeamModal } from '../Settings/TeamModal'
import { SettingsProvider } from '../../contexts/settings'
import { AgentModal } from '../Settings/AgentModal'

export const Layout = ({ children, title, icon }) => {
	const {
		toggleUserDropdownMenu,
		toggleSettingsModal,
		toggleTeamModal,
		toggleAgentModal,
		isSideNavExpanded,
		isUserDropdownOpen,
		isSettingsOpen,
		isTeamModalOpen,
		isAgentModalOpen,
	} = useNavigation()

	const handleBgClick = e => {
		e.stopPropagation()
		if (isUserDropdownOpen) toggleUserDropdownMenu()
		if (isSettingsOpen) toggleSettingsModal()
		if (isTeamModalOpen) toggleTeamModal()
		if (isAgentModalOpen) toggleAgentModal()
	}

	return (
		<Container className={isSideNavExpanded ? 'menu-open' : null}>
			<SettingsProvider>
				{isUserDropdownOpen || isSettingsOpen ? (
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
			</SettingsProvider>
			<TopNavigation title={title} icon={icon} />
			<SideNavigation />
			<PageContainer>{children}</PageContainer>
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

	${({ isUserDropdownOpen }) =>
		isUserDropdownOpen &&
		css`
			z-index: 0;
			background: transparent;
		`}
`

const PageContainer = styled.main`
	background-color: ${({ theme: { colors } }) => colors.bg.primary};
	padding: 1rem;
`
