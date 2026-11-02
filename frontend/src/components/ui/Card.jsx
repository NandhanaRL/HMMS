export default function Card({
  children,
  className = "",
  hoverLift = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#111827] border border-white/[0.06] rounded-3xl p-6 shadow-soft transition-smooth ${
        hoverLift ? "hover:-translate-y-1 hover:shadow-card" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-lg sm:text-[24px] font-semibold text-[#F8FAFC] tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-[13px] text-[#94A3B8] mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`pt-4 mt-5 border-t border-white/[0.06] flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}