
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFine } from '@/contexts/FineContext';
import { Button } from '@/components/ui/button';
import { Banknote } from 'lucide-react';

const FineSettings = () => {
  const { fineRate, setFineRate, showFines, setShowFines } = useFine();
  const [tempFineRate, setTempFineRate] = useState(fineRate.toString());
  const [error, setError] = useState('');
  
  const handleFineRateChange = () => {
    const rate = parseInt(tempFineRate, 10);
    
    if (isNaN(rate)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (rate < 0) {
      setError('Fine rate cannot be negative');
      return;
    }
    
    setFineRate(rate);
    setError('');
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Banknote className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Attendance Fine Settings</CardTitle>
        </div>
        <CardDescription>
          Configure how attendance fines are calculated and displayed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-fines">Show Fine Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Display fine notifications when attendance is below target
              </p>
            </div>
            <Switch
              id="show-fines"
              checked={showFines}
              onCheckedChange={setShowFines}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fine-rate">Fine Rate (₹ per % below target)</Label>
            <div className="flex gap-2">
              <Input
                id="fine-rate"
                type="number"
                min="0"
                value={tempFineRate}
                onChange={(e) => setTempFineRate(e.target.value)}
                className={error ? "border-red-300" : ""}
              />
              <Button onClick={handleFineRateChange} type="button">Update</Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-sm text-muted-foreground">
              Current rate: ₹{fineRate} per percentage point below target attendance
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FineSettings;
