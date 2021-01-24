import { capitalize } from './capitalize'

export const validateShowingForm = (data, setFormErrors) => {
	const required = [
		'formatted_address',
		'price',
		'sqft',
		'phone_number',
		'lead_name',
		'bedrooms',
		'bathrooms',
		'date',
		'start_time',
		'end_time',
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

	if (errors) {
		setFormErrors(errors)
		return false
	} else if (data.start_time === data.end_time) {
		setFormErrors({ ...errors, start_time: { message: 'Start time must not be the same as end time' } })
		return false
	} else {
		setFormErrors({})
		return true
	}
}
