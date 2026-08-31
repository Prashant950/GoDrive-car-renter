import { Link } from "react-router-dom";
import { FaCarSide, FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaWhatsapp, FaStar } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiClock, FiCheckCircle, FiArrowRight, FiSend, FiShield, FiTag, FiCalendar } from "react-icons/fi";
import { NAV_LINKS } from "../utils/constants.js";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Footer() {
  const year = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success("Thank you for subscribing! Special GoDrive discount code sent. 🎉");
    setNewsletterEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 text-white/80 border-t border-white/10">
      {/* Ambient Top Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-[600px] rounded-full bg-gold-500/10 blur-[100px]" />

      {/* ---------------- MAIN FOOTER 4-COLUMN BALANCED GRID ---------------- */}
      <div className="container-x py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Col 1: Brand & Trust Bio (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-amber-500 text-primary-950 shadow-md shadow-gold-500/25 transition-transform duration-300 group-hover:scale-105">
                <FaCarSide size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black tracking-tight text-white">
                  Go<span className="text-gold-400">Drive</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gold-400 -mt-1">
                  Self Drive
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-sm">
              Your premier self-drive & with-driver partner across Noida, Delhi NCR, and beyond. Experience pure driving freedom with transparent per-day rates, verified vehicles, and easy ₹500 token booking.
            </p>

            {/* Verified Rating Badge */}
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs">
              <div className="flex text-amber-400 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="font-bold text-white">4.9 / 5</span>
              <span className="text-slate-400">· 50,000+ Happy Riders</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-500" },
                { icon: FaFacebookF, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
                { icon: FaXTwitter, href: "#", label: "Twitter", color: "hover:bg-slate-800" },
                { icon: FaLinkedinIn, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
                { icon: FaWhatsapp, href: "https://wa.me/919999999999", label: "WhatsApp", color: "hover:bg-emerald-600" },
              ].map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition-all duration-200 hover:scale-110 ${color}`}
                  aria-label={label}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Vehicle Categories (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-gold-400">
              Our Vehicles
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                "Luxury 4x4 SUVs",
                "7-Seater Family MUVs",
                "Executive Sedans",
                "Automatic Hatchbacks",
                "Wedding Specials",
                "Outstation Packages",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/vehicles"
                    className="flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400 opacity-40 transition-all group-hover:opacity-100 group-hover:scale-125" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Explore Links (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-gold-400">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400 opacity-40 transition-all group-hover:opacity-100 group-hover:scale-125" />
                    <span>{l.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/pricing"
                  className="flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 opacity-40 transition-all group-hover:opacity-100 group-hover:scale-125" />
                  <span>₹500 Token Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Noida Hub & Newsletter (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-gold-400">
              Noida Hub & Contact
            </h4>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <FiMapPin className="mt-0.5 shrink-0 text-gold-400 text-sm" />
                <span className="text-slate-200 leading-snug">
                  JAYPEE KENSINGTON PARK, Plot 1, Sector 133, Noida, UP 201304
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="shrink-0 text-gold-400 text-sm" />
                <a href="tel:+917275647029" className="text-slate-200 font-bold hover:text-gold-400 transition-colors">
                  +91 7275647029 (24×7)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <FiClock className="shrink-0 text-emerald-400 text-sm" />
                <span className="text-emerald-400 font-medium">Open 24 Hours · All 7 Days · Doorstep</span>
              </div>
            </div>

            {/* VIP Discount Newsletter */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <FiTag className="text-gold-400" /> Get Flat 15% OFF Coupon Code
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address…"
                  required
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
                <button
                  type="submit"
                  className="btn-gold !py-2.5 !px-5 shrink-0 !text-xs font-bold rounded-2xl shadow-md"
                >
                  Join <FiSend />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- BOTTOM LEGAL & SECURITY STRIP ---------------- */}
      <div className="border-t border-white/10 bg-primary-950 py-5">
        <div className="container-x flex flex-col items-center justify-between gap-4 text-xs text-white/60 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <FiShield /> 100% Insured Vehicles
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-gold-400 font-medium">
              <FiCheckCircle /> ₹500 Advance Token
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="text-slate-300">Noida · Delhi NCR · Doorstep Handover</span>
          </div>

          <p className="text-center sm:text-right text-slate-400">
            © {year} <strong className="text-white font-semibold">GoDrive Self Drive</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
