import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  ClipboardList,
  Sparkles,
} from "lucide-react";
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

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchLeaves = async () => {
    try {
      const { data } = await api.get("/warden/leaves");
      setLeaves(data.leaves || []);
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
        const { data } = await api.get("/warden/leaves");
        if (!ignore) {
          setLeaves(data.leaves || []);
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
  }, []);

  const updateLeave = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/warden/leaves/${id}`, { status });
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Failed to update leave request.");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingLeaves = leaves.filter((l) => l.status === "PENDING");
  const processedLeaves = leaves.filter((l) => l.status !== "PENDING");

  return (
    <WardenLayout>
      <PageContainer>
        <SectionHeader
          title="Leave & Out-Pass Requests"
          description="Review student departure and out-pass requests, verify reasons, and issue approvals."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Permission Verification</span>
            </div>
          }
        />

        {loading ? (
          <LoadingSpinner label="Loading out-pass requests..." />
        ) : leaves.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No Leave Requests"
            description="There are currently no leave or out-pass applications filed by students."
          />
        ) : (
          <div className="space-y-8">
            {/* Pending Requests Section */}
            <DashboardCard
              title={`Pending Approvals (${pendingLeaves.length})`}
              subtitle="Requires Warden review and decision before student departure"
              icon={ClipboardList}
            >
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  🎉 No pending leave requests to review!
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  {pendingLeaves.map((leave) => (
                    <div
                      key={leave.leave_id}
                      className="p-5 rounded-2xl bg-[#1A2338]/60 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar name={leave.username} size="md" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white text-base">
                              {leave.username}
                            </h4>
                            <Badge status="PENDING" size="sm">
                              Pending
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                            <CalendarDays size={14} />
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

                          <p className="text-xs text-slate-200 mt-1 max-w-xl">
                            {leave.reason}
                          </p>

                          <p className="text-[11px] text-slate-500">
                            Applied:{" "}
                            {new Date(leave.applied_date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                        <Button
                          variant="success"
                          size="sm"
                          icon={CheckCircle}
                          disabled={updatingId === leave.leave_id}
                          onClick={() => updateLeave(leave.leave_id, "APPROVED")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={XCircle}
                          disabled={updatingId === leave.leave_id}
                          onClick={() => updateLeave(leave.leave_id, "REJECTED")}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>

            {/* Historical Decision Log */}
            {processedLeaves.length > 0 && (
              <DashboardCard
                title="Resolved Applications"
                subtitle="Approved and rejected student leave history"
                icon={CalendarDays}
              >
                <div className="space-y-3 pt-1">
                  {processedLeaves.map((leave) => (
                    <div
                      key={leave.leave_id}
                      className="p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-white text-sm">
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
              </DashboardCard>
            )}
          </div>
        )}
      </PageContainer>
    </WardenLayout>
  );
}