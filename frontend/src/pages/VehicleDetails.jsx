import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiStar,
  FiUsers,
  FiCheck,
  FiPhone,
  FiShield,
  FiClock,
  FiTag,
  FiChevronRight,
  FiCheckCircle,
  FiFileText,
  FiMapPin,
  FiAward,
  FiAlertCircle,
  FiHelpCircle,
  FiChevronDown,
  FiSmartphone,
  FiWifi,
  FiTv,
  FiCamera,
  FiZap,
  FiNavigation,
  FiRadio,
  FiKey,
  FiTrendingUp,
  FiPercent,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { FaCarSide, FaBolt, FaGasPump, FaShieldAlt, FaWind, FaCarCrash } from "react-icons/fa";
import { BsFuelPump, BsSpeedometer2, BsSuitcase, BsShieldCheck } from "react-icons/bs";
import { TbManualGearbox, TbCalendarEvent, TbSteeringWheel } from "react-icons/tb";
import { IoColorPaletteOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import PageBanner from "../components/PageBanner.jsx";
import Loader from "../components/Loader.jsx";
import CarCard from "../components/CarCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import { useGetVehicleByIdQuery, useGetVehiclesQuery } from "../services/user/userVehicleApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatINR } from "../utils/format.js";

// Helper to assign a dynamic icon to any feature string
function getFeatureIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("camera") || n.includes("rear")) return FiCamera;
  if (n.includes("airbag") || n.includes("abs") || n.includes("ebd") || n.includes("safety")) return FaShieldAlt;
  if (n.includes("android") || n.includes("carplay") || n.includes("apple")) return FiSmartphone;
  if (n.includes("touch") || n.includes("infotainment") || n.includes("screen") || n.includes("display")) return FiTv;
  if (n.includes("ac") || n.includes("air condition") || n.includes("climate")) return FaWind;
  if (n.includes("bluetooth") || n.includes("wifi") || n.includes("wireless")) return FiWifi;
  if (n.includes("sensor") || n.includes("parking")) return FiRadio;
  if (n.includes("cruise") || n.includes("speed")) return BsSpeedometer2;
  if (n.includes("gps") || n.includes("navigation") || n.includes("map")) return FiNavigation;
  if (n.includes("usb") || n.includes("charging") || n.includes("power")) return FiZap;
  if (n.includes("lock") || n.includes("keyless") || n.includes("key")) return FiKey;
  return FiCheckCircle;
}

