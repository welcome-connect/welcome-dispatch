import styled from 'styled-components'
import { Layout } from '../../components/Layout'
import { Map } from '../../components/Map'
import { Schedule } from '../../components/Schedule'
import { CalendarIcon } from '../../components/_icons'
import { format } from 'date-fns'

const DispatchPage = () => {
	console.log('****** RERENDERING !!!')

	return (
		<Layout title={`Dispatch - ${format(Date.now(), 'EEEE, LLLL do')}`} icon={<CalendarIcon />}>
			<Grid>
				<Schedule />
				<Map />
			</Grid>
		</Layout>
	)
}

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	height: 100%;
`

export default DispatchPage
