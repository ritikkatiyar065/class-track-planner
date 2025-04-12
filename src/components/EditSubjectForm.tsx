
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Subject } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomSubjectColor } from "@/utils/attendanceUtils";
import { useToast } from "@/hooks/use-toast";

interface EditSubjectFormProps {
  subject: Subject;
  onUpdateSubject: (updatedSubject: Subject) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Subject name must be at least 2 characters.",
  }),
  code: z.string().min(2, {
    message: "Subject code is required.",
  }),
  instructor: z.string().optional(),
  targetAttendance: z.number().min(50).max(100),
  totalClasses: z.number().min(1, {
    message: "Must have at least 1 class.",
  }),
  attendedClasses: z.number().min(0),
});

const EditSubjectForm = ({ subject, onUpdateSubject, onCancel }: EditSubjectFormProps) => {
  const [targetAttendance, setTargetAttendance] = useState<number>(subject.targetAttendance);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subject.name,
      code: subject.code,
      instructor: subject.instructor || "",
      targetAttendance: subject.targetAttendance,
      totalClasses: subject.totalClasses,
      attendedClasses: subject.attendedClasses,
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedSubject: Subject = {
      ...subject,
      name: values.name,
      code: values.code,
      instructor: values.instructor,
      targetAttendance: values.targetAttendance,
      currentAttendance: 
        values.totalClasses > 0 
          ? (values.attendedClasses / values.totalClasses) * 100 
          : 0,
      totalClasses: values.totalClasses,
      attendedClasses: values.attendedClasses,
    };
    
    onUpdateSubject(updatedSubject);
    toast({
      title: "Subject updated!",
      description: `${values.name} has been updated.`,
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Subject</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Data Structures" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code</FormLabel>
                    <FormControl>
                      <Input placeholder="CS201" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Prof. Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetAttendance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Attendance Percentage: {targetAttendance}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={50}
                      max={100}
                      step={5}
                      value={[field.value]}
                      onValueChange={(value) => {
                        field.onChange(value[0]);
                        setTargetAttendance(value[0]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum attendance requirement, usually 75%.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="totalClasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Classes</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="attendedClasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classes Attended</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        max={form.getValues("totalClasses")}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Update Subject
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditSubjectForm;
