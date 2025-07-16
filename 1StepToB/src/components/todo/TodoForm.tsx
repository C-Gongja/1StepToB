import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Modal,
	ScrollView,
	Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TodoFormData, Todo, TodoPriority } from '../../types/Todo';


interface TodoFormProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (data: TodoFormData) => void;
	editingTodo?: Todo;
	onDelete?: (id: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = React.memo(({
	visible,
	onClose,
	onSubmit,
	editingTodo,
	onDelete,
}) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
	const [priority, setPriority] = useState<TodoPriority>(TodoPriority.MEDIUM);
	const [category, setCategory] = useState('');
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [tempDate, setTempDate] = useState<Date>(new Date());

	const resetForm = useCallback(() => {
		setTitle('');
		setDescription('');
		setDueDate(new Date());
		setPriority(TodoPriority.MEDIUM);
		setCategory('');
	}, []);

	useEffect(() => {
		if (visible) {
			if (editingTodo) {
				setTitle(editingTodo.title);
				setDescription(editingTodo.description || '');
				setDueDate(editingTodo.dueDate);
				setPriority(editingTodo.priority);
				setCategory(editingTodo.category || '');
			} else {
				resetForm();
			}
		}
	}, [editingTodo, visible, resetForm]);

	const handleSubmit = useCallback(() => {
		if (title.trim()) {
			onSubmit({
				title: title.trim(),
				description: description.trim() || undefined,
				dueDate,
				priority,
				category: category.trim() || undefined,
			});
			resetForm();
			onClose();
		}
	}, [title, description, dueDate, priority, category, onSubmit, resetForm, onClose]);

	const handleClose = useCallback(() => {
		resetForm();
		onClose();
	}, [resetForm, onClose]);

	const openDatePicker = useCallback(() => {
		const initialDate = dueDate
			? (dueDate instanceof Date ? dueDate : new Date(dueDate))
			: new Date();
		setTempDate(initialDate);
		setShowDatePicker(true);
	}, [dueDate]);

	const onDateChange = useCallback((_: any, selectedDate?: Date) => {
		if (selectedDate) {
			setTempDate(selectedDate);
		}
	}, []);

	const confirmDatePicker = useCallback(() => {
		setDueDate(tempDate);
		setShowDatePicker(false);
	}, [tempDate]);

	const cancelDatePicker = useCallback(() => {
		setShowDatePicker(false);
	}, []);

	const priorityOptions = useMemo(() => [
		{ value: TodoPriority.LOW, label: 'Low', color: '#34C759' },
		{ value: TodoPriority.MEDIUM, label: 'Medium', color: '#FFCC00' },
		{ value: TodoPriority.HIGH, label: 'High', color: '#FF9500' },
		{ value: TodoPriority.URGENT, label: 'Urgent', color: '#FF3B30' },
	], []);

	const handlePriorityPress = useCallback((value: TodoPriority) => {
		setPriority(value);
	}, []);

	const clearDueDate = useCallback(() => {
		setDueDate(new Date());
	}, []);

	const handleDeleteTodo = useCallback(() => {
		if (editingTodo && onDelete) {
			onDelete(editingTodo.id);
			resetForm();
			onClose();
		}
	}, [editingTodo, onDelete, resetForm, onClose]);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
			onRequestClose={handleClose}
		>
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity onPress={handleClose}>
						<Text style={styles.cancelButton}>Cancel</Text>
					</TouchableOpacity>
					<Text style={styles.title}>
						{editingTodo ? 'Edit Todo' : 'New Todo'}
					</Text>
					<TouchableOpacity onPress={handleSubmit}>
						<Text style={styles.saveButton}>Save</Text>
					</TouchableOpacity>
				</View>

				<ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Title *</Text>
						<TextInput
							style={styles.input}
							value={title}
							onChangeText={setTitle}
							placeholder="Enter todo title"
							autoFocus
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Description</Text>
						<TextInput
							style={[styles.input, styles.textArea]}
							value={description}
							onChangeText={setDescription}
							placeholder="Enter todo description"
							multiline
							numberOfLines={3}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Due Date</Text>
						<TouchableOpacity
							style={styles.dateButton}
							onPress={openDatePicker}
						>
							<Text style={styles.dateButtonText}>
								📅 {dueDate ? (dueDate instanceof Date ? dueDate.toLocaleDateString() : new Date(dueDate).toLocaleDateString()) : 'Set due date (optional)'}
							</Text>
						</TouchableOpacity>
						{dueDate && (
							<TouchableOpacity
								style={styles.clearDateButton}
								onPress={clearDueDate}
							>
								<Text style={styles.clearDateText}>Today</Text>
							</TouchableOpacity>
						)}
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Priority</Text>
						<View style={styles.priorityContainer}>
							{priorityOptions.map((option) => (
								<TouchableOpacity
									key={option.value}
									style={[
										styles.priorityButton,
										{ borderColor: option.color },
										priority === option.value && { backgroundColor: option.color }
									]}
									onPress={() => handlePriorityPress(option.value)}
								>
									<Text style={[
										styles.priorityButtonText,
										priority === option.value && styles.priorityButtonTextSelected
									]}>
										{option.label}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Category</Text>
						<TextInput
							style={styles.input}
							value={category}
							onChangeText={setCategory}
							placeholder="Enter category (optional)"
						/>
					</View>

					{/* Delete Button - Only show when editing */}
					{editingTodo && onDelete && (
						<View style={styles.deleteButtonContainer}>
							<TouchableOpacity
								style={styles.deleteButton}
								onPress={handleDeleteTodo}
							>
								<Text style={styles.deleteButtonText}>🗑️ Delete Todo</Text>
							</TouchableOpacity>
						</View>
					)}
				</ScrollView>

				{/* Date Picker Modal */}
				{showDatePicker && (
					<Modal
						transparent={true}
						animationType="slide"
						visible={showDatePicker}
						onRequestClose={cancelDatePicker}
					>
						<View style={styles.pickerModal}>
							<View style={styles.pickerContainer}>
								<View style={styles.pickerHeader}>
									<TouchableOpacity onPress={cancelDatePicker}>
										<Text style={styles.pickerButton}>Cancel</Text>
									</TouchableOpacity>
									<Text style={styles.pickerTitle}>Select Due Date</Text>
									<TouchableOpacity onPress={confirmDatePicker}>
										<Text style={[styles.pickerButton, styles.confirmButton]}>Done</Text>
									</TouchableOpacity>
								</View>
								<DateTimePicker
									value={tempDate}
									mode="date"
									display={Platform.OS === 'ios' ? 'spinner' : 'default'}
									onChange={onDateChange}
									style={styles.picker}
								/>
							</View>
						</View>
					</Modal>
				)}
			</View>
		</Modal>
	);
});

export default TodoForm;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	cancelButton: {
		fontSize: 16,
		color: '#FF3B30',
	},
	saveButton: {
		fontSize: 16,
		color: '#007AFF',
		fontWeight: '600',
	},
	form: {
		flex: 1,
		padding: 16,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: '#fff',
	},
	textArea: {
		height: 80,
		textAlignVertical: 'top',
	},
	dateButton: {
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 8,
		padding: 12,
		backgroundColor: '#fff',
	},
	dateButtonText: {
		fontSize: 16,
		color: '#333',
	},
	clearDateButton: {
		marginTop: 8,
		alignSelf: 'flex-start',
	},
	clearDateText: {
		fontSize: 14,
		color: '#FF3B30',
	},
	priorityContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	priorityButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderWidth: 2,
		borderRadius: 20,
		backgroundColor: '#fff',
	},
	priorityButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333',
	},
	priorityButtonTextSelected: {
		color: '#fff',
	},
	pickerModal: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	pickerContainer: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingBottom: 34, // Safe area
	},
	pickerHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	pickerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	pickerButton: {
		fontSize: 16,
		color: '#007AFF',
		fontWeight: '600',
	},
	confirmButton: {
		fontWeight: 'bold',
	},
	picker: {
		height: 200,
	},
	deleteButtonContainer: {
		paddingTop: 20,
		marginTop: 20,
		borderTopWidth: 1,
		borderTopColor: '#e0e0e0',
	},
	deleteButton: {
		backgroundColor: '#FF3B30',
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		alignItems: 'center',
		marginBottom: 20,
	},
	deleteButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});