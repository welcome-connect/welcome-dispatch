import styled, { css } from 'styled-components'
import { memo, useEffect } from 'react'

import { useNavigation } from '@contexts/navigation'
import { useSettings } from '@contexts/settings'
import { useFirestoreSub } from '@hooks/index'
import { SearchProvider } from '@contexts/search'

import { AddIcon, EditIcon, LessIcon } from '@components/icons'
import { Configure, Hits, SearchBox } from '@components/common'
import { UserHit } from '@components/ui'

export const DispatcherSettings = memo(() => {
	const { toggleDispatcherModal } = useNavigation()
	const { setSelected, isSelected, setIsEditing } = useSettings()

	const [dispatchers] = useFirestoreSub('users', {
		where: ['role', '==', 'dispatcher'],
	})

	useEffect(() => {
		setSelected(null)
	}, [])

	const handleEdit = () => {
		setIsEditing(true)
		toggleDispatcherModal()
	}

	const handleAdd = () => {
		setIsEditing(false)
		setSelected(null)
		toggleDispatcherModal()
	}

	const handleMinus = () => {}

	return (
		<Container>
			<SearchProvider data={dispatchers}>
				<Configure filters={['displayName', 'email']} />
				<SearchBox label="Search users" />
				<Hits hitComponent={UserHit} />
			</SearchProvider>

			<IconRow>
				<IconWrapper onClick={isSelected ? handleEdit : null} isDisabled={!isSelected}>
					<EditIcon />
				</IconWrapper>
				<IconWrapper onClick={isSelected ? handleMinus : null} isDisabled={!isSelected}>
					<LessIcon />
				</IconWrapper>
				<IconWrapper onClick={handleAdd}>
					<AddIcon />
				</IconWrapper>
			</IconRow>
		</Container>
	)
})

const Container = styled.div`
	height: 100%;
	position: relative;
	padding: 8px 0;
`
const IconRow = styled.div`
	display: flex;
	margin-top: auto;
	position: absolute;
	bottom: 8px;
	right: 0;
`
const IconWrapper = styled.span`
	display: block;
	margin-left: 16px;
	cursor: pointer;

	svg {
		height: 24px;
		width: auto;
	}

	${({ isDisabled }) =>
		isDisabled &&
		css`
			cursor: initial;
			svg {
				path {
					stroke: ${({ theme }) => theme.colors.gray.accent};
				}
			}
		`}
`
