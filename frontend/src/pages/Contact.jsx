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
  FiCompass,
} from "react-icons/fi";
import PageBanner from "../components/PageBanner.jsx";
import { useSendContactMutation } from "../services/user/userContactApi.js";

const initial = { name: "", email: "", phone: "", subject: "", message: "" };

const NOIDA_MAPS_URL =
  "https://maps.google.com/?q=GoDrive+Self+Drive,+JAYPEE+KENSINGTON+PARK,+Plot+1,+Sector+133,+Noida,+Shahpur+Govardhanpur+Khadar,+Uttar+Pradesh+201304";

const PUNE_MAPS_URL =
  "https://maps.google.com/?q=Colony+No.10,+Om+Siddhi+Colony,+Ganesh+Nagar,+Bopkhel,+Pune,+Pimpri-Chinchwad,+Maharashtra+411031,+India";

const offices = [
  {
    id: "noida",
    badge: "Head Office",
    badgeColor: "bg-gold-500/10 text-gold-600 border-gold-400/40",
    city: "Noida, Uttar Pradesh (Delhi NCR)",
    title: "Head Office — Noida Fleet Hub",
    address:
      "GoDrive Self Drive, JAYPEE KENSINGTON PARK, Plot 1, Sector 133, Noida, Shahpur Govardhanpur Khadar, Uttar Pradesh 201304",
    mapsUrl: NOIDA_MAPS_URL,
    embedUrl:
      "https://maps.google.com/maps?q=GoDrive%20Self%20Drive,%20JAYPEE%20KENSINGTON%20PARK,%20Plot%201,%20Sector%20133,%20Noida,%20Shahpur%20Govardhanpur%20Khadar,%20Uttar%20Pradesh%20201304&t=&z=15&ie=UTF8&iwloc=&output=embed",
    phone: "+91 7275647029",
    hours: "Open 24/7 · 365 Days",
  },
  {
    id: "pune",
    badge: "Branch Office",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-400/40",
    city: "Pune, Maharashtra",
    title: "Branch Office — Pune Hub",
    address:
      "Colony No.10, Om Siddhi Colony, Ganesh Nagar, Bopkhel, Pune, Pimpri-Chinchwad, Maharashtra 411031, India",
    mapsUrl: PUNE_MAPS_URL,
    embedUrl:
      "https://maps.google.com/maps?q=Colony%20No.10,%20Om%20Siddhi%20Colony,%20Ganesh%20Nagar,%20Bopkhel,%20Pune,%20Pimpri-Chinchwad,%20Maharashtra%20411031,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed",
    phone: "+91 7275647029",
    hours: "Open 24/7 · 365 Days",
  },
];

