import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Bed,
  DoorOpen,
  ClipboardList,
  AlertTriangle,
  CalendarCheck,
  Receipt,
  ArrowRight,
  Sparkles,
  UserPlus,
} from "lucide-react";
import api from "../../services/api";
import WardenLayout from "../../layouts/WardenLayout";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import DashboardCard from "../../components/ui/DashboardCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

export default function WardenDashboard() {
  const [stats, setStats] = useState({
    total_students: 0,
    total_rooms: 0,
    occupied_rooms: 0,
    available_rooms: 0,
    pending_leaves: 0,
    total_complaints: 0,
    pending_complaints: 0,
    today_attendance_percentage: 0,
  });

  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const { data } = await api.get("/warden/dashboard");
        if (!ignore) {
          setStats(data.stats || {});
          setRecentLeaves(data.recentLeaves || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const totalRooms = stats.total_rooms || 1;
  const occupancyPercentage = Math.round(
    ((stats.occupied_rooms || 0) / totalRooms) * 100
  );

  return (
    <WardenLayout>
      <PageContainer>
        <SectionHeader
          title="Warden Dashboard"
          description="Real-time occupancy control, student welfare, out-pass verification, and facility health."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Hostel Administrative Suite</span>
            </div>
          }
          action={
            <div className="flex items-center gap-3">
              <Link to="/warden/attendance">
                <Button variant="secondary" size="md" icon={CalendarCheck}>
                  Mark Roll-Call
                </Button>
              </Link>
              <Link to="/warden/rooms">
                <Button variant="primary" size="md" icon={UserPlus}>
                  Allocate Room
                </Button>
              </Link>
            </div>
          }
        />

        {/* Top 4 Core Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Link to="/warden/students" className="block group">
            <StatCard
              title="Registered Students"
              value={loading ? "..." : stats.total_students}
              subtitle="Enrolled active residents"
              icon={Users}
              color="blue"
            />
          </Link>

          <Link to="/warden/rooms" className="block group">
            <StatCard
              title="Available Rooms"
              value={loading ? "..." : stats.available_rooms}
              subtitle={`${stats.occupied_rooms} of ${stats.total_rooms} units occupied`}
              icon={DoorOpen}
              color="green"
              trend={stats.available_rooms > 0 ? "Slots Open" : "Capacity Reached"}
              trendPositive={stats.available_rooms > 0}
            />
          </Link>

          <Link to="/warden/leaves" className="block group">
            <StatCard
              title="Pending Leaves"
              value={loading ? "..." : stats.pending_leaves}
              subtitle="Out-pass requests requiring review"
              icon={ClipboardList}
              color="amber"
              trend={stats.pending_leaves > 0 ? "Review Required" : "All Clear"}
              trendPositive={stats.pending_leaves === 0}
            />
          </Link>

          <Link to="/warden/complaints" className="block group">
            <StatCard
              title="Complaints & Repairs"
              value={loading ? "..." : stats.pending_complaints}
              subtitle={`${stats.total_complaints} total tickets reported`}
              icon={AlertTriangle}
              color={stats.pending_complaints > 0 ? "red" : "cyan"}
              trend={stats.pending_complaints === 0 ? "All Resolved" : "Unresolved"}
              trendPositive={stats.pending_complaints === 0}
            />
          </Link>
        </div>

        {/* Main Section: Room Occupancy & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Room Occupancy Visual Card */}
          <div className="lg:col-span-7">
            <DashboardCard
              title="Hostel Capacity & Occupancy"
              subtitle="Live overview of bed allotments across residential blocks"
              icon={Bed}
              action={
                <Link to="/warden/rooms">
                  <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                    Manage Rooms
                  </Button>
                </Link>
              }
            >
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-[#1A2338] border border-white/[0.06]">
                  <div>
                    <span className="text-[12px] font-medium text-[#94A3B8] uppercase tracking-wider">
                      Overall Utilization
                    </span>
                    <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mt-1">
                      {occupancyPercentage}% Filled
                    </h3>
                    <p className="text-[13px] text-[#94A3B8] mt-1">
                      {stats.occupied_rooms} Occupied • {stats.available_rooms} Available
                    </p>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex flex-col items-center justify-center font-bold text-xl shrink-0">
                    <span>{stats.total_rooms}</span>
                    <span className="text-[10px] text-slate-400 font-normal -mt-1">units</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>Resident Capacity Progress</span>
                    <span className="font-semibold text-white">
                      {stats.occupied_rooms} / {stats.total_rooms} Rooms
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-[#0F172A] rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
                    <span className="text-xs text-slate-400 block font-medium">Daily Attendance</span>
                    <span className="text-lg font-bold text-cyan-400 mt-0.5 block">
                      {stats.today_attendance_percentage}%
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
                    <span className="text-xs text-slate-400 block font-medium">Available Beds</span>
                    <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                      {stats.available_rooms}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
                    <span className="text-xs text-slate-400 block font-medium">Open Tickets</span>
                    <span className="text-lg font-bold text-amber-400 mt-0.5 block">
                      {stats.pending_complaints}
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Quick Actions Panel */}
          <div className="lg:col-span-5">
            <DashboardCard
              title="Administrative Quick Actions"
              subtitle="Common daily management shortcuts"
              icon={Sparkles}
            >
              <div className="space-y-3 pt-1">
                <Link to="/warden/attendance" className="block group">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1A2338] border border-white/[0.05] hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <CalendarCheck size={18} />
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-white">Daily Attendance</p>
                        <p className="text-[12px] text-[#94A3B8]">Record hostel presence</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </Link>

                <Link to="/warden/leaves" className="block group">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1A2338] border border-white/[0.05] hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                        <ClipboardList size={18} />
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-white">Leave Approvals</p>
                        <p className="text-[12px] text-[#94A3B8]">Review student out-pass requests</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                </Link>

                <Link to="/warden/complaints" className="block group">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1A2338] border border-white/[0.05] hover:border-red-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-white">Resolve Complaints</p>
                        <p className="text-[12px] text-[#94A3B8]">Inspect facility grievances</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />
                  </div>
                </Link>

                <Link to="/warden/fees" className="block group">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1A2338] border border-white/[0.05] hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <Receipt size={18} />
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-white">Fee Collection Report</p>
                        <p className="text-[12px] text-[#94A3B8]">View payment audits</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </Link>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Leave Requests Table Card */}
        <DashboardCard
          title="Recent Leave Requests"
          subtitle="Latest out-pass applications submitted by hostel students"
          icon={ClipboardList}
          action={
            <Link to="/warden/leaves">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                All Requests
              </Button>
            </Link>
          }
        >
          {recentLeaves.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No Pending Leaves"
              description="There are no recent leave applications awaiting review."
            />
          ) : (
            <div className="space-y-3 pt-1">
              {recentLeaves.map((leave, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white text-base">
                        {leave.username}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(leave.from_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        —{" "}
                        {new Date(leave.to_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{leave.reason}</p>
                  </div>

                  <Badge status={leave.status} size="md">
                    {leave.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </PageContainer>
    </WardenLayout>
  );
}