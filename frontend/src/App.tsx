import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./shared/components/layout/Navbar";
import { Footer } from "./shared/components/layout/Footer";
import { CommandMenu } from "./shared/components/layout/CommandMenu";
import { ScrollProgress } from "./shared/components/layout/ScrollProgress";
import { BackToTop } from "./shared/components/layout/BackToTop";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { ScrollToTop } from "./shared/components/ScrollToTop";

// ── Home
import HomePage from "./shared/components/Home";

// ── Services
import ServicesPage from "./features/services/pages/ServicesPage";
import ServiceDetailPage from "./features/services/pages/ServiceDetailPage";

// ── Specialists
import SpecialistsPage from "./features/specialists/pages/SpecialistsPage";
import SpecialistDetailPage from "./features/specialists/pages/SpecialistDetailPage";

// ── Booking
import BookingPage from "./features/booking/pages/BookingPage";

// ── Auth
import LoginPage from "./features/auth/pages/LoginPage";
import VerifyOtpPage from "./features/auth/pages/VerifyOtpPage";
import CompleteProfilePage from "./features/users/pages/CompleteProfilePage";

// ── User Dashboard
import DashboardLayout from "./features/users/pages/DashboardLayout";
import ProfilePage from "./features/users/pages/ProfilePage";
import AppointmentsPage from "./features/users/pages/AppointmentsPage";
import HistoryPage from "./features/users/pages/HistoryPage";
import SettingsPage from "./features/users/pages/SettingsPage";
import UploadAvatarPage from "./features/users/pages/UploadAvatarPage";

// ── Specialist Dashboard
import SpecialistDashboardLayout from "./features/specialists/pages/SpecialistDashboardLayout";
import SpecialistOverviewPage from "./features/specialists/pages/SpecialistOverviewPage";
import SpecialistAppointmentsPage from "./features/specialists/pages/SpecialistAppointmentsPage";
import SpecialistProfilePage from "./features/specialists/pages/SpecialistProfilePage";

// ── Admin
import { AdminLayout } from "./features/admin/components/AdminLayout";
import { RequireSuperAdmin } from "./features/admin/components/RequireSuperAdmin";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AdminUsers from "./features/admin/pages/AdminUsers";
import AdminServices from "./features/admin/pages/AdminServices";
import AdminAdmins from "./features/admin/pages/AdminAdmins";
import AdminAppointments from "./features/admin/pages/AdminAppointments";

function App() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <CommandMenu />
      <BackToTop />

      <Routes key={pathname}>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/services"
          element={
            <>
              <Navbar />
              <ServicesPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/services/:id"
          element={
            <>
              <Navbar />
              <ServiceDetailPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/specialists"
          element={
            <>
              <Navbar />
              <SpecialistsPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/specialists/:id"
          element={
            <>
              <Navbar />
              <SpecialistDetailPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/booking"
          element={
            <>
              <Navbar />
              <BookingPage />
              <Footer />
            </>
          }
        />

        {/* ═══════ Auth ═══════ */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />

        {/* ═══════ User Dashboard ═══════ */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={["customer", "admin", "super_admin"]}
              redirectTo="/specialist"
            >
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfilePage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="avatar" element={<UploadAvatarPage />} />
        </Route>

        {/* ═══════ Specialist Dashboard ═══════ */}
        <Route
          path="/specialist"
          element={
            <ProtectedRoute
              allowedRoles={["specialist", "admin", "super_admin"]}
              redirectTo="/profile"
            >
              <SpecialistDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SpecialistOverviewPage />} />
          <Route path="appointments" element={<SpecialistAppointmentsPage />} />
          <Route path="profile" element={<SpecialistProfilePage />} />
        </Route>

        {/* ═══════ Admin ═══════ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "super_admin"]}
              redirectTo="/"
            >
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="appointments" element={<AdminAppointments />} />

          <Route element={<RequireSuperAdmin />}>
            <Route path="admins" element={<AdminAdmins />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
