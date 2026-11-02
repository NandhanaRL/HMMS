export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = "blue",
  className = "",
  onClick,
}) {
  const colorMap = {
    blue: {
      iconBg: "bg-blue-600/10 text-blue-400 border-blue-500/20",
      pill: "bg-blue-500/10 text-blue-400",
    },
    purple: {
      iconBg: "bg-purple-600/10 text-purple-400 border-purple-500/20",
      pill: "bg-purple-500/10 text-purple-400",
    },
    cyan: {
      iconBg: "bg-cyan-600/10 text-cyan-400 border-cyan-500/20",
      pill: "bg-cyan-500/10 text-cyan-400",
    },
    green: {
      iconBg: "bg-emerald-600/10 text-emerald-400 border-emerald-500/20",
      pill: "bg-emerald-500/10 text-emerald-400",
    },
    amber: {
      iconBg: "bg-amber-600/10 text-amber-400 border-amber-500/20",
      pill: "bg-amber-500/10 text-amber-400",
    },
    red: {
      iconBg: "bg-red-600/10 text-red-400 border-red-500/20",
      pill: "bg-red-500/10 text-red-400",
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  const trendLabel =
    typeof trend === "object" && trend !== null ? trend.value : trend;
  const isPositive =
    typeof trend === "object" && trend !== null && "isPositive" in trend
      ? trend.isPositive
      : trendPositive;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-[#111827] border border-white/[0.06] rounded-3xl p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-smooth flex flex-col justify-between ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#94A3B8]">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border ${scheme.iconBg} shrink-0`}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#F8FAFC]">
            {value !== undefined && value !== null ? value : "—"}
          </span>

          {trendLabel && (
            <span
              className={`text-[12px] font-medium px-2 py-0.5 rounded-full inline-flex items-center ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {trendLabel}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-[13px] text-[#94A3B8] mt-1.5 font-normal leading-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
