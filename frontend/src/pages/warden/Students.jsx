import { useEffect, useState } from "react";
import { Mail, Phone, Bed, Sparkles, Users } from "lucide-react";
import WardenLayout from "../../layouts/WardenLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import DashboardCard from "../../components/ui/DashboardCard";
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const fetchStudents = async () => {
      try {
        const { data } = await api.get("/warden/students", {
          params: { search },
        });
        if (!ignore) {
          setStudents(data.students || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchStudents();
    return () => {
      ignore = true;
    };
  }, [search]);

  return (
    <WardenLayout>
      <PageContainer>
        <SectionHeader
          title="Student Residents"
          description="Directory of registered hostel students, contact directories, and room allocation statuses."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Resident Directory</span>
            </div>
          }
          action={
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or roll number..."
              className="w-full sm:w-80"
            />
          }
        />

        <DashboardCard
          title="All Enrolled Students"
          subtitle={`${students.length} student records found in active roster`}
          icon={Users}
        >
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Loading resident list...
            </div>
          ) : students.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Students Found"
              description={
                search
                  ? `No residents match the query "${search}". Try another search.`
                  : "No students currently enrolled in the roster."
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident Profile</TableHead>
                  <TableHead>Academic Details</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Room Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={student.username} size="sm" />
                        <div>
                          <p className="font-semibold text-white">
                            {student.username}
                          </p>
                          <p className="text-xs text-slate-400">
                            Roll: #{student.roll_no}
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
                          <span className="truncate max-w-[180px]">{student.email}</span>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DashboardCard>
      </PageContainer>
    </WardenLayout>
  );
}