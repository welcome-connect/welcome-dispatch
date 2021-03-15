import { UserAvatarIcon } from '@components/icons'
import { formatPhoneNumber } from '@utils/formatPhoneNumber'
import styled from 'styled-components'

export function UserAvatar({ user }) {
	return (
		<Container>
			<Avatar>
				<UserAvatarIcon />
			</Avatar>
			<Info>
				<Name>{user.name}</Name>
				<LightP>{user.role}</LightP>
				<LightP>{formatPhoneNumber(user.phoneNumber, '($2) $3-$4')}</LightP>
			</Info>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
`
const Info = styled.div``
const Avatar = styled.div`
	width: 64px;
	height: 64px;
	background-color: ${({ theme }) => theme.colors.bg.primary};
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;

	margin-right: 1rem;
`

const LightP = styled.p`
	color: ${({ theme }) => theme.colors.text_light};
`

const Name = styled.p`
	font-size: 18px;
	font-weight: 600;
`
