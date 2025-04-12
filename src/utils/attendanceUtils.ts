
export const calculateAttendanceStats = (subject: {
  attendedClasses: number;
  totalClasses: number;
  targetAttendance: number;
  currentAttendance: number;
}): {
  currentPercentage: number;
  targetPercentage: number;
  classesNeeded: number;
  canMissClasses: number;
  status: 'on-track' | 'at-risk' | 'below-target';
} => {
  const { attendedClasses, totalClasses, targetAttendance } = subject;
  
  // Current attendance percentage
  const currentPercentage = totalClasses > 0 
    ? (attendedClasses / totalClasses) * 100 
    : 0;
  
  // Target percentage
  const targetPercentage = targetAttendance;
  
  // Calculate how many more classes need to be attended to meet target
  const totalNeededToAttend = Math.ceil((targetPercentage / 100) * totalClasses);
  const classesNeeded = Math.max(0, totalNeededToAttend - attendedClasses);
  
  // Calculate how many classes can be missed while still meeting target
  const canMissClasses = Math.max(0, totalClasses - totalNeededToAttend);
  
  // Determine status
  let status: 'on-track' | 'at-risk' | 'below-target';
  
  if (currentPercentage >= targetPercentage) {
    status = 'on-track';
  } else if (currentPercentage >= targetPercentage - 5) {
    status = 'at-risk';
  } else {
    status = 'below-target';
  }
  
  return {
    currentPercentage,
    targetPercentage,
    classesNeeded,
    canMissClasses,
    status
  };
};

export const getRandomSubjectColor = (): string => {
  const colors = [
    'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',
    'bg-green-500/10 hover:bg-green-500/20 border-green-500/20',
    'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20',
    'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20',
    'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20',
    'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20',
    'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20',
    'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20',
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'on-track':
      return 'bg-success';
    case 'at-risk':
      return 'bg-warning';
    case 'below-target':
      return 'bg-destructive';
    default:
      return 'bg-neutral-500';
  }
};

export const formatAttendancePercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

// This is a safe function to format numbers as percentages
export const formatPercentage = (value: number | string | undefined): string => {
  if (value === undefined) return "0%";
  
  // If it's already a string, we can't safely apply toFixed
  if (typeof value === 'string') {
    // Try to parse it as a number first
    const num = parseFloat(value);
    if (isNaN(num)) return value; // Just return the original string if we can't parse
    return `${num.toFixed(1)}%`;
  }
  
  return `${value.toFixed(1)}%`;
};
