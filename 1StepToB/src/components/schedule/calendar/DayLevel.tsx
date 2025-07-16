import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Dimensions,
} from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	interpolate,
	withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useScheduleStore } from '../../../stores/scheduleStore';
import DayScheduleItem from '../DayScheduleItem';

interface DayLevelProps {
	currentDate: Date;
}

const DayLevel: React.FC<DayLevelProps> = React.memo(({
	currentDate,
}) => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const { width, height } = Dimensions.get('window');
	const scrollViewRef = useRef<ScrollView>(null);
	const { getItemsByDate, updateItem, deleteItem } = useScheduleStore();
	const scheduleItems = getItemsByDate(currentDate);

	// Zoom 기능을 위한 상태
	const scale = useSharedValue(1);
	const MIN_SCALE = 0.5; // 최소 사이즈: 화면에 전체 시간대 표시
	const MAX_SCALE = 3; // 최대 사이즈

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000); // Update every minute

		return () => clearInterval(timer);
	}, []);

	// Auto-scroll to current time when component mounts or date changes
	useEffect(() => {
		const scrollToCurrentTime = () => {
			const now = isToday(currentDate) ? new Date() : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 0); // Default to 9 AM for non-today dates
			const hours = now.getHours();
			const minutes = now.getMinutes();
			const totalMinutes = hours * 60 + minutes;

			// Each hour takes base 60px, scaled by current zoom level
			const baseHourHeight = 60;
			const scaledHourHeight = baseHourHeight * scale.value;
			const scrollPosition = (totalMinutes / 60) * scaledHourHeight;

			// Offset to center the current time in the viewport
			const viewportOffset = height / 3;
			const finalScrollPosition = Math.max(0, scrollPosition - viewportOffset);

			setTimeout(() => {
				scrollViewRef.current?.scrollTo({
					y: finalScrollPosition,
					animated: true
				});
			}, 100);
		};

		scrollToCurrentTime();
	}, [currentDate, height, scale.value]);

	const generateHours = () => {
		const hours = [];
		for (let i = 0; i <= 24; i++) {
			hours.push(i);
		}
		return hours;
	};

	// Pinch gesture 추가
	const pinchGesture = Gesture.Pinch()
		.onUpdate((event) => {
			const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, event.scale));
			scale.value = newScale;
		})
		.onEnd(() => {
			// 스케일을 부드럽게 조절
			scale.value = withSpring(
				Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value))
			);
		});

	const formatHour = (hour: number) => {
		if (hour === 0 || hour === 24) return '12 AM';
		if (hour === 12) return '12 PM';
		if (hour < 12) return `${hour} AM`;
		return `${hour - 12} PM`;
	};

	// Animated style for current time position
	const animatedCurrentTimeStyle = useAnimatedStyle(() => {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const totalMinutes = hours * 60 + minutes;

		// Each hour takes base 60px, scaled by zoom level
		const baseHourHeight = 60;
		const scaledHourHeight = baseHourHeight * scale.value;
		const position = (totalMinutes / 60) * scaledHourHeight;

		return {
			top: position,
		};
	});

	// Animated styles for hour rows
	const animatedHourRowStyle = useAnimatedStyle(() => {
		const baseHeight = 60;
		return {
			height: baseHeight * scale.value,
		};
	});

	const isToday = (date: Date) => {
		const today = new Date();
		return date.toDateString() === today.toDateString();
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	};


	const handleEditSchedule = (item: any) => {
		// TODO: Implement edit functionality
		console.log('Edit schedule:', item);
	};

	const handleDeleteSchedule = (id: string) => {
		deleteItem(id);
	};

	const getScheduleItemData = (item: any) => {
		const startHour = new Date(item.startTime).getHours();
		const startMinute = new Date(item.startTime).getMinutes();
		const endHour = new Date(item.endTime).getHours();
		const endMinute = new Date(item.endTime).getMinutes();

		const startTotalMinutes = startHour * 60 + startMinute;
		const endTotalMinutes = endHour * 60 + endMinute;
		const duration = endTotalMinutes - startTotalMinutes;

		const baseHourHeight = 60;
		const scaledHourHeight = baseHourHeight * scale.value;

		const top = (startTotalMinutes / 60) * scaledHourHeight;
		const calculatedHeight = (duration / 60) * scaledHourHeight;
		const finalHeight = Math.max(calculatedHeight, 30);

		return {
			style: {
				position: 'absolute' as const,
				top,
				left: 60,
				right: 16,
				height: finalHeight,
				zIndex: 5,
			},
			containerHeight: finalHeight,
			duration: duration
		};
	};

	const hours = generateHours();
	const showCurrentTimeLine = isToday(currentDate);


	return (
		<View style={styles.container}>
			{/* Fixed date header at the top */}
			<View style={styles.dateHeader}>
				<Text style={styles.fullDate}>{formatDate(currentDate)}</Text>
			</View>

			<GestureDetector gesture={pinchGesture}>
				<ScrollView
					ref={scrollViewRef}
					style={styles.timelineContainer}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.timeline}>
						{hours.map((hour) => (
							<Animated.View key={hour} style={[styles.hourRow, animatedHourRowStyle]}>
								<View style={styles.timeLabel}>
									<Text style={styles.timeText}>{formatHour(hour)}</Text>
								</View>
								<View style={styles.eventArea}>
									<View style={styles.hourLine} />
								</View>
							</Animated.View>
						))}

						{/* Schedule Items */}
						{scheduleItems.map((item) => {
							const itemData = getScheduleItemData(item);
							return (
								<View key={item.id} style={itemData.style}>
									<DayScheduleItem
										item={item}
										onEdit={handleEditSchedule}
										onDelete={handleDeleteSchedule}
										containerHeight={itemData.containerHeight}
										duration={itemData.duration}
									/>
								</View>
							);
						})}

						{/* Current time indicator */}
						{showCurrentTimeLine && (
							<Animated.View
								style={[
									styles.currentTimeLine,
									animatedCurrentTimeStyle
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
							</Animated.View>
						)}
					</View>
				</ScrollView>
			</GestureDetector>
		</View>
	);
});

export default DayLevel;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	dateHeader: {
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5EA',
	},
	fullDate: {
		fontSize: 14,
		fontWeight: '600',
		color: '#000',
		textAlign: 'center',
	},
	header: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5EA',
	},
	dateTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#000',
		textAlign: 'center',
	},
	timelineContainer: {
		flex: 1,
	},
	timeline: {
		position: 'relative',
	},
	hourRow: {
		flexDirection: 'row',
	},
	timeLabel: {
		width: 60,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 0,
		paddingRight: 0,
	},
	timeText: {
		fontSize: 14,
		color: '#8E8E93',
		fontWeight: '500',
	},
	eventArea: {
		flex: 1,
		position: 'relative',
	},
	hourLine: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 16,
		height: 0.5,
		backgroundColor: '#E5E5EA',
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
		marginLeft: 62,
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
		left: 6,
		top: -3,
		fontSize: 12,
		fontWeight: '600',
		color: '#FF3B30',
		backgroundColor: '#fff',
		paddingHorizontal: 0,
	},
});