import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title = "No data found",
  description = "There are no records to display at this time.",
  actionText,
  onAction,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-[24px] bg-[#111827]/40 border border-white/[0.05] ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 shadow-lg shadow-blue-500/5">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-white tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-6">
        {description}
      </p>
      {action ? (
        action
      ) : actionText && onAction ? (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}
