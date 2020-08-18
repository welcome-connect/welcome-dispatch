import styled from 'styled-components'
import Link from 'next/link'

import { Logo } from '../../components/_icons'
import { SignUpForm } from '../../components/SignUpForm'

const SignUpPage = () => (
	<PageLayout>
		<div className="left-container">
			<div className="logo-container">
				<Logo main="white" accent="#00D084" />
			</div>
		</div>
		<div className="right-container">
			<div className="logo-container">
				<Logo main="white" accent="#00D084" />
			</div>
			<SignUpForm />
			<Link href="/">
				<span className="signin">
					already a member? <strong>Sign in</strong>
				</span>
			</Link>
		</div>
	</PageLayout>
)

const PageLayout = styled.main`
	display: flex;
	height: 100vh;

	.left-container {
		width: 30vw;
		background-color: ${({ theme: { colors } }) => colors.primary};

		.logo-container {
			padding: 2rem;
			height: 30vh;

			svg {
				width: 120px;
				height: auto;
			}
		}

		@media (max-width: 768px) {
			display: none;
		}
	}

	.right-container {
		width: 70vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: ${({ theme: { colors } }) => colors.bg.primary};

		position: relative;

		.signin {
			position: absolute;
			top: 1.5rem;
			right: 2rem;
			cursor: pointer;

			text-decoration: none;
			color: ${({ theme: { colors } }) => colors.text};

			strong {
				font-weight: 700;

				&:hover {
					text-decoration: underline;
				}
			}

			@media (max-width: 768px) {
				position: static;
				margin-top: 1.5rem;
				color: ${({ theme: { colors } }) => colors.border_darker};
			}
		}

		.logo-container {
			padding: 2rem;
			display: none;

			svg {
				width: 120px;
				height: auto;
			}
		}

		@media (max-width: 768px) {
			width: 100vw;
			background-color: ${({ theme: { colors } }) => colors.primary};

			.logo-container {
				width: min(380px, 95vw);
				display: block;
				padding: 1rem 0;
				position: absolute;
				top: 0;
				left: 4vw;
			}
		}
	}
`

export default SignUpPage
