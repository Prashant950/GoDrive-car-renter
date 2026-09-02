import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiShield,
  FiClock,
  FiTag,
  FiCheckCircle,
  FiSearch,
  FiCreditCard,
  FiPhoneCall,
  FiStar,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiAward,
  FiCheck,
  FiChevronDown,
  FiCompass,
  FiTrendingUp,
} from "react-icons/fi";
import { FaCarSide, FaBolt, FaGasPump, FaKey, FaRoute, FaPercent,FaWhatsapp  } from "react-icons/fa";
import { BsSpeedometer2, BsSuitcase } from "react-icons/bs";
import SectionHeader from "../components/SectionHeader.jsx";
import CarCarousel from "../components/CarCarousel.jsx";
import CarCard from "../components/CarCard.jsx";
import Loader from "../components/Loader.jsx";
import { useGetVehiclesQuery } from "../services/user/userVehicleApi.js";
import { useGetCategoriesQuery } from "../services/categoryApi.js";
import { SERVICES, REGISTRATION_FEE } from "../utils/constants.js";
import { formatINR } from "../utils/format.js";
import heroCar from "../assets/hero-fortuner.png";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const POPULAR_ROUTES = [
  {
    from: "Noida / Delhi NCR",
    to: "Lucknow (Via Expressway)",
    distance: "520 km",
    duration: "6.5 hrs",
    recommended: "Luxury SUV / Sedan",
    desc: "Cruising the world-class Yamuna & Agra-Lucknow Expressway with utmost comfort and high-speed stability.",
  },
  {
    from: "Delhi NCR / Noida",
    to: "Kanpur (Via NH 19)",
    distance: "440 km",
    duration: "6 hrs",
    recommended: "7-Seater MUV / SUV",
    desc: "Smooth multi-lane corridor for executive travel, family hometown visits, and seamless expressway driving.",
  },
  {
    from: "Noida / Delhi NCR",
    to: "Jaipur & Rishikesh",
    distance: "260 km",
    duration: "4.5 hrs",
    recommended: "Compact SUV / Sedan",
    desc: "Weekend heritage royal getaways or serene Himalayan foothill road trips with doorstep car delivery.",
  },
  {
    from: "Pune",
    to: "Mumbai & Goa",
    distance: "150 - 450 km",
    duration: "3 - 8.5 hrs",
    recommended: "7-Seater / 4x4 SUV",
    desc: "Scenic Western Ghats drives, expressway cruising, and iconic coastal beach highway road trips.",
  },
];

const WHY_US = [
  {
    icon: FaKey,
    title: "₹500 Token Booking",
    desc: "Lock your favourite car with just a small ₹500 advance token. Pay the rest comfortably at handover.",
  },
  {
    icon: FiMapPin,
    title: "100% Doorstep Delivery",
    desc: "Get your sanitized car delivered right to your home, office, or airport terminal in under 60 mins.",
  },
  {
    icon: BsSpeedometer2,
    title: "Unlimited Kilometers",
    desc: "Enjoy the open highway without counting miles. Drive with total peace of mind and complete freedom.",
  },
  {
    icon: FiClock,
    title: "24×7 Roadside Assistance",
    desc: "Instant breakdown support, nationwide towing, and round-the-clock customer helpline anytime, anywhere.",
  },
  {
    icon: FiShield,
    title: "Sanitized & GPS Tracked",
    desc: "Every vehicle undergoes a 25-point safety inspection, professional detailing, and real-time GPS tracking.",
  },
  {
    icon: FaPercent,
    title: "No Hidden Costs",
    desc: "Zero surge pricing, zero surprise cancellation charges, and 100% transparent GST tax invoicing.",
  },
];

