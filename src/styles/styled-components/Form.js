import styled from 'styled-components'

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	background-color: ${({ theme: { colors } }) => colors.bg.white};
	color: ${({ theme: { colors } }) => colors.text};
	padding: 2.5rem;
	border-radius: 8px;
`
