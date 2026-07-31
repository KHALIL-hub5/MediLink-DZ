import { NavLink } from 'react-router-dom';

import { BrandLogo } from '@/components/common/BrandLogo';
import { mainNavigation } from '@/constants/navigation';
import { cn } from '@/utils/cn';

type SidebarProps = {
  open?: boolean;
};

export function Sidebar({ open = true }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-72 border-r border-outline-variant/30 bg-surface-container-low px-6 py-6 shadow-soft transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <BrandLogo />

      <nav className="mt-8 grid gap-2">
        {mainNavigation.map((item) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                'flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface',
                isActive && 'scale-[0.98] bg-primary-container text-on-primary-container',
              )
            }
            key={item.href}
            to={item.href}
          >
            <item.icon aria-hidden className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-[1.5rem] bg-surface-container-high/70 p-3">
        <p className="text-sm font-semibold">Dr. Amine Rahmani</p>
        <p className="text-xs font-medium text-on-surface-variant">
          Cardiologist · Algiers
        </p>
      </div>
    </aside>
  );
}
