import { useState } from 'react'
import styled from 'styled-components'

import navItems from './nav_items'

import { AccountSettings } from './AccountSettings'
import { TeamSettings } from './TeamSettings'
import { AgentSettings } from './AgentSettings'
import { DispatcherSettings } from './DispatcherSettings'

export const Settings = () => {
	const [selectedSetting, setSelectedSetting] = useState(<AccountSettings />)

	const selectSetting = setting => {
		console.log({ setting })
		switch (setting) {
			case 'account':
				return setSelectedSetting(<AccountSettings />)
			case 'teams':
				return setSelectedSetting(<TeamSettings />)
			case 'agents':
				return setSelectedSetting(<AgentSettings />)
			case 'dispatchers':
				return setSelectedSetting(<DispatcherSettings />)
			default:
				null
		}
	}

	return (
		<Container>
			<SettingsNav>
				{navItems.map(navItem => (
					<NavItem key={navItem.name} onClick={() => selectSetting(navItem.name.toLowerCase())}>
						{navItem.svg}
						{navItem.name}
					</NavItem>
				))}
			</SettingsNav>
			<SelectedView>{selectedSetting}</SelectedView>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
`
const SettingsNav = styled.nav`
	display: flex;
	flex-direction: column;
	height: 100%;
	border-right: 1px solid ${({ theme }) => theme.colors.border_darker};
`
const NavItem = styled.span`
	display: flex;
	align-items: center;
	margin-bottom: 0.5rem;
	padding: 0.5rem 1rem;
	cursor: pointer;

	svg {
		margin-right: 0.5rem;
		height: auto;
		width: 24px;
	}

	&:hover {
		background: ${({ theme }) => theme.colors.bg.hover};
	}
`
const SelectedView = styled.section`
	padding-left: 1rem;
`
