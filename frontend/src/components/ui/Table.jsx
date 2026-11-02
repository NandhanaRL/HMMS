export default function Table({ children, className = "" }) {
  return (
    <div className={`w-full overflow-hidden rounded-3xl border border-white/[0.06] bg-[#111827] shadow-soft ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ children, className = "" }) {
  return (
    <thead className={`sticky top-0 z-10 bg-[#0F172A] border-b border-white/[0.06] text-[15px] font-medium text-[#94A3B8] ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }) {
  return (
    <tbody className={`divide-y divide-white/[0.04] text-[15px] text-[#F8FAFC] ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", onClick, isClickable = false }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors duration-150 hover:bg-[#1A2338]/60 ${
        isClickable ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "", align = "left" }) {
  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <th className={`py-4 px-6 font-medium ${alignments[align] || "text-left"} ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", align = "left" }) {
  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td className={`py-4 px-6 align-middle font-normal ${alignments[align] || "text-left"} ${className}`}>
      {children}
    </td>
  );
}
