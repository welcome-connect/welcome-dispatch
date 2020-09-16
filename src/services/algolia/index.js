import algoliasearch from 'algoliasearch/lite'

const APP_ID = process.env.ALGOLIA_APP_ID
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY

const searchClient = algoliasearch(APP_ID, ADMIN_KEY)

export { searchClient }
