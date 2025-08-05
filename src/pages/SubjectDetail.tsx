import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Subject } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, UserCircle, FileEdit, Trash2 } from "lucide-react";
import AttendanceStats from "@/components/AttendanceStats";
import AttendanceTracker from "@/components/AttendanceTracker";
import { useToast } from "@/hooks/use-toast";
import EditSubjectForm from "@/components/EditSubjectForm";
import DeleteSubjectDialog from "@/components/DeleteSubjectDialog";
import AttendanceHistory from "@/components/AttendanceHistory";

const SubjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchSubject = async () => {
      if (!user || !id) return;
      
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Transform the data to match our Subject type
          const transformedSubject: Subject = {
            id: data.id,
            name: data.name,
            code: data.name, // Using name as code for now
            instructor: '', // Not in our schema yet
            attendedClasses: data.attended_classes,
            totalClasses: data.total_classes,
            currentAttendance: data.total_classes > 0 ? (data.attended_classes / data.total_classes) * 100 : 0,
            targetAttendance: data.target_attendance || 75,
          };
          setSubject(transformedSubject);
        }
      } catch (error) {
        console.error('Error fetching subject:', error);
        toast({
          title: "Error",
          description: "Failed to load subject details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
    
    if (searchParams.get('edit') === 'true') {
      setShowEditForm(true);
    }
  }, [id, searchParams, user]);
  
  const handleAttendanceUpdate = async (attended: boolean) => {
    if (!subject || !user) return;
    
    try {
      // Fetch updated subject data from database after the trigger has updated it
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subject.id)
        .eq('user_id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        const updatedSubject: Subject = {
          ...subject,
          attendedClasses: data.attended_classes,
          totalClasses: data.total_classes,
          currentAttendance: data.total_classes > 0 ? (data.attended_classes / data.total_classes) * 100 : 0,
        };
        setSubject(updatedSubject);
        
        toast({
          title: "Attendance updated",
          description: `Your attendance for ${subject.name} is now ${updatedSubject.currentAttendance.toFixed(1)}%`,
        });
      }
    } catch (error) {
      console.error('Error updating subject data:', error);
    }
  };
  
  const handleEditClick = () => {
    setShowEditForm(true);
    setSearchParams({ edit: 'true' });
  };
  
  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubject(updatedSubject);
    setShowEditForm(false);
    setSearchParams({});
    
    toast({
      title: "Subject updated",
      description: `${updatedSubject.name} has been updated.`,
    });
  };
  
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };
  
  const handleDeleteConfirm = () => {
    if (!subject) return;
    
    toast({
      title: "Subject deleted",
      description: `${subject.name} has been removed from your subjects.`,
    });
    
    navigate('/subjects');
  };
  
  const requestNotificationPermission = async () => {
    try {
      if (!("Notification" in window)) {
        toast({
          title: "Notifications not supported",
          description: "Your browser doesn't support notifications",
          variant: "destructive",
        });
        return;
      }

      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        toast({
          title: "Notifications enabled",
          description: "You will now receive class reminders",
        });
      } else {
        toast({
          title: "Notifications disabled",
          description: "You won't receive class reminders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "Error",
        description: "Could not request notification permission",
        variant: "destructive",
      });
    }
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
  
  if (showEditForm) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Button onClick={() => {
          setShowEditForm(false);
          setSearchParams({});
        }} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subject Details
        </Button>
        
        <EditSubjectForm 
          subject={subject} 
          onUpdateSubject={handleUpdateSubject}
          onCancel={() => {
            setShowEditForm(false);
            setSearchParams({});
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Button onClick={() => navigate('/subjects')} variant="outline" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Subjects
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Subject
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteClick} className="text-destructive border-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Attendance History</h2>
                  <Button onClick={requestNotificationPermission} variant="outline">
                    Enable Notifications
                  </Button>
                </div>
                <AttendanceHistory subject={subject} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <AttendanceTracker subject={subject} onAttendanceUpdate={handleAttendanceUpdate} />
        </div>
      </div>
      
      <DeleteSubjectDialog
        subject={subject}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

import { BarChart3 } from "lucide-react";

export default SubjectDetail;
