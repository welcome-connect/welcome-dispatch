import styled, { css } from 'styled-components'
import { useSearch } from '@contexts/search/SearchProvider'
import { formatPhoneNumber } from '@utils/index'

export function UserHit({ hit, setSelected, selected }) {
	const isCardSelected = selected?.id === hit.id
	const { setSelectedHit } = useSearch()

	const handleClick = hit => {
		setSelected(hit)
		setSelectedHit(hit)
	}

	return (
		<UserCard isCardSelected={isCardSelected} onClick={() => handleClick(hit)}>
			<Name>{hit.displayName}</Name>
			{hit.phoneNumber ? <Name>{formatPhoneNumber(hit.phoneNumber, '($2) $3-$4')}</Name> : null}
		</UserCard>
	)
}

const UserCard = styled.div`
	background: white;
	border-radius: 4px;
	padding: 8px;
	margin-bottom: 8px;
	display: flex;
	justify-content: space-between;
	font-size: 14px;

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
