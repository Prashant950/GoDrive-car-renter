import { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiBell, FiLogOut, FiExternalLink, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { useGetMyNotificationsQuery } from "../services/user/userNotificationApi.js";
import { useGetAdminNotificationsQuery } from "../services/admin/adminNotificationApi.js";

// Reusable dashboard shell (sidebar + topbar) for both user & admin areas.
export default function DashboardShell({ brand = "GoDrive Self Drive", badge, links = [], scope = "user" }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false); // mobile drawer

  const notifPath = scope === "admin" ? "/admin/notifications" : "/dashboard/notifications";

  const { data: userNotifData } = useGetMyNotificationsQuery(undefined, { skip: scope === "admin" });
  const { data: adminNotifData } = useGetAdminNotificationsQuery(undefined, { skip: scope !== "admin" });

  const unread = scope === "admin" ? adminNotifData?.unread || 0 : userNotifData?.unread || 0;

  // close drawer on navigation
  useEffect(() => setOpen(false), [location.pathname]);

  const active = links.find((l) => (l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)));

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2.5 px-6 py-6">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-gold-400 to-amber-500 font-display text-lg font-black text-primary-950 shadow-sm">
          G
        </span>
        <div>
          <p className="font-display text-lg font-black leading-none text-white tracking-tight">GoDrive</p>
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-gold-400 mt-0.5">{badge || "Self Drive"}</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white/10 text-gold-400"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={19} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          <FiExternalLink size={19} /> Back to website
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-red-500/20 hover:text-red-300"
        >
          <FiLogOut size={19} /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-primary-800 lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 lg:hidden"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-5 text-white/70 hover:text-white"
                aria-label="Close menu"
              >
                <FiX size={22} />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl text-primary-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-bold text-primary-700">
              {active?.label || brand}
            </h1>
          </div>

          <Link
            to={notifPath}
            className="relative grid h-10 w-10 place-items-center rounded-xl text-primary-700 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <FiBell size={20} />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-primary-800">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-700 text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
            <div className="hidden sm:block">
              <p className="max-w-[140px] truncate text-sm font-semibold leading-none text-primary-700">
                {user?.name}
              </p>
              <p className="text-[11px] text-slate-400">{user?.email}</p>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
