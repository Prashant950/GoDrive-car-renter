import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowRight,
  FiCalendar,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiPlusCircle,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
} from "react-icons/fi";
import { FaCarSide, FaKey } from "react-icons/fa";
import BookingCard from "../../components/BookingCard.jsx";
import RegistrationPayModal from "../../components/RegistrationPayModal.jsx";
import Loader from "../../components/Loader.jsx";
import { useGetMyBookingsQuery, useCancelBookingMutation } from "../../services/user/userBookingApi.js";
import { formatINR } from "../../utils/format.js";

const FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
const ITEMS_PER_PAGE = 6;

export default function MyBookings() {
  const { data: bookings = [], isLoading: loading } = useGetMyBookingsQuery(undefined, {
    pollingInterval: 3000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [cancelBooking] = useCancelBookingMutation();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [payFor, setPayFor] = useState(null);

  // Filter and Search logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchFilter = filter === "All" || b.status === filter;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        b.vehicleName?.toLowerCase().includes(q) ||
        b._id?.toLowerCase().includes(q) ||
        b.pickupLocation?.toLowerCase().includes(q) ||
        b.serviceType?.toLowerCase().includes(q);

      return matchFilter && matchSearch;
    });
  }, [bookings, filter, search]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBookings, page]);

  const handlePaid = () => {
    setPayFor(null);
  };

  const handleCancel = async (b) => {
    if (!window.confirm(`Cancel your booking for ${b.vehicleName}?`)) return;
    try {
      await cancelBooking(b._id).unwrap();
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to cancel booking");
    }
  };

  if (loading) return <Loader label="Loading your bookings…" />;

  return (
    <div className="space-y-6">
      {/* Header & Quick CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary-900">My Bookings &amp; Journeys</h2>
          <p className="text-xs text-slate-500">
            Track your reserved self-drive cars, advance tokens, and trip dates.
          </p>
        </div>

        <Link
          to="/vehicles"
          className="btn-gold !py-2.5 !px-5 text-xs sm:text-sm font-bold shadow-md inline-flex items-center gap-2"
        >
          <FaKey /> Book Another Car
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-card">
        {/* Search Bar */}
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by car name, location, or booking ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input !py-2 !pl-10 !text-xs sm:!text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => {
            const count = f === "All" ? bookings.length : bookings.filter((b) => b.status === f).length;
            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  filter === f
                    ? "bg-primary-900 text-gold-400 shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f} <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      {paginatedBookings.length ? (
        <div className="space-y-3.5">
          {paginatedBookings.map((b) => (
            <BookingCard
              key={b._id}
              booking={b}
              onPay={setPayFor}
              onCancel={handleCancel}
            />
          ))}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs font-semibold text-slate-500">
                Showing <span className="font-bold text-primary-900">{(page - 1) * ITEMS_PER_PAGE + 1}</span> -{" "}
                <span className="font-bold text-primary-900">
                  {Math.min(page * ITEMS_PER_PAGE, filteredBookings.length)}
                </span>{" "}
                of <span className="font-bold text-primary-900">{filteredBookings.length}</span> Bookings
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  <FiChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setPage(pNum)}
                    className={`h-8 min-w-[32px] px-2 rounded-xl text-xs font-bold transition ${
                      page === pNum
                        ? "bg-primary-900 text-gold-400 shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-card">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary-50 text-primary-700">
            <FiCalendar size={28} />
          </div>
          <p className="text-lg font-bold text-primary-900">
            {search ? "No matching bookings found" : filter === "All" ? "No bookings yet" : `No ${filter} bookings`}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {search ? "Try searching with a different car name or booking ID." : "Book your first self-drive car with just a small token."}
          </p>
          <Link to="/vehicles" className="btn-gold mt-5 !py-2.5 !px-6 font-bold shadow-md inline-flex items-center gap-2">
            Browse Fleet <FiArrowRight />
          </Link>
        </div>
      )}

      {/* Pay Token Modal */}
      <RegistrationPayModal
        open={!!payFor}
        onClose={() => setPayFor(null)}
        booking={payFor}
        onPaid={handlePaid}
      />
    </div>
  );
}
