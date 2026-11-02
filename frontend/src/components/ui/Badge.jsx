export default function Badge({
  children,
  variant,
  status,
  size = "md",
  dot = true,
  className = "",
}) {
  // Resolve variant from status if provided
  let effectiveVariant = variant || "neutral";
  if (status) {
    const s = String(status).toUpperCase();
    if (["PAID", "APPROVED", "AVAILABLE", "ACTIVE", "PRESENT"].includes(s)) {
      effectiveVariant = "success";
    } else if (["PENDING", "WARNING", "PARTIAL"].includes(s)) {
      effectiveVariant = "warning";
    } else if (["REJECTED", "UNPAID", "FULL", "INACTIVE", "ABSENT"].includes(s)) {
      effectiveVariant = "danger";
    } else if (["STUDENT", "SINGLE", "DOUBLE", "TRIPLE"].includes(s)) {
      effectiveVariant = "primary";
    } else if (["WARDEN", "MESS_MANAGER", "ADMIN"].includes(s)) {
      effectiveVariant = "purple";
    }
  }

  const sizes = {
    sm: "px-2.5 py-0.5 text-[11px] gap-1.5",
    md: "px-3 py-1 text-[13px] gap-2",
    lg: "px-3.5 py-1.5 text-sm gap-2",
  };

  const variants = {
    success: {
      badge: "bg-[#16A34A]/10 text-emerald-400 border border-[#16A34A]/25",
      dot: "bg-emerald-400",
    },
    warning: {
      badge: "bg-[#D97706]/10 text-amber-400 border border-[#D97706]/25",
      dot: "bg-amber-400",
    },
    danger: {
      badge: "bg-[#DC2626]/10 text-rose-400 border border-[#DC2626]/25",
      dot: "bg-rose-400",
    },
    primary: {
      badge: "bg-[#2563EB]/10 text-blue-400 border border-[#2563EB]/25",
      dot: "bg-blue-400",
    },
    purple: {
      badge: "bg-purple-500/10 text-purple-400 border border-purple-500/25",
      dot: "bg-purple-400",
    },
    cyan: {
      badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25",
      dot: "bg-cyan-400",
    },
    neutral: {
      badge: "bg-slate-800/80 text-slate-300 border border-slate-700/80",
      dot: "bg-slate-400",
    },
  };

  const current = variants[effectiveVariant] || variants.neutral;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${
        sizes[size] || sizes.md
      } ${current.badge} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${current.dot} shrink-0`}
        />
      )}
      {children || status}
    </span>
  );
}
