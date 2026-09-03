import { useState, useEffect } from "react";
import { FaCarSide } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiLoader,
  FiKey,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiUserPlus,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Modal from "./Modal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../services/authApi.js";

const emptyForm = {
  name: "",
  email: "",
  mobile: "",
  password: "",
  identifier: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
};

export default function AuthModal() {
  const { authModal, closeAuth, setAuthMode, login, register } = useAuth();
  const { open, mode = "login" } = authModal;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [forgotPasswordMutation, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [resetPasswordMutation, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setSuccessMessage(null);
      setLoginError(null);
      setShowPassword(false);
    }
  }, [open]);

  const onChange = (e) => {
    setLoginError(null);
    setSuccessMessage(null);
    const { name, value } = e.target;

    if (name === "mobile") {
      // Strictly only digits and maximum 10 digits
      const numericOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((f) => ({ ...f, mobile: numericOnly }));
      return;
    }

    if (name === "identifier") {
      // If user is typing only numbers for mobile login, cap at 10 digits
      if (/^\d+$/.test(value)) {
        setForm((f) => ({ ...f, identifier: value.slice(0, 10) }));
        return;
      }
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handle Login or Register submit
  const submitAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    try {
      if (mode === "login") {
        const iden = (form.identifier || form.email || form.mobile || "").trim();
        // If numeric mobile was provided, ensure it is 10 digits
        if (/^\d+$/.test(iden) && iden.length !== 10) {
          toast.error("Mobile number exactly 10 digits ka hona chahiye");
          setLoading(false);
          return;
        }

        const loginPayload = {
          identifier: iden,
          password: form.password,
        };
        await login(loginPayload);
        setSuccessMessage(null);
      } else if (mode === "register") {
        const cleanMobile = (form.mobile || "").replace(/\D/g, "").trim();
        if (cleanMobile.length !== 10) {
          toast.error("Mobile number exactly 10 digits ka hona chahiye");
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          toast.error("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        const registeredEmail = form.email.trim();
        await register({
          name: form.name.trim(),
          email: registeredEmail,
          mobile: cleanMobile,
          password: form.password,
        });

        // After successful registration: switch to login mode with success banner & prefilled email
        setSuccessMessage(`Registration Successful! Welcome email sent to ${registeredEmail}. Enter your password to log in. 🎉`);
        setForm({
          ...emptyForm,
          identifier: registeredEmail,
          email: registeredEmail,
          password: "",
        });
        setLoginError(null);
        setAuthMode("login");
      }
    } catch (err) {
      const errMsg = err?.data?.message || err?.error || "";
      const status = err?.status;

      if (
        status === 404 ||
        errMsg.toLowerCase().includes("not registered") ||
        errMsg.toLowerCase().includes("register first") ||
        errMsg.toLowerCase().includes("user not found")
      ) {
        setLoginError({
          type: "not_registered",
          message: "Yeh account register nahi hai. Kripya pehle register karein!",
        });
      } else if (status === 401 || errMsg.toLowerCase().includes("password")) {
        setLoginError({
          type: "wrong_password",
          message: "Password galat hai. Kripya sahi password dalein ya Reset karein.",
        });
      } else {
        setLoginError({
          type: "generic",
          message: errMsg || "Operation failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Request OTP (Forgot Password)
  const submitForgotPassword = async (e) => {
    e.preventDefault();
    const emailToUse = (form.email || form.identifier || "").trim();
    if (!emailToUse) {
      return toast.error("Please enter your registered email address");
    }

    try {
      const res = await forgotPasswordMutation({ email: emailToUse }).unwrap();
      toast.success(res.message || "OTP sent to your email! Please check inbox.");
      setForm((f) => ({ ...f, email: res.email || emailToUse }));
      setAuthMode("reset");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to send reset OTP");
    }
  };

  // Handle Reset Password with OTP
  const submitResetPassword = async (e) => {
    e.preventDefault();
    if (!form.otp || form.otp.trim().length < 6) {
      return toast.error("Please enter the 6-digit OTP received in your email");
    }
    if (!form.newPassword || form.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters long");
    }
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await resetPasswordMutation({
        email: form.email,
        otp: form.otp.trim(),
        newPassword: form.newPassword,
      }).unwrap();

      toast.success(res.message || "Password reset successfully! You can now log in. 🎉");
      setSuccessMessage("Password reset successfully! Kripya naye password se login karein.");
      setForm((f) => ({
        ...emptyForm,
        identifier: form.email,
        password: "",
      }));
      setAuthMode("login");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to reset password. Check OTP.");
    }
  };

  const isBusy = loading || isSendingOtp || isResettingPassword;

  return (
    <Modal open={open} onClose={closeAuth} maxWidth="max-w-md">
      <div className="px-6 pb-7 pt-8">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-gold-400 to-amber-500 text-primary-950 shadow-md shadow-gold-500/20">
            <FaCarSide size={28} />
          </div>
          <h3 className="text-2xl font-black text-primary-900 font-display">
            {mode === "login" && "Welcome to GoDrive"}
            {mode === "register" && "Join GoDrive Self Drive"}
            {mode === "forgot" && "Forgot Password"}
            {mode === "reset" && "Verify OTP & Reset"}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {mode === "login" && "Log in with your Email or Mobile to manage bookings."}
            {mode === "register" && "Sign up to book cars with just ₹500 token."}
            {mode === "forgot" && "Enter your email to receive a 6-digit verification OTP."}
            {mode === "reset" && `Enter the 6-digit OTP sent to ${form.email || "your email"}.`}
          </p>
        </div>

        {/* 1. LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={submitAuth} className="space-y-4">
            {/* Green Success Banner */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="rounded-2xl p-4 border border-emerald-300 bg-emerald-50 text-emerald-900 shadow-sm"
              >
                <div className="flex items-start gap-2.5">
                  <FiCheckCircle className="shrink-0 text-emerald-600 mt-0.5 text-base" />
                  <div className="flex-1 font-bold text-xs sm:text-sm">
                    <p className="leading-snug">{successMessage}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Red Alert Banner */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`rounded-2xl p-4 border text-xs sm:text-sm transition-all ${
                  loginError.type === "not_registered"
                    ? "bg-red-50 border-red-300 text-red-800 shadow-sm"
                    : "bg-amber-50 border-amber-300 text-amber-900 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <FiAlertCircle className="shrink-0 text-red-600 mt-0.5 text-base" />
                  <div className="flex-1 font-bold">
                    <p className="leading-snug">{loginError.message}</p>
                  </div>
                </div>

                {loginError.type === "not_registered" && (
                  <button
                    type="button"
                    onClick={() => {
                      const entered = form.identifier || "";
                      const isEmail = entered.includes("@");
                      setForm((f) => ({
                        ...f,
                        email: isEmail ? entered : f.email,
                        mobile: !isEmail && /^\d+$/.test(entered) ? entered : f.mobile,
                      }));
                      setLoginError(null);
                      setSuccessMessage(null);
                      setAuthMode("register");
                    }}
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-2 px-4 text-xs font-extrabold text-white hover:from-red-700 hover:to-red-800 transition-all shadow-md shadow-red-600/25 active:scale-95"
                  >
                    <FiUserPlus size={14} /> Pehle Register Karein / Register Now &rarr;
                  </button>
                )}
              </motion.div>
            )}

            <Field
              icon={FiMail}
              name="identifier"
              placeholder="Email address or 10-digit mobile"
              value={form.identifier || form.email || ""}
              onChange={onChange}
              required
            />
            <div>
              <PasswordField
                icon={FiLock}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                show={showPassword}
                onToggleShow={() => setShowPassword((s) => !s)}
                autoFocus={Boolean(form.identifier || form.email)}
                required
              />
              <div className="mt-1.5 text-right">
                <button
                  type="button"
                  onClick={() => {
                    setLoginError(null);
                    setSuccessMessage(null);
                    setAuthMode("forgot");
                  }}
                  className="text-xs font-bold text-gold-600 hover:text-gold-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="btn-gold w-full !py-3 font-bold shadow-md"
            >
              {isBusy ? (
                <>
                  <FiLoader className="animate-spin" /> Logging in…
                </>
              ) : (
                "Log In"
              )}
            </button>

            <p className="mt-5 text-center text-xs sm:text-sm text-slate-500">
              New to GoDrive?{" "}
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setSuccessMessage(null);
                  setAuthMode("register");
                }}
                className="font-bold text-primary-800 underline-offset-2 hover:underline hover:text-gold-600"
              >
                Create an account
              </button>
            </p>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {mode === "register" && (
          <form onSubmit={submitAuth} className="space-y-4">
            <Field
              icon={FiUser}
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={onChange}
              required
            />
            <Field
              icon={FiMail}
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={onChange}
              required
            />
            <Field
              icon={FiPhone}
              type="tel"
              name="mobile"
              placeholder="10-Digit Mobile number"
              value={form.mobile}
              onChange={onChange}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
              required
            />
            <PasswordField
              icon={FiLock}
              name="password"
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={onChange}
              show={showPassword}
              onToggleShow={() => setShowPassword((s) => !s)}
              required
            />

            <button
              type="submit"
              disabled={isBusy}
              className="btn-gold w-full !py-3 font-bold shadow-md"
            >
              {isBusy ? (
                <>
                  <FiLoader className="animate-spin" /> Creating account…
                </>
              ) : (
                "Create GoDrive Account"
              )}
            </button>

            <p className="mt-5 text-center text-xs sm:text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setSuccessMessage(null);
                  setAuthMode("login");
                }}
                className="font-bold text-primary-800 underline-offset-2 hover:underline hover:text-gold-600"
              >
                Log in
              </button>
            </p>
          </form>
        )}

        {/* 3. FORGOT PASSWORD (STEP 1: ENTER EMAIL) */}
        {mode === "forgot" && (
          <form onSubmit={submitForgotPassword} className="space-y-4">
            <Field
              icon={FiMail}
              type="email"
              name="email"
              placeholder="Enter your registered email"
              value={form.email}
              onChange={onChange}
              required
            />

            <button
              type="submit"
              disabled={isBusy}
              className="btn-gold w-full !py-3 font-bold shadow-md"
            >
              {isBusy ? (
                <>
                  <FiLoader className="animate-spin" /> Sending OTP…
                </>
              ) : (
                "Send 6-Digit OTP"
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setSuccessMessage(null);
                  setAuthMode("login");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-700"
              >
                <FiArrowLeft /> Back to Login
              </button>
            </div>
          </form>
        )}

        {/* 4. RESET PASSWORD (STEP 2: ENTER OTP & NEW PASSWORD) */}
        {mode === "reset" && (
          <form onSubmit={submitResetPassword} className="space-y-4">
            <Field
              icon={FiKey}
              type="text"
              name="otp"
              maxLength={6}
              placeholder="Enter 6-Digit OTP"
              value={form.otp}
              onChange={onChange}
              className="input pl-11 text-center font-mono text-lg tracking-widest"
              required
            />
            <PasswordField
              icon={FiLock}
              name="newPassword"
              placeholder="New Password (min 6 chars)"
              value={form.newPassword}
              onChange={onChange}
              show={showPassword}
              onToggleShow={() => setShowPassword((s) => !s)}
              required
            />
            <PasswordField
              icon={FiLock}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={onChange}
              show={showPassword}
              onToggleShow={() => setShowPassword((s) => !s)}
              required
            />

            <button
              type="submit"
              disabled={isBusy}
              className="btn-gold w-full !py-3 font-bold shadow-md"
            >
              {isBusy ? (
                <>
                  <FiLoader className="animate-spin" /> Resetting password…
                </>
              ) : (
                "Reset Password & Finish"
              )}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={submitForgotPassword}
                disabled={isBusy}
                className="font-semibold text-gold-600 hover:text-gold-700 hover:underline"
              >
                Resend OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setSuccessMessage(null);
                  setAuthMode("login");
                }}
                className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-primary-700"
              >
                <FiArrowLeft /> Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

function Field({ icon: Icon, className = "input pl-11", ...props }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input {...props} className={className} />
    </div>
  );
}

function PasswordField({
  icon: Icon = FiLock,
  show,
  onToggleShow,
  className = "input pl-11 pr-11",
  ...props
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type={show ? "text" : "password"}
        {...props}
        className={className}
      />
      <button
        type="button"
        onClick={onToggleShow}
        tabIndex={-1}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-800 transition-colors p-1"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FiEyeOff size={17} /> : <FiEye size={17} />}
      </button>
    </div>
  );
}
