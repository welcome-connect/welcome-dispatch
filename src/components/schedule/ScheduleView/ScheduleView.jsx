import { format } from 'date-fns'
import styled from 'styled-components'
import { useAuth } from '@contexts/auth'

import { useDispatch } from '@contexts/dispatch'
import { useNavigation } from '@contexts/navigation'
import { useFirestoreSub } from '@hooks/index'

import { getColumnSpan } from '@utils/index'

import { Button } from '@styles/styled-components'
import { ShowingsRow } from '../ShowingsRow'
import { LeftCircleArrow, RightCircleArrow } from '@components/icons'

const times = [
	'09:00',
	'09:30',
	'10:00',
	'10:30',
	'11:00',
	'11:30',
	'12:00',
	'12:30',
	'13:00',
	'13:30',
	'14:00',
	'14:30',
	'15:00',
	'15:30',
	'16:00',
	'16:30',
	'17:00',
	'17:30',
	'18:00',
	'18:30',
]

export const ScheduleView = () => {
	const { toggleNewLeadModal } = useNavigation()
	const { selectedTeam, setSelectTeam, teamAgents, observedDate, addObservedDays, subObservedDays } = useDispatch()
	const { userDoc } = useAuth()

	const [teams] = useFirestoreSub('teams', {
		where: ['id', 'in', userDoc && userDoc?.teams?.length > 0 ? userDoc.teams : ['']],
	})

	const handleSelect = e => {
		const team = teams.find(team => team.id === e.target.value)
		setSelectTeam(team)
	}

	return (
		<Container>
			<TopRow>
				<Select value={selectedTeam.id} onChange={handleSelect}>
					{teams.map(team => (
						<option value={team.id} key={team.id}>
							{team.name}
						</option>
					))}
				</Select>
				<h4>{`${format(observedDate, 'EEEE, LLLL do - yyyy')}`}</h4>
				<div className="icons">
					<div className="left" onClick={() => subObservedDays(1)}>
						<LeftCircleArrow />
					</div>
					<div className="right" onClick={() => addObservedDays(1)}>
						<RightCircleArrow />
					</div>
				</div>
			</TopRow>
			<Grid>
				<Agents>
					<div className="agent-container">
						<div className="agent-row"></div>
					</div>
					{teamAgents.map(agent => {
						return (
							<div className="agent-container" key={agent.id}>
								<div className="avatar" />
								<div className="agent-row">{agent.displayName}</div>
							</div>
						)
					})}
				</Agents>
				<ShowingsGrid>
					<TimeLine>
						{times.map(time => {
							return (
								<TimeContainer startTime={time} key={time}>
									<TimeSlot>
										<div className="time">{time}</div>
									</TimeSlot>
								</TimeContainer>
							)
						})}
					</TimeLine>
					{teamAgents.map(agent => (
						<ShowingsRow agent={agent} key={agent.id} />
					))}
				</ShowingsGrid>
			</Grid>
			<Button isPrimary onClick={toggleNewLeadModal}>
				Add new lead
			</Button>
		</Container>
	)
}

const Container = styled.div`
	margin: 24px;
	display: grid;
	grid-template-rows: min-content 1fr min-content;
	border-radius: 8px 8px 0 0;
	height: calc(100vh - 108px);
	overflow-y: hidden;

	position: relative;
`

const Grid = styled.div`
	padding: 24px 0 0 24px;
	margin-bottom: 16px;
	display: grid;
	grid-template-columns: 208px 1fr;
	overflow-y: scroll;

	background: white;
	border-radius: 0 0 4px 4px;
`

const TopRow = styled.div`
	border-radius: 8px 8px 0 0;
	height: 100px;
	padding: 24px;
	background: white;

	display: grid;
	grid-template-columns: 1fr 3fr 1fr;
	align-items: center;

	.icons {
		display: flex;
		justify-self: end;

		.left {
			margin-right: 16px;
		}

		.left,
		.right {
			cursor: pointer;
		}
	}

	h4 {
		place-self: center;
	}
`

const Select = styled.select`
	border: 1px solid ${({ theme }) => theme.colors.primary};
	padding: 8px;
	border-radius: 4px;
	text-align: center;
	height: fit-content;
	width: fit-content;

	font-size: 0.9rem;

	/* -moz-appearance: none; */
	/* -webkit-appearance: none; */
`

const Agents = styled.div`
	padding-top: 8px;
	.agent-container {
		display: flex;
		align-items: center;

		.avatar {
			height: 48px;
			width: 48px;
			background: ${({ theme }) => theme.colors.border_darker};
			margin-right: 12px;
			border-radius: 4px;
		}

		.agent-row {
			grid-column: 0/1;
			display: flex;
			height: 56px;
			align-items: center;
			font-size: 0.9rem;
		}
	}
`
const ShowingsGrid = styled.div`
	width: 100%;
	overflow-x: visible;
	overflow-y: hidden;
	padding-bottom: 100px;
	padding-top: 8px;
`
const TimeLine = styled.div`
	display: grid;
	grid-template-columns: repeat(120, 24px);
	height: 56px;
	align-items: center;
	width: fit-content;

	border-bottom: 1px solid rgba(203, 213, 224, 0.4);
`

const TimeContainer = styled.div`
	position: relative;
	height: 100%;
	grid-column: ${({ startTime }) => getColumnSpan(startTime)};
`

const TimeSlot = styled.div`
	position: absolute;
	font-size: 0.9rem;
	border-left: 1px solid ${({ theme }) => theme.colors.text_light};
	color: ${({ theme }) => theme.colors.primary};
	font-weight: 500;
	padding-left: 4px;
	height: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	/* left: -100%; */
	top: 0;
	/* transform: translateY(-50%);  */

	/* text-align: center; */
`
