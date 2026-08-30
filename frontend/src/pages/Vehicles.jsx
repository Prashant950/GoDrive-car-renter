import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import PageBanner from "../components/PageBanner.jsx";
import CarCard from "../components/CarCard.jsx";
import Loader from "../components/Loader.jsx";
import { useGetVehiclesQuery } from "../services/user/userVehicleApi.js";
import { useGetCategoriesQuery } from "../services/categoryApi.js";
import { FUEL_TYPES, TRANSMISSIONS } from "../utils/constants.js";

const SORTS = [
  { value: "", label: "Newest & Popular first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated (4.8★+)" },
];

const defaults = {
  search: "",
  category: "All",
  fuelType: "All",
  transmission: "All",
  sort: "",
};

const ITEMS_PER_PAGE = 10;

export default function Vehicles() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [filters, setFilters] = useState({
    ...defaults,
    search: initialSearch,
  });
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters.category, filters.fuelType, filters.transmission, filters.sort]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category: filters.category !== "All" ? filters.category : undefined,
      fuelType: filters.fuelType !== "All" ? filters.fuelType : undefined,
      transmission: filters.transmission !== "All" ? filters.transmission : undefined,
      sort: filters.sort || undefined,
    }),
    [debouncedSearch, filters.category, filters.fuelType, filters.transmission, filters.sort]
  );

  const { data: vehicles = [], isLoading: loading, isError: hasError, error, refetch } = useGetVehiclesQuery(
    queryParams,
    {
      pollingInterval: 4000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: dbCategories = [] } = useGetCategoriesQuery(undefined, {
    pollingInterval: 5000,
    refetchOnFocus: true,
  });

  const categories = useMemo(() => {
    const list = dbCategories.map((c) => c.name);
    return ["All", ...Array.from(new Set(list))];
  }, [dbCategories]);

  // Pagination calculations (10 vehicles per page)
  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return vehicles.slice(start, start + ITEMS_PER_PAGE);
  }, [vehicles, currentPage]);

  const startIndex = vehicles.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, vehicles.length);

  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const setDirect = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  const active =
    filters.category !== "All" ||
    filters.fuelType !== "All" ||
    filters.transmission !== "All" ||
    filters.search ||
    filters.sort;

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageBanner
        title="Our Premium Fleet"
        subtitle="Explore our sanitized, GPS-enabled self-drive cars. Transparent rates with just ₹500 advance confirmation token."
        tag="Available Vehicles"
      />

      <section className="section bg-slate-50/50">
        <div className="container-x">
          {/* Category Pills Bar */}
          <div className="mb-6 flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setDirect("category", cat)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${
                  filters.category === cat
                    ? "bg-primary-700 text-white shadow-md shadow-primary-700/20 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-primary-700 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="mb-8 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
              {/* Search */}
              <div className="relative sm:col-span-2 lg:col-span-4">
                <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={filters.search}
                  onChange={set("search")}
                  placeholder="Search by car name, brand or city…"
                  className="input pl-10"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters((f) => ({ ...f, search: "" }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-700"
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              <Select className="lg:col-span-2" label="Category" value={filters.category} onChange={set("category")} options={categories} />
              <Select className="lg:col-span-2" label="Fuel Type" value={filters.fuelType} onChange={set("fuelType")} options={FUEL_TYPES} />
              <Select className="lg:col-span-2" label="Gearbox" value={filters.transmission} onChange={set("transmission")} options={TRANSMISSIONS} />

              <div className="lg:col-span-2">
                <select value={filters.sort} onChange={set("sort")} className="input font-medium text-slate-700">
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 gap-2">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {loading
                  ? "Searching vehicles…"
                  : `Showing ${startIndex}–${endIndex} of ${vehicles.length} vehicle${vehicles.length !== 1 ? "s" : ""} available`}
              </p>

              {active && (
                <button
                  onClick={() => setFilters(defaults)}
                  className="text-xs font-bold text-gold-600 hover:text-gold-700 hover:underline flex items-center gap-1"
                >
                  <FiX /> Clear all active filters
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <Loader label="Loading GoDrive vehicles…" />
          ) : paginatedVehicles.length ? (
            <>
              <motion.div
                layout
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {paginatedVehicles.map((v, i) => (
                  <CarCard key={v._id} vehicle={v} index={i} />
                ))}
              </motion.div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-slate-200 shadow-card">
                  <p className="text-xs font-semibold text-slate-500">
                    Showing <span className="font-bold text-primary-900">{startIndex}–{endIndex}</span> of{" "}
                    <span className="font-bold text-primary-900">{vehicles.length}</span> vehicles
                  </p>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      aria-label="Previous Page"
                    >
                      <FiChevronLeft size={18} />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-9 min-w-[36px] px-2 rounded-xl text-xs font-bold transition ${
                          currentPage === pageNum
                            ? "bg-primary-900 text-white shadow-md shadow-primary-950/20"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-900"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      aria-label="Next Page"
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : hasError ? (
            <div className="rounded-3xl border border-dashed border-red-200 bg-white py-16 text-center shadow-card">
              <p className="text-lg font-bold text-primary-900">Unable to load cars</p>
              <p className="mt-1 text-xs text-slate-400">{error?.data?.message || "Error fetching vehicles"}</p>
              <button onClick={() => refetch()} className="btn-primary mt-5">
                Try again
              </button>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-card">
              <FaCarSide className="mx-auto mb-3 text-slate-300 text-4xl" />
              <p className="text-lg font-bold text-primary-900">No cars match your filters</p>
              <p className="mt-1 text-xs text-slate-400">Try adjusting your search criteria or resetting filters.</p>
              <button onClick={() => setFilters(defaults)} className="btn-primary btn-sm mt-5">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Select({ value, onChange, options, className = "", label }) {
  return (
    <div className={className}>
      <select value={value} onChange={onChange} className="input font-medium text-slate-700">
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "All" ? `All ${label || "Options"}` : o}
          </option>
        ))}
      </select>
    </div>
  );
}
