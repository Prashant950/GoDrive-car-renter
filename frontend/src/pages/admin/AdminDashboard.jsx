import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FiDollarSign,
  FiCalendar,
  FiTruck,
  FiUsers,
  FiPlus,
  FiMessageSquare,
} from "react-icons/fi";
import StatCard from "../../components/StatCard.jsx";
import Loader from "../../components/Loader.jsx";
import CategoryModal from "../../components/CategoryModal.jsx";
import { useGetUserStatsQuery } from "../../services/admin/adminUserApi.js";
import { formatINR, formatDate, statusStyle } from "../../utils/format.js";

const PIE_COLORS = { Pending: "#f5a623", Confirmed: "#059669", Completed: "#00264d", Cancelled: "#ef4444" };

// Build a 7-day skeleton and merge in aggregated counts.
function buildDaily(daily = []) {
  const map = Object.fromEntries((daily || []).map((d) => [d._id, d]));
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    out.push({
      key,
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      bookings: map[key]?.count || 0,
      revenue: map[key]?.revenue || 0,
    });
  }
  return out;
}

export default function AdminDashboard() {
  const { data: stats, isLoading: loading } = useGetUserStatsQuery(undefined, {
    pollingInterval: 4000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [recentPage, setRecentPage] = useState(1);

  const RECENT_PER_PAGE = 5;
  const totalRecentPages = Math.ceil((stats?.recentBookings?.length || 0) / RECENT_PER_PAGE) || 1;
  const paginatedRecent = useMemo(() => {
    const start = (recentPage - 1) * RECENT_PER_PAGE;
    return (stats?.recentBookings || []).slice(start, start + RECENT_PER_PAGE);
  }, [stats?.recentBookings, recentPage]);

  const recentStartIndex = (stats?.recentBookings?.length || 0) === 0 ? 0 : (recentPage - 1) * RECENT_PER_PAGE + 1;
  const recentEndIndex = Math.min(recentPage * RECENT_PER_PAGE, stats?.recentBookings?.length || 0);

  const daily = useMemo(() => buildDaily(stats?.daily), [stats]);
  const pieData = useMemo(
    () =>
      stats
        ? [
            { name: "Pending", value: stats.pendingBookings },
            { name: "Confirmed", value: stats.confirmedBookings },
            { name: "Completed", value: stats.completedBookings },
            { name: "Cancelled", value: stats.cancelledBookings },
          ].filter((d) => d.value > 0)
        : [],
    [stats]
  );

  if (loading) return <Loader label="Loading dashboard…" />;
  if (!stats) return <p className="text-slate-500">Could not load statistics.</p>;

  return (
    <div className="space-y-8">
      {/* Quick Action Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5 border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-display text-xl font-bold text-primary-900">Admin Control Center</h2>
          <p className="text-xs text-slate-500">Manage fleet categories, vehicles, bookings, customer enquiries and live platform revenue.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/vehicles/add" className="btn-primary flex items-center gap-2">
            <FiPlus /> Add New Vehicle
          </Link>
        </div>
      </div>

      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />

      {/* Interactive, Clickable & Animated Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon={FiDollarSign}
          label="Revenue Collected"
          value={formatINR(stats.totalRevenue)}
          accent="green"
          sub="View bookings & payments"
          to="/admin/bookings"
        />
        <StatCard
          icon={FiCalendar}
          label="Total Bookings"
          value={stats.totalBookings}
          accent="navy"
          sub={`${stats.pendingBookings || 0} pending approval`}
          to="/admin/bookings"
        />
        <StatCard
          icon={FiTruck}
          label="Fleet Vehicles"
          value={stats.totalVehicles}
          accent="gold"
          sub="Manage inventory & rates"
          to="/admin/vehicles"
        />
        <StatCard
          icon={FiUsers}
          label="Registered Users"
          value={stats.totalUsers}
          accent="amber"
          sub="Customer accounts"
          to="/admin/users"
        />
        <StatCard
          icon={FiMessageSquare}
          label="Customer Enquiries"
          value={stats.totalEnquiries || 0}
          accent="purple"
          sub={`${stats.pendingEnquiries || 0} new messages`}
          to="/admin/enquiries"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 lg:col-span-2"
        >
          <h3 className="mb-4 font-display text-lg font-bold text-primary-700">Bookings · last 7 days</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="bkg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00264d" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#00264d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                  formatter={(v, n) => (n === "revenue" ? [formatINR(v), "Revenue"] : [v, "Bookings"])}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#00264d"
                  strokeWidth={2.5}
                  fill="url(#bkg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card p-6"
        >
          <h3 className="mb-4 font-display text-lg font-bold text-primary-700">Booking status</h3>
          {pieData.length ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={PIE_COLORS[d.name]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="grid h-72 place-items-center text-sm text-slate-400">No bookings yet</div>
          )}
        </motion.div>
      </div>

      {/* Recent bookings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-primary-900">Recent Bookings</h3>
            <p className="text-xs text-slate-500">Latest reservations placed by customers across the platform.</p>
          </div>
          <Link to="/admin/bookings" className="text-sm font-semibold text-gold-600 hover:underline">
            View All Bookings &rarr;
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Car</th>
                  <th className="px-5 py-3 font-medium">Pickup Date</th>
                  <th className="px-5 py-3 font-medium">Token / Paid</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedRecent?.length ? (
                  paginatedRecent.map((b) => (
                    <tr key={b._id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-primary-700">{b.customerName}</p>
                        <p className="text-xs text-slate-400">{b.customerEmail || b.customerMobile}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{b.vehicleName}</td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(b.startDate)}</td>
                      <td className="px-5 py-4 font-semibold text-emerald-600">{formatINR(b.amountPaid)}</td>
                      <td className="px-5 py-4">
                        <span className={`badge ${statusStyle(b.status)}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                      No bookings recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Bookings Pagination Bar */}
          {totalRecentPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-5 py-3.5 bg-slate-50/50">
              <p className="text-xs font-semibold text-slate-500">
                Showing <span className="font-bold text-primary-900">{recentStartIndex}–{recentEndIndex}</span> of{" "}
                <span className="font-bold text-primary-900">{stats.recentBookings?.length || 0}</span> recent bookings
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setRecentPage((p) => Math.max(1, p - 1))}
                  disabled={recentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <FiChevronLeft size={16} />
                </button>

                {Array.from({ length: totalRecentPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setRecentPage(pageNum)}
                    className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold transition ${
                      recentPage === pageNum
                        ? "bg-primary-900 text-white shadow-xs"
                        : "border border-slate-200 text-slate-600 hover:bg-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setRecentPage((p) => Math.min(totalRecentPages, p + 1))}
                  disabled={recentPage === totalRecentPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
