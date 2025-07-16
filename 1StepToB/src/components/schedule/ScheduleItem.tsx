import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from 'react-native';
import { ScheduledItem } from '../../types/Todo';
import { formatTime } from '../../utils/dateUtils';

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
		<View style={styles.container}>
			<View style={{ flexDirection: 'column' }}>
				<View style={styles.contentContainer}>
					<View style={styles.titleRow}>
						<View style={[styles.colorCircle, { backgroundColor: item.color }]} />
						<Text style={styles.title}>{item.title}</Text>
					</View>
					{item.description && (
						<Text style={styles.description}>{item.description}</Text>
					)}
					{item.category && (
						<Text style={styles.category}>🏷️ {item.category}</Text>
					)}
				</View>
				<View style={styles.timeContainer}>
					<Text style={styles.timeText}>{getTimeText()}</Text>
				</View>
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
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff',
		marginVertical: 4,
		// marginHorizontal: 16,
		// borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		padding: 12,
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
	titleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		flex: 1,
	},
	colorCircle: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 8,
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
		backgroundColor: '#a3a3a3',
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