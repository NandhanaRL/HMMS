import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Shield, Sparkles } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("STUDENT");
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let endpoint = "/auth/login";

      if (role === "WARDEN") endpoint = "/auth/warden/login";
      else if (role === "ADMIN") endpoint = "/auth/admin/login";
      else if (role === "MESS_MANAGER") endpoint = "/auth/mess-manager/login";

      const { data } = await api.post(endpoint, form);

      const loggedInUser =
        data.user ||
        data.warden ||
        data.admin ||
        data.manager || {
          username: form.username,
          role,
        };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      switch (loggedInUser.role) {
        case "STUDENT":
          navigate("/student");
          break;
        case "WARDEN":
          navigate("/warden");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        case "MESS_MANAGER":
          navigate("/mess-manager");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: "STUDENT", label: "Student" },
    { id: "WARDEN", label: "Warden" },
    { id: "ADMIN", label: "Admin" },
    { id: "MESS_MANAGER", label: "Mess Manager" },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#060C1B] px-4 py-12 overflow-hidden selection:bg-[#2563EB]/30 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md z-10 space-y-8">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 border border-white/20 mb-2">
            <Shield size={32} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Sparkles size={12} />
            <span>Smart Campus Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome to HMMS
          </h1>
          <p className="text-sm text-slate-400 font-normal">
            Hostel & Mess Management System
          </p>
        </div>

        {/* Primary Surface Card */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          {/* Role Selector Tabs */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select Your Portal
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#0F172A] border border-white/10">
              {roles.map((r) => {
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Username"
              icon={User}
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />

            <Input
              label="Password"
              icon={Lock}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium animate-shake">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full text-base font-semibold"
            >
              Sign In to {roles.find((r) => r.id === role)?.label}
            </Button>
          </form>

          {/* Secure indicator */}
          <div className="pt-2 text-center border-t border-white/[0.05]">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <Shield size={12} className="text-emerald-400" />
              <span>Protected by 256-bit JWT Authentication</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}