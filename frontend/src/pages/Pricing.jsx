import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiArrowRight,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiShield,
  FiPercent,
  FiCheckCircle,
  FiClock,
  FiTag,
  FiHelpCircle,
  FiDollarSign,
  FiSliders,
} from "react-icons/fi";
import { FaCarSide, FaBolt, FaKey, FaShieldAlt } from "react-icons/fa";
import PageBanner from "../components/PageBanner.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import Loader from "../components/Loader.jsx";
import { useGetVehiclesQuery } from "../services/user/userVehicleApi.js";
import { formatINR } from "../utils/format.js";
import { REGISTRATION_FEE } from "../utils/constants.js";

const plans = [
  {
    name: "City Commute & Flex",
    tagline: "Short in-city drives & daily office runs",
    price: "₹1,800",
    unit: "/ day onwards",
    features: [
      "Hatchbacks & compact sedans (Swift, Dzire, Baleno)",
      "Self-drive or with professional chauffeur",
      "Free doorstep delivery & 100% sanitized cabin",
      "Pay ₹500 token to confirm instantly",
    ],
    popular: false,
  },
  {
    name: "Outstation Highway Pro",
    tagline: "Long-distance road trips & weekend getaways",
    price: "₹2,800",
    unit: "/ day onwards",
    features: [
      "SUVs, 7-Seaters & MUVs (Hyryder, Vitara, Creta, Ertiga)",
      "Unlimited KM freedom on all multi-day rentals",
      "24×7 Pan-India highway breakdown assistance & towing",
      "High fuel efficiency CNG & Hybrid engines",
    ],
    popular: true,
  },
  {
    name: "VIP & Wedding Luxury",
    tagline: "Weddings, VIP arrivals & corporate convoys",
    price: "₹4,500",
    unit: "/ day onwards",
    features: [
      "Fortuner 4x4, Innova Crysta & premium sedans",
      "Decorated wedding options with trained chauffeurs",
      "Multi-car convoy booking & dedicated coordinator",
      "Automated GST invoice billing for corporate accounts",
    ],
    popular: false,
  },
];

const feeBreakdown = [
  { item: "Advance Booking Token", fee: "₹500", detail: "100% adjusted directly against your rental bill" },
  { item: "Security Deposit Hold", fee: "₹0", detail: "Zero deposit hassle on verified identity documents" },
  { item: "Doorstep Delivery & Handover", fee: "Free", detail: "Complimentary delivery within city limits" },
  { item: "24×7 Roadside Assistance", fee: "Included", detail: "Pan-India highway breakdown & towing cover" },
  { item: "Commercial Insurance", fee: "Included", detail: "Bumper-to-bumper vehicle damage protection" },
  { item: "Professional Chauffeur (Optional)", fee: "+₹800 / day", detail: "Uniformed, background-verified highway driver" },
];

const faqs = [
  [
    "What is the ₹500 registration token fee?",
    "It is a small advance booking amount that confirms and locks your car reservation immediately. The balance rental is settled conveniently when our team delivers the vehicle. The ₹500 is completely adjusted against your final bill.",
  ],
  [
    "Is fuel included in the price?",
    "Our standard per-day rates are for the car rental (with or without driver). Fuel operates on a standard same-to-same policy, giving you full control and economy.",
  ],
  [
    "Can I drive the vehicle myself without a driver?",
    "Yes! GoDrive specializes in self-drive freedom. Simply select 'Self Drive' when booking. You only need a valid driving licence and government ID.",
  ],
  [
    "When will the GoDrive team contact me after booking?",
    "Within 10 to 30 minutes of receiving your ₹500 booking token, our concierge team calls you to confirm pickup time, delivery address, and document verification.",
  ],
  [
    "What documents are required for Self Drive?",
    "A valid Driving Licence and an Aadhaar Card or Passport for ID proof. For corporate clients, GST details can be added for invoicing.",
  ],
  [
    "What is the cancellation and rescheduling policy?",
    "We offer 100% free date rescheduling up to 12 hours prior to your scheduled pickup time. Cancellations done well in advance are handled transparently.",
  ],
];

