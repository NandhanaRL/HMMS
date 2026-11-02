import { useEffect, useState, useMemo } from "react";
import {
  UtensilsCrossed,
  Coffee,
  Sun,
  Moon,
  Save,
  CheckCircle2,
  Users,
  Search,
} from "lucide-react";
import MessManagerLayout from "../../layouts/MessManagerLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import DashboardCard from "../../components/ui/DashboardCard";
import Button from "../../components/ui/Button";
import SearchBar from "../../components/ui/SearchBar";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import Avatar from "../../components/ui/Avatar";
import api from "../../services/api";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadAttendance = async () => {
    try {
      const { data } = await api.get("/attendance/today");
      const grouped = {};

      (data.attendance || []).forEach((row) => {
        if (!grouped[row.student_id]) {
          grouped[row.student_id] = {
            student_id: row.student_id,
            roll_no: row.roll_no,
            username: row.username,
            BREAKFAST: false,
            LUNCH: false,
            DINNER: false,
          };
        }
        grouped[row.student_id][row.meal_type] = row.present === 1;
      });

      setStudents(Object.values(grouped));
    } catch (err) {
      console.error(err);
      alert("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const { data } = await api.get("/attendance/today");
        const grouped = {};
        (data.attendance || []).forEach((row) => {
          if (!grouped[row.student_id]) {
            grouped[row.student_id] = {
              student_id: row.student_id,
              roll_no: row.roll_no,
              username: row.username,
              BREAKFAST: false,
              LUNCH: false,
              DINNER: false,
            };
          }
          grouped[row.student_id][row.meal_type] = row.present === 1;
        });

        if (!ignore) {
          setStudents(Object.values(grouped));
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

  const toggleAttendance = (studentId, meal) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.student_id === studentId
          ? { ...student, [meal]: !student[meal] }
          : student
      )
    );
  };

  const markAllForMeal = (meal, status) => {
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        [meal]: status,
      }))
    );
  };

  const saveAttendance = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem("token");

      // Local India date (NOT UTC)
      const now = new Date();
      const today = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      for (const student of students) {
        for (const meal of ["BREAKFAST", "LUNCH", "DINNER"]) {
          await api.post(
            "/attendance/mark",
            {
              student_id: student.student_id,
              date: today,
              meal_type: meal,
              present: student[meal],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      await loadAttendance();
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const name = String(s.username || "").toLowerCase();
      const roll = String(s.roll_no || "").toLowerCase();
      const q = search.toLowerCase();
      return name.includes(q) || roll.includes(q);
    });
  }, [students, search]);

  const breakfastCount = students.filter((s) => s.BREAKFAST).length;
  const lunchCount = students.filter((s) => s.LUNCH).length;
  const dinnerCount = students.filter((s) => s.DINNER).length;

  const breakfastTurnout = students.length ? Math.round((breakfastCount / students.length) * 100) : 0;
  const lunchTurnout = students.length ? Math.round((lunchCount / students.length) * 100) : 0;
  const dinnerTurnout = students.length ? Math.round((dinnerCount / students.length) * 100) : 0;

  return (
    <MessManagerLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Daily Dining Attendance"
          subtitle="Record and verify student meal check-ins for Breakfast, Lunch, and Dinner."
          action={
            <Button
              onClick={saveAttendance}
              isLoading={saving}
              disabled={saving}
              variant="primary"
              size="lg"
              className="shadow-lg shadow-blue-500/25"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Attendance
            </Button>
          }
        />

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Today's meal attendance records have been synchronized successfully!</span>
            </div>
            <button
              onClick={() => setSaveSuccess(false)}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Turnout Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Diners"
            value={students.length}
            icon={Users}
            color="blue"
            trend="Roster Total"
            trendPositive={true}
          />
          <StatCard
            title="Breakfast"
            value={breakfastCount}
            icon={Coffee}
            color="amber"
            trend={`${breakfastTurnout}% Turnout`}
            trendPositive={true}
          />
          <StatCard
            title="Lunch"
            value={lunchCount}
            icon={Sun}
            color="cyan"
            trend={`${lunchTurnout}% Turnout`}
            trendPositive={true}
          />
          <StatCard
            title="Dinner"
            value={dinnerCount}
            icon={Moon}
            color="purple"
            trend={`${dinnerTurnout}% Turnout`}
            trendPositive={true}
          />
        </div>

        {/* Main Attendance Card */}
        <DashboardCard
          title="Student Check-in Roster"
          subtitle="Toggle meal status per resident. Green highlights indicate presence."
          icon={UtensilsCrossed}
          action={
            <div className="w-64">
              <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roll no or name..."
              />
            </div>
          }
        >
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" text="Loading meal registry..." />
            </div>
          ) : filteredStudents.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No students found"
              description={search ? `No student matched "${search}".` : "No registered student records available."}
              action={search ? <Button variant="secondary" onClick={() => setSearch("")}>Clear Search</Button> : null}
            />
          ) : (
            <div className="space-y-4">
              {/* Quick Batch Select Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#1A2338] border border-white/5 text-xs text-slate-300">
                <span className="font-semibold text-slate-400">Quick Batch Fill:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500 mr-1">Breakfast:</span>
                  <button
                    onClick={() => markAllForMeal("BREAKFAST", true)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium transition"
                  >
                    All In
                  </button>
                  <button
                    onClick={() => markAllForMeal("BREAKFAST", false)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 font-medium transition"
                  >
                    All Out
                  </button>

                  <span className="text-slate-500 mx-1">| Lunch:</span>
                  <button
                    onClick={() => markAllForMeal("LUNCH", true)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-medium transition"
                  >
                    All In
                  </button>
                  <button
                    onClick={() => markAllForMeal("LUNCH", false)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 font-medium transition"
                  >
                    All Out
                  </button>

                  <span className="text-slate-500 mx-1">| Dinner:</span>
                  <button
                    onClick={() => markAllForMeal("DINNER", true)}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 font-medium transition"
                  >
                    All In
                  </button>
                  <button
                    onClick={() => markAllForMeal("DINNER", false)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 font-medium transition"
                  >
                    All Out
                  </button>
                </div>
              </div>

              {/* Roster Table Container */}
              <div className="overflow-x-auto rounded-[22px] border border-white/5">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-[#0F172A] text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Roll Number</th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-amber-400">
                          <Coffee className="w-4 h-4" /> Breakfast
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-cyan-400">
                          <Sun className="w-4 h-4" /> Lunch
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-purple-400">
                          <Moon className="w-4 h-4" /> Dinner
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#111827]">
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.student_id}
                        className="hover:bg-[#1A2338]/60 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={student.username} size="sm" />
                            <span className="font-semibold text-white">{student.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-400 text-xs">
                          {student.roll_no}
                        </td>

                        {/* Meal Toggles */}
                        {["BREAKFAST", "LUNCH", "DINNER"].map((meal) => {
                          const isPresent = student[meal];
                          return (
                            <td key={meal} className="px-6 py-4 text-center">
                              <button
                                type="button"
                                onClick={() => toggleAttendance(student.student_id, meal)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                  isPresent
                                    ? "bg-[#16A34A]/20 border border-[#16A34A]/40 text-emerald-300 shadow-soft"
                                    : "bg-[#0F172A] border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full transition-colors ${
                                    isPresent ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                                  }`}
                                />
                                {isPresent ? "Present" : "Absent"}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="pt-4 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Showing {filteredStudents.length} of {students.length} students
                </div>
                <Button
                  onClick={saveAttendance}
                  isLoading={saving}
                  disabled={saving}
                  variant="primary"
                  size="lg"
                  className="shadow-lg shadow-blue-500/25"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DashboardCard>
      </div>
    </MessManagerLayout>
  );
}