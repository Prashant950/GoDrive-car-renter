import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Loader from "../../components/Loader.jsx";
import CategoryModal from "../../components/CategoryModal.jsx";
import { useGetVehiclesQuery } from "../../services/user/userVehicleApi.js";
import { useDeleteVehicleMutation } from "../../services/admin/adminVehicleApi.js";
import { formatINR } from "../../utils/format.js";

const ITEMS_PER_PAGE = 10;

export default function ManageVehicles() {
  const { data: vehicles = [], isLoading: loading } = useGetVehiclesQuery(undefined, {
    pollingInterval: 3000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [deleteVehicle] = useDeleteVehicleMutation();
  const [q, setQ] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [q]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return vehicles;
    return vehicles.filter(
      (v) => v.name.toLowerCase().includes(term) || v.brand?.toLowerCase().includes(term)
    );
  }, [vehicles, q]);

  // Pagination (10 per page)
  const totalPages = Math.ceil(shown.length / ITEMS_PER_PAGE) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return shown.slice(start, start + ITEMS_PER_PAGE);
  }, [shown, page]);

  const startIndex = shown.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(page * ITEMS_PER_PAGE, shown.length);

  const remove = async (v) => {
    if (!window.confirm(`Delete "${v.name}"? This cannot be undone.`)) return;
    setDeleting(v._id);
    try {
      await deleteVehicle(v._id).unwrap();
      toast.success("Vehicle deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to delete vehicle");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <Loader label="Loading vehicles…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search vehicles…"
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/vehicles/add" className="btn-primary flex items-center gap-2">
            <FiPlus /> Add Vehicle
          </Link>
        </div>
      </div>

      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Fuel & Gear</th>
                <th className="px-5 py-3 font-medium">Pricing Rate</th>
                <th className="px-5 py-3 font-medium">+Driver/Day</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map((v) => (
                <tr key={v._id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={v.image} alt="" className="h-11 w-16 shrink-0 rounded-lg bg-slate-50 object-contain p-1" />
                      <div>
                        <p className="flex items-center gap-1.5 font-semibold text-primary-700">
                          {v.featured && <FiStar className="fill-gold-500 text-gold-500" size={13} />}
                          {v.name}
                        </p>
                        <p className="text-xs text-slate-400">{v.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    <span className="badge-navy !text-xs font-semibold">{v.category}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    <div className="text-xs">
                      <p className="font-semibold text-slate-700">{v.fuelType}</p>
                      <p className="text-slate-400">{v.transmission}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-bold text-primary-900 text-sm">
                        {formatINR(v.pricePerDay)}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {v.priceDuration || "24 Hours / Per Day"}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs font-semibold">
                    +{formatINR(v.withDriverPrice || 800)}/day
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge ${v.available ? "badge-green" : "badge-red"}`}>
                      {v.available ? "Available" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/vehicles/edit/${v._id}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-primary-700 transition hover:border-primary-700 hover:bg-primary-700 hover:text-white"
                        aria-label="Edit"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        onClick={() => remove(v)}
                        disabled={deleting === v._id}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-red-500 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                        aria-label="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!shown.length && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    No vehicles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold text-slate-500">
              Showing <span className="font-bold text-primary-900">{startIndex}–{endIndex}</span> of{" "}
              <span className="font-bold text-primary-900">{shown.length}</span> vehicles
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <FiChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold transition ${
                    page === pageNum
                      ? "bg-primary-900 text-white shadow-xs"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
