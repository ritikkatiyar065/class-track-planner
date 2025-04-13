
import { TodoItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';

export const mockTodos: TodoItem[] = [
  {
    id: uuidv4(),
    title: 'Complete Math Assignment',
    description: 'Exercises 5-10 from Chapter 3',
    dueDate: addDays(new Date(), 2),
    subjectId: 'math101', // This should match with one of your subject IDs
    completed: false,
    createdAt: new Date(),
    priority: 'high',
    category: 'assignment'
  },
  {
    id: uuidv4(),
    title: 'Study for Physics Test',
    description: 'Focus on thermodynamics and wave theory',
    dueDate: addDays(new Date(), 5),
    subjectId: 'phys101', // This should match with one of your subject IDs
    completed: false,
    createdAt: new Date(),
    priority: 'medium',
    category: 'test'
  },
  {
    id: uuidv4(),
    title: 'Submit Lab Report',
    description: 'Chemistry lab experiment on titration',
    dueDate: addDays(new Date(), 1),
    subjectId: 'chem101', // This should match with one of your subject IDs
    completed: false,
    createdAt: new Date(),
    priority: 'high',
    category: 'assignment'
  },
  {
    id: uuidv4(),
    title: 'Register for Next Semester',
    description: 'Choose electives for the upcoming semester',
    dueDate: addDays(new Date(), 10),
    completed: false,
    createdAt: new Date(),
    priority: 'medium',
    category: 'reminder'
  }
];
