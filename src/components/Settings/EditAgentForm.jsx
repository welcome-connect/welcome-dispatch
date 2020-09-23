import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { useNavigation } from '../../contexts/navigation'
import { useSettings } from '../../contexts/settings'
import { useUpdateAgent } from '../../hooks'
import {
	Button,
	ErrorMessage,
	FieldGroup,
	Form,
	Label,
	SettingsInput,
} from '../../styles/styled-components'
import { formatPhoneNumber } from '../../utils'

export const EditAgentForm = () => {
	const { register, errors, handleSubmit, setValue } = useForm()
	const { isEditing, isSelected, setSelected } = useSettings()
	const { toggleAgentModal } = useNavigation()
	const { isLoading, isSuccess, hasNoChanges, authRequired, updateAgent } = useUpdateAgent()

	const onSubmit = async data => {
		const { phoneNumber } = await updateAgent(isSelected, data)
		setValue('phoneNumber', formatPhoneNumber(phoneNumber, '($2) $3-$4'))
		const id = setTimeout(() => toggleAgentModal(), 600)
		return () => clearTimeout(id)
	}

	const onCancel = () => {
		setSelected(null)
		toggleAgentModal()
	}

	useEffect(() => {
		if (isEditing) {
			setValue('displayName', isSelected.displayName)
			setValue('email', isSelected.email)
			setValue('phoneNumber', formatPhoneNumber(isSelected.phoneNumber, '($2) $3-$4'))
		}
	}, [])

	return (
		<Container>
			<ModifiedForm onSubmit={handleSubmit(onSubmit)}>
				<ModifiedFieldGroup>
					<Label htmlFor="displayName">Display name</Label>
					<SettingsInput
						type="text"
						name="displayName"
						ref={register}
						hasError={errors.displayName}
					/>
				</ModifiedFieldGroup>
				<ModifiedFieldGroup>
					<Label htmlFor="email">Email</Label>
					<SettingsInput
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
					<SettingsInput
						type="text"
						name="phoneNumber"
						ref={register}
						hasError={errors.phoneNumber}
					/>
				</ModifiedFieldGroup>
				<ModifiedButton isPrimary type="submit">
					Save
				</ModifiedButton>
				<ModifiedButton isPrimary type="button" className="cancel" onClick={onCancel}>
					Cancel
				</ModifiedButton>
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
	height: 100%;
	width: 100%;
	padding: 8px 32px;
	position: relative;
`
const ModifiedButton = styled(Button)`
	position: absolute;
	right: 32px;
	bottom: 12px;

	&.cancel {
		left: 32px;
	}
`

const ModifiedForm = styled(Form)`
	padding: 1rem 0;
	background-color: transparent;
	width: 100%;
`

const ModifiedFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`

const ModifiedErrorMessage = styled(ErrorMessage)`
	position: static;
	font-size: 1rem;
`
