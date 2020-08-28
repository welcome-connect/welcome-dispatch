import styled, { css } from 'styled-components'

import { TopNavigation } from '../TopNavigation'
import { SideNavigation } from '../SideNavigation'
import { useNavigationState, useNavigationSetters } from '../../contexts/navigation'
import { ModalContainer } from '../ModalContainer'
import { Settings } from '../Settings'

export const Layout = ({ children, title, icon }) => {
	const { isSideNavExpanded, isUserDropdownOpen, isSettingsOpen } = useNavigationState()
	const { toggleUserDropdownMenu, toggleSettingsModal } = useNavigationSetters()

	const handleBgClick = e => {
		e.stopPropagation()
		if (isUserDropdownOpen) toggleUserDropdownMenu()
		if (isSettingsOpen) toggleSettingsModal()
	}

	console.log({ isSettingsOpen })

	return (
		<Container className={isSideNavExpanded ? 'menu-open' : null}>
			{isUserDropdownOpen || isSettingsOpen ? (
				<ModalBackground onClick={handleBgClick} isUserDropdownOpen={isUserDropdownOpen} />
			) : null}
			{isSettingsOpen ? (
				<ModalContainer>
					<Settings />
				</ModalContainer>
			) : null}
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
