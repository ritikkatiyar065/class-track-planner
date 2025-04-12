
import { useState } from "react";
import { Subject } from "@/types";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface DeleteSubjectDialogProps {
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (subject: Subject) => void;
}

const DeleteSubjectDialog = ({ 
  subject, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteSubjectDialogProps) => {
  if (!subject) return null;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {subject.name} ({subject.code})? 
            This action cannot be undone and all attendance records for this subject will be permanently lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive hover:bg-destructive/90"
            onClick={() => onConfirm(subject)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSubjectDialog;
