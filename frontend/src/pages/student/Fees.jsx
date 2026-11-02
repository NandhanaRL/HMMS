import { useEffect, useState } from "react";
import {
  CircleDollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  RotateCw,
  Sparkles,
} from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";
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
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFees = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/fees/student");
      setFees(data.fees || []);
    } catch (err) {
      console.error("Error fetching fees:", err);
      setError(err.response?.data?.message || "Failed to load fee details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialFees = async () => {
      try {
        const { data } = await api.get("/fees/student");
        setFees(data.fees || []);
      } catch (err) {
        console.error("Error fetching fees:", err);
        setError(err.response?.data?.message || "Failed to load fee details.");
      } finally {
        setLoading(false);
      }
    };
    loadInitialFees();
  }, []);

  const totalAmount = fees.reduce(
    (sum, fee) => sum + Number(fee.amount || 0),
    0
  );

  const paidAmount = fees
    .filter((fee) => fee.status === "PAID")
    .reduce((sum, fee) => sum + Number(fee.amount || 0), 0);

  const pendingAmount = fees
    .filter((fee) => fee.status !== "PAID")
    .reduce((sum, fee) => sum + Number(fee.amount || 0), 0);

  return (
    <StudentLayout>
      <PageContainer>
        <SectionHeader
          title="Fees & Accounts"
          description="Track scheduled semester charges, hostel dues, dining subscriptions, and payment history."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Financial Ledger</span>
            </div>
          }
          action={
            <Button
              variant="secondary"
              size="md"
              icon={RotateCw}
              loading={loading}
              onClick={fetchFees}
            >
              Refresh
            </Button>
          }
        />

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchFees}>
              Retry
            </Button>
          </div>
        )}

        {/* Top Financial Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Invoiced"
            value={`₹${totalAmount.toLocaleString("en-IN")}`}
            subtitle="Aggregate charges for the active session"
            icon={CircleDollarSign}
            color="blue"
          />

          <StatCard
            title="Paid Amount"
            value={`₹${paidAmount.toLocaleString("en-IN")}`}
            subtitle="Verified transactions and settlements"
            icon={CheckCircle}
            color="green"
            trend={totalAmount > 0 && paidAmount >= totalAmount ? "100% Cleared" : undefined}
            trendPositive={true}
          />

          <StatCard
            title="Pending Dues"
            value={`₹${pendingAmount.toLocaleString("en-IN")}`}
            subtitle={
              pendingAmount === 0
                ? "No outstanding obligations"
                : "Payment required before term clearance"
            }
            icon={Clock}
            color={pendingAmount > 0 ? "amber" : "cyan"}
            trend={pendingAmount === 0 ? "All Clear" : "Action Needed"}
            trendPositive={pendingAmount === 0}
          />
        </div>

        {/* Fee Statement Table */}
        <DashboardCard
          title="Fee Breakdown & Schedules"
          subtitle="Detailed breakdown of campus room allotment, amenities, and meal plans"
          icon={CircleDollarSign}
        >
          {loading ? (
            <LoadingSpinner label="Fetching invoice items..." />
          ) : fees.length === 0 ? (
            <EmptyState
              icon={CircleDollarSign}
              title="No Invoices Issued"
              description="You have no hostel or mess fees assigned to your account for this cycle."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.fee_id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-white">
                          {fee.fee_type || "Semester Maintenance"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ID: #{fee.fee_id} • Standard Resident Rate
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-base text-white">
                        ₹{Number(fee.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-300 font-medium">
                        {fee.due_date
                          ? new Date(fee.due_date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "30-Day Cycle"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge status={fee.status}>
                        {fee.status === "PAID" ? "Settled" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DashboardCard>
      </PageContainer>
    </StudentLayout>
  );
}
