import { CalendarDays, Clock, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';

const upcomingItems = [
  { date: 'Today', title: 'Dr. Merabet', icon: Video },
  { date: 'Tomorrow', title: 'Lab Results', icon: CalendarDays },
  { date: 'Friday', title: 'Dental Check', icon: Clock },
] as const;

export function AppointmentsPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <h1 className="text-3xl font-semibold">Book an Appointment</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {['Speciality', 'Doctor', 'Wilaya', 'Consultation Type'].map((label) => (
            <label key={label}>
              <span className="mb-2 block text-sm font-semibold text-on-surface-variant">{label}</span>
              <select className="h-14 w-full rounded-2xl border-0 bg-surface-container px-4">
                <option>{label}</option>
              </select>
            </label>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {['09:00', '10:30', '14:30', '16:00'].map((time) => (
            <button className="rounded-2xl bg-surface-container-low p-4 font-bold text-primary hover:bg-primary hover:text-white" key={time}>
              {time}
            </button>
          ))}
        </div>
        <Button className="mt-8 h-14 rounded-2xl px-8">Confirm Booking</Button>
      </section>
      <aside className="space-y-5">
        {upcomingItems.map((item) => (
          <article className="glass-card rounded-[2rem] p-5" key={item.title}>
            <item.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
            <p className="text-sm font-medium text-on-surface-variant">{item.date}</p>
          </article>
        ))}
      </aside>
    </div>
  );
}
