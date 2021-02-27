import Head from 'next/head'
import { ThemeProvider } from 'styled-components'

import { theme, GlobalStyles } from '../styles'

import { NavigationProvider } from '../contexts/navigation'
import { AuthProvider } from '../contexts/auth'

function MyApp({ Component, pageProps }) {
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
					</NavigationProvider>
				</AuthProvider>
			</ThemeProvider>
		</>
	)
}

export default MyApp
