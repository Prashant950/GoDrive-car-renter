import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCarSide, FaBolt, FaPhoneAlt } from "react-icons/fa";
import {
  FiMenu,
  FiX,
  FiUser,
  FiGrid,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiCalendar,
  FiMapPin,
  FiHome,
  FiTruck,
  FiLayers,
  FiDollarSign,
  FiInfo,
  FiMail,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { NAV_LINKS } from "../utils/constants.js";

const iconMap = {
  "/": FiHome,
  "/vehicles": FiTruck,
  "/services": FiLayers,
  "/pricing": FiDollarSign,
  "/about": FiInfo,
  "/contact": FiMail,
};

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, openAuth, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const dashboardPath = isAdmin ? "/admin" : "/dashboard";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary-950/95 shadow-2xl shadow-primary-950/50 backdrop-blur-xl border-b border-white/10"
          : "bg-primary-950/90 backdrop-blur-md border-b border-white/5"
      }`}
    >
      {/* Top Clean Info Bar */}
     
      {/* Main Navbar */}
      <nav className="container-x flex h-16 items-center justify-between sm:h-20">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-amber-500 text-primary-950 shadow-md shadow-gold-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-glow">
            <FaCarSide size={24} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-2xl font-black tracking-tight text-white">
                Go<span className="text-gold-400">Drive</span>
              </span>
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-gold-400/90 -mt-1 flex items-center gap-1">
              Self Drive <span className="inline-block h-1 w-1 rounded-full bg-emerald-400 animate-ping"></span>
            </span>
          </div>
        </Link>

        {/* Desktop Links with Glass Pill Styling */}
        <ul className="hidden items-center gap-2 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-2xl text-xs xl:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 border border-gold-400/30 shadow-sm shadow-gold-500/10"
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Attractive Book a Car Button with Rich Padding */}
          <Link
            to="/vehicles"
            className="hidden sm:inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 !py-3 !px-7 text-xs sm:text-sm font-extrabold text-primary-950 shadow-lg shadow-gold-500/30 transition-all duration-300 hover:scale-105 hover:shadow-gold-500/40 hover:brightness-110 active:scale-95 group"
          >
            <FiCalendar className="text-base transition-transform group-hover:rotate-12" />
            <span>Book a Car</span>
          </Link>

          {isAuthenticated ? (
            <div className="relative hidden lg:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 py-2 pl-2 pr-4 text-white transition-all hover:bg-white/15 hover:border-gold-400/50"
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-gold-500 to-amber-400 text-sm font-black text-primary-950 shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
                <span className="max-w-[120px] truncate text-xs font-bold text-white/90">
                  {user?.name?.split(" ")[0]}
                </span>
                <FiChevronDown className={`text-slate-300 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 overflow-hidden rounded-3xl bg-white p-2 shadow-2xl ring-1 ring-black/5 z-50"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="truncate text-sm font-extrabold text-primary-900">{user?.name}</p>
                      <p className="truncate text-xs text-slate-400">{user?.email}</p>
                      <span className="mt-1.5 inline-block rounded-md bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold text-gold-700 uppercase">
                        {isAdmin ? "Admin Account" : "Verified Customer"}
                      </span>
                    </div>
                    <div className="py-1.5">
                      <MenuItem to={dashboardPath} icon={FiGrid} onClick={() => setMenuOpen(false)}>
                        {isAdmin ? "Admin Panel" : "My Bookings"}
                      </MenuItem>
                      {!isAdmin && (
                        <MenuItem to="/dashboard/profile" icon={FiUser} onClick={() => setMenuOpen(false)}>
                          Profile & KYC
                        </MenuItem>
                      )}
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                          navigate("/");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => openAuth("login")}
              className="group relative hidden lg:inline-flex items-center justify-center rounded-2xl p-[1.5px] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-primary-950/40"
            >
              {/* Glowing Gradient Border Aura */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 opacity-60 group-hover:opacity-100 blur-[1px] transition-opacity duration-300" />

              {/* Inner Surface with Glass & Gold Accents */}
              <div className="relative flex items-center gap-2.5 rounded-2xl bg-primary-950/90 px-5 py-2.5 backdrop-blur-xl border border-white/10 group-hover:border-gold-400/50 transition-colors">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-tr from-gold-400 to-amber-500 text-primary-950 shadow-xs transition-transform duration-300 group-hover:rotate-12">
                  <FiUser size={13} className="stroke-[2.5]" />
                </span>
                <span className="text-xs font-black tracking-wide text-white group-hover:text-gold-300 transition-colors">
                  Login
                </span>
              </div>
            </button>
          )}

          {/* Mobile menu toggle hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20 active:scale-95 lg:hidden shadow-sm"
            aria-label="Open Menu"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </nav>

      {/* ---------------- MOBILE SIDE DRAWER (PORTALED TO BODY FOR SMOOTH FULL-HEIGHT RIGHT SLIDE) ---------------- */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <div className="fixed inset-0 z-[9999] lg:hidden">
                {/* Backdrop Blur Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setMobileOpen(false)}
                  className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                />

                {/* Slide-out Drawer Panel */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed inset-y-0 right-0 flex h-full w-[85%] max-w-[340px] flex-col bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 p-6 text-white shadow-2xl border-l border-white/10 overflow-y-auto"
                >
                  {/* Drawer Top Header with Logo & Close button */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-amber-500 text-primary-950 shadow-md">
                        <FaCarSide size={20} />
                      </div>
                      <div>
                        <span className="font-display text-xl font-black text-white">
                          Go<span className="text-gold-400">Drive</span>
                        </span>
                        <span className="block text-[8px] font-extrabold uppercase tracking-widest text-gold-400 -mt-1">
                          Self Drive
                        </span>
                      </div>
                    </Link>

                    <button
                      onClick={() => setMobileOpen(false)}
                      className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
                      aria-label="Close Menu"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  {/* Prominent "Book a Car Now" Button in Drawer */}
                  <div className="my-4">
                    <Link
                      to="/vehicles"
                      onClick={() => setMobileOpen(false)}
                      className="btn-gold flex w-full items-center justify-center gap-2.5 !py-3.5 !px-5 text-sm font-extrabold shadow-xl shadow-gold-500/25 rounded-2xl"
                    >
                      <FiCalendar size={18} />
                      <span>Book a Car Now</span>
                      <FiChevronRight className="ml-auto" />
                    </Link>
                  </div>

                  {/* Navigation Links with Icons */}
                  <div className="space-y-1.5 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-gold-400 px-3 pb-1">
                      Menu Navigation
                    </p>
                    {NAV_LINKS.map((l) => {
                      const Icon = iconMap[l.to] || FiLayers;
                      const isActive = location.pathname === l.to;
                      return (
                        <NavLink
                          key={l.to}
                          to={l.to}
                          end={l.to === "/"}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 border border-gold-400/30 shadow-sm"
                              : "text-slate-200 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={isActive ? "text-gold-400" : "text-slate-400"} size={18} />
                            <span>{l.label}</span>
                          </div>
                          <FiChevronRight className={`text-xs ${isActive ? "text-gold-400" : "text-white/30"}`} />
                        </NavLink>
                      );
                    })}
                  </div>

                  {/* User Account / Auth Section */}
                  <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
                    {isAuthenticated ? (
                      <>
                        <div className="rounded-2xl bg-white/5 p-3 border border-white/10 flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-gold-500 to-amber-400 text-primary-950 font-black text-sm">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-white">{user?.name}</p>
                            <p className="truncate text-[11px] text-slate-400">{user?.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to={dashboardPath}
                            onClick={() => setMobileOpen(false)}
                            className="btn-outline !py-2.5 !text-xs !border-white/20 !text-white flex items-center justify-center gap-1.5"
                          >
                            <FiGrid /> {isAdmin ? "Admin" : "Dashboard"}
                          </Link>

                          <button
                            onClick={() => {
                              setMobileOpen(false);
                              logout();
                              navigate("/");
                            }}
                            className="btn !py-2.5 !text-xs bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 flex items-center justify-center gap-1.5"
                          >
                            <FiLogOut /> Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          openAuth("login");
                        }}
                        className="group relative w-full overflow-hidden rounded-2xl p-[1.5px] shadow-lg transition-all duration-300 active:scale-95"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 opacity-80 group-hover:opacity-100" />
                        <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-primary-950/95 py-3 px-4 backdrop-blur-md">
                          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-gold-400 to-amber-500 text-primary-950 shadow-xs">
                            <FiUser size={16} className="stroke-[2.5]" />
                          </span>
                          <div className="text-left">
                            <p className="text-xs sm:text-sm font-black text-white">Login</p>
                            <p className="text-[10px] text-gold-400 font-semibold">Access bookings, profile &amp; KYC</p>
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Instant Helpline in Drawer */}
                   

                    <p className="text-center text-[10px] text-white/40 pt-1">
                      © {new Date().getFullYear()} GoDrive Self Drive Car Rental
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
}

function MenuItem({ to, icon: Icon, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-primary-50 hover:text-primary-800"
    >
      <Icon className="text-primary-600" /> {children}
    </Link>
  );
}
