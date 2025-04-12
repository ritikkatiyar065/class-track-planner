
import { useFine } from '@/contexts/FineContext';
import { formatFineAmount } from '@/utils/fineUtils';
import { AlertTriangle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const FineNotification = () => {
  const { totalFineAmount, showFines, setShowFines } = useFine();
  
  if (!showFines || totalFineAmount <= 0) {
    return null;
  }
  
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <AlertDescription className="text-amber-900">
            <span className="font-semibold">
              ⚠️ Attendance Fine: {formatFineAmount(totalFineAmount)}
            </span>
            {' '}due to attendance shortfall. Improve your attendance to avoid additional fines.
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-amber-500 hover:text-amber-600 hover:bg-amber-100 h-7 w-7 p-0"
          onClick={() => setShowFines(false)}
        >
          <XCircle className="h-5 w-5" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </Alert>
  );
};

export default FineNotification;
