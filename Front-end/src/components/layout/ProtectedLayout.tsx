import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';

export function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to={ROUTES.login} />;
  }

  return (
    <div className="min-h-screen bg-surface md:grid md:grid-cols-[18rem_1fr]">
      <Sidebar open={sidebarOpen} />
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-foreground/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}
      <div className="flex min-h-screen min-w-0 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 md:px-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
