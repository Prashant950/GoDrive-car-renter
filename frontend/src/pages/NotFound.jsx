import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-primary-700 text-white">
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="container-x relative text-center"
      >
        <p className="font-display text-[7rem] font-extrabold leading-none text-gold-500 sm:text-[10rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold !text-white">Page took a wrong turn</h1>
        <p className="mx-auto mt-3 max-w-md text-white/70">
          The page you're looking for doesn't exist or has moved. Let's get you back on the road.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-gold">
            <FiHome /> Go home
          </Link>
          <Link
            to="/vehicles"
            className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-primary-700"
          >
            <FiArrowLeft /> Browse cars
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
