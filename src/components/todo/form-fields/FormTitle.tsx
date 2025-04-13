
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Schema for the component's form values
const titleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
});

// Type for form values
type FormTitleValues = z.infer<typeof titleSchema>;

interface FormTitleProps {
  form: UseFormReturn<any>;
}

const FormTitle: React.FC<FormTitleProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Task Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter task title..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTitle;
