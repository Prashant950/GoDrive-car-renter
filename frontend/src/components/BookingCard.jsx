import { useState } from "react";
import { FiCalendar, FiUser, FiMapPin, FiClock, FiCheckCircle, FiAlertCircle, FiCopy, FiCheck } from "react-icons/fi";
import { FaCarSide, FaKey, FaShieldAlt } from "react-icons/fa";
import { formatINR, formatDateTime, statusStyle } from "../utils/format.js";

// Sleek, executive, and compact booking card for customer & admin dashboards
export default function BookingCard({ booking: b, onPay, onCancel, admin = false }) {
  const [copied, setCopied] = useState(false);

  const canPay = b.paymentStatus === "Pending" && b.status !== "Cancelled";
  const canCancel = !["Cancelled", "Completed"].includes(b.status);

  const copyBookingId = () => {
    navigator.clipboard.writeText(b._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tokenPaidDisplay = b.paymentStatus === "Paid"
    ? `Paid ${formatINR(b.amountPaid || b.registrationFee || 2)}`
    : "Payment Pending";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-card hover:border-gold-400 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left: Thumbnail & Core Vehicle Info */}
        <div className="flex items-center gap-4 min-w-0 w-full lg:w-auto">
          <div className="relative h-20 w-28 sm:h-24 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center">
            {b.vehicleImage ? (
              <img
                src={b.vehicleImage}
                alt={b.vehicleName}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <FaCarSide className="text-slate-300 text-3xl" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`badge !py-0.5 !px-2 text-[10px] font-bold ${statusStyle(b.status)}`}>
                {b.status}
              </span>
              <span
                className={`badge !py-0.5 !px-2 text-[10px] font-bold ${
                  b.paymentStatus === "Paid" ? "badge-green" : "badge-amber"
                }`}
              >
                {tokenPaidDisplay}
              </span>
            </div>

            <h3 className="font-display text-base sm:text-lg font-bold text-primary-900 truncate">
              {b.vehicleName}
            </h3>

            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
              <span>ID: #{b._id.slice(-8).toUpperCase()}</span>
              <button
                type="button"
                onClick={copyBookingId}
                className="text-slate-400 hover:text-primary-700 transition"
                title="Copy Booking ID"
              >
                {copied ? <FiCheck className="text-emerald-600" size={13} /> : <FiCopy size={12} />}
              </button>
              {admin && b.customerName && (
                <span className="truncate text-slate-600 font-medium">· {b.customerName}</span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium mt-1">
              {b.serviceType} · {b.withDriver ? "With Chauffeur" : "Self Drive"} ({b.days} Day{b.days > 1 ? "s" : ""})
            </p>
          </div>
        </div>

        {/* Center: Trip Timeline & Location */}
        <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 text-xs text-slate-600 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gold-600 shrink-0" size={14} />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup</span>
              <span className="font-bold text-primary-900">{formatDateTime(b.startDate)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t sm:border-t-0 lg:border-t border-slate-200/60">
            <FiClock className="text-primary-500 shrink-0" size={14} />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Return</span>
              <span className="font-bold text-primary-900">{formatDateTime(b.endDate)}</span>
            </div>
          </div>
        </div>

        {/* Right: Payment Breakdown & Action Buttons */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 min-w-[180px]">
          <div className="text-left sm:text-right">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Rent</p>
            <p className="font-display text-lg font-black text-primary-900 leading-tight">
              {formatINR(b.estimatedTotal)}
            </p>
            <div className="flex items-center gap-2 mt-0.5 text-xs">
              <span className="font-bold text-emerald-700">Paid: {formatINR(b.amountPaid)}</span>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-amber-700">Due: {formatINR(b.balanceDue)}</span>
            </div>
          </div>

          {!admin && (onPay || onCancel) && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              {canPay && onPay && (
                <button
                  type="button"
                  onClick={() => onPay(b)}
                  className="btn-gold btn-sm !py-2 !px-4 text-xs font-black shadow-sm flex items-center gap-1.5"
                >
                  <FaKey size={12} /> Pay Token
                </button>
              )}
              {canCancel && onCancel && (
                <button
                  type="button"
                  onClick={() => onCancel(b)}
                  className="btn-outline btn-sm !py-1.5 !px-3 text-xs font-bold !border-red-200 !text-red-600 hover:!bg-red-50"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
