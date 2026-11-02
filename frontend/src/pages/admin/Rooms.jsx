import { useEffect, useState } from "react";
import { Plus, Trash2, Bed, Users, Sparkles } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import DashboardCard from "../../components/ui/DashboardCard";
import Input, { Select } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    room_number: "",
    room_type: "DOUBLE",
    capacity: 2,
  });

  const loadRooms = async () => {
    try {
      const { data } = await api.get("/rooms");
      setRooms(data.rooms || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load rooms.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get("/rooms");
        setRooms(data.rooms || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "capacity"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const createRoom = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/rooms", form);
      setForm({
        room_number: "",
        room_type: "DOUBLE",
        capacity: 2,
      });
      setShowAddForm(false);
      loadRooms();
      alert("Room added successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await api.delete(`/rooms/${id}`);
      loadRooms();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete room.");
    }
  };

  return (
    <AdminLayout>
      <PageContainer>
        <SectionHeader
          title="Hostel Room Inventory"
          description="Provision new residential units, set occupancy limits, and manage building infrastructure."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Hostel Inventory Control</span>
            </div>
          }
          action={
            <Button
              variant={showAddForm ? "secondary" : "primary"}
              size="md"
              icon={Plus}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "Hide Form" : "Create New Room"}
            </Button>
          }
        />

        {/* Add Room Collapsible Card */}
        {showAddForm && (
          <DashboardCard
            title="Create New Residential Unit"
            subtitle="Add a new room to the active hostel allocation pool"
            icon={Bed}
          >
            <form onSubmit={createRoom} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Input
                  label="Room Designation / Number"
                  name="room_number"
                  value={form.room_number}
                  onChange={handleChange}
                  placeholder="e.g. 101, A-204"
                  required
                />

                <Select
                  label="Room Tier / Type"
                  name="room_type"
                  value={form.room_type}
                  onChange={handleChange}
                >
                  <option value="SINGLE">Single Occupancy</option>
                  <option value="DOUBLE">Double Occupancy</option>
                  <option value="TRIPLE">Triple Occupancy</option>
                </Select>

                <Input
                  label="Bed Capacity"
                  type="number"
                  name="capacity"
                  min="1"
                  max="6"
                  value={form.capacity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                >
                  Add Room to Inventory
                </Button>
              </div>
            </form>
          </DashboardCard>
        )}

        {/* Room Floating Cards Grid */}
        {fetching ? (
          <LoadingSpinner label="Loading hostel room grid..." />
        ) : rooms.length === 0 ? (
          <EmptyState
            icon={Bed}
            title="No Rooms Configured"
            description="The hostel inventory currently has no rooms."
            actionText={!showAddForm ? "Create First Room" : undefined}
            onAction={!showAddForm ? () => setShowAddForm(true) : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const isFull = room.occupied_count >= room.capacity;
              const occupancyPercent = Math.min(
                Math.round(((room.occupied_count || 0) / (room.capacity || 1)) * 100),
                100
              );

              return (
                <div
                  key={room.room_id}
                  className="group relative overflow-hidden bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/25 shrink-0">
                          <Bed size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">
                            Room {room.room_number}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {room.room_type} Unit
                          </p>
                        </div>
                      </div>

                      <Badge status={room.status}>
                        {room.status}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-6 p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                          <Users size={14} className="text-[#2563EB]" />
                          Allocated Residents
                        </span>
                        <span className="font-semibold text-[#F8FAFC]">
                          {room.occupied_count} of {room.capacity} Beds
                        </span>
                      </div>

                      <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull
                              ? "bg-[#DC2626]"
                              : "bg-[#2563EB]"
                          }`}
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => deleteRoom(room.room_id)}
                      className="w-full"
                    >
                      Delete Room
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageContainer>
    </AdminLayout>
  );
}