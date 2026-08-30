import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiArrowRight,
  FiPhoneCall,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiShield,
  FiCheckCircle,
  FiHelpCircle,
  FiChevronDown,
  FiAward,
  FiBriefcase,
  FiTrendingUp,
} from "react-icons/fi";
import { FaCarSide, FaBolt, FaKey, FaRoute, FaPlaneArrival, FaCity } from "react-icons/fa";
import PageBanner from "../components/PageBanner.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { SERVICES } from "../utils/constants.js";

// Extra bullet points per service (keyed by title)
const perks = {
  "Cars on Rent for Outstation": [
    "Per-day flexible packages with unlimited KMs",
    "Experienced highway chauffeurs or self-drive",
    "Zero breakdown anxiety with 24/7 highway RSA",
  ],
  "Rental Cars for Corporate": [
    "GST-compliant automated monthly billing",
    "Dedicated corporate fleet account manager",
    "Punctual executive & VIP client transport",
  ],
  "Rental Car for Wedding Ceremony": [
    "Decorated luxury cars (Fortuner, Innova Crysta)",
    "Guaranteed on-time arrival & spotless detailing",
    "Multi-car convoys for bride, groom & guests",
  ],
  "City Transfer": [
    "Fixed, upfront fares without peak surge rates",
    "Doorstep pickup & drop across Noida & NCR",
    "Sanitized, climate-controlled cabins",
  ],
  "Airport Transfer": [
    "Live IGI Terminal flight tracking for zero waiting",
    "Meet & greet pickup with luggage assistance",
    "24×7 prompt vehicle availability",
  ],
  "Whole City Tour": [
    "Full-day custom sightseeing itineraries",
    "Knowledgeable local highway drivers",
    "Cover historic monuments, temples & markets",
  ],
};

const popularRoutes = [
  {
    from: "Delhi NCR",
    to: "Agra (Taj Mahal)",
    distance: "210 KM",
    time: "3.5 Hours",
    via: "Yamuna Expressway",
    idealCar: "Sedan or Compact SUV (Verna / Creta)",
  },
  {
    from: "Delhi NCR",
    to: "Jaipur (Pink City)",
    distance: "280 KM",
    time: "4.5 Hours",
    via: "Delhi-Mumbai Expressway",
    idealCar: "Hybrid SUV (Hyryder / Vitara)",
  },
  {
    from: "Delhi NCR",
    to: "Rishikesh / Haridwar",
    distance: "240 KM",
    time: "4.5 Hours",
    via: "Meerut Expressway",
    idealCar: "7-Seater MUV (Innova / Ertiga)",
  },
  {
    from: "Delhi NCR",
    to: "Shimla / Manali",
    distance: "340+ KM",
    time: "7.5 Hours",
    via: "Himalayan Expressway",
    idealCar: "4x4 SUV (Fortuner / Scorpio)",
  },
];

const serviceFaqs = [
  {
    q: "Can I choose between Self-Drive and Chauffeur-Driven for all services?",
    a: "Yes! Every single service offered by GoDrive can be booked either as a pure Self-Drive vehicle or with a trained, professional driver (+₹800/day).",
  },
  {
    q: "How does airport pickup work for out-of-town guests?",
    a: "When booking an Airport Transfer, enter your flight number. Our driver monitors real-time flight status and will be waiting at the arrivals terminal with a sanitized car and name board.",
  },
  {
    q: "Do you offer corporate GST invoices for business travel?",
    a: "Yes, 100%. During booking or from your profile, you can provide your company name and GST number to receive automated GST tax invoices for business expense reimbursement.",
  },
  {
    q: "What is the cancellation policy for wedding and event convoys?",
    a: "We offer free date rescheduling up to 24 hours before your event. For special event convoys, a small advance token locks the entire fleet.",
  },
];

