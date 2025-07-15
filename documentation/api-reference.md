# StepToB - API Reference

## Component APIs

### HomeScreen

**Props**: 
```typescript
interface HomeScreenProps {
  navigation?: any; // React Navigation prop
}
```

**Methods**:
- `loadData(): Promise<void>` - Loads todos and schedule from storage
- `getGreeting(): string` - Returns time-appropriate greeting
- `getTodaysTodos(): Todo[]` - Returns todos due today (max 3)
- `getUpcomingTodos(): Todo[]` - Returns future todos (max 3)
- `getOverdueTodos(): Todo[]` - Returns overdue todos (max 3)
- `getTodaysSchedule(): ScheduledItem[]` - Returns today's events (max 3)

---

### TodoScreen

**Methods**:
- `loadTodos(): Promise<void>` - Loads todos from AsyncStorage
- `saveTodos(): Promise<void>` - Saves todos to AsyncStorage
- `addTodo(data: TodoFormData): void` - Creates new todo
- `updateTodo(data: TodoFormData): void` - Updates existing todo
- `toggleComplete(id: string): void` - Toggles todo completion
- `deleteTodo(id: string): void` - Removes todo
- `getFilteredTodos(): Todo[]` - Returns filtered todos based on current filter

---

### ScheduleScreen

**Methods**:
- `loadSchedule(): Promise<void>` - Loads schedule from AsyncStorage
- `saveSchedule(): Promise<void>` - Saves schedule to AsyncStorage
- `addScheduledItem(data: ScheduleFormData): void` - Creates new event
- `updateScheduledItem(data: ScheduleFormData): void` - Updates existing event
- `deleteScheduledItem(id: string): void` - Removes event
- `getItemsForDate(date: Date): ScheduledItem[]` - Returns events for specific date
- `navigateWeek(direction: 'prev' | 'next'): void` - Navigates week view

---

### ProfileScreen

**Methods**:
- `handleSaveProfile(): void` - Saves profile changes
- `handleCancelEdit(): void` - Cancels profile editing
- `updatePreference<K>(key: K, value: UserPreferences[K]): void` - Updates user preference
- `getInitials(name: string): string` - Generates user initials
- `formatJoinDate(date: Date): string` - Formats join date

---

### TodoItem

**Props**:
```typescript
interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}
```

**Methods**:
- `handleDelete(): void` - Shows delete confirmation dialog
- `getPriorityColor(priority: TodoPriority): string` - Returns color for priority
- `getDueDateText(): string | null` - Returns formatted due date text

---

### TodoForm

**Props**:
```typescript
interface TodoFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: TodoFormData) => void;
  editingTodo?: Todo;
}
```

**Methods**:
- `resetForm(): void` - Resets form to initial state
- `handleSubmit(): void` - Validates and submits form
- `handleClose(): void` - Closes form and resets
- `onDateChange(event: any, selectedDate?: Date): void` - Handles date picker changes

---

### ScheduleItem

**Props**:
```typescript
interface ScheduleItemProps {
  item: ScheduledItem;
  onEdit: (item: ScheduledItem) => void;
  onDelete: (id: string) => void;
}
```

**Methods**:
- `handleDelete(): void` - Shows delete confirmation dialog
- `getTimeText(): string` - Returns formatted time text

---

### ScheduleForm

**Props**:
```typescript
interface ScheduleFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => void;
  editingItem?: ScheduledItem;
}
```

**Methods**:
- `resetForm(): void` - Resets form to initial state
- `handleSubmit(): void` - Validates and submits form
- `handleClose(): void` - Closes form and resets
- `onStartDateChange(event: any, selectedDate?: Date): void` - Handles start date changes
- `onEndDateChange(event: any, selectedDate?: Date): void` - Handles end date changes
- `onStartTimeChange(event: any, selectedTime?: Date): void` - Handles start time changes
- `onEndTimeChange(event: any, selectedTime?: Date): void` - Handles end time changes

---

## Utility APIs

### dateUtils

```typescript
// Date formatting
formatDate(date: Date): string
formatTime(date: Date): string
formatDateTime(date: Date): string

// Date checks
isToday(date: Date): boolean
isTomorrow(date: Date): boolean
isOverdue(date: Date): boolean

// Date calculations
getWeekDates(startDate: Date): Date[]

// ID generation
generateId(): string
```

### storage

**TodoStorage**:
```typescript
save(todos: Todo[]): Promise<void>
load(): Promise<Todo[]>
clear(): Promise<void>
```

**ScheduleStorage**:
```typescript
save(items: ScheduledItem[]): Promise<void>
load(): Promise<ScheduledItem[]>
clear(): Promise<void>
```

---

## Type Definitions

### Core Types

```typescript
interface Todo {
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

interface ScheduledItem {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  category?: string;
  color?: string;
}

enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}
```

### Form Types

```typescript
interface TodoFormData {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TodoPriority;
  category?: string;
}

interface ScheduleFormData {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  category?: string;
  color?: string;
}
```

### User Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  defaultTodoPriority: 'low' | 'medium' | 'high' | 'urgent';
  weekStartsOn: 'sunday' | 'monday';
}
```

---

## Constants

### Colors

```typescript
// Priority Colors
const PRIORITY_COLORS = {
  urgent: '#FF3B30',
  high: '#FF9500',
  medium: '#FFCC00',
  low: '#34C759'
};

// App Colors
const APP_COLORS = {
  primary: '#007AFF',
  secondary: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#FFCC00',
  background: '#f5f5f5',
  white: '#fff',
  text: '#333',
  textSecondary: '#666',
  border: '#e0e0e0'
};
```

### Event Colors

```typescript
const EVENT_COLORS = [
  '#007AFF', '#FF3B30', '#34C759', '#FFCC00',
  '#FF9500', '#8E44AD', '#E91E63', '#795548'
];
```

---

## Error Handling

### Storage Errors

All storage operations include try-catch blocks with console error logging:

```typescript
try {
  await AsyncStorage.setItem(key, value);
} catch (error) {
  console.error('Error saving data:', error);
}
```

### Form Validation

**Todo Form**:
- Title is required (minimum 1 character after trim)

**Schedule Form**:
- Title is required (minimum 1 character after trim)
- End time must be after start time (automatic adjustment)

### Navigation Errors

Navigation props are optional to handle cases where navigation might not be available:

```typescript
onPress={() => navigation?.navigate('Screen')}
```

---

## Performance Considerations

### List Rendering

- **FlatList** used for todo and schedule lists
- **keyExtractor** provides unique keys for performance
- **Limited items** displayed on Home screen (max 3 per section)

### State Updates

- **Immutable updates** using spread operator
- **Functional state updates** to prevent stale closures
- **Efficient re-renders** with proper dependency arrays

### Storage Operations

- **Automatic saving** on state changes
- **JSON serialization** for complex objects
- **Date handling** with custom serialization logic

---

## Testing Recommendations

### Unit Tests

- Test utility functions (dateUtils, storage)
- Test component props and callbacks
- Test form validation logic

### Integration Tests

- Test storage save/load operations
- Test navigation between screens
- Test form submission flows

### E2E Tests

- Test complete todo creation flow
- Test schedule creation and viewing
- Test profile editing
- Test navigation between all screens

This API reference provides detailed information about all components, methods, and types in the StepToB application.