import { Flex } from '@styles/styled-components'
import { fromUnixTime, format } from 'date-fns'
import styled from 'styled-components'

export function ShowingNote({ note }) {
	return note ? (
		<Container>
			<MFlex>
				<p>
					{note?.createdBy} - <span>Agent</span>
				</p>
				<p>{format(fromUnixTime(note?.date), 'MM-dd-yyyy')}</p>
			</MFlex>
			<p>{note?.message}</p>
		</Container>
	) : null
}

const Container = styled.div`
	border-bottom: 1px solid ${({ theme }) => theme.colors.border_light};
	padding: 24px 0;
`
const MFlex = styled(Flex)`
	margin-bottom: 0.5rem;
	p {
		color: ${({ theme }) => theme.colors.text_light};

		span {
			color: inherit;
			font-style: italic;
		}
	}
`
