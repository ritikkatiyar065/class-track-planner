
import React from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  FilterX, 
  Flag, 
  Tag 
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const TodoFilters = () => {
  const { filters, setFilters, clearFilters, subjects } = useTodo();
  const [open, setOpen] = React.useState(false);

  return (
    <Card className="p-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-medium">Filter Tasks</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters} 
              className="h-8"
              disabled={!filters.subjectId && !filters.priority && !filters.category && filters.completed === undefined}
            >
              <FilterX className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
            
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {open ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <Label>Subject</Label>
              </div>
              
              <Select 
                value={filters.subjectId || ''} 
                onValueChange={(value) => setFilters({ ...filters, subjectId: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <Label>Priority</Label>
              </div>
              
              <Select 
                value={filters.priority || ''} 
                onValueChange={(value) => setFilters({ ...filters, priority: value as any || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Label>Category</Label>
              </div>
              
              <Select 
                value={filters.category || ''} 
                onValueChange={(value) => setFilters({ ...filters, category: value as any || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <Label>Status</Label>
              </div>
              
              <RadioGroup 
                value={filters.completed === undefined ? 'all' : filters.completed ? 'completed' : 'pending'} 
                onValueChange={(value) => {
                  let completedFilter;
                  if (value === 'all') completedFilter = undefined;
                  else if (value === 'completed') completedFilter = true;
                  else completedFilter = false;
                  
                  setFilters({ ...filters, completed: completedFilter });
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending">Pending</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completed" id="completed" />
                  <Label htmlFor="completed">Completed</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TodoFilters;
