import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Dimensions,
} from 'react-native';

interface WeekLevelProps {
	currentDate: Date;
}

const WeekLevel: React.FC<WeekLevelProps> = React.memo(({
	currentDate,
}) => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const { width, height } = Dimensions.get('window');

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000); // Update every minute

		return () => clearInterval(timer);
	}, []);

	const generateHours = () => {
		const hours = [];
		for (let i = 0; i < 24; i++) {
			hours.push(i);
		}
		return hours;
	};

	const formatHour = (hour: number) => {
		if (hour === 0) return '12 AM';
		if (hour === 12) return '12 PM';
		if (hour < 12) return `${hour} AM`;
		return `${hour - 12} PM`;
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

	const getCurrentTimePosition = () => {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const totalMinutes = hours * 60 + minutes;
		
		// Each hour takes 80px, so calculate position based on minutes
		const hourHeight = 80;
		return (totalMinutes / 60) * hourHeight;
	};

	const isToday = (date: Date) => {
		const today = new Date();
		return date.toDateString() === today.toDateString();
	};

	const hours = generateHours();
	const timePosition = getCurrentTimePosition();
	const weekDates = getWeekDates();
	const showCurrentTimeLine = weekDates.some(date => isToday(date));

	return (
		<View style={styles.container}>
			<ScrollView 
				style={styles.weekContainer}
				showsVerticalScrollIndicator={false}
				contentOffset={{ x: 0, y: timePosition - 200 }} // Auto-scroll to current time
			>
				<View style={styles.weekGrid}>
					{/* Time labels column */}
					<View style={styles.timeColumn}>
						{hours.map((hour) => (
							<View key={hour} style={styles.hourRow}>
								<View style={styles.timeLabel}>
									<Text style={styles.timeText}>{formatHour(hour)}</Text>
								</View>
							</View>
						))}
					</View>

					{/* Day columns */}
					{weekDates.map((date, dayIndex) => (
						<View key={dayIndex} style={styles.dayColumn}>
							{hours.map((hour) => (
								<View key={`${dayIndex}-${hour}`} style={styles.hourCell}>
									{/* Hour line */}
									<View style={styles.hourLine} />
									{/* Schedule area for events */}
									<View style={styles.scheduleArea} />
								</View>
							))}
						</View>
					))}

					{/* Current time indicator */}
					{showCurrentTimeLine && (
						<View 
							style={[
								styles.currentTimeLine,
								{ top: timePosition }
							]}
						>
							<View style={styles.currentTimeCircle} />
							<View style={styles.currentTimeBar} />
							<Text style={styles.currentTimeText}>
								{currentTime.toLocaleTimeString('en-US', {
									hour: 'numeric',
									minute: '2-digit',
									hour12: true
								})}
							</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
});

export default WeekLevel;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	weekContainer: {
		flex: 1,
	},
	weekGrid: {
		flexDirection: 'row',
		position: 'relative',
		paddingBottom: 100,
	},
	timeColumn: {
		width: 80,
		backgroundColor: '#fff',
	},
	dayColumn: {
		flex: 1,
		borderLeftWidth: 0.5,
		borderLeftColor: '#E5E5EA',
	},
	hourRow: {
		height: 80,
		justifyContent: 'flex-start',
		borderBottomWidth: 0.5,
		borderBottomColor: '#E5E5EA',
	},
	hourCell: {
		height: 80,
		position: 'relative',
		borderBottomWidth: 0.5,
		borderBottomColor: '#E5E5EA',
	},
	timeLabel: {
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 8,
		paddingRight: 16,
	},
	timeText: {
		fontSize: 14,
		color: '#8E8E93',
		fontWeight: '500',
	},
	hourLine: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 0.5,
		backgroundColor: '#E5E5EA',
	},
	scheduleArea: {
		flex: 1,
		paddingHorizontal: 4,
		paddingVertical: 2,
	},
	currentTimeLine: {
		position: 'absolute',
		left: 0,
		right: 0,
		flexDirection: 'row',
		alignItems: 'center',
		zIndex: 10,
	},
	currentTimeCircle: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#FF3B30',
		marginLeft: 76,
		marginRight: 4,
	},
	currentTimeBar: {
		flex: 1,
		height: 2,
		backgroundColor: '#FF3B30',
		marginRight: 0,
	},
	currentTimeText: {
		position: 'absolute',
		left: 4,
		top: -10,
		fontSize: 12,
		fontWeight: '600',
		color: '#FF3B30',
		backgroundColor: '#fff',
		paddingHorizontal: 4,
	},
});