import { useEffect, useState } from "react";
import { Plus, Trash2, UtensilsCrossed, Sparkles, Mail, Phone, ShieldCheck } from "lucide-react";
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

export default function MessManagers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const loadManagers = async () => {
    try {
      const { data } = await api.get("/admin/mess-managers");
      setManagers(data.managers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const { data } = await api.get("/admin/mess-managers");
        setManagers(data.managers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchManagers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createManager = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/admin/mess-managers", form);
      alert("Mess Manager appointed successfully.");
      setForm({
        username: "",
        email: "",
        phone: "",
        password: "",
      });
      setShowAddForm(false);
      loadManagers();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating mess manager account.");
    } finally {
      setLoading(false);
    }
  };

  const deleteManager = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Mess Manager?")) return;

    try {
      await api.delete(`/admin/mess-managers/${id}`);
      loadManagers();
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <AdminLayout>
      <PageContainer>
        <SectionHeader
          title="Mess Managers"
          description="Manage dining caterers, provision mess management credentials, and oversee food service supervision."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Catering Staff Management</span>
            </div>
          }
          action={
            <Button
              variant={showAddForm ? "secondary" : "primary"}
              size="md"
              icon={Plus}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "Hide Form" : "Appoint Mess Manager"}
            </Button>
          }
        />

        {/* Add Manager Form Card */}
        {showAddForm && (
          <DashboardCard
            title="Appoint New Mess Manager"
            subtitle="Register food service operators with daily attendance and billing privileges"
            icon={UtensilsCrossed}
          >
            <form onSubmit={createManager} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Input
                  label="Manager Full Name"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. Moorthy Catering"
                  required
                />

                <Input
                  label="Official Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="mess@campus.edu"
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 22222"
                  required
                />

                <Input
                  label="Access Password"
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
                  Confirm Appointment
                </Button>
              </div>
            </form>
          </DashboardCard>
        )}

        {/* Mess Managers Roster */}
        <DashboardCard
          title="Mess Managers Directory"
          subtitle={`${managers.length} active dining supervisory personnel`}
          icon={UtensilsCrossed}
        >
          {fetching ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Loading caterers roster...
            </div>
          ) : managers.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="No Mess Managers Registered"
              description="There are currently no mess managers configured in the system."
              actionText={!showAddForm ? "Appoint First Manager" : undefined}
              onAction={!showAddForm ? () => setShowAddForm(true) : undefined}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manager Profile</TableHead>
                  <TableHead>Contact Directory</TableHead>
                  <TableHead>Assigned Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead align="right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((mgr) => (
                  <TableRow key={mgr.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={mgr.username} size="sm" />
                        <div>
                          <p className="font-semibold text-white">
                            {mgr.username}
                          </p>
                          <p className="text-xs text-slate-400">
                            Manager ID: #{mgr.user_id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail size={13} className="text-blue-400 shrink-0" />
                          <span>{mgr.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone size={13} className="text-emerald-400 shrink-0" />
                          <span>{mgr.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="purple">Central Dining Hall</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <ShieldCheck size={14} />
                        <span>Authorized</span>
                      </div>
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => deleteManager(mgr.user_id)}
                        title="Delete mess manager"
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