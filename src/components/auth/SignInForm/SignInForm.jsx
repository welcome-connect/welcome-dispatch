import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Link from 'next/link'

import { useAuth } from '@contexts/auth'

import { FieldGroup, Label, Input, ErrorMessage, Button, Form } from '@styles/styled-components'

export const SignInForm = () => {
	const { register, handleSubmit, errors } = useForm()
	const router = useRouter()

	const { signin } = useAuth()

	const onSubmit = async ({ email, password }) => {
		await signin(email, password)
		router.push('/dispatch')
	}

	return (
		<div>
			<ModifiedForm onSubmit={handleSubmit(onSubmit)}>
				<h1>Sign in to Welcome</h1>
				<FieldGroup className="label-input-container">
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
					{errors.email && <ErrorMessage htmlFor="email">{errors.email.message}</ErrorMessage>}
				</FieldGroup>
				<FieldGroup className="label-input-container">
					{/** TODO: need to create forgot password functionality */}
					<Label htmlFor="password">Password</Label>
					<Link href="/forgot-password">
						<span className="forgot-password">Forgot password?</span>
					</Link>
					<Input
						type="password"
						name="password"
						ref={register({
							required: 'Your password is required',
						})}
						placeholder="enter your password"
						hasError={errors.password}
					/>
					{errors.password && <ErrorMessage htmlFor="password">{errors.password.message}</ErrorMessage>}
				</FieldGroup>
				<Button isPrimary type="submit" style={{ width: '100%' }}>
					Sign In
				</Button>
			</ModifiedForm>
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
`
