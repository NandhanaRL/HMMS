export default function Avatar({
  name = "User",
  size = "md",
  status = "online",
  className = "",
}) {
  const getInitials = (n) => {
    if (!n) return "U";
    const parts = n.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg font-bold",
  };

  const statusColors = {
    online: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    away: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    offline: "bg-slate-500",
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${
          sizes[size] || sizes.md
        } rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-blue-500/20`}
      >
        <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center font-semibold text-white tracking-wide">
          {getInitials(name)}
        </div>
      </div>

      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0F172A] ${
            statusColors[status] || statusColors.online
          }`}
        />
      )}
    </div>
  );
}
