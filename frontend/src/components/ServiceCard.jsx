import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

export default function ServiceCard({ service, index = 0 }) {
  const { icon: Icon, title, desc } = service;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-700 hover:shadow-card-hover"
    >
      {/* hover wash */}
      <div className="absolute inset-0 -z-0 translate-y-full bg-primary-700 transition-transform duration-300 group-hover:translate-y-0" />
      <div className="relative z-10">
        <div className="mb-5 grid h-14 w-14 place-items-center rounded-xl bg-primary-50 text-primary-700 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-primary-800">
          <Icon size={26} />
        </div>
        <h3 className="mb-2 text-lg font-bold text-primary-700 transition-colors group-hover:!text-white">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-500 transition-colors group-hover:text-white/80">
          {desc}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-600 transition-colors group-hover:text-gold-400">
          Learn more <FiArrowUpRight />
        </span>
      </div>
    </motion.div>
  );
}
