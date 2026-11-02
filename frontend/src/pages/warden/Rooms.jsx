import { useEffect, useState } from "react";
import {
  Bed,
  Users,
  CheckCircle,
  XCircle,
  UserPlus,
  Sparkles,
} from "lucide-react";
import WardenLayout from "../../layouts/WardenLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const { data } = await api.get("/rooms");
      setRooms(data.rooms || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const [roomsRes, studentsRes] = await Promise.all([
          api.get("/rooms"),
          api.get("/student/all"),
        ]);
        if (!ignore) {
          setRooms(roomsRes.data.rooms || []);
          setStudents(studentsRes.data.students || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const updateRoomStatus = async (roomId, status) => {
    try {
      await api.put(`/rooms/${roomId}`, { status });
      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Failed to update room.");
    }
  };

  const allocateRoom = async (roomId) => {
    const studentId = selectedStudent[roomId];

    if (!studentId) {
      alert("Please select a student first.");
      return;
    }

    try {
      await api.post("/rooms/allocate", {
        student_id: Number(studentId),
        room_id: roomId,
      });

      alert("Room allocated successfully.");
      fetchRooms();

      setSelectedStudent((prev) => ({
        ...prev,
        [roomId]: "",
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Server error.");
    }
  };

  return (
    <WardenLayout>
      <PageContainer>
        <SectionHeader
          title="Room Management"
          description="Manage residential units, toggle occupancy statuses, and allocate beds to verified residents."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Hostel Inventory</span>
            </div>
          }
        />

        {loading ? (
          <LoadingSpinner label="Loading hostel rooms..." />
        ) : rooms.length === 0 ? (
          <EmptyState
            icon={Bed}
            title="No Rooms Configured"
            description="There are currently no hostel rooms configured in the database."
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
                    {/* Header */}
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
                            {room.room_type} Room
                          </p>
                        </div>
                      </div>

                      <Badge status={room.status}>
                        {room.status}
                      </Badge>
                    </div>

                    {/* Occupancy Progress */}
                    <div className="space-y-3 mb-5 p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                          <Users size={14} className="text-[#2563EB]" />
                          Resident Capacity
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

                    {/* Quick Status Toggles */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      <button
                        type="button"
                        onClick={() => updateRoomStatus(room.room_id, "AVAILABLE")}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          room.status === "AVAILABLE"
                            ? "bg-[#16A34A]/20 text-emerald-400 border border-[#16A34A]/40"
                            : "bg-[#0F172A] hover:bg-[#1A2338] text-slate-400 hover:text-white border border-white/5"
                        }`}
                      >
                        <CheckCircle size={14} />
                        Available
                      </button>

                      <button
                        type="button"
                        onClick={() => updateRoomStatus(room.room_id, "FULL")}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          room.status === "FULL"
                            ? "bg-[#DC2626]/20 text-rose-400 border border-[#DC2626]/40"
                            : "bg-[#0F172A] hover:bg-[#1A2338] text-slate-400 hover:text-white border border-white/5"
                        }`}
                      >
                        <XCircle size={14} />
                        Full
                      </button>
                    </div>
                  </div>

                  {/* Allocate Student Section */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <select
                      value={selectedStudent[room.room_id] || ""}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          [room.room_id]: e.target.value,
                        })
                      }
                      className="w-full bg-[#0F172A] hover:bg-[#1A2338] border border-white/10 focus:border-[#2563EB] rounded-2xl p-3 text-xs text-[#F8FAFC] outline-none cursor-pointer transition-colors"
                    >
                      <option value="">Select Resident to Allocate...</option>
                      {students.map((student) => (
                        <option
                          key={student.student_id}
                          value={student.student_id}
                        >
                          {student.username} ({student.roll_no})
                        </option>
                      ))}
                    </select>

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      icon={UserPlus}
                      disabled={isFull}
                      onClick={() => allocateRoom(room.room_id)}
                      className="w-full"
                    >
                      {isFull ? "Room At Full Capacity" : "Allocate Student"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageContainer>
    </WardenLayout>
  );
}