import { capitalize } from './capitalize'

export const validateShowingForm = (data, setFormErrors) => {
	const required = [
		'address',
		'price',
		'sqft',
		'phoneNumber',
		'leadName',
		'bedrooms',
		'bathrooms',
		'date',
		'preStartTime',
		'preEndTime',
	]

	const difference = required.filter(x => !data[x] && data[x]?.legnth !== 0)

	const errors = {}

	difference.forEach(key => {
		errors[key] = {
			message: `${key
				.replace('_', ' ')
				.split(' ')
				.map((word, i) => (i === 0 ? capitalize(word) : word))
				.join(' ')} is required`,
		}
	})

	if (Object.keys(errors).length) {
		setFormErrors(errors)
		return false
	} else if (data.preStartTime === data.preEndTime) {
		setFormErrors({ ...errors, preStartTime: { message: 'Start time must not be the same as end time' } })
		return false
	} else {
		setFormErrors({})
		return true
	}
}
