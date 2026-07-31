import { Outlet } from 'react-router-dom';

import { BrandLogo } from '@/components/common/BrandLogo';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-4 shadow-sm">
        <BrandLogo />
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
