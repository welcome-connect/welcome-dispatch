import styled from 'styled-components'
import { connectSearchBox } from 'react-instantsearch-dom'

import { FieldGroup, Label, SettingsInput } from '../../styles/styled-components'

export const CustomSearchBox = connectSearchBox(
	({ label, currentRefinement, refine, placeholder }) => {
		return (
			<ModifiedFieldGroup>
				<ModifiedLabel>{label}</ModifiedLabel>
				<SettingsInput
					type="search"
					value={currentRefinement}
					onChange={event => refine(event.currentTarget.value)}
					placeholder={placeholder}
				/>
			</ModifiedFieldGroup>
		)
	},
)

const ModifiedFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`

const ModifiedLabel = styled(Label)`
	color: ${({ theme: { colors } }) => colors.text};
`