export default function Pricing() {
  const { data: vehicles = [], isLoading: loading } = useGetVehiclesQuery(
    { sort: "price-asc" },
    {
      pollingInterval: 3000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const [open, setOpen] = useState(0);

  // Pagination for Rate Table (15 per page)
  const [tablePage, setTablePage] = useState(1);
  const TABLE_ITEMS_PER_PAGE = 15;

  const totalTablePages = Math.ceil(vehicles.length / TABLE_ITEMS_PER_PAGE) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (tablePage - 1) * TABLE_ITEMS_PER_PAGE;
    return vehicles.slice(start, start + TABLE_ITEMS_PER_PAGE);
  }, [vehicles, tablePage]);

  const startIdx = vehicles.length === 0 ? 0 : (tablePage - 1) * TABLE_ITEMS_PER_PAGE + 1;
  const endIdx = Math.min(tablePage * TABLE_ITEMS_PER_PAGE, vehicles.length);

  const handleTablePageChange = (p) => {
    setTablePage(p);
    const tableEl = document.getElementById("fleet-rate-table");
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Quick estimator state
  const [calcCategory, setCalcCategory] = useState("SUV");
  const [calcDays, setCalcDays] = useState(2);
  const [calcWithDriver, setCalcWithDriver] = useState(false);

  const estimatedRate = useMemo(() => {
    const baseRates = { Hatchback: 1800, Sedan: 3500, SUV: 3000, MUV: 3500, Luxury: 5500 };
    const base = baseRates[calcCategory] || 3000;
    const driver = calcWithDriver ? 800 : 0;
    const total = (base + driver) * calcDays;
    return { base, driver, total, perDay: base + driver };
  }, [calcCategory, calcDays, calcWithDriver]);

  return (
    <>
      <PageBanner
        title="Simple, Honest Pricing"
        crumb="Pricing"
        subtitle="No hidden charges. Reserve any car with just ₹500 advance token and pay the balance on delivery. Clear, transparent per-day rates across our vehicles."
      />

      {/* Package Plans Section */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Curated Packages"
            title="Choose the Rental Plan for Your Journey"
            subtitle="Tailored packages designed for short commutes, highway getaways, and special events."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {plans.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative flex flex-col rounded-3xl border-2 p-8 transition-all duration-300 hover:-translate-y-2.5 ${
                  p.popular
                    ? "border-primary-900 bg-gradient-to-b from-primary-900 to-primary-950 text-white shadow-2xl ring-2 ring-gold-400/50 hover:border-gold-400 hover:shadow-[0_20px_45px_-10px_rgba(245,158,11,0.35)]"
                    : "border-slate-200 bg-white shadow-card hover:border-gold-400 hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.22)]"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 px-4 py-1 text-xs font-black uppercase tracking-wider text-primary-950 shadow-md animate-pulse-glow">
                    ★ Most Popular Choice
                  </span>
                )}
                <h3 className={`text-2xl font-extrabold ${p.popular ? "!text-white" : "text-primary-900 group-hover:text-primary-800 transition-colors"}`}>
                  {p.name}
                </h3>
                <p className={`mt-1 text-xs sm:text-sm ${p.popular ? "text-slate-300" : "text-slate-500"}`}>
                  {p.tagline}
                </p>

                <div className="mt-6 flex items-end gap-1.5 border-b border-slate-100/20 pb-6">
                  <span className={`font-display text-4xl sm:text-5xl font-black ${p.popular ? "text-gold-400" : "text-primary-900"}`}>
                    {p.price}
                  </span>
                  <span className={`mb-1.5 text-xs sm:text-sm ${p.popular ? "text-slate-300" : "text-slate-500"}`}>
                    {p.unit}
                  </span>
                </div>

                <ul className="mt-6 space-y-3.5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <FiCheck className={`mt-0.5 shrink-0 font-bold ${p.popular ? "text-gold-400" : "text-emerald-500"}`} />
                      <span className={p.popular ? "text-slate-200" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/vehicles"
                  className={`mt-8 ${p.popular ? "btn-gold" : "btn-primary"} w-full !py-3.5 font-bold shadow-lg`}
                >
                  Choose {p.name} <FiArrowRight />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-primary-50 p-4 text-center text-xs font-semibold text-primary-800 border border-primary-100 flex items-center justify-center gap-2">
            <FaBolt className="text-gold-600" />
            <span>All bookings require a one-time {formatINR(REGISTRATION_FEE)} advance confirmation token, adjusted directly against your final bill.</span>
          </div>
        </div>
      </section>

      {/* Interactive Trip Estimator Card */}
      <section className="section bg-slate-50">
        <div className="container-x max-w-4xl">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-card">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-900 text-gold-400">
                <FiSliders size={22} />
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-primary-900">
                  Instant Rental Fare Estimator
                </h3>
                <p className="text-xs text-slate-500">Calculate estimated pricing based on duration and driver preference.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {/* Category */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Car Category
                </label>
                <select
                  value={calcCategory}
                  onChange={(e) => setCalcCategory(e.target.value)}
                  className="input font-semibold text-slate-700"
                >
                  <option value="Hatchback">Hatchback (Swift / Baleno)</option>
                  <option value="Sedan">Sedan (Verna / City)</option>
                  <option value="SUV">SUV (Creta / Hyryder / Vitara)</option>
                  <option value="MUV">7-Seater MUV (Ertiga / Innova)</option>
                  <option value="Luxury">Luxury SUV (Fortuner 4x4)</option>
                </select>
              </div>

              {/* Days */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Rental Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={calcDays}
                  onChange={(e) => setCalcDays(Math.max(1, Number(e.target.value)))}
                  className="input font-semibold text-slate-700"
                />
              </div>

              {/* Mode */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Driving Mode
                </label>
                <select
                  value={calcWithDriver ? "with" : "self"}
                  onChange={(e) => setCalcWithDriver(e.target.value === "with")}
                  className="input font-semibold text-slate-700"
                >
                  <option value="self">Self Drive (₹0 Extra)</option>
                  <option value="with">With Chauffeur (+₹800/day)</option>
                </select>
              </div>
            </div>

            {/* Calculated Result Box */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-primary-950 to-primary-900 p-5 text-white shadow-lg">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                  Estimated Rental Total ({calcDays} Day{calcDays > 1 ? "s" : ""})
                </span>
                <p className="font-display text-3xl font-black text-white">
                  {formatINR(estimatedRate.total)}
                  <span className="text-xs font-medium text-slate-400"> ({formatINR(estimatedRate.perDay)}/day)</span>
                </p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                  Pay only ₹500 advance token now to confirm
                </p>
              </div>

              <Link to="/vehicles" className="btn-gold !py-3 !px-6 font-bold shadow-md">
                Browse &amp; Book Now &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Pricing Inclusions & Fee Breakdown */}
      <section className="section bg-white">
        <div className="container-x max-w-4xl">
          <SectionHeader
            center
            eyebrow="Full Transparency"
            title="What's Included & Clear Fee Structure"
            subtitle="Zero surprise charges. Every rental includes comprehensive commercial protection."
          />

          <div className="mt-10 divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white shadow-card overflow-hidden">
            {feeBreakdown.map((row, idx) => (
              <div key={idx} className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6 transition hover:bg-slate-50">
                <div>
                  <p className="font-bold text-primary-900 text-sm sm:text-base">{row.item}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{row.detail}</p>
                </div>
                <span className="font-display text-base font-black text-primary-900 bg-slate-100 px-3.5 py-1.5 rounded-xl">
                  {row.fee}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Fleet Pricing Table */}
      <section id="fleet-rate-table" className="section bg-slate-50">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Vehicle Rate Card"
            title="Live Per-Day Rates Across All GoDrive Cars"
            subtitle="Transparent live pricing for every vehicle in our collection with real-time sync."
          />

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-card">
            {loading ? (
              <div className="p-12">
                <Loader label="Loading GoDrive rates…" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-primary-950 text-white">
                      <tr>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Car Model</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Fuel Type</th>
                        <th className="px-6 py-4 text-right font-bold text-xs uppercase tracking-wider">Per Day Rent</th>
                        <th className="px-6 py-4 text-right font-bold text-xs uppercase tracking-wider">+ With Driver</th>
                        <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedVehicles.map((v) => (
                        <tr key={v._id} className="transition-colors duration-200 hover:bg-gold-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5 font-bold text-primary-900">
                              {v.featured && <FiStar className="fill-gold-500 text-gold-500 shrink-0" size={14} />}
                              <span>{v.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">
                            <span className="badge-navy !text-[11px]">{v.category}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{v.fuelType}</td>
                          <td className="px-6 py-4 text-right font-black text-primary-900 text-base">
                            {formatINR(v.pricePerDay)}
                          </td>
                          <td className="px-6 py-4 text-right text-gold-700 font-semibold">
                            +{formatINR(v.withDriverPrice ?? 800)}/day
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Link to={`/vehicles/${v._id}`} className="btn-primary btn-sm !px-4 !py-1.5 shadow-sm hover:shadow-glow-navy">
                              Book Now
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {!vehicles.length && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                            No vehicles available currently.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination Bar (15 per page) */}
                {vehicles.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                    <p className="text-xs font-semibold text-slate-500">
                      Showing <span className="font-bold text-primary-900">{startIdx}–{endIdx}</span> of{" "}
                      <span className="font-bold text-primary-900">{vehicles.length}</span> vehicles
                    </p>

                    {totalTablePages > 1 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTablePageChange(tablePage - 1)}
                          disabled={tablePage === 1}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-primary-900 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                          aria-label="Previous Page"
                        >
                          <FiChevronLeft size={16} />
                        </button>

                        {Array.from({ length: totalTablePages }, (_, idx) => idx + 1).map((pg) => (
                          <button
                            key={pg}
                            onClick={() => handleTablePageChange(pg)}
                            className={`h-8 min-w-[32px] px-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                              tablePage === pg
                                ? "bg-primary-900 text-white shadow-md shadow-primary-950/20"
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-primary-900"
                            }`}
                          >
                            {pg}
                          </button>
                        ))}

                        <button
                          onClick={() => handleTablePageChange(tablePage + 1)}
                          disabled={tablePage === totalTablePages}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-primary-900 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                          aria-label="Next Page"
                        >
                          <FiChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Pricing FAQs Accordion */}
      <section className="section bg-white">
        <div className="container-x max-w-3xl">
          <SectionHeader center eyebrow="Good to know" title="Pricing & Payment FAQs" />

          <div className="mt-6 space-y-3">
            {faqs.map(([q, a], i) => {
              const isOpen = open === i;
              return (
                <div key={q} className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card transition-all">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className="font-bold text-primary-900 text-sm sm:text-base">{q}</span>
                    <FiChevronDown
                      className={`shrink-0 text-primary-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-gold-600" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-slate-100"
                      >
                        <p className="px-6 py-4 text-xs sm:text-sm leading-relaxed text-slate-600">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
