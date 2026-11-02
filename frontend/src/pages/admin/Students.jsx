import { useEffect, useState } from "react";
import { Plus, Trash2, Users, Sparkles, Mail, Phone, Bed } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import DashboardCard from "../../components/ui/DashboardCard";
import Input, { Select } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import SearchBar from "../../components/ui/SearchBar";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    roll_no: "",
    department: "Computer Science",
    year_of_study: 1,
    guardian_contact: "",
  });

  const loadStudents = async () => {
    try {
      const { data } = await api.get("/admin/students");
      setStudents(data.students || []);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get("/admin/students");
        setStudents(data.students || []);
      } catch (err) {
        console.error("Failed to load students:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "year_of_study" ? Number(value) : value,
    });
  };

  const createStudent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/admin/students", form);
      alert("Student created successfully.");
      setForm({
        username: "",
        email: "",
        password: "",
        phone: "",
        roll_no: "",
        department: "Computer Science",
        year_of_study: 1,
        guardian_contact: "",
      });
      setShowAddForm(false);
      loadStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create student.");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/admin/students/${id}`);
      loadStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete student.");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.username?.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_no?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <PageContainer>
        <SectionHeader
          title="Student Roster"
          description="Enrol new student residents, manage profiles, and monitor campus accommodation statuses."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Student Admissions & Records</span>
            </div>
          }
          action={
            <Button
              variant={showAddForm ? "secondary" : "primary"}
              size="md"
              icon={Plus}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "Hide Form" : "Enrol New Student"}
            </Button>
          }
        />

        {/* Add Student Collapsible Form Card */}
        {showAddForm && (
          <DashboardCard
            title="Enrol New Student"
            subtitle="Register new hostel resident with auto-generated credentials"
            icon={Plus}
          >
            <form onSubmit={createStudent} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Input
                  label="Username / Full Name"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@campus.edu"
                  required
                />

                <Input
                  label="Initial Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                />

                <Input
                  label="Roll Number"
                  name="roll_no"
                  value={form.roll_no}
                  onChange={handleChange}
                  placeholder="e.g. CS202601"
                  required
                />

                <Input
                  label="Student Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                />

                <Input
                  label="Guardian Emergency Contact"
                  name="guardian_contact"
                  value={form.guardian_contact}
                  onChange={handleChange}
                  placeholder="+91 98765 00000"
                  required
                />

                <Select
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="Computer Science">Computer Science & Eng</option>
                  <option value="Information Tech">Information Technology</option>
                  <option value="Electronics">Electronics & Comm</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Management Studies">Management Studies</option>
                </Select>

                <Select
                  label="Year of Study"
                  name="year_of_study"
                  value={form.year_of_study}
                  onChange={handleChange}
                >
                  <option value={1}>1st Year (Freshman)</option>
                  <option value={2}>2nd Year (Sophomore)</option>
                  <option value={3}>3rd Year (Junior)</option>
                  <option value={4}>4th Year (Senior)</option>
                </Select>
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
                  Confirm Registration
                </Button>
              </div>
            </form>
          </DashboardCard>
        )}

        {/* Students Table */}
        <DashboardCard
          title="Registered Students"
          subtitle={`${filteredStudents.length} student records found`}
          icon={Users}
          action={
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, roll no, or dept..."
              className="w-full sm:w-72"
            />
          }
        >
          {fetching ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Loading resident records...
            </div>
          ) : filteredStudents.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Students Found"
              description={
                search
                  ? `No records match "${search}". Try adjusting your search term.`
                  : "No students registered yet. Click 'Enrol New Student' to add one."
              }
              actionText={!showAddForm ? "Enrol New Student" : undefined}
              onAction={!showAddForm ? () => setShowAddForm(true) : undefined}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Resident</TableHead>
                  <TableHead>Academics</TableHead>
                  <TableHead>Contact Directory</TableHead>
                  <TableHead>Room Status</TableHead>
                  <TableHead align="right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={student.username} size="sm" />
                        <div>
                          <p className="font-semibold text-white">
                            {student.username}
                          </p>
                          <p className="text-xs text-slate-400">
                            Roll No: #{student.roll_no}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-slate-200 font-medium block">
                        {student.department}
                      </span>
                      <span className="text-xs text-slate-400">
                        Year {student.year_of_study} • Resident
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail size={13} className="text-blue-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone size={13} className="text-emerald-400 shrink-0" />
                          <span>{student.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {student.room_number ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold">
                          <Bed size={13} />
                          <span>Room {student.room_number}</span>
                        </div>
                      ) : (
                        <Badge variant="warning">Awaiting Allotment</Badge>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => deleteStudent(student.student_id)}
                        title="Delete student"
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DashboardCard>
      </PageContainer>
    </AdminLayout>
  );
}