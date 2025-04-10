
export type Category = 'work' | 'personal' | 'urgent';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
  createdAt: number; // timestamp
  dueDate?: number; // timestamp (optional)
  priority: Priority;
  description?: string; // optional description field
}

export type CategoryFilter = Category | 'all';
export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'alphabetical';

export interface TasksContextType {
  tasks: Task[];
  addTask: (title: string, category: Category, dueDate?: number, priority?: Priority, description?: string) => void;
  editTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  filteredTasks: Task[];
  filter: CategoryFilter;
  setFilter: (filter: CategoryFilter) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  exportTasks: () => void;
  importTasks: (file: File) => void;
}
