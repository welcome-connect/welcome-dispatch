import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { useAuth } from '@contexts/auth'
import { FieldGroup, Label, Input, ErrorMessage, Button, Form } from '@styles/styled-components'
import { formatPhoneNumber } from '@utils/index'

export const SignUpForm = () => {
	const { register, handleSubmit, errors, watch } = useForm()
	const { signup } = useAuth()

	const router = useRouter()

	const onSubmit = async data => {
		const userModel = {
			...data,
			phoneNumber: formatPhoneNumber(data.phoneNumber)
		}
		await signup(userModel)
		router.push('/dispatch')
	}

	return (
		<div>
			<ModifiedForm onSubmit={handleSubmit(onSubmit)}>
				<h1>Sign up to Welcome</h1>
				<FieldGroup className="label-input-container">
					<Label htmlFor="name">Full Name</Label>
					<Input
						type="text"
						name="name"
						ref={register({
							required: 'Your name is required'
						})}
						placeholder="enter your name"
						hasError={errors.name}
					/>
					{errors.name && <ErrorMessage htmlFor="name">{errors.name.message}</ErrorMessage>}
				</FieldGroup>

				<FieldGroup className="label-input-container">
					<Label htmlFor="email">Email</Label>
					<Input
						type=""
						name="email"
						ref={register({
							required: 'Your email is required',
							pattern: {
								value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: 'Incorrect email format'
							}
						})}
						placeholder="enter your email"
						hasError={errors.email}
					/>
					{errors.email && <ErrorMessage htmlFor="email">{errors.email.message}</ErrorMessage>}
				</FieldGroup>

				<FieldGroup className="label-input-container">
					<Label htmlFor="phoneNumber">Phone number</Label>
					<Input
						type="text"
						name="phoneNumber"
						ref={register({
							required: 'Phone number is required'
						})}
						placeholder="enter your phone number"
						hasError={errors.phoneNumber}
					/>
					{errors.phoneNumber && <ErrorMessage htmlFor="phoneNumber">{errors.phoneNumber.message}</ErrorMessage>}
				</FieldGroup>

				<FieldGroup className="label-input-container">
					<Label htmlFor="password">Password</Label>
					<Input
						type="password"
						name="password"
						ref={register({
							required: 'A password is required',
							minLength: {
								value: 6,
								message: 'Need a minimum of 6 characters'
							}
						})}
						placeholder="enter your password"
						hasError={errors.password}
					/>
					{errors.password && <ErrorMessage htmlFor="password">{errors.password.message}</ErrorMessage>}
				</FieldGroup>

				<Button isPrimary type="submit" style={{ width: '100%' }}>
					Sign Up
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
