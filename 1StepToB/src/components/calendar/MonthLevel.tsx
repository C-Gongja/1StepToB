import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions,
} from 'react-native';
import { getDaysInMonth, getMonthNames, isToday, isSameMonth } from '../../utils/dateUtils';
import Animated from 'react-native-reanimated';

interface MonthLevelProps {
	currentDate: Date;
	onDayPress?: (date: Date) => void;
	onMonthChange?: (month: number) => void;
	shouldScrollToToday?: boolean;
	onScrollToTodayComplete?: () => void;
}

const MonthLevel: React.FC<MonthLevelProps> = React.memo(({
	currentDate,
	onDayPress,
	onMonthChange,
	shouldScrollToToday,
	onScrollToTodayComplete,
}) => {
	const scrollViewRef = useRef<ScrollView>(null);
	const year = currentDate.getFullYear();
	const { width, height } = Dimensions.get('window');
	const [monthPositions, setMonthPositions] = useState<Record<number, number>>({});
	const [shouldScrollToCurrentMonth, setShouldScrollToCurrentMonth] = useState(true);
	const [isInitialMount, setIsInitialMount] = useState(true);

	const monthNames = useMemo(() => getMonthNames(), []);

	// Memoize months data to avoid recalculation
	const monthsData = useMemo(() => {
		return Array.from({ length: 12 }, (_, month) => {
			const days = getDaysInMonth(year, month);
			// 실제 주 수 계산: 총 날짜 수를 7로 나누어 올림
			const weeksInMonth = Math.ceil(days.length / 7);

			return {
				month,
				days,
				weeksInMonth
			};
		});
	}, [year]);

	// Calculate initial scroll position based on selected month (only once)
	const initialScrollY = useMemo(() => {
		const targetMonth = currentDate.getMonth();
		return targetMonth * height;
	}, [height]); // Remove currentDate dependency

	// shouldScrollToToday가 true일 때만 스크롤이 필요하다고 표시
	useEffect(() => {
		if (shouldScrollToToday) {
			setShouldScrollToCurrentMonth(true);
			setIsInitialMount(false); // Ensure it's not treated as initial mount
		}
	}, [shouldScrollToToday]);

	useEffect(() => {
		// Auto-scroll to current month when positions are available
		// Only on initial mount or when "Today" button is clicked
		const currentMonth = currentDate.getMonth();
		if (shouldScrollToCurrentMonth && monthPositions[currentMonth] !== undefined && (isInitialMount || shouldScrollToToday)) {
			const scrollToPosition = monthPositions[currentMonth];

			// Use setTimeout to ensure ScrollView is ready
			setTimeout(() => {
				scrollViewRef.current?.scrollTo({
					y: scrollToPosition,
					animated: isInitialMount ? false : true // Smooth animation for "Today" button
				});

				// Call completion callback after scroll animation
				setTimeout(() => {
					onScrollToTodayComplete?.();
				}, 100);
			}, 50);

			setShouldScrollToCurrentMonth(false);
			setIsInitialMount(false);
		}
	}, [monthPositions, shouldScrollToCurrentMonth, currentDate, onScrollToTodayComplete, isInitialMount, shouldScrollToToday]);

	const handleMonthLayout = (month: number, event: any) => {
		const { y } = event.nativeEvent.layout;
		setMonthPositions(prev => ({
			...prev,
			[month]: y
		}));
	};

	const handleScroll = (event: any) => {
		const scrollY = event.nativeEvent.contentOffset.y;

		// Find the closest month based on actual positions
		let closestMonth = 0;
		let minDistance = Infinity;

		Object.entries(monthPositions).forEach(([month, position]) => {
			const distance = Math.abs(scrollY - position);
			if (distance < minDistance) {
				minDistance = distance;
				closestMonth = parseInt(month);
			}
		});

		// Only update if we have a significant change to avoid excessive calls
		if (minDistance < height / 2) {
			onMonthChange?.(closestMonth);
		}
	};

	const renderWeek = useCallback((weekDays: Date[], weekIndex: number, month: number, weeksInMonth: number) => {
		return (
			<View
				key={`${month}-${weekIndex}`}
				style={[
					styles.weekRow,
					{ height: `${100 / weeksInMonth}%` },
					weekIndex > 0 && styles.weekRowBorder,
				]}
			>
				{weekDays.map((date, dayIndex) => {
					const isCurrentDay = isToday(date);
					const isInCurrentMonth = isSameMonth(date, month);

					return (
						<TouchableOpacity
							key={dayIndex}
							style={[
								styles.dayCell,
								isCurrentDay && styles.todayCell,
							]}
							onPress={() => onDayPress?.(date)}
							activeOpacity={0.7}
						>
							<View style={[
								styles.dayNumber,
								isCurrentDay && styles.todayNumber
							]}>
								<Text style={[
									styles.dayText,
									!isInCurrentMonth && styles.otherMonthDayText,
									isCurrentDay && styles.todayText
								]}>
									{date.getDate()}
								</Text>
							</View>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}, [onDayPress]);

	const renderMonth = useCallback((monthData: { month: number, days: Date[], weeksInMonth: number }) => {
		const { month, days, weeksInMonth } = monthData;
		const isCurrentMonth = month === currentDate.getMonth();

		// Group days into weeks (memoized per month)
		const weeks = useMemo(() => {
			const result: Date[][] = [];
			for (let i = 0; i < days.length; i += 7) {
				result.push(days.slice(i, i + 7));
			}
			return result;
		}, [days]);

		return (
			<Animated.View
				key={month}
				style={[
					styles.monthSection,
					{ height: height, width: width },
					isCurrentMonth && styles.currentMonthSection
				]}
				onLayout={(event) => handleMonthLayout(month, event)}
			>
				<Text style={[
					styles.monthTitle,
					isCurrentMonth && styles.currentMonthTitle
				]}>
					{monthNames[month]}
				</Text>

				<View style={styles.daysGrid}>
					{weeks.map((weekDays: Date[], weekIndex: number) =>
						renderWeek(weekDays, weekIndex, month, weeksInMonth)
					)}
				</View>
			</Animated.View>
		);
	}, [currentDate, height, width, monthNames, renderWeek, handleMonthLayout, year]);

	const currentMonth = currentDate.getMonth();

	return (
		<ScrollView
			ref={scrollViewRef}
			style={styles.scrollView}
			showsVerticalScrollIndicator={false}
			contentInsetAdjustmentBehavior="automatic"
			onScroll={handleScroll}
			scrollEventThrottle={100}
			contentOffset={{ x: 0, y: initialScrollY }}
		>
			{monthsData.map(renderMonth)}
		</ScrollView>
	);
});

export default MonthLevel;

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: '#fff',
	},
	monthSection: {
		paddingHorizontal: 16,
		paddingVertical: 0,
		justifyContent: 'space-between',
	},
	currentMonthSection: {
		backgroundColor: '#fff',
	},
	monthTitle: {
		fontSize: 24,
		fontWeight: '600',
		color: '#000',
		textAlign: 'center',
		marginBottom: 20,
		marginTop: 10,
	},
	currentMonthTitle: {
		color: '#007AFF',
		fontSize: 26,
		fontWeight: '700',
	},
	daysGrid: {
		flex: 1,
	},
	weekRow: {
		flexDirection: 'row',
		width: '100%',
		backgroundColor: '#fff',
	},
	weekRowBorder: {
		borderTopWidth: 1,
		borderTopColor: '#E5E5EA',
	},
	dayCell: {
		width: `${100 / 7}%`,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingVertical: 8,
	},
	todayCell: {
	},
	dayNumber: {
		width: 30,
		height: 30,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	todayNumber: {
		backgroundColor: '#007AFF',
	},
	dayText: {
		fontSize: 18,
		color: '#000',
		fontWeight: '400',
	},
	otherMonthDayText: {
		color: '#C7C7CC',
	},
	todayText: {
		color: '#fff',
		fontWeight: '600',
	},
});