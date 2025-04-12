
import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateAttendanceFine } from '@/utils/fineUtils';
import { Subject } from '@/types';
import { mockSubjects } from '@/data/mockData';

interface FineContextType {
  fineRate: number;
  setFineRate: (rate: number) => void;
  showFines: boolean;
  setShowFines: (show: boolean) => void;
  totalFineAmount: number;
  overallShortfall: number | null;
  recalculateFines: (subjects?: Subject[]) => void;
}

const FineContext = createContext<FineContextType | undefined>(undefined);

export const FineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fineRate, setFineRate] = useState<number>(400);
  const [showFines, setShowFines] = useState<boolean>(true);
  const [totalFineAmount, setTotalFineAmount] = useState<number>(0);
  const [overallShortfall, setOverallShortfall] = useState<number | null>(null);

  const recalculateFines = (subjects: Subject[] = mockSubjects) => {
    // Calculate overall attendance
    const totalAttended = subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);
    const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
    
    // Default target attendance is 75% if no subjects
    const targetAttendance = subjects.length > 0 
      ? subjects.reduce((sum, subject) => sum + subject.targetAttendance, 0) / subjects.length 
      : 75;
    
    const overallAttendance = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

    // Calculate fine based on overall attendance
    const fine = calculateAttendanceFine(overallAttendance, targetAttendance, fineRate);
    
    if (fine) {
      setTotalFineAmount(fine.amount);
      setOverallShortfall(fine.shortfall);
    } else {
      setTotalFineAmount(0);
      setOverallShortfall(null);
    }
  };

  // Calculate fines initially and when fine rate changes
  useEffect(() => {
    recalculateFines();
  }, [fineRate]);

  return (
    <FineContext.Provider
      value={{
        fineRate,
        setFineRate,
        showFines,
        setShowFines,
        totalFineAmount,
        overallShortfall,
        recalculateFines,
      }}
    >
      {children}
    </FineContext.Provider>
  );
};

export const useFine = () => {
  const context = useContext(FineContext);
  if (context === undefined) {
    throw new Error('useFine must be used within a FineProvider');
  }
  return context;
};
