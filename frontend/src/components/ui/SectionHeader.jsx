export default function SectionHeader({
  title,
  description,
  subtitle,
  badge,
  action,
  className = "",
  size = "lg",
}) {
  const text = description || subtitle;
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 ${className}`}
    >
      <div className="space-y-1.5">
        {badge && <div className="mb-2">{badge}</div>}
        <h1
          className={`font-bold tracking-tight text-[#F8FAFC] ${
            size === "xl"
              ? "text-4xl md:text-5xl lg:text-[42px]"
              : size === "lg"
              ? "text-2xl sm:text-3xl lg:text-[42px] leading-tight"
              : "text-xl sm:text-2xl md:text-[28px]"
          }`}
        >
          {title}
        </h1>
        {text && (
          <p className="text-[15px] text-[#94A3B8] max-w-3xl font-normal leading-relaxed">
            {text}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
          {action}
        </div>
      )}
    </div>
  );
}
