
import { mockSubjects, mockTimetable } from "@/data/mockData";
import Timetable from "@/components/Timetable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const TimetablePage = () => {
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState(mockTimetable);
  
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
      
      <Timetable timetable={timetable} subjects={mockSubjects} />
    </div>
  );
};

export default TimetablePage;
