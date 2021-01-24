import styled from 'styled-components'

import { useFirestoreSub } from '@hooks/useFirestoreSub'

import { SearchProvider } from '@contexts/search/SearchProvider'

import { Configure, Hits, SearchBox, UserHit } from '@components/common'
import { ErrorMessage, FieldGroup, Label, SettingsInput, Textarea } from '@styles/styled-components'

export function StageThree({ formData, handleChange, setSelectedAgent, selectedAgent, submitError, formErrors }) {
	const [agents] = useFirestoreSub('users', {
		where: ['role', '==', 'agent'],
	})

	return (
		<>
			<Section>
				<h2>Assignment</h2>

				<SingleFieldGroup>
					<Label htmlFor="date">Date</Label>
					<SettingsInput type="date" name="date" value={formData.date} onChange={e => handleChange(e)} required />
				</SingleFieldGroup>
				<Col>
					<SingleFieldGroup>
						<Label htmlFor="start_time">Start time</Label>
						<SettingsInput
							type="time"
							name="start_time"
							step="300"
							min="09:00"
							max="19:30"
							value={formData.start_time}
							onChange={e => handleChange(e)}
							required
						/>
					</SingleFieldGroup>
					<SingleFieldGroup>
						<Label htmlFor="end_time">End time</Label>
						<SettingsInput
							type="time"
							name="end_time"
							step="300"
							min="09:00"
							max="19:30"
							value={formData.end_time}
							onChange={e => handleChange(e)}
							required
						/>
					</SingleFieldGroup>
				</Col>
				<SingleFieldGroup>
					<Label htmlFor="additional_notes">Additional notes</Label>
					<Textarea
						type="text"
						name="additional_notes"
						value={formData.additional_notes}
						onChange={e => handleChange(e)}
					/>
				</SingleFieldGroup>
				{!selectedAgent ? (
					<SearchProvider data={agents}>
						<Configure
							filters={['displayName', 'email']}
							display={false}
							hitsPerPage={3}
							displayQuery="displayName"
						/>
						<SearchBox label="Agent" />
						<Hits hitComponent={UserHit} setSelected={setSelectedAgent} selected={selectedAgent} />
					</SearchProvider>
				) : (
					<SingleFieldGroup>
						<Label htmlFor="agent_name">Agent</Label>
						<SettingsInput
							type="text"
							name="agent_name"
							value={selectedAgent.displayName}
							onChange={() => setSelectedAgent(null)}
							required
						/>
					</SingleFieldGroup>
				)}
				{submitError ? <ModifiedErrorMessage>{submitError.message}</ModifiedErrorMessage> : null}
				{formErrors
					? Object.values(formErrors).map(function renderErrors(error) {
							return <ModifiedErrorMessage key={error.message}>{error.message}</ModifiedErrorMessage>
					  })
					: null}
			</Section>
		</>
	)
}

const SingleFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`

const Section = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 2rem;

	h2 {
		margin-bottom: 12px;
		font-size: 16px;
		font-weight: 300;
	}
`

const Col = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 32px;
`

const ModifiedErrorMessage = styled(ErrorMessage)`
	position: static;
	margin-top: 1rem;
	font-size: 0.9rem;
`
