
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

interface AttendanceTrackerProps {
  subject: Subject;
  onAttendanceUpdate: (attended: boolean) => void;
}

const AttendanceTracker = ({ subject, onAttendanceUpdate }: AttendanceTrackerProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [attended, setAttended] = useState(true);
  const { toast } = useToast();

  const handleAttendanceSubmit = () => {
    onAttendanceUpdate(attended);
    toast({
      title: "Attendance recorded!",
      description: `Marked as ${attended ? 'present' : 'absent'} for ${subject.name} on ${format(date, 'PPP')}`,
    });
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
        
        <Button onClick={handleAttendanceSubmit} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Save Attendance
        </Button>
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker;
