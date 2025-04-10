import React, { useState } from 'react';
import { Category, Priority } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { format } from 'date-fns';
import { PlusCircle, Calendar as CalendarIcon, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface TaskFormProps {
  onAddTask: (title: string, category: Category, dueDate?: number, priority?: Priority, description?: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('work');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>('medium');
  const [description, setDescription] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    onAddTask(
      title.trim(), 
      category, 
      date ? date.getTime() : undefined,
      priority,
      description.trim() || undefined
    );
    
    // Reset form
    setTitle('');
    setDate(undefined);
    setPriority('medium');
    setDescription('');
    setIsDetailsOpen(false);
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm bg-card">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as Category)}
          >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Collapsible
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          className="space-y-3 sm:space-y-4"
        >
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="flex w-full justify-center text-xs sm:text-sm text-muted-foreground"
            >
              {isDetailsOpen ? (
                <span className="flex items-center gap-1">
                  Hide details <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  Show More <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 sm:space-y-4">
            <Textarea 
              placeholder="Add description..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
              <div className="flex flex-1 gap-2 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs sm:text-sm",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      {date ? format(date, 'PPP') : <span>Set due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                {date && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setDate(undefined)}
                    type="button"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                  >
                    ✕
                  </Button>
                )}
              </div>
              
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as Priority)}
              >
                <SelectTrigger className="w-full sm:w-32 h-9 sm:h-10 text-xs sm:text-sm">
                  <Flag className={`mr-2 h-3 w-3 sm:h-4 sm:w-4 ${getPriorityColor()}`} />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center">
                      <Flag className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                      <span>High</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center">
                      <Flag className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center">
                      <Flag className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      <span>Low</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button type="submit" className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
          <PlusCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Add Task
        </Button>
      </form>
    </Card>
  );
};

export default TaskForm;
