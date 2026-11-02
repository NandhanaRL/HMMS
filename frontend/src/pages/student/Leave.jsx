import { useEffect, useState } from "react";
import { CalendarDays, Send, Clock, Sparkles } from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import DashboardCard from "../../components/ui/DashboardCard";
import Input, { Textarea } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";

export default function Leave() {
  const [form, setForm] = useState({
    from_date: "",
    to_date: "",
    reason: "",
  });

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const loadLeaves = async () => {
    try {
      const { data } = await api.get("/student/leave");
      setLeaves(data.leaves || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const { data } = await api.get("/student/leave");
        setLeaves(data.leaves || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/student/leave", form);
      alert("Leave request submitted successfully.");
      setForm({
        from_date: "",
        to_date: "",
        reason: "",
      });
      loadLeaves();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit leave request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <PageContainer>
        <SectionHeader
          title="Leave Applications"
          description="Apply for night-out or semester vacation permissions and monitor warden approvals."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Permission Portal</span>
            </div>
          }
        />

        {/* Leave Form Card */}
        <DashboardCard
          title="Submit New Leave Request"
          subtitle="Requests are routed to your wing warden for authorized out-pass"
          icon={CalendarDays}
        >
          <form onSubmit={submitLeave} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Departure Date (From)"
                type="date"
                name="from_date"
                value={form.from_date}
                onChange={handleChange}
                required
              />

              <Input
                label="Return Date (To)"
                type="date"
                name="to_date"
                value={form.to_date}
                onChange={handleChange}
                required
              />
            </div>

            <Textarea
              label="Reason for Leave"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Provide destination, purpose of travel, and emergency contact details..."
              rows={3}
              required
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Send}
                loading={loading}
              >
                Submit Application
              </Button>
            </div>
          </form>
        </DashboardCard>

        {/* Leave History Card */}
        <DashboardCard
          title="Application History"
          subtitle="Review previous leave requests and their review statuses"
          icon={Clock}
        >
          {fetching ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Loading requests...
            </div>
          ) : leaves.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No Leave History"
              description="You have not submitted any leave applications yet."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dates Requested</TableHead>
                  <TableHead>Reason & Destination</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaves.map((leave) => (
                  <TableRow key={leave.leave_id}>
                    <TableCell>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <CalendarDays size={15} className="text-blue-400 shrink-0" />
                        <span>
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
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-300 font-medium">
                        {leave.reason}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-400 text-xs">
                        {new Date(leave.applied_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge status={leave.status}>
                        {leave.status}
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