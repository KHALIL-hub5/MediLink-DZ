import {
  Bot,
  CalendarDays,
  FileText,
  HeartPulse,
  Pill,
  Video,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const stats = [
  ['Appointments', '12', CalendarDays],
  ['Records', '34', FileText],
  ['Pharmacies', '18', Pill],
  ['AI Checks', '07', Bot],
] as const;

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="glass-card rounded-[2rem] p-6 lg:col-span-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <img
              alt="Female doctor"
              className="h-32 w-32 rounded-[1.5rem] object-cover shadow-md"
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80"
            />
            <div className="flex-1">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <span className="rounded-full bg-secondary-container/20 px-3 py-1 text-xs font-bold uppercase tracking-normal text-on-secondary-container">
                    Upcoming Telehealth
                  </span>
                  <h2 className="mt-3 text-3xl font-semibold">Dr. Selima Merabet</h2>
                  <p className="mt-1 font-medium text-on-surface-variant">
                    General Practitioner · Sidi Abdellah Clinic
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="text-3xl font-semibold text-primary">14:30</p>
                  <p className="text-sm text-outline">Today, Oct 24</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="rounded-2xl">
                  <Video className="h-5 w-5" />
                  Join Telehealth
                </Button>
                <Button className="rounded-2xl bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant/30">
                  Reschedule
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-tertiary-container p-6 text-white shadow-lg lg:col-span-4">
          <Bot className="h-9 w-9" />
          <h2 className="mt-6 text-2xl font-semibold">AI Health Assistant</h2>
          <p className="mt-3 text-sm font-medium opacity-85">
            Describe symptoms and get safe guidance before your next visit.
          </p>
          <Button className="mt-8 rounded-2xl bg-white text-tertiary hover:bg-white/90">
            Start Check
          </Button>
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <article className="rounded-[2rem] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]" key={label}>
            <Icon className="h-6 w-6 text-primary" />
            <p className="mt-5 text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm font-semibold text-on-surface-variant">{label}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
          <h2 className="text-2xl font-semibold">Health Summary</h2>
          <div className="mt-6 space-y-4">
            {['Blood pressure stable', 'Lab report ready', 'Prescription refill due'].map((item) => (
              <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low p-4" key={item}>
                <HeartPulse className="h-5 w-5 text-primary" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
          <h2 className="text-2xl font-semibold">Recent Activity</h2>
          <div className="mt-6 space-y-4 text-sm font-medium text-on-surface-variant">
            <p>Appointment confirmed with Dr. Toumi.</p>
            <p>Medical record uploaded by Algiers Clinic.</p>
            <p>Nearby guard pharmacy found in Hydra.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
