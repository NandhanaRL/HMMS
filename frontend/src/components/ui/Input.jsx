export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = "",
  id,
  type = "text",
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-medium text-[#94A3B8]"
        >
          {label} {required && <span className="text-[#DC2626]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            <Icon size={16} />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          required={required}
          className={`w-full bg-[#0F172A] hover:bg-[#1A2338] focus:bg-[#111827] text-[#F8FAFC] placeholder-slate-500 text-[15px] rounded-2xl border ${
            error
              ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20"
              : "border-white/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/25"
          } transition-all duration-200 outline-none ${
            Icon ? "pl-10 pr-3.5 py-2.5" : "px-3.5 py-2.5"
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-[13px] text-[#DC2626] mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-[13px] text-[#94A3B8] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}

export function Select({
  label,
  error,
  children,
  className = "",
  id,
  required = false,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[13px] font-medium text-[#94A3B8]"
        >
          {label} {required && <span className="text-[#DC2626]">*</span>}
        </label>
      )}

      <select
        id={selectId}
        required={required}
        className={`w-full bg-[#0F172A] hover:bg-[#1A2338] focus:bg-[#111827] text-[#F8FAFC] text-[15px] rounded-2xl border ${
          error
            ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20"
            : "border-white/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/25"
        } transition-all duration-200 outline-none px-3.5 py-2.5 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>

      {error && <p className="text-[13px] text-[#DC2626] mt-1">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className = "",
  id,
  rows = 4,
  required = false,
  ...props
}) {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={areaId}
          className="block text-[13px] font-medium text-[#94A3B8]"
        >
          {label} {required && <span className="text-[#DC2626]">*</span>}
        </label>
      )}

      <textarea
        id={areaId}
        rows={rows}
        required={required}
        className={`w-full bg-[#0F172A] hover:bg-[#1A2338] focus:bg-[#111827] text-[#F8FAFC] placeholder-slate-500 text-[15px] rounded-2xl border ${
          error
            ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20"
            : "border-white/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/25"
        } transition-all duration-200 outline-none p-3.5 resize-y ${className}`}
        {...props}
      />

      {error && <p className="text-[13px] text-[#DC2626] mt-1">{error}</p>}
    </div>
  );
}