import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import DayLevel from '../DayLevel';
import CalendarHeader from '../CalendarHeader';
import ScheduleForm from '../../ScheduleForm';
import { useScheduleStore } from '../../../../stores/scheduleStore';
import { ScheduleFormData, ScheduledItem } from '../../../../types/Todo';

type CalendarStackParamList = {
	Year: { currentDateTimestamp: number };
	Month: { currentDateTimestamp: number };
	Week: { currentDateTimestamp: number };
	Day: { currentDateTimestamp: number };
};

type DayScreenNavigationProp = NativeStackNavigationProp<CalendarStackParamList, 'Day'>;
type DayScreenRouteProp = RouteProp<CalendarStackParamList, 'Day'>;

interface DayScreenProps {
	navigation: DayScreenNavigationProp;
	route: DayScreenRouteProp;
}

const DayScreen: React.FC<DayScreenProps> = ({ navigation, route }) => {
	const { currentDateTimestamp } = route.params;
	const currentDate = new Date(currentDateTimestamp);
	const [showScheduleForm, setShowScheduleForm] = useState(false);
	const { addItem } = useScheduleStore();

	const handleAddPress = () => {
		const today = new Date();
		navigation.navigate('Month', { currentDateTimestamp: today.getTime() });
	};

	const handleDatePress = () => {
		// Update current date if needed
	};

	const handleFloatingButtonPress = () => {
		setShowScheduleForm(true);
	};

	const handleScheduleSubmit = (data: ScheduleFormData) => {
		const newScheduleItem: ScheduledItem = {
			id: Date.now().toString(),
			title: data.title,
			description: data.description,
			startTime: data.startTime,
			endTime: data.endTime,
			isAllDay: data.isAllDay,
			category: data.category,
			color: data.color || '#007AFF',
		};

		addItem(newScheduleItem);
		setShowScheduleForm(false);
	};

	const handleScheduleClose = () => {
		setShowScheduleForm(false);
	};

	return (
		<View style={styles.container}>
			<CalendarHeader
				currentDate={currentDate}
				viewLevel="day"
				onBackPress={() => navigation.goBack()}
				onAddPress={handleAddPress}
				canGoBack={navigation.canGoBack()}
				onDatePress={handleDatePress}
			/>
			<Animated.View
				style={styles.contentContainer}
			>
				<DayLevel
					currentDate={currentDate}
				/>
			</Animated.View>

			<ScheduleForm
				visible={showScheduleForm}
				onClose={handleScheduleClose}
				onSubmit={handleScheduleSubmit}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	contentContainer: {
		flex: 1,
	},
});

export default DayScreen;