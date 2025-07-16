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

interface DayScheduleItemProps {
	item: ScheduledItem;
	onEdit: (item: ScheduledItem) => void;
	onDelete: (id: string) => void;
}

const DayScheduleItem: React.FC<DayScheduleItemProps> = React.memo(({
	item,
	onEdit,
	onDelete,
}) => {
	const getTimeText = () => {
		if (item.isAllDay) {
			return 'All day';
		}
		return `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`;
	};

	return (
		<View style={[
			styles.container,
			{ backgroundColor: item.color || '#007AFF' }
		]}>
			<View style={styles.contentContainer}>
				<Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
					{item.title}
				</Text>
				{item.description && (
					<Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
						{item.description}
					</Text>
				)}
				{item.category && (
					<Text style={styles.category} numberOfLines={1} ellipsizeMode="tail">
						🏷️ {item.category}
					</Text>
				)}
			</View>
			<View style={styles.timeContainer}>
				<Text style={styles.timeText}>{getTimeText()}</Text>
			</View>
		</View>
	);
});

export default DayScheduleItem;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginVertical: 0,
		marginHorizontal: 0,
		borderRadius: 6,
		// borderWidth: 2,
		// borderColor: '#FF0000',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		padding: 8,
		height: '100%',
		width: '100%',
	},
	timeContainer: {
		alignSelf: 'flex-start',
		flexShrink: 0,
	},
	timeText: {
		fontSize: 12,
		color: '#666',
		fontWeight: '600',
	},
	contentContainer: {
		flexShrink: 1,
		overflow: 'hidden',
		// paddingBottom: 24,
		marginBottom: 4,
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