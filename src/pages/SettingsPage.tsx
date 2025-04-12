
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SettingsPage = () => {
  const [reminders, setReminders] = useState(true);
  const [lowAttendanceAlerts, setLowAttendanceAlerts] = useState(true);
  const [defaultTarget, setDefaultTarget] = useState<number[]>([75]);
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
      <p className="text-muted-foreground mb-6">Customize your app preferences</p>
      
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="daily-reminders" className="flex flex-col space-y-1">
                  <span>Daily Reminders</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get daily reminders to mark your attendance
                  </span>
                </Label>
                <Switch
                  id="daily-reminders"
                  checked={reminders}
                  onCheckedChange={setReminders}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="low-attendance" className="flex flex-col space-y-1">
                  <span>Low Attendance Alerts</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get notified when your attendance falls below the target
                  </span>
                </Label>
                <Switch
                  id="low-attendance"
                  checked={lowAttendanceAlerts}
                  onCheckedChange={setLowAttendanceAlerts}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="upcoming-classes" className="flex flex-col space-y-1">
                  <span>Upcoming Class Alerts</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get alerts before your scheduled classes
                  </span>
                </Label>
                <Switch id="upcoming-classes" defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize how the app works for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Default Attendance Target: {defaultTarget[0]}%</Label>
                <Slider
                  defaultValue={[75]}
                  min={50}
                  max={100}
                  step={5}
                  value={defaultTarget}
                  onValueChange={setDefaultTarget}
                />
                <p className="text-sm text-muted-foreground">
                  This target will be used as the default for new subjects
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-sync" className="flex flex-col space-y-1">
                  <span>Automatic Data Sync</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Keep your data in sync across devices
                  </span>
                </Label>
                <Switch id="auto-sync" defaultChecked={true} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-attendance" className="flex flex-col space-y-1">
                  <span>Suggest Attendance Based on Schedule</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    The app will suggest attendance entries based on your timetable
                  </span>
                </Label>
                <Switch id="auto-attendance" defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-muted-foreground">student@example.com</span>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-muted-foreground">••••••••</span>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Data Management</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">Export Data</Button>
                  <Button variant="outline" className="text-destructive">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
