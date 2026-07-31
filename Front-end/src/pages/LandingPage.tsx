import { Link } from 'react-router-dom';
import {
  Bot,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

const heroImage =
  'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1200&q=80';

const features = [
  {
    icon: Search,
    title: 'Find Doctors',
    text: 'Browse verified profiles, reviews, specialties, and available appointment slots.',
  },
  {
    icon: Pill,
    title: 'Locate Pharmacies',
    text: 'Find nearby pharmacies, guard services, and medication availability.',
  },
  {
    icon: Bot,
    title: 'AI Health Assistant',
    text: 'Get guided first-step health support before booking care.',
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-surface text-on-background">
      <header className="fixed inset-x-0 top-0 z-50 h-20 bg-surface/70 shadow-[0_4px_20px_rgba(15,23,42,0.05)] backdrop-blur-md">
        <nav className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 md:px-10">
          <Link className="text-2xl font-bold tracking-normal text-primary" to="/">
            MediLink DZ
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link className="font-semibold text-primary" to={ROUTES.doctors}>
              Find Doctors
            </Link>
            <Link className="font-medium text-on-surface-variant" to={ROUTES.pharmacies}>
              Pharmacies
            </Link>
            <Link className="font-medium text-on-surface-variant" to={ROUTES.chatbot}>
              AI Health
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="rounded-2xl">
              <Link to={ROUTES.appointments}>Book Now</Link>
            </Button>
            <Link className="hidden font-semibold text-primary md:block" to={ROUTES.login}>
              Login
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[860px] max-w-[1280px] items-center gap-12 px-4 pt-28 md:grid-cols-2 md:px-10">
        <div className="space-y-8">
          <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-normal text-on-background md:text-6xl">
            Your health, <span className="text-primary">simplified.</span>
          </h1>
          <p className="max-w-xl text-lg font-medium leading-8 text-on-surface-variant">
            Connecting patients with Algeria&apos;s medical professionals and
            pharmacies in one calm, secure, digital healthcare ecosystem.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild className="h-14 rounded-2xl px-8">
              <Link to={ROUTES.doctors}>
                <Search className="h-5 w-5" />
                Find a Doctor
              </Link>
            </Button>
            <Button
              asChild
              className="h-14 rounded-2xl bg-error-container px-8 text-on-error-container hover:bg-error-container/80"
            >
              <Link to={ROUTES.pharmacies}>
                <MapPin className="h-5 w-5" />
                Emergency
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <img
            alt="Doctor consultation in a bright modern clinic"
            className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl"
            src={heroImage}
          />
          <div className="glass-card absolute -bottom-10 -left-6 hidden rounded-[2rem] p-6 lg:block">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold">Certified Clinics</p>
                <p className="text-sm text-on-surface-variant">
                  500+ verified partners
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 md:grid-cols-3 md:px-10">
          {features.map((feature) => (
            <article
              className="rounded-[2rem] border border-outline-variant/30 bg-white p-8 shadow-[0_4px_20px_rgba(15,23,42,0.05)]"
              key={feature.title}
            >
              <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <feature.icon className="h-8 w-8" />
              </span>
              <h2 className="text-2xl font-semibold">{feature.title}</h2>
              <p className="mt-4 leading-7 text-on-surface-variant">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary py-16 text-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-4 text-center md:grid-cols-4 md:px-10">
          {['150k+ Active Users', '58 Wilayas', '500+ Doctors', '24/7 AI Care'].map(
            (item) => (
              <div key={item}>
                <CheckCircle2 className="mx-auto mb-3 h-7 w-7 opacity-80" />
                <p className="text-2xl font-bold">{item.split(' ')[0]}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-normal opacity-80">
                  {item.split(' ').slice(1).join(' ')}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 px-4 py-20 md:flex-row md:items-center md:px-10">
        <div>
          <Stethoscope className="mb-4 h-10 w-10 text-primary" />
          <h2 className="text-3xl font-bold tracking-normal">
            Healthcare access built for Algeria.
          </h2>
        </div>
        <Button asChild className="h-14 rounded-2xl px-8">
          <Link to={ROUTES.dashboard}>
            <CalendarDays className="h-5 w-5" />
            Open Dashboard
          </Link>
        </Button>
      </section>
    </main>
  );
}
