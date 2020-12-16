import styled from 'styled-components'
import { Map } from '@components/map'
import { Layout } from '@components/common'
import { ScheduleView } from '@components/schedule'
import { CalendarIcon } from '@components/icons'

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
