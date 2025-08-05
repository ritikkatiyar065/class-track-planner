-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  total_classes INTEGER NOT NULL DEFAULT 0,
  attended_classes INTEGER NOT NULL DEFAULT 0,
  target_attendance DECIMAL(5,2) DEFAULT 75.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance_logs table
CREATE TABLE public.attendance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('attended', 'missed', 'cancelled')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for subjects table
CREATE POLICY "Users can view their own subjects" 
ON public.subjects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subjects" 
ON public.subjects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subjects" 
ON public.subjects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects" 
ON public.subjects 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for attendance_logs table
CREATE POLICY "Users can view their own attendance logs" 
ON public.attendance_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attendance logs" 
ON public.attendance_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendance logs" 
ON public.attendance_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attendance logs" 
ON public.attendance_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Function to update subject attendance counts
CREATE OR REPLACE FUNCTION public.update_subject_attendance()
RETURNS TRIGGER AS $$
BEGIN
  -- For INSERT operations
  IF TG_OP = 'INSERT' THEN
    UPDATE public.subjects 
    SET 
      total_classes = total_classes + 1,
      attended_classes = CASE 
        WHEN NEW.status = 'attended' THEN attended_classes + 1 
        ELSE attended_classes 
      END,
      updated_at = now()
    WHERE id = NEW.subject_id;
    RETURN NEW;
  END IF;
  
  -- For UPDATE operations
  IF TG_OP = 'UPDATE' THEN
    -- Revert old counts
    UPDATE public.subjects 
    SET 
      total_classes = total_classes - 1,
      attended_classes = CASE 
        WHEN OLD.status = 'attended' THEN attended_classes - 1 
        ELSE attended_classes 
      END
    WHERE id = OLD.subject_id;
    
    -- Apply new counts
    UPDATE public.subjects 
    SET 
      total_classes = total_classes + 1,
      attended_classes = CASE 
        WHEN NEW.status = 'attended' THEN attended_classes + 1 
        ELSE attended_classes 
      END,
      updated_at = now()
    WHERE id = NEW.subject_id;
    RETURN NEW;
  END IF;
  
  -- For DELETE operations
  IF TG_OP = 'DELETE' THEN
    UPDATE public.subjects 
    SET 
      total_classes = total_classes - 1,
      attended_classes = CASE 
        WHEN OLD.status = 'attended' THEN attended_classes - 1 
        ELSE attended_classes 
      END,
      updated_at = now()
    WHERE id = OLD.subject_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic attendance counting
CREATE TRIGGER update_attendance_on_insert
  AFTER INSERT ON public.attendance_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_subject_attendance();

CREATE TRIGGER update_attendance_on_update
  AFTER UPDATE ON public.attendance_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_subject_attendance();

CREATE TRIGGER update_attendance_on_delete
  AFTER DELETE ON public.attendance_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_subject_attendance();

-- Function to calculate attendance percentage
CREATE OR REPLACE FUNCTION public.calculate_attendance_percentage(subject_row public.subjects)
RETURNS DECIMAL AS $$
BEGIN
  IF subject_row.total_classes = 0 THEN
    RETURN 0;
  END IF;
  RETURN ROUND((subject_row.attended_classes::DECIMAL / subject_row.total_classes::DECIMAL) * 100, 2);
END;
$$ LANGUAGE plpgsql STABLE;