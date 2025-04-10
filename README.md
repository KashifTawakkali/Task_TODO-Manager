
# Task Compass - Todo Manager App

A clean, responsive and beautiful todo management application with category filters, local storage persistence, and dark mode support.

## Features

- Add tasks with title, category, due date, and priority level
- Toggle task completion
- Delete tasks
- Filter tasks by category
- Search tasks by title
- Sort tasks by creation date, due date, priority, or alphabetically
- Visual indicators for due dates and priorities
- Dark/Light mode toggle
- Responsive design for all screen sizes
- Local storage persistence
- Clean animations and transitions
- Toast notifications for user actions

## Technologies Used

- React with TypeScript
- React Hooks (useState, useEffect, useContext)
- Custom hooks for task management
- Tailwind CSS for styling
- shadcn/ui component library
- Lucide React for icons
- date-fns for date formatting

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install -f
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## How It Works

### Custom Hook: useTasks

The `useTasks` hook provides the following functionality:

- Task management (add, toggle completion, delete)
- Category filtering
- Search functionality
- Sorting options
- Local storage persistence

### Context API

The app uses two context providers:

- `TaskContext` - For sharing task state across components
- `ThemeContext` - For managing dark/light mode preference

### Component Structure

- **TaskForm** - For adding new tasks with title, category, due date, and priority
- **TaskList** - Displays the list of tasks
- **TaskItem** - Individual task component with visual indicators
- **CategoryFilter** - For filtering tasks by category
- **SearchBar** - For searching tasks by title
- **SortOptions** - For sorting tasks by different criteria
- **ThemeToggle** - For toggling between dark and light mode

