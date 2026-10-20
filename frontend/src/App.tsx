import { Routes, Route } from "react-router-dom";
import { Navbar } from "./shared/components/layout/Navbar";
import { Footer } from "./shared/components/layout/Footer";
import { CommandMenu } from "./shared/components/layout/CommandMenu";
import { ScrollProgress } from "./shared/components/layout/ScrollProgress";
import { ScrollToTop } from "./shared/components/ScrollToTop";
import { BackToTop } from "./shared/components/layout/BackToTop";

// ── Home
import HomePage from "./shared/components/Home";

// ── Services
import ServicesPage from "./features/services/pages/ServicesPage";
import ServiceDetailPage from "./features/services/pages/ServiceDetailPage";

// ── Specialists
import SpecialistsPage from "./features/specialists/pages/SpecialistsPage";
import SpecialistDetailPage from "./features/specialists/pages/SpecialistDetailPage";

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
import SpecialistRoute from "./features/specialists/pages/SpecialistRoute";
import SpecialistOverviewPage from "./features/specialists/pages/SpecialistOverviewPage";
import SpecialistAppointmentsPage from "./features/specialists/pages/SpecialistAppointmentsPage";
import SpecialistProfilePage from "./features/specialists/pages/SpecialistProfilePage";

function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <CommandMenu />
      <BackToTop />
      <Routes>
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

        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />

        <Route path="/profile" element={<DashboardLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="avatar" element={<UploadAvatarPage />} />
        </Route>

        <Route
          path="/specialist"
          element={
            <SpecialistRoute>
              <SpecialistDashboardLayout />
            </SpecialistRoute>
          }
        >
          <Route index element={<SpecialistOverviewPage />} />
          <Route path="appointments" element={<SpecialistAppointmentsPage />} />
          <Route path="profile" element={<SpecialistProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
