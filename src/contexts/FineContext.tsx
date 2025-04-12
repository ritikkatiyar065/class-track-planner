
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
  subjectFines: Map<string, { amount: number; shortfall: number }>;
  recalculateFines: (subjects?: Subject[]) => void;
}

const FineContext = createContext<FineContextType | undefined>(undefined);

export const FineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fineRate, setFineRate] = useState<number>(400);
  const [showFines, setShowFines] = useState<boolean>(true);
  const [totalFineAmount, setTotalFineAmount] = useState<number>(0);
  const [subjectFines, setSubjectFines] = useState<Map<string, { amount: number; shortfall: number }>>(
    new Map()
  );

  const recalculateFines = (subjects: Subject[] = mockSubjects) => {
    let total = 0;
    const fines = new Map<string, { amount: number; shortfall: number }>();

    subjects.forEach(subject => {
      const fine = calculateAttendanceFine(subject.currentAttendance, subject.targetAttendance, fineRate);
      
      if (fine) {
        total += fine.amount;
        fines.set(subject.id, fine);
      }
    });

    setTotalFineAmount(total);
    setSubjectFines(fines);
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
        subjectFines,
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
