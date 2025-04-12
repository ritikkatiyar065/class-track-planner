import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Subject } from "@/types";
import { mockSubjects } from "@/data/mockData";
import SubjectCard from "@/components/SubjectCard";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddSubjectForm from "@/components/AddSubjectForm";
import EditSubjectForm from "@/components/EditSubjectForm";
import DeleteSubjectDialog from "@/components/DeleteSubjectDialog";
import { getRandomSubjectColor } from "@/utils/attendanceUtils";
import { Input } from "@/components/ui/input";
import { useFine } from "@/contexts/FineContext";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { recalculateFines } = useFine();
  
  useEffect(() => {
    // Simulate loading data from an API
    setTimeout(() => {
      setSubjects(mockSubjects);
      setLoading(false);
    }, 500);
  }, []);
  
  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddSubject = (newSubject: Subject) => {
    setSubjects((prev) => {
      const updated = [...prev, newSubject];
      recalculateFines(updated); // Recalculate fines when adding subject
      return updated;
    });
    setShowAddForm(false);
  };
  
  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => {
      const updated = prev.filter((s) => s.id !== subjectId);
      recalculateFines(updated); // Recalculate fines when deleting subject
      return updated;
    });
    
    toast({
      title: "Subject deleted",
      description: "The subject has been removed.",
    });
    
    setShowDeleteDialog(false);
  };
  
  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects((prev) => {
      const updated = prev.map((s) => 
        s.id === updatedSubject.id ? updatedSubject : s
      );
      recalculateFines(updated); // Recalculate fines when updating subject
      return updated;
    });
    
    setShowEditForm(false);
    
    toast({
      title: "Subject updated",
      description: `${updatedSubject.name} has been updated.`,
    });
  };
  
  const handleEditClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowEditForm(true);
  };
  
  const handleDeleteClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowDeleteDialog(true);
  };
  
  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 flex justify-center items-center">
        <p>Loading subjects...</p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Subjects</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>
      
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onClick={() => navigate(`/subjects/${subject.id}`)}
            onEdit={() => handleEditClick(subject)}
            onDelete={() => handleDeleteClick(subject)}
          />
        ))}
      </div>
      
      {showAddForm && (
        <AddSubjectForm
          onAddSubject={(newSubject) => {
            handleAddSubject({ ...newSubject, color: getRandomSubjectColor() });
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      
      {showEditForm && selectedSubject && (
        <EditSubjectForm
          subject={selectedSubject}
          onUpdateSubject={handleUpdateSubject}
          onCancel={() => setShowEditForm(false)}
        />
      )}
      
      {showDeleteDialog && selectedSubject && (
        <DeleteSubjectDialog
          subject={selectedSubject}
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => handleDeleteSubject(selectedSubject.id)}
        />
      )}
    </div>
  );
};

export default SubjectsPage;
