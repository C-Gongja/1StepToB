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
	containerHeight?: number;
	duration?: number;
}

const DayScheduleItem: React.FC<DayScheduleItemProps> = React.memo(({
	item,
	onEdit,
	onDelete,
	containerHeight = 50,
	duration = 60,
}) => {
	const getTimeText = () => {
		if (item.isAllDay) {
			return 'All day';
		}
		return `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`;
	};

	// Height-based rendering logic
	const shouldShowDescription = containerHeight > 60 && duration > 30;
	const shouldShowCategory = containerHeight > 80 && duration > 60;
	const shouldShowTimeAtBottom = containerHeight > 40;

	return (
		<View style={[
			styles.container,
			{ backgroundColor: item.color || '#ffff' }
		]}>
			<View style={styles.contentContainer}>
				<Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
					{item.title}
				</Text>
				{shouldShowDescription && item.description && (
					<Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
						{item.description}
					</Text>
				)}
				{shouldShowCategory && item.category && (
					<Text style={styles.category} numberOfLines={1} ellipsizeMode="tail">
						🏷️ {item.category}
					</Text>
				)}
			</View>
			{shouldShowTimeAtBottom && (
				<View style={styles.timeContainer}>
					<Text style={styles.timeText}>{getTimeText()}</Text>
				</View>
			)}
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
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		paddingVertical: 3,
		paddingHorizontal: 6,
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
	timeOnly: {
		position: 'absolute',
		top: 4,
		right: 4,
		fontSize: 10,
		fontWeight: '500',
	},
	contentContainer: {
		flexShrink: 1,
		overflow: 'hidden',
		// paddingBottom: 24,
		marginBottom: 0,
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