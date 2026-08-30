import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiLock, FiLoader, FiSave } from "react-icons/fi";
import { useUpdateProfileMutation } from "../../services/user/userProfileApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDate } from "../../utils/format.js";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [updateProfileMutation, { isLoading: loading }] = useUpdateProfileMutation();
  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    city: user?.city || "",
    address: user?.address || "",
  });
  const [pwd, setPwd] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (pwd) payload.password = pwd;
      const res = await updateProfileMutation(payload).unwrap();
      updateUser(res.user);
      setPwd("");
      toast.success("Profile updated ✅");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to update profile");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Profile summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card h-fit p-7 text-center"
      >
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary-700 font-display text-3xl font-bold text-white">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-primary-700">{user?.name}</h2>
        <p className="text-sm text-slate-400">{user?.email}</p>
        <span className="mt-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
          {user?.role === "admin" ? "Administrator" : "Customer"}
        </span>
        {user?.createdAt && (
          <p className="mt-4 text-xs text-slate-400">Member since {formatDate(user.createdAt)}</p>
        )}
      </motion.div>

      {/* Edit form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card p-7 lg:col-span-2"
      >
        <h3 className="font-display text-xl font-bold text-primary-700">Edit profile</h3>
        <p className="mt-1 text-sm text-slate-400">Update your personal information and password.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field icon={FiUser} label="Full name" name="name" value={form.name} onChange={onChange} required />
            <Field icon={FiMail} label="Email (read-only)" value={user?.email} disabled />
            <Field icon={FiPhone} label="Mobile" name="mobile" value={form.mobile} onChange={onChange} required />
            <Field icon={FiHome} label="City" name="city" value={form.city} onChange={onChange} placeholder="e.g. Pune" />
          </div>
          <Field
            icon={FiMapPin}
            label="Address"
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="Street, area…"
          />
          <div className="border-t border-slate-100 pt-5">
            <Field
              icon={FiLock}
              label="New password (leave blank to keep current)"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <><FiLoader className="animate-spin" /> Saving…</>
            ) : (
              <><FiSave /> Save changes</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function Field({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input {...props} className="input pl-10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400" />
      </div>
    </div>
  );
}
