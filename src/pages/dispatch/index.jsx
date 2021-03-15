import styled, { css } from 'styled-components'
import { Map } from '@components/map'
import { Layout } from '@components/common'
import { ScheduleView } from '@components/schedule'
import { CalendarIcon } from '@components/icons'
import { useAuth } from '@contexts/auth/AuthProvider'
import { useEffect, useState } from 'react'

const DispatchPage = () => {
	const [loading, setLoading] = useState(true)
	const [isDispatcher, setIsDispatcher] = useState(false)
	const { userDoc } = useAuth()

	useEffect(
		function endLoading() {
			if (userDoc?.role === 'dispatcher') setIsDispatcher(true)
			if (userDoc) setLoading(false)
		},
		[userDoc]
	)

	return (
		<Layout title="Dispatch" icon={<CalendarIcon />}>
			<Grid isAgent={loading || !isDispatcher}>
				{loading ? (
					<h1>Loading...</h1>
				) : (
					<>
						{!isDispatcher ? (
							<FlexColumn>
								<h1>YOU SHALL NOT PASS</h1>
								<h2>Dispatchers only</h2>
							</FlexColumn>
						) : (
							<>
								<ScheduleView />
								<Map />
							</>
						)}
					</>
				)}
			</Grid>
		</Layout>
	)
}

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	height: 100%;

	${({ isAgent }) =>
		isAgent &&
		css`
			place-items: center;
			grid-template-columns: 1fr;
		`}
`

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

export default DispatchPage
