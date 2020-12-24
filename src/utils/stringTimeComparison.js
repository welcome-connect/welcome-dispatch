export const stringTimeComparison = (aTime, bTime) => {
	const aTimeNum = Number(aTime.split(':').join(''))
	const bTimeNum = Number(bTime.split(':').join(''))

	// console.log({ aTimeNum, bTimeNum })
	// console.log(aTimeNum - bTimeNum)
	return aTimeNum - bTimeNum
}
