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
	const [pickerMode, setPickerMode] = useState<'date' | 'startTime' | 'endTime' | null>(null);
	const [tempDate, setTempDate] = useState(new Date());

	const colorOptions = [
		'#007bff83', '#ff3a3089', '#34c75986', '#ffcc0087',
		'#ff950083', '#8d44ad86', '#e91e628d', '#7955486d'
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

	const openPicker = (mode: 'date' | 'startTime' | 'endTime') => {
		let initialDate: Date;
		
		switch (mode) {
			case 'date':
				initialDate = startTime instanceof Date ? startTime : new Date(startTime);
				break;
			case 'startTime':
				initialDate = startTime instanceof Date ? startTime : new Date(startTime);
				break;
			case 'endTime':
				initialDate = endTime instanceof Date ? endTime : new Date(endTime);
				break;
		}
		
		setTempDate(initialDate);
		setPickerMode(mode);
	};

	const onPickerChange = (_event: any, selectedDate?: Date) => {
		if (selectedDate) {
			setTempDate(selectedDate);
		}
	};

	const confirmPicker = () => {
		switch (pickerMode) {
			case 'date':
				const currentStart = startTime instanceof Date ? startTime : new Date(startTime);
				const currentEnd = endTime instanceof Date ? endTime : new Date(endTime);
				
				const newStartTime = new Date(tempDate);
				newStartTime.setHours(currentStart.getHours(), currentStart.getMinutes());
				setStartTime(newStartTime);

				const newEndTime = new Date(tempDate);
				newEndTime.setHours(currentEnd.getHours(), currentEnd.getMinutes());
				setEndTime(newEndTime);
				break;
				
			case 'startTime':
				const currentStartForTime = startTime instanceof Date ? startTime : new Date(startTime);
				const currentEndForTime = endTime instanceof Date ? endTime : new Date(endTime);
				
				const newStart = new Date(currentStartForTime);
				newStart.setHours(tempDate.getHours(), tempDate.getMinutes());
				setStartTime(newStart);

				if (newStart >= currentEndForTime) {
					const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000);
					setEndTime(newEnd);
				}
				break;
				
			case 'endTime':
				const currentEndForEndTime = endTime instanceof Date ? endTime : new Date(endTime);
				const newEnd = new Date(currentEndForEndTime);
				newEnd.setHours(tempDate.getHours(), tempDate.getMinutes());
				setEndTime(newEnd);
				break;
		}
		
		setPickerMode(null);
	};

	const cancelPicker = () => {
		setPickerMode(null);
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
						<TouchableOpacity
							style={styles.dateButton}
							onPress={() => openPicker('date')}
						>
							<Text style={styles.dateButtonText}>
								📅 {startTime instanceof Date ? startTime.toLocaleDateString() : new Date(startTime).toLocaleDateString()}
							</Text>
						</TouchableOpacity>
					</View>

					{!isAllDay && (
						<>
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Start Time</Text>
								<TouchableOpacity
									style={styles.dateButton}
									onPress={() => openPicker('startTime')}
								>
									<Text style={styles.dateButtonText}>
										🕐 {startTime instanceof Date ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
									</Text>
								</TouchableOpacity>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.label}>End Time</Text>
								<TouchableOpacity
									style={styles.dateButton}
									onPress={() => openPicker('endTime')}
								>
									<Text style={styles.dateButtonText}>
										🕐 {endTime instanceof Date ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
									</Text>
								</TouchableOpacity>
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

			{/* Unified Picker Modal */}
			{pickerMode && (
				<Modal
					transparent={true}
					animationType="slide"
					visible={!!pickerMode}
					onRequestClose={cancelPicker}
				>
					<View style={styles.pickerModal}>
						<View style={styles.pickerContainer}>
							<View style={styles.pickerHeader}>
								<TouchableOpacity onPress={cancelPicker}>
									<Text style={styles.pickerButton}>Cancel</Text>
								</TouchableOpacity>
								<Text style={styles.pickerTitle}>
									{pickerMode === 'date' ? 'Select Date' : 
									 pickerMode === 'startTime' ? 'Select Start Time' : 'Select End Time'}
								</Text>
								<TouchableOpacity onPress={confirmPicker}>
									<Text style={[styles.pickerButton, styles.confirmButton]}>Done</Text>
								</TouchableOpacity>
							</View>
							<DateTimePicker
								value={tempDate}
								mode={pickerMode === 'date' ? 'date' : 'time'}
								display={Platform.OS === 'ios' ? 'spinner' : 'default'}
								onChange={onPickerChange}
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