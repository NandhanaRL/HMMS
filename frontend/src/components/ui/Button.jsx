export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  isLoading,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const isBusy = Boolean(loading || isLoading);
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#060C1B]";

  const sizes = {
    sm: "h-8 px-3.5 text-xs gap-1.5",
    md: "h-10 sm:h-11 px-4 sm:px-5 text-[14px] gap-2",
    lg: "h-12 px-6 text-[15px] gap-2.5",
  };

  const variants = {
    primary:
      "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-soft hover:shadow-card hover:-translate-y-0.5 focus:ring-[#2563EB]",
    secondary:
      "bg-[#1A2338] hover:bg-[#202B44] text-[#F8FAFC] border border-white/10 hover:border-white/20 shadow-soft hover:-translate-y-0.5 focus:ring-[#2563EB]",
    outline:
      "bg-transparent hover:bg-[#2563EB]/10 text-blue-400 border border-[#2563EB]/30 hover:border-[#2563EB]/60 focus:ring-[#2563EB]",
    ghost:
      "bg-transparent hover:bg-white/5 text-[#94A3B8] hover:text-[#F8FAFC] focus:ring-slate-500",
    danger:
      "bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-soft hover:shadow-card hover:-translate-y-0.5 focus:ring-[#DC2626]",
    success:
      "bg-[#16A34A] hover:bg-[#15803D] text-white shadow-soft hover:shadow-card hover:-translate-y-0.5 focus:ring-[#16A34A]",
  };

  return (
    <button
      type={type}
      disabled={disabled || isBusy}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {isBusy ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />}
          {children}
          {Icon && iconPosition === "right" && <Icon size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />}
        </>
      )}
    </button>
  );
}