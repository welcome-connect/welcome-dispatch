import { useForm } from 'react-hook-form'
import { useRef } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { useAuthSetters, useAuthState } from '../../contexts/auth/AuthProvider'

import Button from '../../styles/styled-components/Button'
import Input from '../../styles/styled-components/Input'
import Label from '../../styles/styled-components/Label'
import Form from '../../styles/styled-components/Form'
import ErrorMessage from '../../styles/styled-components/ErrorMessage'

export const SignUpForm = () => {
	const { register, handleSubmit, errors, watch } = useForm()
	const password = useRef({})
	password.current = watch('password', '')
	const { signup } = useAuthSetters()
	const { user } = useAuthState()

	const router = useRouter()

	const onSubmit = data => {
		signup(data)
		router.push('/dashboard')
	}

	return (
		<div>
			<ModifiedForm onSubmit={handleSubmit(onSubmit)}>
				<h1>Sign up to Welcome</h1>
				<div className="label-input-container">
					<Label htmlFor="name">Full Name</Label>
					<Input
						type="text"
						name="name"
						ref={register({
							required: 'Your name is required',
						})}
						placeholder="enter your name"
						hasError={errors.name}
					/>
					{errors.name && (
						<ErrorMessage htmlFor="name">{errors.name.message}</ErrorMessage>
					)}
				</div>
				<div className="label-input-container">
					<Label htmlFor="email">Email</Label>
					<Input
						type=""
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
					<Label htmlFor="password">Password</Label>
					<Input
						type="password"
						name="password"
						ref={register({
							required: 'A password is required',
							minLength: {
								value: 6,
								message: 'Need a minimum of 6 characters',
							},
						})}
						placeholder="enter your password"
						hasError={errors.password}
					/>
					{errors.password && (
						<ErrorMessage htmlFor="password">{errors.password.message}</ErrorMessage>
					)}
				</div>
				<div className="label-input-container">
					<Label htmlFor="passwordConfirm">Confirm Password</Label>
					<Input
						type="password"
						name="passwordConfirm"
						ref={register({
							required: 'Password confirmation is required',
							minLength: {
								value: 6,
								message: 'Need a minimum of 6 characters',
							},
							validate: value =>
								value === password.current || 'The passwords do not match',
						})}
						placeholder="confirm your password"
						hasError={errors.passwordConfirm}
					/>
					{errors.passwordConfirm && (
						<ErrorMessage htmlFor="password">
							{errors.passwordConfirm.message}
						</ErrorMessage>
					)}
				</div>
				<Button isPrimary type="submit" style={{ width: '100%' }}>
					Sign Up
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
		min-width: 300px;
		position: relative;
		margin-bottom: 2rem;
	}

	label + button {
		margin-top: 0.5rem;
	}
`