const VEHICLE_FAQS = [
  {
    q: "How does the ₹500 Advance Token Confirmation work?",
    a: "You only pay ₹500 online to immediately lock and reserve this vehicle for your selected dates. The remaining balance rental is paid conveniently at the time of car delivery/handover.",
  },
  {
    q: "What is the fuel policy for this car?",
    a: "We operate on a standard same-to-same fuel policy. The car is handed over with a noted fuel level (e.g. 50% or full), and you return it with the same level.",
  },
  {
    q: "Are tolls, FASTag & interstate taxes included?",
    a: "Every GoDrive car is equipped with an active NHAI FASTag. Toll and parking charges are automatically deducted from the FASTag and settled transparently during return.",
  },
  {
    q: "What happens in case of an unexpected breakdown?",
    a: "All vehicles include 24×7 Pan-India Roadside Assistance (RSA). In case of any technical issue, our emergency support team dispatches immediate on-ground assistance or a replacement car.",
  },
];

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, openAuth } = useAuth();

  const { data: vehicle, isLoading: loading } = useGetVehicleByIdQuery(id, {
    pollingInterval: 3000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const { data: allVehicles = [] } = useGetVehiclesQuery(
    vehicle?.category ? { category: vehicle.category } : undefined,
    { skip: !vehicle?.category, pollingInterval: 5000, refetchOnFocus: true }
  );

  const [activeImg, setActiveImg] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const related = vehicle
    ? allVehicles.filter((x) => x._id !== vehicle._id).slice(0, 4)
    : [];

  useEffect(() => {
    if (vehicle?.image) {
      setActiveImg(vehicle.image);
    }
  }, [vehicle]);

  const handleBook = () => {
    if (!vehicle?.available) return;
    if (isAuthenticated) {
      setBookingOpen(true);
    } else {
      openAuth("login", () => setBookingOpen(true));
    }
  };

  if (loading) {
    return (
      <div className="section">
        <Loader label="Loading car details…" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="section container-x text-center">
        <h1 className="font-display text-3xl font-bold text-primary-700">Car not found</h1>
        <p className="mt-2 text-slate-500">This vehicle may have been removed or updated.</p>
        <Link to="/vehicles" className="btn-primary mt-6">
          Back to all vehicles
        </Link>
      </div>
    );
  }

  const gallery = [vehicle.image, ...(vehicle.gallery || [])].filter(Boolean);
  const specs = [
    { icon: BsFuelPump, label: "Fuel Type", value: vehicle.fuelType, accent: "text-amber-500 bg-amber-500/10" },
    { icon: TbManualGearbox, label: "Transmission", value: vehicle.transmission, accent: "text-blue-500 bg-blue-500/10" },
    { icon: FiUsers, label: "Seating", value: `${vehicle.seats} Seats`, accent: "text-emerald-500 bg-emerald-500/10" },
    { icon: BsSuitcase, label: "Luggage Space", value: `${vehicle.luggage} Bags`, accent: "text-purple-500 bg-purple-500/10" },
    { icon: BsSpeedometer2, label: "Efficiency", value: vehicle.mileage || "18-22 km/l", accent: "text-indigo-500 bg-indigo-500/10" },
    { icon: IoColorPaletteOutline, label: "Color", value: vehicle.color || "Metallic", accent: "text-rose-500 bg-rose-500/10" },
    { icon: TbCalendarEvent, label: "Model Year", value: vehicle.year || "2024", accent: "text-teal-500 bg-teal-500/10" },
    { icon: FiTag, label: "Fleet Category", value: vehicle.category, accent: "text-gold-600 bg-amber-500/10" },
  ];

  return (
    <>
      <PageBanner
        title={vehicle.name}
        crumb={vehicle.name}
        subtitle={`${vehicle.brand} · ${vehicle.category} · Sanitized & GPS Enabled`}
      />

      <section className="section bg-slate-50/50">
        <div className="container-x">
          {/* Breadcrumb back link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-700 hover:text-gold-600 transition"
            >
              <FiArrowLeft size={16} /> Back to all vehicles
            </Link>
            <div className="flex items-center gap-2">
              <span className="badge-navy">{vehicle.category}</span>
              <span className="badge-gold flex items-center gap-1">
                <FiStar className="fill-gold-500 text-gold-500" /> {vehicle.rating || 4.8}
              </span>
            </div>
          </div>

          {/* Main Showcase & Booking Grid */}
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left: Interactive Showcase & Gallery (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 space-y-4"
            >
              {/* Primary Car Display Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-primary-50/30 p-6 sm:p-10 shadow-card">
                <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                  <span className="badge-navy">{vehicle.category}</span>
                  {vehicle.featured && (
                    <span className="badge-gold flex items-center gap-1">
                      <FiAward /> Top Pick
                    </span>
                  )}
                </div>

                {!vehicle.available ? (
                  <span className="badge-red absolute right-5 top-5 z-10">Currently Unavailable</span>
                ) : (
                  <span className="badge-green absolute right-5 top-5 z-10 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ready for Instant Booking
                  </span>
                )}

                {/* Main Vehicle Image */}
                <div className="relative my-4 flex h-[280px] sm:h-[380px] w-full items-center justify-center">
                  <div className="absolute h-60 w-60 rounded-full bg-gradient-to-tr from-gold-400/20 to-primary-400/20 blur-3xl sm:h-72 sm:w-72" />
                  <img
                    src={activeImg}
                    alt={vehicle.name}
                    className="relative z-10 max-h-full max-w-full object-contain drop-shadow-xl transition-all duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {gallery.map((g, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(g)}
                      className={`h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-2 shadow-xs transition-all duration-200 ${
                        activeImg === g
                          ? "border-primary-800 ring-2 ring-primary-500/20 scale-105"
                          : "border-slate-200 hover:border-primary-400 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={g} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Key Specs Card Grid */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
                <h3 className="mb-4 font-display text-lg font-bold text-primary-900 flex items-center gap-2">
                  <TbSteeringWheel className="text-gold-500" size={22} /> Key Technical Specifications
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {specs.map(({ icon: Icon, label, value, accent }) => (
                    <div
                      key={label}
                      className="group rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition-all duration-200 hover:bg-white hover:border-slate-200 hover:shadow-xs"
                    >
                      <div className={`mb-2 inline-grid h-8 w-8 place-items-center rounded-xl ${accent}`}>
                        <Icon size={16} />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                      <p className="truncate text-xs sm:text-sm font-bold text-primary-900 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Booking Summary & Sticky Price Card (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Main Booking Card */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-card space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-gold-600">
                      {vehicle.brand} Verified
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <FiTrendingUp className="text-emerald-500" /> 50+ Trips
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-primary-950 mt-1">
                    {vehicle.name}
                  </h2>
                </div>

                {/* Pricing Block */}
                <div className="rounded-2xl bg-gradient-to-br from-primary-950 to-primary-900 p-5 text-white shadow-lg space-y-3">
                  <div className="flex items-end justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                        {vehicle.priceDuration || "24 Hours / Per Day"} Rate
                      </span>
                      <p className="font-display text-3xl sm:text-4xl font-black text-white">
                        {formatINR(vehicle.pricePerDay)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Chauffeur / Driver
                      </span>
                      <p className="text-sm font-bold text-gold-400">
                        +{formatINR(vehicle.withDriverPrice ?? 800)}/day
                      </p>
                    </div>
                  </div>

                  {/* Token Highlight */}
                  <div className="flex items-center justify-between rounded-xl bg-white/10 p-3 border border-white/10">
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        Advance Confirmation Token:
                      </p>
                      <p className="text-[11px] text-slate-300">Pay ₹500 now, rest at vehicle delivery</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-2xl font-black text-gold-400">₹500</span>
                    </div>
                  </div>
                </div>

                {/* Booking Benefits Checklist */}
                <div className="space-y-2.5 pt-1 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-emerald-500 shrink-0" size={16} />
                    <span><strong>Free Doorstep Delivery</strong> within 5 Kilometers</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-emerald-500 shrink-0" size={16} />
                    <span><strong>100% Commercial Insurance</strong> &amp; RSA support</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-emerald-500 shrink-0" size={16} />
                    <span><strong>Zero Security Deposit</strong> hassle</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-emerald-500 shrink-0" size={16} />
                    <span><strong>Free Date Reschedule</strong> up to 12 hrs before pickup</span>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBook}
                    disabled={!vehicle.available}
                    className="btn-gold w-full !py-4 text-base font-black shadow-xl shadow-gold-500/25 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{vehicle.available ? "Book This Car · Pay ₹500 Token" : "Currently Unavailable"}</span>
                    {vehicle.available && (
                      <FiChevronRight className="transition-transform group-hover:translate-x-1" size={18} />
                    )}
                  </button>

                  <Link
                    to="/contact"
                    className="btn-outline w-full !py-3 flex items-center justify-center gap-2 font-bold text-xs sm:text-sm"
                  >
                    <FiPhone className="text-primary-700" /> Have Questions? Enquire with Us
                  </Link>
                </div>
              </div>

              {/* Required Documents Pill Box */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <FiFileText className="text-primary-700" /> Handover Document Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <span className="block font-bold text-primary-900">Valid Driving DL</span>
                    <span className="text-[10px] text-slate-400">Original license</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <span className="block font-bold text-primary-900">Aadhaar / ID</span>
                    <span className="text-[10px] text-slate-400">Govt. photo ID</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <span className="block font-bold text-primary-900">Age 21+ Years</span>
                    <span className="text-[10px] text-slate-400">Eligible rider</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ---------------- INTERACTIVE ANIMATED FEATURES & AMENITIES SECTION ---------------- */}
          <div className="mt-14 space-y-12">
            {/* Features Card Section */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-card">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="font-display text-2xl font-bold text-primary-900 flex items-center gap-2">
                    <FiShield className="text-gold-500" /> Features &amp; Cabin Amenities
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Equipped with modern comfort, multimedia, and active safety technologies for a seamless trip.
                  </p>
                </div>
                <span className="badge-navy text-xs">
                  {vehicle.features?.length || 0} Features Included
                </span>
              </div>

              {vehicle.features && vehicle.features.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {vehicle.features.map((feature, idx) => {
                    const Icon = getFeatureIcon(feature);
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="group flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all duration-300 hover:border-gold-400/60 hover:bg-white hover:shadow-md"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-900 text-gold-400 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-primary-950">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs sm:text-sm font-bold text-primary-900 group-hover:text-primary-800">
                            {feature}
                          </p>
                          <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                            <FiCheck size={11} /> Included
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Standard factory specifications included.</p>
              )}
            </div>

            {/* About Car & Rental Perks Grid */}
            <div className="grid gap-8 lg:grid-cols-12">
              {/* About description (7 cols) */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card space-y-4">
                <h3 className="font-display text-2xl font-bold text-primary-900">About {vehicle.name}</h3>
                <p className="leading-relaxed text-slate-600 text-sm sm:text-base">
                  {vehicle.description ||
                    `The ${vehicle.name} is a thoroughly inspected, high-performance ${vehicle.category.toLowerCase()} designed for city commuting, corporate travel, and relaxed highway road trips. Featuring a spacious cabin, premium seating, crisp infotainment, and prompt doorstep delivery.`}
                </p>

                {/* 3 Step Booking Flow */}
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h4 className="font-display text-base font-bold text-primary-900 mb-4">
                    How Self-Drive Rental Works
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-900 text-gold-400 text-xs font-bold mb-2">1</span>
                      <p className="font-bold text-primary-900 text-xs">Reserve Online</p>
                      <p className="text-[11px] text-slate-500 mt-1">Select dates &amp; pay ₹500 advance confirmation token.</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-900 text-gold-400 text-xs font-bold mb-2">2</span>
                      <p className="font-bold text-primary-900 text-xs">Doorstep Handover</p>
                      <p className="text-[11px] text-slate-500 mt-1">Show original Driving License &amp; receive sanitized car.</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-900 text-gold-400 text-xs font-bold mb-2">3</span>
                      <p className="font-bold text-primary-900 text-xs">Drive &amp; Return</p>
                      <p className="text-[11px] text-slate-500 mt-1">Enjoy unlimited freedom and return smoothly.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive Rental Protection (5 cols) */}
              <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-primary-950 to-primary-900 p-6 sm:p-8 text-white shadow-card space-y-5">
                <div>
                  <span className="badge-gold !text-[10px] uppercase tracking-wider font-black">
                    Guaranteed Protection
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-2">
                    GoDrive Peace-of-Mind Promise
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Every rental is backed by transparent commercial standards:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-400">
                      <FaShieldAlt size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Full Commercial Insurance</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">Comprehensive damage &amp; third-party liability coverage on all trips.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-400">
                      <FiClock size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">24×7 Roadside Assistance</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">Immediate towing, flat-tire help, or replacement car support.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-400">
                      <FiTag size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">No Hidden Charges</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">Transparent per-day rates with just ₹500 advance booking token.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Specific FAQs Accordion */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-primary-900 mb-6 flex items-center gap-2">
                <FiHelpCircle className="text-gold-500" /> Frequently Asked Questions
              </h3>
              <div className="divide-y divide-slate-100">
                {VEHICLE_FAQS.map((faq, i) => (
                  <div key={i} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                      className="flex w-full items-center justify-between text-left font-bold text-primary-900 text-sm sm:text-base hover:text-gold-600 transition"
                    >
                      <span>{faq.q}</span>
                      <FiChevronDown
                        className={`shrink-0 transition-transform duration-200 ${
                          openFaq === i ? "rotate-180 text-gold-500" : "text-slate-400"
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Similar Vehicles Carousel / Grid */}
          {related.length > 0 && (
            <div className="mt-16">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-primary-900">Similar Cars in Fleet</h3>
                  <p className="text-xs text-slate-500">Explore other popular options in {vehicle.category}.</p>
                </div>
                <Link to="/vehicles" className="text-xs sm:text-sm font-bold text-gold-600 hover:underline">
                  View full catalog &rarr;
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((v, i) => (
                  <CarCard key={v._id} vehicle={v} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} vehicle={vehicle} />
    </>
  );
}
