
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
