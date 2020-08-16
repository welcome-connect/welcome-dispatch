import { ThemeProvider } from 'styled-components'

import { theme, GlobalStyles } from '../styles'

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp