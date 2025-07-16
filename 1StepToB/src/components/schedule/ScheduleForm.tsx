import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Modal,
	ScrollView,
	Switch,
	Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScheduledItem, ScheduleFormData } from '../../types/Todo';


interface ScheduleFormProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (data: ScheduleFormData) => void;
	editingItem?: ScheduledItem;
}

const ScheduleForm: React.FC<ScheduleFormProps> = React.memo(({
	visible,
	onClose,
	onSubmit,
	editingItem,
}) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [startTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [isAllDay, setIsAllDay] = useState(false);
	const [category, setCategory] = useState('');
	const [color, setColor] = useState('#007AFF');
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showStartTimePicker, setShowStartTimePicker] = useState(false);
	const [showEndTimePicker, setShowEndTimePicker] = useState(false);

	const colorOptions = [
		'#007AFF', '#FF3B30', '#34C759', '#FFCC00',
		'#FF9500', '#8E44AD', '#E91E63', '#795548'
	];

	useEffect(() => {
		if (editingItem) {
			setTitle(editingItem.title);
			setDescription(editingItem.description || '');
			setStartTime(new Date(editingItem.startTime));
			setEndTime(new Date(editingItem.endTime));
			setIsAllDay(editingItem.isAllDay);
			setCategory(editingItem.category || '');
			setColor(editingItem.color || '#007AFF');
		} else {
			resetForm();
		}
	}, [editingItem, visible]);

	const resetForm = () => {
		setTitle('');
		setDescription('');
		const now = new Date();
		const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
		setStartTime(now);
		setEndTime(oneHourLater);
		setIsAllDay(false);
		setCategory('');
		setColor('#007AFF');
	};

	const handleSubmit = () => {
		if (title.trim()) {
			let finalStartTime = startTime;
			let finalEndTime = endTime;

			if (isAllDay) {
				finalStartTime = new Date(startTime);
				finalStartTime.setHours(0, 0, 0, 0);
				finalEndTime = new Date(startTime);
				finalEndTime.setHours(23, 59, 59, 999);
			}

			onSubmit({
				title: title.trim(),
				description: description.trim() || undefined,
				startTime: finalStartTime,
				endTime: finalEndTime,
				isAllDay,
				category: category.trim() || undefined,
				color,
			});
			resetForm();
			onClose();
		}
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const onDateChange = (_event: any, selectedDate?: Date) => {
		setShowDatePicker(false);
		if (selectedDate) {
			const newStartTime = new Date(selectedDate);
			newStartTime.setHours(startTime.getHours(), startTime.getMinutes());
			setStartTime(newStartTime);

			const newEndTime = new Date(selectedDate);
			newEndTime.setHours(endTime.getHours(), endTime.getMinutes());
			setEndTime(newEndTime);
		}
	};

	const onStartTimeChange = (_event: any, selectedTime?: Date) => {
		setShowStartTimePicker(false);
		if (selectedTime) {
			const newStartTime = new Date(startTime);
			newStartTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
			setStartTime(newStartTime);

			if (newStartTime >= endTime) {
				const newEndTime = new Date(newStartTime.getTime() + 60 * 60 * 1000);
				setEndTime(newEndTime);
			}
		}
	};

	const onEndTimeChange = (_event: any, selectedTime?: Date) => {
		setShowEndTimePicker(false);
		if (selectedTime) {
			const newEndTime = new Date(endTime);
			newEndTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
			setEndTime(newEndTime);
		}
	};

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
						{editingItem ? 'Edit Schedule' : 'New Schedule'}
					</Text>
					<TouchableOpacity onPress={handleSubmit}>
						<Text style={styles.saveButton}>Save</Text>
					</TouchableOpacity>
				</View>

				<ScrollView
					style={styles.form}
					contentContainerStyle={styles.formContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Title *</Text>
						<TextInput
							style={styles.input}
							value={title}
							onChangeText={setTitle}
							placeholder="Enter event title"
							autoFocus
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Description</Text>
						<TextInput
							style={[styles.input, styles.textArea]}
							value={description}
							onChangeText={setDescription}
							placeholder="Enter event description"
							multiline
							numberOfLines={3}
						/>
					</View>

					<View style={styles.inputGroup}>
						<View style={styles.switchRow}>
							<Text style={styles.label}>All Day</Text>
							<Switch
								value={isAllDay}
								onValueChange={setIsAllDay}
								trackColor={{ false: '#767577', true: '#81b0ff' }}
								thumbColor={isAllDay ? '#007AFF' : '#f4f3f4'}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Date</Text>
						<View style={styles.dateButton}>
							<Text style={styles.dateButtonText}>
								📅
							</Text>
							<DateTimePicker
								value={startTime instanceof Date ? startTime : new Date(startTime)}
								mode="date"
								display="default"
								onChange={onDateChange}
							/>
						</View>
					</View>

					{!isAllDay && (
						<>
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Start Time</Text>
								<View style={styles.dateButton}>
									<Text style={styles.dateButtonText}>
										🕐
									</Text>
									<DateTimePicker
										value={startTime instanceof Date ? startTime : new Date(startTime)}
										mode="time"
										display="default"
										onChange={onStartTimeChange}
									/>
								</View>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.label}>End Time</Text>
								<View style={styles.dateButton}>
									<Text style={styles.dateButtonText}>
										🕐
									</Text>
									<DateTimePicker
										value={endTime instanceof Date ? endTime : new Date(endTime)}
										mode="time"
										display="default"
										onChange={onEndTimeChange}
									/>
								</View>
							</View>
						</>
					)}

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Category</Text>
						<TextInput
							style={styles.input}
							value={category}
							onChangeText={setCategory}
							placeholder="Enter category (optional)"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Color</Text>
						<View style={styles.colorContainer}>
							{colorOptions.map((colorOption) => (
								<TouchableOpacity
									key={colorOption}
									style={[
										styles.colorButton,
										{ backgroundColor: colorOption },
										color === colorOption && styles.selectedColor
									]}
									onPress={() => setColor(colorOption)}
								/>
							))}
						</View>
					</View>
				</ScrollView>

			</View>
		</Modal>
	);
});

export default ScheduleForm;

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
	formContent: {
		paddingBottom: 80,
		flexGrow: 1,
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
	switchRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dateButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
	},
	dateButtonText: {
		fontSize: 16,
		color: '#333',
	},
	pickerContainer: {
		marginTop: 8,
		backgroundColor: '#fff',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e0e0e0',
		overflow: 'hidden',
	},
	colorContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	colorButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 3,
		borderColor: 'transparent',
	},
	selectedColor: {
		borderColor: '#333',
	},
});