import styled from 'styled-components'
import { useSearch } from '@contexts/search'

export const Hits = ({ hitComponent: HitComponent, ...props }) => {
	const {
		state: { data, displayTrigger }
	} = useSearch()

	return (
		<>
			{displayTrigger
				? data.map(hit => (
						<ListItem key={hit.id}>
							<HitComponent hit={hit} {...props} />
						</ListItem>
				  ))
				: null}
		</>
	)
}

const ListItem = styled.li``
