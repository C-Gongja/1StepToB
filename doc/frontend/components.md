# Component Documentation

## TodoItem Component

### Purpose
Displays an individual todo item with interactive elements for completion, editing, and deletion.

### Props
```typescript
interface TodoItemProps {
  todo: Todo;                           // The todo item to display
  onToggleComplete: (id: string) => void; // Callback when checkbox is pressed
  onEdit: (todo: Todo) => void;         // Callback when edit button is pressed
  onDelete: (id: string) => void;       // Callback when delete button is pressed
}
```

### Features
- **Checkbox**: Visual indicator and toggle for completion status
- **Content Display**: Shows title and optional description
- **Visual States**: Strikethrough and opacity changes for completed todos
- **Action Buttons**: Edit and delete buttons with appropriate styling
- **Delete Confirmation**: Alert dialog to confirm deletion

### Styling
- Card-like appearance with shadow
- Responsive layout using flexbox
- Color-coded action buttons (blue for edit, red for delete)
- Accessibility-friendly touch targets

---

## TodoForm Component

### Purpose
Modal form for adding new todos or editing existing ones.

### Props
```typescript
interface TodoFormProps {
  visible: boolean;          // Controls modal visibility
  onClose: () => void;       // Callback when form is closed
  onSubmit: (data: TodoFormData) => void; // Callback when form is submitted
  editingTodo?: Todo;        // Optional todo to edit (undefined for new todo)
}
```

### Features
- **Modal Presentation**: Full-screen modal with slide animation
- **Form Fields**: Title (required) and description (optional) inputs
- **Auto-population**: Pre-fills form when editing existing todo
- **Form Validation**: Ensures title is not empty
- **Navigation**: Cancel and save buttons in header

### Behavior
- **New Todo Mode**: Empty form for creating new todos
- **Edit Mode**: Pre-populated form when `editingTodo` prop is provided
- **Form Reset**: Clears form on close or successful submission
- **Keyboard Handling**: Auto-focus on title field when opened

### Styling
- iOS-style modal presentation
- Clean form layout with proper spacing
- Semantic button colors (red for cancel, blue for save)
- Multi-line text area for description

---

## TodoScreen Component (In Progress)

### Purpose
Main screen that orchestrates the todo list functionality.

### State Management
```typescript
const [todos, setTodos] = useState<Todo[]>([]);           // List of todos
const [showForm, setShowForm] = useState(false);         // Form visibility
const [editingTodo, setEditingTodo] = useState<Todo | undefined>(); // Todo being edited
```

### Features (Planned)
- **Todo List Display**: FlatList showing all todos
- **Progress Tracking**: Shows completion count
- **Add Functionality**: Button to open form for new todos
- **Edit Functionality**: Handles editing existing todos
- **Delete Functionality**: Removes todos from list
- **Toggle Completion**: Marks todos as complete/incomplete
- **Empty State**: Friendly message when no todos exist

### Methods (Planned)
- `addTodo(data: TodoFormData)`: Creates new todo
- `updateTodo(data: TodoFormData)`: Updates existing todo
- `toggleComplete(id: string)`: Toggles completion status
- `deleteTodo(id: string)`: Removes todo from list
- `handleEdit(todo: Todo)`: Opens form in edit mode

### Layout Structure
```
SafeAreaView
├── Header
│   ├── Title ("My Todos")
│   ├── Progress Counter
│   └── Add Button
├── Content Area
│   ├── Todo List (FlatList)
│   └── Empty State (when no todos)
└── TodoForm Modal
```

## Shared Patterns

### Error Handling
- Alert dialogs for destructive actions
- Form validation with user feedback
- Graceful degradation for edge cases

### Accessibility
- Proper touch target sizes (minimum 44px)
- Semantic text labels
- Screen reader friendly content

### Performance
- FlatList for efficient list rendering
- Immutable state updates
- Optimized re-renders with proper key props

### TypeScript Integration
- Strict type checking for all props
- Interface definitions for all data structures
- Type-safe event handlers