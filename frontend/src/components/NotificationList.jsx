import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiBell,
  FiCalendar,
  FiCreditCard,
  FiRefreshCw,
  FiMail,
  FiInfo,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import Loader from "./Loader.jsx";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} from "../services/user/userNotificationApi.js";
import {
  useGetAdminNotificationsQuery,
  useMarkAdminNotificationReadMutation,
  useMarkAllAdminNotificationsReadMutation,
  useDeleteAdminNotificationMutation,
} from "../services/admin/adminNotificationApi.js";
import { formatDateTime } from "../utils/format.js";

const typeMeta = {
  booking: { icon: FiCalendar, cls: "bg-primary-50 text-primary-700" },
  payment: { icon: FiCreditCard, cls: "bg-emerald-50 text-emerald-600" },
  status: { icon: FiRefreshCw, cls: "bg-amber-50 text-amber-600" },
  contact: { icon: FiMail, cls: "bg-gold-500/15 text-gold-600" },
  system: { icon: FiInfo, cls: "bg-slate-100 text-slate-500" },
};

export default function NotificationList({ scope = "user" }) {
  const isAdmin = scope === "admin";

  const { data: userNotifData, isLoading: userLoading } = useGetMyNotificationsQuery(undefined, {
    skip: isAdmin,
  });
  const { data: adminNotifData, isLoading: adminLoading } = useGetAdminNotificationsQuery(undefined, {
    skip: !isAdmin,
  });

  const [markUserRead] = useMarkNotificationReadMutation();
  const [markAllUserRead] = useMarkAllNotificationsReadMutation();
  const [deleteUserNotif] = useDeleteNotificationMutation();

  const [markAdminRead] = useMarkAdminNotificationReadMutation();
  const [markAllAdminRead] = useMarkAllAdminNotificationsReadMutation();
  const [deleteAdminNotif] = useDeleteAdminNotificationMutation();

  const loading = isAdmin ? adminLoading : userLoading;
  const data = isAdmin ? adminNotifData : userNotifData;
  const items = data?.items || [];
  const unread = data?.unread ?? items.filter((n) => !n.read).length;

  const markRead = async (n) => {
    if (n.read) return;
    try {
      if (isAdmin) {
        await markAdminRead(n._id).unwrap();
      } else {
        await markUserRead(n._id).unwrap();
      }
    } catch {
      /* soft fail */
    }
  };

  const markAll = async () => {
    try {
      if (isAdmin) {
        await markAllAdminRead().unwrap();
      } else {
        await markAllUserRead().unwrap();
      }
      toast.success("All marked as read");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to mark all as read");
    }
  };

  const remove = async (id) => {
    try {
      if (isAdmin) {
        await deleteAdminNotif(id).unwrap();
      } else {
        await deleteUserNotif(id).unwrap();
      }
      toast.success("Notification removed");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to remove notification");
    }
  };

  if (loading) return <Loader label="Loading notifications…" />;

  return (
    <div className="space-y-4">
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-primary-900">Notifications</span>
          {unread > 0 && <span className="badge-amber">{unread} new</span>}
        </div>
        {unread > 0 && (
          <button
            onClick={markAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-gold-600"
          >
            <FiCheck /> Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="card py-16 text-center">
          <FiBell className="mx-auto text-3xl text-slate-300" />
          <p className="mt-3 font-bold text-primary-900">No notifications</p>
          <p className="text-xs text-slate-400">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence>
            {items.map((n) => {
              const meta = typeMeta[n.type] || typeMeta.system;
              const Icon = meta.icon;
              return (
                <motion.div
                  key={n._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => markRead(n)}
                  className={`card flex items-start gap-4 p-4 transition hover:border-primary-200 ${
                    n.read ? "bg-white opacity-80" : "border-l-4 border-l-gold-500 bg-gold-500/5 shadow-sm"
                  }`}
                >
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.cls}`}>
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-primary-900 text-sm">{n.title}</p>
                      <span className="text-[11px] text-slate-400">{formatDateTime(n.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    {n.link && (
                      <Link
                        to={n.link}
                        className="mt-2 inline-block text-xs font-bold text-primary-700 hover:text-gold-600"
                      >
                        View details →
                      </Link>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(n._id);
                    }}
                    className="shrink-0 text-slate-300 hover:text-red-500"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
