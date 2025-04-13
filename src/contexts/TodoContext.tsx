
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TodoItem, TodoFilter, Subject } from '@/types';
import { mockTodos } from '@/data/mockTodos';
import { v4 as uuidv4 } from 'uuid';
import { mockSubjects } from '@/data/mockData';
import { toast } from 'sonner';

interface TodoContextType {
  todos: TodoItem[];
  filteredTodos: TodoItem[];
  filters: TodoFilter;
  addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  setFilters: (filters: TodoFilter) => void;
  clearFilters: () => void;
  getSubjectName: (subjectId?: string) => string;
  getSubjectColor: (subjectId?: string) => string;
  subjects: Subject[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [filters, setFilters] = useState<TodoFilter>({});
  const [subjects] = useState<Subject[]>(mockSubjects);

  // Apply filters to todos
  const filteredTodos = todos.filter(todo => {
    if (filters.subjectId && todo.subjectId !== filters.subjectId) return false;
    if (filters.priority && todo.priority !== filters.priority) return false;
    if (filters.category && todo.category !== filters.category) return false;
    if (filters.completed !== undefined && todo.completed !== filters.completed) return false;
    return true;
  });

  const addTodo = (todo: Omit<TodoItem, 'id' | 'createdAt'>) => {
    const newTodo = {
      ...todo,
      id: uuidv4(),
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
    toast.success('Task added successfully');
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
    toast.success('Task updated successfully');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.success('Task deleted successfully');
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    const todo = todos.find(t => t.id === id);
    if (todo) {
      toast(todo.completed ? 'Task marked as incomplete' : 'Task completed! 🎉');
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getSubjectName = (subjectId?: string) => {
    if (!subjectId) return 'General';
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const getSubjectColor = (subjectId?: string) => {
    if (!subjectId) return '#6E59A5'; // Default color
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#6E59A5';
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        filters,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        setFilters,
        clearFilters,
        getSubjectName,
        getSubjectColor,
        subjects,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
