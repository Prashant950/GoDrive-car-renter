import { useState } from "react";
import toast from "react-hot-toast";
import { FiShield, FiLoader, FiCheckCircle } from "react-icons/fi";
import { FaQrcode, FaKey } from "react-icons/fa";
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si";
import Modal from "./Modal.jsx";
import {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  usePayRegistrationMutation,
} from "../services/user/userPaymentApi.js";
import { launchRazorpayCheckout } from "../utils/razorpay.js";
import { useAuth } from "../context/AuthContext.jsx";
import { REGISTRATION_FEE } from "../utils/constants.js";
import { formatINR, formatDateTime } from "../utils/format.js";

// Pay the advance registration token for an already-created (pending) booking.
export default function RegistrationPayModal({ open, onClose, booking, onPaid }) {
  const { user } = useAuth();
  const [createRazorpayOrderMutation, { isLoading: isCreatingOrder }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPaymentMutation, { isLoading: isVerifyingPayment }] = useVerifyRazorpayPaymentMutation();
  const [payRegistrationMutation, { isLoading: isLegacyPaying }] = usePayRegistrationMutation();

  if (!booking) return null;

  const tokenAmount = booking.registrationFee ?? booking.advanceTokenPaid ?? REGISTRATION_FEE;
  const balanceDue = booking.balanceDue ?? Math.max(0, (booking.estimatedTotal || 0) - tokenAmount);

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      // 1. Create order
      const orderRes = await createRazorpayOrderMutation({ bookingId: booking._id }).unwrap();

      // 2. Launch Razorpay Checkout
      await launchRazorpayCheckout({
        orderData: orderRes,
        user,
        booking,
        onSuccess: async (razorpayResponse) => {
          try {
            const verifyRes = await verifyRazorpayPaymentMutation({
              bookingId: booking._id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            }).unwrap();

            toast.success("Thank you! Advance token paid & booking confirmed! 🎉");
            onPaid?.(verifyRes.booking);
            onClose();
          } catch (verr) {
            toast.error(verr?.data?.message || "Payment verification failed");
          }
        },
        onError: (err) => {
          toast.error(err?.message || "Payment was cancelled");
        },
      });
    } catch (err) {
      // Fallback in case of credentials/network issue
      const msg = err?.data?.message || err?.message || "";
      if (msg.includes("credentials") || msg.includes("network")) {
        try {
          const res = await payRegistrationMutation({ bookingId: booking._id }).unwrap();
          toast.success("Payment successful (Demo Mode)! 🎉");
          onPaid?.(res.booking);
          onClose();
        } catch (fErr) {
          toast.error(fErr?.data?.message || "Payment failed");
        }
      } else {
        toast.error(msg || "Failed to initiate payment gateway");
      }
    }
  };

  const loading = isCreatingOrder || isVerifyingPayment || isLegacyPaying;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Confirm Token for ${booking.vehicleName}`}
      maxWidth="max-w-md"
    >
      <div className="p-6 space-y-4">
        {/* Reassurance Banner */}
        <div className="flex gap-3 rounded-2xl bg-gradient-to-r from-gold-500/15 via-amber-500/10 to-primary-50 p-4 border border-gold-500/30">
          <FiShield className="mt-0.5 shrink-0 text-gold-600" size={22} />
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p className="font-bold text-primary-900 mb-0.5">
              Lock {booking.vehicleName} with {formatINR(tokenAmount)} advance token!
            </p>
            <p className="text-xs text-slate-500">
              The balance of <strong>{formatINR(balanceDue)}</strong> is payable at vehicle delivery. 100% adjusted in your final bill.
            </p>
          </div>
        </div>

        {/* Real Vehicle & Amounts Breakdown */}
        <div className="space-y-2.5 rounded-2xl bg-slate-50 p-4 text-sm border border-slate-200">
          <Row label="Vehicle Model" value={booking.vehicleName} />
          <Row label="Driving Mode" value={booking.withDriver ? "With Driver" : "Self Drive"} />
          <Row label="Pickup Date" value={formatDateTime(booking.startDate)} />
          <Row label="Duration" value={`${booking.days} day(s)`} />
          <Row label="Total Estimated Rent" value={formatINR(booking.estimatedTotal)} />
          <Row label="Balance at Handover" value={formatINR(balanceDue)} />

          <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-2">
            <div>
              <span className="font-bold text-primary-900 block">Payable Now (Token)</span>
              <span className="text-[11px] text-emerald-600 font-semibold">100% Adjusted in Final Bill</span>
            </div>
            <span className="font-display text-2xl font-black text-gold-600">
              {formatINR(tokenAmount)}
            </span>
          </div>
        </div>

        <form onSubmit={handlePay} className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full !py-3.5 font-bold shadow-lg shadow-gold-500/25 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" /> Connecting Razorpay…
              </>
            ) : (
              <>
                <FaKey /> Pay {formatINR(tokenAmount)} Token via Razorpay
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500 text-xs sm:text-sm">{label}</span>
      <span className="text-right font-bold text-primary-900 text-xs sm:text-sm">{value}</span>
    </div>
  );
}
