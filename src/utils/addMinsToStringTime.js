export const addMinsToStringTime = (stringTime, minutes) => {
	if (!stringTime) throw new Error('String time is required')

	let [hour, mins] = stringTime.split(':').map(str => Number(str))
	mins = mins + minutes

	if (mins >= 60) {
		hour++
		mins = mins - 60
	}

	if (mins < 10) {
		mins = `0${mins}`
	}

	if (hour < 10) {
		hour = `0${hour}`
	}

	return `${hour}:${mins}`
}
