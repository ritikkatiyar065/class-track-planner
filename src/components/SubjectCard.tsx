
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Subject, AttendanceStats } from "@/types";
import { Progress } from "@/components/ui/progress";
import { calculateAttendanceStats, formatAttendancePercentage, getStatusColor } from "@/utils/attendanceUtils";
import { BookOpen, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
  onClick?: () => void;
}

const SubjectCard = ({ subject, onClick }: SubjectCardProps) => {
  const stats: AttendanceStats = calculateAttendanceStats(subject);
  const statusColor = getStatusColor(stats.status);
  
  return (
    <Card 
      className={cn("overflow-hidden transition-all hover:shadow-md cursor-pointer animate-fade-in", 
        subject.color ? subject.color : "")}
      onClick={onClick}
    >
      <div className={cn("h-1", statusColor)} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">{subject.code}</p>
          </div>
          <div className="flex items-center">
            {stats.status === 'on-track' && <CheckCircle className="h-5 w-5 text-success" />}
            {stats.status === 'at-risk' && <AlertTriangle className="h-5 w-5 text-warning" />}
            {stats.status === 'below-target' && <AlertTriangle className="h-5 w-5 text-destructive" />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="progress-label">Current Attendance</span>
              <span className="text-sm font-medium">
                {formatAttendancePercentage(stats.currentPercentage)}
              </span>
            </div>
            <Progress 
              value={stats.currentPercentage} 
              className="h-2"
              indicatorClassName={cn(
                stats.status === 'on-track' ? 'bg-success' : 
                stats.status === 'at-risk' ? 'bg-warning' : 'bg-destructive'
              )}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Target: {subject.targetAttendance}%</span>
            <span>
              {subject.attendedClasses}/{subject.totalClasses} classes
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 text-sm flex flex-col items-start gap-1">
        <div className="flex items-center gap-1">
          {stats.classesNeeded > 0 ? (
            <>
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Need to attend <strong>{stats.classesNeeded}</strong> more classes</span>
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>Can miss up to <strong>{stats.canMissClasses}</strong> classes</span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
