import moment from 'moment';
export const getFormattedDates = (meetingData) => {
	const { recurrenceData, startDateTime, endDateTime } = meetingData;
	const { type, Daily, Weekly, Yearly, Monthly } = recurrenceData;
	const range = getRangeFormat(meetingData);

	let reccurenceDates = [];
	switch (type) {
		case 'Yearly':
			reccurenceDates = getYearlyFormat(Yearly, range);
			break;
		case 'Daily':
			reccurenceDates = getDailyFormat(Daily, range);
			break;
		case 'Weekly':
			reccurenceDates = getWeeklyFormat(Weekly, range);
			break;
		case 'Monthly':
			reccurenceDates = getMonthlyFormat(Monthly, range);
			break;
		default:
			reccurenceDates = [];
	}

	if (reccurenceDates.length > 0) {
		const firstDate = new Date(reccurenceDates[0]);
		firstDate.setHours(0, 0, 0, 0);
		const meetingDate = new Date(startDateTime);
		meetingDate.setHours(0, 0, 0, 0);
		if (firstDate.getTime() !== meetingDate.getTime()) {
			reccurenceDates.push(meetingDate);
		}
	}

	return getMeetingStartEndDates(
		reccurenceDates,
		new Date(startDateTime),
		new Date(endDateTime)
	);
};

const getMeetingStartEndDates = (reccurenceDates, msd, med) => {
	let formattedMeetingDates = [];

	if (reccurenceDates && reccurenceDates.length > 0) {
		// const a = moment(msd);
		// const b = moment(med);
		// const diffDays = b.diff(a, "days");
		const diffDays = Math.abs(med.getDate() - msd.getDate());

		reccurenceDates.forEach((date) => {
			let startDate = new Date(date);
			let endDate = new Date(date);

			startDate.setHours(msd.getHours(), msd.getMinutes(), 0, 0);
			endDate.setHours(
				med.getHours(),
				med.getMinutes(),
				med.getSeconds(),
				med.getMilliseconds()
			);
			endDate.setDate(date.getDate() + diffDays);
			const startEndData = {
				start_date: new Date(startDate).toISOString(),
				end_date: new Date(endDate).toISOString(),
			};
			formattedMeetingDates.push(startEndData);
		});
	}

	return formattedMeetingDates;
};

const getRangeFormat = (meetingData) => {
	const { recurrenceData, startDateTime } = meetingData;
	const { Range, type } = recurrenceData;

	const startDate =
		Range && Range.reccurenceStartDate && new Date(Range.reccurenceStartDate);
	const meetingStartDate = new Date(startDateTime);
	meetingStartDate &&
		startDate &&
		startDate.setHours(
			meetingStartDate.getHours(),
			meetingStartDate.getMinutes(),
			meetingStartDate.getSeconds(),
			meetingStartDate.getMilliseconds()
		);

	// if (startDate.getTime() === meetingStartDate.getTime()) {
	//   startDate.setDate(startDate.getDate() + 1);
	// }
	// debugger;
	// const { rangeRadio, EndAfterText, reccurenceEndDate } = Range;

	let endDate =
		(Range &&
			Range.reccurenceStartDate &&
			new Date(Range.reccurenceStartDate)) ||
		'';
	if (Range && Range.rangeRadio === 'NoEndRadio') {
		endDate =
			type === 'Yearly'
				? new Date(endDate.setFullYear(endDate.getFullYear() + 10))
				: new Date(endDate.setFullYear(endDate.getFullYear() + 1));
	} else {
		endDate = Range && new Date(Range.reccurenceEndDate);
	}
	const occurences =
		Range && Range.EndAfterText ? parseInt(Range.EndAfterText) : 0;

	return {
		occurences,
		reccurenceStartDate: startDate && startDate,
		reccurenceEndDate: endDate && endDate,
	};
};

