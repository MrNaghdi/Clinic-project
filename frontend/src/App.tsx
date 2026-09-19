import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import VerifyOtpPage from './features/auth/pages/VerifyOtpPage';
import ProfilePage from './features/users/pages/ProfilePage';
import CompleteProfilePage from './features/users/pages/CompleteProfilePage';
import HomePage from './shared/components/Home';

import DashboardLayout from './features/users/pages/DashboardLayout';
import AppointmentsPage from './features/users/pages/AppointmentsPage';
import HistoryPage from './features/users/pages/HistoryPage';
import SettingsPage from './features/users/pages/SettingsPage';
import UploadAvatarPage from './features/users/pages/UploadAvatarPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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
    </Routes>
  );
}

export default App;