import styled, { css } from 'styled-components'

export const SettingsInput = styled.input`
	font-size: 14px;
	padding: 0.5rem 0.5rem;
	border-radius: 4px;
	border: 2px solid ${({ theme: { colors } }) => colors.bg.white};
	color: ${({ theme: { colors } }) => colors.text_light};
	transition: all 100ms ease-in-out;
	outline: none;

	&:not(:placeholder-shown) {
		border: 2px solid ${({ theme: { colors } }) => colors.bg.white};
		color: ${({ theme: { colors } }) => colors.text};
		transition: all 150ms ease-in-out;
	}

	&:active,
	&:focus {
		border: 2px solid ${({ theme: { colors } }) => colors.accent};
		transition: all 150ms ease-in-out;
	}

	${({ hasError }) =>
		hasError &&
		css`
			border: 2px solid ${({ theme: { colors } }) => colors.error_text};
			transition: all 150ms ease-in-out;

			&:active,
			&:focus {
				border: 2px solid ${({ theme: { colors } }) => colors.error_text};
				transition: all 150ms ease-in-out;
			}
		`}
`