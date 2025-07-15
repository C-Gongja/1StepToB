import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	FlatList,
} from 'react-native';
import { Todo, ScheduledItem, TodoPriority } from '../types/Todo';
import { useTodoStore } from '../stores/todoStore';
import { useScheduleStore } from '../stores/scheduleStore';
import { formatDate, formatTime, isToday, isTomorrow, isOverdue } from '../utils/dateUtils';

interface HomeScreenProps {
	navigation?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
	const { todos } = useTodoStore();
	const { items: scheduledItems } = useScheduleStore();
	const [greeting, setGreeting] = useState('');

	useEffect(() => {
		setGreeting(getGreeting());
	}, []);

	const getGreeting = (): string => {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good Morning';
		if (hour < 17) return 'Good Afternoon';
		return 'Good Evening';
	};

	const getTodaysTodos = () => {
		return todos.filter(todo =>
			!todo.completed &&
			(todo.dueDate ? isToday(todo.dueDate) : false)
		).slice(0, 3);
	};

	const getUpcomingTodos = () => {
		return todos.filter(todo =>
			!todo.completed &&
			todo.dueDate &&
			(isTomorrow(todo.dueDate) || todo.dueDate > new Date())
		).slice(0, 3);
	};

	const getOverdueTodos = () => {
		return todos.filter(todo =>
			!todo.completed &&
			todo.dueDate &&
			isOverdue(todo.dueDate)
		).slice(0, 3);
	};

