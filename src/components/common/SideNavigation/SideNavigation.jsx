import styled from 'styled-components'
import { LeftArrowIcon, RightArrowIcon, DispatchIcon, LogoMark, Logo, ShowingsIcon } from '@components/icons'
import NavLink from './NavLink'
import { useNavigation } from '@contexts/navigation'
import { SOSIcon } from '@components/icons/SOSIcon'

export const SideNavigation = () => {
	const { openSideNav, closeSideNav, isSideNavExpanded } = useNavigation()

	return (
		<NavigationContainer className="side-nav">
			{isSideNavExpanded ? <Logo /> : <LogoMark />}
			{isSideNavExpanded ? (
				<div className="arrow-container" onClick={closeSideNav}>
					<LeftArrowIcon />
				</div>
			) : (
				<div className="arrow-container" onClick={openSideNav}>
					<RightArrowIcon />
				</div>
			)}
			<ul>
				<NavLink href="/dispatch">
					<DispatchIcon />
					<Label className="label">Dispatch</Label>
				</NavLink>
				<NavLink href="/showings">
					<ShowingsIcon />
					<Label className="label">Showings</Label>
				</NavLink>
				<NavLink href="/sos-history">
					<SOSIcon />
					<Label className="label">SOS History</Label>
				</NavLink>
			</ul>
		</NavigationContainer>
	)
}

const Label = styled.span`
	margin-left: 0.25rem;
	display: block;
	line-height: 1rem;
	font-weight: 400;
	color: white;
`

const NavigationContainer = styled.nav`
	display: grid;
	grid-template-rows: 60px auto;
	width: 100%;
	background-color: ${({ theme: { colors } }) => colors.primary};
	position: relative;
	overflow: hidden;

	.logo-mark {
		width: auto;
		height: 30px;
		align-self: center;
		margin-left: 0.75rem;
	}

	.arrow-container {
		position: absolute;
		top: 85px;
		right: 0.5rem;
		cursor: pointer;

		.right-arrow-icon,
		.left-arrow-icon {
			width: 18px;
			height: auto;
			padding: 4px;
		}
	}

	ul {
		align-self: start;
		margin-top: 6rem;
		width: 100%;
		font-size: 0.9rem;
	}
`
