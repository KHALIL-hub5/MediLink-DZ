import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Eye,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

const accountTypes = [
  { label: 'Patient', icon: UserRound },
  { label: 'Doctor', icon: Stethoscope },
  { label: 'Pharmacy', icon: Pill },
] as const;

export function RegisterPage() {
  const navigate = useNavigate();
  const [selectedAccountType, setSelectedAccountType] =
    useState<(typeof accountTypes)[number]['label']>('Patient');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const passwordRules = [
    {
      label: 'At least 8 characters',
      valid: password.length >= 8,
    },
    {
      label: 'One uppercase letter',
      valid: /[A-Z]/.test(password),
    },
    {
      label: 'One lowercase letter',
      valid: /[a-z]/.test(password),
    },
    {
      label: 'One number',
      valid: /\d/.test(password),
    },
    {
      label: 'One special character',
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;
  const isPasswordValid = passwordRules.every((rule) => rule.valid);
  const canCreateAccount = isPasswordValid && passwordsMatch;
  const showPasswordError = submitted && !isPasswordValid;
  const showConfirmPasswordError = submitted && !passwordsMatch;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (canCreateAccount) {
      navigate(ROUTES.dashboard);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-0 md:p-6">
      <section className="flex min-h-screen w-full max-w-[1180px] overflow-hidden bg-white shadow-[0_4px_40px_rgba(0,0,0,0.06)] md:min-h-[760px] md:rounded-[3rem]">
        <div className="relative hidden w-[45%] overflow-hidden bg-primary-container lg:block">
          <img
            alt="Healthcare registration desk"
            className="h-full w-full object-cover opacity-80 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=80"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <div>
              <Link className="text-3xl font-bold tracking-normal" to="/">
                MediLink DZ
              </Link>
              <p className="mt-4 max-w-sm text-lg font-medium leading-8 opacity-90">
                Create your secure healthcare account and connect with care
                providers across Algeria.
              </p>
            </div>
            <div className="glass-card rounded-[2rem] p-6 text-on-background">
              <div className="mb-3 flex items-center gap-3 font-semibold">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Privacy-first onboarding
              </div>
              <p className="text-sm text-on-surface-variant">
                Account roles are prepared for patients, doctors, and
                pharmacies.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center bg-surface-bright px-4 py-10 md:px-12 lg:w-[55%] lg:px-20">
          <header className="mb-8">
            <Link
              className="mb-8 block text-center text-2xl font-bold text-primary lg:hidden"
              to="/"
            >
              MediLink DZ
            </Link>
            <h1 className="text-3xl font-semibold">Create your account</h1>
            <p className="mt-2 font-medium text-on-surface-variant">
              Join MediLink DZ as a patient, doctor, or pharmacy partner.
            </p>
          </header>

          <div className="mb-6 grid grid-cols-3 gap-3">
            {accountTypes.map((type) => (
              <button
                aria-pressed={selectedAccountType === type.label}
                className={
                  selectedAccountType === type.label
                    ? 'flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-primary bg-primary/10 font-semibold text-primary transition-colors'
                    : 'flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-outline-variant/40 bg-surface-container-low font-semibold text-on-surface-variant transition-colors hover:border-primary hover:text-primary'
                }
                key={type.label}
                onClick={() => setSelectedAccountType(type.label)}
                type="button"
              >
                <type.icon className="h-5 w-5" />
                <span className="text-sm">{type.label}</span>
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="h-14 rounded-2xl border-0 bg-surface-container px-4 font-medium outline-none ring-primary/20 focus:ring-2"
                placeholder="First name"
                type="text"
              />
              <input
                className="h-14 rounded-2xl border-0 bg-surface-container px-4 font-medium outline-none ring-primary/20 focus:ring-2"
                placeholder="Last name"
                type="text"
              />
            </div>
            <input
              className="h-14 w-full rounded-2xl border-0 bg-surface-container px-4 font-medium outline-none ring-primary/20 focus:ring-2"
              placeholder="Email address"
              type="email"
            />
            <input
              className="h-14 w-full rounded-2xl border-0 bg-surface-container px-4 font-medium outline-none ring-primary/20 focus:ring-2"
              placeholder="Phone number"
              type="tel"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <select className="h-14 rounded-2xl border-0 bg-surface-container px-4 font-medium outline-none ring-primary/20 focus:ring-2">
                <option>Wilaya</option>
                <option>Algiers</option>
                <option>Oran</option>
                <option>Constantine</option>
              </select>
              <div>
                <div className="relative">
                  <input
                    aria-invalid={showPasswordError}
                    className="h-14 w-full rounded-2xl border-0 bg-surface-container px-4 pr-12 font-medium outline-none ring-primary/20 focus:ring-2 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/40"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    type="password"
                    value={password}
                  />
                  <Eye className="absolute right-4 top-4 h-5 w-5 text-on-surface-variant" />
                </div>
                {showPasswordError && (
                  <p className="mt-2 px-1 text-sm font-semibold text-destructive">
                    Password does not respect all required conditions.
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="relative">
                <input
                  aria-invalid={showConfirmPasswordError}
                  className="h-14 w-full rounded-2xl border-0 bg-surface-container px-4 pr-12 font-medium outline-none ring-primary/20 focus:ring-2 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/40"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                />
                <Eye className="absolute right-4 top-4 h-5 w-5 text-on-surface-variant" />
              </div>
              {showConfirmPasswordError && (
                <p className="mt-2 px-1 text-sm font-semibold text-destructive">
                  Passwords do not match.
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-surface-container-low p-4">
              <p className="mb-3 text-sm font-semibold text-on-surface">
                Password must contain:
              </p>
              <div className="grid gap-2 text-sm font-medium text-on-surface-variant sm:grid-cols-2">
                {passwordRules.map((rule) => (
                  <span
                    className={
                      rule.valid
                        ? 'flex items-center gap-2 text-primary'
                        : 'flex items-center gap-2'
                    }
                    key={rule.label}
                  >
                    {rule.valid ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4 text-outline" />
                    )}
                    {rule.label}
                  </span>
                ))}
                <span
                  className={
                    passwordsMatch
                      ? 'flex items-center gap-2 text-primary'
                      : 'flex items-center gap-2'
                  }
                >
                  {passwordsMatch ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4 text-outline" />
                  )}
                  Passwords match
                </span>
              </div>
              {submitted && !canCreateAccount && (
                <p className="mt-3 text-sm font-semibold text-destructive">
                  Please respect all password conditions and confirm the same
                  password twice.
                </p>
              )}
            </div>
            <label className="flex items-start gap-3 text-sm font-medium text-on-surface-variant">
              <input
                className="mt-1 h-5 w-5 rounded border-outline-variant text-primary"
                type="checkbox"
              />
              <span>
                I agree to MediLink DZ{' '}
                <Link
                  className="text-primary hover:underline"
                  to={ROUTES.terms}
                >
                  terms
                </Link>
                ,{' '}
                <Link
                  className="text-primary hover:underline"
                  to={ROUTES.privacy}
                >
                  privacy policy
                </Link>
                , and secure medical data handling.
              </span>
            </label>
            <Button
              className="h-14 w-full rounded-2xl"
              disabled={!canCreateAccount}
              type="submit"
            >
              <Building2 className="h-5 w-5" />
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-on-surface-variant">
            Already have an account?{' '}
            <Link className="text-primary hover:underline" to={ROUTES.login}>
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
