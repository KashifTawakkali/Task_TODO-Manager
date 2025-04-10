import React, { useRef } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import CategoryFilter from '../components/CategoryFilter';
import ThemeToggle from '../components/ThemeToggle';
import SearchBar from '../components/SearchBar';
import SortOptions from '../components/SortOptions';
import { CategoryFilter as CategoryFilterType } from '../types';
import { CheckCircle, ListTodo, Download, Upload } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip';

const filterCategories = [
  { label: 'All', value: 'all' as CategoryFilterType },
  { label: 'Work', value: 'work' as CategoryFilterType },
  { label: 'Personal', value: 'personal' as CategoryFilterType },
  { label: 'Urgent', value: 'urgent' as CategoryFilterType },
];

const Index = () => {
  const { 
    addTask, 
    filter, 
    setFilter, 
    tasks, 
    searchTerm, 
    setSearchTerm, 
    sortOption, 
    setSortOption,
    exportTasks,
    importTasks
  } = useTaskContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      importTasks(e.target.files[0]);
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <header className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 mb-4">
            <div className="flex items-center">
              <ListTodo className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold">Task Compass</h1>
            </div>
            <div className="flex items-center gap-2 w-full xs:w-auto justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline" 
                      size="icon"
                      onClick={exportTasks}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export tasks as JSON</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={triggerFileInput}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Import tasks from JSON</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />

              <ThemeToggle />
            </div>
          </div>
          
          {totalTasksCount > 0 && (
            <Card className="p-2 sm:p-3 bg-primary/5 flex items-center">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
              <span className="text-xs sm:text-sm">
                {completedTasksCount} of {totalTasksCount} tasks completed
              </span>
            </Card>
          )}
        </header>
        
        <main>
          <TaskForm onAddTask={addTask} />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <CategoryFilter 
              currentFilter={filter}
              onFilterChange={setFilter}
              categories={filterCategories}
            />
            <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
          </div>
          
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <TaskList />
        </main>
      </div>
    </div>
  );
};

export default Index;
