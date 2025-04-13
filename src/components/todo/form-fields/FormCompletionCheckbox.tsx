
import React from 'react';
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface FormCompletionCheckboxProps {
  form: UseFormReturn<any>;
}

const FormCompletionCheckbox: React.FC<FormCompletionCheckboxProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="completed"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Mark as completed
            </label>
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormCompletionCheckbox;
