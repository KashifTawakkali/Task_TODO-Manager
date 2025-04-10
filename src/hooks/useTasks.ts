import { useState, useEffect } from 'react';
import { Task, Category, CategoryFilter, Priority, SortOption } from '../types';
import { toast } from '../components/ui/use-toast';

export const useTasks = () => {
  // Initialize state from localStorage or with empty array
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');

  // Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (title: string, category: Category, dueDate?: number, priority: Priority = 'medium', description?: string) => {
    const newTask: Task = {
      id: Date.now().toString(), // Simple ID generation
      title,
      category,
      completed: false,
      createdAt: Date.now(),
      dueDate,
      priority,
      description,
    };
    
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    toast({
      title: "Task added",
      description: `"${title}" has been added to your tasks.`,
    });
  };

  // Edit an existing task
  const editTask = (
    id: string, 
    updates: {
      title?: string;
      category?: Category;
      dueDate?: number | undefined;
      priority?: Priority;
      description?: string;
    }
  ) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      );
      
      // Find the task that was edited
      const editedTask = updatedTasks.find(task => task.id === id);
      
      if (editedTask) {
        // Show a toast notification for the edit
        toast({
          title: "Task updated",
          description: `"${editedTask.title}" has been updated.`,
        });
      }
      
      return updatedTasks;
    });
  };

  // Toggle task completion status
  const toggleTask = (id: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      // Find the task that was toggled
      const toggledTask = updatedTasks.find(task => task.id === id);
      
      if (toggledTask) {
        // Show a toast notification based on completion status
        toast({
          title: toggledTask.completed ? "Task completed" : "Task reopened",
          description: `"${toggledTask.title}" has been ${toggledTask.completed ? 'marked as complete' : 'reopened'}.`,
        });
      }
      
      return updatedTasks;
    });
  };

  // Delete a task
  const deleteTask = (id: string) => {
    // Find the task before deleting it
    const taskToDelete = tasks.find(task => task.id === id);
    
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => task.id !== id);
      
      // Show toast notification
      if (taskToDelete) {
        toast({
          title: "Task deleted",
          description: `"${taskToDelete.title}" has been removed.`,
          variant: "destructive",
        });
      }
      
      return newTasks;
    });
  };

  // Export tasks to JSON file
  const exportTasks = () => {
    // Create a JSON blob from tasks data
    const tasksJson = JSON.stringify(tasks, null, 2);
    const blob = new Blob([tasksJson], { type: 'application/json' });
    
    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Tasks exported",
      description: `${tasks.length} tasks have been exported as JSON.`,
    });
  };

  // Import tasks from JSON file
  const importTasks = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedTasks = JSON.parse(content) as Task[];
        
        if (!Array.isArray(importedTasks)) {
          throw new Error('Invalid format: Imported data is not an array');
        }
        
        // Simple validation of the imported data
        const isValid = importedTasks.every(task => 
          typeof task === 'object' &&
          typeof task.id === 'string' &&
          typeof task.title === 'string' &&
          (task.category === 'work' || task.category === 'personal' || task.category === 'urgent') &&
          typeof task.completed === 'boolean' &&
          typeof task.createdAt === 'number'
        );
        
        if (!isValid) {
          throw new Error('Invalid format: Some tasks are missing required properties');
        }
        
        // Replace current tasks with imported ones
        setTasks(importedTasks);
        
        toast({
          title: "Tasks imported",
          description: `${importedTasks.length} tasks have been imported.`,
        });
        
      } catch (error) {
        toast({
          title: "Import failed",
          description: `Failed to import tasks: ${error instanceof Error ? error.message : 'Invalid format'}`,
          variant: "destructive",
        });
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Import failed",
        description: "Failed to read the file.",
        variant: "destructive",
      });
    };
    
    reader.readAsText(file);
  };

  // Filter and sort tasks
  const getFilteredAndSortedTasks = () => {
    // First apply the category filter
    let result = tasks.filter((task) => {
      if (filter === 'all') return true;
      return task.category === filter;
    });

    // Then apply the search filter if there's a search term
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(lowerSearchTerm) || 
        (task.description && task.description.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Finally sort the tasks
    return result.sort((a, b) => {
      switch (sortOption) {
        case 'dueDate':
          // Put tasks without due dates at the end
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate - b.dueDate;
        
        case 'priority':
          const priorityWeight = { high: 0, medium: 1, low: 2 };
          return priorityWeight[a.priority] - priorityWeight[b.priority];
        
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        
        case 'createdAt':
        default:
          return b.createdAt - a.createdAt; // Newest first
      }
    });
  };

  // Get filtered and sorted tasks
  const filteredTasks = getFilteredAndSortedTasks();

  return {
    tasks,
    filteredTasks,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    exportTasks,
    importTasks
  };
};
