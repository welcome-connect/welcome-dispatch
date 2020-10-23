const { default: styled } = require('styled-components')
const { useForm } = require('react-hook-form')

import { useState } from 'react'
import { useNavigation } from '../../contexts/navigation'
import { createLead } from '../../services/firebase/leads'
import { formatPhoneNumber } from '../../utils'

const {
	Button,
	Form,
	FieldGroup,
	ErrorMessage,
	SettingsInput,
	Label,
} = require('../../styles/styled-components')

export const NewLeadForm = () => {
	const { register, errors, handleSubmit } = useForm()
	const [leadExists, setLeadExists] = useState({ exists: false, lead: null })

	const { toggleNewLeadModal } = useNavigation()

	const onSubmit = async data => {
		const newLead = await createLead({ ...data, phoneNumber: formatPhoneNumber(data.phoneNumber) })
		if (newLead.alreadyExist) setLeadExists({ exists: true, lead: newLead.lead })
		if (!newLead.alreadyExist) toggleNewLeadModal()
	}

	return (
		<Container>
			<ModifiedForm onSubmit={handleSubmit(onSubmit)}>
				{!leadExists.exists ? (
					<h1>Add New Lead</h1>
				) : (
					<>
						<h1>Huh.</h1>
						<p>A lead with that phone number already exists...</p>
						<div className="lead">
							<h3>Lead</h3>
							<p>{leadExists.lead.displayName}</p>
							<p>{formatPhoneNumber(leadExists.lead.phoneNumber, '($2) $3-$4')}</p>
						</div>
					</>
				)}
				{!leadExists.exists ? (
					<>
						<ModifiedFieldGroup>
							<Label htmlFor="displayName">Name</Label>
							<SettingsInput
								type="text"
								name="displayName"
								ref={register}
								hasError={errors.displayName}
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
						<ModifiedButton isPrimary>Add</ModifiedButton>
					</>
				) : null}
			</ModifiedForm>
		</Container>
	)
}

const Container = styled.div`
	height: 100%;
	width: 100%;
	padding: 8px 32px;
	position: relative;

	h1 {
		margin-bottom: 32px;
	}

	.lead {
		margin-top: 32px;

		h3 {
			margin-bottom: 8px;
		}
	}
`

const ModifiedButton = styled(Button)`
	margin-left: auto;
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
