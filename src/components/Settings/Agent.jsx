import styled, { css } from 'styled-components'
import { useEffect } from 'react'
import { useSettings } from '../../contexts/settings'

export const Agent = ({ agent: { displayName, id }, agent }) => {
	const { setSelected, isSelected } = useSettings()
	const isCardSelected = isSelected?.id === id

	const handleClick = agent => {
		setSelected(agent)
		console.log(agent)
	}

	return (
		<AgentCard isCardSelected={isCardSelected} onClick={() => handleClick(agent)}>
			<Name>{displayName}</Name>
		</AgentCard>
	)
}

const AgentCard = styled.div`
	background: white;
	border-radius: 4px;
	padding: 8px;
	margin-bottom: 8px;

	cursor: pointer;

	&:hover {
		background: ${({ theme }) => theme.colors.bg.hover};
	}

	${({ isCardSelected }) =>
		isCardSelected &&
		css`
			background: ${({ theme }) => theme.colors.bg.hover};
		`}
`

const Name = styled.span``
