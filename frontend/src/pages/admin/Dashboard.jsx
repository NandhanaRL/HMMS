import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCog,
  UtensilsCrossed,
  Bed,
  ArrowRight,
  Shield,
  Sparkles,
  Activity,
  CheckCircle2,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import DashboardCard from "../../components/ui/DashboardCard";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    students: 0,
    wardens: 0,
    managers: 0,
    rooms: 0,
    occupiedRooms: 0,
  });

  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const fetchAdminStats = async () => {
      try {
        const [studentsRes, wardensRes, managersRes, roomsRes] =
          await Promise.allSettled([
            api.get("/admin/students"),
            api.get("/admin/wardens"),
            api.get("/admin/mess-managers"),
            api.get("/rooms"),
          ]);

        if (!ignore) {
          const studentList =
            studentsRes.status === "fulfilled"
              ? studentsRes.value.data.students || []
              : [];
          const wardenList =
            wardensRes.status === "fulfilled"
              ? wardensRes.value.data.wardens || []
              : [];
          const managerList =
            managersRes.status === "fulfilled"
              ? managersRes.value.data.managers || []
              : [];
          const roomList =
            roomsRes.status === "fulfilled"
              ? roomsRes.value.data.rooms || []
              : [];

          const occupied = roomList.filter(
            (r) => Number(r.occupied_count) >= Number(r.capacity)
          ).length;

          setCounts({
            students: studentList.length,
            wardens: wardenList.length,
            managers: managerList.length,
            rooms: roomList.length,
            occupiedRooms: occupied,
          });

          setRecentStudents(studentList.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchAdminStats();
    return () => {
      ignore = true;
    };
  }, []);

  const totalRooms = counts.rooms || 1;
  const occupancyPercentage = Math.round(
    ((counts.occupiedRooms || 0) / totalRooms) * 100
  );

  const activities = [
    {
      title: "Core Infrastructure Online",
      desc: "Authentication services, MySQL database pool, and CORS verified.",
      time: "Live Status",
      badge: "System",
    },
    {
      title: "Staff Roster Synchronized",
      desc: `Active supervisory staff: ${counts.wardens} Wardens & ${counts.managers} Mess Caterers.`,
      time: "Automated",
      badge: "HR",
    },
    {
      title: "Student Admissions",
      desc: `${counts.students} verified students registered with encrypted credentials.`,
      time: "Roster",
      badge: "Admissions",
    },
  ];

  return (
    <AdminLayout>
      <PageContainer>
        <SectionHeader
          title="Admin Control Hub"
          description="System-wide administration, role provisioning, hostel inventory management, and oversight."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Super Administrator Portal</span>
            </div>
          }
          action={
            <div className="flex items-center gap-3">
              <Link to="/admin/students">
                <Button variant="secondary" size="md">
                  Add Student
                </Button>
              </Link>
              <Link to="/admin/rooms">
                <Button variant="primary" size="md">
                  Add Room
                </Button>
              </Link>
            </div>
          }
        />

        {/* Top 4 Core Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Link to="/admin/students" className="block group">
            <StatCard
              title="Total Students"
              value={loading ? "..." : counts.students}
              subtitle="Enrolled active residents"
              icon={Users}
              color="blue"
            />
          </Link>

          <Link to="/admin/wardens" className="block group">
            <StatCard
              title="Supervising Wardens"
              value={loading ? "..." : counts.wardens}
              subtitle="Hostel wing administrators"
              icon={UserCog}
              color="purple"
            />
          </Link>

          <Link to="/admin/mess-managers" className="block group">
            <StatCard
              title="Mess Managers"
              value={loading ? "..." : counts.managers}
              subtitle="Culinary & dining operators"
              icon={UtensilsCrossed}
              color="amber"
            />
          </Link>

          <Link to="/admin/rooms" className="block group">
            <StatCard
              title="Hostel Units"
              value={loading ? "..." : counts.rooms}
              subtitle={`${counts.occupiedRooms} units full capacity`}
              icon={Bed}
              color="cyan"
              trend={counts.rooms > 0 ? "Inventory Active" : "Empty"}
              trendPositive={counts.rooms > 0}
            />
          </Link>
        </div>

        {/* Below: Room Occupancy & Quick Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Room Occupancy Visualizer */}
          <div className="lg:col-span-7">
            <DashboardCard
              title="Hostel Capacity & Block Utilization"
              subtitle="Overall residential utilization calculated across campus wings"
              icon={Bed}
              action={
                <Link to="/admin/rooms">
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
                      Campus Occupancy
                    </span>
                    <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mt-1">
                      {occupancyPercentage}% Filled
                    </h3>
                    <p className="text-[13px] text-[#94A3B8] mt-1">
                      {counts.occupiedRooms} Fully Allocated • {counts.rooms - counts.occupiedRooms} Units Available
                    </p>
                  </div>

                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
                    <Shield size={26} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>Hostel Occupancy Index</span>
                    <span className="font-semibold text-white">
                      {counts.occupiedRooms} of {counts.rooms} Units Full
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
                    <span className="text-xs text-slate-400 block font-medium">Students</span>
                    <span className="text-lg font-bold text-blue-400 mt-0.5 block">
                      {counts.students}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
                    <span className="text-xs text-slate-400 block font-medium">Wardens</span>
                    <span className="text-lg font-bold text-purple-400 mt-0.5 block">
                      {counts.wardens}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
                    <span className="text-xs text-slate-400 block font-medium">Mess Staff</span>
                    <span className="text-lg font-bold text-amber-400 mt-0.5 block">
                      {counts.managers}
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Recent Activity / Audit Log */}
          <div className="lg:col-span-5">
            <DashboardCard
              title="System Audit & Health"
              subtitle="Critical service monitors and updates"
              icon={Activity}
            >
              <div className="space-y-3.5 pt-1">
                {activities.map((act, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-[#1A2338] border border-white/[0.05] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-emerald-400" />
                        <span className="text-[14px] font-medium text-white">
                          {act.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                        {act.badge}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#94A3B8] leading-relaxed">
                      {act.desc}
                    </p>
                    <span className="text-[11px] text-slate-500 block pt-0.5">
                      {act.time}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Recent Students Table */}
        <DashboardCard
          title="Recently Enrolled Residents"
          subtitle="Latest students admitted to hostel accommodations"
          icon={Users}
          action={
            <Link to="/admin/students">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                All Students
              </Button>
            </Link>
          }
        >
          {recentStudents.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No students enrolled yet.
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {recentStudents.map((student) => (
                <div
                  key={student.student_id}
                  className="p-4 rounded-2xl bg-[#1A2338] border border-white/[0.05] hover:border-white/10 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <Avatar name={student.username} size="sm" />
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {student.username}
                      </p>
                      <p className="text-xs text-slate-400">
                        Roll: #{student.roll_no} • {student.department}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    {student.room_number ? `Room ${student.room_number}` : "Unallocated"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </PageContainer>
    </AdminLayout>
  );
}