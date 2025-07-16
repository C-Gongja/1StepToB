import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions,
} from 'react-native';
import { getMiniCalendarDays, getMonthNames, isToday as isTodayUtil } from '../../../utils/dateUtils';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring
} from 'react-native-reanimated';

interface YearLevelProps {
	currentYear: number;
	onMonthPress: (year: number, month: number) => void;
}

const { width } = Dimensions.get('window');
const monthWidth = (width - 48) / 3; // 3 months per row with padding

const YearLevel: React.FC<YearLevelProps> = React.memo(({
	currentYear,
	onMonthPress,
}) => {
	const scrollViewRef = useRef<ScrollView>(null);
	const [yearPositions, setYearPositions] = useState<Record<number, number>>({});
	const [shouldScrollToCurrentYear, setShouldScrollToCurrentYear] = useState(true);

	const yearsToShow = useMemo(() => {
		const years = [];
		for (let i = currentYear - 1; i <= currentYear + 1; i++) {
			years.push(i);
		}
		return years;
	}, [currentYear]);

	const monthNames = useMemo(() => getMonthNames(), []);

	const renderMiniCalendar = useCallback((year: number, month: number) => {
		const days = getMiniCalendarDays(year, month);
		const scale = useSharedValue(1);

		const animatedStyle = useAnimatedStyle(() => ({
			transform: [{ scale: scale.value }],
		}));

		const handlePressIn = () => {
			scale.value = withSpring(0.95, {
				damping: 15,
				stiffness: 300,
			});
		};

		const handlePressOut = () => {
			scale.value = withSpring(1, {
				damping: 15,
				stiffness: 300,
			});
		};

		return (
			<TouchableOpacity
				key={`${year}-${month}`}
				style={styles.monthContainer}
				onPress={() => onMonthPress(year, month)}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				activeOpacity={1}
			>
				<Animated.View
					style={[styles.calendarContent, animatedStyle]}
				>
					<Text style={styles.monthName}>
						{monthNames[month].slice(0, 3)}
					</Text>

					{/* Day headers */}
					<View style={styles.dayHeaders}>
						{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
							<Text key={index} style={styles.dayHeader}>{day}</Text>
						))}
					</View>

					{/* Calendar grid */}
					<View style={styles.calendarGrid}>
						{days.map((date, index) => (
							<View key={index} style={styles.dayCell}>
								{date && (
									<View style={[
										styles.dayNumber,
										isTodayUtil(date) && styles.todayNumber
									]}>
										<Text style={[
											styles.dayText,
											isTodayUtil(date) && styles.todayText
										]}>
											{date.getDate()}
										</Text>
									</View>
								)}
							</View>
						))}
					</View>
				</Animated.View>
			</TouchableOpacity>
		);
	}, [monthNames, onMonthPress]);

	useEffect(() => {
		// Reset scroll flag when currentYear changes
		setShouldScrollToCurrentYear(true);
	}, [currentYear]);

	useEffect(() => {
		// Auto-scroll to current year when positions are available
		if (shouldScrollToCurrentYear && yearPositions[currentYear] !== undefined) {
			const scrollToPosition = yearPositions[currentYear];

			scrollViewRef.current?.scrollTo({
				y: scrollToPosition,
				animated: false
			});

			setShouldScrollToCurrentYear(false);
		}
	}, [currentYear, yearPositions, shouldScrollToCurrentYear]);

	const handleYearLayout = (year: number, event: any) => {
		const { y } = event.nativeEvent.layout;
		setYearPositions(prev => ({
			...prev,
			[year]: y
		}));
	};

	return (
		<ScrollView
			ref={scrollViewRef}
			style={styles.container}
			showsVerticalScrollIndicator={false}
			contentInsetAdjustmentBehavior="automatic"
		>
			{yearsToShow.map((year) => (
				<View
					key={year}
					style={[
						styles.yearSection,
						year === currentYear && styles.currentYearSection
					]}
					onLayout={(event) => handleYearLayout(year, event)}
				>
					<Text style={[
						styles.yearTitle,
						year === currentYear && styles.currentYearTitle
					]}>
						{year}
					</Text>
					<View style={styles.monthsGrid}>
						{Array.from({ length: 12 }, (_, month) =>
							renderMiniCalendar(year, month)
						)}
					</View>
				</View>
			))}
		</ScrollView>
	);
});

export default YearLevel;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	yearSection: {
		marginBottom: 32,
		paddingHorizontal: 16,
	},
	currentYearSection: {
		backgroundColor: '#F8F9FA',
		borderRadius: 12,
		marginHorizontal: 8,
		paddingVertical: 8,
	},
	yearTitle: {
		fontSize: 24,
		fontWeight: '600',
		color: '#000',
		textAlign: 'center',
		marginBottom: 16,
		marginTop: 16,
	},
	currentYearTitle: {
		color: '#007AFF',
		fontSize: 26,
		fontWeight: '700',
	},
	monthsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	monthContainer: {
		width: monthWidth,
		marginBottom: 16,
		// backgroundColor: '#fff',
		borderRadius: 8,
		// shadowColor: '#000',
		// shadowOffset: { width: 0, height: 1 },
		// shadowOpacity: 0.1,
		// shadowRadius: 2,
		elevation: 2,
	},
	calendarContent: {
		flex: 1,
		backgroundColor: '',
		borderRadius: 8,
		padding: 4,
	},
	monthName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#000',
		textAlign: 'center',
		marginBottom: 8,
	},
	dayHeaders: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 4,
	},
	dayHeader: {
		fontSize: 10,
		color: '#8E8E93',
		fontWeight: '500',
		width: '14.28%', // Match calendarGrid width
		textAlign: 'center',
	},
	calendarGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	dayCell: {
		width: '14.28%', // 1/7 of container width
		height: 16,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 2,
	},
	dayNumber: {
		width: 12,
		height: 12,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	todayNumber: {
		backgroundColor: '#007AFF',
	},
	dayText: {
		fontSize: 8,
		color: '#000',
		fontWeight: '400',
	},
	todayText: {
		color: '#fff',
		fontWeight: '600',
	},
});