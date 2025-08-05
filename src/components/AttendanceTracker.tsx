
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Plus, Check, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ClassSession, Subject } from "@/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AttendanceTrackerProps {
  subject: Subject;
  onAttendanceUpdate: (attended: boolean) => void;
}

const AttendanceTracker = ({ subject, onAttendanceUpdate }: AttendanceTrackerProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [attended, setAttended] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAttendanceSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to record attendance",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Insert attendance log
      const { error } = await supabase
        .from('attendance_logs')
        .insert({
          user_id: user.id,
          subject_id: subject.id,
          date: format(date, 'yyyy-MM-dd'),
          status: attended ? 'attended' : 'missed',
        });

      if (error) throw error;

      // Call the original update function for UI state
      onAttendanceUpdate(attended);
      
      toast({
        title: "Attendance recorded!",
        description: `Marked as ${attended ? 'present' : 'absent'} for ${subject.name} on ${format(date, 'PPP')}`,
      });
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Mark Attendance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="attended">Did you attend?</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="attended"
                checked={attended}
                onCheckedChange={setAttended}
              />
              <span>{attended ? 
                <Check className="h-4 w-4 text-success" /> : 
                <X className="h-4 w-4 text-destructive" />}
              </span>
            </div>
          </div>
        </div>
        
        <Button onClick={handleAttendanceSubmit} className="w-full" disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Attendance"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker;
