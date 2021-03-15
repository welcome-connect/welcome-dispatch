import { Flex } from '@styles/styled-components'
import styled, { css } from 'styled-components'

export function Status({ status, size = '16px', ...props }) {
	const bgColor =
		status === 'pending'
			? '#CBD5E0'
			: status === 'completed'
			? '#00D084'
			: status === 'inRoute'
			? '#F5C61F'
			: status === 'cancelled'
			? '#F56565'
			: '#667EEA'

	return (
		<MFlex>
			<Circle status={bgColor} size={size} {...props} />
		</MFlex>
	)
}

const Circle = styled.div`
	${({ size }) =>
		css`
			height: ${size};
			width: ${size};
		`}
	border-radius: 50%;
	background-color: ${({ status }) => status};
`

const MFlex = styled(Flex)`
	width: fit-content;
	justify-content: space-between;
	align-items: center;

	span {
		margin-right: 8px;
		font-size: 0.9rem;
	}
`
