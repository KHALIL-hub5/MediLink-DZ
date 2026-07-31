import { Bell, Menu, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

type NavbarProps = {
  onMenuClick?: () => void;
};

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 h-20 bg-surface/70 shadow-[0_4px_20px_rgba(15,23,42,0.05)] backdrop-blur-md">
      <div className="flex h-full items-center gap-3 px-4 md:px-10">
        <Button
          aria-label="Open navigation"
          className="md:hidden"
          onClick={onMenuClick}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="mr-auto">
          <h1 className="text-2xl font-semibold text-primary">Bonjour, Ahmed!</h1>
          <p className="hidden text-xs font-medium text-on-surface-variant sm:block">
            Your next appointment is in 2 hours.
          </p>
        </div>

        <div className="hidden h-11 w-80 items-center gap-3 rounded-full border border-outline-variant/30 bg-surface-container-low px-4 text-on-surface-variant md:flex">
          <Search aria-hidden className="h-4 w-4" />
          <span className="text-sm font-medium">Search doctors, clinics...</span>
        </div>

        <div className="flex items-center gap-2">
          <Button aria-label="Notifications" size="icon" type="button" variant="ghost">
            <Bell className="h-5 w-5" />
          </Button>
          <img
            alt="Ahmed profile"
            className="h-10 w-10 rounded-full border-2 border-primary/20 object-cover"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80"
          />
        </div>
      </div>
    </header>
  );
}
