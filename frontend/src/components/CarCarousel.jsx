import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CarCard from "./CarCard.jsx";

// Horizontal, snap-scrolling carousel of car cards with arrow controls.
export default function CarCarousel({ vehicles = [] }) {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 390);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (!vehicles.length) return null;

  return (
    <div className="relative">
      {/* Controls Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Showing {vehicles.length} Top Available Cars</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-1)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-primary-800 shadow-sm transition-all hover:border-gold-500 hover:bg-gold-500 hover:text-primary-950 hover:shadow-md active:scale-95"
            aria-label="Previous"
          >
            <FiChevronLeft size={22} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-primary-800 shadow-sm transition-all hover:border-gold-500 hover:bg-gold-500 hover:text-primary-950 hover:shadow-md active:scale-95"
            aria-label="Next"
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 pt-1"
        style={{ scrollbarWidth: "none" }}
      >
        {vehicles.map((v, i) => (
          <div key={v._id} className="w-[290px] shrink-0 snap-start sm:w-[340px]">
            <CarCard vehicle={v} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
