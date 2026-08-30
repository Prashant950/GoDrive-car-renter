import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiTrash2, FiInbox } from "react-icons/fi";
import Loader from "../../components/Loader.jsx";
import {
  useGetContactsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} from "../../services/admin/adminContactApi.js";
import { formatDateTime } from "../../utils/format.js";

const STATUSES = ["All", "New", "Read", "Resolved"];
const SET = ["New", "Read", "Resolved"];

const statusBadge = (s) =>
  s === "New" ? "badge-amber" : s === "Resolved" ? "badge-green" : "badge-navy";

export default function Enquiries() {
  const { data: items = [], isLoading: loading } = useGetContactsQuery();
  const [updateContactStatus] = useUpdateContactStatusMutation();
  const [deleteContact] = useDeleteContactMutation();

  const [filter, setFilter] = useState("All");
  const [busy, setBusy] = useState(null);

  const shown = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.status === filter)),
    [items, filter]
  );

  const setStatus = async (item, status) => {
    if (status === item.status) return;
    setBusy(item._id);
    try {
      await updateContactStatus({ id: item._id, status }).unwrap();
      toast.success(`Enquiry marked as ${status}`);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to update status");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete enquiry from ${item.name}?`)) return;
    setBusy(item._id);
    try {
      await deleteContact(item._id).unwrap();
      toast.success("Enquiry deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to delete enquiry");
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <Loader label="Loading enquiries…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const count = s === "All" ? items.length : items.filter((i) => i.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === s ? "bg-primary-700 text-white" : "bg-white text-slate-500 shadow-card hover:text-primary-700"
              }`}
            >
              {s} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {shown.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence initial={false}>
            {shown.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-primary-700">{item.name}</h3>
                    <p className="text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
                  </div>
                  <span className={`badge ${statusBadge(item.status)}`}>{item.status}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                  <a href={`mailto:${item.email}`} className="flex items-center gap-1.5 hover:text-primary-700">
                    <FiMail size={14} /> {item.email}
                  </a>
                  {item.phone && (
                    <a href={`tel:${item.phone}`} className="flex items-center gap-1.5 hover:text-primary-700">
                      <FiPhone size={14} /> {item.phone}
                    </a>
                  )}
                </div>

                <p className="mt-3 text-sm font-semibold text-primary-700">{item.subject}</p>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">{item.message}</p>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <select
                    value={item.status}
                    disabled={busy === item._id}
                    onChange={(e) => setStatus(item, e.target.value)}
                    className="input !w-auto !py-2 text-sm"
                  >
                    {SET.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => remove(item)}
                    disabled={busy === item._id}
                    className="ml-auto grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-red-500 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                    aria-label="Delete enquiry"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary-50 text-primary-700">
            <FiInbox size={28} />
          </div>
          <p className="text-lg font-semibold text-primary-700">No enquiries</p>
          <p className="mt-1 text-sm text-slate-400">Messages from the contact form will appear here.</p>
        </div>
      )}
    </div>
  );
}