const FAQS = [
  {
    q: "How does the ₹500 advance booking work?",
    a: "Select your desired car, fill in your trip details, and pay just ₹500 as a confirmation token. Our concierge team will reach out within 24 hours to confirm pickup/doorstep delivery and handover. The balance amount is paid at vehicle handover.",
  },
  {
    q: "What documents are required to rent a self-drive car?",
    a: "You will need: (1) Original Valid Indian Driving Licence (held for at least 1 year), (2) Aadhaar Card / Passport for identity and address verification.",
  },
  {
    q: "Is there any security deposit?",
    a: "We offer zero-deposit or minimal refundable deposit options depending on vehicle category. Security deposits are processed back to your source account within 4-7 working days after trip completion.",
  },
  {
    q: "Can I take the car for inter-state / outstation travel?",
    a: "Yes! All GoDrive vehicles have all-India commercial permits. State border toll and taxes (if applicable) can be paid at the border or Fastag.",
  },
  {
    q: "What if the car breaks down during my trip?",
    a: "We provide 24x7 Roadside Assistance (RSA) across all major national & state highways. Call our dedicated emergency number and our support vehicle or replacement car will assist immediately.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { data: vehicles = [], isLoading: loading } = useGetVehiclesQuery(undefined, {
    pollingInterval: 4000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const { data: dbCategories = [] } = useGetCategoriesQuery(undefined, {
    pollingInterval: 5000,
    refetchOnFocus: true,
  });
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const list = dbCategories.map((c) => c.name);
    return ["All", ...Array.from(new Set(list))];
  }, [dbCategories]);

  // Booking search widget state
  const [searchCity, setSearchCity] = useState("Pune");
  const [pickupDate, setPickupDate] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [driveType, setDriveType] = useState("Self Drive");

  // Fare calculator state
  const [calcVehicleId, setCalcVehicleId] = useState("");
  const [calcDays, setCalcDays] = useState(3);
  const [calcWithDriver, setCalcWithDriver] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (vehicles && vehicles.length > 0 && !calcVehicleId) {
      setCalcVehicleId(vehicles[0]._id);
    }
  }, [vehicles, calcVehicleId]);

  // Filtered vehicles for category tabs
  const filteredVehicles = useMemo(() => {
    if (activeCategory === "All") return vehicles;
    return vehicles.filter((v) => v.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [vehicles, activeCategory]);

  // Selected vehicle for Fare Calculator
  const selectedCalcVehicle = useMemo(() => {
    return vehicles.find((v) => v._id === calcVehicleId) || vehicles[0];
  }, [vehicles, calcVehicleId]);

  // Calculated estimates
  const calcTotal = useMemo(() => {
    if (!selectedCalcVehicle) return 0;
    const base = (selectedCalcVehicle.pricePerDay || 2500) * calcDays;
    const driverFee = calcWithDriver ? (selectedCalcVehicle.withDriverPrice || 900) * calcDays : 0;
    return base + driverFee;
  }, [selectedCalcVehicle, calcDays, calcWithDriver]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/vehicles?search=${encodeURIComponent(searchCity)}`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-primary-950 text-white min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-between">
        {/* Ambient Gradient Backgrounds */}
        <div className="pointer-events-none absolute inset-0 bg-hero-radial opacity-90" />
        <div className="pointer-events-none absolute -right-32 top-1/4 h-[550px] w-[550px] rounded-full bg-gold-500/15 blur-[120px] animate-pulse-glow" />
        <div className="pointer-events-none absolute -left-32 bottom-10 h-[450px] w-[450px] rounded-full bg-primary-500/20 blur-[100px]" />

        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container-x relative w-full flex-1 flex flex-col justify-between pt-10 pb-10 sm:pt-14 sm:pb-14 lg:pt-16 lg:pb-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 flex-1 my-auto">
            {/* Left Copy */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Badge */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-400 shadow-sm backdrop-blur-md">
                  <FaBolt className="text-gold-400 animate-bounce text-xs" /> GoDrive Self Drive · Unlimited Freedom
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-emerald-400">
                  <FiCheckCircle /> Free Doorstep Delivery
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={fadeUp}
                className="font-display text-4xl font-extrabold leading-[1.1] !text-white sm:text-5xl lg:text-6xl"
              >
                Drive Your Dream Car with{" "}
                <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 bg-clip-text text-transparent">
                  GoDrive Self Drive
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p variants={fadeUp} className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-300">
                Premium SUVs, 7-Seater MUVs & luxury sedans for outstation road trips, weddings, or city commute. Book in 60 seconds with just <strong className="text-gold-400 font-bold">₹500 advance token</strong>!
              </motion.p>

              {/* Hero Action Buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  to="/vehicles"
                  className="btn-gold !py-3.5 !px-8 text-sm sm:text-base font-extrabold shadow-xl shadow-gold-500/25 flex items-center gap-2 group"
                >
                  <FaKey className="transition-transform group-hover:rotate-12" />
                  <span>Explore Vehicles & Book</span>
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Hero Car Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative lg:col-span-5 flex flex-col items-center justify-center"
            >
              {/* Radial Car Glow */}
              <div className="absolute h-80 w-80 rounded-full bg-gradient-to-tr from-gold-500/20 to-primary-600/30 blur-3xl sm:h-96 sm:w-96" />

              {/* Car Image */}
              <img
                src={heroCar}
                alt="GoDrive Self Drive Premium Car"
                className="relative z-10 w-full max-w-lg animate-float drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              />

              {/* Floating Reassurance Badges */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-2 left-2 z-20 hidden sm:flex items-center gap-3 rounded-2xl bg-primary-900/90 border border-white/15 p-3.5 shadow-2xl backdrop-blur-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500 text-primary-950 font-bold">
                  <FaKey size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Instant Confirmation</p>
                  <p className="text-[11px] text-gold-400">Reserve with only ₹500</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ---------------- 4 KEY PILLARS / TRUST CARDS (HERO SECTION) ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-auto pt-8 sm:pt-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4"
          >
            {[
              [FiShield, "100% Insured Vehicles", "Comprehensive cover on all trips"],
              [FiClock, "24×7 Road Assistance", "Help anywhere, anytime in NCR"],
              [FiTag, "Transparent ₹500 Token", "No hidden charges, pay balance later"],
              [FiCheckCircle, "Free Doorstep Delivery", "Sanitized & ready at your door"],
            ].map(([Icon, title, desc]) => (
              <div
                key={title}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-gold-400/40 hover:-translate-y-1 shadow-sm"
              >
                <div className="grid h-9 w-9 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-amber-500 text-primary-950 font-bold shadow-md shadow-gold-500/20">
                  <Icon className="text-base sm:text-xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug">{title}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300/80 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- 2. FEATURED VEHICLES & CATEGORY PILLS ---------------- */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeader
              eyebrow="GoDrive Premium Vehicles"
              title="Find the Perfect Car for Your Trip"
              subtitle="Choose from our meticulously maintained collection of SUVs, 7-seaters, sedans and premium luxury vehicles."
            />
            <Link to="/vehicles" className="btn-outline btn-sm self-start md:self-auto shrink-0 font-bold">
              View All Vehicles ({vehicles.length}) <FiArrowRight />
            </Link>
          </div>

          {/* Category Tabs */}
          <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${activeCategory === cat
                    ? "bg-primary-700 text-white shadow-md shadow-primary-700/20 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-primary-700 border border-slate-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Carousel / Grid */}
          {loading ? (
            <Loader label="Loading GoDrive Vehicles…" />
          ) : filteredVehicles.length > 0 ? (
            <CarCarousel vehicles={filteredVehicles} />
          ) : (
            <div className="rounded-2xl bg-white p-12 text-center shadow-card border border-slate-200">
              <p className="text-slate-500">No cars found in this category.</p>
              <button onClick={() => setActiveCategory("All")} className="btn-primary btn-sm mt-3">
                View All Cars
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- 3. WHY CHOOSE GODRIVE (FEATURE GRID) ---------------- */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Why Choose GoDrive Self Drive"
            title="Designed for Effortless & Joyful Road Trips"
            subtitle="We removed paperwork friction, surprise charges, and delays so you can focus 100% on the drive."
          />

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item, i) => {
              const { icon: Icon, title, desc } = item;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-2.5 hover:border-gold-400 hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.22)]"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700 transition-all duration-300 group-hover:bg-gradient-to-tr group-hover:from-gold-400 group-hover:to-amber-500 group-hover:text-primary-950 group-hover:scale-110 shadow-sm">
                    <Icon size={26} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-primary-900 group-hover:text-primary-800 transition-colors">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- 4. INTERACTIVE RENTAL FARE ESTIMATOR ---------------- */}
      <section className="section bg-gradient-to-b from-slate-50 via-primary-50/30 to-slate-50">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-4">
              <span className="badge-gold !text-xs font-bold uppercase">
                <FaPercent className="text-gold-600" /> Transparent Fare Calculator
              </span>
              <h2 className="font-display text-3xl font-extrabold text-primary-900 sm:text-4xl">
                Estimate Your Rental Cost Instantly
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Calculate your exact trip cost with zero hidden surprises. Select your favourite car, duration, and driver preferences.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "No surprise security deposit deductions",
                  "Includes standard insurance and 24/7 roadside assistance",
                  "One-time ₹500 token adjusted against your final bill",
                  "Free cancellation up to 12 hours before pickup",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                    <FiCheck className="text-emerald-500 shrink-0 font-bold" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Estimator Tool */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card transition-all duration-300 hover:border-gold-400/60 hover:shadow-2xl">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Select Car */}
                  <div>
                    <label className="label text-primary-900">Select Vehicle</label>
                    <select
                      value={calcVehicleId}
                      onChange={(e) => setCalcVehicleId(e.target.value)}
                      className="input font-semibold text-primary-900 cursor-pointer"
                    >
                      {vehicles.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.name} ({formatINR(v.pricePerDay)}/day)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Trip Duration Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label !mb-0 text-primary-900">Trip Duration</label>
                      <span className="font-display text-sm font-bold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded-lg">
                        {calcDays} {calcDays === 1 ? "Day" : "Days"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={calcDays}
                      onChange={(e) => setCalcDays(Number(e.target.value))}
                      className="w-full accent-gold-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                      <span>1 Day</span>
                      <span>15 Days</span>
                      <span>30 Days</span>
                    </div>
                  </div>

                  {/* Driver Toggle Option */}
                  <div className="sm:col-span-2">
                    <label className="label text-primary-900">Rental Preference</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCalcWithDriver(false)}
                        className={`rounded-2xl py-3 text-xs sm:text-sm font-bold transition-all ${!calcWithDriver
                            ? "bg-primary-800 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                      >
                        Self Drive (Drive Yourself)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcWithDriver(true)}
                        className={`rounded-2xl py-3 text-xs sm:text-sm font-bold transition-all ${calcWithDriver
                            ? "bg-primary-800 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                      >
                        With Driver
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estimate Result Bar */}
                <div className="mt-8 rounded-3xl bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 p-6 text-white shadow-2xl border border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                        Total Trip Rent ({calcDays} Days)
                      </p>
                      <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-200 mt-0.5">
                        {formatINR(calcTotal)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="badge-gold !text-xs font-bold">Payable Now</span>
                      <p className="font-display text-2xl sm:text-3xl font-black text-gold-400 mt-0.5">
                        ₹500 <span className="text-xs font-medium text-slate-300">(Token)</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <FiCheckCircle /> Balance {formatINR(Math.max(0, calcTotal - 500))} paid on doorstep delivery
                    </p>
                    <Link
                      to={`/vehicles/${selectedCalcVehicle?._id || ""}`}
                      className="btn-gold !py-2.5 !px-6 text-xs sm:text-sm font-bold shadow-lg"
                    >
                      Book This Vehicle
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. HOW IT WORKS (ROADMAP) ---------------- */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Smooth & Easy"
            title="Book Your Ride in 4 Simple Steps"
            subtitle="From choosing your favourite car to holding the keys at your doorstep."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-4 relative">
            {[
              { step: "01", title: "Select Car & Dates", desc: "Choose from our wide collection of sanitized SUVs, sedans, or 7-seaters." },
              { step: "02", title: "Pay ₹500 Token", desc: "Lock your booking with a simple ₹500 advance fee. Pay balance on delivery." },
              { step: "03", title: "Quick 2-Min KYC", desc: "Upload your driving licence and ID online for instant digital verification." },
              { step: "04", title: "Doorstep Handover", desc: "Our executive arrives at your location with the sanitized car and keys." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group relative flex flex-col items-center text-center rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-gold-400 hover:shadow-[0_15px_35px_-10px_rgba(245,158,11,0.2)]"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-t-3xl" />
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-700 to-primary-900 font-display text-xl font-black text-gold-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-bold text-primary-900 group-hover:text-primary-800 transition-colors">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 6. POPULAR OUTSTATION ROUTES ---------------- */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Popular Road Trips"
            title="Trending Self Drive Destinations"
            subtitle="Plan your weekend escape or outstation journey with GoDrive Self Drive."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_ROUTES.map((r, i) => (
              <motion.div
                key={r.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-2.5 hover:border-gold-400 hover:shadow-[0_20px_40px_-12px_rgba(245,158,11,0.22)]"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="mb-4 flex items-center justify-between">
                  <span className="badge-navy text-[11px] font-bold">{r.duration}</span>
                  <span className="text-xs font-semibold text-gold-600">{r.distance}</span>
                </div>

                <h3 className="text-lg font-extrabold text-primary-900 group-hover:text-primary-700 transition-colors">
                  {r.from} ⇄ {r.to}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{r.desc}</p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">Best: {r.recommended}</span>
                  <Link to="/vehicles" className="text-xs font-bold text-gold-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Cars <FiArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 7. SERVICES FOR EVERY OCCASION ---------------- */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Tailored Packages"
            title="Car Rentals for Every Occasion"
            subtitle="Whether it is an outstation road trip, wedding ceremony, corporate travel, or airport transfer — we have the ideal vehicles."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const { icon: Icon, title, desc } = s;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-2.5 hover:border-gold-400 hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.22)]"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700 transition-all duration-300 group-hover:bg-gradient-to-tr group-hover:from-gold-400 group-hover:to-amber-500 group-hover:text-primary-950 group-hover:scale-110 shadow-sm">
                    <Icon size={26} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-primary-900 group-hover:text-primary-800 transition-colors">{title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500 mb-5">{desc}</p>
                  <Link
                    to="/vehicles"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-gold-600 transition-all group-hover:gap-2"
                  >
                    Book This Service <FiArrowRight />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- 8. CUSTOMER TESTIMONIALS ---------------- */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Verified Travellers"
            title="Loved by Over 50,000+ Happy Riders"
            subtitle="Read how GoDrive Self Drive made road trips, weddings, and commutes stress-free."
          />

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {[
              {
                name: "Ananya Sharma",
                role: "Wedding in Pune",
                car: "Toyota Fortuner 4x4",
                quote:
                  "Booked a Black Fortuner for our wedding ceremony. The car was spotless, delivered right on time, and reserving with ₹500 was completely stress-free. 10/10 recommend GoDrive!",
              },
              {
                name: "Rohit Malhotra",
                role: "Corporate Outstation Trip",
                car: "Innova Crysta Diesel",
                quote:
                  "We regularly use GoDrive Self Drive for client pickups and executive travel. Reliable Innova Crystas every single time. Billing is completely transparent and professional.",
              },
              {
                name: "Fatima Khan",
                role: "Goa Weekend Getaway",
                car: "Hyundai Creta Automatic",
                quote:
                  "Rented an automatic Creta for our 4-day Goa road trip. Smooth engine, superb mileage, and zero paperwork hassle. Handover took literally 3 minutes!",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-gold-400/80 hover:shadow-card-hover"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-1 text-gold-500">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <FiStar key={j} className="fill-gold-500 text-gold-500 text-sm" />
                      ))}
                    </div>
                    <span className="badge-navy text-[10px] font-bold">{t.car}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 italic">“{t.quote}”</p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-primary-700 to-primary-900 font-bold text-white shadow-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 9. VIP CLUB / MOBILE APP PROMO ---------------- */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 p-8 text-white sm:p-12 shadow-2xl border border-white/10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
            <div className="grid items-center gap-8 lg:grid-cols-12 relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <span className="badge-gold !text-xs font-bold uppercase">
                  ⭐ GoDrive VIP Membership Perks
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold !text-white">
                  Get Flat 15% OFF on Your First Long Weekend Trip!
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Use coupon code <strong className="text-gold-400 font-mono bg-white/10 px-2 py-1 rounded-md">GODRIVE15</strong> during checkout or call our 24×7 concierge for custom corporate and wedding packages.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <Link to="/vehicles" className="btn-gold !py-3.5 text-center font-bold shadow-lg">
                  Explore Vehicles & Save <FiArrowRight />
                </Link>
                <a
                  href="https://wa.me/7275647029"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline !border-emerald-400 !text-emerald-400 hover:!bg-emerald-500 hover:!text-white flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={18} /> WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 10. FREQUENTLY ASKED QUESTIONS ---------------- */}
      <section className="section bg-slate-50">
        <div className="container-x max-w-3xl">
          <SectionHeader center eyebrow="Clear & Honest" title="Frequently Asked Questions" />

          <div className="mt-10 space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className="font-bold text-primary-900 text-sm sm:text-base">{faq.q}</span>
                    <FiChevronDown
                      className={`shrink-0 text-primary-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-gold-600" : ""
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
                        <p className="px-6 py-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- 11. FINAL HIGH-CONVERTING CTA BANNER ---------------- */}
      <section className="section bg-white pb-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 px-8 py-16 text-center text-white sm:px-16 shadow-2xl border border-white/10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary-500/20 blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="badge-gold !text-xs font-bold uppercase">
                🚀 Instant Booking Guarantee
              </span>
              <h2 className="font-display text-3xl font-extrabold !text-white sm:text-5xl">
                Ready to Hit the Highway?
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Reserve your sanitized self-drive or with-driver car now with just ₹500 token fee. Our concierge team manages everything else smoothly.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link to="/vehicles" className="btn-gold !py-3.5 !px-8 font-bold text-base shadow-xl">
                  Browse All Cars <FiArrowRight />
                </Link>
                <Link to="/contact" className="btn-outline !border-white/40 !text-white hover:!bg-white/10">
                  <FiPhoneCall /> Contact Concierge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
