import React from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskItem from './TaskItem';
import { ListX, CheckCircle, Circle } from 'lucide-react';
import { Card } from './ui/card';

const TaskList = () => {
  const { filteredTasks, toggleTask, deleteTask, editTask } = useTaskContext();
  
  // Calculate complete and incomplete tasks count
  const completeTasks = filteredTasks.filter(task => task.completed);
  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  
  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md border-dashed">
        <ListX className="h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="font-medium text-lg mb-1">No tasks found</h3>
        <p className="text-muted-foreground">
          Add some tasks or try changing your filters.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 mt-6">
      {/* Task Status Summary */}
      <Card className="p-4 bg-card">
        <h3 className="text-sm font-medium mb-3">Task Status</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Complete</span>
            </div>
            <span className="font-medium text-green-500">{completeTasks.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Incomplete</span>
            </div>
            <span className="font-medium text-red-500">{incompleteTasks.length}</span>
          </div>
        </div>
      </Card>
      
      {filteredTasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onToggle={toggleTask} 
          onDelete={deleteTask}
          onEdit={editTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
