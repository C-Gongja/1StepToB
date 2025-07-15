import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
} from 'react-native';
import { ScheduledItem, ScheduleFormData } from '../types/Todo';
import ScheduleForm from '../components/ScheduleForm';
import { generateId } from '../utils/dateUtils';
import { useScheduleStore } from '../stores/scheduleStore';
import Calendar from '../components/calendar/Calendar';

export const ScheduleScreen: React.FC = () => {
	const { items, addItem: addItemToStore, updateItem: updateItemInStore } = useScheduleStore();
	const [showForm, setShowForm] = useState(false);
	const [editingItem, setEditingItem] = useState<ScheduledItem | undefined>();
	const [selectedDate, setSelectedDate] = useState(new Date());

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

	return (
		<SafeAreaView style={styles.container}>
			<Calendar />

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