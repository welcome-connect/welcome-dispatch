import styled from 'styled-components'
import { ErrorMessage, FieldGroup, Label, SettingsInput, Textarea } from '@styles/styled-components'
import { SearchProvider } from '@contexts/search/SearchProvider'
import { Configure, Hits, SearchBox, UserHit } from '@components/common'
import { useFirestoreSub } from '@hooks/useFirestoreSub'
import { useEffect } from 'react'

export function EditShowingStageThree({ handleChange, setAgent, agent, formData, formErrors, submitError, setChangedData }) {
	const [agents] = useFirestoreSub('users', {
		where: ['role', '==', 'agent']
	})

	useEffect(() => {
		if (!agent) {
			document.querySelector("input[name='search']")?.focus()
		}
	}, [agent])

	function handleAgentSelection(agent) {
		setChangedData(data => {
			return { ...data, agentId: agent.id }
		})
		setAgent(agent)
	}

	return (
		<>
			<Section>
				<h2>Assignment</h2>

				<SingleFieldGroup>
					<Label htmlFor="date">Date</Label>
					<SettingsInput type="date" name="date" value={formData.date} onChange={e => handleChange(e)} disabled />
				</SingleFieldGroup>
				<Col>
					<SingleFieldGroup>
						<Label htmlFor="preStartTime">Start time</Label>
						<SettingsInput
							type="time"
							name="preStartTime"
							step="300"
							min="09:00"
							max="19:30"
							value={formData.preStartTime}
							onChange={e => handleChange(e)}
							disabled
						/>
					</SingleFieldGroup>
					<SingleFieldGroup>
						<Label htmlFor="preEndTime">End time</Label>
						<SettingsInput
							type="time"
							name="preEndTime"
							step="300"
							min="09:00"
							max="19:30"
							value={formData.preEndTime}
							onChange={e => handleChange(e)}
							disabled
						/>
					</SingleFieldGroup>
				</Col>
				<SingleFieldGroup>
					<Label htmlFor="additionalNotes">Additional notes</Label>
					<Textarea
						type="text"
						name="additionalNotes"
						value={formData.additionalNotes}
						onChange={e => handleChange(e)}
					/>
				</SingleFieldGroup>
				{!agent ? (
					<SearchProvider data={agents}>
						<Configure
							filters={['displayName', 'email']}
							display={false}
							hitsPerPage={3}
							displayQuery="displayName"
						/>
						<SearchBox label="Agent" />
						<Hits hitComponent={UserHit} setSelected={handleAgentSelection} selected={agent} />
					</SearchProvider>
				) : (
					<SingleFieldGroup>
						<Label htmlFor="agentName">Agent</Label>
						<SettingsInput
							type="text"
							name="agentName"
							value={agent.displayName}
							onChange={() => setAgent(null)}
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
