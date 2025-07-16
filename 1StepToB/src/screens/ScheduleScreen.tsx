import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
} from 'react-native';
import { ScheduledItem, ScheduleFormData } from '../types/Todo';
import ScheduleForm from '../components/schedule/ScheduleForm';
import { generateId } from '../utils/dateUtils';
import { useScheduleStore } from '../stores/scheduleStore';
import Calendar from '../components/schedule/calendar/Calendar';
import FloatingActionButton from '../components/schedule/FloatingActionButton';

interface ScheduleScreenProps {
	navigation?: any;
	route?: {
		params?: {
			editItem?: ScheduledItem;
		};
	};
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation, route }) => {
	const { items, addItem: addItemToStore, updateItem: updateItemInStore } = useScheduleStore();
	const [showForm, setShowForm] = useState(false);
	const [editingItem, setEditingItem] = useState<ScheduledItem | undefined>();
	const [selectedDate, setSelectedDate] = useState(new Date());

	// Handle edit item from navigation params
	useEffect(() => {
		if (route?.params?.editItem) {
			setEditingItem(route.params.editItem);
			setShowForm(true);
		}
	}, [route?.params?.editItem]);

	const addScheduledItem = (data: ScheduleFormData) => {
		const newItem: ScheduledItem = {
			id: generateId(),
			title: data.title,
			description: data.description,
			startTime: data.startTime,
			endTime: data.endTime,
			isAllDay: data.isAllDay,
			category: data.category,
			color: data.color,
		};
		addItemToStore(newItem);
	};

	const updateScheduledItem = (data: ScheduleFormData) => {
		if (!editingItem) return;

		updateItemInStore(editingItem.id, {
			title: data.title,
			description: data.description,
			startTime: data.startTime,
			endTime: data.endTime,
			isAllDay: data.isAllDay,
			category: data.category,
			color: data.color,
		});
		setEditingItem(undefined);
	};

	const handleFormSubmit = (data: ScheduleFormData) => {
		if (editingItem) {
			updateScheduledItem(data);
		} else {
			addScheduledItem(data);
		}
	};

	const handleEdit = (item: ScheduledItem) => {
		setEditingItem(item);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingItem(undefined);
	};

	const handleEventPress = (item: ScheduledItem) => {
		setEditingItem(item);
		setShowForm(true);
	};

	const handleFloatingButtonPress = () => {
		setEditingItem(undefined);
		setShowForm(true);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Calendar />

			<FloatingActionButton
				onPress={handleFloatingButtonPress}
			/>

			<ScheduleForm
				visible={showForm}
				onClose={handleCloseForm}
				onSubmit={handleFormSubmit}
				editingItem={editingItem}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	content: {
		flex: 1,
	},
	addButton: {
		backgroundColor: '#34C759',
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		alignItems: 'center',
		margin: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	addButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});