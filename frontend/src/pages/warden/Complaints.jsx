import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Sparkles, Filter } from "lucide-react";
import WardenLayout from "../../layouts/WardenLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import DashboardCard from "../../components/ui/DashboardCard";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const url =
        filter === "ALL"
          ? "/warden/complaints"
          : `/warden/complaints?status=${filter}`;

      const { data } = await api.get(url);
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const url =
          filter === "ALL"
            ? "/warden/complaints"
            : `/warden/complaints?status=${filter}`;

        const { data } = await api.get(url);
        if (!ignore) {
          setComplaints(data.complaints || []);
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
  }, [filter]);

  const resolveComplaint = async (id) => {
    const notes = prompt("Enter resolution details / action taken:");
    if (notes === null) return;

    try {
      await api.put(`/warden/complaints/${id}`, {
        status: "RESOLVED",
        resolution_notes: notes || "Resolved by Warden",
      });

      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Failed to resolve complaint.");
    }
  };

  return (
    <WardenLayout>
      <PageContainer>
        <SectionHeader
          title="Grievances & Maintenance"
          description="Investigate student facility issues, track maintenance contractors, and record resolution notes."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Grievance Resolution Desk</span>
            </div>
          }
          action={
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0F172A] border border-white/10">
              <Filter size={14} className="text-slate-400 ml-2" />
              {["ALL", "PENDING", "RESOLVED"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    filter === item
                      ? "bg-[#2563EB] text-white font-semibold shadow-soft"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          }
        />

        <DashboardCard
          title={`Complaints Stream (${complaints.length})`}
          subtitle="Real-time residential service tickets"
          icon={AlertTriangle}
        >
          {loading ? (
            <LoadingSpinner label="Fetching complaint tickets..." />
          ) : complaints.length === 0 ? (
            <EmptyState
              icon={AlertTriangle}
              title="No Complaints Found"
              description={
                filter === "ALL"
                  ? "There are currently no complaints registered in the system."
                  : `No ${filter.toLowerCase()} complaints found.`
              }
            />
          ) : (
            <div className="space-y-4 pt-1">
              {complaints.map((c) => (
                <div
                  key={c.complaint_id}
                  className="p-5 rounded-2xl bg-[#1A2338]/60 border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.username} size="sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white text-base">
                            {c.username}
                          </p>
                          <Badge variant="primary" size="sm">
                            {c.category?.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">
                          Roll No: #{c.roll_no}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-slate-200 mt-2 leading-relaxed">
                      {c.description}
                    </p>

                    {c.resolution_notes && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                        <span className="font-semibold">Resolution: </span>
                        {c.resolution_notes}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 self-end md:self-center">
                    {c.status === "PENDING" || c.status === "OPEN" ? (
                      <Button
                        variant="success"
                        size="sm"
                        icon={CheckCircle}
                        onClick={() => resolveComplaint(c.complaint_id)}
                      >
                        Mark Resolved
                      </Button>
                    ) : (
                      <Badge status="RESOLVED" size="md">
                        Resolved
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </PageContainer>
    </WardenLayout>
  );
}