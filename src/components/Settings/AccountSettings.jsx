import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

import { useAuthState } from '../../contexts/auth'
import { formatPhoneNumber } from '../../utils'
import { useUpdateUserProfile } from '../../hooks'

import {
	Form,
	Input,
	Label,
	FieldGroup,
	Button,
	ErrorMessage,
} from '../../styles/styled-components'

export const AccountSettings = () => {
	const { register, errors, handleSubmit, setValue } = useForm()
	const { user, userObj } = useAuthState()
	const {
		isLoading,
		isSuccess,
		hasNoChanges,
		authRequired,
		updateUserProfile,
	} = useUpdateUserProfile()

	useEffect(() => {
		setValue('displayName', user.displayName)
		setValue('email', user.email)
		setValue('phoneNumber', formatPhoneNumber(userObj.phoneNumber, '($2) $3-$4'))
	}, [user, userObj])

	const onSubmit = async data => {
		await updateUserProfile(data)
	}

	return (
		<Container>
			<ModifiedForm onSubmit={handleSubmit(onSubmit)}>
				<ModifiedFieldGroup>
					<Label htmlFor="displayName">Display name</Label>
					<ModifiedInput
						type="text"
						name="displayName"
						ref={register}
						placeholder={user.displayName}
						hasError={errors.displayName}
					/>
				</ModifiedFieldGroup>
				<ModifiedFieldGroup>
					<Label htmlFor="email">Email</Label>
					<ModifiedInput
						type="text"
						name="email"
						ref={register({
							required: 'Your email is required',
							pattern: {
								value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
							},
						})}
						hasError={errors.email}
					/>
				</ModifiedFieldGroup>
				<ModifiedFieldGroup>
					<Label htmlFor="phoneNumber">Phone number</Label>
					<ModifiedInput
						type="text"
						name="phoneNumber"
						ref={register}
						hasError={errors.phoneNumber}
					/>
				</ModifiedFieldGroup>
				<Button isPrimary>Save</Button>
			</ModifiedForm>
			{isLoading ? <p>Loading...</p> : null}
			{isSuccess ? <p>Updated !</p> : null}
			{hasNoChanges ? <p>No changes made.</p> : null}
			{authRequired ? (
				<ModifiedErrorMessage>
					This operation is sensitive and requires recent authentication. Log in again before
					retrying this request.
				</ModifiedErrorMessage>
			) : null}
		</Container>
	)
}

const Container = styled.div`
	width: 100%;
`
const ModifiedForm = styled(Form)`
	padding: 1rem 0;
	background-color: transparent;
	width: 100%;
`

const ModifiedInput = styled(Input)`
	background-color: transparent;
`

const ModifiedFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`

const ModifiedErrorMessage = styled(ErrorMessage)`
	position: static;
	font-size: 1rem;
`
