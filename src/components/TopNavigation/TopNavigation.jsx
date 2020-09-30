import styled, { css } from 'styled-components'

import { UserAvatarIcon } from '../_icons'
import { useAuth } from '../../contexts/auth/AuthProvider'
import { UserDropdown } from '../UserDropdown'
import { useNavigation } from '../../contexts/navigation'

export const TopNavigation = ({ title, icon }) => {
	const { userAuth } = useAuth()

	const { isUserDropdownOpen, toggleUserDropdownMenu } = useNavigation()

	const handleUserDropdown = e => {
		e.preventDefault()
		e.stopPropagation()
		if (isUserDropdownOpen) {
			toggleUserDropdownMenu()
		}
	}

	const handleAvatarOnClick = e => {
		e.preventDefault()
		e.stopPropagation()
		toggleUserDropdownMenu()
	}

	return (
		<NavigationContainer className="top-nav" onClick={handleUserDropdown}>
			<div className="grid-left">
				{icon}
				<span>{title}</span>
			</div>
			<div className="grid-center"></div>
			<div className="grid-right">
				<div className="avatar" onClick={handleAvatarOnClick}>
					<p className="username">{userAuth?.displayName}</p>
					<UserAvatarIcon />
					<UserDropdown />
				</div>
			</div>
		</NavigationContainer>
	)
}

const NavigationContainer = styled.header`
	display: grid;
	grid-template-columns: max-content 3fr 1fr;
	align-items: center;
	width: 100%;
	background-color: ${({ theme: { colors } }) => colors.bg.white};
	z-index: 1;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.05);

	grid-template-areas: 'grid-left grid-center grid-right';

	.grid-left,
	.grid-center,
	.grid-right {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
		padding: 0 10px;
	}

	.grid-left {
		grid-area: grid-left;
		padding-left: 16px;

		span {
			margin-left: 8px;
			font-size: 1.1rem;
			display: block;
		}
	}

	.grid-center {
		grid-area: grid-center;
		justify-content: flex-end;

		span {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}

		.addInbox {
			cursor: pointer;
			width: 35px;
			height: auto;
		}
	}

	.grid-right {
		grid-area: grid-right;
		margin-left: 10px;
		padding-right: 1rem;
		justify-content: flex-end;
		${props =>
			props.atInbox &&
			css`
				border-left: 1px solid ${({ theme: { colors } }) => colors.border_medium};
			`}

		.avatar {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			position: relative;
			cursor: pointer;
			font-weight: 500;
		}

		.user-avatar-icon {
			width: 35px;
			height: auto;
		}

		.username {
			margin-right: 1rem;
		}
	}

	@media only screen and (max-width: ${({ theme: { media } }) => media.tablet_portrait}) {
		grid-template-columns: 25vw auto 30vw;
	}

	@media only screen and (max-width: ${({ theme: { media } }) => media.mobile_landscape}) {
		grid-template-columns: auto auto calc(1.5rem + 35px);
		.username {
			display: none;
		}
		.grid-right {
			padding: 0 0.75rem;
			margin: 0;
			width: 100%;
		}

		.grid-center {
			padding: 0 0.75rem;
		}
	}
`
