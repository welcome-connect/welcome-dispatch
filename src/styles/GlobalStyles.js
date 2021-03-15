import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Roboto';
    }

	body {
		font-family: 'Roboto';

		h1, h2, h3, p, span, a {
			color: ${({ theme }) => theme.colors.text};
		}

		ul {
			list-style: none;
		}
	}

	/* GOOGLE AUTOCOMPLETE */
	.pac-container {
		.pac-item {
			&:hover {
				background: ${({ theme }) => theme.colors.bg.hover};
			}
			.pac-item-query {
				font-size: 1rem;
			}
			
			span:last-child {
				font-size: 14px;
			}
		}

		&::after {
			display: none;
		}
	}
`
