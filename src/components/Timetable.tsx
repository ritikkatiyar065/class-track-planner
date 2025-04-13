
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimetableSlot, Subject } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Edit, Plus, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

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

const Timetable = ({ timetable: initialTimetable, subjects }: TimetableProps) => {
  const [selectedDay, setSelectedDay] = useState<string>("1"); // Monday by default
  const [timetable, setTimetable] = useState<TimetableSlot[]>(initialTimetable);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [newSlot, setNewSlot] = useState<Partial<TimetableSlot>>({
    dayOfWeek: parseInt(selectedDay),
    startTime: "09:00",
    endTime: "10:30"
  });
  
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
  
  const handleEditClick = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setNewSlot({
      ...slot
    });
  };
  
  const handleDeleteSlot = (slotId: string) => {
    setTimetable(timetable.filter(slot => slot.id !== slotId));
    toast("Class slot removed from timetable");
  };
  
  const handleAddSlot = () => {
    if (!newSlot.subjectId) {
      toast("Please select a subject");
      return;
    }
    
    const slot: TimetableSlot = {
      id: crypto.randomUUID(),
      subjectId: newSlot.subjectId || subjects[0].id,
      dayOfWeek: newSlot.dayOfWeek || parseInt(selectedDay),
      startTime: newSlot.startTime || "09:00",
      endTime: newSlot.endTime || "10:30",
      room: newSlot.room || "Room 101"
    };
    
    if (editingSlot) {
      // Update existing slot
      setTimetable(timetable.map(s => s.id === editingSlot.id ? slot : s));
      toast("Timetable slot updated");
    } else {
      // Add new slot
      setTimetable([...timetable, slot]);
      toast("New class added to timetable");
    }
    
    setShowAddDialog(false);
    setEditingSlot(null);
    setNewSlot({
      dayOfWeek: parseInt(selectedDay),
      startTime: "09:00",
      endTime: "10:30"
    });
  };
  
  const openAddDialog = (dayOfWeek: number) => {
    setNewSlot({
      dayOfWeek,
      startTime: "09:00",
      endTime: "10:30"
    });
    setShowAddDialog(true);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Weekly Timetable</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Done Editing
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit Timetable
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedDay} onValueChange={setSelectedDay} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            {[1, 2, 3, 4, 5].map(day => (
              <TabsTrigger 
                key={day} 
                value={day.toString()}
                className={cn(
                  day.toString() === today && "relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                )}
              >
                <span className="hidden sm:inline">{daysOfWeek[day]}</span>
                <span className="sm:hidden">{daysOfWeek[day].substring(0, 3)}</span>
                {day.toString() === today && (
                  <Badge variant="outline" className="ml-1.5 text-xs py-0">Today</Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {[1, 2, 3, 4, 5].map(day => (
            <TabsContent key={day} value={day.toString()} className="space-y-4">
              {isEditing && (
                <div className="flex justify-end mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openAddDialog(day)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Class
                  </Button>
                </div>
              )}
              
              {timetableByDay[day.toString()]?.length > 0 ? (
                timetableByDay[day.toString()].map((slot) => {
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
                        
                        {isEditing && (
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditClick(slot)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteSlot(slot.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
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
                  <p>No classes scheduled for {daysOfWeek[day]}</p>
                  {isEditing && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => openAddDialog(day)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Class
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <Dialog open={showAddDialog || !!editingSlot} onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEditingSlot(null);
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingSlot ? "Edit Class" : "Add New Class"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Subject</label>
                <Select 
                  value={newSlot.subjectId} 
                  onValueChange={(value) => setNewSlot({...newSlot, subjectId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Day</label>
                <Select 
                  value={newSlot.dayOfWeek?.toString()} 
                  onValueChange={(value) => setNewSlot({...newSlot, dayOfWeek: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        {daysOfWeek[day]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input 
                    type="time" 
                    value={newSlot.startTime} 
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">End Time</label>
                  <Input 
                    type="time" 
                    value={newSlot.endTime} 
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Room</label>
                <Input 
                  value={newSlot.room || ''} 
                  onChange={(e) => setNewSlot({...newSlot, room: e.target.value})}
                  placeholder="e.g. Room 101"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setEditingSlot(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddSlot}>
                {editingSlot ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Timetable;
