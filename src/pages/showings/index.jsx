import styled from 'styled-components'
import { getUnixTime } from 'date-fns'
import { useEffect, useState } from 'react'

import { db } from '@services/firebase'
import { SearchProvider } from '@contexts/search/SearchProvider'
import { useFirestoreSub } from '@hooks/useFirestoreSub'

import { Hits, Layout, Configure, SearchBox } from '@components/common'
import { FieldGroup, Label, SettingsInput } from '@styles/styled-components'
import { ShowingsIcon } from '@components/icons'
import { ShowingHit } from '@components/ui/ShowingHit/ShowingHit'

const tableColumns = ['address', 'date', 'start time', 'end time', 'agent', 'lead', 'lead phone number', 'price', 'status']

export default function ShowingsPage() {
	const [showings, setShowings] = useState([])
	const [startDate, setStartDate] = useState(null)
	const [endDate, setEndDate] = useState(null)
	const [results, getResults] = useState([])

	const [partialShowings] = useFirestoreSub('showings', {
		where:
			startDate && endDate
				? [
						['date.seconds', '>=', startDate],
						['date.seconds', '<=', endDate]
				  ]
				: null
	})

	async function fetchCompleteShowings() {
		const completeShowings = await Promise.all(
			partialShowings.map(async showing => {
				const agent = (await db.collection('users').doc(showing.agentId).get()).data()
				const lead = (await db.collection('leads').doc(showing.leadId).get()).data()
				return {
					...showing,
					agent,
					agentName: agent.displayName,
					lead,
					leadName: lead.displayName,
					leadPhoneNumber: lead.phoneNumber
				}
			})
		)
		completeShowings.sort((a, b) => b.date.seconds - a.date.seconds)
		setShowings(completeShowings)
	}

	function onStartDateChange(e) {
		setStartDate(getUnixTime(new Date(`${e.target.value} 00:01`)))
	}

	function onEndDateChange(e) {
		setEndDate(getUnixTime(new Date(`${e.target.value} 23:59`)))
	}

	useEffect(() => {
		if (partialShowings) {
			fetchCompleteShowings()
		}
	}, [partialShowings])

	return (
		<Layout title="Showings" icon={<ShowingsIcon fill="#383F51" />}>
			<Container>
				<SearchProvider data={showings}>
					<Configure
						getData={getResults}
						filters={['address', 'agentName', 'leadName', 'leadPhoneNumber']}
						hitsPerPage={100}
					/>
					<InputsContainer>
						<SearchBox label="Search" />
						<MFieldGroup>
							<Label htmlFor="startDate">Start Date</Label>
							<SettingsInput type="date" name="startDate" onChange={onStartDateChange} />
						</MFieldGroup>
						<MFieldGroup>
							<Label htmlFor="endDate">End Date</Label>
							<SettingsInput type="date" name="endDate" onChange={onEndDateChange} />
						</MFieldGroup>
					</InputsContainer>
					<Results>
						Showing results: <strong>{results.length}</strong>
					</Results>
					<Columns>
						{tableColumns.map(column => (
							<ColumnTitleContainer key={column}>
								<ColumnTitle>{column}</ColumnTitle>
							</ColumnTitleContainer>
						))}
					</Columns>
					<HitsContainer>
						<Hits hitComponent={ShowingHit} />
					</HitsContainer>
				</SearchProvider>
			</Container>
		</Layout>
	)
}

const Container = styled.main`
	padding: 24px;
	height: 100%;
	display: flex;
	flex-direction: column;
`

const InputsContainer = styled.div`
	display: grid;
	grid-template-columns: 300px 140px 140px;
	grid-gap: 2rem;
`

const Results = styled.p`
	margin-bottom: 1rem;
`

const MFieldGroup = styled(FieldGroup)`
	margin: 0;
`

const HitsContainer = styled.ul`
	display: grid;
	grid-template-rows: repeat(auto-fit, 51.2px);
	grid-gap: 12px;
	overflow-y: auto;
	height: 200px;
	flex-grow: 1;
`

const Columns = styled.div`
	display: grid;
	grid-template-columns: 2.5fr repeat(5, 1fr) 1.5fr repeat(2, 1fr);
	margin-bottom: 1.5rem;
`
const ColumnTitleContainer = styled.div`
	width: 100%;
	height: 24px;
	border-right: 1px solid ${({ theme }) => theme.colors.text_light};
	display: flex;
	justify-content: center;
	align-items: center;

	&:first-of-type {
		justify-content: flex-start;
	}
`
const ColumnTitle = styled.p`
	text-transform: uppercase;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.text_light};
`
