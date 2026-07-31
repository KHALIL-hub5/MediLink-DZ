import { Activity, Building2, ShieldCheck, Users } from 'lucide-react';

const metrics = [
  ['Users', '150k+', Users],
  ['Clinics', '500+', Building2],
  ['Approvals', '42', ShieldCheck],
  ['System Health', '99.9%', Activity],
] as const;

export function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin Panel</h1>
      <div className="grid gap-5 md:grid-cols-4">
        {metrics.map(([label, value, Icon]) => (
          <article className="rounded-[2rem] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]" key={label}>
            <Icon className="h-6 w-6 text-primary" />
            <p className="mt-5 text-3xl font-bold">{value}</p>
            <p className="text-sm font-semibold text-on-surface-variant">{label}</p>
          </article>
        ))}
      </div>
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <h2 className="text-2xl font-semibold">Recent Platform Activity</h2>
        <div className="mt-5 space-y-3 font-medium text-on-surface-variant">
          <p>New doctor verification request submitted.</p>
          <p>Pharmacy guard schedule updated for Algiers.</p>
          <p>Appointment volume increased by 12% this week.</p>
        </div>
      </section>
    </div>
  );
}
