import React, { useState, useEffect } from 'react';
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
}

const TodoForm: React.FC<TodoFormProps> = React.memo(({
	visible,
	onClose,
	onSubmit,
	editingTodo,
}) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [dueDate, setDueDate] = useState<Date | undefined>();
	const [priority, setPriority] = useState<TodoPriority>(TodoPriority.MEDIUM);
	const [category, setCategory] = useState('');
	const [showDatePicker, setShowDatePicker] = useState(false);

	useEffect(() => {
		if (editingTodo) {
			setTitle(editingTodo.title);
			setDescription(editingTodo.description || '');
			setDueDate(editingTodo.dueDate);
			setPriority(editingTodo.priority);
			setCategory(editingTodo.category || '');
		} else {
			resetForm();
		}
	}, [editingTodo, visible]);

	const resetForm = () => {
		setTitle('');
		setDescription('');
		setDueDate(undefined);
		setPriority(TodoPriority.MEDIUM);
		setCategory('');
	};

	const handleSubmit = () => {
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
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const onDateChange = (event: any, selectedDate?: Date) => {
		setShowDatePicker(Platform.OS === 'ios');
		if (selectedDate) {
			setDueDate(selectedDate);
		}
	};

	const priorityOptions = [
		{ value: TodoPriority.LOW, label: 'Low', color: '#34C759' },
		{ value: TodoPriority.MEDIUM, label: 'Medium', color: '#FFCC00' },
		{ value: TodoPriority.HIGH, label: 'High', color: '#FF9500' },
		{ value: TodoPriority.URGENT, label: 'Urgent', color: '#FF3B30' },
	];

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
							onPress={() => setShowDatePicker(true)}
						>
							<Text style={styles.dateButtonText}>
								{dueDate ? dueDate.toLocaleDateString() : 'Set due date (optional)'}
							</Text>
						</TouchableOpacity>
						{dueDate && (
							<TouchableOpacity
								style={styles.clearDateButton}
								onPress={() => setDueDate(undefined)}
							>
								<Text style={styles.clearDateText}>Clear date</Text>
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
									onPress={() => setPriority(option.value)}
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
				</ScrollView>

				{showDatePicker && (
					<DateTimePicker
						value={dueDate || new Date()}
						mode="date"
						display="default"
						onChange={onDateChange}
					/>
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
});