import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { ArrowDownUp } from 'lucide-react';
import { SortOption } from '../types';

interface SortOptionsProps {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortOption, setSortOption }) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4 w-full sm:w-auto">
      <ArrowDownUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
      <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
        <SelectTrigger className="w-full sm:w-40 md:w-48 h-8 sm:h-10 text-xs sm:text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="text-xs sm:text-sm">
          <SelectItem value="createdAt">Date created</SelectItem>
          <SelectItem value="dueDate">Due date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="alphabetical">Alphabetical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortOptions;
