import { useState } from 'react'
import styled, { css } from 'styled-components'

import navItems from './nav_items'

import { AccountSettings, TeamSettings, AgentSettings, DispatcherSettings, AgentModal, DispatcherModal } from '../'
import { SettingsProvider } from '@contexts/settings/SettingsProvider'
import { useNavigation } from '@contexts/navigation/NavigationProvider'
import { TeamModal } from '../TeamSettings/TeamModal'

export const Settings = () => {
	const [selectedSetting, setSelectedSetting] = useState(<AccountSettings />)
	const [isSelected, setIsSelected] = useState('account')

	const { isTeamModalOpen, isAgentModalOpen, isDispatcherModalOpen } = useNavigation()

	const selectSetting = setting => {
		switch (setting) {
			case 'account':
				setIsSelected('account')
				setSelectedSetting(<AccountSettings />)
				break
			case 'teams':
				setIsSelected('teams')
				setSelectedSetting(<TeamSettings />)
				break
			case 'agents':
				setIsSelected('agents')
				setSelectedSetting(<AgentSettings />)
				break
			case 'dispatchers':
				setIsSelected('dispatchers')
				setSelectedSetting(<DispatcherSettings />)
				break
			default:
				null
		}
	}

	return (
		<SettingsProvider>
			<Container>
				{isTeamModalOpen ? (
					<TeamModal />
				) : isAgentModalOpen ? (
					<AgentModal />
				) : isDispatcherModalOpen ? (
					<DispatcherModal />
				) : (
					<>
						<SettingsNav>
							{navItems.map(navItem => (
								<NavItem
									key={navItem.name}
									onClick={() => selectSetting(navItem.name.toLowerCase())}
									isSelected={isSelected === navItem.name.toLowerCase()}>
									{navItem.svg}
									{navItem.name}
								</NavItem>
							))}
						</SettingsNav>
						<SelectedView>{selectedSetting}</SelectedView>
					</>
				)}
			</Container>
		</SettingsProvider>
	)
}

const Container = styled.div`
	display: flex;
	height: min(700px, 90vh);
	width: 700px;
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
	padding: 0.5rem 1rem;
	cursor: pointer;
	color: ${({ theme }) => theme.colors.text};

	svg {
		margin-right: 0.5rem;
		height: auto;
		width: 24px;
	}

	&:hover {
		background: ${({ theme }) => theme.colors.bg.hover};
	}

	${({ isSelected }) =>
		isSelected &&
		css`
			background: ${({ theme }) => theme.colors.primary};
			color: white;

			&:hover {
				background: ${({ theme }) => theme.colors.primary};
			}

			svg {
				path {
					stroke: white;
				}
			}
		`}
`
const SelectedView = styled.section`
	padding: 0 32px 0 32px;
	flex-grow: 1;
`
