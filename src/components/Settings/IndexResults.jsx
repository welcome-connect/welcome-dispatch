const { connectStateResults } = require('react-instantsearch-dom')

export const IndexResults = connectStateResults(({ children, allSearchResults }) => {
	if (!allSearchResults?.query) return null
	else return children
})
