import { useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiCheckCircle, FiPhone, FiMail, FiUser, FiCreditCard } from "react-icons/fi";
import Loader from "../../components/Loader.jsx";
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation } from "../../services/admin/adminBookingApi.js";
import { formatINR, formatDateTime, statusStyle } from "../../utils/format.js";

const STATUSES = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
const CHANGEABLE = ["Pending", "Confirmed", "Completed", "Cancelled"];

export default function ManageBookings() {
  const [filter, setFilter] = useState("All");
  const [updating, setUpdating] = useState(null);

  // Real-time polling for instant updates when payments occur
  const { data: bookings = [], isLoading: loading } = useGetAllBookingsQuery(
    filter && filter !== "All" ? { status: filter } : undefined,
    {
      pollingInterval: 3000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  const changeStatus = async (b, status) => {
    if (status === b.status) return;
    setUpdating(b._id);
    try {
      await updateBookingStatus({ id: b._id, status }).unwrap();
      toast.success(`Booking status updated to ${status}`);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to update booking status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary-900">Manage Bookings &amp; Payments</h2>
          <p className="text-xs text-slate-500">Live view of customer self-drive bookings and Razorpay token payments.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Real-Time Feed
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const count = s === "All" ? bookings.length : bookings.filter((b) => b.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition ${
                filter === s
                  ? "bg-primary-900 text-gold-400 shadow-md"
                  : "bg-white text-slate-600 shadow-card hover:text-primary-900"
              }`}
            >
              {s} {count > 0 && <span className="opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {loading ? (
        <Loader label="Loading live bookings…" />
      ) : bookings.length ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-primary-950 text-white">
                <tr>
                  <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Vehicle Model</th>
                  <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Trip Schedule</th>
                  <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Payment Breakdown</th>
                  <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Payment Status</th>
                  <th className="px-5 py-4 font-bold text-xs uppercase tracking-wider">Booking Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="align-top transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-primary-900">{b.customerName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <FiPhone size={12} className="text-slate-400" />
                        <a href={`tel:${b.customerMobile}`} className="hover:text-gold-600 hover:underline">{b.customerMobile}</a>
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <FiMail size={12} className="text-slate-400" />
                        <span className="truncate max-w-[180px]">{b.customerEmail}</span>
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-primary-900">{b.vehicleName}</p>
                      <p className="text-xs text-slate-500 font-medium">
                        {b.serviceType} · {b.withDriver ? "With Chauffeur" : "Self Drive"}
                      </p>
                      {b.pickupLocation && (
                        <p className="text-[11px] text-slate-400 mt-1 truncate max-w-[200px]">
                          📍 {b.pickupLocation}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 font-medium">
                      <p className="font-bold text-primary-900">{formatDateTime(b.startDate)}</p>
                      <p className="text-slate-500">to {formatDateTime(b.endDate)}</p>
                      <span className="inline-block mt-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {b.days} Day(s) Trip
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-primary-900 text-sm">{formatINR(b.estimatedTotal)}</p>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5">
                        Paid: {formatINR(b.amountPaid)}
                      </p>
                      <p className="text-xs font-bold text-amber-700">
                        Due: {formatINR(b.balanceDue)}
                      </p>
                      {b.paymentId && (
                        <p className="text-[10px] font-mono text-slate-400 mt-1">
                          ID: {b.paymentId}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${statusStyle(b.paymentStatus)}`}>
                        {b.paymentStatus === "Paid" ? "Token Paid" : b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={b.status}
                        disabled={updating === b._id}
                        onChange={(e) => changeStatus(b, e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-primary-900 shadow-xs focus:border-gold-400 focus:outline-none"
                      >
                        {CHANGEABLE.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-card">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary-50 text-primary-700">
            <FiCalendar size={28} />
          </div>
          <p className="text-lg font-bold text-primary-900">No bookings found</p>
          <p className="mt-1 text-xs text-slate-400">Customer reservations and token payments will appear here in real-time.</p>
        </div>
      )}
    </div>
  );
}
