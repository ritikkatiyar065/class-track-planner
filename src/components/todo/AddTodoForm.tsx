
import React from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

// Import form field components
import FormTitle from './form-fields/FormTitle';
import FormDescription from './form-fields/FormDescription';
import FormDueDate from './form-fields/FormDueDate';
import FormSubject from './form-fields/FormSubject';
import FormPriority from './form-fields/FormPriority';
import FormCategory from './form-fields/FormCategory';
import FormFooter from './form-fields/FormFooter';

interface AddTodoFormProps {
  onAdd: () => void;
  onCancel: () => void;
}

// Define form validation schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  subjectId: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.enum(['assignment', 'test', 'reminder', 'other']),
});

type FormValues = z.infer<typeof formSchema>;

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd, onCancel }) => {
  const { addTodo, subjects } = useTodo();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      category: 'assignment',
    }
  });

  const onSubmit = (values: FormValues) => {
    // Fix: Explicitly specify all required properties
    addTodo({
      ...values,
      title: values.title, // Explicitly include required fields
      priority: values.priority,
      category: values.category,
      completed: false,
    });
    onAdd();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          Add New Task
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={onCancel}
          >
            <XCircle className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            
            <FormFooter onCancel={onCancel} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddTodoForm;
