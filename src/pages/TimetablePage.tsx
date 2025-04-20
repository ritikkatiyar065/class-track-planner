
import { mockSubjects, mockTimetable } from "@/data/mockData";
import Timetable from "@/components/Timetable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, BellOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const TimetablePage = () => {
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState(mockTimetable);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("15");
  
  const handleToggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    toast.success(newState 
      ? "Class notifications enabled" 
      : "Class notifications disabled");
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Button onClick={() => navigate('/dashboard')} variant="outline" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Class Timetable</h1>
        <p className="text-muted-foreground">View and customize your weekly class schedule</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              {notificationsEnabled ? (
                <Bell className="mr-2 h-5 w-5 text-primary" />
              ) : (
                <BellOff className="mr-2 h-5 w-5 text-muted-foreground" />
              )}
              Notifications
            </CardTitle>
            <CardDescription>Configure attendance reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex flex-col gap-1">
                <span>Class Reminders</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Get notified about upcoming classes
                </span>
              </Label>
              <Switch 
                id="notifications" 
                checked={notificationsEnabled}
                onCheckedChange={handleToggleNotifications}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Remind me</Label>
              <Select 
                disabled={!notificationsEnabled}
                value={reminderTime} 
                onValueChange={setReminderTime}
              >
                <SelectTrigger id="reminder-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes before class</SelectItem>
                  <SelectItem value="10">10 minutes before class</SelectItem>
                  <SelectItem value="15">15 minutes before class</SelectItem>
                  <SelectItem value="30">30 minutes before class</SelectItem>
                  <SelectItem value="60">1 hour before class</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full"
                disabled={!notificationsEnabled}
                onClick={() => toast.success(`Reminder preferences updated`)}
              >
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
            <CardDescription>Make the most of your class reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded">1</div>
                <p>Add your regular classes to the timetable below</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded">2</div>
                <p>Enable notifications to get reminders before each class</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded">3</div>
                <p>When notified, confirm if you attended the class with a single tap</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded">4</div>
                <p>Your attendance will be automatically tracked and updated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Timetable timetable={timetable} subjects={mockSubjects} />
    </div>
  );
};

export default TimetablePage;
