
import React from 'react';
import { TodoItem } from '@/types';
import { useTodo } from '@/contexts/TodoContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Import form field components
import FormTitle from './form-fields/FormTitle';
import FormDescription from './form-fields/FormDescription';
import FormDueDate from './form-fields/FormDueDate';
import FormSubject from './form-fields/FormSubject';
import FormPriority from './form-fields/FormPriority';
import FormCategory from './form-fields/FormCategory';
import FormCompletionCheckbox from './form-fields/FormCompletionCheckbox';

interface TodoEditDialogProps {
  todo: TodoItem;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  subjectId: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.enum(['assignment', 'test', 'reminder', 'other']),
  completed: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const TodoEditDialog: React.FC<TodoEditDialogProps> = ({ todo }) => {
  const { updateTodo, subjects } = useTodo();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || '',
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      subjectId: todo.subjectId || '',
      priority: todo.priority,
      category: todo.category,
      completed: todo.completed,
    }
  });

  const onSubmit = (values: FormValues) => {
    updateTodo(todo.id, values);
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogDescription>
          Update the details of your task. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormTitle form={form} />
          <FormDescription form={form} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormDueDate form={form} />
            <FormSubject form={form} subjects={subjects} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormPriority form={form} />
            <FormCategory form={form} />
          </div>
          
          <FormCompletionCheckbox form={form} />
          
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default TodoEditDialog;
