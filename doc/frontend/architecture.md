# App Architecture

## Component Hierarchy

```
App
└── TodoScreen (Main Screen)
    ├── Header (title, progress, add button)
    ├── TodoList (FlatList)
    │   └── TodoItem (for each todo)
    │       ├── Checkbox
    │       ├── Content (title, description)
    │       └── Actions (edit, delete buttons)
    └── TodoForm (Modal)
        ├── Header (cancel, title, save)
        └── Form Fields (title, description inputs)
```

## Data Flow

### State Management
- **Local State**: Using React's `useState` for component-level state
- **Todo List**: Stored in TodoScreen component state
- **Form State**: Managed within TodoForm component

### Event Flow
1. **Add Todo**: TodoScreen → TodoForm → TodoScreen (new todo added)
2. **Edit Todo**: TodoScreen → TodoForm → TodoScreen (todo updated)
3. **Toggle Complete**: TodoItem → TodoScreen (todo status updated)
4. **Delete Todo**: TodoItem → TodoScreen (todo removed)

## Data Models

### Todo Interface
```typescript
interface Todo {
  id: string;           // Unique identifier
  title: string;        // Todo title (required)
  description?: string; // Optional description
  completed: boolean;   // Completion status
  createdAt: Date;     // Creation timestamp
  updatedAt: Date;     // Last update timestamp
}
```

### Form Data Interface
```typescript
interface TodoFormData {
  title: string;        // Required title
  description?: string; // Optional description
}
```

## Design Patterns

### Component Composition
- **Separation of Concerns**: Each component has a single responsibility
- **Props Interface**: Clear TypeScript interfaces for component props
- **Event Callbacks**: Parent components handle state changes via callback props

### State Management Pattern
- **Immutable Updates**: Using functional state updates with spread operator
- **Derived State**: Progress counter calculated from todo list
- **Local Component State**: Each component manages its own UI state

### Form Handling
- **Controlled Components**: Form inputs controlled by React state
- **Validation**: Basic validation (title required)
- **Modal Presentation**: Form presented as modal for better UX

## Styling Strategy

### StyleSheet Organization
- **Component-level Styles**: Each component has its own StyleSheet
- **Consistent Spacing**: Using 8px, 12px, 16px increments
- **Color Palette**: iOS-style colors (#007AFF blue, #FF3B30 red)
- **Responsive Design**: Using flex layout for different screen sizes

### Visual Hierarchy
- **Typography**: Different font sizes and weights for hierarchy
- **Colors**: Semantic colors (blue for primary actions, red for destructive)
- **Shadows**: Subtle shadows for depth and card-like appearance
- **States**: Visual feedback for completed todos (strikethrough, opacity)

## Future Architecture Considerations

### Navigation (Planned)
- React Navigation for screen transitions
- Tab navigation for Todo/Schedule views
- Stack navigation for detail screens

### Data Persistence (Planned)
- AsyncStorage for simple key-value storage
- Consider SQLite for complex queries
- Data migration strategies

### State Management Scaling (Planned)
- Context API for global state
- Consider Redux Toolkit for complex state
- Custom hooks for state logic reuse