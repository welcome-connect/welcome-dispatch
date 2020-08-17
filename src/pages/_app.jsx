import { ThemeProvider } from 'styled-components'
import Head from 'next/head'

import { theme, GlobalStyles } from '../styles'
import AuthProvider from '../contexts/auth/AuthProvider'

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
			</Head>
			<ThemeProvider theme={theme}>
				<AuthProvider>
					<GlobalStyles />
					<Component {...pageProps} />
				</AuthProvider>
			</ThemeProvider>
		</>
	)
}

export default MyApp
