
export interface Subject {
  id: string;
  name: string;
  code: string;
  instructor?: string;
  targetAttendance: number;
  currentAttendance: number;
  totalClasses: number;
  attendedClasses: number;
  color?: string;
}

export interface ClassSession {
  id: string;
  subjectId: string;
  date: Date;
  startTime: string;
  endTime: string;
  attended: boolean;
  notes?: string;
}

export interface TimetableSlot {
  id: string;
  subjectId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  room?: string;
}

export interface WeeklySchedule {
  [key: number]: TimetableSlot[]; // Key is day of week (0-6)
}

export interface AttendanceStats {
  currentPercentage: number;
  targetPercentage: number;
  classesNeeded: number;
  canMissClasses: number;
  status: 'on-track' | 'at-risk' | 'below-target';
}

// Type for describing the subject edit action
export interface SubjectAction {
  type: 'add' | 'update' | 'delete';
  subject: Subject;
}

// ToDo List related types
export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  subjectId?: string; // Optional link to a subject
  completed: boolean;
  createdAt: Date;
  priority: 'high' | 'medium' | 'low';
  category: 'assignment' | 'test' | 'reminder' | 'other';
}

export interface TodoFilter {
  subjectId?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: 'assignment' | 'test' | 'reminder' | 'other';
  completed?: boolean;
}
