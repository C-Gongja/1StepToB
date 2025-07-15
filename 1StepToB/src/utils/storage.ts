// Legacy storage utilities - deprecated in favor of Zustand stores
// Use useTodoStore and useScheduleStore instead

import { useTodoStore } from '../stores/todoStore';
import { useScheduleStore } from '../stores/scheduleStore';
import { Todo, ScheduledItem } from '../types/Todo';

// Deprecated: Use useTodoStore hook instead
export const TodoStorage = {
  async save(todos: Todo[]): Promise<void> {
    console.warn('TodoStorage.save is deprecated. Use useTodoStore hook instead.');
    // For migration purposes, you can manually set the todos
    // useTodoStore.getState().clearTodos();
    // todos.forEach(todo => useTodoStore.getState().addTodo(todo));
  },

  async load(): Promise<Todo[]> {
    console.warn('TodoStorage.load is deprecated. Use useTodoStore hook instead.');
    return useTodoStore.getState().todos;
  },

  async clear(): Promise<void> {
    console.warn('TodoStorage.clear is deprecated. Use useTodoStore hook instead.');
    useTodoStore.getState().clearTodos();
  },
};

// Deprecated: Use useScheduleStore hook instead
export const ScheduleStorage = {
  async save(items: ScheduledItem[]): Promise<void> {
    console.warn('ScheduleStorage.save is deprecated. Use useScheduleStore hook instead.');
    // For migration purposes, you can manually set the items
    // useScheduleStore.getState().clearItems();
    // items.forEach(item => useScheduleStore.getState().addItem(item));
  },

  async load(): Promise<ScheduledItem[]> {
    console.warn('ScheduleStorage.load is deprecated. Use useScheduleStore hook instead.');
    return useScheduleStore.getState().items;
  },

  async clear(): Promise<void> {
    console.warn('ScheduleStorage.clear is deprecated. Use useScheduleStore hook instead.');
    useScheduleStore.getState().clearItems();
  },
};