import { MapPin, Navigation, Phone, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

const pharmacies = [
  ['Pharmacie Centrale d’Alger', 'Didouche Mourad, Algiers Center', 'Open now'],
  ['Pharmacie El Biar', 'Rue Ali Khodja, El Biar', 'Guard pharmacy'],
  ['Pharmacie Hydra Santé', 'Hydra, Algiers', '24/7 service'],
] as const;

export function PharmaciesPage() {
  return (
    <div className="grid min-h-[calc(100vh-9rem)] overflow-hidden rounded-[2rem] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] lg:grid-cols-[26rem_1fr]">
      <aside className="border-r border-outline-variant/30 bg-surface p-6">
        <h1 className="text-2xl font-semibold text-primary">Pharmacy Finder</h1>
        <div className="mt-5 space-y-3">
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-surface-container-highest/60 px-4">
            <MapPin className="h-5 w-5 text-outline" />
            <select className="w-full bg-transparent font-medium outline-none">
              <option>16 - Algiers</option>
              <option>31 - Oran</option>
            </select>
          </div>
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-surface-container-highest/60 px-4">
            <Search className="h-5 w-5 text-outline" />
            <input className="w-full bg-transparent font-medium outline-none" placeholder="Search pharmacy or medicine..." />
          </div>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto">
          {['Open Now', 'Guard Pharmacy', '24/7 Service'].map((chip) => (
            <span className="whitespace-nowrap rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container" key={chip}>
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {pharmacies.map(([name, address, status]) => (
            <article className="rounded-[2rem] border border-outline-variant/30 bg-white p-5" key={name}>
              <h2 className="text-lg font-semibold">{name}</h2>
              <p className="mt-1 text-sm font-medium text-on-surface-variant">{address}</p>
              <p className="mt-3 text-sm font-bold text-primary">{status}</p>
            </article>
          ))}
        </div>
      </aside>
      <section className="relative flex items-center justify-center overflow-hidden bg-surface-container-low">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(111,122,112,0.18)_1px,transparent_1px),linear-gradient(rgba(111,122,112,0.18)_1px,transparent_1px)] bg-[length:48px_48px]" />
        <div className="relative rounded-[2rem] bg-white/80 p-8 text-center shadow-xl backdrop-blur">
          <Navigation className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-semibold">Algiers Pharmacy Map</h2>
          <p className="mt-2 max-w-sm text-on-surface-variant">
            Prototype-style map area ready for a real map provider.
          </p>
          <Button className="mt-6 rounded-2xl">
            <Phone className="h-5 w-5" />
            Call Selected Pharmacy
          </Button>
        </div>
      </section>
    </div>
  );
}
