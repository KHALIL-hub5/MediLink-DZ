import { CalendarDays, MapPin, Search, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';

const doctors = [
  ['Dr. Yassine Toumi', 'Cardiologist', 'Algiers Center', '4.9'],
  ['Dr. Selima Merabet', 'General Practitioner', 'Sidi Abdellah', '4.8'],
  ['Dr. Nadia Ferhat', 'Dermatologist', 'Oran', '4.7'],
] as const;

export function DoctorsPage() {
  return (
    <div className="grid gap-8 md:grid-cols-[18rem_1fr]">
      <aside className="space-y-5">
        <h1 className="text-2xl font-semibold text-primary">Filters</h1>
        <div className="glass-card space-y-5 rounded-[2rem] p-6">
          {['Speciality', 'Wilaya', 'Availability', 'Rating'].map((label) => (
            <label className="block" key={label}>
              <span className="mb-2 block text-sm font-semibold">{label}</span>
              <select className="h-12 w-full rounded-2xl border-outline-variant bg-surface-container-low px-3">
                <option>All {label}</option>
                <option>Algiers</option>
              </select>
            </label>
          ))}
        </div>
      </aside>
      <section>
        <div className="mb-6 rounded-[2rem] bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-surface-container-low px-4">
            <Search className="h-5 w-5 text-outline" />
            <input className="w-full bg-transparent font-medium outline-none" placeholder="Search by doctor, specialty, clinic..." />
          </div>
        </div>
        <div className="space-y-5">
          {doctors.map(([name, specialty, city, rating]) => (
            <article className="rounded-[2rem] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]" key={name}>
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <img
                  alt={name}
                  className="h-24 w-24 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{name}</h2>
                  <p className="font-medium text-on-surface-variant">{specialty}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-on-surface-variant">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{city}</span>
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" />{rating}</span>
                  </div>
                </div>
                <Button className="rounded-2xl">
                  <CalendarDays className="h-5 w-5" />
                  Book Appointment
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
