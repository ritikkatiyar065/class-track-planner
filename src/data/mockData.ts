
import { Subject, ClassSession, TimetableSlot } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { getRandomSubjectColor } from "../utils/attendanceUtils";

// Mock Subjects
export const mockSubjects: Subject[] = [
  {
    id: uuidv4(),
    name: "Electrical",
    code: "EE101",
    instructor: "Dr. Johnson",
    targetAttendance: 75,
    currentAttendance: 80,
    totalClasses: 20,
    attendedClasses: 16,
    color: getRandomSubjectColor(),
  },
  {
    id: uuidv4(),
    name: "Physics",
    code: "PHY101",
    instructor: "Prof. Smith",
    targetAttendance: 75,
    currentAttendance: 65,
    totalClasses: 15,
    attendedClasses: 10,
    color: getRandomSubjectColor(),
  },
  {
    id: uuidv4(),
    name: "Mathematics",
    code: "MATH102",
    instructor: "Dr. Williams",
    targetAttendance: 80,
    currentAttendance: 90,
    totalClasses: 18,
    attendedClasses: 16,
    color: getRandomSubjectColor(),
  },
  {
    id: uuidv4(),
    name: "PPS",
    code: "CS101",
    instructor: "Prof. Garcia",
    targetAttendance: 75,
    currentAttendance: 72,
    totalClasses: 22,
    attendedClasses: 16,
    color: getRandomSubjectColor(),
  },
  {
    id: uuidv4(),
    name: "EVS",
    code: "ENV205",
    instructor: "Dr. Chen",
    targetAttendance: 70,
    currentAttendance: 60,
    totalClasses: 25,
    attendedClasses: 15,
    color: getRandomSubjectColor(),
  }
];

// Generate timetable for the week
const generateWeeklyTimetable = (subjects: Subject[]): TimetableSlot[] => {
  const timetable: TimetableSlot[] = [];
  
  // Time slots
  const timeSlots = [
    { start: "09:00", end: "10:30" },
    { start: "11:00", end: "12:30" },
    { start: "14:00", end: "15:30" },
    { start: "16:00", end: "17:30" }
  ];
  
  // Generate slots for Monday to Friday (1-5)
  for (let day = 1; day <= 5; day++) {
    // Randomly assign 2-3 subjects per day
    const subjectsPerDay = Math.floor(Math.random() * 2) + 2;
    const shuffledSubjects = [...subjects].sort(() => 0.5 - Math.random());
    const daySubjects = shuffledSubjects.slice(0, subjectsPerDay);
    
    daySubjects.forEach((subject, index) => {
      if (index < timeSlots.length) {
        timetable.push({
          id: uuidv4(),
          subjectId: subject.id,
          dayOfWeek: day,
          startTime: timeSlots[index].start,
          endTime: timeSlots[index].end,
          room: `Room ${100 + Math.floor(Math.random() * 20)}`
        });
      }
    });
  }
  
  return timetable;
};

export const mockTimetable: TimetableSlot[] = generateWeeklyTimetable(mockSubjects);

// Generate attendance history (past 30 days)
const generateAttendanceHistory = (subjects: Subject[]): ClassSession[] => {
  const sessions: ClassSession[] = [];
  const currentDate = new Date();
  
  // For each subject, generate attendance for past 30 days
  subjects.forEach(subject => {
    // Generate 2-3 sessions per week for the past 4 weeks
    for (let day = 1; day <= 30; day++) {
      const sessionDate = new Date();
      sessionDate.setDate(currentDate.getDate() - (30 - day));
      
      // Only create sessions on weekdays (1-5)
      const dayOfWeek = sessionDate.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // 30% chance of having a class on this day
        if (Math.random() < 0.3) {
          // 80% chance of attending if the subject has good attendance
          // 60% chance otherwise
          const attendanceRate = subject.currentAttendance >= 75 ? 0.8 : 0.6;
          
          sessions.push({
            id: uuidv4(),
            subjectId: subject.id,
            date: new Date(sessionDate),
            startTime: "09:00",
            endTime: "10:30",
            attended: Math.random() < attendanceRate,
            notes: Math.random() < 0.3 ? "Pop quiz today" : undefined
          });
        }
      }
    }
  });
  
  return sessions;
};

export const mockAttendanceHistory: ClassSession[] = generateAttendanceHistory(mockSubjects);
