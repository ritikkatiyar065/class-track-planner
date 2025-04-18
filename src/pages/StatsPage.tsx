
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSubjects } from "@/data/mockData";
import { Subject } from "@/types";
import { calculateAttendanceStats, formatAttendancePercentage } from "@/utils/attendanceUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const StatsPage = () => {
  const [subjects] = useState<Subject[]>(mockSubjects);
  
  // Create data for bar chart
  const attendanceData = subjects.map(subject => {
    const stats = calculateAttendanceStats(subject);
    return {
      name: subject.code,
      current: parseFloat(stats.currentPercentage.toFixed(1)),
      target: subject.targetAttendance,
    };
  });
  
  // Create data for pie chart - Fix: Filter before creating the data array
  const statusData = subjects.reduce((acc, subject) => {
    const stats = calculateAttendanceStats(subject);
    const status = stats.status === "on-track" 
      ? "On Track" 
      : stats.status === "at-risk" 
        ? "At Risk" 
        : "Below Target";
    
    // Find if this status already exists in our accumulator
    const existingStatusIndex = acc.findIndex(item => item.name === status);
    
    if (existingStatusIndex !== -1) {
      // If it exists, increment the count
      acc[existingStatusIndex].value += 1;
    } else {
      // If it doesn't exist, add a new entry
      acc.push({
        name: status,
        value: 1
      });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);
  
  // Colors for pie chart
  const COLORS = ["#4CAF50", "#FFC107", "#F44336"];
  
  // Helper function to safely format values that might be strings
  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return `${value.toFixed(1)}%`;
    }
    return `${value}%`;
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Attendance Analytics</h1>
        <p className="text-muted-foreground">View your attendance statistics and trends</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData} barSize={15}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`]} />
                <Legend />
                <ReferenceLine y={75} stroke="#FF5722" label={{ value: 'Min. Required', position: 'insideBottomRight', fill: '#888' }} />
                <Bar dataKey="current" name="Current Attendance" fill="#3F51B5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="#FF5722" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-64">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip 
                    formatter={(value) => [`${value} ${value === 1 ? 'subject' : 'subjects'}`]} 
                    contentStyle={{ background: 'var(--background)', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2">Subject</th>
                  <th className="text-left p-2">Code</th>
                  <th className="text-right p-2">Target %</th>
                  <th className="text-right p-2">Current %</th>
                  <th className="text-right p-2">Classes Attended</th>
                  <th className="text-right p-2">Status</th>
                  <th className="text-right p-2">Safe to Bunk</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => {
                  const stats = calculateAttendanceStats(subject);
                  return (
                    <tr key={subject.id} className="border-b">
                      <td className="p-2">{subject.name}</td>
                      <td className="p-2">{subject.code}</td>
                      <td className="text-right p-2">{subject.targetAttendance}%</td>
                      <td className="text-right p-2">
                        {stats.currentPercentage.toFixed(1)}% 
                        <span className="ml-1" title="Attendance Status">
                          {stats.emoji}
                        </span>
                      </td>
                      <td className="text-right p-2">{subject.attendedClasses} / {subject.totalClasses}</td>
                      <td className="text-right p-2">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          stats.status === 'on-track' 
                            ? 'bg-success/10 text-success' 
                            : stats.status === 'at-risk' 
                              ? 'bg-warning/10 text-warning' 
                              : 'bg-destructive/10 text-destructive'
                        }`}>
                          {stats.status === 'on-track' 
                            ? 'On Track' 
                            : stats.status === 'at-risk' 
                              ? 'At Risk' 
                              : 'Below Target'}
                        </span>
                      </td>
                      <td className="text-right p-2">
                        {stats.canMissClasses > 0 ? (
                          <span className="text-success">
                            Can miss {stats.canMissClasses} {stats.canMissClasses === 1 ? 'class' : 'classes'}
                          </span>
                        ) : (
                          <span className="text-destructive">
                            Need to attend {stats.classesNeeded} more
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;
