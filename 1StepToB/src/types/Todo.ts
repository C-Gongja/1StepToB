export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: TodoPriority;
  category?: string;
}

export interface ScheduledItem {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  category?: string;
  color?: string;
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface TodoFormData {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TodoPriority;
  category?: string;
}

export interface ScheduleFormData {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  category?: string;
  color?: string;
}