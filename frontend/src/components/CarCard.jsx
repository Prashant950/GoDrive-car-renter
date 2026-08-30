import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiStar, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { BsFuelPump, BsSpeedometer2 } from "react-icons/bs";
import { TbManualGearbox } from "react-icons/tb";
import { FaBolt } from "react-icons/fa";
import { formatINR } from "../utils/format.js";

export default function CarCard({ vehicle, index = 0 }) {
  const {
    _id,
    name,
    image,
    category,
    fuelType,
    transmission,
    seats,
    pricePerDay,
    rating,
    available,
    featured,
    mileage,
  } = vehicle;

  const isAuto = transmission?.toLowerCase().includes("auto");
  const isCNG = fuelType?.toLowerCase().includes("cng");

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-card transition-all duration-300 hover:-translate-y-2.5 hover:border-gold-400 hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.25)]"
    >
      {/* Top Gold Shimmer Accent Line on Hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-30" />

      {/* Top Banner / Image Area */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-100/90 via-slate-50 to-white pt-3 pb-2 px-4">
        {/* Ambient background glow on hover */}
        <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="badge-navy !text-[11px] font-bold tracking-wide shadow-xs">{category}</span>
            {featured && (
              <span className="badge-gold !text-[11px] font-bold flex items-center gap-1 shadow-xs">
                <FaBolt className="text-gold-600 text-[10px]" /> Popular
              </span>
            )}
            {isCNG && (
              <span className="badge-green !text-[11px] font-bold">CNG Eco</span>
            )}
          </div>

          <span className="badge-gold shrink-0 !text-xs font-bold shadow-xs">
            <FiStar className="fill-gold-500 text-gold-500" /> {rating}
          </span>
        </div>

        {/* Car Image with smooth zoom and float hover */}
        <div className="relative my-2 flex h-48 w-full items-center justify-center">
          {!available && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs rounded-2xl">
              <span className="rounded-full bg-red-600 px-3.5 py-1 text-xs font-bold text-white shadow-md">
                Booked Out
              </span>
            </div>
          )}
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="max-h-44 w-full object-contain p-2 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-md"
          />
        </div>
      </div>

      {/* Body Details */}
      <div className="flex flex-1 flex-col p-5 pt-3">
        {/* Name */}
        <div className="mb-3">
          <h3 className="font-display text-lg font-extrabold leading-snug text-primary-900 transition-colors group-hover:text-primary-700">
            {name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <FiCheckCircle className="text-emerald-500 shrink-0" /> Free Doorstep Delivery Available
          </p>
        </div>

        {/* Specs Grid */}
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
          <Spec icon={BsFuelPump} label={fuelType} />
          <Spec icon={TbManualGearbox} label={transmission} highlight={isAuto} />
          <Spec icon={FiUsers} label={`${seats} Seats`} />
          <Spec icon={BsSpeedometer2} label={mileage || "Unlimited KMs"} />
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3.5">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block truncate">
              {vehicle.priceDuration || "24 Hours / Per Day"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-black text-primary-900">
                {formatINR(pricePerDay)}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
              ₹500 Token to Book
            </span>
          </div>

          <Link
            to={`/vehicles/${_id}`}
            className="btn-primary btn-sm group/btn shadow-md hover:shadow-glow-navy flex items-center gap-1.5 !px-4 !py-2"
          >
            <span>Book Now</span>
            <FiArrowRight className="transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Spec({ icon: Icon, label, highlight }) {
  return (
    <div className="flex items-center gap-2 truncate">
      <Icon className={`shrink-0 text-sm ${highlight ? "text-gold-600" : "text-primary-500"}`} />
      <span className={`truncate font-medium ${highlight ? "text-primary-800 font-bold" : "text-slate-600"}`}>
        {label}
      </span>
    </div>
  );
}
