import { FiGrid, FiCalendar, FiBell, FiUser } from "react-icons/fi";
import DashboardShell from "../../components/DashboardShell.jsx";

const links = [
  { to: "/dashboard", label: "Overview", icon: FiGrid, end: true },
  { to: "/dashboard/bookings", label: "My Bookings", icon: FiCalendar },
  { to: "/dashboard/notifications", label: "Notifications", icon: FiBell },
  { to: "/dashboard/profile", label: "My Profile", icon: FiUser },
];

export default function UserLayout() {
  return <DashboardShell brand="GoDrive Self Drive" badge="Customer" links={links} scope="user" />;
}
