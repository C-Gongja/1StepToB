import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import YearScreen from './screens/YearScreen';
import MonthScreen from './screens/MonthScreen';
import WeekScreen from './screens/WeekScreen';
import DayScreen from './screens/DayScreen';

export type CalendarStackParamList = {
	Year: { currentDateTimestamp: number };
	Month: { currentDateTimestamp: number };
	Week: { currentDateTimestamp: number };
	Day: { currentDateTimestamp: number };
};

const Stack = createNativeStackNavigator<CalendarStackParamList>();

interface CalendarProps {
	initialDate?: Date;
}

const Calendar: React.FC<CalendarProps> = React.memo(({
	initialDate = new Date(),
}) => {
	return (
		<Stack.Navigator
			initialRouteName="Year"
			screenOptions={{
				headerShown: false,
				animation: 'none', // Use fade animation instead of none
				animationDuration: 800, // Match our desired duration
			}}
		>
			<Stack.Screen
				name="Year"
				component={YearScreen}
				initialParams={{ currentDateTimestamp: initialDate.getTime() }}
			/>
			<Stack.Screen
				name="Month"
				component={MonthScreen}
				initialParams={{ currentDateTimestamp: initialDate.getTime() }}
			/>
			<Stack.Screen
				name="Week"
				component={WeekScreen}
				initialParams={{ currentDateTimestamp: initialDate.getTime() }}
			/>
			<Stack.Screen
				name="Day"
				component={DayScreen}
				initialParams={{ currentDateTimestamp: initialDate.getTime() }}
			/>
		</Stack.Navigator>
	);
});

export default Calendar;