
import React, { createContext, useContext } from 'react';
import { TasksContextType } from '../types';
import { useTasks } from '../hooks/useTasks';

// Create the context
const TaskContext = createContext<TasksContextType | undefined>(undefined);

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tasks = useTasks();
  
  return <TaskContext.Provider value={tasks}>{children}</TaskContext.Provider>;
};

// Custom hook to use the task context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
