import styled from 'styled-components'

export const ErrorMessage = styled.label`
	display: flex;
	align-items: center;
	position: absolute;
	margin: 0.25rem 0 0;
	border-radius: 5px;
	font-size: 1rem;
	font-weight: 400;
	font-size: 14px;
	color: ${({ theme: { colors } }) => colors.error_text};
	opacity: 0.9;

	top: 100%;
	right: 0;
`
