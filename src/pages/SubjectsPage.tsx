
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockSubjects } from "@/data/mockData";
import SubjectCard from "@/components/SubjectCard";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddSubjectForm from "@/components/AddSubjectForm";
import { Subject } from "@/types";
import DeleteSubjectDialog from "@/components/DeleteSubjectDialog";
import { useToast } from "@/hooks/use-toast";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [showAddForm, setShowAddForm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAddSubject = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject]);
    setShowAddForm(false);
  };
  
  const handleSubjectClick = (subject: Subject) => {
    navigate(`/subjects/${subject.id}`);
  };
  
  const handleDeleteClick = (subject: Subject) => {
    setSubjectToDelete(subject);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteConfirm = (subject: Subject) => {
    setSubjects(prev => prev.filter(s => s.id !== subject.id));
    setShowDeleteDialog(false);
    toast({
      title: "Subject deleted",
      description: `${subject.name} has been removed from your subjects.`,
    });
  };
  
  const handleEditClick = (subject: Subject) => {
    navigate(`/subjects/${subject.id}?edit=true`);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <SubjectCard 
                key={subject.id} 
                subject={subject} 
                onClick={() => handleSubjectClick(subject)}
                onDelete={() => handleDeleteClick(subject)}
                onEdit={() => handleEditClick(subject)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium">No subjects added yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first subject</p>
              <Button onClick={() => setShowAddForm(true)}>
                Add Your First Subject
              </Button>
            </div>
          )}
        </div>
      )}
      
      <DeleteSubjectDialog 
        subject={subjectToDelete}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default SubjectsPage;
