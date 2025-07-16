import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import MonthLevel from '../MonthLevel';
import CalendarHeader from '../CalendarHeader';

type CalendarStackParamList = {
	Year: { currentDateTimestamp: number };
	Month: { currentDateTimestamp: number };
	Week: { currentDateTimestamp: number };
	Day: { currentDateTimestamp: number };
};

type MonthScreenNavigationProp = NativeStackNavigationProp<CalendarStackParamList, 'Month'>;
type MonthScreenRouteProp = RouteProp<CalendarStackParamList, 'Month'>;

interface MonthScreenProps {
	navigation: MonthScreenNavigationProp;
	route: MonthScreenRouteProp;
}

const MonthScreen: React.FC<MonthScreenProps> = ({ navigation, route }) => {
	const { currentDateTimestamp } = route.params;
	const [currentDate, setCurrentDate] = useState(new Date(currentDateTimestamp));
	const [shouldScrollToToday, setShouldScrollToToday] = useState(false);

	const handleDayPress = (date: Date) => {
		navigation.navigate('Day', { currentDateTimestamp: date.getTime() });
	};

	const handleMonthChange = (month: number) => {
		// Update current date to the new month
		const newDate = new Date(currentDate);
		newDate.setMonth(month);
		setCurrentDate(newDate);
	};

	const handleAddPress = () => {
		const today = new Date();
		setCurrentDate(today);
		setShouldScrollToToday(true);
	};

	const handleDatePress = () => {
		// Update current date if needed
	};

	// Update currentDate when route params change
	useEffect(() => {
		setCurrentDate(new Date(currentDateTimestamp));
	}, [currentDateTimestamp]);

	return (
		<View style={styles.container}>
			<CalendarHeader
				currentDate={currentDate}
				viewLevel="month"
				onBackPress={() => navigation.goBack()}
				onAddPress={handleAddPress}
				canGoBack={navigation.canGoBack()}
				onDatePress={handleDatePress}
			/>
			<View style={styles.contentContainer}>
				<MonthLevel
					currentDate={currentDate}
					onDayPress={handleDayPress}
					onMonthChange={handleMonthChange}
					shouldScrollToToday={shouldScrollToToday}
					onScrollToTodayComplete={() => setShouldScrollToToday(false)}
				/>
			</View>
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

export default MonthScreen;