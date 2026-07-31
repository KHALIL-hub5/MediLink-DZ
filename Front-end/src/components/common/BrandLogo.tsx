import { Stethoscope } from 'lucide-react';

import { cn } from '@/utils/cn';

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-soft">
        <Stethoscope aria-hidden className="h-5 w-5" />
      </span>
      <span className="text-lg font-semibold tracking-normal">MediLink DZ</span>
    </div>
  );
}