const info = [
  {
    icon: FiMapPin,
    tag: "Head Office",
    label: "Head Office — Noida Hub",
    value:
      "GoDrive Self Drive, JAYPEE KENSINGTON PARK, Plot 1, Sector 133, Noida, Shahpur Govardhanpur Khadar, UP 201304",
    link: NOIDA_MAPS_URL,
  },
  {
    icon: FiMapPin,
    tag: "Branch Office",
    label: "Branch Office — Pune Hub",
    value:
      "Colony No.10, Om Siddhi Colony, Ganesh Nagar, Bopkhel, Pune, Pimpri-Chinchwad, Maharashtra 411031, India",
    link: PUNE_MAPS_URL,
  },
  {
    icon: FiPhone,
    tag: "Support",
    label: "24×7 Phone Helpline",
    value: "+91 7275647029",
    link: "tel:+917275647029",
  },
  {
    icon: FiMail,
    tag: "Inquiries",
    label: "Official Support Email",
    value: "hello@godriveselfdrive.com",
    link: "mailto:hello@godriveselfdrive.com",
  },
  {
    icon: FiClock,
    tag: "Availability",
    label: "Operating Hours",
    value: "Open 24 Hours · All 7 Days · Doorstep Handover & Delivery",
  },
];

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [selectedOffice, setSelectedOffice] = useState("all");
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

  const displayedOffices =
    selectedOffice === "all"
      ? offices
      : offices.filter((o) => o.id === selectedOffice);

  return (
    <>
      <PageBanner
        title="Get in Touch"
        crumb="Contact"
        subtitle="Questions about a booking, doorstep delivery, custom outstation package or corporate rates? Connect with GoDrive Self Drive concierge team anytime."
      />

      <section className="section bg-slate-50">
        <div className="container-x space-y-10">
          {/* Main Top 2-Column Section */}
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Info Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary-900">
                  Contact &amp; Support Hub
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Reach us via phone, email, or visit our Head Office in Noida and Branch Office in Pune. Our team is available 24/7.
                </p>
              </div>

              <div className="space-y-3">
                {info.map(({ icon: Icon, tag, label, value, link }, i) => {
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
                      transition={{ delay: i * 0.05 }}
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
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
                            {tag && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                                {tag}
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-primary-900 text-xs sm:text-sm mt-0.5 group-hover:text-primary-800 transition-colors leading-snug">
                            {value}
                          </p>
                          {link && (
                            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-gold-600 group-hover:text-gold-700">
                              {link.startsWith("http") ? "View on Google Maps" : "Click to connect"} &rarr;
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
                    placeholder="e.g. Pune to Lonavala 3-day rental"
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
                    placeholder="Tell us about the vehicle you need, travel dates, pickup city (Noida/Delhi NCR or Pune), or any special requests…"
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

          {/* ---------------- FULL-WIDTH DUAL OFFICE LOCATION & INTERACTIVE MAPS SECTION ---------------- */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="badge-navy text-xs font-bold mb-1.5 inline-flex items-center gap-1.5">
                  <FiCompass className="text-gold-400" /> Fleet Hubs &amp; Office Locations
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">
                  Visit Our Offices &amp; Fleet Hubs
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Locate our Head Office in Noida and Branch Office in Pune on Google Maps for fast pickup, handover, or assistance.
                </p>
              </div>

              {/* Location Switcher Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setSelectedOffice("all")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    selectedOffice === "all"
                      ? "bg-white text-primary-900 shadow-sm"
                      : "text-slate-600 hover:text-primary-900"
                  }`}
                >
                  Both Offices ({offices.length})
                </button>
                {offices.map((off) => (
                  <button
                    key={off.id}
                    type="button"
                    onClick={() => setSelectedOffice(off.id)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      selectedOffice === off.id
                        ? "bg-white text-primary-900 shadow-sm"
                        : "text-slate-600 hover:text-primary-900"
                    }`}
                  >
                    {off.badge}
                  </button>
                ))}
              </div>
            </div>

            {/* Office Maps Grid */}
            <div
              className={`grid gap-6 ${
                displayedOffices.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
              }`}
            >
              {displayedOffices.map((office) => (
                <motion.div
                  key={office.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-card space-y-4 hover:border-gold-400/80 hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${office.badgeColor}`}
                      >
                        {office.badge}
                      </span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <FiClock className="text-emerald-500" /> {office.hours}
                      </span>
                    </div>

                    <h4 className="font-display text-lg sm:text-xl font-bold text-primary-900">
                      {office.title}
                    </h4>

                    <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                      <FiMapPin className="mt-0.5 shrink-0 text-gold-500 text-sm" />
                      <p className="leading-snug">{office.address}</p>
                    </div>
                  </div>

                  {/* Embedded Google Map */}
                  <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-inner mt-2">
                    <iframe
                      title={`${office.title} Location Map`}
                      src={office.embedUrl}
                      className="h-64 sm:h-72 w-full border-0"
                      loading="lazy"
                    />
                    <a
                      href={office.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-primary-950/90 text-white px-3 py-2 text-xs font-bold shadow-lg hover:bg-gold-500 hover:text-primary-950 transition-all backdrop-blur-md border border-white/10"
                    >
                      <FiNavigation size={13} className="text-gold-400 group-hover:text-primary-950" />
                      <span>Google Maps</span>
                      <FiExternalLink size={11} />
                    </a>
                  </div>
                </motion.div>
              ))}
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
