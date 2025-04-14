import React, { useState } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import TodoList from '@/components/todo/TodoList';
import AddTodoForm from '@/components/todo/AddTodoForm';
import TodoFilters from '@/components/todo/TodoFilters';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListTodo, CheckSquare, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TodoNotification from '@/components/todo/TodoNotification';

const TodoPage = () => {
  const { todos, filteredTodos } = useTodo();
  const [showAddForm, setShowAddForm] = useState(false);

  // Count completed and overdue tasks
  const completedCount = todos.filter(todo => todo.completed).length;
  const overdueCount = todos.filter(todo => 
    !todo.completed && 
    todo.dueDate && 
    new Date(todo.dueDate) < new Date()
  ).length;
  const completionRate = todos.length > 0 
    ? Math.round((completedCount / todos.length) * 100) 
    : 0;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">To-Do List</h1>
          <p className="text-muted-foreground">Manage your academic tasks and stay organized</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <TodoNotification />
      
      {showAddForm && (
        <div className="mb-8">
          <AddTodoForm 
            onAdd={() => setShowAddForm(false)} 
            onCancel={() => setShowAddForm(false)} 
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end space-x-1">
              <div className="text-2xl font-bold">{todos.length}</div>
              <div className="text-muted-foreground text-sm pb-0.5">tasks</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <ListTodo className="h-3 w-3 inline mr-1" />
              {todos.length > 0 ? "Manage all your academic tasks" : "Add tasks to stay organized"}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              <CheckSquare className="h-3 w-3 inline mr-1" />
              {completedCount} of {todos.length} tasks completed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {overdueCount === 0 ? (
                <span className="text-success flex items-center">
                  <CheckSquare className="h-3 w-3 inline mr-1" />
                  No overdue tasks
                </span>
              ) : (
                <span className="text-destructive flex items-center">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  {overdueCount} overdue {overdueCount === 1 ? 'task' : 'tasks'}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <TodoFilters />
      </div>
      
      <TodoList 
        todos={filteredTodos} 
        onAddNewClick={() => setShowAddForm(true)}
      />
      
      {filteredTodos.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            {todos.length > 0 
              ? "Try adjusting your filters to see more tasks" 
              : "Add your first task to get started"}
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
