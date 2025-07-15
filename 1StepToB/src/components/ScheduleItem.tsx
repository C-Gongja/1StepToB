import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from 'react-native';
import { ScheduledItem } from '../types/Todo';
import { formatTime } from '../utils/dateUtils';

interface ScheduleItemProps {
	item: ScheduledItem;
	onEdit: (item: ScheduledItem) => void;
	onDelete: (id: string) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = React.memo(({
	item,
	onEdit,
	onDelete,
}) => {
	const handleDelete = () => {
		Alert.alert(
			'Delete Schedule Item',
			'Are you sure you want to delete this scheduled item?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
			]
		);
	};

	const getTimeText = () => {
		if (item.isAllDay) {
			return 'All day';
		}
		return `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`;
	};

	return (
		<View style={[
			styles.container,
			{ borderLeftColor: item.color || '#007AFF' }
		]}>
			<View style={styles.timeContainer}>
				<Text style={styles.timeText}>{getTimeText()}</Text>
			</View>

			<View style={styles.contentContainer}>
				<Text style={styles.title}>{item.title}</Text>
				{item.description && (
					<Text style={styles.description}>{item.description}</Text>
				)}
				{item.category && (
					<Text style={styles.category}>🏷️ {item.category}</Text>
				)}
			</View>

			<View style={styles.actionsContainer}>
				<TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
					<Text style={styles.editButtonText}>Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
					<Text style={styles.deleteButtonText}>Delete</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
});

export default ScheduleItem;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		marginVertical: 4,
		marginHorizontal: 16,
		borderRadius: 12,
		borderLeftWidth: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		padding: 16,
	},
	timeContainer: {
		minWidth: 80,
		marginRight: 12,
	},
	timeText: {
		fontSize: 12,
		color: '#666',
		fontWeight: '600',
	},
	contentContainer: {
		flex: 1,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	description: {
		fontSize: 14,
		color: '#666',
		marginBottom: 4,
		lineHeight: 20,
	},
	category: {
		fontSize: 12,
		color: '#666',
	},
	actionsContainer: {
		flexDirection: 'column',
		gap: 4,
		marginLeft: 8,
	},
	editButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: '#007AFF',
		borderRadius: 6,
		minWidth: 50,
		alignItems: 'center',
	},
	editButtonText: {
		color: '#fff',
		fontSize: 12,
		fontWeight: '600',
	},
	deleteButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: '#FF3B30',
		borderRadius: 6,
		minWidth: 50,
		alignItems: 'center',
	},
	deleteButtonText: {
		color: '#fff',
		fontSize: 12,
		fontWeight: '600',
	},
});