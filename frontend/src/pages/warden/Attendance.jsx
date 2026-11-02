import { useEffect, useState } from "react";
import { CalendarCheck, Check, X, Sparkles, RotateCw, Users, CheckCircle2, Activity } from "lucide-react";
import WardenLayout from "../../layouts/WardenLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import DashboardCard from "../../components/ui/DashboardCard";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadAttendance = async () => {
    try {
      const { data } = await api.get("/attendance/today");
      setAttendance(data.attendance || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const { data } = await api.get("/attendance/today");
        if (!ignore) {
          setAttendance(data.attendance || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const updateAttendance = async (studentId, mealType, present) => {
    setUpdatingId(`${studentId}-${mealType}`);
    try {
      await api.post("/attendance", {
        student_id: studentId,
        date: new Date().toISOString().split("T")[0],
        meal_type: mealType,
        present,
      });

      // Optimistic state update
      setAttendance((prev) =>
        prev.map((item) =>
          item.student_id === studentId && item.meal_type === mealType
            ? { ...item, present }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update attendance.");
      loadAttendance();
    } finally {
      setUpdatingId(null);
    }
  };

  const presentCount = attendance.filter((i) => i.present).length;
  const totalCount = attendance.length;
  const attendanceRate =
    totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <WardenLayout>
      <PageContainer>
        <SectionHeader
          title="Daily Roll-Call & Attendance"
          description="Log daily morning and evening student hostel attendance with instant roster synchronisation."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Hostel Roll-Call Desk</span>
            </div>
          }
          action={
            <Button
              variant="secondary"
              size="md"
              icon={RotateCw}
              loading={loading}
              onClick={loadAttendance}
            >
              Sync Roster
            </Button>
          }
        />

        {/* Live Attendance Counter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Roster Today"
            value={loading ? "..." : totalCount}
            subtitle="Active student sessions"
            icon={Users}
            color="blue"
            trend="Today's Roll"
            trendPositive={true}
          />
          <StatCard
            title="Present On Campus"
            value={loading ? "..." : presentCount}
            subtitle="Verified check-ins"
            icon={CheckCircle2}
            color="green"
            trend={`${attendanceRate}% Turnout`}
            trendPositive={attendanceRate >= 75}
          />
          <StatCard
            title="Absent Residents"
            value={loading ? "..." : Math.max(0, totalCount - presentCount)}
            subtitle="Pending physical roll-call"
            icon={Activity}
            color="amber"
            trend={totalCount - presentCount === 0 ? "All Present" : "Unaccounted"}
            trendPositive={totalCount - presentCount === 0}
          />
        </div>

        {/* Student Attendance List */}
        <DashboardCard
          title="Student Check-in Roster"
          subtitle="Toggle resident attendance status with live auto-save"
          icon={CalendarCheck}
        >
          {loading ? (
            <LoadingSpinner label="Fetching today's roll-call..." />
          ) : attendance.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="No Attendance Sessions"
              description="There are no scheduled attendance sessions or student records for today."
            />
          ) : (
            <div className="space-y-3 pt-1">
              {attendance.map((item) => {
                const isItemUpdating =
                  updatingId === `${item.student_id}-${item.meal_type}`;

                return (
                  <div
                    key={`${item.student_id}-${item.meal_type}`}
                    className="p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <Avatar name={item.username} size="sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#F8FAFC] text-[15px]">
                            {item.username}
                          </p>
                          <Badge variant="primary" size="sm">
                            {item.meal_type}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Roll No: #{item.roll_no}
                        </p>
                      </div>
                    </div>

                    {/* Segmented Toggle */}
                    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0F172A] border border-white/10 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        disabled={isItemUpdating}
                        onClick={() =>
                          updateAttendance(item.student_id, item.meal_type, true)
                        }
                        className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          item.present
                            ? "bg-[#16A34A] text-white shadow-soft"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Check size={14} />
                        Present
                      </button>

                      <button
                        type="button"
                        disabled={isItemUpdating}
                        onClick={() =>
                          updateAttendance(item.student_id, item.meal_type, false)
                        }
                        className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          !item.present
                            ? "bg-[#DC2626] text-white shadow-soft"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <X size={14} />
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardCard>
      </PageContainer>
    </WardenLayout>
  );
}