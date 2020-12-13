import styled from 'styled-components'
import { Layout } from '@components/common'

const AgentPage = () => {
	console.log('****** RERENDERING !!!')

	return (
		<Layout title="Agent">
			<h1>Agent Page</h1>
		</Layout>
	)
}

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	height: 100%;
`

export default AgentPage
