import { motion } from "framer-motion";

// Reusable section heading with an eyebrow label.
export default function SectionHeader({ eyebrow, title, subtitle, center = false, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <span
          className={`mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] ${
            light ? "text-gold-400" : "text-gold-600"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl font-bold leading-tight sm:text-4xl ${
          light ? "!text-white" : "text-primary-700"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/75" : "text-slate-500"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
