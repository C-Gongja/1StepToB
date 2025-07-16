// Cache for expensive calculations
const calendarCache = new Map<string, any>();
const CACHE_SIZE_LIMIT = 100;

export const formatDate = (date: Date): string => {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
};

export const formatTime = (date: Date | string | undefined): string => {
	if (!date) return '--:--';
	
	const dateObj = date instanceof Date ? date : new Date(date);
	
	if (isNaN(dateObj.getTime())) {
		return '--:--';
	}
	
	return dateObj.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit'
	});
};

export const formatDateTime = (date: Date): string => {
	return `${formatDate(date)} ${formatTime(date)}`;
};

export const isToday = (date: Date): boolean => {
	const today = new Date();
	return date.toDateString() === today.toDateString();
};

export const isTomorrow = (date: Date): boolean => {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	return date.toDateString() === tomorrow.toDateString();
};

export const isOverdue = (date: Date): boolean => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return date < today;
};

export const getWeekDates = (startDate: Date): Date[] => {
	const dates = [];
	const start = new Date(startDate);
	start.setDate(start.getDate() - start.getDay());

	for (let i = 0; i < 7; i++) {
		const date = new Date(start);
		date.setDate(start.getDate() + i);
		dates.push(date);
	}

	return dates;
};

export const generateId = (): string => {
	return Date.now().toString() + Math.random().toString(36).substring(2, 11);
};

// Optimized calendar utilities with caching
export const getMonthNames = (): string[] => [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

export const getDaysInMonth = (year: number, month: number): Date[] => {
	const cacheKey = `days-${year}-${month}`;

	if (calendarCache.has(cacheKey)) {
		return calendarCache.get(cacheKey);
	}

	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const daysInMonth = lastDay.getDate();
	const startingDayOfWeek = firstDay.getDay();

	const days = [];

	// Add days from previous month for empty cells at the beginning
	const prevMonth = month === 0 ? 11 : month - 1;
	const prevYear = month === 0 ? year - 1 : year;
	const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

	for (let i = startingDayOfWeek - 1; i >= 0; i--) {
		const day = daysInPrevMonth - i;
		days.push(new Date(prevYear, prevMonth, day));
	}

	// Add all days of the current month
	for (let day = 1; day <= daysInMonth; day++) {
		days.push(new Date(year, month, day));
	}

	// Add days from next month to complete the last week
	const totalCells = startingDayOfWeek + daysInMonth;
	const weeksNeeded = Math.ceil(totalCells / 7);
	const targetCells = weeksNeeded * 7;

	const nextMonth = month === 11 ? 0 : month + 1;
	const nextYear = month === 11 ? year + 1 : year;
	let nextMonthDay = 1;

	while (days.length < targetCells) {
		days.push(new Date(nextYear, nextMonth, nextMonthDay));
		nextMonthDay++;
	}

	// Cache management
	if (calendarCache.size >= CACHE_SIZE_LIMIT) {
		const firstKey = calendarCache.keys().next().value;
		if (firstKey) {
			calendarCache.delete(firstKey);
		}
	}

	calendarCache.set(cacheKey, days);
	return days;
};

export const getMiniCalendarDays = (year: number, month: number): (Date | null)[] => {
	const cacheKey = `mini-${year}-${month}`;

	if (calendarCache.has(cacheKey)) {
		return calendarCache.get(cacheKey);
	}

	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const daysInMonth = lastDay.getDate();
	const startingDayOfWeek = firstDay.getDay();

	const days = [];

	// Add empty cells for days before the first day of the month
	for (let i = 0; i < startingDayOfWeek; i++) {
		days.push(null);
	}

	// Add all days of the month
	for (let day = 1; day <= daysInMonth; day++) {
		days.push(new Date(year, month, day));
	}

	// Cache management
	if (calendarCache.size >= CACHE_SIZE_LIMIT) {
		const firstKey = calendarCache.keys().next().value;
		if (firstKey) {
			calendarCache.delete(firstKey);
		}
	}

	calendarCache.set(cacheKey, days);
	return days;
};

export const isSameMonth = (date: Date | null, month: number): boolean => {
	if (!date) return false;
	return date.getMonth() === month;
};

export const clearCalendarCache = (): void => {
	calendarCache.clear();
};