import { Mail, MapPin, Phone, UserRound } from 'lucide-react';

const profileFields = [
  { icon: UserRound, label: 'Full Name', value: 'Ahmed Benali' },
  { icon: Mail, label: 'Email', value: 'ahmed@medilink.dz' },
  { icon: Phone, label: 'Phone', value: '+213 555 000 000' },
  { icon: MapPin, label: 'Wilaya', value: 'Algiers' },
] as const;

export function ProfilePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <aside className="rounded-[2rem] bg-white p-6 text-center shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <img
          alt="Patient profile"
          className="mx-auto h-32 w-32 rounded-full object-cover"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80"
        />
        <h1 className="mt-5 text-2xl font-semibold">Ahmed Benali</h1>
        <p className="font-medium text-on-surface-variant">Patient · Algiers</p>
      </aside>
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <h2 className="text-2xl font-semibold">My Profile</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {profileFields.map((field) => (
            <div className="rounded-2xl bg-surface-container-low p-4" key={field.label}>
              <field.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-semibold text-on-surface-variant">{field.label}</p>
              <p className="font-semibold">{field.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
