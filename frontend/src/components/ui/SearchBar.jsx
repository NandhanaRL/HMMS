import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  onClear,
}) {
  return (
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <div className="absolute left-3.5 pointer-events-none text-slate-400">
        <Search size={16} />
      </div>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#0F172A] hover:bg-[#1A2338] focus:bg-[#111827] text-[#F8FAFC] placeholder-slate-500 text-[14px] rounded-2xl border border-white/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/25 pl-10 pr-9 py-2.5 transition-all duration-200 outline-none"
      />

      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange({ target: { value: "" } }))}
          className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
