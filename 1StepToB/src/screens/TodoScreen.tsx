import React, { useState } from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
} from 'react-native';
import { Todo, TodoFormData, TodoPriority } from '../types/Todo';
import TodoItem from '../components/todo/TodoItem';
import TodoForm from '../components/todo/TodoForm';
import { generateId } from '../utils/dateUtils';
import { useTodoStore } from '../stores/todoStore';

export const TodoScreen: React.FC = () => {
	const { todos, addTodo: addTodoToStore, updateTodo: updateTodoInStore, deleteTodo: deleteTodoFromStore } = useTodoStore();
	const [showForm, setShowForm] = useState(false);
	const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
	const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

	const addTodo = (data: TodoFormData) => {
		const newTodo: Todo = {
			id: generateId(),
			title: data.title,
			description: data.description,
			completed: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			dueDate: data.dueDate,
			priority: data.priority,
			category: data.category,
		};
		addTodoToStore(newTodo);
	};

	const updateTodo = (data: TodoFormData) => {
		if (!editingTodo) return;

		updateTodoInStore(editingTodo.id, {
			title: data.title,
			description: data.description,
			dueDate: data.dueDate,
			priority: data.priority,
			category: data.category,
			updatedAt: new Date(),
		});
		setEditingTodo(undefined);
	};

	const toggleComplete = (id: string) => {
		const todo = todos.find(t => t.id === id);
		if (todo) {
			updateTodoInStore(id, {
				completed: !todo.completed,
				updatedAt: new Date()
			});
		}
	};

	const deleteTodo = (id: string) => {
		deleteTodoFromStore(id);
	};

	const handleFormSubmit = (data: TodoFormData) => {
		if (editingTodo) {
			updateTodo(data);
		} else {
			addTodo(data);
		}
	};

	const handleEdit = (todo: Todo) => {
		setEditingTodo(todo);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingTodo(undefined);
	};

	const getFilteredTodos = () => {
		switch (filter) {
			case 'pending':
				return todos.filter(todo => !todo.completed);
			case 'completed':
				return todos.filter(todo => todo.completed);
			default:
				return todos;
		}
	};

	const filteredTodos = getFilteredTodos();
	const completedCount = todos.filter(todo => todo.completed).length;
	const totalCount = todos.length;
	const pendingCount = totalCount - completedCount;

	const filterButtons = [
		{ key: 'all', label: `All (${totalCount})` },
		{ key: 'pending', label: `Pending (${pendingCount})` },
		{ key: 'completed', label: `Done (${completedCount})` },
	];

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>My Todos</Text>
				<Text style={styles.subtitle}>
					{completedCount} of {totalCount} completed
				</Text>

				<View style={styles.filterContainer}>
					{filterButtons.map((button) => (
						<TouchableOpacity
							key={button.key}
							style={[
								styles.filterButton,
								filter === button.key && styles.filterButtonActive
							]}
							onPress={() => setFilter(button.key as any)}
						>
							<Text style={[
								styles.filterButtonText,
								filter === button.key && styles.filterButtonTextActive
							]}>
								{button.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setShowForm(true)}
				>
					<Text style={styles.addButtonText}>+ Add Todo</Text>
				</TouchableOpacity>
			</View>

			{filteredTodos.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>
						{filter === 'all' ? 'No todos yet!' :
							filter === 'pending' ? 'No pending todos!' :
								'No completed todos!'}
					</Text>
					<Text style={styles.emptySubtext}>
						{filter === 'all' ? 'Tap "Add Todo" to get started' :
							filter === 'pending' ? 'Great job staying on top of things!' :
								'Complete some todos to see them here'}
					</Text>
				</View>
			) : (
				<FlatList
					data={filteredTodos}
					keyExtractor={item => item.id}
					renderItem={({ item }) => (
						<TodoItem
							todo={item}
							onToggleComplete={toggleComplete}
							onEdit={handleEdit}
							onDelete={deleteTodo}
						/>
					)}
					contentContainerStyle={styles.listContainer}
					showsVerticalScrollIndicator={false}
				/>
			)}

			<TodoForm
				visible={showForm}
				onClose={handleCloseForm}
				onSubmit={handleFormSubmit}
				editingTodo={editingTodo}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		padding: 16,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		marginBottom: 16,
	},
	filterContainer: {
		flexDirection: 'row',
		marginBottom: 16,
		gap: 8,
	},
	filterButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#e0e0e0',
		backgroundColor: '#fff',
	},
	filterButtonActive: {
		backgroundColor: '#007AFF',
		borderColor: '#007AFF',
	},
	filterButtonText: {
		fontSize: 12,
		color: '#666',
		fontWeight: '600',
	},
	filterButtonTextActive: {
		color: '#fff',
	},
	addButton: {
		backgroundColor: '#007AFF',
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		alignItems: 'center',
	},
	addButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 32,
	},
	emptyText: {
		fontSize: 24,
		fontWeight: '600',
		color: '#333',
		marginBottom: 8,
		textAlign: 'center',
	},
	emptySubtext: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
	listContainer: {
		paddingVertical: 8,
	},
});