import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiTarget,
  FiEye,
  FiUsers,
  FiTruck,
  FiSmile,
  FiMapPin,
  FiArrowRight,
  FiShield,
  FiAward,
  FiCalendar,
  FiClock,
  FiX,
  FiCheck,
  FiStar,
  FiTrendingUp,
  FiHelpCircle,
  FiChevronDown,
} from "react-icons/fi";
import { FaCarSide, FaBolt, FaKey, FaShieldAlt, FaGasPump, FaRoute } from "react-icons/fa";
import PageBanner from "../components/PageBanner.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import aboutCar from "../assets/about-vitara.png";

const stats = [
  { icon: FiTruck, value: "25+", label: "Verified Vehicles in Fleet" },
  { icon: FiUsers, value: "50,000+", label: "Happy Road Trippers" },
  { icon: FiMapPin, value: "30+", label: "Active NCR & Highway Hubs" },
  { icon: FiSmile, value: "4.9★", label: "Average Customer Rating" },
];

const values = [
  ["Transparent ₹500 Token", "What you see is what you pay — lock your ride with ₹500, no surprise fees."],
  ["100% Sanitized & Detailed", "Every car undergoes a 25-point safety check and complete sanitization."],
  ["Unlimited Driving Freedom", "Explore highways, hill stations, and coastal roads with zero KM anxiety."],
  ["24×7 Roadside Assistance", "Real humans and mechanics on standby around the clock for any road emergency."],
];

const milestones = [
  {
    year: "2021",
    title: "Founded in Noida",
    desc: "Started with a vision for honest self-drive car rentals with a fleet of 5 pristine cars.",
  },
  {
    year: "2022",
    title: "Expansion Across Delhi NCR",
    desc: "Expanded fleet to 20+ hybrid SUVs and 7-seater MUVs with doorstep delivery.",
  },
  {
    year: "2023",
    title: "Instant ₹500 Token Model",
    desc: "Pioneered the ₹500 advance confirmation token with zero security deposit hassle.",
  },
  {
    year: "2024",
    title: "50,000+ Journeys Milestone",
    desc: "Crossed 50k happy trips with a stellar 4.9★ rating and corporate partnerships.",
  },
];

