import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

import { ROUTES } from '@/constants/routes';

const privacyItems = [
  'We collect account details such as name, email, phone number, role, and wilaya.',
  'Medical records and appointment data must be protected with strict access controls.',
  'Users should be able to review, update, and request deletion of their profile data.',
  'Healthcare professionals only access patient data when authorized by workflow rules.',
  'Authentication, audit logs, and encryption should be handled by the backend.',
  'Production privacy language must match Algerian regulations and applicable health data rules.',
];

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-10 md:px-10">
      <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-[0_4px_40px_rgba(0,0,0,0.06)] md:p-10">
        <Link
          className="mb-8 inline-flex items-center gap-2 font-semibold text-primary"
          to={ROUTES.register}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to create account
        </Link>

        <ShieldCheck className="h-10 w-10 text-primary" />
        <h1 className="mt-4 text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-3 font-medium leading-7 text-on-surface-variant">
          This draft privacy page explains how MediLink DZ should communicate
          data handling. It is a frontend placeholder and needs legal validation.
        </p>

        <div className="mt-8 space-y-4">
          {privacyItems.map((item, index) => (
            <article className="rounded-2xl bg-surface-container-low p-5" key={item}>
              <h2 className="font-semibold">Section {index + 1}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-on-surface-variant">
                {item}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
