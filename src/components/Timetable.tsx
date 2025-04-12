
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimetableSlot, Subject } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimetableProps {
  timetable: TimetableSlot[];
  subjects: Subject[];
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const Timetable = ({ timetable, subjects }: TimetableProps) => {
  const [selectedDay, setSelectedDay] = useState<string>("1"); // Monday by default
  
  // Group timetable slots by day
  const timetableByDay = timetable.reduce((acc, slot) => {
    const day = slot.dayOfWeek.toString();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(slot);
    return acc;
  }, {} as Record<string, TimetableSlot[]>);
  
  // Sort slots by start time
  Object.keys(timetableByDay).forEach(day => {
    timetableByDay[day].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  });
  
  // Get current day
  const today = new Date().getDay().toString();
  
  // Filter out days with no classes
  const activeDays = Object.keys(timetableByDay).filter(day => timetableByDay[day].length > 0);
  
  const getSubjectById = (id: string): Subject | undefined => {
    return subjects.find(subj => subj.id === id);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedDay} onValueChange={setSelectedDay} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            {[1, 2, 3, 4, 5].map(day => (
              <TabsTrigger 
                key={day} 
                value={day.toString()}
                className={cn(
                  day.toString() === today && "relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primary",
                  !timetableByDay[day.toString()] && "opacity-50"
                )}
                disabled={!timetableByDay[day.toString()]}
              >
                <span className="hidden sm:inline">{daysOfWeek[day]}</span>
                <span className="sm:hidden">{daysOfWeek[day].substring(0, 3)}</span>
                {day.toString() === today && (
                  <Badge variant="outline" className="ml-1.5 text-xs py-0">Today</Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {activeDays.map(day => (
            <TabsContent key={day} value={day} className="space-y-4">
              {timetableByDay[day]?.length > 0 ? (
                timetableByDay[day].map((slot) => {
                  const subject = getSubjectById(slot.subjectId);
                  if (!subject) return null;
                  
                  return (
                    <div 
                      key={slot.id} 
                      className={cn(
                        "p-4 rounded-lg border animate-fade-in", 
                        subject.color ? subject.color : "bg-card"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">{subject.code}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-col space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        
                        {slot.room && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{slot.room}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No classes scheduled for {daysOfWeek[parseInt(day)]}</p>
                </div>
              )}
            </TabsContent>
          ))}
          
          {/* Display message for inactive days */}
          {[0, 6].map(day => (
            <TabsContent key={day} value={day.toString()} className="text-center py-8 text-muted-foreground">
              <p>No classes scheduled for {daysOfWeek[day]}</p>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Timetable;
