import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import DashboardCard from "../../components/ui/DashboardCard";
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function Attendance() {
  const [summary, setSummary] = useState({
    percentage: 0,
    present: 0,
    absent: 0,
    total: 0,
  });

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await api.get("/attendance/my-attendance");
        setSummary(data.summary || { percentage: 0, present: 0, absent: 0, total: 0 });
        setAttendance(data.attendance || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <StudentLayout>
      <PageContainer>
        <SectionHeader
          title="Attendance Record"
          description="Track your daily hostel and mess roll call logs, attendance percentages, and eligibility status."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Campus Presence Logs</span>
            </div>
          }
        />

        {loading ? (
          <LoadingSpinner label="Retrieving attendance history..." />
        ) : (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <StatCard
                title="Overall Attendance"
                value={`${summary.percentage}%`}
                subtitle={
                  summary.percentage >= 75
                    ? "Fully eligible for semester exams"
                    : "Below required 75% threshold"
                }
                icon={CalendarCheck}
                color={summary.percentage >= 75 ? "cyan" : "amber"}
                trend={summary.percentage >= 75 ? "Compliant" : "Low"}
                trendPositive={summary.percentage >= 75}
              />

              <StatCard
                title="Present Sessions"
                value={summary.present}
                subtitle="Confirmed check-in records"
                icon={CheckCircle}
                color="green"
              />

              <StatCard
                title="Absent Sessions"
                value={summary.absent}
                subtitle="Unattended roll-calls"
                icon={XCircle}
                color="red"
              />

              <StatCard
                title="Total Evaluated"
                value={summary.total}
                subtitle="Total roll-call periods"
                icon={Clock}
                color="purple"
              />
            </div>

            {/* Attendance Progress Compliance Bar */}
            <DashboardCard
              title="Attendance Compliance Monitor"
              subtitle="University regulation mandates a minimum of 75% attendance for hostel residence"
              icon={CalendarCheck}
            >
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300">Minimum Benchmark: 75%</span>
                  <span
                    className={`font-semibold ${
                      summary.percentage >= 75 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    Current: {summary.percentage}%
                  </span>
                </div>

                <div className="h-3 w-full bg-[#0F172A] rounded-full overflow-hidden p-0.5 border border-white/5 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      summary.percentage >= 75
                        ? "bg-[#16A34A]"
                        : "bg-[#D97706]"
                    }`}
                    style={{ width: `${Math.min(summary.percentage, 100)}%` }}
                  />
                  {/* Benchmark 75% line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/40 z-10"
                    style={{ left: "75%" }}
                    title="75% Requirement"
                  />
                </div>
              </div>
            </DashboardCard>

            {/* Attendance History Table */}
            <DashboardCard
              title="Attendance History"
              subtitle="Chronological log of verified meal and room roll-calls"
              icon={Clock}
            >
              {attendance.length === 0 ? (
                <EmptyState
                  icon={CalendarCheck}
                  title="No Attendance Logs"
                  description="No attendance records have been registered for your account yet."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Session / Meal Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((item) => (
                      <TableRow key={item.attendance_id}>
                        <TableCell>
                          <span className="font-medium text-white">
                            {new Date(item.date).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-300 font-medium">
                            {item.meal_type || "Daily Roll-Call"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge status={item.present ? "PRESENT" : "ABSENT"}>
                            {item.present ? "Present" : "Absent"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DashboardCard>
          </div>
        )}
      </PageContainer>
    </StudentLayout>
  );
}