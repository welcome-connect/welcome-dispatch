import styled, { css } from 'styled-components'
import { useState } from 'react'
import { useRouter } from 'next/router'

import { Logo, UserAvatarIcon, LogoutIcon, SettingsIcon } from '../_icons'
import { useAuthSetters, useAuthState } from '../../contexts/auth/AuthProvider'

const TopNavigation = ({ title, icon }) => {
	const { signout } = useAuthSetters()
	const { user } = useAuthState()
	const handleSignout = () => signout()

	const router = useRouter()
	const atInbox = router.pathname === '/inbox'

	const [avatarDropdownToggle, setAvatarDropdownToggle] = useState(false)
	const toggleAvatarDropdown = () => {
		setAvatarDropdownToggle(!avatarDropdownToggle)
	}

	return (
		<NavigationContainer className="top-nav" atInbox={atInbox}>
			<div className="grid-left">
				{icon}
				<span>{title}</span>
			</div>
			<div className="grid-center"></div>
			<div className="grid-right">
				<div className="avatar" onClick={toggleAvatarDropdown}>
					<p className="username">{user?.displayName}</p>
					<UserAvatarIcon />
					<DropDown className={avatarDropdownToggle ? 'toggle' : ''}>
						<DropDownItem onClick={handleSignout}>
							<LogoutIcon />
							Logout
						</DropDownItem>
						<DropDownItem onClick={handleSignout}>
							<SettingsIcon />
							Settings
						</DropDownItem>
					</DropDown>
				</div>
			</div>
		</NavigationContainer>
	)
}

const DropDown = styled.ul`
	position: absolute;
	right: 0;
	top: 100%;
	background-color: ${({ theme: { colors } }) => colors.primary};
	color: ${({ theme: { colors } }) => colors.text_white};
	list-style: none;
	border-radius: 5px;
	visibility: hidden;
	opacity: 0;
	transition: all 150ms ease-in-out;
	min-width: 150px;
	z-index: 1;

	&.toggle {
		visibility: visible;
		opacity: 1;
		transform: translateY(15px);
		transition: all 150ms ease-in-out;
	}
`

const DropDownItem = styled.li`
	padding: 0.5rem 1rem;
	text-align: end;
	cursor: pointer;

	display: flex;
	justify-content: flex-start;
	align-items: center;

	svg {
		margin-right: 1rem;
    height: 24px;
    width: auto;
	}
`

const NavigationContainer = styled.header`
	display: grid;
	grid-template-columns: max-content 3fr 1fr;
	align-items: center;
	width: 100%;
	background-color: ${({ theme: { colors } }) => colors.bg.white};
	z-index: 0;

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

export default TopNavigation
