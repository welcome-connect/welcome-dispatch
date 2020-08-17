import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Link from 'next/link'

import { useAuthState, useAuthSetters } from '../../contexts/auth/AuthProvider'

import Button from '../../styles/styled-components/Button'
import Input from '../../styles/styled-components/Input'
import Label from '../../styles/styled-components/Label'
import Form from '../../styles/styled-components/Form'
import ErrorMessage from '../../styles/styled-components/ErrorMessage'

// TODO: needs form validation and error handling
export const SignInForm = () => {
	const { register, handleSubmit, errors } = useForm()
	const router = useRouter()

	const { user } = useAuthState()
	const { signin } = useAuthSetters()

	const onSubmit = async ({ email, password }) => {
		await signin(email, password)
		router.push('/dashboard')
	}

	return (
		<div>
			<ModifiedForm onSubmit={handleSubmit(onSubmit)}>
				<h1>Sign in to Welcome</h1>
				<div className="label-input-container">
					<Label htmlFor="email">Email</Label>
					<Input
						type="text"
						name="email"
						ref={register({
							required: 'Your email is required',
							pattern: {
								value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: 'Incorrect email format',
							},
						})}
						placeholder="enter your email"
						hasError={errors.email}
					/>
					{errors.email && (
						<ErrorMessage htmlFor="email">{errors.email.message}</ErrorMessage>
					)}
				</div>
				<div className="label-input-container">
					{/** TODO: need to create forgot password functionality */}
					<Label htmlFor="password">Password</Label>
					<Link href="/forgot-password">
						<span className="forgot-password">Forgot password?</span>
					</Link>
					<Input
						type="password"
						name="password"
						ref={register}
						ref={register({
							required: 'Your password is required',
						})}
						placeholder="enter your password"
						hasError={errors.password}
					/>
					{errors.password && (
						<ErrorMessage htmlFor="password">{errors.password.message}</ErrorMessage>
					)}
				</div>
				<Button isPrimary type="submit" style={{ width: '100%' }}>
					Sign In
				</Button>
			</ModifiedForm>
			{/* )} */}
		</div>
	)
}

const ModifiedForm = styled(Form)`
	width: min(420px, 95vw);

	@media (max-width: 768px) {
		padding: 1.5rem;
	}

	h1 {
		margin-bottom: 2rem;

		@media (max-width: 768px) {
			font-size: 1.75rem;
		}
	}

	.label-input-container {
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
	}
`
