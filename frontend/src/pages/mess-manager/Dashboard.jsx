import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CircleDollarSign,
  Receipt,
  ClipboardCheck,
  ArrowRight,
  TrendingUp,
  UtensilsCrossed,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import MessManagerLayout from "../../layouts/MessManagerLayout";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_students: 0,
    paid_fees: 0,
    pending_fees: 0,
    today_attendance: 0,
  });

  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const [dashRes, feesRes] = await Promise.allSettled([
          api.get("/mess-manager/dashboard"),
          api.get("/fees/report"),
        ]);

        if (!ignore) {
          if (dashRes.status === "fulfilled" && dashRes.value.data?.stats) {
            setStats(dashRes.value.data.stats);
          }
          if (feesRes.status === "fulfilled" && feesRes.value.data?.report) {
            setReport(feesRes.value.data.report);
          }
        }
      } catch (err) {
        console.error("Error loading mess manager dashboard data:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  // Compute financial totals from report or fallback to counts
  const totalPaidAmount = useMemo(() => {
    return report.reduce((sum, item) => sum + (Number(item.paid_amount) || 0), 0);
  }, [report]);

  const totalPendingAmount = useMemo(() => {
    return report.reduce((sum, item) => sum + (Number(item.pending_amount) || 0), 0);
  }, [report]);

  const totalAmount = totalPaidAmount + totalPendingAmount;
  const feeRate = totalAmount > 0
    ? Math.round((totalPaidAmount / totalAmount) * 100)
    : (Number(stats.paid_fees) + Number(stats.pending_fees)) > 0
      ? Math.round((Number(stats.paid_fees) / (Number(stats.paid_fees) + Number(stats.pending_fees))) * 100)
      : 0;

  // Compute attendance stats
  const totalStudents = Number(stats.total_students) || 0;
  const presentCount = Number(stats.today_attendance) || 0;
  const absentCount = Math.max(0, totalStudents - presentCount);
  const attendanceRate = totalStudents > 0
    ? Math.min(100, Math.round((presentCount / totalStudents) * 100))
    : 0;

  // Stat Cards Config
  const statCards = [
    {
      title: "Total Students",
      value: stats.total_students,
      icon: Users,
      iconBg: "bg-blue-600/10 text-blue-400 border border-blue-500/20",
      label: "Registered Boarders",
    },
    {
      title: "Paid Fees",
      value: stats.paid_fees,
      icon: CircleDollarSign,
      iconBg: "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20",
      label: "Accounts Cleared",
    },
    {
      title: "Pending Fees",
      value: stats.pending_fees,
      icon: Receipt,
      iconBg: "bg-amber-600/10 text-amber-400 border border-amber-500/20",
      label: "Dues Pending",
    },
    {
      title: "Today's Attendance",
      value: stats.today_attendance,
      icon: ClipboardCheck,
      iconBg: "bg-purple-600/10 text-purple-400 border border-purple-500/20",
      label: "Check-ins Today",
    },
  ];

  // Recent fee students (first 5 records)
  const recentPayments = useMemo(() => {
    return report.slice(0, 5);
  }, [report]);

  return (
    <MessManagerLayout>
      <div className="space-y-8 max-w-7xl mx-auto p-6 lg:p-8">
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[12px] font-medium text-blue-400">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                {greeting}, Mess Manager
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#F8FAFC] tracking-tight leading-tight">
              Mess Manager Dashboard
            </h1>
            <p className="text-[15px] text-[#94A3B8] mt-1 font-normal">
              Manage dining attendance, student payments, and kitchen operations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={UtensilsCrossed}
              onClick={() => navigate("/mess-manager/attendance")}
            >
              Mark Attendance
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={FileSpreadsheet}
              onClick={() => navigate("/mess-manager/fees")}
            >
              Fee Ledger
            </Button>
          </div>
        </div>

        {/* ================= STATISTICS ROW (4 CARDS) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="relative overflow-hidden bg-[#111827] border border-white/[0.06] rounded-3xl p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-smooth flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${card.iconBg} shrink-0`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium tracking-wider text-[#94A3B8] uppercase">
                    {card.label}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-[32px] font-bold text-[#F8FAFC] tracking-tight leading-tight">
                    {card.value !== undefined && card.value !== null ? card.value : "—"}
                  </div>
                  <div className="text-[13px] font-medium text-[#94A3B8]">
                    {card.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= MIDDLE SECTION (2 EQUAL-WIDTH CARDS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT CARD: Fee Collection Summary */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-soft">
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
              <div>
                <h2 className="text-lg sm:text-[24px] font-semibold text-[#F8FAFC]">
                  Fee Collection Summary
                </h2>
                <p className="text-[13px] text-[#94A3B8] mt-1">
                  Total revenue collected versus outstanding balances
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-6 space-y-6">
              {/* Amounts Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A2338] border border-white/[0.06] rounded-2xl p-4">
                  <div className="flex items-center justify-between text-[12px] text-[#94A3B8] mb-1">
                    <span>Paid Amount</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
                    {totalPaidAmount > 0 ? `₹${totalPaidAmount.toLocaleString("en-IN")}` : `${stats.paid_fees} Paid`}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1">
                    {stats.paid_fees} student invoices cleared
                  </p>
                </div>

                <div className="bg-[#1A2338] border border-white/[0.06] rounded-2xl p-4">
                  <div className="flex items-center justify-between text-[12px] text-[#94A3B8] mb-1">
                    <span>Pending Amount</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
                    {totalPendingAmount > 0 ? `₹${totalPendingAmount.toLocaleString("en-IN")}` : `${stats.pending_fees} Pending`}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1">
                    {stats.pending_fees} accounts requiring follow-up
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#94A3B8] font-medium">Clearance Rate</span>
                  <span className="text-[#F8FAFC] font-semibold">{feeRate}%</span>
                </div>
                <div className="w-full bg-[#0F172A] rounded-full h-2.5 p-0.5 border border-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2563EB] transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(4, feeRate))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1">
                  <span>Target: 100% Clearance</span>
                  <span>{stats.paid_fees} of {(Number(stats.paid_fees) + Number(stats.pending_fees))} accounts</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Today's Attendance Overview */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-soft">
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
              <div>
                <h2 className="text-lg sm:text-[24px] font-semibold text-[#F8FAFC]">
                  Today's Attendance Overview
                </h2>
                <p className="text-[13px] text-[#94A3B8] mt-1">
                  Live resident dining turnout and meal participation
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Circular Progress Gauge */}
              <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#0F172A]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#2563EB] transition-all duration-700 ease-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={
                      2 * Math.PI * 40 - ((2 * Math.PI * 40) * attendanceRate) / 100
                    }
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                    {attendanceRate}%
                  </span>
                  <span className="text-[10px] text-[#94A3B8] uppercase font-medium">Turnout</span>
                </div>
              </div>

              {/* Present / Absent Numbers */}
              <div className="flex-1 w-full space-y-3.5">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1A2338] border border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <div>
                      <div className="text-[14px] font-medium text-[#F8FAFC]">Present</div>
                      <div className="text-[11px] text-[#94A3B8]">Dined today</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-emerald-400">{presentCount}</div>
                    <div className="text-[10px] text-[#94A3B8]">{totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0}% of roster</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1A2338] border border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div>
                      <div className="text-[14px] font-medium text-[#F8FAFC]">Absent</div>
                      <div className="text-[11px] text-[#94A3B8]">Not checked in</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-rose-400">{absentCount}</div>
                    <div className="text-[10px] text-[#94A3B8]">{totalStudents > 0 ? Math.round((absentCount / totalStudents) * 100) : 0}% of roster</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM SECTION (2 LARGE CARDS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Recent Fee Payments */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-soft">
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
              <div>
                <h2 className="text-lg sm:text-[24px] font-semibold text-[#F8FAFC]">
                  Recent Fee Payments
                </h2>
                <p className="text-[13px] text-[#94A3B8] mt-1">
                  Latest student dues and transaction records
                </p>
              </div>
              <button
                onClick={() => navigate("/mess-manager/fees")}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-6">
              {loading ? (
                <div className="py-12 text-center text-[#94A3B8] text-sm">
                  Loading recent transactions...
                </div>
              ) : recentPayments.length === 0 ? (
                <div className="py-12 text-center text-[#94A3B8] text-sm">
                  <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  No fee records found in system.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPayments.map((student) => {
                    const total = Number(student.total_amount) || 0;
                    const paid = Number(student.paid_amount) || 0;
                    const pending = Number(student.pending_amount) || 0;
                    const status = pending <= 0 && total > 0 ? "PAID" : paid > 0 ? "PARTIAL" : "PENDING";

                    return (
                      <div
                        key={student.student_id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1A2338] border border-white/[0.05] hover:bg-[#202B44] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar name={student.username} size="sm" />
                          <div>
                            <div className="font-medium text-[#F8FAFC] text-[14px]">
                              {student.username}
                            </div>
                            <div className="text-[12px] font-mono text-[#94A3B8]">
                              Roll No: {student.roll_no}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-[14px] font-mono font-medium text-white">
                              ₹{total.toLocaleString("en-IN")}
                            </div>
                            <div className="text-[11px] font-mono text-emerald-400">
                              Paid: ₹{paid.toLocaleString("en-IN")}
                            </div>
                          </div>
                          <Badge status={status}>{status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Quick Actions */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-soft">
            <div className="pb-6 border-b border-white/[0.06]">
              <h2 className="text-lg sm:text-[24px] font-semibold text-[#F8FAFC]">
                Quick Actions
              </h2>
              <p className="text-[13px] text-[#94A3B8] mt-1">
                Frequently accessed dining operations and reporting tools
              </p>
            </div>

            <div className="pt-6 space-y-4">
              {/* Action 1: Mark Attendance */}
              <div
                onClick={() => navigate("/mess-manager/attendance")}
                className="group p-5 rounded-2xl bg-[#1A2338] hover:bg-[#202B44] border border-white/[0.06] hover:border-purple-500/40 shadow-soft cursor-pointer transition-smooth hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#F8FAFC]">
                        Mark Attendance
                      </h3>
                      <p className="text-[13px] text-[#94A3B8] mt-0.5">
                        Log breakfast, lunch, and dinner check-ins for residents
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#94A3B8] group-hover:text-white group-hover:bg-[#2563EB] transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Action 2: View Fee Report */}
              <div
                onClick={() => navigate("/mess-manager/fees")}
                className="group p-5 rounded-2xl bg-[#1A2338] hover:bg-[#202B44] border border-white/[0.06] hover:border-blue-500/40 shadow-soft cursor-pointer transition-smooth hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#F8FAFC]">
                        View Fee Report
                      </h3>
                      <p className="text-[13px] text-[#94A3B8] mt-0.5">
                        Audit student payment records, arrears, and fee receipts
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#94A3B8] group-hover:text-white group-hover:bg-[#2563EB] transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Information pill */}
              <div className="p-3.5 rounded-2xl bg-[#1A2338] border border-white/[0.05] flex items-center justify-between text-[13px] text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Mess operations active: Next service session is scheduled on time.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MessManagerLayout>
  );
}