	const getTodaysSchedule = () => {
		return scheduledItems.filter(item => {
			const itemDate = new Date(item.startTime);
			return isToday(itemDate);
		}).sort((a, b) => a.startTime.getTime() - b.startTime.getTime()).slice(0, 3);
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

	const getDueDateText = (dueDate: Date | undefined) => {
		if (!dueDate) return null;
		if (isToday(dueDate)) return 'Today';
		if (isTomorrow(dueDate)) return 'Tomorrow';
		if (isOverdue(dueDate)) return 'Overdue';
		return formatDate(dueDate);
	};

	const completedTodosCount = todos.filter(todo => todo.completed).length;
	const totalTodosCount = todos.length;
	const pendingTodosCount = totalTodosCount - completedTodosCount;
	const todaysScheduleCount = getTodaysSchedule().length;

	const QuickStatsCard = ({ title, value, subtitle, color }: {
		title: string;
		value: string | number;
		subtitle: string;
		color: string;
	}) => (
		<View style={styles.statsCard}>
			<Text style={styles.statsTitle}>{title}</Text>
			<Text style={[styles.statsValue, { color }]}>{value}</Text>
			<Text style={styles.statsSubtitle}>{subtitle}</Text>
		</View>
	);

	const TodoCard = ({ todo }: { todo: Todo }) => (
		<View style={styles.todoCard}>
			<View style={styles.todoCardContent}>
				<Text style={styles.todoCardTitle} numberOfLines={1}>{todo.title}</Text>
				<View style={styles.todoCardMeta}>
					<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(todo.priority) }]}>
						<Text style={styles.priorityText}>{todo.priority.toUpperCase()}</Text>
					</View>
					{todo.dueDate && (
						<Text style={[
							styles.dueDateText,
							isOverdue(todo.dueDate) && styles.overdueText
						]}>
							{getDueDateText(todo.dueDate)}
						</Text>
					)}
				</View>
			</View>
		</View>
	);

	const ScheduleCard = ({ item }: { item: ScheduledItem }) => (
		<View style={[styles.scheduleCard, { borderLeftColor: item.color || '#007AFF' }]}>
			<Text style={styles.scheduleTime}>
				{item.isAllDay ? 'All day' : formatTime(item.startTime)}
			</Text>
			<Text style={styles.scheduleTitle} numberOfLines={1}>{item.title}</Text>
			{item.category && (
				<Text style={styles.scheduleCategory}>{item.category}</Text>
			)}
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.greeting}>{greeting}!</Text>
					<Text style={styles.subtitle}>Here's what's happening today</Text>
				</View>

				{/* Quick Stats */}
				<View style={styles.statsContainer}>
					<QuickStatsCard
						title="Pending"
						value={pendingTodosCount}
						subtitle="todos left"
						color="#FF9500"
					/>
					<QuickStatsCard
						title="Completed"
						value={completedTodosCount}
						subtitle="todos done"
						color="#34C759"
					/>
					<QuickStatsCard
						title="Today"
						value={todaysScheduleCount}
						subtitle="events"
						color="#007AFF"
					/>
				</View>

				{/* Overdue Todos */}
				{getOverdueTodos().length > 0 && (
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>⚠️ Overdue</Text>
							<TouchableOpacity onPress={() => navigation?.navigate('Todos')}>
								<Text style={styles.seeAllText}>See All</Text>
							</TouchableOpacity>
						</View>
						{getOverdueTodos().map((todo) => (
							<TodoCard key={todo.id} todo={todo} />
						))}
					</View>
				)}

				{/* Today's Todos */}
				{getTodaysTodos().length > 0 && (
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>📝 Today's Todos</Text>
							<TouchableOpacity onPress={() => navigation?.navigate('Todos')}>
								<Text style={styles.seeAllText}>See All</Text>
							</TouchableOpacity>
						</View>
						{getTodaysTodos().map((todo) => (
							<TodoCard key={todo.id} todo={todo} />
						))}
					</View>
				)}

				{/* Today's Schedule */}
				{getTodaysSchedule().length > 0 && (
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>📅 Today's Schedule</Text>
							<TouchableOpacity onPress={() => navigation?.navigate('Schedule')}>
								<Text style={styles.seeAllText}>See All</Text>
							</TouchableOpacity>
						</View>
						{getTodaysSchedule().map((item) => (
							<ScheduleCard key={item.id} item={item} />
						))}
					</View>
				)}

				{/* Upcoming Todos */}
				{getUpcomingTodos().length > 0 && (
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>📋 Upcoming</Text>
							<TouchableOpacity onPress={() => navigation?.navigate('Todos')}>
								<Text style={styles.seeAllText}>See All</Text>
							</TouchableOpacity>
						</View>
						{getUpcomingTodos().map((todo) => (
							<TodoCard key={todo.id} todo={todo} />
						))}
					</View>
				)}

				{/* Empty State */}
				{todos.length === 0 && scheduledItems.length === 0 && (
					<View style={styles.emptyState}>
						<Text style={styles.emptyStateTitle}>Welcome to StepToB!</Text>
						<Text style={styles.emptyStateText}>
							Start by adding your first todo or scheduling an event
						</Text>
						<View style={styles.emptyStateButtons}>
							<TouchableOpacity
								style={styles.emptyButton}
								onPress={() => navigation?.navigate('Todos')}
							>
								<Text style={styles.emptyButtonText}>Add Todo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.emptyButton, styles.emptyButtonSecondary]}
								onPress={() => navigation?.navigate('Schedule')}
							>
								<Text style={[styles.emptyButtonText, styles.emptyButtonTextSecondary]}>
									Schedule Event
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<TouchableOpacity
						style={styles.quickActionButton}
						onPress={() => navigation?.navigate('Todos')}
					>
						<Text style={styles.quickActionIcon}>✓</Text>
						<Text style={styles.quickActionText}>Add Todo</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.quickActionButton}
						onPress={() => navigation?.navigate('Schedule')}
					>
						<Text style={styles.quickActionIcon}>📅</Text>
						<Text style={styles.quickActionText}>Schedule</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
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
	header: {
		padding: 20,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	greeting: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
	},
	statsContainer: {
		flexDirection: 'row',
		padding: 16,
		gap: 12,
	},
	statsCard: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	statsTitle: {
		fontSize: 12,
		color: '#666',
		fontWeight: '600',
		marginBottom: 4,
	},
	statsValue: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 2,
	},
	statsSubtitle: {
		fontSize: 12,
		color: '#999',
	},
	section: {
		marginTop: 16,
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
	},
	seeAllText: {
		fontSize: 14,
		color: '#007AFF',
		fontWeight: '600',
	},
	todoCard: {
		backgroundColor: '#f9f9f9',
		borderRadius: 8,
		padding: 12,
		marginBottom: 8,
		borderLeftWidth: 3,
		borderLeftColor: '#007AFF',
	},
	todoCardContent: {
		flex: 1,
	},
	todoCardTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 6,
	},
	todoCardMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
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
	dueDateText: {
		fontSize: 12,
		color: '#666',
		fontWeight: '600',
	},
	overdueText: {
		color: '#FF3B30',
	},
	scheduleCard: {
		backgroundColor: '#f9f9f9',
		borderRadius: 8,
		padding: 12,
		marginBottom: 8,
		borderLeftWidth: 4,
	},
	scheduleTime: {
		fontSize: 12,
		color: '#666',
		fontWeight: '600',
		marginBottom: 4,
	},
	scheduleTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	scheduleCategory: {
		fontSize: 12,
		color: '#999',
	},
	emptyState: {
		padding: 40,
		alignItems: 'center',
		backgroundColor: '#fff',
		margin: 16,
		borderRadius: 12,
	},
	emptyStateTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 8,
	},
	emptyStateText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginBottom: 24,
	},
	emptyStateButtons: {
		flexDirection: 'row',
		gap: 12,
	},
	emptyButton: {
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: '#007AFF',
		borderRadius: 8,
	},
	emptyButtonSecondary: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#007AFF',
	},
	emptyButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	emptyButtonTextSecondary: {
		color: '#007AFF',
	},
	quickActions: {
		flexDirection: 'row',
		padding: 16,
		gap: 12,
		marginBottom: 20,
	},
	quickActionButton: {
		flex: 1,
		backgroundColor: '#007AFF',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	quickActionIcon: {
		fontSize: 24,
		marginBottom: 4,
	},
	quickActionText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '600',
	},
});