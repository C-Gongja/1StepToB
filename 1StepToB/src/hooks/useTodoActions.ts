import { useState, useCallback } from 'react';
import { Todo, TodoFormData } from '../types/Todo';
import { useTodoStore } from '../stores/todoStore';
import { generateId } from '../utils/dateUtils';

export const useTodoActions = () => {
	const { todos, addTodo: addTodoToStore, updateTodo: updateTodoInStore, deleteTodo: deleteTodoFromStore } = useTodoStore();
	const [showForm, setShowForm] = useState(false);
	const [editingTodo, setEditingTodo] = useState<Todo | undefined>();

	const handleEdit = useCallback((todo: Todo) => {
		setEditingTodo(todo);
		setShowForm(true);
	}, []);

	const handleDelete = useCallback((id: string) => {
		deleteTodoFromStore(id);
	}, [deleteTodoFromStore]);

	const handleToggleComplete = useCallback((id: string) => {
		const todo = todos.find(t => t.id === id);
		if (todo) {
			updateTodoInStore(id, {
				completed: !todo.completed,
				updatedAt: new Date()
			});
		}
	}, [todos, updateTodoInStore]);

	const handleFormSubmit = useCallback((data: TodoFormData) => {
		if (editingTodo) {
			// Update existing todo
			updateTodoInStore(editingTodo.id, {
				title: data.title,
				description: data.description,
				dueDate: data.dueDate,
				priority: data.priority,
				category: data.category,
				updatedAt: new Date(),
			});
		} else {
			// Add new todo
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
		}
		setShowForm(false);
		setEditingTodo(undefined);
	}, [editingTodo, addTodoToStore, updateTodoInStore]);

	const handleFormClose = useCallback(() => {
		setShowForm(false);
		setEditingTodo(undefined);
	}, []);

	return {
		todos,
		showForm,
		editingTodo,
		handleEdit,
		handleDelete,
		handleToggleComplete,
		handleFormSubmit,
		handleFormClose,
		setShowForm,
	};
};