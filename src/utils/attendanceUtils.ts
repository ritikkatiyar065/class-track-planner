
import { Subject, AttendanceStats } from "../types";

export const calculateAttendancePercentage = (attendedClasses: number, totalClasses: number): number => {
  if (totalClasses === 0) return 0;
  return (attendedClasses / totalClasses) * 100;
};

export const calculateAttendanceStats = (subject: Subject): AttendanceStats => {
  const { attendedClasses, totalClasses, targetAttendance } = subject;
  
  // Current attendance percentage
  const currentPercentage = calculateAttendancePercentage(attendedClasses, totalClasses);
  
  // Calculate how many more classes needed to reach target
  const targetClassCount = Math.ceil((targetAttendance / 100) * totalClasses);
  const classesNeeded = Math.max(0, targetClassCount - attendedClasses);
  
  // Calculate how many classes can be missed while still meeting target
  const requiredClasses = Math.ceil((targetAttendance / 100) * totalClasses);
  const canMissClasses = Math.max(0, totalClasses - requiredClasses);
  
  // Determine status
  let status: 'on-track' | 'at-risk' | 'below-target';
  if (currentPercentage >= targetAttendance) {
    status = 'on-track';
  } else if (currentPercentage >= targetAttendance - 5) {
    status = 'at-risk';
  } else {
    status = 'below-target';
  }
  
  return {
    currentPercentage,
    targetPercentage: targetAttendance,
    classesNeeded,
    canMissClasses,
    status
  };
};

export const getStatusColor = (status: 'on-track' | 'at-risk' | 'below-target'): string => {
  switch (status) {
    case 'on-track':
      return 'bg-success';
    case 'at-risk':
      return 'bg-warning';
    case 'below-target':
      return 'bg-destructive';
    default:
      return 'bg-muted';
  }
};

export const calculateClassesToAttend = (
  currentAttended: number,
  totalClasses: number,
  targetPercentage: number
): number => {
  // Calculate the number of classes needed to reach the target
  const targetClassCount = Math.ceil((targetPercentage / 100) * totalClasses);
  return Math.max(0, targetClassCount - currentAttended);
};

export const formatAttendancePercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

export const getRandomSubjectColor = (): string => {
  const colors = [
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100',
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};
