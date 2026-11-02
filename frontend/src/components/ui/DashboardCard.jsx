export default function DashboardCard({
  title,
  subtitle,
  action,
  icon: Icon,
  children,
  className = "",
  contentClassName = "",
}) {
  return (
    <div
      className={`bg-[#111827] border border-white/[0.06] rounded-3xl p-6 shadow-soft transition-smooth ${className}`}
    >
      {(title || action || Icon) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
                <Icon size={18} />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg sm:text-[24px] font-semibold text-[#F8FAFC] tracking-tight leading-snug">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[13px] text-[#94A3B8] mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      <div className={contentClassName}>{children}</div>
    </div>
  );
}
