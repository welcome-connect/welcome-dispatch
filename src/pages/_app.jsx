import Head from 'next/head'
import { ThemeProvider } from 'styled-components'

import { theme, GlobalStyles } from '../styles'

import { NavigationProvider } from '../contexts/navigation'
import { AuthProvider } from '../contexts/auth'
import { useFirestoreSub } from '@hooks/useFirestoreSub'
import { SOSModal } from '@components/sos/SOSModal/SOSModal'

function MyApp({ Component, pageProps }) {
	const [[sosSignal]] = useFirestoreSub('sos-signal')
	console.log({ sosSignal })

	return (
		<>
			<Head>
				<meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
				<title>Welcome Dispatch</title>
			</Head>

			<ThemeProvider theme={theme}>
				<AuthProvider>
					<NavigationProvider>
						<GlobalStyles />
						<Component {...pageProps} />
						{sosSignal ? <SOSModal sosSignal={sosSignal} /> : null}
					</NavigationProvider>
				</AuthProvider>
			</ThemeProvider>
		</>
	)
}

export default MyApp
