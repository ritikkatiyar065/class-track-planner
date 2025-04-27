import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Subject } from "@/types";
import SubjectCard from "@/components/SubjectCard";
import { PlusCircle, BookOpen, Calendar, BarChart3 } from "lucide-react";
import { calculateAttendanceStats } from "@/utils/attendanceUtils";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import AddSubjectForm from "@/components/AddSubjectForm";
import { mockSubjects } from "@/data/mockData";

const Dashboard = () => {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  
  const totalAttended = subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);
  const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
  const overallAttendance = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
  
  const subjectsAtRisk = subjects.filter(subject => {
    const stats = calculateAttendanceStats(subject);
    return stats.status === 'at-risk' || stats.status === 'below-target';
  }).length;
  
  const handleAddSubject = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject]);
    setShowAddForm(false);
  };
  
  const handleSubjectClick = (subject: Subject) => {
    navigate(`/subjects/${subject.id}`);
  };

  const getAttendanceColor = (percentage: number): string => {
    if (percentage >= 75) return "bg-success";
    if (percentage >= 65) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your class attendance</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Subject
        </Button>
      </div>
      
      {showAddForm ? (
        <div className="mb-8">
          <AddSubjectForm 
            onAddSubject={handleAddSubject} 
            onCancel={() => setShowAddForm(false)} 
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallAttendance.toFixed(1)}%</div>
                <Progress
                  value={overallAttendance}
                  className="h-2 mt-2"
                  indicatorClassName={getAttendanceColor(overallAttendance)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {totalAttended} of {totalClasses} classes attended
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end space-x-1">
                  <div className="text-2xl font-bold">{subjects.length}</div>
                  <div className="text-muted-foreground text-sm pb-0.5">subjects</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <BookOpen className="h-3 w-3 inline mr-1" />
                  {subjects.length > 0 ? "Track your subjects in one place" : "Add subjects to track attendance"}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Subjects At Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjectsAtRisk}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {subjectsAtRisk === 0 ? (
                    <span className="text-success flex items-center">
                      <BookOpen className="h-3 w-3 inline mr-1" />
                      All subjects on track
                    </span>
                  ) : (
                    <span className="text-warning flex items-center">
                      <BookOpen className="h-3 w-3 inline mr-1" />
                      {subjectsAtRisk} {subjectsAtRisk === 1 ? 'subject' : 'subjects'} below target
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Subjects</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/timetable')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  View Timetable
                </Button>
              </div>
              
              {subjects.length > 0 ? (
                <div className="attendance-grid">
                  {subjects.map((subject) => (
                    <SubjectCard 
                      key={subject.id} 
                      subject={subject} 
                      onClick={() => handleSubjectClick(subject)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No subjects added yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first subject to start tracking attendance</p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </div>
              )}
            </div>
            
            {subjects.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate('/timetable')}
                  >
                    <Calendar className="h-8 w-8 mb-2" />
                    <span className="font-medium">View Timetable</span>
                    <span className="text-xs text-muted-foreground">Check your weekly schedule</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate('/subjects')}
                  >
                    <BookOpen className="h-8 w-8 mb-2" />
                    <span className="font-medium">All Subjects</span>
                    <span className="text-xs text-muted-foreground">Manage your subjects</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate('/stats')}
                  >
                    <BarChart3 className="h-8 w-8 mb-2" />
                    <span className="font-medium">View Analytics</span>
                    <span className="text-xs text-muted-foreground">Track your progress over time</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
