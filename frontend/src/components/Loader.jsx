export default function Loader({ light = false, label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-10 ${className}`}>
      <div
        className={`h-10 w-10 animate-spin rounded-full border-4 ${
          light ? "border-white/30 border-t-white" : "border-primary-200 border-t-primary-700"
        }`}
      />
      {label && (
        <p className={`text-sm font-medium ${light ? "text-white/90" : "text-slate-500"}`}>
          {label}
        </p>
      )}
    </div>
  );
}
