import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

// Reusable navy hero banner for interior pages.
export default function PageBanner({ title, subtitle, crumb }) {
  return (
    <section className="relative overflow-hidden bg-primary-700 text-white">
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="container-x relative py-8 sm:py-10 lg:py-12">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-1.5 text-sm text-white/60"
        >
          <Link to="/" className="transition hover:text-gold-400">
            Home
          </Link>
          <FiChevronRight size={14} />
          <span className="text-gold-400">{crumb || title}</span>
        </motion.nav>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl font-extrabold !text-white sm:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-4 max-w-2xl text-lg text-white/75"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