const getDailyFormat = (dailyData, range) => {
	const { occurences, reccurenceEndDate, reccurenceStartDate } = range;
	const { DailyRadio } = dailyData;
	let meetingDates = [];
	if (DailyRadio === 'dailyEveryWeekend') {
		if (occurences > 0) {
			let i = reccurenceStartDate;
			for (let temp = 1; temp <= occurences; i.setDate(i.getDate() + 1)) {
				let dayValue = i.getDay();
				if (dayValue >= 1 && dayValue < 6) {
					meetingDates.push(new Date(i));
					temp++;
				}
			}
		} else {
			for (
				let j = reccurenceStartDate;
				j <= reccurenceEndDate;
				j.setDate(j.getDate() + 1)
			) {
				let dayValue = j.getDay();
				if (dayValue >= 1 && dayValue < 6) {
					meetingDates.push(new Date(j));
				}
			}
		}
	} else {
		const days = parseInt(dailyData.dailyDays);
		if (occurences > 0) {
			for (
				let i = reccurenceStartDate, temp = 1;
				temp <= occurences;
				i.setDate(i.getDate() + days), temp++
			) {
				meetingDates.push(new Date(i));
			}
		} else {
			for (
				let i = reccurenceStartDate;
				i <= reccurenceEndDate;
				i.setDate(i.getDate() + days)
			) {
				meetingDates.push(new Date(i));
			}
		}
	}
	return meetingDates;
};

const getWeeklyFormat = (weeklyData, range) => {
	const { occurences, reccurenceEndDate, reccurenceStartDate } = range;

	const { weekendDays } = weeklyData;
	const diff = parseInt(weekendDays) * 7;
	let dayNames = [];
	if (weeklyData && Object.keys(weeklyData).length > 0) {
		Object.keys(weeklyData).forEach((day) => {
			if (weeklyData[day] === true) dayNames.push(day);
		});
	}

	let meetingDates = [];
	let dayOfWeek = moment(reccurenceStartDate).day();
	let weekStartDate = new Date(reccurenceStartDate);
	weekStartDate.setDate(weekStartDate.getDate() - dayOfWeek);

	if (occurences > 0) {
		for (
			let i = weekStartDate, temp = 1;
			temp <= occurences;
			i.setDate(i.getDate() + diff)
		) {
			let checkDate = new Date(i);

			for (let t = 1; t <= 7; t++, checkDate.setDate(checkDate.getDate() + 1)) {
				if (
					dayNames.indexOf(moment(checkDate).format('dddd')) > -1 &&
					checkDate >= reccurenceStartDate
				) {
					meetingDates.push(new Date(checkDate));
					temp++;
				}
			}
			//dayOfWeek = 1;
		}
	} else {
		for (
			let i = weekStartDate;
			i <= reccurenceEndDate;
			i.setDate(i.getDate() + diff)
		) {
			let checkDate = new Date(i);

			for (let t = 1; t <= 7; t++, checkDate.setDate(checkDate.getDate() + 1)) {
				if (
					dayNames.indexOf(moment(checkDate).format('dddd')) > -1 &&
					checkDate <= reccurenceEndDate &&
					checkDate >= reccurenceStartDate
				) {
					meetingDates.push(new Date(checkDate));
				}
			}
			// dayOfWeek = 1;
		}
	}

	return meetingDates;
};

const getYearlyFormat = (yearlyData, range) => {
	const { occurences, reccurenceEndDate, reccurenceStartDate } = range;
	const { yearlySelectYear, YearlyRadio } = yearlyData;
	const yearDiff = parseInt(yearlySelectYear);
	let meetingDates = [];
	const date = new Date(reccurenceStartDate);

	if (YearlyRadio === 'yearlyFirstRadio') {
		const dayOfMonth = parseInt(yearlyData.yearlySelectMonthField);
		const month = yearlyData.yearlySelectMonth;

		if (occurences > 0) {
			for (
				let i = reccurenceStartDate, temp = 1;
				temp <= occurences;
				i.setFullYear(i.getFullYear() + yearDiff)
			) {
				i.setMonth(Math.abs(month - 1));
				i.setDate(dayOfMonth);
				if (date <= i) {
					meetingDates.push(new Date(i));
					temp++;
				}
			}
		} else {
			for (
				let i = reccurenceStartDate;
				i <= reccurenceEndDate;
				i.setFullYear(i.getFullYear() + yearDiff)
			) {
				i.setMonth(Math.abs(month - 1));
				i.setDate(dayOfMonth);
				if (date <= i) {
					meetingDates.push(new Date(i));
				}
			}
		}
	} else {
		const month = yearlyData.yearlyMonth;
		const week = yearlyData.yearlyNumber - 1;
		const dayOfWeek = yearlyData.yearlyWeek;

		const startDate = new Date(reccurenceStartDate);
		const getStartDate = startDate.getDate();
		startDate.setDate(startDate.getDate() - getStartDate + 1);

		if (occurences > 0) {
			for (
				let i = startDate, temp = 1;
				temp <= occurences;
				i.setFullYear(i.getFullYear() + yearDiff)
			) {
				i.setMonth(Math.abs(month - 1));
				let t = new Date(getWeekDay(i, dayOfWeek));
				if (date <= i) {
					meetingDates.push(new Date(t.setDate(t.getDate() + week * 7)));
					temp++;
				}
			}
		} else {
			for (
				let i = startDate;
				i <= reccurenceEndDate;
				i.setFullYear(i.getFullYear() + yearDiff)
			) {
				i.setMonth(Math.abs(month - 1));
				let t = new Date(getWeekDay(i, dayOfWeek));
				if (date <= i) {
					meetingDates.push(new Date(t.setDate(t.getDate() + week * 7)));
				}
			}
		}
	}
	return meetingDates;
};

