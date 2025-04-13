
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface FormFooterProps {
  onCancel: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({ onCancel }) => {
  return (
    <CardFooter className="px-0 pt-4 pb-0 justify-end space-x-2">
      <Button variant="outline" onClick={onCancel} type="button">
        Cancel
      </Button>
      <Button type="submit">Add Task</Button>
    </CardFooter>
  );
};

export default FormFooter;
