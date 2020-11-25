import styled from 'styled-components'
import { useSearch } from '@contexts/search'

export const Hits = ({ hitComponent: HitComponent, ...props }) => {
	const {
		state: { data, displayTrigger },
	} = useSearch()

	return (
		<List>
			{displayTrigger
				? data.map(hit => (
						<ListItem key={hit.id}>
							<HitComponent hit={hit} {...props} />
						</ListItem>
				  ))
				: null}
		</List>
	)
}

const List = styled.ul`
	list-style: none;
`

const ListItem = styled.li``
