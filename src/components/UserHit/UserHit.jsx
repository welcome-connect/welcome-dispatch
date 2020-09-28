import styled, { css } from "styled-components"
import { useSettings } from "../../contexts/settings"

export const UserHit = ({ hit: { id, displayName }, hit }) => {
	const { setSelected, isSelected } = useSettings()
	const isCardSelected = isSelected?.id === id

	const handleClick = hit => {
		setSelected(hit)
	}

	return (
		<UserCard isCardSelected={isCardSelected} onClick={() => handleClick(hit)}>
			<Name>{displayName}</Name>
		</UserCard>
	)
}

const UserCard = styled.div`
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
