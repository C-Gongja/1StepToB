import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import YearLevel from '../YearLevel';
import CalendarHeader from '../CalendarHeader';

type CalendarStackParamList = {
	Year: { currentDateTimestamp: number };
	Month: { currentDateTimestamp: number };
	Week: { currentDateTimestamp: number };
	Day: { currentDateTimestamp: number };
};

type YearScreenNavigationProp = NativeStackNavigationProp<CalendarStackParamList, 'Year'>;
type YearScreenRouteProp = RouteProp<CalendarStackParamList, 'Year'>;

interface YearScreenProps {
	navigation: YearScreenNavigationProp;
	route: YearScreenRouteProp;
}

const YearScreen: React.FC<YearScreenProps> = ({ navigation, route }) => {
	const { currentDateTimestamp } = route.params;
	const currentDate = new Date(currentDateTimestamp);

	const handleMonthPress = (year: number, month: number) => {
		const newDate = new Date(year, month, 1);
		navigation.navigate('Month', { currentDateTimestamp: newDate.getTime() });
	};

	const handleAddPress = () => {
		const today = new Date();
		navigation.navigate('Month', { currentDateTimestamp: today.getTime() });
	};

	const handleDatePress = () => {
		// Update current date if needed
	};

	return (
		<View style={styles.container}>
			<CalendarHeader
				currentDate={currentDate}
				viewLevel="year"
				onBackPress={() => navigation.goBack()}
				onAddPress={handleAddPress}
				canGoBack={navigation.canGoBack()}
				onDatePress={handleDatePress}
			/>
			<View style={styles.contentContainer}>
				<YearLevel
					currentYear={currentDate.getFullYear()}
					onMonthPress={handleMonthPress}
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

export default YearScreen;