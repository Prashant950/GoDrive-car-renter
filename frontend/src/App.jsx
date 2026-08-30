import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop.jsx";
import PublicLayout from "./components/PublicLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AuthModal from "./components/AuthModal.jsx";
import Loader from "./components/Loader.jsx";
import { useAuth } from "./context/AuthContext.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Pricing from "./pages/Pricing.jsx";
import Contact from "./pages/Contact.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import VehicleDetails from "./pages/VehicleDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

// User dashboard
import UserLayout from "./pages/user/UserLayout.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import MyBookings from "./pages/user/MyBookings.jsx";
import Notifications from "./pages/user/Notifications.jsx";
import Profile from "./pages/user/Profile.jsx";

// Admin dashboard
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageVehicles from "./pages/admin/ManageVehicles.jsx";
import VehicleForm from "./pages/admin/VehicleForm.jsx";
import ManageBookings from "./pages/admin/ManageBookings.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import AdminNotifications from "./pages/admin/AdminNotifications.jsx";
import Enquiries from "./pages/admin/Enquiries.jsx";

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-950">
        <Loader light label="Starting GoDrive Self Drive…" />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
        </Route>

        {/* User dashboard */}
        <Route
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/bookings" element={<MyBookings />} />
          <Route path="/dashboard/notifications" element={<Notifications />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>

        {/* Admin dashboard */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vehicles" element={<ManageVehicles />} />
          <Route path="/admin/vehicles/add" element={<VehicleForm />} />
          <Route path="/admin/vehicles/edit/:id" element={<VehicleForm />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/enquiries" element={<Enquiries />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global login / register modal */}
      <AuthModal />
    </>
  );
}