const getMonthlyFormat = (monthlyData, range) => {
	const { occurences, reccurenceEndDate, reccurenceStartDate } = range;
	let meetingDates = [];

	const date = new Date(reccurenceStartDate);
	if (monthlyData.MonthlyRadio === 'monthlySelectedDay') {
		const { monthlyDay, monthlyMonth } = monthlyData;
		const dayOfMonth = monthlyDay ? parseInt(monthlyDay) : 0;
		const monthDiff = parseInt(monthlyMonth);
		if (occurences > 0) {
			for (
				let i = reccurenceStartDate, temp = 1;
				temp <= occurences;
				i.setMonth(i.getMonth() + monthDiff)
			) {
				i.setDate(dayOfMonth);
				if (date <= i) {
					meetingDates.push(new Date(i));
					temp++;
				}
			}
		} else {
			for (
				let i = reccurenceStartDate;
				i <= reccurenceEndDate;
				i.setMonth(i.getMonth() + monthDiff)
			) {
				i.setDate(dayOfMonth);
				if (date <= i) {
					meetingDates.push(new Date(i));
				}
			}
		}
	} else {
		const { monthlySelectMonthField, selectDate, selectDay } = monthlyData;
		const monthDiff = parseInt(monthlySelectMonthField);
		const week = selectDate - 1;

		const startDate = getStartDateForWeek(reccurenceStartDate, week);
		if (occurences > 0) {
			for (
				let i = startDate, temp = 1;
				temp <= occurences;
				i.setMonth(i.getMonth() + monthDiff)
			) {
				let t = new Date(getWeekDay(i, selectDay));
				meetingDates.push(new Date(t.setDate(t.getDate() + week * 7)));
				temp++;
			}
		} else {
			for (
				let i = startDate;
				i <= reccurenceEndDate;
				i.setMonth(i.getMonth() + monthDiff)
			) {
				if (i >= startDate) {
					let t = new Date(getWeekDay(i, selectDay));
					let meetingDate = new Date(t.setDate(t.getDate() + week * 7));
					if (meetingDate <= reccurenceEndDate) {
						meetingDates.push(new Date(meetingDate));
					}
				}
			}
		}
	}
	return meetingDates;
};
const getWeekDay = (dateString, dayOfWeek) => {
	let date = moment(dateString, 'DD-MMMM-YYYY');
	let day = date.day();
	let diffDays = 0;

	if (day > dayOfWeek) {
		diffDays = 7 - (day - dayOfWeek);
	} else {
		diffDays = dayOfWeek - day;
	}
	return date.add(diffDays, 'day').format('DD-MMMM-YYYY');
};

const getStartDateForWeek = (reccurenceStartDate, week) => {
	let startDate = new Date(reccurenceStartDate);
	const day = startDate.getDate();
	let changeDate = false;
	switch (week) {
		case 0:
			if (day <= 7) {
				startDate.setDate(1);
			} else {
				changeDate = true;
			}
			break;
		case 1:
			if (day <= 15) {
				startDate.setDate(1);
			} else {
				changeDate = true;
			}
			break;
		case 2:
			if (day <= 24) {
				startDate.setDate(1);
			} else {
				changeDate = true;
			}
			break;
		case 3:
			if (day <= 31) {
				startDate.setDate(1);
			} else {
				changeDate = true;
			}
			break;
		default:
			startDate = reccurenceStartDate;
	}
	if (changeDate) {
		startDate.setDate(1);
		startDate.setMonth(startDate.getMonth() + 1);
	}
	return startDate;
};
