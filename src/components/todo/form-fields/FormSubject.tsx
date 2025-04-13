
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Subject } from "@/types";
import { UseFormReturn } from "react-hook-form";

interface FormSubjectProps {
  form: UseFormReturn<any>;
  subjects: Subject[];
}

const FormSubject: React.FC<FormSubjectProps> = ({ form, subjects }) => {
  return (
    <FormField
      control={form.control}
      name="subjectId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Subject (Optional)</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="">General (No subject)</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSubject;
