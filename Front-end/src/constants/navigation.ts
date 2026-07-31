import {
  Bot,
  CalendarDays,
  FileText,
  LayoutDashboard,
  MapPinned,
  ShieldCheck,
  Search,
  Settings,
  User,
} from 'lucide-react';

import { ROUTES } from '@/constants/routes';

export const mainNavigation = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Doctors', href: ROUTES.doctors, icon: Search },
  { label: 'Appointments', href: ROUTES.appointments, icon: CalendarDays },
  { label: 'Pharmacies', href: ROUTES.pharmacies, icon: MapPinned },
  { label: 'Assistant', href: ROUTES.chatbot, icon: Bot },
  { label: 'Records', href: ROUTES.medicalRecords, icon: FileText },
  { label: 'Profile', href: ROUTES.profile, icon: User },
  { label: 'Settings', href: ROUTES.settings, icon: Settings },
  { label: 'Admin', href: ROUTES.admin, icon: ShieldCheck },
] as const;
