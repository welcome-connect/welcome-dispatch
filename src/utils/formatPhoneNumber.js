export const formatPhoneNumber = (phoneNumber, format = '+1$2$3$4') => {
	const regex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
	// Group1: Country Code (ex: 1 or 86)
	// Group2: Area Code (ex: 800)
	// Group3: Exchange (ex: 555)
	// Group4: Subscriber Number (ex: 1234)
	// Group5: Extension (ex: 5678)

	return phoneNumber?.replace(regex, format)
}