const comparisonData = [
  {
    feature: "Advance Booking Token",
    godrive: "Only ₹500 (100% adjusted)",
    traditional: "Full payment or high deposit",
  },
  {
    feature: "Security Deposit",
    godrive: "Zero Hassle / No heavy hold",
    traditional: "₹5,000 to ₹15,000 blocked",
  },
  {
    feature: "Car Sanitization & Inspection",
    godrive: "25-point pre-delivery check",
    traditional: "Uncertain condition / dusty",
  },
  {
    feature: "Doorstep Delivery & Pickup",
    godrive: "Free home or airport delivery",
    traditional: "You must visit remote yards",
  },
  {
    feature: "24×7 Roadside Assistance",
    godrive: "Immediate replacement car / RSA",
    traditional: "Limited hours or paid towing",
  },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState(0);

  const aboutFaqs = [
    {
      q: "Where are GoDrive vehicles delivered from?",
      a: "We have strategically located fleet hubs across Noida (Sector 62, Sector 18), Greater Noida, Delhi NCR, and IGI Airport. We deliver directly to your residence, hotel, or office.",
    },
    {
      q: "Can I drive GoDrive vehicles to other states?",
      a: "Yes! All GoDrive vehicles have valid All-India Tourist / Commercial Permits with FASTag installed. You can drive freely across state borders with zero restrictions.",
    },
    {
      q: "What is included in the ₹500 booking token?",
      a: "The ₹500 advance token instantly locks and blocks your chosen vehicle for your trip dates so nobody else can book it. The full ₹500 is deducted from your final rental bill at vehicle delivery.",
    },
  ];

  return (
    <>
      <PageBanner
        title="About GoDrive Self Drive"
        crumb="About Us"
        subtitle="We make renting a car feel effortless — well-maintained vehicles, fair per-day rates, doorstep delivery, and a dedicated team that always picks up the phone."
      />

      {/* Intro Split Section */}
      <section className="section bg-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-6 -top-6 h-48 w-48 rounded-3xl bg-gold-500/15 blur-xl" />
            <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-3xl bg-primary-500/10 blur-xl" />
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-8 shadow-2xl border border-white/10">
              <img src={aboutCar} alt="GoDrive Self Drive Vehicles" className="w-full drop-shadow-2xl animate-float" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="badge-gold !text-xs font-bold uppercase tracking-wider">
              Who We Are
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary-900">
              Driven by Comfort, Powered by Trust
            </h2>
            <p className="leading-relaxed text-slate-600 text-sm sm:text-base">
              <strong>GoDrive Self Drive</strong> started with a clear vision: renting a self-drive car should be as effortless and joyful as stepping into your own vehicle. No complex paperwork, no excessive security deposits, and zero waiting around.
            </p>
            <p className="leading-relaxed text-slate-600 text-sm sm:text-base">
              Today, GoDrive manages a hand-picked collection of SUVs, 7-seater MUVs, luxury sedans, and efficient hatchbacks across Noida, Delhi NCR, and beyond. Whether you need a Fortuner for a royal wedding, an Innova Crysta for a family vacation, or a Creta for an expressway run — we deliver straight to your doorstep.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 pt-2">
              {values.map(([t, d]) => (
                <div key={t} className="flex gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 transition-all duration-300 hover:border-gold-400 hover:bg-white hover:shadow-md hover:-translate-y-0.5">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500 font-bold" size={18} />
                  <div>
                    <p className="font-bold text-primary-900 text-sm">{t}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 py-16 text-white border-y border-white/10">
        <div className="container-x grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-gold-400/80 hover:bg-white/10 shadow-lg"
            >
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-gold-400 to-amber-500 text-primary-950 font-bold shadow-md shadow-gold-500/20">
                <Icon size={22} />
              </div>
              <p className="font-display text-3xl sm:text-4xl font-black text-gold-400">{value}</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Company Timeline & Milestones */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Our Journey"
            title="Milestones of Growth & Trust"
            subtitle="How we evolved from a small fleet in Noida to the preferred self-drive partner for over 50,000 riders."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-gold-400 hover:shadow-xl"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-3xl" />
                <span className="inline-block rounded-xl bg-primary-900 px-3 py-1 text-xs font-black text-gold-400 mb-3 shadow-xs">
                  {m.year}
                </span>
                <h3 className="font-bold text-primary-900 text-lg group-hover:text-primary-800">{m.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why GoDrive vs Traditional Rentals Comparison Table */}
      <section className="section bg-white">
        <div className="container-x max-w-4xl">
          <SectionHeader
            center
            eyebrow="The GoDrive Difference"
            title="Why Choose GoDrive Over Traditional Rentals"
            subtitle="Compare our customer-first standards against traditional taxi operators."
          />

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-primary-950 text-white">
                  <tr>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Feature / Policy</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider bg-gold-600 text-primary-950">
                      ✨ GoDrive Self Drive
                    </th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-300">
                      Traditional Rentals
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-primary-900">{row.feature}</td>
                      <td className="px-6 py-4 font-extrabold text-emerald-700 bg-emerald-50/50 flex items-center gap-2">
                        <FiCheck className="text-emerald-600 shrink-0" size={16} /> {row.godrive}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision Cards */}
      <section className="section bg-slate-50">
        <div className="container-x grid gap-8 md:grid-cols-2">
          {[
            [
              FiTarget,
              "Our Mission",
              "To make premium, reliable self-drive and with-driver car rentals accessible to every traveller through transparent pricing, pristine vehicles, and customer care that genuinely goes the extra mile.",
            ],
            [
              FiEye,
              "Our Vision",
              "To become India's most loved and reliable car rental brand — transforming ordinary highway journeys into memorable travel stories through cutting-edge technology and hospitality.",
            ],
          ].map(([Icon, title, desc], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-gold-400 hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.2)]"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-primary-700 to-primary-900 text-gold-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Icon size={26} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-primary-900 group-hover:text-primary-800 transition-colors">{title}</h3>
              <p className="leading-relaxed text-slate-600 text-sm sm:text-base">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About FAQs */}
      <section className="section bg-white">
        <div className="container-x max-w-3xl">
          <SectionHeader center eyebrow="Common Questions" title="Frequently Asked About GoDrive" />
          <div className="mt-8 divide-y divide-slate-100 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card">
            {aboutFaqs.map((faq, i) => (
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
      </section>

      {/* CTA Bottom Band */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-primary-50/50 to-slate-50 p-8 sm:p-12 text-center shadow-card sm:flex-row sm:text-left">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-primary-900">
                Ready to Experience GoDrive Self Drive?
              </h3>
              <p className="mt-1 text-slate-500 text-sm sm:text-base">
                Browse our sanitized vehicles and reserve with ₹500 in under a minute.
              </p>
            </div>
            <Link to="/vehicles" className="btn-gold shrink-0 !py-3.5 !px-8 font-bold shadow-lg">
              Explore Vehicles <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
