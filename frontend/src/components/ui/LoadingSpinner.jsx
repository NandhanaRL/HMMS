export default function LoadingSpinner({
  size = "md",
  className = "",
  label,
  text,
}) {
  const displayLabel = label || text || "Loading data...";
  const sizes = {
    sm: "h-5 w-5",
    md: "h-9 w-9",
    lg: "h-14 w-14",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-12 space-y-4 text-center ${className}`}
    >
      <div className="relative">
        {/* Glow blur background */}
        <div className="absolute inset-0 rounded-full blur-md bg-blue-500/30 animate-pulse" />
        <svg
          className={`animate-spin text-blue-500 relative z-10 ${
            sizes[size] || sizes.md
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {displayLabel && (
        <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
          {displayLabel}
        </p>
      )}
    </div>
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-[#111827]/70 border border-white/[0.05] rounded-3xl p-6 space-y-4 ${className}`}
    >
      <div className="h-4 bg-slate-800/80 rounded-full w-1/3" />
      <div className="h-8 bg-slate-700/60 rounded-xl w-1/2" />
      <div className="h-3 bg-slate-800/60 rounded-full w-2/3" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-white/[0.04]">
      <td className="py-4 px-6">
        <div className="h-4 bg-slate-800/80 rounded w-28" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-slate-800/80 rounded w-36" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-slate-800/80 rounded w-20" />
      </td>
      <td className="py-4 px-6">
        <div className="h-6 bg-slate-800/80 rounded-full w-16" />
      </td>
    </tr>
  );
}
