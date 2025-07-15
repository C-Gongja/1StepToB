import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';

interface CalendarHeaderProps {
	currentDate: Date;
	viewLevel: 'year' | 'month' | 'week' | 'day';
	onBackPress?: () => void;
	onAddPress?: () => void;
	canGoBack?: boolean;
	title?: string;
	onDatePress?: (date: Date) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = React.memo(({
	currentDate,
	viewLevel,
	onBackPress,
	onAddPress,
	canGoBack = false,
	title,
	onDatePress,
}) => {
	const getHeaderTitle = () => {
		if (title) return title;

		switch (viewLevel) {
			case 'month':
				return currentDate.toLocaleDateString('en-US', {
					month: 'short',
				});
			case 'week':
				const weekStart = new Date(currentDate);
				weekStart.setDate(currentDate.getDate() - currentDate.getDay());
				const weekEnd = new Date(weekStart);
				weekEnd.setDate(weekStart.getDate() + 6);
				return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
			case 'day':
				return currentDate.toLocaleDateString('en-US', {
					weekday: 'short',
				});
			default:
				return '';
		}
	};

	const getBackButtonTitle = () => {
		switch (viewLevel) {
			case 'month':
				return currentDate.getFullYear().toString();
			case 'week':
				return currentDate.toLocaleDateString('en-US', {
					month: 'long',
					year: 'numeric'
				});
			case 'day':
				return currentDate.toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric'
				});
			default:
				return 'Back';
		}
	};

	const getWeekDates = () => {
		const weekStart = new Date(currentDate);
		weekStart.setDate(currentDate.getDate() - currentDate.getDay());

		const dates = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(weekStart);
			date.setDate(weekStart.getDate() + i);
			dates.push(date);
		}
		return dates;
	};

	const isToday = (date: Date) => {
		const today = new Date();
		return date.toDateString() === today.toDateString();
	};

	const isSameDay = (date: Date) => {
		return date.toDateString() === currentDate.toDateString();
	};


	return (
		<View style={styles.headerWrapper}>
			<View style={styles.container}>
				<View style={styles.leftSection}>
					{canGoBack && onBackPress && (
						<TouchableOpacity
							style={styles.backButton}
							onPress={onBackPress}
							activeOpacity={0.7}
						>
							<Text style={styles.backArrow}>‹</Text>
							<Text style={styles.backText}>{getBackButtonTitle()}</Text>
						</TouchableOpacity>
					)}
				</View>

				<View style={styles.centerSection}>
					<Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
				</View>

				<View style={styles.rightSection}>
					{onAddPress && (
						<TouchableOpacity
							style={styles.todayButton}
							onPress={onAddPress}
							activeOpacity={0.7}
						>
							<Text style={styles.todayText}>Today</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Week Days Header - only show on month level */}
			{viewLevel === 'month' && (
				<View style={styles.weekDaysHeader}>
					{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
						<Text key={day} style={styles.weekDayHeader}>{day}</Text>
					))}
				</View>
			)}

			{/* Week view - show days and dates */}
			{viewLevel === 'week' && (
				<>
					<View style={styles.weekDaysHeader}>
						{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
							<Text key={day} style={styles.weekDayHeader}>{day}</Text>
						))}
					</View>
					<View style={styles.weekDatesHeader}>
						{getWeekDates().map((date, index) => (
							<TouchableOpacity
								key={index}
								style={styles.dateContainer}
								onPress={() => onDatePress?.(date)}
								activeOpacity={0.7}
							>
								<View style={[
									styles.dateCircle,
									isToday(date) && styles.todayCircle,
									isSameDay(date) && styles.selectedDateCircle
								]}>
									<Text style={[
										styles.dateText,
										isToday(date) && styles.todayDateText,
										isSameDay(date) && styles.selectedDateText
									]}>
										{date.getDate()}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</>
			)}

		</View>
	);
});

export default CalendarHeader;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#fff',
		// borderBottomWidth: 0.5,
		borderBottomColor: '#E5E5EA',
		minHeight: 60,
	},
	leftSection: {
		flex: 1,
		alignItems: 'flex-start',
	},
	centerSection: {
		flex: 2,
		alignItems: 'center',
	},
	rightSection: {
		flex: 1,
		alignItems: 'flex-end',
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 8,
		marginLeft: -8,
	},
	backArrow: {
		fontSize: 24,
		fontWeight: '300',
		color: '#007AFF',
		marginRight: 4,
	},
	backText: {
		fontSize: 16,
		color: '#007AFF',
		fontWeight: '400',
	},
	headerTitle: {
		fontSize: 25,
		fontWeight: '600',
		color: '#000',
		textAlign: 'center',
	},
	todayButton: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 6,
		backgroundColor: '#F2F2F7',
	},
	todayText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#007AFF',
	},
	weekDaysHeader: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		paddingVertical: 6,
		paddingHorizontal: 16,
	},
	weekDayHeader: {
		flex: 1,
		textAlign: 'center',
		fontSize: 16,
		fontWeight: '600',
		color: '#8E8E93',
	},
	weekDatesHeader: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		paddingVertical: 6,
		paddingHorizontal: 16,
	},
	dateContainer: {
		flex: 1,
		alignItems: 'center',
	},
	dateCircle: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	todayCircle: {
		backgroundColor: '#FF3B30',
	},
	selectedDateCircle: {
		backgroundColor: '#007AFF',
	},
	dateText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#000',
	},
	todayDateText: {
		color: '#fff',
		fontWeight: '600',
	},
	selectedDateText: {
		color: '#fff',
		fontWeight: '600',
	},
	headerWrapper: {
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5EA',
	},
});