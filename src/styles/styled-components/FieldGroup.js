import styled from 'styled-components'

export const FieldGroup = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	position: relative;
	margin-bottom: 2rem;

	.forgot-password {
		position: absolute;
		right: 0;
		font-size: 14px;
		font-weight: 300;
		text-decoration: none;
		color: ${({ theme: { colors } }) => colors.text_light};
		cursor: pointer;

		&:hover,
		&:active,
		&:focus {
			color: ${({ theme: { colors } }) => colors.text};
			text-decoration: underline;
		}
	}
`
