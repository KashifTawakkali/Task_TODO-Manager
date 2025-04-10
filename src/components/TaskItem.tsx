import React, { useState } from 'react';
import { Task, Category, Priority } from '../types';
import { cn } from '../lib/utils';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Trash2, CheckCircle, Circle, Flag, Calendar, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarPicker } from './ui/calendar';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedCategory, setEditedCategory] = useState<Category>(task.category);
  const [editedDate, setEditedDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [editedPriority, setEditedPriority] = useState<Priority>(task.priority);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  
  const getCategoryClass = () => {
    switch (task.category) {
      case 'work':
        return 'category-work';
      case 'personal':
        return 'category-personal';
      case 'urgent':
        return 'category-urgent';
      default:
        return '';
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const formatDueDate = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    
    if (isToday(dueDate)) {
      return "Today";
    } else if (isTomorrow(dueDate)) {
      return "Tomorrow";
    } else {
      return format(dueDate, 'MMM d');
    }
  };

  const getDueDateClass = () => {
    if (!task.dueDate) return '';
    
    const dueDate = new Date(task.dueDate);
    
    if (isPast(dueDate) && !task.completed) {
      return 'text-destructive';
    } else if (isToday(dueDate)) {
      return 'text-amber-500';
    }
    
    return '';
  };

  // Format priority text with proper capitalization
  const formatPriority = () => {
    if (!task.priority) return 'Unknown priority';
    return `${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority`;
  };

  // Check if there's additional content to show
  const hasAdditionalContent = Boolean(task.description) || Boolean(task.dueDate) || Boolean(task.priority);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: Partial<Task> = {
      title: editedTitle,
      category: editedCategory,
      dueDate: editedDate ? editedDate.getTime() : undefined,
      priority: editedPriority,
      description: editedDescription || undefined
    };
    
    onEdit(task.id, updates);
    setIsEditing(false);
  };

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn(
          "p-3 sm:p-4 border rounded-md mb-3 bg-card animate-slide-in",
          task.completed 
            ? "opacity-70 border-green-500 border-l-4" 
            : "border-red-500 border-l-4"
        )}
      >
        <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-transparent h-8 w-8 mt-0.5 sm:mt-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(task.id);
              }}
            >
              {task.completed ? (
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              )}
            </Button>
            <div>
              <p className={cn(
                "font-medium text-sm sm:text-base flex items-center gap-2", 
                task.completed ? "line-through text-muted-foreground" : ""
              )}>
                {task.title}
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2 items-center mt-1">
                <span className={cn("category-pill text-[10px] sm:text-xs", getCategoryClass())}>
                  {task.category}
                </span>
                <span className={cn(
                  "text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full", 
                  task.completed 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                )}>
                  {task.completed ? "Complete" : "Incomplete"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-auto sm:ml-0">
            {hasAdditionalContent && (
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-[10px] sm:text-xs h-7 sm:h-8 text-muted-foreground hover:text-foreground px-1.5 sm:px-3"
                >
                  {isOpen ? (
                    <span className="flex items-center gap-1">
                      See less <ChevronUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      See more <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </span>
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:text-primary h-7 w-7 sm:h-8 sm:w-8"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:text-destructive h-7 w-7 sm:h-8 sm:w-8"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        <CollapsibleContent className="pt-3 mt-3 border-t text-xs sm:text-sm text-left">
          {task.description && (
            <div className="mb-3 sm:mb-4">
              <h4 className="text-xs sm:text-sm font-medium mb-1">Description:</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-2 sm:mb-3">
            {task.dueDate && (
              <div>
                <h4 className="text-[10px] sm:text-xs font-medium mb-1">Due Date:</h4>
                <p className={cn("text-xs sm:text-sm flex items-center gap-1", getDueDateClass())}>
                  <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </p>
              </div>
            )}
            
            <div>
              <h4 className="text-[10px] sm:text-xs font-medium mb-1">Priority:</h4>
              <p className="text-xs sm:text-sm flex items-center gap-1">
                <Flag className={cn("h-2.5 w-2.5 sm:h-3 sm:w-3", getPriorityColor())} />
                {formatPriority()}
              </p>
            </div>
          </div>

          <div className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3">
            Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Edit Task Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="title" className="text-xs sm:text-sm font-medium">Title</label>
              <Input 
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="category" className="text-xs sm:text-sm font-medium">Category</label>
              <Select 
                value={editedCategory} 
                onValueChange={(value) => setEditedCategory(value as Category)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="description" className="text-xs sm:text-sm font-medium">Description</label>
              <Textarea 
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="min-h-[100px] text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium">Due Date</label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editedDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {editedDate ? format(editedDate, 'PPP') : <span>No due date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarPicker
                        mode="single"
                        selected={editedDate}
                        onSelect={setEditedDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {editedDate && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEditedDate(undefined)}
                      type="button"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-xs sm:text-sm font-medium">Priority</label>
                <Select 
                  value={editedPriority} 
                  onValueChange={(value) => setEditedPriority(value as Priority)}
                >
                  <SelectTrigger>
                    <Flag className={cn("mr-2 h-4 w-4", {
                      "text-red-500": editedPriority === 'high',
                      "text-amber-500": editedPriority === 'medium',
                      "text-green-500": editedPriority === 'low',
                    })} />
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      <div className="flex items-center">
                        <Flag className="mr-2 h-4 w-4 text-red-500" />
                        <span>High</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <Flag className="mr-2 h-4 w-4 text-amber-500" />
                        <span>Medium</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center">
                        <Flag className="mr-2 h-4 w-4 text-green-500" />
                        <span>Low</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskItem;
