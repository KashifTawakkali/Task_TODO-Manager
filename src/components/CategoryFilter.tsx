import React from 'react';
import { CategoryFilter as CategoryFilterType } from '../types';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface CategoryFilterProps {
  currentFilter: CategoryFilterType;
  onFilterChange: (filter: CategoryFilterType) => void;
  categories: Array<{ label: string; value: CategoryFilterType }>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  currentFilter, 
  onFilterChange,
  categories 
}) => {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 w-full sm:w-auto">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={currentFilter === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(category.value)}
          className={cn(
            "transition-all text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3",
            currentFilter === category.value && category.value === 'work' && "bg-blue-600",
            currentFilter === category.value && category.value === 'personal' && "bg-green-600",
            currentFilter === category.value && category.value === 'urgent' && "bg-orange-600"
          )}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
