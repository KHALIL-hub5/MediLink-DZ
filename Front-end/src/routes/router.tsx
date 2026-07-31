import { createBrowserRouter } from 'react-router-dom';

import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { ROUTES } from '@/constants/routes';
import { AdminPage } from '@/pages/admin/AdminPage';
import { AppointmentsPage } from '@/pages/appointments/AppointmentsPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ChatbotPage } from '@/pages/chatbot/ChatbotPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { DoctorsPage } from '@/pages/doctors/DoctorsPage';
import { LandingPage } from '@/pages/LandingPage';
import { PrivacyPage } from '@/pages/legal/PrivacyPage';
import { TermsPage } from '@/pages/legal/TermsPage';
import { MedicalRecordsPage } from '@/pages/medical-records/MedicalRecordsPage';
import { PharmaciesPage } from '@/pages/pharmacies/PharmaciesPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettingsPage } from '@/pages/settings/SettingsPage';

export const appRouter = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <LandingPage />,
  },
  {
    path: ROUTES.login,
    element: <LoginPage />,
  },
  {
    path: ROUTES.register,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.forgotPassword,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.terms,
    element: <TermsPage />,
  },
  {
    path: ROUTES.privacy,
    element: <PrivacyPage />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'doctors', element: <DoctorsPage /> },
      { path: 'appointments', element: <AppointmentsPage /> },
      { path: 'pharmacies', element: <PharmaciesPage /> },
      { path: 'chatbot', element: <ChatbotPage /> },
      { path: 'medical-records', element: <MedicalRecordsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'admin', element: <AdminPage /> },
    ],
  },
]);
