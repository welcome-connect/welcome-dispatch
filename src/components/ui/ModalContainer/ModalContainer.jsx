import { memo } from 'react'
import styled from 'styled-components'

export const ModalContainer = memo(({ children }) => {
	return <Container>{children}</Container>
})

const Container = styled.div`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 100;

	height: min(700px, 90%);
	width: 700px;
	border-radius: 8px;
	padding: 24px 8px;

	background-color: ${({ theme }) => theme.colors.bg.primary};
`
