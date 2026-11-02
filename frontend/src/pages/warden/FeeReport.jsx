import { useEffect, useState } from "react";
import { RotateCw, Sparkles, CheckCircle2, Clock, Receipt } from "lucide-react";
import WardenLayout from "../../layouts/WardenLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import DashboardCard from "../../components/ui/DashboardCard";
import SearchBar from "../../components/ui/SearchBar";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";

export default function FeeReport() {
  const [report, setReport] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const { data } = await api.get("/fees/report");
        setReport(data.report || []);
      } catch (err) {
        console.error("Error loading fee report:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/fees/report");
      setReport(data.report || []);
    } catch (err) {
      console.error("Error loading fee report:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = report.filter(
    (item) =>
      item.username?.toLowerCase().includes(search.toLowerCase()) ||
      item.roll_no?.toLowerCase().includes(search.toLowerCase())
  );

  const totalFeeCollected = report.reduce(
    (sum, r) => sum + Number(r.paid_amount || 0),
    0
  );
  const totalFeePending = report.reduce(
    (sum, r) => sum + Number(r.pending_amount || 0),
    0
  );

  return (
    <WardenLayout>
      <PageContainer>
        <SectionHeader
          title="Fee Collection Report"
          description="Campus revenue tracking, student balance verification, and collection summaries."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Accounts & Billing Audit</span>
            </div>
          }
          action={
            <Button
              variant="secondary"
              size="md"
              icon={RotateCw}
              loading={loading}
              onClick={handleRefresh}
            >
              Sync Dues
            </Button>
          }
        />

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Revenue Collected"
            value={`₹${totalFeeCollected.toLocaleString("en-IN")}`}
            subtitle="Verified payment receipts cleared"
            icon={CheckCircle2}
            color="green"
            trend="Active Ledger"
            trendPositive={true}
          />

          <StatCard
            title="Total Outstanding Dues"
            value={`₹${totalFeePending.toLocaleString("en-IN")}`}
            subtitle="Pending student semester dues"
            icon={Clock}
            color={totalFeePending > 0 ? "amber" : "cyan"}
            trend={totalFeePending === 0 ? "Zero Dues" : "Follow-up Needed"}
            trendPositive={totalFeePending === 0}
          />
        </div>

        {/* Student Fee Records Table */}
        <DashboardCard
          title="Resident Payment Status"
          subtitle={`${filtered.length} student records found`}
          icon={Receipt}
          action={
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or roll no..."
              className="w-full sm:w-72"
            />
          }
        >
          {loading ? (
            <LoadingSpinner label="Auditing fee records..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No Records Found"
              description={
                search
                  ? `No payment logs match "${search}".`
                  : "No fee records currently loaded."
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Resident</TableHead>
                  <TableHead>Room Allocation</TableHead>
                  <TableHead>Settled Amount</TableHead>
                  <TableHead>Remaining Balance</TableHead>
                  <TableHead>Account Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const hasDues = Number(item.pending_amount || 0) > 0;

                  return (
                    <TableRow key={item.student_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={item.username} size="sm" />
                          <div>
                            <p className="font-semibold text-white">
                              {item.username}
                            </p>
                            <p className="text-xs text-slate-400">
                              Roll No: #{item.roll_no}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {item.room_number ? (
                          <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                            Room {item.room_number}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Unassigned</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-emerald-400 text-sm">
                          ₹{Number(item.paid_amount || 0).toLocaleString("en-IN")}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`font-bold text-sm ${
                            hasDues ? "text-amber-400" : "text-slate-400"
                          }`}
                        >
                          ₹{Number(item.pending_amount || 0).toLocaleString("en-IN")}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge status={hasDues ? "PENDING" : "PAID"}>
                          {hasDues ? "Dues Pending" : "Fully Cleared"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DashboardCard>
      </PageContainer>
    </WardenLayout>
  );
}
