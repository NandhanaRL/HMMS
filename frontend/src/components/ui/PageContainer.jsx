export default function PageContainer({
  children,
  className = "",
  maxWidth = "7xl",
}) {
  const widths = {
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div className="relative min-h-full w-full">
      {/* Soft ambient gradient glows in background */}
      <div className="fixed top-0 left-64 right-0 h-96 bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="fixed -top-32 right-12 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div
        className={`w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-10 pb-16 ${
          widths[maxWidth] || "max-w-7xl"
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
