# StepToB - Complete Documentation

## Table of Contents
1. [App Overview](#app-overview)
2. [Architecture](#architecture)
3. [Screens Documentation](#screens-documentation)
4. [Components Documentation](#components-documentation)
5. [Types & Interfaces](#types--interfaces)
6. [Utilities](#utilities)
7. [Features Summary](#features-summary)
8. [Navigation Structure](#navigation-structure)

## App Overview

**StepToB** is a comprehensive React Native mobile application built with Expo for managing todos and scheduling events. The app provides a clean, modern interface with persistent data storage and intuitive navigation.

### Key Technologies
- **React Native + Expo** - Cross-platform mobile development
- **TypeScript** - Type safety and better development experience
- **React Navigation** - Tab-based navigation
- **AsyncStorage** - Local data persistence
- **DateTimePicker** - Native date/time selection

---

## Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── TodoItem.tsx     # Individual todo item display
│   ├── TodoForm.tsx     # Todo creation/editing form
│   ├── ScheduleItem.tsx # Individual schedule item display
│   └── ScheduleForm.tsx # Schedule creation/editing form
├── screens/             # Main app screens
│   ├── HomeScreen.tsx   # Dashboard/overview screen
│   ├── TodoScreen.tsx   # Todo management screen
│   ├── ScheduleScreen.tsx # Calendar/schedule screen
│   └── ProfileScreen.tsx # User profile & settings
├── types/               # TypeScript type definitions
│   ├── Todo.ts          # Todo and schedule types
│   └── User.ts          # User profile types
└── utils/               # Utility functions
    ├── dateUtils.ts     # Date formatting and calculations
    └── storage.ts       # AsyncStorage wrapper functions
```

### Data Flow
- **State Management**: React hooks (useState, useEffect)
- **Data Persistence**: AsyncStorage for todos and scheduled items
- **Navigation**: Bottom tab navigator with 4 main screens
- **Form Handling**: Controlled components with validation

---

## Screens Documentation

### 1. HomeScreen.tsx

**Purpose**: Dashboard providing an overview of user's todos and schedule

**Key Features**:
- Dynamic time-based greeting (Good Morning/Afternoon/Evening)
- Quick stats cards showing pending/completed todos and today's events
- Smart content sections with priority-based organization
- Empty state for new users
- Quick action buttons for adding todos/events

**State Management**:
```typescript
const [todos, setTodos] = useState<Todo[]>([]);
const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
const [greeting, setGreeting] = useState('');
```

**Key Functions**:
- `loadData()` - Loads todos and schedule from storage
- `getGreeting()` - Returns time-appropriate greeting
- `getTodaysTodos()` - Filters todos due today
- `getOverdueTodos()` - Filters overdue todos
- `getTodaysSchedule()` - Filters today's scheduled events

**Content Sections**:
1. **⚠️ Overdue** - Shows overdue todos (red priority)
2. **📝 Today's Todos** - Tasks due today
3. **📅 Today's Schedule** - Events scheduled for today
4. **📋 Upcoming** - Future todos and deadlines

### 2. TodoScreen.tsx

**Purpose**: Complete todo management with CRUD operations

**Key Features**:
- Add, edit, delete todos
- Mark todos as complete/incomplete
- Filter by All/Pending/Completed
- Priority levels with color coding
- Due date management
- Categories and descriptions
- Progress tracking

**State Management**:
```typescript
const [todos, setTodos] = useState<Todo[]>([]);
const [showForm, setShowForm] = useState(false);
const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
```

**Key Functions**:
- `addTodo(data: TodoFormData)` - Creates new todo
- `updateTodo(data: TodoFormData)` - Updates existing todo
- `toggleComplete(id: string)` - Toggles completion status
- `deleteTodo(id: string)` - Removes todo
- `getFilteredTodos()` - Applies current filter

**Data Persistence**:
- Automatic saving to AsyncStorage on state changes
- Loading saved todos on component mount

### 3. ScheduleScreen.tsx

**Purpose**: Calendar view with week navigation and event management

**Key Features**:
- Week view with date navigation
- Add, edit, delete scheduled events
- All-day and timed events
- Color-coded events
- Event categories
- Visual event indicators on calendar dates

**State Management**:
```typescript
const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
const [showForm, setShowForm] = useState(false);
const [editingItem, setEditingItem] = useState<ScheduledItem | undefined>();
const [selectedDate, setSelectedDate] = useState(new Date());
```

**Key Functions**:
- `addScheduledItem(data: ScheduleFormData)` - Creates new event
- `updateScheduledItem(data: ScheduleFormData)` - Updates existing event
- `deleteScheduledItem(id: string)` - Removes event
- `getItemsForDate(date: Date)` - Filters events for specific date
- `navigateWeek(direction: 'prev' | 'next')` - Week navigation

**Calendar Features**:
- Horizontal scrollable week view
- Today highlighting
- Selected date highlighting
- Event dots on dates with events

### 4. ProfileScreen.tsx

**Purpose**: User profile management and app preferences

**Key Features**:
- Editable user profile (name, email)
- Avatar with user initials
- Theme preferences (Light/Dark/Auto)
- Notification settings
- Default todo priority setting
- Week start day preference
- Activity statistics
- App version information

**State Management**:
```typescript
const [user, setUser] = useState<User>({...});
const [isEditing, setIsEditing] = useState(false);
const [editName, setEditName] = useState(user.name);
const [editEmail, setEditEmail] = useState(user.email);
```

**Sections**:
1. **Profile Header** - Avatar, name, email, join date
2. **Preferences** - Theme, notifications, priorities, week start
3. **Statistics** - Todos completed, events scheduled, activity streak
4. **About** - App version and build information

---

## Components Documentation

### 1. TodoItem.tsx

**Purpose**: Displays individual todo items with interactive controls

**Props**:
```typescript
interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}
```

**Features**:
- Checkbox for completion toggle
- Priority badge with color coding
- Due date display with overdue highlighting
- Category tags
- Edit and delete action buttons
- Strikethrough styling for completed todos
- Confirmation dialog for deletion

**Priority Colors**:
- Urgent: `#FF3B30` (Red)
- High: `#FF9500` (Orange)
- Medium: `#FFCC00` (Yellow)
- Low: `#34C759` (Green)

### 2. TodoForm.tsx

**Purpose**: Modal form for creating and editing todos

**Props**:
```typescript
interface TodoFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: TodoFormData) => void;
  editingTodo?: Todo;
}
```

**Form Fields**:
- **Title** (required) - Text input
- **Description** (optional) - Multi-line text area
- **Due Date** (optional) - Date picker
- **Priority** (required) - Button selection
- **Category** (optional) - Text input

**Features**:
- Modal presentation with slide animation
- Form validation (title required)
- Auto-population for editing mode
- Date picker integration
- Priority selection with color coding

### 3. ScheduleItem.tsx

**Purpose**: Displays individual scheduled events

**Props**:
```typescript
interface ScheduleItemProps {
  item: ScheduledItem;
  onEdit: (item: ScheduledItem) => void;
  onDelete: (id: string) => void;
}
```

**Features**:
- Time display (all-day or specific time range)
- Color-coded left border
- Category display
- Edit and delete actions
- Confirmation dialog for deletion

### 4. ScheduleForm.tsx

**Purpose**: Modal form for creating and editing scheduled events

**Props**:
```typescript
interface ScheduleFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => void;
  editingItem?: ScheduledItem;
}
```

**Form Fields**:
- **Title** (required) - Text input
- **Description** (optional) - Multi-line text area
- **All Day** toggle - Switch component
- **Date** - Date picker
- **Start Time** (if not all day) - Time picker
- **End Time** (if not all day) - Time picker
- **Category** (optional) - Text input
- **Color** - Color selection from predefined palette

**Features**:
- Modal presentation
- All-day event handling
- Time validation (end after start)
- Color picker with 8 predefined colors
- Auto-population for editing mode

---

## Types & Interfaces

### Todo Types (types/Todo.ts)

```typescript
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
```

### User Types (types/User.ts)

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  defaultTodoPriority: 'low' | 'medium' | 'high' | 'urgent';
  weekStartsOn: 'sunday' | 'monday';
}

export interface UserFormData {
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}
```

---

## Utilities

### dateUtils.ts

**Purpose**: Date formatting and calculation utilities

**Functions**:
- `formatDate(date: Date): string` - Formats date as "Jan 15, 2024"
- `formatTime(date: Date): string` - Formats time as "2:30 PM"
- `formatDateTime(date: Date): string` - Combines date and time
- `isToday(date: Date): boolean` - Checks if date is today
- `isTomorrow(date: Date): boolean` - Checks if date is tomorrow
- `isOverdue(date: Date): boolean` - Checks if date is in the past
- `getWeekDates(startDate: Date): Date[]` - Returns array of 7 dates for week view
- `generateId(): string` - Generates unique ID for new items

### storage.ts

**Purpose**: AsyncStorage wrapper for data persistence

**TodoStorage**:
- `save(todos: Todo[]): Promise<void>` - Saves todos to storage
- `load(): Promise<Todo[]>` - Loads todos from storage
- `clear(): Promise<void>` - Clears all todos

**ScheduleStorage**:
- `save(items: ScheduledItem[]): Promise<void>` - Saves schedule to storage
- `load(): Promise<ScheduledItem[]>` - Loads schedule from storage
- `clear(): Promise<void>` - Clears all scheduled items

**Features**:
- Automatic JSON serialization/deserialization
- Date object handling for storage
- Error handling with console logging

---

## Features Summary

### Core Features ✅

**Todo Management**:
- ✅ Create, read, update, delete todos
- ✅ Mark as complete/incomplete
- ✅ Priority levels (Low, Medium, High, Urgent)
- ✅ Due dates with overdue detection
- ✅ Categories and descriptions
- ✅ Filter by status (All/Pending/Completed)
- ✅ Progress tracking

**Schedule Management**:
- ✅ Create, read, update, delete events
- ✅ All-day and timed events
- ✅ Week view calendar
- ✅ Color-coded events
- ✅ Categories and descriptions
- ✅ Date navigation

**User Profile**:
- ✅ Editable profile (name, email)
- ✅ User preferences and settings
- ✅ Activity statistics
- ✅ Theme preferences
- ✅ Notification settings

**Home Dashboard**:
- ✅ Overview of todos and schedule
- ✅ Quick stats and summaries
- ✅ Smart content organization
- ✅ Quick action buttons
- ✅ Dynamic greetings

### Technical Features ✅

**Data Persistence**:
- ✅ AsyncStorage integration
- ✅ Automatic save/load
- ✅ Date serialization handling

**Navigation**:
- ✅ Bottom tab navigation
- ✅ 4 main screens (Home, Todos, Schedule, Profile)
- ✅ Screen-to-screen navigation

**User Experience**:
- ✅ Modern iOS-style design
- ✅ Responsive layouts
- ✅ Form validation
- ✅ Confirmation dialogs
- ✅ Empty states
- ✅ Loading states

**Development**:
- ✅ TypeScript for type safety
- ✅ Modular component architecture
- ✅ Consistent code style
- ✅ Error handling

---

## Navigation Structure

```
App (TabNavigator)
├── Home 🏠 (HomeScreen)
│   ├── Quick Stats
│   ├── Overdue Todos
│   ├── Today's Todos
│   ├── Today's Schedule
│   └── Upcoming Todos
├── Todos ✓ (TodoScreen)
│   ├── TodoForm (Modal)
│   └── TodoItem (List)
├── Schedule 📅 (ScheduleScreen)
│   ├── ScheduleForm (Modal)
│   └── ScheduleItem (List)
└── Profile 👤 (ProfileScreen)
    ├── User Info
    ├── Preferences
    ├── Statistics
    └── About
```

### Screen Interactions
- **Home → Todos**: "See All" buttons and quick actions
- **Home → Schedule**: "See All" buttons and quick actions
- **Any Screen → Any Screen**: Bottom tab navigation
- **Forms**: Modal overlays on respective screens

---

## Installation & Setup

1. **Clone Repository**
2. **Install Dependencies**: `npm install`
3. **Start Development Server**: `npx expo start`
4. **Run on Device**: Scan QR code with Expo Go app
5. **Run on Simulator**: Press 'i' for iOS or 'a' for Android

## Development Commands

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

## Dependencies

**Core**:
- expo
- react-native
- react
- typescript

**Navigation**:
- @react-navigation/native
- @react-navigation/bottom-tabs
- react-native-screens
- react-native-safe-area-context

**Components**:
- @react-native-community/datetimepicker
- @react-native-async-storage/async-storage

This documentation provides a comprehensive overview of the StepToB application, its components, features, and architecture. The app is production-ready with full CRUD functionality, data persistence, and a modern user interface.