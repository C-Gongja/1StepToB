import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import WeekLevel from '../WeekLevel';
import CalendarHeader from '../CalendarHeader';

type CalendarStackParamList = {
	Year: { currentDateTimestamp: number };
	Month: { currentDateTimestamp: number };
	Week: { currentDateTimestamp: number };
	Day: { currentDateTimestamp: number };
};

type WeekScreenNavigationProp = NativeStackNavigationProp<CalendarStackParamList, 'Week'>;
type WeekScreenRouteProp = RouteProp<CalendarStackParamList, 'Week'>;

interface WeekScreenProps {
	navigation: WeekScreenNavigationProp;
	route: WeekScreenRouteProp;
}

const WeekScreen: React.FC<WeekScreenProps> = ({ navigation, route }) => {
	const { currentDateTimestamp } = route.params;
	const currentDate = new Date(currentDateTimestamp);

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
				viewLevel="week"
				onBackPress={() => navigation.goBack()}
				onAddPress={handleAddPress}
				canGoBack={navigation.canGoBack()}
				onDatePress={handleDatePress}
			/>
			<Animated.View 
				style={styles.contentContainer}
			>
				<WeekLevel
					currentDate={currentDate}
				/>
			</Animated.View>
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

export default WeekScreen;