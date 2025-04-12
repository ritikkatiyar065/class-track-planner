
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockSubjects } from "@/data/mockData";
import SubjectCard from "@/components/SubjectCard";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddSubjectForm from "@/components/AddSubjectForm";
import { Subject } from "@/types";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  
  const handleAddSubject = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject]);
    setShowAddForm(false);
  };
  
  const handleSubjectClick = (subject: Subject) => {
    navigate(`/subjects/${subject.id}`);
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Subjects</h1>
          <p className="text-muted-foreground">Manage all your subject details in one place</p>
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
        <div className="attendance-grid">
          {subjects.map((subject) => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              onClick={() => handleSubjectClick(subject)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
