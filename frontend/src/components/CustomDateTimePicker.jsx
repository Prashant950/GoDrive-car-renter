import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
} from "react-icons/fi";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = ["00", "15", "30", "45"];

export default function CustomDateTimePicker({
  label,
  value,
  onChange,
  minDate,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value
  const parsedDate = useMemo(() => {
    const d = value ? new Date(value) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  }, [value]);

  // Navigation state for month/year
  const [navYear, setNavYear] = useState(parsedDate.getFullYear());
  const [navMonth, setNavMonth] = useState(parsedDate.getMonth());

  // Selected date parts
  const [selectedDay, setSelectedDay] = useState(parsedDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(parsedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(parsedDate.getFullYear());

  // 12-hour format state
  const rawHours = parsedDate.getHours();
  const initialHour12 = rawHours % 12 || 12;
  const initialAmPm = rawHours >= 12 ? "PM" : "AM";
  const initialMinute = String(Math.floor(parsedDate.getMinutes() / 15) * 15).padStart(2, "0");

  const [hour12, setHour12] = useState(initialHour12);
  const [minute, setMinute] = useState(MINUTES.includes(initialMinute) ? initialMinute : "00");
  const [amPm, setAmPm] = useState(initialAmPm);

  // Sync internal state when value prop changes
  useEffect(() => {
    const d = value ? new Date(value) : new Date();
    if (!isNaN(d.getTime())) {
      setNavYear(d.getFullYear());
      setNavMonth(d.getMonth());
      setSelectedDay(d.getDate());
      setSelectedMonth(d.getMonth());
      setSelectedYear(d.getFullYear());

      const h = d.getHours();
      setHour12(h % 12 || 12);
      setAmPm(h >= 12 ? "PM" : "AM");
      const m = String(Math.floor(d.getMinutes() / 15) * 15).padStart(2, "0");
      setMinute(MINUTES.includes(m) ? m : "00");
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  // Construct ISO datetime string
  const computeDateTimeISO = (d, m, y, h12, minStr, period) => {
    let h24 = Number(h12);
    if (period === "PM" && h24 < 12) h24 += 12;
    if (period === "AM" && h24 === 12) h24 = 0;

    const dt = new Date(y, m, d, h24, Number(minStr), 0, 0);
    const pad = (n) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  };

  // Calendar days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(navYear, navMonth, 1).getDay();
    const daysInMonth = new Date(navYear, navMonth + 1, 0).getDate();
    const prevMonthDays = new Date(navYear, navMonth, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: navMonth - 1,
        year: navYear,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        day: d,
        month: navMonth,
        year: navYear,
        isCurrentMonth: true,
      });
    }

    // Remaining filler days to finish grid
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        day: d,
        month: navMonth + 1,
        year: navYear,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [navYear, navMonth]);

  const minDateTime = useMemo(() => {
    if (!minDate) return new Date(new Date().setHours(0, 0, 0, 0));
    return new Date(minDate);
  }, [minDate]);

  const isDayDisabled = (d, m, y) => {
    const checkDate = new Date(y, m, d, 23, 59, 59, 999);
    return checkDate < minDateTime;
  };

  const handleSelectDay = (dayObj) => {
    if (isDayDisabled(dayObj.day, dayObj.month, dayObj.year)) return;

    setSelectedDay(dayObj.day);
    setSelectedMonth(dayObj.month);
    setSelectedYear(dayObj.year);

    const newIso = computeDateTimeISO(
      dayObj.day,
      dayObj.month,
      dayObj.year,
      hour12,
      minute,
      amPm
    );
    onChange(newIso);
  };

  const handleTimeChange = (newH, newM, newPeriod) => {
    setHour12(newH);
    setMinute(newM);
    setAmPm(newPeriod);

    const newIso = computeDateTimeISO(
      selectedDay,
      selectedMonth,
      selectedYear,
      newH,
      newM,
      newPeriod
    );
    onChange(newIso);
  };

  const formattedDisplay = useMemo(() => {
    if (!value) return "Select Date & Time";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "Select Date & Time";

    const day = String(d.getDate()).padStart(2, "0");
    const month = MONTHS[d.getMonth()];
    const year = d.getFullYear();
    const rawH = d.getHours();
    const h12 = rawH % 12 || 12;
    const p = rawH >= 12 ? "PM" : "AM";
    const min = String(d.getMinutes()).padStart(2, "0");

    return `${day} ${month} ${year}, ${String(h12).padStart(2, "0")}:${min} ${p}`;
  }, [value]);

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="label flex items-center justify-between mb-1.5">
          <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
            <FiCalendar className="text-gold-600" /> {label}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">12-Hr AM/PM</span>
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-left shadow-xs transition-all ${
          open
            ? "border-gold-500 ring-2 ring-gold-400/20 shadow-md"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold-50 text-gold-600 font-bold">
            <FiCalendar size={14} />
          </div>
          <span className="truncate text-xs sm:text-sm font-extrabold text-primary-900">
            {formattedDisplay}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400 shrink-0">
          <FiClock size={14} />
        </div>
      </button>

      {/* Floating Popover Picker */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-1.5 w-full min-w-[290px] sm:min-w-[320px] rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl"
          >
            {/* Header: Month / Year Navigation */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (navMonth === 0) {
                    setNavMonth(11);
                    setNavYear((y) => y - 1);
                  } else {
                    setNavMonth((m) => m - 1);
                  }
                }}
                className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 active:scale-95"
              >
                <FiChevronLeft size={14} />
              </button>

              <span className="font-display text-xs sm:text-sm font-bold text-primary-900">
                {MONTHS[navMonth]} {navYear}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (navMonth === 11) {
                    setNavMonth(0);
                    setNavYear((y) => y + 1);
                  } else {
                    setNavMonth((m) => m + 1);
                  }
                }}
                className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 active:scale-95"
              >
                <FiChevronRight size={14} />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
              {DAYS_SHORT.map((d) => (
                <div key={d} className="py-0.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarDays.map((item, idx) => {
                const isSelected =
                  item.day === selectedDay &&
                  item.month === selectedMonth &&
                  item.year === selectedYear;

                const isDisabled = isDayDisabled(item.day, item.month, item.year);

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelectDay(item)}
                    className={`h-7 w-7 sm:h-8 sm:w-8 mx-auto flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-gold-400 to-amber-500 text-primary-950 font-extrabold shadow-sm scale-105"
                        : item.isCurrentMonth
                        ? isDisabled
                          ? "text-slate-300 cursor-not-allowed opacity-40"
                          : "text-primary-900 hover:bg-slate-100 active:scale-95"
                        : "text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {item.day}
                  </button>
                );
              })}
            </div>

            {/* Simple Time Selector Controls (Hour, Minute, AM/PM) */}
            <div className="mt-3 border-t border-slate-100 pt-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <FiClock className="text-gold-600" /> Time:
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Hours */}
                  <select
                    value={hour12}
                    onChange={(e) => handleTimeChange(Number(e.target.value), minute, amPm)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-primary-900 focus:border-gold-400 focus:outline-none"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  <span className="font-bold text-slate-400">:</span>

                  {/* Minutes */}
                  <select
                    value={minute}
                    onChange={(e) => handleTimeChange(hour12, e.target.value, amPm)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-primary-900 focus:border-gold-400 focus:outline-none"
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  {/* AM / PM Toggle */}
                  <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                    {["AM", "PM"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleTimeChange(hour12, minute, p)}
                        className={`px-2 py-0.5 text-[11px] font-extrabold rounded-md transition ${
                          amPm === p
                            ? "bg-primary-900 text-gold-400 shadow-xs"
                            : "text-slate-500 hover:text-primary-900"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Done Button */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="truncate text-[11px] font-semibold text-slate-500">
                {formattedDisplay}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-gold !py-1 !px-3.5 text-xs font-bold shadow-xs inline-flex items-center gap-1"
              >
                <FiCheck size={13} /> Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
