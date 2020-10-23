import styled from 'styled-components'
import { Layout } from '../../components/Layout'
import { Map } from '../../components/Map'
import { ScheduleView } from '../../components/ScheduleView'
import { CalendarIcon } from '../../components/_icons'
import { format } from 'date-fns'

const DispatchPage = () => {
	console.log('****** RERENDERING !!!')

	return (
		<Layout title="Dispatch" icon={<CalendarIcon />}>
			<Grid>
				<ScheduleView />
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
