import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiArrowRight,
  FiPlusCircle,
  FiMapPin,
  FiPhone,
  FiUser,
  FiBell,
  FiShield,
  FiChevronRight,
  FiChevronLeft,
  FiStar,
} from "react-icons/fi";
import { FaCarSide, FaKey, FaShieldAlt } from "react-icons/fa";
import StatCard from "../../components/StatCard.jsx";
import Loader from "../../components/Loader.jsx";
import { useGetMyBookingsQuery } from "../../services/user/userBookingApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatINR, formatDate, statusStyle } from "../../utils/format.js";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading: loading } = useGetMyBookingsQuery(undefined, {
    pollingInterval: 3000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const stats = useMemo(() => {
    const active = bookings.filter((b) => ["Pending", "Confirmed"].includes(b.status)).length;
    const paid = bookings.reduce((s, b) => s + (b.amountPaid || 0), 0);
    const pendingPay = bookings.filter((b) => b.paymentStatus === "Pending" && b.status !== "Cancelled").length;
    const completed = bookings.filter((b) => b.status === "Completed").length;
    return { total: bookings.length, active, paid, pendingPay, completed };
  }, [bookings]);

  // Next upcoming / active booking
  const activeBooking = useMemo(() => {
    return bookings.find((b) => ["Confirmed", "Pending"].includes(b.status));
  }, [bookings]);

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return bookings.slice(start, start + ITEMS_PER_PAGE);
  }, [bookings, page]);

  if (loading) return <Loader label="Loading your dashboard…" />;

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Quick CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 p-6 sm:p-8 text-white shadow-2xl border border-white/10"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="relative z-10 space-y-1">
         
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold !text-white">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Manage your self-drive trips, review token payments, and book verified vehicles.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link
            to="/vehicles"
            className="btn-gold !py-3 !px-6 text-xs sm:text-sm font-extrabold shadow-lg shadow-gold-500/25 flex items-center gap-2"
          >
            <FaKey /> Book Another Car
          </Link>
          <Link
            to="/dashboard/bookings"
            className="btn-outline !py-3 !px-5 text-xs sm:text-sm font-bold !border-white/30 !text-white hover:!bg-white/10"
          >
            View All Trips
          </Link>
        </div>
      </motion.div>

      {/* 2. Clickable Interactive Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FiCalendar}
          label="Total Bookings"
          value={stats.total}
          sub="Click to view all"
          accent="navy"
          to="/dashboard/bookings"
        />
        <StatCard
          icon={FiCheckCircle}
          label="Active Journeys"
          value={stats.active}
          sub="Confirmed & upcoming"
          accent="green"
          to="/dashboard/bookings"
        />
        <StatCard
          icon={FiClock}
          label="Payment Pending"
          value={stats.pendingPay}
          sub="Token confirmation needed"
          accent="amber"
          to="/dashboard/bookings"
        />
        <StatCard
          icon={FiCreditCard}
          label="Total Paid"
          value={formatINR(stats.paid)}
          sub="Advance tokens settled"
          accent="gold"
          to="/dashboard/bookings"
        />
      </div>
      
      {/* 4. Active Trip Spotlight (if any active booking exists) */}
      {activeBooking && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
            <div>
              <span className="badge-navy !text-[11px] font-bold uppercase mb-1 inline-block">Active Journey Spotlight</span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-primary-900">
                {activeBooking.vehicleName}
              </h3>
              <p className="text-xs text-slate-500">
                Pickup Date: <strong className="text-primary-900">{formatDate(activeBooking.startDate)}</strong> ({activeBooking.days} Day{activeBooking.days > 1 ? "s" : ""})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`badge !py-1.5 !px-3.5 text-xs font-bold ${statusStyle(activeBooking.status)}`}>
                Status: {activeBooking.status}
              </span>
              <Link
                to="/dashboard/bookings"
                className="btn-primary btn-sm !py-2 !px-4 text-xs font-bold"
              >
                Manage Trip &rarr;
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pickup &amp; Handover</p>
              <p className="font-bold text-primary-900 text-sm mt-1 flex items-center gap-1.5">
                <FiMapPin className="text-gold-500 shrink-0" />
                <span className="truncate">{activeBooking.pickupLocation || "Noida / Delhi NCR Doorstep"}</span>
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Advance Token Paid</p>
              <p className="font-bold text-emerald-700 text-sm mt-1">
                {formatINR(activeBooking.advanceTokenPaid || activeBooking.amountPaid || 500)} (Confirmed)
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Balance Due at Delivery</p>
              <p className="font-bold text-primary-900 text-sm mt-1">
                {formatINR(activeBooking.balanceDue || (activeBooking.estimatedTotal - (activeBooking.amountPaid || 500)))}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 5. Recent Bookings Table with Pagination */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-primary-900">Recent Booking History</h3>
            <p className="text-xs text-slate-500">Track vehicle delivery status, dates, and payments.</p>
          </div>
          <Link to="/dashboard/bookings" className="text-xs sm:text-sm font-bold text-gold-600 hover:text-gold-700 hover:underline">
            View All ({bookings.length}) &rarr;
          </Link>
        </div>

        {bookings.length ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-primary-950 text-white">
                  <tr>
                    <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Vehicle</th>
                    <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Pickup Date</th>
                    <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Estimated Total</th>
                    <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Token Paid</th>
                    <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-center font-bold text-xs uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedBookings.map((b) => (
                    <tr key={b._id} className="transition-colors hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.vehicleImage}
                            alt=""
                            className="h-10 w-14 shrink-0 rounded-lg bg-slate-50 object-contain p-1 border border-slate-100"
                          />
                          <div>
                            <p className="font-bold text-primary-900 text-sm">{b.vehicleName}</p>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {b.withDriver ? "With Chauffeur" : "Self Drive"} · {b.days} Days
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{formatDate(b.startDate)}</td>
                      <td className="px-5 py-4 font-bold text-primary-900">{formatINR(b.estimatedTotal)}</td>
                      <td className="px-5 py-4">
                        <span className="font-extrabold text-emerald-700">
                          {formatINR(b.amountPaid || (b.paymentStatus === "Paid" ? b.registrationFee || 2 : 0))}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${statusStyle(b.status)}`}>{b.status}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Link
                          to="/dashboard/bookings"
                          className="btn-primary btn-sm !px-3.5 !py-1 text-xs font-bold"
                        >
                          View Trip
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3.5">
                <p className="text-xs font-semibold text-slate-500">
                  Showing Page <span className="font-bold text-primary-900">{page}</span> of{" "}
                  <span className="font-bold text-primary-900">{totalPages}</span>
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-card">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary-50 text-primary-700">
        <FiCalendar size={28} />
      </div>
      <p className="text-lg font-bold text-primary-900">No bookings yet</p>
      <p className="mt-1 text-xs sm:text-sm text-slate-500">Book your first self-drive car with just ₹500 token.</p>
      <Link to="/vehicles" className="btn-gold mt-5 !py-3 !px-6 font-bold shadow-md inline-flex items-center gap-2">
        Browse Vehicles <FiArrowRight />
      </Link>
    </div>
  );
}
