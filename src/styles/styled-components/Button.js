import styled, { css } from 'styled-components'

export const Button = styled.button`
	padding: 0.5rem 1rem;
	margin-top: 0.5rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
	width: fit-content;
	box-sizing: border-box;
	transition: all 150ms ease-in-out;

	${({ isPrimary }) =>
		isPrimary &&
		css`
			color: ${({ theme: { colors } }) => colors.text_white};
			background: ${({ theme: { colors } }) => colors.primary};
			border: none;

			&.active,
			&:hover,
			&:active,
			&:focus {
				background-color: ${({ theme: { colors } }) => colors.primary_hover};
				transition: all 150ms ease-in-out;
			}
		`}

	${({ isSecondary }) =>
		isSecondary &&
		css`
			color: ${({ theme: { colors } }) => colors.primary};
			background: ${({ theme: { colors } }) => colors.text_white};
			border: 1px solid ${({ theme: { colors } }) => colors.primary};

			&.active,
			&:hover,
			&:active,
			&:focus {
				color: ${({ theme: { colors } }) => colors.text_white};
				background: ${({ theme: { colors } }) => colors.primary};
				transition: all 150ms ease-in-out;
			}
		`}
  
    ${({ isTertiary }) =>
		isTertiary &&
		css`
			background-color: transparent;
			color: ${({ theme: { colors } }) => colors.text_light};
			border: 2px solid ${({ theme: { colors } }) => colors.border_darker};

			&.active,
			&:hover,
			&:active,
			&:focus {
				border: 2px solid ${({ theme: { colors } }) => colors.red.accent};
				color: ${({ theme: { colors } }) => colors.red.text};
				transition: all 150ms ease-in-out;
			}
		`}

  ${({ isDisabled }) =>
		isDisabled &&
		css`
			color: ${({ theme: { colors } }) => colors.text_light};
			background: ${({ theme: { colors } }) => colors.text_white};
			border: 1px solid ${({ theme: { colors } }) => colors.text_light};
		`}
`
