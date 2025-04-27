
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarCheck, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Subject } from "@/types";

interface AttendanceRecord {
  id: string;
  date: string;
  attended: boolean;
  class_cancelled: boolean;
  notes?: string;
}

interface AttendanceHistoryProps {
  subject: Subject;
}

const AttendanceHistory = ({ subject }: AttendanceHistoryProps) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchAttendanceRecords = async () => {
      const { data, error } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("subject_id", subject.id)
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching attendance records:", error);
        return;
      }

      setRecords(data || []);
      setLoading(false);
    };

    fetchAttendanceRecords();
  }, [subject.id, user]);

  if (loading) {
    return <div>Loading attendance history...</div>;
  }

  return (
    <div>
      {records.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No attendance records found for this subject.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {record.class_cancelled ? (
                      <span className="text-muted-foreground">Cancelled</span>
                    ) : record.attended ? (
                      <span className="text-success flex items-center gap-1">
                        <CalendarCheck className="h-4 w-4" />
                        Present
                      </span>
                    ) : (
                      <span className="text-destructive flex items-center gap-1">
                        <X className="h-4 w-4" />
                        Absent
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{record.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AttendanceHistory;
