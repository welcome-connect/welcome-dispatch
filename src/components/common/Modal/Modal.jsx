import styled, { keyframes } from 'styled-components'

export function Modal({ children, onClose }) {
	return (
		<Container>
			<Background onClick={onClose}></Background>
			<ModalContainer>{children}</ModalContainer>
		</Container>
	)
}

const fadeIn = keyframes`
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
`

const fadeInUp = keyframes`
	0% {
		opacity: 0;
		transform: translateY(60px);
	}

	100% {
		opacity: 1;
		transform: translateY(0px);
	}
`

const Container = styled.div`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100vw;
`

const Background = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: 100;

	background-color: rgba(0, 0, 0, 0.25);
	animation: ${fadeIn} 150ms ease-in-out;
`

const ModalContainer = styled.div`
	padding: 16px;
	border-radius: 8px;

	place-self: center;
	z-index: 200;
	animation: ${fadeInUp} 150ms ease-in-out;

	background-color: ${({ theme }) => theme.colors.bg.primary};
`
