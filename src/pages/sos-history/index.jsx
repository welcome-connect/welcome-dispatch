import { Layout } from '@components/common'
import { SOSIcon } from '@components/icons/SOSIcon'
import { SOSMap } from '@components/sos/SOSMap/SOSMap'
import { db } from '@services/firebase'
import { format, fromUnixTime } from 'date-fns'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

export default function SOSHistoryPage() {
	const [sosSignals, setSosSignals] = useState([])

	useEffect(() => {
		async function fetchSOSSignals() {
			const signalDocs = (await db.collection('sos-history').orderBy('createdAt', 'desc').get()).docs.map(doc =>
				doc.data()
			)
			setSosSignals(signalDocs)
		}

		fetchSOSSignals()
	}, [])

	console.log({ sosSignals })

	return (
		<Layout title="SOS History" icon={<SOSIcon fill="#383F51" />}>
			<PageContainer>
				{sosSignals.map(signal => {
					return (
						<SOSSignalCard key={signal.id}>
							<InfoContainer>
								<p>
									Date:{' '}
									<span>{format(fromUnixTime(signal.createdAt.seconds), 'MM/dd/yyyy - hh:mm aaa')}</span>
								</p>
								<p>
									Message: <span>{signal.message}</span>
								</p>
								<p>
									Coordinates:{' '}
									<span>
										{signal.latitude}, {signal.longitude}
									</span>
								</p>
							</InfoContainer>
							<MSOSMap
								center={{ lat: signal.latitude, lng: signal.longitude }}
								zoomControl={false}
								zoom={10}
								agentId={signal.createdBy}
							/>
						</SOSSignalCard>
					)
				})}
			</PageContainer>
		</Layout>
	)
}

const PageContainer = styled.div`
	padding: 24px;
	height: 100%;
	display: flex;
	flex-direction: column;
`

const SOSSignalCard = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	background: white;
	border-radius: 16px;
	margin-bottom: 2rem;
`
const MSOSMap = styled(SOSMap)`
	height: 300px;
	min-width: 600px;
	border-radius: 0 16px 16px 0;
`

const InfoContainer = styled.div`
	padding: 1rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	p {
		margin-bottom: 0.5rem;

		span {
			font-weight: 600;
		}
	}
`
