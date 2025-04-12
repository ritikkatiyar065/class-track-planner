
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Subject } from "@/types";
import { mockSubjects } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, UserCircle, FileEdit } from "lucide-react";
import AttendanceStats from "@/components/AttendanceStats";
import AttendanceTracker from "@/components/AttendanceTracker";
import { useToast } from "@/hooks/use-toast";

const SubjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would be a data fetch from API
    const foundSubject = mockSubjects.find((s) => s.id === id);
    
    if (foundSubject) {
      setSubject(foundSubject);
    }
    setLoading(false);
  }, [id]);
  
  const handleAttendanceUpdate = (attended: boolean) => {
    if (!subject) return;
    
    const updatedSubject = { ...subject };
    
    if (attended) {
      updatedSubject.attendedClasses += 1;
    }
    
    updatedSubject.totalClasses += 1;
    updatedSubject.currentAttendance = 
      (updatedSubject.attendedClasses / updatedSubject.totalClasses) * 100;
    
    setSubject(updatedSubject);
    
    // In a real app, this would save to an API or local storage
    toast({
      title: "Attendance updated",
      description: `Your attendance for ${subject.name} is now ${updatedSubject.currentAttendance.toFixed(1)}%`,
    });
  };
  
  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 flex justify-center items-center">
        <p>Loading subject details...</p>
      </div>
    );
  }
  
  if (!subject) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Subject Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The subject you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Button onClick={() => navigate('/dashboard')} variant="outline" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{subject.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{subject.code}</span>
                {subject.instructor && (
                  <>
                    <span>•</span>
                    <span className="flex items-center">
                      <UserCircle className="h-4 w-4 mr-1" />
                      {subject.instructor}
                    </span>
                  </>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Subject
            </Button>
          </div>
          
          <Tabs defaultValue="statistics">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="statistics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="attendance-log">
                <FileEdit className="h-4 w-4 mr-2" />
                Attendance Log
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="statistics" className="animate-fade-in">
              <AttendanceStats subject={subject} />
            </TabsContent>
            
            <TabsContent value="attendance-log" className="animate-fade-in">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Attendance History</h2>
                <p className="text-muted-foreground">
                  This section will show your attendance history for this subject. This feature is part of the next update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <AttendanceTracker subject={subject} onAttendanceUpdate={handleAttendanceUpdate} />
        </div>
      </div>
    </div>
  );
};

// Importing the icons here to avoid conflicts
import { BarChart3 } from "lucide-react";

export default SubjectDetail;