export default function Services() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <PageBanner
        title="Our Services"
        crumb="Services"
        subtitle="Whatever the journey, there is a tailored GoDrive Self Drive package for it — from outstation road trips to weddings, corporate travel and airport runs."
      />

      {/* Main Services Grid */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Tailored Solutions"
            title="Premium Car Rental Services"
            subtitle="Explore our comprehensive range of self-drive and with-driver rental services with guaranteed quality and transparent per-day pricing."
          />

          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const { icon: Icon, title, desc } = s;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-2.5 hover:border-gold-400 hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.22)]"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700 transition-all duration-300 group-hover:bg-gradient-to-tr group-hover:from-gold-400 group-hover:to-amber-500 group-hover:text-primary-950 group-hover:scale-110 shadow-sm">
                    <Icon size={26} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-primary-900 group-hover:text-primary-800 transition-colors">
                    {title}
                  </h3>
                  <p className="mb-6 text-xs sm:text-sm leading-relaxed text-slate-500">{desc}</p>

                  <ul className="mt-auto space-y-2.5 border-t border-slate-100 pt-4">
                    {perks[title]?.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                        <FiCheck className="shrink-0 text-emerald-500 font-bold" /> {p}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/vehicles"
                    className="mt-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gold-600 transition-all group-hover:text-gold-700 group-hover:gap-2.5"
                  >
                    <span>Book This Service</span>
                    <FiArrowRight />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Highway & Outstation Routes */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Weekend Getaways"
            title="Popular Outstation Road Trips"
            subtitle="Hit the open expressway with GoDrive's sanitized SUVs and 7-seater vehicles."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularRoutes.map((r, i) => (
              <motion.div
                key={r.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-3xl border border-slate-200/90 bg-slate-50/50 p-6 shadow-card transition-all duration-300 hover:bg-white hover:border-gold-400 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="badge-navy !text-[11px] flex items-center gap-1">
                    <FaRoute /> {r.via}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">{r.time}</span>
                </div>

                <h3 className="font-display text-xl font-bold text-primary-900 group-hover:text-primary-800">
                  {r.from} &rarr; {r.to}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Distance: ~{r.distance}</p>

                <div className="mt-4 rounded-2xl bg-white p-3 border border-slate-100 text-xs text-slate-600">
                  <span className="block font-bold text-primary-900 text-[11px] uppercase tracking-wider text-slate-400">
                    Recommended Ride:
                  </span>
                  <p className="font-bold text-primary-900 mt-0.5">{r.idealCar}</p>
                </div>

                <Link
                  to="/vehicles"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold-600 hover:text-gold-700"
                >
                  Book Cars for this Route &rarr;
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeader
            center
            eyebrow="Fast & Hassle-Free"
            title="From Booking to Boarding in 4 Steps"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Pick Service & Car", "Choose the package and vehicle that fit your trip requirements."],
              ["Set Dates & Mode", "Select pickup/return dates and Self Drive or With Driver mode."],
              ["Pay ₹500 Token", "Confirm instantly with a small ₹500 registration payment."],
              ["Doorstep Handover", "Our team verifies details and delivers your sanitized car."],
            ].map(([title, desc], i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-3xl border border-slate-200/90 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-gold-400 hover:shadow-xl text-center"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-t-3xl" />
                <span className="font-display text-3xl font-black text-gold-500 group-hover:scale-110 inline-block transition-transform duration-300">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-bold text-primary-900 text-lg group-hover:text-primary-800 transition-colors">
                  {title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate & Fleet Partnership Banner */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="grid items-center gap-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 p-8 sm:p-12 text-white shadow-2xl lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4">
              <span className="badge-gold !text-[11px] font-black uppercase tracking-wider">
                Corporate Mobility
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
                Reliable Fleet Solutions for Companies &amp; Event Planners
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Streamline employee mobility, VIP transfers, and wedding convoys with dedicated vehicle allocations, monthly billing with GST input credit, and 24×7 fleet support.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-gold-400">
                <span className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-emerald-400" /> GST Invoicing
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-emerald-400" /> Dedicated Manager
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-emerald-400" /> Zero Hold Deposits
                </span>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link to="/contact" className="btn-gold w-full !py-3.5 text-center font-bold shadow-lg">
                Request Corporate Quote
              </Link>
              <Link
                to="/pricing"
                className="btn-outline w-full !py-3.5 text-center !border-white/30 !text-white hover:!bg-white/10"
              >
                View Rate Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service FAQs */}
      <section className="section bg-slate-50">
        <div className="container-x max-w-3xl">
          <SectionHeader center eyebrow="FAQ" title="Service & Rental Questions" />
          <div className="mt-8 divide-y divide-slate-100 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card">
            {serviceFaqs.map((faq, i) => (
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

      {/* CTA Band */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-50 via-primary-50/50 to-slate-50 p-8 sm:p-12 text-center shadow-card border border-slate-200">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary-900">
              Ready to Book Your Next Journey?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-500 text-sm sm:text-base leading-relaxed">
              Reserve with just ₹500 advance confirmation token. 100% sanitized vehicles delivered to your doorstep.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/vehicles" className="btn-gold !py-3.5 !px-8 font-bold shadow-lg">
                Browse Vehicles &rarr;
              </Link>
              <Link to="/contact" className="btn-outline !py-3.5 !px-8 font-bold">
                <FiPhoneCall /> Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
