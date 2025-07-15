import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScheduledItem } from '../types/Todo';

interface ScheduleState {
	items: ScheduledItem[];
	addItem: (item: ScheduledItem) => void;
	updateItem: (id: string, updates: Partial<ScheduledItem>) => void;
	deleteItem: (id: string) => void;
	getItemsByDate: (date: Date) => ScheduledItem[];
}

export const useScheduleStore = create<ScheduleState>()(
	persist(
		(set, get) => ({
			items: [],

			addItem: (item: ScheduledItem) =>
				set((state) => ({ items: [...state.items, item] })),

			updateItem: (id: string, updates: Partial<ScheduledItem>) =>
				set((state) => ({
					items: state.items.map((item) =>
						item.id === id ? { ...item, ...updates } : item
					),
				})),

			deleteItem: (id: string) =>
				set((state) => ({
					items: state.items.filter((item) => item.id !== id),
				})),

			getItemsByDate: (date: Date) => {
				const state = get();
				const targetDate = date.toDateString();
				return state.items.filter((item) =>
					item.startTime.toDateString() === targetDate
				);
			},
		}),
		{
			name: 'schedule-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);