import { Link } from 'react-router-dom';
import { ArrowLeft, FileCheck2 } from 'lucide-react';

import { ROUTES } from '@/constants/routes';

const terms = [
  'Use MediLink DZ only for lawful healthcare access and account management.',
  'Medical information shown in the platform must not replace emergency care.',
  'Doctors, pharmacies, and professional users must provide accurate credentials.',
  'Users are responsible for keeping login credentials private and secure.',
  'Appointments, records, and pharmacy information depend on partner availability.',
  'MediLink DZ may suspend accounts that misuse the platform or submit false data.',
];

export function TermsPage() {
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

        <FileCheck2 className="h-10 w-10 text-primary" />
        <h1 className="mt-4 text-3xl font-semibold">Terms of Use</h1>
        <p className="mt-3 font-medium leading-7 text-on-surface-variant">
          These draft terms define the expected behavior for using MediLink DZ.
          They should be reviewed by a qualified legal professional before launch.
        </p>

        <div className="mt-8 space-y-4">
          {terms.map((term, index) => (
            <article className="rounded-2xl bg-surface-container-low p-5" key={term}>
              <h2 className="font-semibold">Article {index + 1}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-on-surface-variant">
                {term}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
