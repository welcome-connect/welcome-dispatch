import styled from 'styled-components'
import { useSearch } from '../../contexts/search/SearchProvider'
import { FieldGroup, Label, SettingsInput } from '../../styles/styled-components'

export const SearchBox = ({ label }) => {
	const { query, setQuery } = useSearch()

	return (
		<ModifiedFieldGroup>
			{label ? <Label htmlFor="search">{label}</Label> : null}
			<SettingsInput
				type="text"
				name="search"
				value={query}
				onChange={e => setQuery(e.target.value)}
			/>
		</ModifiedFieldGroup>
	)
}

const ModifiedFieldGroup = styled(FieldGroup)`
	margin-bottom: 1rem;
`
