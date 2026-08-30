import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch, FiTrash2, FiUserCheck, FiUserX } from "react-icons/fi";
import Loader from "../../components/Loader.jsx";
import {
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
} from "../../services/admin/adminUserApi.js";
import { formatDate } from "../../utils/format.js";

export default function ManageUsers() {
  const { data: users = [], isLoading: loading } = useGetAllUsersQuery();
  const [toggleUser] = useToggleUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(null);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.mobile?.includes(term)
    );
  }, [users, q]);

  const toggle = async (u) => {
    setBusy(u._id);
    try {
      const updated = await toggleUser(u._id).unwrap();
      toast.success(updated.isActive ? "User enabled" : "User disabled");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to update user status");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    setBusy(u._id);
    try {
      await deleteUser(u._id).unwrap();
      toast.success("User removed successfully");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to remove user");
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <Loader label="Loading users…" />;

  return (
    <div className="space-y-6">
      <div className="relative w-full sm:w-72">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="input pl-10" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Mobile</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {shown.map((u) => (
                <tr key={u._id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-700 text-sm font-bold text-white">
                        {u.name?.charAt(0)?.toUpperCase()}
                      </span>
                      <div>
                        <p className="font-semibold text-primary-700">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{u.mobile || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${u.role === "admin" ? "badge-gold" : "badge-navy"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${u.isActive ? "badge-green" : "badge-red"}`}>
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {u.role === "admin" ? (
                      <p className="text-right text-xs text-slate-300">Protected</p>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggle(u)}
                          disabled={busy === u._id}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-primary-700 transition hover:border-primary-700 hover:bg-primary-700 hover:text-white disabled:opacity-50"
                          aria-label={u.isActive ? "Disable" : "Enable"}
                          title={u.isActive ? "Disable user" : "Enable user"}
                        >
                          {u.isActive ? <FiUserX size={15} /> : <FiUserCheck size={15} />}
                        </button>
                        <button
                          onClick={() => remove(u)}
                          disabled={busy === u._id}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-red-500 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                          aria-label="Delete"
                          title="Delete user"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!shown.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
