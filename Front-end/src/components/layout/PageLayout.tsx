import type { PropsWithChildren } from 'react';

type PageLayoutProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

export function PageLayout({ children, description, title }: PageLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
      {(title || description) && (
        <div className="mb-6">
          {title && <h1 className="text-2xl font-semibold">{title}</h1>}
          {description && (
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
