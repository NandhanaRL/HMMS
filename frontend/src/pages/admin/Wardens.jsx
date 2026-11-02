import { useEffect, useState } from "react";
import { Plus, Trash2, UserCog, Sparkles, Mail, Phone, ShieldCheck } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import DashboardCard from "../../components/ui/DashboardCard";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
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

export default function Wardens() {
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const loadWardens = async () => {
    try {
      const { data } = await api.get("/admin/wardens");
      setWardens(data.wardens || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const fetchWardens = async () => {
      try {
        const { data } = await api.get("/admin/wardens");
        setWardens(data.wardens || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchWardens();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createWarden = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/admin/wardens", form);
      alert("Warden appointed successfully.");
      setForm({
        username: "",
        email: "",
        phone: "",
        password: "",
      });
      setShowAddForm(false);
      loadWardens();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create warden account.");
    } finally {
      setLoading(false);
    }
  };

  const deleteWarden = async (id) => {
    if (!window.confirm("Are you sure you want to delete this warden?")) return;

    try {
      await api.delete(`/admin/wardens/${id}`);
      loadWardens();
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <AdminLayout>
      <PageContainer>
        <SectionHeader
          title="Hostel Wardens"
          description="Manage residential supervisory staff, appoint wing wardens, and configure administrative privileges."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Supervisory Staff Management</span>
            </div>
          }
          action={
            <Button
              variant={showAddForm ? "secondary" : "primary"}
              size="md"
              icon={Plus}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "Hide Form" : "Appoint New Warden"}
            </Button>
          }
        />

        {/* Add Warden Form Card */}
        {showAddForm && (
          <DashboardCard
            title="Appoint New Warden"
            subtitle="Create administrative credentials for hostel building oversight"
            icon={UserCog}
          >
            <form onSubmit={createWarden} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Input
                  label="Warden Name"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Robert Vance"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="warden@campus.edu"
                  required
                />

                <Input
                  label="Direct Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 11111"
                  required
                />

                <Input
                  label="System Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
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
                  Create Warden Account
                </Button>
              </div>
            </form>
          </DashboardCard>
        )}

        {/* Wardens List */}
        <DashboardCard
          title="Appointed Wardens Roster"
          subtitle={`${wardens.length} active administrative personnel`}
          icon={UserCog}
        >
          {fetching ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Loading warden roster...
            </div>
          ) : wardens.length === 0 ? (
            <EmptyState
              icon={UserCog}
              title="No Wardens Configured"
              description="There are currently no wardens registered in the system."
              actionText={!showAddForm ? "Appoint First Warden" : undefined}
              onAction={!showAddForm ? () => setShowAddForm(true) : undefined}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warden Profile</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Role & Access</TableHead>
                  <TableHead>Security Status</TableHead>
                  <TableHead align="right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wardens.map((warden) => (
                  <TableRow key={warden.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={warden.username} size="sm" />
                        <div>
                          <p className="font-semibold text-white">
                            {warden.username}
                          </p>
                          <p className="text-xs text-slate-400">
                            Staff ID: #{warden.user_id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail size={13} className="text-blue-400 shrink-0" />
                          <span>{warden.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone size={13} className="text-emerald-400 shrink-0" />
                          <span>{warden.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="purple">Hostel Warden</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <ShieldCheck size={14} />
                        <span>Active Session</span>
                      </div>
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => deleteWarden(warden.user_id)}
                        title="Delete warden"
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