import { useEffect, useState, useMemo } from "react";
import {
  Receipt,
  CircleDollarSign,
  AlertCircle,
  Search,
  CheckCircle2,
} from "lucide-react";
import MessManagerLayout from "../../layouts/MessManagerLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import DashboardCard from "../../components/ui/DashboardCard";
import SearchBar from "../../components/ui/SearchBar";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function FeeReport() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "paid" | "pending"

  useEffect(() => {
    let ignore = false;
    const fetchReport = async () => {
      try {
        const { data } = await api.get("/fees/report");
        if (!ignore) {
          setReport(data.report || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchReport();
    return () => {
      ignore = true;
    };
  }, []);

  const totalAssessed = useMemo(() => {
    return report.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0);
  }, [report]);

  const totalPaid = useMemo(() => {
    return report.reduce((sum, item) => sum + (Number(item.paid_amount) || 0), 0);
  }, [report]);

  const totalPending = useMemo(() => {
    return report.reduce((sum, item) => sum + (Number(item.pending_amount) || 0), 0);
  }, [report]);

  const clearedStudents = useMemo(() => {
    return report.filter((item) => Number(item.pending_amount) <= 0).length;
  }, [report]);

  const filteredReport = useMemo(() => {
    return report.filter((item) => {
      const name = String(item.username || "").toLowerCase();
      const roll = String(item.roll_no || "").toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = name.includes(q) || roll.includes(q);

      if (!matchesSearch) return false;

      if (filter === "paid") return Number(item.pending_amount) <= 0;
      if (filter === "pending") return Number(item.pending_amount) > 0;
      return true;
    });
  }, [report, search, filter]);

  const collectionRate = totalAssessed > 0
    ? `${Math.round((totalPaid / totalAssessed) * 100)}% Cleared`
    : "0%";

  return (
    <MessManagerLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Mess & Hostel Fee Report"
          subtitle="Audit resident billing ledgers, fee collections, and outstanding student arrears."
        />

        {/* Finance KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Assessed"
            value={`₹${totalAssessed.toLocaleString()}`}
            icon={Receipt}
            color="blue"
            trend={`${report.length} Accounts`}
            trendPositive={true}
          />
          <StatCard
            title="Total Collected"
            value={`₹${totalPaid.toLocaleString()}`}
            icon={CircleDollarSign}
            color="emerald"
            trend={collectionRate}
            trendPositive={true}
          />
          <StatCard
            title="Total Outstanding"
            value={`₹${totalPending.toLocaleString()}`}
            icon={AlertCircle}
            color="amber"
            trend="Pending Recovery"
            trendPositive={false}
          />
          <StatCard
            title="Fully Cleared"
            value={`${clearedStudents} / ${report.length}`}
            icon={CheckCircle2}
            color="purple"
            trend="Zero Balance"
            trendPositive={true}
          />
        </div>

        {/* Main Table Card */}
        <DashboardCard
          title="Resident Financial Ledger"
          subtitle="Itemized breakdown of student payment records and balances"
          icon={Receipt}
          action={
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0F172A] border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    filter === "all"
                      ? "bg-[#2563EB] text-white shadow-soft"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({report.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("paid")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    filter === "paid"
                      ? "bg-[#16A34A] text-white shadow-soft"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Cleared
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    filter === "pending"
                      ? "bg-[#D97706] text-white shadow-soft"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Pending
                </button>
              </div>

              <div className="w-56">
                <SearchBar
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by roll or name..."
                />
              </div>
            </div>
          }
        >
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" text="Loading financial records..." />
            </div>
          ) : filteredReport.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No fee records found"
              description={search ? `No student matched "${search}".` : "No financial ledger entries exist."}
              action={search ? <Button variant="secondary" onClick={() => setSearch("")}>Reset Search</Button> : null}
            />
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-white/10 shadow-card">
              <table className="w-full text-left text-[15px] text-slate-300">
                <thead className="sticky top-0 z-10 bg-[#0F172A] text-[15px] font-medium text-slate-300 tracking-normal border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Roll Number</th>
                    <th className="px-6 py-4 text-right">Total Assessed</th>
                    <th className="px-6 py-4 text-right">Amount Paid</th>
                    <th className="px-6 py-4 text-right">Outstanding</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#111827]">
                  {filteredReport.map((student) => {
                    const total = Number(student.total_amount) || 0;
                    const paid = Number(student.paid_amount) || 0;
                    const pending = Number(student.pending_amount) || 0;
                    const isFullyPaid = pending <= 0 && total > 0;
                    const isPartial = paid > 0 && pending > 0;

                    return (
                      <tr
                        key={student.student_id}
                        className="hover:bg-[#1A2338]/60 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={student.username} size="sm" />
                            <div>
                              <div className="font-semibold text-[#F8FAFC]">{student.username}</div>
                              <div className="text-[13px] text-slate-400">Resident ID #{student.student_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-400 text-xs">
                          {student.roll_no}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-semibold text-[#F8FAFC]">
                          ₹{total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-semibold text-[#16A34A]">
                          ₹{paid.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-semibold text-[#D97706]">
                          ₹{pending.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isFullyPaid ? (
                            <Badge status="PAID">Cleared</Badge>
                          ) : isPartial ? (
                            <Badge status="PENDING">Partial</Badge>
                          ) : (
                            <Badge status="UNPAID">Unpaid</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </DashboardCard>
      </div>
    </MessManagerLayout>
  );
}