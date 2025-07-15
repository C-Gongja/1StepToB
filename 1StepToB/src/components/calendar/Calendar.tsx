import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';
import YearLevel from './YearLevel';
import CalendarHeader from './CalendarHeader';
import MonthLevel from './MonthLevel';
import DayLevel from './DayLevel';
import WeekLevel from './WeekLevel';

interface CalendarProps {
	initialDate?: Date;
}

type ViewLevel = 'year' | 'month' | 'week' | 'day';

const Calendar: React.FC<CalendarProps> = React.memo(({
	initialDate = new Date(),
}) => {
	const [currentDate, setCurrentDate] = useState(initialDate);
	const [viewLevel, setViewLevel] = useState<ViewLevel>('year');

	// Navigation history for back button
	const [navigationStack, setNavigationStack] = useState<Array<{
		date: Date;
		level: ViewLevel;
	}>>([]);


	const handleMonthChange = (month: number) => {
		// Update the current date to the selected month, keeping current year and day
		const newDate = new Date(currentDate);
		newDate.setMonth(month);
		setCurrentDate(newDate);
	};

	const handleDayPress = (date: Date) => {
		// Save current state to navigation stack
		setNavigationStack(prev => [...prev, {
			date: currentDate,
			level: viewLevel
		}]);

		// Navigate to day view
		setCurrentDate(date);
		setViewLevel('day');
	};

	const handleMonthPress = (year: number, month: number) => {
		const newDate = new Date(year, month, 1);

		// Save current state to navigation stack
		setNavigationStack(prev => [...prev, {
			date: currentDate,
			level: viewLevel
		}]);

		// Navigate to month view
		setCurrentDate(newDate);
		setViewLevel('month');
	};

	const handleBackPress = () => {
		if (navigationStack.length === 0) return;

		const previousState = navigationStack[navigationStack.length - 1];

		// Restore previous state
		setCurrentDate(previousState.date);
		setViewLevel(previousState.level);
		setNavigationStack(prev => prev.slice(0, -1));
	};

	const [shouldScrollToToday, setShouldScrollToToday] = useState(false);

	const handleAddPress = () => {
		const today = new Date();
		setCurrentDate(today);
		// Clear navigation stack when jumping to today
		setNavigationStack([{
			date: currentDate,
			level: 'year'
		}]);

		setViewLevel('month');
		setShouldScrollToToday(true); // Today 버튼 클릭 시에만 스크롤
	};

	const handleDatePress = (date: Date) => {
		setCurrentDate(date);
	};

	const handleWeekSwipe = (weekStartDate: Date) => {
		// Save current state to navigation stack
		setNavigationStack(prev => [...prev, {
			date: currentDate,
			level: viewLevel
		}]);

		// Navigate to week view with the week's start date
		setCurrentDate(weekStartDate);
		setViewLevel('week');
	};



	const renderCurrentView = () => {
		switch (viewLevel) {
			case 'year':
				return (
					<YearLevel
						currentYear={currentDate.getFullYear()}
						onMonthPress={handleMonthPress}
					/>
				);
			case 'month':
				return (
					<MonthLevel
						currentDate={currentDate}
						onDayPress={handleDayPress}
						onMonthChange={handleMonthChange}
						shouldScrollToToday={shouldScrollToToday}
						onScrollToTodayComplete={() => setShouldScrollToToday(false)}
					// onWeekSwipe={handleWeekSwipe}
					/>
				);
			case 'week':
				return (
					<WeekLevel
						currentDate={currentDate}
					/>
				);
			case 'day':
				return (
					<DayLevel
						currentDate={currentDate}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<View style={styles.container}>
			<CalendarHeader
				currentDate={currentDate}
				viewLevel={viewLevel}
				onBackPress={handleBackPress}
				onAddPress={handleAddPress}
				canGoBack={navigationStack.length > 0}
				onDatePress={handleDatePress}
			/>

			<View style={styles.contentContainer}>
				{renderCurrentView()}
			</View>
		</View>
	);
});

export default Calendar;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	contentContainer: {
		flex: 1,
	},
	placeholder: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	placeholderText: {
		fontSize: 18,
		color: '#8E8E93',
		textAlign: 'center',
	},
});