import { format, fromUnixTime } from 'date-fns'

export const getColumnSpan = (startTime, endTime = null, options) => {
	const baseHour = 9
	const sectionMin = 5

	let startTimeStr
	let endTimeStr
	if (!options?.alreadyStr) {
		startTimeStr = format(fromUnixTime(startTime), 'HH:mm')
		endTimeStr = format(fromUnixTime(endTime), 'HH:mm')
	} else {
		startTimeStr = startTime
		endTime = endTime
	}

	const [leftStart, rightStart] = startTimeStr.split(':').map(str => Number(str))

	if (!endTime) {
		const leftSpan = (leftStart - baseHour) * 12 + rightStart / sectionMin
		const columnSpan = `${leftSpan + 1}/${leftSpan + 2}`

		return columnSpan
	}

	const [leftEnd, rightEnd] = endTimeStr.split(':').map(str => Number(str))

	const leftSpan = (leftStart - baseHour) * 12 + rightStart / sectionMin
	const rightSpan = (leftEnd - baseHour) * 12 + rightEnd / sectionMin

	const columnSpan = `${leftSpan + 1}/${rightSpan + 1}`

	return columnSpan
}
