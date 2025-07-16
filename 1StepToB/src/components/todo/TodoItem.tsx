import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from 'react-native';
import { Todo, TodoPriority } from '../../types/Todo';
import { formatDate, isOverdue, isToday, isTomorrow } from '../../utils/dateUtils';


interface TodoItemProps {
	todo: Todo;
	onToggleComplete: (id: string) => void;
	onEdit: (todo: Todo) => void;
	onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = React.memo(({
	todo,
	onToggleComplete,
	onEdit,
	onDelete,
}) => {
	const handleDelete = () => {
		Alert.alert(
			'Delete Todo',
			'Are you sure you want to delete this todo?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Delete', style: 'destructive', onPress: () => onDelete(todo.id) },
			]
		);
	};

	const getPriorityColor = (priority: TodoPriority) => {
		switch (priority) {
			case TodoPriority.URGENT: return '#FF3B30';
			case TodoPriority.HIGH: return '#FF9500';
			case TodoPriority.MEDIUM: return '#FFCC00';
			case TodoPriority.LOW: return '#34C759';
			default: return '#8E8E93';
		}
	};

	const getDueDateText = () => {
		if (!todo.dueDate) return null;

		if (isToday(todo.dueDate)) return 'Today';
		if (isTomorrow(todo.dueDate)) return 'Tomorrow';
		if (isOverdue(todo.dueDate)) return 'Overdue';
		return formatDate(todo.dueDate);
	};

	const dueDateText = getDueDateText();
	const isOverdueItem = todo.dueDate && isOverdue(todo.dueDate);

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.checkboxContainer}
				onPress={() => onToggleComplete(todo.id)}
			>
				<View style={[styles.checkbox, todo.completed && styles.checkboxChecked]}>
					{todo.completed && <Text style={styles.checkmark}>✓</Text>}
				</View>
			</TouchableOpacity>

			<View style={styles.contentContainer}>
				<View style={styles.titleRow}>
					<Text style={[styles.title, todo.completed && styles.completedText]}>
						{todo.title}
					</Text>
					<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(todo.priority) }]}>
						<Text style={styles.priorityText}>{todo.priority.toUpperCase()}</Text>
					</View>
				</View>

				{todo.description && (
					<Text style={[styles.description, todo.completed && styles.completedText]}>
						{todo.description}
					</Text>
				)}

				{dueDateText && (
					<Text style={[
						styles.dueDate,
						isOverdueItem && styles.overdue,
						todo.completed && styles.completedText
					]}>
						📅 {dueDateText}
					</Text>
				)}

				{todo.category && (
					<Text style={[styles.category, todo.completed && styles.completedText]}>
						🏷️ {todo.category}
					</Text>
				)}
			</View>

			<View style={styles.actionsContainer}>
				<TouchableOpacity style={styles.editButton} onPress={() => onEdit(todo)}>
					<Text style={styles.editButtonText}>Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
					<Text style={styles.deleteButtonText}>Delete</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
});

export default TodoItem;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 16,
		backgroundColor: '#fff',
		marginVertical: 4,
		marginHorizontal: 16,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	checkboxContainer: {
		marginRight: 12,
		marginTop: 2,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderWidth: 2,
		borderColor: '#007AFF',
		borderRadius: 6,
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkboxChecked: {
		backgroundColor: '#007AFF',
	},
	checkmark: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	contentContainer: {
		flex: 1,
	},
	titleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 4,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		flex: 1,
		marginRight: 8,
	},
	description: {
		fontSize: 14,
		color: '#666',
		marginBottom: 4,
		lineHeight: 20,
	},
	dueDate: {
		fontSize: 12,
		color: '#666',
		marginBottom: 2,
	},
	overdue: {
		color: '#FF3B30',
		fontWeight: '600',
	},
	category: {
		fontSize: 12,
		color: '#666',
		marginBottom: 2,
	},
	completedText: {
		textDecorationLine: 'line-through',
		opacity: 0.6,
	},
	priorityBadge: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
		minWidth: 40,
		alignItems: 'center',
	},
	priorityText: {
		color: '#fff',
		fontSize: 10,
		fontWeight: 'bold',
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