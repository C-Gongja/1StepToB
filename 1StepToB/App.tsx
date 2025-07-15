import React from 'react';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeScreen } from './src/screens/HomeScreen';
import { TodoScreen } from './src/screens/TodoScreen';
import { ScheduleScreen } from './src/screens/ScheduleScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<NavigationContainer>
				<StatusBar style="auto" />
				<Tab.Navigator
					screenOptions={{
						tabBarActiveTintColor: '#007AFF',
						tabBarInactiveTintColor: '#8E8E93',
						tabBarStyle: {
							backgroundColor: '#fff',
							borderTopWidth: 1,
							borderTopColor: '#E5E5EA',
							paddingBottom: 8,
							paddingTop: 8,
							height: 88,
						},
						tabBarLabelStyle: {
							fontSize: 12,
							fontWeight: '600',
						},
						headerShown: false,
					}}
				>
					<Tab.Screen
						name="Home"
						component={HomeScreen}
						options={{
							tabBarIcon: ({ color, size }) => (
								<Text style={{ fontSize: size, color }}>🏠</Text>
							),
						}}
					/>
					<Tab.Screen
						name="Todos"
						component={TodoScreen}
						options={{
							tabBarIcon: ({ color, size }) => (
								<Text style={{ fontSize: size, color }}>✓</Text>
							),
						}}
					/>
					<Tab.Screen
						name="Schedule"
						component={ScheduleScreen}
						options={{
							tabBarIcon: ({ color, size }) => (
								<Text style={{ fontSize: size, color }}>📅</Text>
							),
						}}
					/>
					<Tab.Screen
						name="Profile"
						component={ProfileScreen}
						options={{
							tabBarIcon: ({ color, size }) => (
								<Text style={{ fontSize: size, color }}>👤</Text>
							),
						}}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
