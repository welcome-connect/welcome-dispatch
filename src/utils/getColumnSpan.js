export const getColumnSpan = (startTime, endTime = null) => {
	const baseHour = 9
	const sectionMin = 5
	const [leftStart, rightStart] = startTime.split(':').map(str => Number(str))

	if (!endTime) {
		const leftSpan = (leftStart - baseHour) * 12 + rightStart / sectionMin
		const columnSpan = `${leftSpan + 1}/${leftSpan + 2}`

		return columnSpan
	}

	const [leftEnd, rightEnd] = endTime.split(':').map(str => Number(str))

	const leftSpan = (leftStart - baseHour) * 12 + rightStart / sectionMin
	const rightSpan = (leftEnd - baseHour) * 12 + rightEnd / sectionMin

	const columnSpan = `${leftSpan + 1}/${rightSpan + 1}`

	return columnSpan
}
