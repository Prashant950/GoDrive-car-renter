import { FiGrid, FiTruck, FiCalendar, FiUsers, FiMail, FiBell } from "react-icons/fi";
import DashboardShell from "../../components/DashboardShell.jsx";

const links = [
  { to: "/admin", label: "Overview", icon: FiGrid, end: true },
  { to: "/admin/vehicles", label: "Vehicles", icon: FiTruck },
  { to: "/admin/bookings", label: "Bookings", icon: FiCalendar },
  { to: "/admin/users", label: "Users", icon: FiUsers },
  { to: "/admin/enquiries", label: "Enquiries", icon: FiMail },
  { to: "/admin/notifications", label: "Notifications", icon: FiBell },
];

export default function AdminLayout() {
  return <DashboardShell brand="GoDrive Self Drive" badge="Admin" links={links} scope="admin" />;
}
