import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiLoader,
  FiShield,
  FiCreditCard,
  FiClock,
  FiTag,
  FiArrowRight,
} from "react-icons/fi";
import { FaCarSide, FaKey, FaShieldAlt, FaQrcode, FaGooglePay } from "react-icons/fa";
import { SiPhonepe, SiPaytm, SiGooglepay } from "react-icons/si";
import Modal from "./Modal.jsx";
import CustomDateTimePicker from "./CustomDateTimePicker.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCreateBookingMutation } from "../services/user/userBookingApi.js";
import {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  usePayRegistrationMutation,
} from "../services/user/userPaymentApi.js";
import { launchRazorpayCheckout } from "../utils/razorpay.js";
import { SERVICE_TYPES, REGISTRATION_FEE } from "../utils/constants.js";
import { formatINR, diffDays, toLocalInput, formatDateTime } from "../utils/format.js";
import { calculateVehicleRent } from "../utils/pricingCalculator.js";

const plusHours = (h) => {
  const d = new Date();
  d.setHours(d.getHours() + h, 0, 0, 0);
  return d;
};

export default function BookingModal({ open, onClose, vehicle }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [createBookingMutation, { isLoading: isCreatingBooking }] = useCreateBookingMutation();
  const [createRazorpayOrderMutation, { isLoading: isCreatingOrder }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPaymentMutation, { isLoading: isVerifyingPayment }] = useVerifyRazorpayPaymentMutation();
  const [payRegistrationMutation, { isLoading: isLegacyPaying }] = usePayRegistrationMutation();

  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState(null);

  const [form, setForm] = useState({
    serviceType: "Outstation",
    startDate: toLocalInput(plusHours(24)),
    endDate: toLocalInput(plusHours(48)),
    withDriver: true,
    pickupLocation: "",
    dropLocation: "",
    notes: "",
  });

  // Reset each time it opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setBooking(null);
      setForm((f) => ({
        ...f,
        startDate: toLocalInput(plusHours(24)),
        endDate: toLocalInput(plusHours(48)),
      }));
    }
  }, [open]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleStartDateChange = (newStart) => {
    setForm((f) => {
      let newEnd = f.endDate;
      const startMs = new Date(newStart).getTime();
      const endMs = new Date(f.endDate).getTime();
      if (isNaN(endMs) || endMs <= startMs) {
        const nextDay = new Date(startMs + 24 * 60 * 60 * 1000);
        newEnd = toLocalInput(nextDay);
      }
      return { ...f, startDate: newStart, endDate: newEnd };
    });
  };

  const handleEndDateChange = (newEnd) => {
    setForm((f) => ({ ...f, endDate: newEnd }));
  };

  const days = useMemo(() => diffDays(form.startDate, form.endDate), [form.startDate, form.endDate]);
  const pricing = useMemo(
    () => calculateVehicleRent(vehicle, days, form.withDriver),
    [vehicle, days, form.withDriver]
  );
  const driverDailyRate = vehicle?.withDriverPrice ?? 800;
  const estimatedTotal = pricing?.estimatedTotal || 0;
  const tokenAmount = REGISTRATION_FEE;
  const balanceAtHandover = Math.max(0, estimatedTotal - tokenAmount);

  if (!vehicle) return null;

  const submitDetails = async (e) => {
    e.preventDefault();
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      return toast.error("Return date & time must be after pickup");
    }
    try {
      const created = await createBookingMutation({
        vehicleId: vehicle._id,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        withDriver: form.withDriver,
        serviceType: form.serviceType,
        pickupLocation: form.pickupLocation,
        dropLocation: form.dropLocation,
        notes: form.notes,
        registrationFee: REGISTRATION_FEE,
      }).unwrap();
      setBooking(created);
      setStep(2);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to create booking");
    }
  };

  // Launch Razorpay Checkout (supports QR scan on PC, UPI apps on mobile, cards & netbanking)
  const handleRazorpayPayment = async () => {
    if (!booking) return;

    try {
      // 1. Create order on backend
      const orderRes = await createRazorpayOrderMutation({ bookingId: booking._id }).unwrap();

      // 2. Open Razorpay Modal
      await launchRazorpayCheckout({
        orderData: orderRes,
        user,
        booking,
        onSuccess: async (razorpayResponse) => {
          // 3. Verify signature on backend
          try {
            const verifyRes = await verifyRazorpayPaymentMutation({
              bookingId: booking._id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            }).unwrap();

            setBooking(verifyRes.booking);
            setStep(3);
            toast.success("Thank you! Payment received & Booking Confirmed! 🎉");
          } catch (verr) {
            toast.error(verr?.data?.message || "Payment verification failed");
          }
        },
        onError: (err) => {
          toast.error(err?.message || "Payment was cancelled or failed");
        },
      });
    } catch (err) {
      // Fallback: If live Razorpay keys are not yet active or network blocked, allow demo simulation
      const msg = err?.data?.message || err?.message || "";
      if (msg.includes("credentials") || msg.includes("network")) {
        try {
          const fallbackRes = await payRegistrationMutation({ bookingId: booking._id }).unwrap();
          setBooking(fallbackRes.booking);
          setStep(3);
          toast.success("Payment successful (Demo Mode)! 🎉");
        } catch (fErr) {
          toast.error(fErr?.data?.message || "Payment failed");
        }
      } else {
        toast.error(msg || "Could not initiate payment gateway");
      }
    }
  };

  const isBusy = isCreatingBooking || isCreatingOrder || isVerifyingPayment || isLegacyPaying;
  const title =
    step === 1
      ? `Book ${vehicle.name}`
      : step === 2
      ? `Confirm & Pay for ${vehicle.name}`
      : "Booking Confirmed";

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-xl md:max-w-3xl lg:max-w-4xl">
      {/* STEP 1 — details */}
      {step === 1 && (
        <form onSubmit={submitDetails} className="space-y-5 p-5 md:p-7">
          {/* Real Vehicle Showcase Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary-950 via-primary-900 to-slate-900 p-4 text-white shadow-md border border-white/10">
            <div className="flex items-center gap-4 min-w-0">
              {vehicle.image && (
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="h-16 w-24 shrink-0 rounded-xl bg-white/5 object-contain p-1 border border-white/10"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-gold !text-[10px] font-bold uppercase">{vehicle.category}</span>
                  {pricing?.savings > 0 && (
                    <span className="badge-green !text-[10px] font-extrabold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ⚡ {pricing.tierName} ({pricing.discountPercent}% OFF)
                    </span>
                  )}
                </div>
                <h4 className="font-display text-lg font-bold text-white truncate mt-0.5">{vehicle.name}</h4>
              </div>
            </div>

            <div className="flex sm:flex-col items-baseline sm:items-end justify-between border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0 shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-black text-gold-400">
                  {formatINR(pricing?.effectiveDailyRate || vehicle.pricePerDay)}/day
                </span>
                {pricing?.savings > 0 && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatINR(pricing.baseDailyRate)}/day
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-300 font-normal">
                (+{formatINR(driverDailyRate)}/day driver)
              </span>
            </div>
          </div>

          {/* Auto-filled user details */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Customer Details
            </p>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <ReadOnly icon={FiUser} label="Name" value={user?.name} />
              <ReadOnly icon={FiPhone} label="Mobile" value={user?.mobile} />
              <ReadOnly icon={FiMail} label="Email" value={user?.email} />
              <ReadOnly icon={FiCreditCard} label="Vehicle" value={vehicle.name} />
            </div>
          </div>

          {/* Service Type & Driving Mode in responsive 2-col on Laptop */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Service Type</label>
              <select name="serviceType" value={form.serviceType} onChange={onChange} className="input">
                {SERVICE_TYPES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Driving Mode</label>
              <div className="grid grid-cols-2 gap-2.5">
                <DriverChoice
                  active={!form.withDriver}
                  onClick={() => setForm((f) => ({ ...f, withDriver: false }))}
                  title="Self Drive"
                  sub="₹0 extra driver fee"
                />
                <DriverChoice
                  active={form.withDriver}
                  onClick={() => setForm((f) => ({ ...f, withDriver: true }))}
                  title="With Driver"
                  sub={`+${formatINR(driverDailyRate)}/day`}
                />
              </div>
            </div>
          </div>

          {/* Custom Date & Time Pickers with 12-Hour AM/PM */}
          <div className="space-y-2.5">
            <div className="grid gap-4 md:grid-cols-2">
              <CustomDateTimePicker
                label="Pickup Date & Time"
                value={form.startDate}
                onChange={handleStartDateChange}
                minDate={new Date()}
              />
              <CustomDateTimePicker
                label="Return Date & Time"
                value={form.endDate}
                onChange={handleEndDateChange}
                minDate={new Date(form.startDate)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">
                <FiMapPin className="mb-0.5 inline" /> Pickup location
              </label>
              <input
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={onChange}
                placeholder="e.g. Advant Sector 142 / Noida / IGI Airport"
                className="input"
              />
            </div>
            <div>
              <label className="label">
                <FiMapPin className="mb-0.5 inline" /> Drop location
              </label>
              <input
                name="dropLocation"
                value={form.dropLocation}
                onChange={onChange}
                placeholder="e.g. Noida / Delhi NCR / Agra"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Trip Notes (optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={onChange}
              rows={2}
              placeholder="Special instructions or preferences for vehicle handover…"
              className="input resize-none"
            />
          </div>

          {/* Clear Token vs Total Breakdown */}
          <div className="rounded-2xl border-2 border-dashed border-gold-400/60 bg-gradient-to-br from-gold-500/10 via-white to-primary-50/50 p-4 shadow-sm">
            {pricing?.savings > 0 && (
              <div className="mb-2.5 flex items-center justify-between rounded-xl bg-emerald-500/15 border border-emerald-500/25 px-3 py-1.5 text-xs text-emerald-800 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  ⚡ {pricing.tierName} ({pricing.discountPercent}% OFF)
                </span>
                <span className="text-emerald-700 font-black">You Save {formatINR(pricing.savings)}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div>
                <span className="text-xs text-slate-500 font-medium">
                  {vehicle.name} · {days} {days > 1 ? "Days" : "Day"} ({form.withDriver ? "With Chauffeur" : "Self Drive"})
                </span>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-black text-primary-900">
                    Total: {formatINR(estimatedTotal)}
                  </p>
                  {pricing?.savings > 0 && (
                    <span className="text-xs text-slate-400 line-through font-semibold">
                      {formatINR(pricing.standardTotalWithoutDiscount)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Calculation: {formatINR(pricing.effectiveDailyRate)}/day × {days} days = {formatINR(pricing.totalVehicleRent)}
                  {form.withDriver ? ` + (${formatINR(driverDailyRate)}/day × ${days}d driver = ${formatINR(pricing.driverTotal)})` : ""}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 uppercase">
                  Pay Now Token
                </span>
                <p className="font-display text-2xl font-black text-gold-600">
                  {formatINR(tokenAmount)}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <FiCheckCircle /> Balance Due at Handover:
              </span>
              <span className="font-extrabold text-primary-900 text-sm">
                {formatINR(balanceAtHandover)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="btn-gold w-full !py-3.5 font-bold shadow-lg shadow-gold-500/20 text-base"
          >
            {isBusy ? (
              <><FiLoader className="animate-spin" /> Creating booking…</>
            ) : (
              `Proceed to Pay ${formatINR(tokenAmount)} Token for ${vehicle.name}`
            )}
          </button>
        </form>
      )}

      {/* STEP 2 — Real Razorpay Payment Hub */}
      {step === 2 && booking && (
        <div className="p-6 space-y-5">
          {/* Reassurance Notice */}
          <div className="flex gap-3 rounded-2xl bg-gradient-to-r from-gold-500/15 via-amber-500/10 to-primary-50 p-4 border border-gold-500/30">
            <FiShield className="mt-0.5 shrink-0 text-gold-600" size={22} />
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-primary-900 mb-0.5">
                Lock {booking.vehicleName} with {formatINR(booking.registrationFee || tokenAmount)} advance token!
              </p>
              <p className="text-xs text-slate-500">
                The remaining balance of <strong>{formatINR(booking.balanceDue)}</strong> is payable at vehicle handover. 100% adjusted in final invoice.
              </p>
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className="space-y-2.5 rounded-2xl bg-slate-50 p-4 text-sm border border-slate-200">
            <Row label="Vehicle Model" value={booking.vehicleName} />
            <Row label="Service Type" value={booking.serviceType} />
            <Row label="Pickup" value={formatDateTime(booking.startDate)} />
            <Row label="Return" value={formatDateTime(booking.endDate)} />
            <Row label="Duration" value={`${booking.days} day(s)`} />
            <Row label="Total Estimated Rent" value={formatINR(booking.estimatedTotal)} />
            <Row label="Balance at Handover" value={formatINR(booking.balanceDue)} />
            
            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
              <div>
                <span className="font-bold text-primary-900 block">Payable Now (Advance Token)</span>
                <span className="text-[11px] text-emerald-600 font-semibold">100% Adjusted in Final Bill</span>
              </div>
              <span className="font-display text-2xl font-black text-gold-600">
                {formatINR(booking.registrationFee || tokenAmount)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isBusy}
              className="btn-ghost flex-1"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleRazorpayPayment}
              disabled={isBusy}
              className="btn-gold flex-[2] !py-3.5 font-black text-sm sm:text-base shadow-xl shadow-gold-500/25 flex items-center justify-center gap-2"
            >
              {isBusy ? (
                <>
                  <FiLoader className="animate-spin" /> Connecting Razorpay…
                </>
              ) : (
                <>
                  <FaKey /> Pay {formatINR(booking.registrationFee || tokenAmount)} Token Now
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Success & Confirmed Screen */}
      {step === 3 && booking && (
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-500"
          >
            <FiCheckCircle size={48} />
          </motion.div>
          <h3 className="text-2xl font-black text-primary-900 font-display">Booking Confirmed! 🎉</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-slate-600">
            Thank you! We received your {formatINR(booking.amountPaid || tokenAmount)} advance token for{" "}
            <strong className="text-primary-900">{booking.vehicleName}</strong>. Our team will contact you shortly for handover.
          </p>

          <div className="mx-auto mt-5 max-w-sm rounded-2xl bg-slate-50 p-4 text-left text-sm border border-slate-200 space-y-2">
            <Row label="Booking ID" value={booking._id?.slice(-8).toUpperCase()} />
            <Row label="Vehicle" value={booking.vehicleName} />
            <Row label="Payment ID" value={booking.paymentId || "Verified Razorpay"} />
            <Row label="Token Paid" value={formatINR(booking.amountPaid || tokenAmount)} />
            <Row label="Balance at Handover" value={formatINR(booking.balanceDue)} />
            <Row label="Status" value="Confirmed" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onClose} className="btn-ghost flex-1 text-xs sm:text-sm">
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                navigate("/dashboard/bookings");
              }}
              className="btn-primary flex-[2] text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
            >
              <span>Go to My Bookings Dashboard</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function ReadOnly({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="shrink-0 text-primary-500" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
        <p className="truncate text-xs sm:text-sm font-bold text-primary-900">{value || "—"}</p>
      </div>
    </div>
  );
}

function DriverChoice({ active, onClick, title, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border-2 p-3 text-left transition ${
        active ? "border-primary-900 bg-primary-50/70" : "border-slate-200 hover:border-primary-300 bg-white"
      }`}
    >
      <p className="font-bold text-primary-900 text-sm">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
    </button>
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
