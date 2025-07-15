import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types/Todo';

interface TodoState {
	todos: Todo[];
	addTodo: (todo: Todo) => void;
	updateTodo: (id: string, updates: Partial<Todo>) => void;
	deleteTodo: (id: string) => void;
}

export const useTodoStore = create<TodoState>()(
	persist(
		(set) => ({
			todos: [],

			addTodo: (todo: Todo) =>
				set((state) => ({ todos: [...state.todos, todo] })),

			updateTodo: (id: string, updates: Partial<Todo>) =>
				set((state) => ({
					todos: state.todos.map((todo) =>
						todo.id === id ? { ...todo, ...updates } : todo
					),
				})),

			deleteTodo: (id: string) =>
				set((state) => ({
					todos: state.todos.filter((todo) => todo.id !== id),
				})),
		}),
		{
			name: 'todo-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);