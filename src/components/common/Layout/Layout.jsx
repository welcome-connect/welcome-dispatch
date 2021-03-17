import styled from 'styled-components'
import { useNavigation } from '@contexts/navigation'
import { TopNavigation, SideNavigation } from '@components/common'

export const Layout = ({ children, title, icon }) => {
	const { isSideNavExpanded } = useNavigation()

	return (
		<Container className={isSideNavExpanded ? 'menu-open' : null}>
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

const PageContainer = styled.main`
	background-color: ${({ theme: { colors } }) => colors.bg.primary};
`
