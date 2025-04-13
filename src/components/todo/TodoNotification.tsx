
import React, { useEffect, useState } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, XCircle } from 'lucide-react';
import { useFine } from '@/contexts/FineContext';
import { isPast, isToday } from 'date-fns';

const TodoNotification = () => {
  const { todos } = useTodo();
  const { overallShortfall } = useFine();
  const [showNotification, setShowNotification] = useState(true);
  
  // Find overdue high priority tasks
  const overdueHighPriorityTasks = todos.filter(todo => 
    !todo.completed && 
    todo.priority === 'high' && 
    todo.dueDate && 
    isPast(new Date(todo.dueDate)) &&
    !isToday(new Date(todo.dueDate))
  );
  
  // Check if there's a shortfall in attendance
  const hasAttendanceShortfall = !!overallShortfall && overallShortfall > 0;
  
  // Don't show if there's nothing to notify about
  if (!showNotification || (!overdueHighPriorityTasks.length && !hasAttendanceShortfall)) {
    return null;
  }
  
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <AlertDescription className="text-amber-900">
            {hasAttendanceShortfall && (
              <span className="font-semibold">
                ⚠️ Your attendance is below target by {overallShortfall}%. 
              </span>
            )}
            
            {overdueHighPriorityTasks.length > 0 && (
              <span className={hasAttendanceShortfall ? 'ml-1' : 'font-semibold'}>
                You have {overdueHighPriorityTasks.length} overdue high-priority {overdueHighPriorityTasks.length === 1 ? 'task' : 'tasks'} 
                that {overdueHighPriorityTasks.length === 1 ? 'requires' : 'require'} immediate attention.
              </span>
            )}
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-amber-500 hover:text-amber-600 hover:bg-amber-100 h-7 w-7 p-0"
          onClick={() => setShowNotification(false)}
        >
          <XCircle className="h-5 w-5" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </Alert>
  );
};

export default TodoNotification;
