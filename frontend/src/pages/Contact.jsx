import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiLoader,
  FiUser,
  FiMessageSquare,
  FiExternalLink,
  FiNavigation,
  FiCheckCircle,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { FaPhoneAlt } from "react-icons/fa";
import PageBanner from "../components/PageBanner.jsx";
import { useSendContactMutation } from "../services/user/userContactApi.js";

const initial = { name: "", email: "", phone: "", subject: "", message: "" };

const MAPS_URL =
  "https://maps.google.com/?q=Advant+Navis+Business+Park,+ADVANT+IT+PARK+PVT+LTD,+7,+EXPRESSWAY,+Sector+142,+Noida,+Uttar+Pradesh+201304";

const info = [
  {
    icon: FiMapPin,
    label: "Visit Us / Main Fleet Hub",
    value: "Advant Navis Business Park, ADVANT IT PARK PVT LTD, 7, EXPRESSWAY, Sector 142, Noida, Uttar Pradesh 201304",
    link: MAPS_URL,
  },
  {
    icon: FiPhone,
    label: "24×7 Phone Helpline",
    value: "+91 7275647029",
    link: "tel:+917275647029",
  },
  {
    icon: FiMail,
    label: "Official Support Email",
    value: "hello@godriveselfdrive.com",
    link: "mailto:hello@godriveselfdrive.com",
  },
  {
    icon: FiClock,
    label: "Operating Hours",
    value: "Open 24 Hours · All 7 Days · Doorstep Handover & Delivery",
  },
];

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [sendContact, { isLoading: loading }] = useSendContactMutation();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendContact(form).unwrap();
      toast.success("Thank you! Your message was sent to GoDrive Concierge. We'll connect shortly. 🎉");
      setForm(initial);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Could not send message");
    }
  };

  return (
    <>
      <PageBanner
        title="Get in Touch"
        crumb="Contact"
        subtitle="Questions about a booking, doorstep delivery, custom outstation package or corporate rates? Connect with GoDrive Self Drive concierge team anytime."
      />

      <section className="section bg-slate-50">
        <div className="container-x space-y-10">
          {/* Main Top 2-Column Section (Aligned naturally without empty space) */}
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Info Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary-900">
                  Contact &amp; Support Hub
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Reach us through phone, email, or visit our Noida hub. Our concierge team is on standby 24 hours a day.
                </p>
              </div>

              <div className="space-y-3">
                {info.map(({ icon: Icon, label, value, link }, i) => {
                  const CardWrapper = link ? "a" : "div";
                  const linkProps = link
                    ? { href: link, target: link.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" }
                    : {};

                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <CardWrapper
                        {...linkProps}
                        className={`group relative overflow-hidden flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card transition-all duration-300 hover:border-gold-400 hover:shadow-md hover:-translate-y-0.5 block ${
                          link ? "cursor-pointer" : ""
                        }`}
                      >
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-primary-700 to-primary-900 text-gold-400 shadow-sm mt-0.5 group-hover:scale-110 transition-transform duration-300">
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
                          <p className="font-bold text-primary-900 text-xs sm:text-sm mt-0.5 group-hover:text-primary-800 transition-colors leading-snug">
                            {value}
                          </p>
                          {link && (
                            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-gold-600 group-hover:text-gold-700">
                              {label.includes("Visit") ? "View on Google Maps" : "Click to connect"} &rarr;
                            </span>
                          )}
                        </div>
                      </CardWrapper>
                    </motion.div>
                  );
                })}
              </div>

              
            </div>

            {/* Right Form Column (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card lg:col-span-7 transition-all duration-300 hover:border-gold-400/80 hover:shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-primary-900">
                    Send GoDrive a Message
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Fill in your trip details and our team will get back to you within 15 minutes.
                  </p>
                </div>
                <span className="badge-green text-xs font-bold shrink-0 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> 24×7 Active
                </span>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    icon={FiUser}
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                  <Field
                    icon={FiPhone}
                    label="Mobile Number"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+91 98765 43210"
                    type="tel"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    icon={FiMail}
                    label="Email Address"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@domain.com"
                    type="email"
                    required
                  />
                  <Field
                    icon={FiMessageSquare}
                    label="Trip / Subject"
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    placeholder="e.g. Noida to Agra 3-day rental"
                  />
                </div>

                <div>
                  <label className="label">Your Requirements &amp; Dates</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={4}
                    required
                    placeholder="Tell us about the vehicle you need, travel dates, destination, or any special requests…"
                    className="input resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold !py-3.5 !px-8 font-bold w-full sm:w-auto shadow-lg text-sm sm:text-base flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin" /> Sending to Concierge…
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FiSend />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <FiShield className="text-emerald-500" /> Your information is 100% private and protected.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>

          {/* ---------------- FULL-WIDTH INTERACTIVE LOCATION & MAP SECTION ---------------- */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="badge-navy text-xs font-bold mb-1 inline-block">Fleet Hub Location</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-primary-900">
                  Advant Navis Business Park, Sector 142 Noida
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conveniently situated along the Noida-Greater Noida Expressway near Sector 142 Metro Station.
                </p>
              </div>

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-glow-navy"
              >
                <FiNavigation size={14} className="text-gold-400" />
                <span>Get Driving Directions</span>
                <FiExternalLink size={12} />
              </a>
            </div>

            {/* Embedded Responsive Map */}
            <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <iframe
                title="GoDrive Self Drive Advant Navis Business Park Sector 142 Noida Location"
                src="https://maps.google.com/maps?q=Advant%20Navis%20Business%20Park,%20ADVANT%20IT%20PARK%20PVT%20LTD,%207,%20EXPRESSWAY,%20Sector%20142,%20Noida,%20Uttar%20Pradesh%20201304&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-80 sm:h-96 w-full border-0"
                loading="lazy"
              />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-primary-950/95 text-white px-4 py-2.5 text-xs font-bold shadow-xl hover:bg-gold-500 hover:text-primary-950 transition-all backdrop-blur-md border border-white/10"
              >
                <FiNavigation size={15} className="text-gold-400 group-hover:text-primary-950" />
                <span>Open in Google Maps</span>
                <FiExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input {...props} className="input pl-10" />
      </div>
    </div>
  );
}
