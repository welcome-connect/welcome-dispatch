import { Layout } from '../../components/Layout'
import { CalendarIcon } from '../../components/_icons'

const DispatchPage = () => {
	console.log('****** RERENDERING !!!')

	return (
		<Layout title={'Dispatch - Thursday, August 13th'} icon={<CalendarIcon />}>
			<h1>Dispatch Page</h1>
		</Layout>
	)
}

export default DispatchPage
