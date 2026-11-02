import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bed,
  CalendarCheck,
  CircleDollarSign,
  Utensils,
  FileText,
  MessageSquare,
  LogOut,
  Shield,
  Bell,
  Menu,
  X,
} from "lucide-react";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";

export default function StudentLayout({ children }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Student",
    role: "STUDENT",
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
    { label: "Room", icon: Bed, path: "/student/room" },
    { label: "Attendance", icon: CalendarCheck, path: "/student/attendance" },
    { label: "Fees", icon: CircleDollarSign, path: "/student/fees" },
    { label: "Mess Menu", icon: Utensils, path: "/student/mess" },
    { label: "Leave", icon: FileText, path: "/student/leave" },
    { label: "Complaints", icon: MessageSquare, path: "/student/complaints" },
  ];

  return (
    <div className="min-h-screen bg-[#060C1B] text-[#F8FAFC] flex relative">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0F172A] border-r border-white/[0.06] flex flex-col z-50 transition-transform duration-200 shadow-card ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-soft shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold tracking-tight text-white">HMMS</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#2563EB]/15 text-blue-400">
                  Student
                </span>
              </div>
              <p className="text-[12px] text-[#94A3B8]">Campus Resident Suite</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-[#94A3B8]/70">
            Resident Portal
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/student"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[14px] transition-all duration-200 ${
                    isActive
                      ? "bg-[#2563EB] text-white font-medium shadow-soft"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2338]"
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div className="p-3 border-t border-white/[0.06] bg-[#0F172A]">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#111827] border border-white/[0.05]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name={user.username} size="sm" />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-white truncate">
                  {user.username}
                </p>
                <p className="text-[11px] text-[#94A3B8]">Hostel Resident</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-xl text-slate-400 hover:text-[#DC2626] hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#060C1B]/90 backdrop-blur-md border-b border-white/[0.06] px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#111827] border border-white/10 text-slate-300 hover:text-white"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2">
              <Badge status="ACTIVE" size="sm">Resident Active</Badge>
              <span className="hidden sm:inline text-[13px] text-[#94A3B8]">
                Hostel Quarters & Dining
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Notifications"
              className="relative p-2 rounded-xl bg-[#111827] border border-white/10 text-slate-300 hover:text-white hover:bg-[#1A2338] transition-colors"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            </button>

            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
              <Avatar name={user.username} size="sm" />
              <div className="text-left">
                <span className="text-[13px] font-medium text-white block leading-none">
                  {user.username}
                </span>
                <span className="text-[11px] text-[#94A3B8]">Student</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}