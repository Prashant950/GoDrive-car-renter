import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

// Animated, interactive stat tile used on user & admin dashboards.
export default function StatCard({
  icon: Icon,
  label,
  value,
  accent = "navy",
  sub,
  to,
  onClick,
}) {
  const accents = {
    navy: {
      bg: "bg-primary-50 text-primary-700",
      border: "hover:border-primary-400 hover:shadow-primary-500/10",
      glow: "from-primary-600 to-primary-800",
    },
    gold: {
      bg: "bg-amber-50 text-gold-600",
      border: "hover:border-gold-400 hover:shadow-gold-500/15",
      glow: "from-gold-400 to-amber-500",
    },
    green: {
      bg: "bg-emerald-50 text-emerald-600",
      border: "hover:border-emerald-400 hover:shadow-emerald-500/15",
      glow: "from-emerald-400 to-teal-600",
    },
    red: {
      bg: "bg-red-50 text-red-600",
      border: "hover:border-red-400 hover:shadow-red-500/15",
      glow: "from-red-400 to-rose-600",
    },
    amber: {
      bg: "bg-amber-50 text-amber-600",
      border: "hover:border-amber-400 hover:shadow-amber-500/15",
      glow: "from-amber-400 to-orange-500",
    },
    purple: {
      bg: "bg-indigo-50 text-indigo-600",
      border: "hover:border-indigo-400 hover:shadow-indigo-500/15",
      glow: "from-indigo-400 to-purple-600",
    },
  };

  const style = accents[accent] || accents.navy;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={to || onClick ? { y: -4, scale: 1.02 } : {}}
      whileTap={to || onClick ? { scale: 0.98 } : {}}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card transition-all duration-300 ${
        to || onClick ? `cursor-pointer ${style.border} hover:shadow-xl` : ""
      }`}
    >
      {/* Top Gradient Shimmer Accent on Hover */}
      <div
        className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${style.glow} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`grid h-13 w-13 shrink-0 place-items-center rounded-2xl ${style.bg} shadow-xs transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon size={24} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold uppercase tracking-wider text-slate-400">
              {label}
            </p>
            <p className="font-display text-2xl font-black text-primary-900 group-hover:text-primary-800 transition-colors">
              {value}
            </p>
            {sub && (
              <p className="truncate text-xs text-slate-500 mt-0.5 font-medium">
                {sub}
              </p>
            )}
          </div>
        </div>

        {/* Click indicator icon */}
        {(to || onClick) && (
          <div className="text-slate-300 group-hover:text-primary-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0">
            <FiArrowUpRight size={18} />
          </div>
        )}
      </div>
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className="block no-underline">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}
