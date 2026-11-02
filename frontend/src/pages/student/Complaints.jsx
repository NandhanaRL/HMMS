import { useEffect, useState } from "react";
import {
  MessageSquare,
  Send,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import DashboardCard from "../../components/ui/DashboardCard";
import { Select, Textarea } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function Complaints() {
  const [form, setForm] = useState({
    category: "ROOM",
    description: "",
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadComplaints = async () => {
    try {
      const { data } = await api.get("/student/complaint");
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error("Error loading complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/student/complaint");
        setComplaints(data.complaints || []);
      } catch (err) {
        console.error("Error loading complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/student/complaint", form);
      alert("Complaint registered successfully.");
      setForm({
        category: "ROOM",
        description: "",
      });
      loadComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout>
      <PageContainer>
        <SectionHeader
          title="Support & Complaints"
          description="Register facility maintenance issues, room repairs, and dining grievances directly with campus staff."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Grievance Desk</span>
            </div>
          }
        />

        {/* File Complaint Form */}
        <DashboardCard
          title="Log Maintenance or Service Issue"
          subtitle="Tickets are assigned directly to maintenance contractors and inspected by the Warden"
          icon={AlertTriangle}
        >
          <form onSubmit={submitComplaint} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Issue Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="ROOM">Room & Furniture (Bed / Locker / Table)</option>
                <option value="MAINTENANCE">General Maintenance (Electrical / Plumbing / Hygiene)</option>
                <option value="MESS">Mess & Food Service</option>
                <option value="OTHER">Other Residence Inquiries</option>
              </Select>
            </div>

            <Textarea
              label="Detailed Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Specify room number, fixture location, and describe the problem in detail..."
              rows={4}
              required
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Send}
                loading={submitting}
              >
                Submit Ticket
              </Button>
            </div>
          </form>
        </DashboardCard>

        {/* Complaints History */}
        <DashboardCard
          title="Active & Past Grievance Tickets"
          subtitle="Track inspection and resolution status of your tickets"
          icon={MessageSquare}
        >
          {loading ? (
            <LoadingSpinner label="Loading ticket records..." />
          ) : complaints.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No Complaints Logged"
              description="You have not filed any maintenance complaints or service tickets."
            />
          ) : (
            <div className="space-y-4">
              {complaints.map((c) => (
                <div
                  key={c.complaint_id}
                  className="p-5 rounded-2xl bg-[#1A2338]/60 border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="primary" size="sm">
                        {c.category?.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {c.submitted_date
                          ? new Date(c.submitted_date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recently Submitted"}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-100 leading-relaxed">
                      {c.description}
                    </p>

                    {c.resolution_notes && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                        <span className="font-semibold">Resolution Note: </span>
                        {c.resolution_notes}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <Badge
                      status={c.status === "RESOLVED" ? "APPROVED" : c.status === "REJECTED" ? "REJECTED" : "PENDING"}
                      size="md"
                    >
                      {c.status === "OPEN" ? "Open" : c.status === "RESOLVED" ? "Resolved" : c.status || "Open"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </PageContainer>
    </StudentLayout>
  );
}
