import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";
import {
  Bed,
  CalendarCheck,
  CircleDollarSign,
  FileText,
  Utensils,
  Bell,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Wifi,
  Zap,
} from "lucide-react";
import PageContainer from "../../components/ui/PageContainer";
import StatCard from "../../components/ui/StatCard";
import DashboardCard from "../../components/ui/DashboardCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Student",
  };

  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // Fetch Room
      try {
        const { data } = await api.get("/student/my-room");
        setRoomData(data.room || null);
      } catch {
        try {
          const { data } = await api.get("/rooms/my-room");
          setRoomData(data.room || null);
        } catch {
          setRoomData(null);
        }
      }

      // Fetch Attendance
      try {
        const { data } = await api.get("/student/my-attendance");
        setAttendanceData(data.summary || null);
      } catch {
        setAttendanceData(null);
      }

      // Fetch Fees
      try {
        const { data } = await api.get("/fees/student");
        const fees = data.fees || [];
        const total = fees.reduce((acc, f) => acc + Number(f.amount || 0), 0);
        const paid = fees
          .filter((f) => f.status === "PAID")
          .reduce((acc, f) => acc + Number(f.amount || 0), 0);
        const pending = fees
          .filter((f) => f.status !== "PAID")
          .reduce((acc, f) => acc + Number(f.amount || 0), 0);

        setFeeData({ total, paid, pending, count: fees.length });
      } catch {
        setFeeData(null);
      }

      // Fetch Leave
      try {
        const { data } = await api.get("/student/leave");
        const leaves = data.leaves || [];
        const latest = leaves.length > 0 ? leaves[0] : null;
        const pendingCount = leaves.filter((l) => l.status === "PENDING").length;

        setLeaveData({ latest, total: leaves.length, pendingCount });
      } catch {
        setLeaveData(null);
      }

      // Fetch Mess Menu
      try {
        const { data } = await api.get("/mess/menu");
        if (data.menu && data.menu.length > 0) {
          setMenuItems(data.menu);
        }
      } catch {
        // fallback meals will be used
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const defaultMeals = [
    { meal: "Breakfast", food: "Idli, Vada, Sambar & Chutney", time: "7:30 AM - 9:00 AM" },
    { meal: "Lunch", food: "Steamed Rice, Paneer Curry & Dal Fry", time: "12:30 PM - 2:00 PM" },
    { meal: "Snacks", food: "Samosa & Masala Tea", time: "4:30 PM - 5:30 PM" },
    { meal: "Dinner", food: "Warm Roti, Mix Veg & Steamed Rice", time: "7:30 PM - 9:00 PM" },
  ];

  const meals =
    menuItems.length > 0
      ? menuItems.map((m) => ({
          meal: m.meal_type,
          food: m.name,
          time:
            m.meal_type === "Breakfast"
              ? "7:30 AM - 9:00 AM"
              : m.meal_type === "Lunch"
              ? "12:30 PM - 2:00 PM"
              : m.meal_type === "Snacks"
              ? "4:30 PM - 5:30 PM"
              : "7:30 PM - 9:00 PM",
        }))
      : defaultMeals;

  const feeStatusText =
    feeData?.pending === 0 && feeData?.count > 0
      ? "Paid"
      : feeData?.pending > 0
      ? `₹${feeData.pending.toLocaleString("en-IN")} Due`
      : "No Dues";

  const leaveStatusText = leaveData?.latest
    ? leaveData.latest.status.charAt(0) +
      leaveData.latest.status.slice(1).toLowerCase()
    : "No Leaves";

  const attendancePercentage = attendanceData?.percentage || 0;
  const strokeDashoffset = 283 - (283 * Math.min(attendancePercentage, 100)) / 100;

  const notices = [
    {
      title: "Hostel Wi-Fi Upgrade",
      time: "Today, 10:00 AM",
      desc: "High-speed 1 Gbps fiber connectivity is now live across all wings.",
      tag: "Maintenance",
    },
    {
      title: "Mess Committee Review",
      time: "Yesterday",
      desc: "Monthly mess feedback survey is open. Share your meal preferences.",
      tag: "Dining",
    },
    {
      title: "Weekend Night Curfew",
      time: "2 days ago",
      desc: "Standard entry gates close at 10:30 PM. Use digital leave for late entry.",
      tag: "Rule",
    },
  ];

  return (
    <StudentLayout>
      <PageContainer>
        {/* Top: Welcome & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="flex items-start sm:items-center gap-4">
            <Avatar name={user.username} size="lg" status="online" className="shrink-0" />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <ShieldCheck size={14} />
                <span>Campus Resident Portal</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-normal">{todayFormatted}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[42px] font-bold tracking-tight text-white leading-tight">
                {greeting}, {user.username} 👋
              </h1>

              <p className="text-[15px] text-[#94A3B8] max-w-2xl font-normal leading-relaxed">
                Here is your live hostel residency, dining schedule, and attendance dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/student/leave">
              <Button variant="secondary" size="md">
                Request Leave
              </Button>
            </Link>
            <Link to="/student/fees">
              <Button variant="primary" size="md">
                Pay Fees
              </Button>
            </Link>
          </div>
        </div>

        {/* Top: Four Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Link to="/student/attendance" className="block group">
            <StatCard
              title="Attendance Rate"
              value={loading ? "..." : `${attendancePercentage}%`}
              subtitle={
                attendanceData
                  ? `${attendanceData.present} present out of ${attendanceData.total} sessions`
                  : "Daily campus check-in active"
              }
              icon={CalendarCheck}
              color="cyan"
              trend={attendancePercentage >= 75 ? "Compliant" : "Needs Review"}
              trendPositive={attendancePercentage >= 75}
            />
          </Link>

          <Link to="/student/room" className="block group">
            <StatCard
              title="My Room"
              value={
                loading
                  ? "..."
                  : roomData?.room_number
                  ? `Room ${roomData.room_number}`
                  : "Unassigned"
              }
              subtitle={
                roomData
                  ? `${roomData.room_type} Room • ${roomData.occupied_count}/${roomData.capacity} Occupied`
                  : "Awaiting Warden allocation"
              }
              icon={Bed}
              color="blue"
            />
          </Link>

          <Link to="/student/fees" className="block group">
            <StatCard
              title="Hostel & Mess Fees"
              value={loading ? "..." : feeStatusText}
              subtitle={
                feeData
                  ? `₹${feeData.paid.toLocaleString("en-IN")} cleared • ₹${feeData.total.toLocaleString("en-IN")} total`
                  : "Checking pending dues..."
              }
              icon={CircleDollarSign}
              color={feeData?.pending > 0 ? "amber" : "green"}
              trend={feeData?.pending === 0 ? "All Clear" : "Due Soon"}
              trendPositive={feeData?.pending === 0}
            />
          </Link>

          <Link to="/student/leave" className="block group">
            <StatCard
              title="Leave Applications"
              value={loading ? "..." : leaveStatusText}
              subtitle={
                leaveData
                  ? `${leaveData.pendingCount} pending review • ${leaveData.total} applied`
                  : "No leave requests on file"
              }
              icon={FileText}
              color="purple"
            />
          </Link>
        </div>

        {/* Middle: Two Large Cards (Room Info & Attendance Ring) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Card 1: Room Information */}
          <div className="lg:col-span-7">
            <DashboardCard
              title="Room Information"
              subtitle="Allocated residency details and hostel block amenities"
              icon={Bed}
              className="h-full"
              action={
                <Link to="/student/room">
                  <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                    Room Details
                  </Button>
                </Link>
              }
            >
              {roomData ? (
                <div className="space-y-6 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1A2338]/60 border border-white/10">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Assigned Unit
                      </span>
                      <h4 className="text-3xl font-bold text-white tracking-tight mt-0.5">
                        Room {roomData.room_number}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Block A • Student Residential Wing
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="primary">{roomData.room_type}</Badge>
                      <Badge status={roomData.occupied_count >= roomData.capacity ? "FULL" : "AVAILABLE"}>
                        {roomData.occupied_count >= roomData.capacity ? "Fully Occupied" : "Has Space"}
                      </Badge>
                    </div>
                  </div>

                  {/* Occupancy Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Bed Occupancy</span>
                      <span className="text-white font-semibold">
                        {roomData.occupied_count} of {roomData.capacity} Beds Filled
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-[#0F172A] rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (roomData.occupied_count / (roomData.capacity || 1)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Amenities Features */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <Wifi size={18} className="text-blue-400" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">Wi-Fi 6</p>
                        <p className="text-[10px] text-slate-400">Unlimited 1 Gbps</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <Zap size={18} className="text-amber-400" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">24/7 Power</p>
                        <p className="text-[10px] text-slate-400">DG Backup</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] col-span-2 sm:col-span-1">
                      <CheckCircle2 size={18} className="text-emerald-400" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">Housekeeping</p>
                        <p className="text-[10px] text-slate-400">Weekly Cleaned</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <Bed size={28} />
                  </div>
                  <h4 className="text-base font-semibold text-white">No Room Allocated Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Your room allocation is being processed by the Warden office. Check back soon.
                  </p>
                </div>
              )}
            </DashboardCard>
          </div>

          {/* Card 2: Attendance Progress Ring */}
          <div className="lg:col-span-5">
            <DashboardCard
              title="Attendance Status"
              subtitle="Mandatory 75% attendance compliance tracking"
              icon={CalendarCheck}
              className="h-full"
              action={
                <Link to="/student/attendance">
                  <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                    History
                  </Button>
                </Link>
              }
            >
              <div className="flex flex-col items-center justify-center py-4 space-y-6">
                {/* Visual SVG Ring */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#0F172A"
                      strokeWidth="8"
                    />
                    {/* Progress indicator */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="url(#blue-gradient)"
                      strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {attendancePercentage}%
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      Recorded
                    </span>
                  </div>
                </div>

                {/* Statistics Footer */}
                <div className="grid grid-cols-2 gap-4 w-full pt-2">
                  <div className="p-3 rounded-2xl bg-[#1A2338] border border-white/[0.05] text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Present Days</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {attendanceData?.present ?? 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#1A2338] border border-white/[0.05] text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Total Sessions</span>
                    <span className="text-lg font-bold text-white">
                      {attendanceData?.total ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Bottom: Three Balanced Cards (Today's Menu, Recent Attendance, Notices) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Card 1: Today's Menu */}
          <DashboardCard
            title="Today's Mess Menu"
            subtitle="Fresh daily meal schedule"
            icon={Utensils}
            action={
              <Link to="/student/mess">
                <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                  Full Menu
                </Button>
              </Link>
            }
          >
            <div className="space-y-3">
              {meals.map((item) => (
                <div
                  key={item.meal}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1A2338]/60 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                        {item.meal}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        • {item.time}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-200 truncate mt-0.5">
                      {item.food}
                    </p>
                  </div>
                  <Badge variant="neutral" size="sm" dot={false}>
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Card 2: Recent Activity / Status */}
          <DashboardCard
            title="Recent Activity"
            subtitle="Campus residence milestones"
            icon={Bell}
          >
            <div className="space-y-3.5">
              <div className="flex gap-3.5 p-3 rounded-2xl bg-[#1A2338] border border-white/[0.05]">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Bed size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    {roomData
                      ? `Allocated Room ${roomData.room_number}`
                      : "Pending Room Allocation"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {roomData
                      ? `Capacity for ${roomData.capacity} students`
                      : "Warden review pending"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 p-3 rounded-2xl bg-[#1A2338] border border-white/[0.05]">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <CalendarCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Attendance Logged</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {attendanceData && attendanceData.total > 0
                      ? `${attendanceData.percentage}% overall attendance recorded`
                      : "Attendance tracking active"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 p-3 rounded-2xl bg-[#1A2338] border border-white/[0.05]">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Leave Status</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {leaveData?.latest
                      ? `Latest: ${leaveData.latest.reason} (${leaveData.latest.status})`
                      : "No leaves applied this month"}
                  </p>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Card 3: Hostel Notices */}
          <DashboardCard
            title="Hostel Notices"
            subtitle="Campus announcements and circulars"
            icon={Clock}
          >
            <div className="space-y-3.5">
              {notices.map((notice, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#1A2338]/60 border border-white/5 hover:border-white/10 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {notice.title}
                    </span>
                    <Badge variant={idx === 0 ? "primary" : idx === 1 ? "purple" : "warning"} size="sm" dot={false}>
                      {notice.tag}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {notice.desc}
                  </p>
                  <span className="text-[10px] text-slate-500 block pt-0.5">
                    {notice.time}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </PageContainer>
    </StudentLayout>
  );
}