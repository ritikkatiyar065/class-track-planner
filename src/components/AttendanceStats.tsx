
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subject, AttendanceStats as Stats } from "@/types";
import { calculateAttendanceStats, formatAttendancePercentage } from "@/utils/attendanceUtils";
import { CalendarCheck, CalendarX, Clock, Target, Banknote } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { useFine } from "@/contexts/FineContext";
import { formatFineAmount } from "@/utils/fineUtils";

interface AttendanceStatsProps {
  subject: Subject;
}

const AttendanceStats = ({ subject }: AttendanceStatsProps) => {
  const stats = calculateAttendanceStats(subject);
  const { subjectFines, showFines } = useFine();
  const fine = subjectFines.get(subject.id);
  
  // Generate fake data for the chart
  const chartData = [
    { week: "Week 1", attendance: 83 },
    { week: "Week 2", attendance: 76 },
    { week: "Week 3", attendance: 85 },
    { week: "Week 4", attendance: 65 },
    { week: "Week 5", attendance: 75 },
    { week: "Week 6", attendance: 80 },
    { week: "Week 7", attendance: stats.currentPercentage },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Attendance Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
          title="Current Attendance"
          value={formatAttendancePercentage(stats.currentPercentage)}
          icon={<CalendarCheck className="h-5 w-5" />}
          description="Your overall attendance for this subject"
          status={stats.status}
        />
        
        <StatCard 
          title="Target Attendance"
          value={`${stats.targetPercentage}%`}
          icon={<Target className="h-5 w-5" />}
          description="Your target attendance percentage"
        />
        
        <StatCard 
          title={stats.classesNeeded > 0 ? "Classes to Attend" : "Classes You Can Miss"}
          value={stats.classesNeeded > 0 ? stats.classesNeeded.toString() : stats.canMissClasses.toString()}
          icon={stats.classesNeeded > 0 ? <Clock className="h-5 w-5" /> : <CalendarX className="h-5 w-5" />}
          description={stats.classesNeeded > 0 
            ? "Number of classes you need to attend to reach target" 
            : "Number of classes you can safely miss"
          }
        />
        
        <StatCard 
          title="Attendance Status"
          value={stats.status === 'on-track' 
            ? 'On Track' 
            : stats.status === 'at-risk' 
              ? 'At Risk' 
              : 'Below Target'
          }
          icon={
            stats.status === 'on-track' 
              ? <CalendarCheck className="h-5 w-5 text-success" /> 
              : <CalendarX className="h-5 w-5 text-destructive" />
          }
          description="Your current attendance status"
          status={stats.status}
        />
        
        {showFines && fine && fine.amount > 0 && (
          <StatCard 
            title="Attendance Fine"
            value={formatFineAmount(fine.amount)}
            icon={<Banknote className="h-5 w-5 text-amber-500" />}
            description={`Based on ${fine.shortfall}% attendance shortfall`}
            status="below-target"
          />
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, "Attendance"]}
                labelClassName="text-xs"
              />
              <ReferenceLine
                y={stats.targetPercentage}
                label={{ value: 'Target', position: 'insideTopRight', fill: '#888' }}
                stroke="#ff5722"
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#3F51B5"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  status?: 'on-track' | 'at-risk' | 'below-target';
}

const StatCard = ({ title, value, icon, description, status }: StatCardProps) => {
  return (
    <Card className="stat-card h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={cn(
          "rounded-full p-2",
          status === 'on-track' ? 'bg-success/10 text-success' :
          status === 'at-risk' ? 'bg-warning/10 text-warning' :
          status === 'below-target' ? 'bg-destructive/10 text-destructive' :
          'bg-primary/10 text-primary'
        )}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
};

export default AttendanceStats;
