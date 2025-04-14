
import React from 'react';
import { TodoItem } from '@/types';
import { useTodo } from '@/contexts/TodoContext';
import { format, isPast, isTomorrow, isToday } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Calendar, AlertTriangle, CheckSquare, PlusCircle, ListTodo } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import TodoEditDialog from './TodoEditDialog';

interface TodoListProps {
  todos: TodoItem[];
  onAddNewClick?: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onAddNewClick }) => {
  const { toggleComplete, deleteTodo, getSubjectName, getSubjectColor } = useTodo();

  // Only show active (non-completed) tasks
  const activeTasks = todos.filter(todo => !todo.completed);

  const getPriorityColorClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'assignment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'test': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reminder': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getDateStatus = (date?: Date) => {
    if (!date) return null;
    
    const dateObj = new Date(date);
    
    if (isPast(dateObj) && !isToday(dateObj)) {
      return { status: 'overdue', label: 'Overdue', className: 'text-destructive' };
    }
    if (isToday(dateObj)) {
      return { status: 'today', label: 'Today', className: 'text-amber-600' };
    }
    if (isTomorrow(dateObj)) {
      return { status: 'tomorrow', label: 'Tomorrow', className: 'text-amber-500' };
    }
    
    return { status: 'upcoming', label: format(dateObj, 'MMM d, yyyy'), className: 'text-muted-foreground' };
  };

  const renderTodoItem = (todo: TodoItem) => {
    const dateStatus = getDateStatus(todo.dueDate);
    
    return (
      <Card 
        key={todo.id} 
        className="transition-all hover:shadow"
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="pt-1">
              <Checkbox 
                checked={todo.completed}
                onCheckedChange={() => toggleComplete(todo.id)}
                className="rounded-full"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-medium truncate">
                  {todo.title}
                </h3>
                
                {todo.subjectId && (
                  <Badge 
                    style={{ backgroundColor: getSubjectColor(todo.subjectId) + '20', 
                            color: getSubjectColor(todo.subjectId),
                            borderColor: getSubjectColor(todo.subjectId) + '40' }}
                    className="border"
                  >
                    {getSubjectName(todo.subjectId)}
                  </Badge>
                )}
              </div>
              
              {todo.description && (
                <p className="text-sm text-muted-foreground">
                  {todo.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className={getPriorityColorClass(todo.priority)}>
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                </Badge>
                
                <Badge variant="outline" className={getCategoryColorClass(todo.category)}>
                  {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
                </Badge>
                
                {todo.dueDate && dateStatus && (
                  <div className={`text-xs flex items-center gap-1 ${dateStatus.className}`}>
                    <Calendar className="h-3 w-3" />
                    <span>{dateStatus.label}</span>
                    {dateStatus.status === 'overdue' && (
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </DialogTrigger>
                <TodoEditDialog todo={todo} />
              </Dialog>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteTodo(todo.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // If there are no tasks at all
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg">No tasks found</h3>
        <p className="text-muted-foreground mb-4">Add your first task to get started</p>
        <Button onClick={onAddNewClick}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    );
  }

  // If there are tasks, but all are completed
  if (activeTasks.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <h3 className="text-xl font-semibold">Hustlers don't stop! 💪</h3>
        <p className="text-muted-foreground">All tasks completed. Ready for more challenges?</p>
        <Button onClick={onAddNewClick}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add more tasks
        </Button>
      </div>
    );
  }

  // If there are active tasks
  return (
    <div className="space-y-3">
      {activeTasks.map(renderTodoItem)}
    </div>
  );
};

export default TodoList;
