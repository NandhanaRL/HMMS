import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";
import {
  Bed,
  Building,
  Users,
  Calendar,
  Shield,
  CircleCheck,
  Wifi,
  Zap,
  Info,
  Sparkles,
} from "lucide-react";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import DashboardCard from "../../components/ui/DashboardCard";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function Room() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await api.get("/rooms/my-room");
        setRoom(data.room);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, []);

  return (
    <StudentLayout>
      <PageContainer>
        <SectionHeader
          title="My Room"
          description="Your active residential quarters, allocation dates, and facility privileges."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Campus Residency Details</span>
            </div>
          }
        />

        {loading ? (
          <LoadingSpinner label="Loading room information..." />
        ) : !room ? (
          <EmptyState
            icon={Bed}
            title="No Room Allocated Yet"
            description="You do not currently have a room assignment recorded. Please contact your Warden office or wait for the new batch allocation."
          />
        ) : (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <StatCard
                title="Room Designation"
                value={`Room ${room.room_number}`}
                subtitle="Student Residential Quarters"
                icon={Bed}
                color="blue"
              />

              <StatCard
                title="Room Category"
                value={room.room_type}
                subtitle="Standard Student Tier"
                icon={Building}
                color="purple"
              />

              <StatCard
                title="Bed Occupancy"
                value={`${room.occupied_count} / ${room.capacity}`}
                subtitle={`${room.capacity - room.occupied_count} vacancy remaining`}
                icon={Users}
                color="cyan"
                trend={room.occupied_count >= room.capacity ? "Full" : "Has Slots"}
                trendPositive={room.occupied_count < room.capacity}
              />

              <StatCard
                title="Allocation Status"
                value={room.status}
                subtitle="Authorized Campus Stay"
                icon={CircleCheck}
                color="green"
              />

              <StatCard
                title="Allocated Date"
                value={
                  room.allocation_date
                    ? new Date(room.allocation_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Active"
                }
                subtitle="Official Move-In Registered"
                icon={Calendar}
                color="amber"
              />

              <StatCard
                title="Hostel Wing Authority"
                value="Warden Office"
                subtitle="Block A • 24/7 Support"
                icon={Shield}
                color="blue"
              />
            </div>

            {/* Room Features and Rules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DashboardCard
                title="Amenities & Facilities"
                subtitle="In-room features provided by the hostel"
                icon={Building}
              >
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2563EB]/15 text-[#2563EB]">
                        <Wifi size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#F8FAFC]">Campus High-Speed Wi-Fi</p>
                        <p className="text-xs text-slate-400">Dual-band gigabit connection</p>
                      </div>
                    </div>
                    <Badge variant="success">Included</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D97706]/15 text-[#D97706]">
                        <Zap size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#F8FAFC]">Continuous Electricity</p>
                        <p className="text-xs text-slate-400">Supported by auxiliary diesel generators</p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#8B5CF6]/15 text-[#8B5CF6]">
                        <Bed size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#F8FAFC]">Study Station & Locker</p>
                        <p className="text-xs text-slate-400">Individual study desk, chair, and wardrobe</p>
                      </div>
                    </div>
                    <Badge variant="success">Allotted</Badge>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard
                title="Residency Guidelines"
                subtitle="Hostel code of conduct and rules"
                icon={Info}
              >
                <div className="space-y-3 pt-1">
                  <div className="p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5 space-y-1">
                    <p className="text-sm font-semibold text-[#F8FAFC]">Night Curfew Hours</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All residents must return to their designated rooms by 10:30 PM. For off-campus overnight stays, submit a digital leave request at least 24 hours in advance.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5 space-y-1">
                    <p className="text-sm font-semibold text-[#F8FAFC]">Guest Policy</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Visitors are allowed only in the common lounge between 4:00 PM and 7:00 PM. Overnight guests are strictly prohibited without prior Warden approval.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5 space-y-1">
                    <p className="text-sm font-semibold text-[#F8FAFC]">Maintenance & Complaints</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Report plumbing, electrical, or cleaning issues directly via the Complaints portal for prompt rectification within 24 hours.
                    </p>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        )}
      </PageContainer>
    </StudentLayout>
  );
}