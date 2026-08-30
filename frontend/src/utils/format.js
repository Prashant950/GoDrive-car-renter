// Small formatting helpers used across the app.

export const formatINR = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`;

export const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

// Days between two dates (min 1)
export const diffDays = (start, end) => {
  if (!start || !end) return 0;
  const ms = new Date(end) - new Date(start);
  if (isNaN(ms) || ms <= 0) return 0;
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

// Format an ISO string for a <input type="datetime-local"> value
export const toLocalInput = (date) => {
  const d = new Date(date);
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export const statusStyle = (status) => {
  switch (status) {
    case "Confirmed":
      return "badge-green";
    case "Pending":
      return "badge-amber";
    case "Cancelled":
      return "badge-red";
    case "Completed":
      return "badge-navy";
    case "Paid":
      return "badge-green";
    default:
      return "badge-navy";
  }
};
