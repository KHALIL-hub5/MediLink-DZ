import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

type ResetStep = 'email' | 'code' | 'password' | 'success';

type ValidationRule = {
  label: string;
  valid: boolean;
  showError: boolean;
};

const stepLabels = ['Email', 'Code', 'Password'] as const;

export function ForgotPasswordPage() {
  const [step, setStep] = useState<ResetStep>('email');

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] =
    useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isCodeValid = /^\d{6}$/.test(code);

  const passwordRules = useMemo(
    () => [
      {
        label: 'Between 8 and 64 characters',
        valid: password.length >= 8 && password.length <= 64,
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
        valid: /[0-9]/.test(password),
      },
      {
        label: 'One special character',
        valid: /[^A-Za-z0-9\s]/.test(password),
      },
      {
        label: 'No spaces',
        valid: password.length > 0 && !/\s/.test(password),
      },
    ],
    [password],
  );

  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const canResetPassword = isPasswordValid && passwordsMatch;

  const showPasswordValidation =
    password.length > 0 || passwordTouched || submitted;

  const showConfirmValidation =
    confirmPassword.length > 0 || confirmPasswordTouched || submitted;

  const showPasswordError =
    showPasswordValidation && !isPasswordValid;

  const showConfirmPasswordError =
    showConfirmValidation && !passwordsMatch;

  const passwordValidationRules = useMemo<ValidationRule[]>(
    () => [
      ...passwordRules.map((rule) => ({
        ...rule,
        showError: showPasswordValidation && !rule.valid,
      })),
      {
        label: 'Passwords match',
        valid: passwordsMatch,
        showError: showConfirmValidation && !passwordsMatch,
      },
    ],
    [
      passwordRules,
      passwordsMatch,
      showPasswordValidation,
      showConfirmValidation,
    ],
  );

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (!isEmailValid) {
      return;
    }

    setSubmitted(false);
    setStep('code');
  }

  function handleCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (!isCodeValid) {
      return;
    }

    setSubmitted(false);
    setStep('password');
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (!canResetPassword) {
      return;
    }

    setSubmitted(false);
    setStep('success');
  }

  function handleChangeEmail() {
    setSubmitted(false);
    setCode('');
    setStep('email');
  }

  function getActiveStepIndex(): number {
    switch (step) {
      case 'email':
        return 0;

      case 'code':
        return 1;

      case 'password':
        return 2;

      case 'success':
        return 3;

      default:
        return 0;
    }
  }

  const activeStepIndex = getActiveStepIndex();

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-0 md:p-6">
      <section className="grid min-h-screen w-full max-w-[1080px] overflow-hidden bg-white shadow-[0_4px_40px_rgba(0,0,0,0.06)] md:min-h-[680px] md:rounded-[3rem] lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden bg-primary p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              className="text-3xl font-bold tracking-normal"
              to="/"
            >
              MediLink DZ
            </Link>

            <p className="mt-5 max-w-sm text-lg font-medium leading-8 opacity-90">
              Secure password recovery for your healthcare account.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur">
            <ShieldCheck className="h-8 w-8" />

            <h2 className="mt-4 text-xl font-semibold">
              Protected reset flow
            </h2>

            <p className="mt-2 text-sm font-medium opacity-80">
              In production, the backend sends the verification code
              and stores only secure password hashes.
            </p>
          </div>
        </aside>

        <section className="flex flex-col justify-center px-4 py-10 md:px-16">
          <Link
            className="mb-8 inline-flex w-fit items-center gap-2 font-semibold text-primary"
            to={ROUTES.login}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <div className="mb-8 flex gap-3">
            {stepLabels.map((label, index) => {
              const isDone = index < activeStepIndex;
              const isActive = index === activeStepIndex;

              return (
                <div
                  className={
                    isActive || isDone
                      ? 'h-2 flex-1 rounded-full bg-primary'
                      : 'h-2 flex-1 rounded-full bg-surface-container-highest'
                  }
                  key={label}
                  title={label}
                />
              );
            })}
          </div>

          {step === 'email' && (
            <form
              className="space-y-5"
              noValidate
              onSubmit={handleEmailSubmit}
            >
              <div>
                <Mail className="mb-4 h-10 w-10 text-primary" />

                <h1 className="text-3xl font-semibold">
                  Forgot password?
                </h1>

                <p className="mt-2 font-medium text-on-surface-variant">
                  Enter your account email and we will send a 6-digit
                  reset code.
                </p>
              </div>

              <input
                aria-describedby={
                  submitted && !isEmailValid
                    ? 'email-error'
                    : undefined
                }
                aria-invalid={submitted && !isEmailValid}
                autoComplete="email"
                className="h-14 w-full rounded-2xl border-0 bg-surface-container px-4 font-medium outline-none ring-primary/20 focus:ring-2 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/50"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                required
                type="email"
                value={email}
              />

              {submitted && !isEmailValid && (
                <p
                  className="text-sm font-semibold text-destructive"
                  id="email-error"
                  role="alert"
                >
                  Please enter a valid email address.
                </p>
              )}

              <Button
                className="h-14 w-full rounded-2xl"
                type="submit"
              >
                Send Reset Code
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form
              className="space-y-5"
              noValidate
              onSubmit={handleCodeSubmit}
            >
              <div>
                <KeyRound className="mb-4 h-10 w-10 text-primary" />

                <h1 className="text-3xl font-semibold">
                  Verify code
                </h1>

                <p className="mt-2 font-medium text-on-surface-variant">
                  Enter the 6-digit code sent to {email}.
                </p>
              </div>

              <input
                aria-describedby={
                  submitted && !isCodeValid
                    ? 'code-error'
                    : undefined
                }
                aria-invalid={submitted && !isCodeValid}
                autoComplete="one-time-code"
                className="h-14 w-full rounded-2xl border-0 bg-surface-container px-4 text-center text-xl font-bold tracking-[0.4em] outline-none ring-primary/20 focus:ring-2 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/50"
                inputMode="numeric"
                maxLength={6}
                name="verificationCode"
                onChange={(event) => {
                  const numericValue = event.target.value.replace(
                    /\D/g,
                    '',
                  );

                  setCode(numericValue);
                }}
                pattern="[0-9]{6}"
                placeholder="000000"
                required
                value={code}
              />

              {submitted && !isCodeValid && (
                <p
                  className="text-sm font-semibold text-destructive"
                  id="code-error"
                  role="alert"
                >
                  Reset code must contain exactly 6 numbers.
                </p>
              )}

              <Button
                className="h-14 w-full rounded-2xl"
                type="submit"
              >
                Verify Code
              </Button>

              <button
                className="w-full text-sm font-semibold text-secondary"
                onClick={handleChangeEmail}
                type="button"
              >
                Change email address
              </button>
            </form>
          )}

          {step === 'password' && (
            <form
              className="space-y-5"
              noValidate
              onSubmit={handlePasswordSubmit}
            >
              <div>
                <ShieldCheck className="mb-4 h-10 w-10 text-primary" />

                <h1 className="text-3xl font-semibold">
                  Set new password
                </h1>

                <p className="mt-2 font-medium text-on-surface-variant">
                  Choose a strong password and type it twice.
                </p>
              </div>

              <PasswordInput
                autoComplete="new-password"
                errorId="password-error"
                id="new-password"
                invalid={showPasswordError}
                label="New password"
                onBlur={() => setPasswordTouched(true)}
                onChange={(value) => {
                  setPassword(value);

                  if (submitted) {
                    setSubmitted(false);
                  }
                }}
                placeholder="New password"
                value={password}
              />

              {showPasswordError && (
                <p
                  className="text-sm font-semibold text-destructive"
                  id="password-error"
                  role="alert"
                >
                  Password does not meet all required conditions.
                </p>
              )}

              <PasswordInput
                autoComplete="new-password"
                errorId="confirm-password-error"
                id="confirm-password"
                invalid={showConfirmPasswordError}
                label="Confirm new password"
                onBlur={() => setConfirmPasswordTouched(true)}
                onChange={(value) => {
                  setConfirmPassword(value);

                  if (submitted) {
                    setSubmitted(false);
                  }
                }}
                placeholder="Confirm new password"
                value={confirmPassword}
              />

              {showConfirmPasswordError && (
                <p
                  className="text-sm font-semibold text-destructive"
                  id="confirm-password-error"
                  role="alert"
                >
                  {confirmPassword.length === 0
                    ? 'Please confirm your new password.'
                    : 'Passwords do not match.'}
                </p>
              )}

              <div className="rounded-2xl bg-surface-container-low p-4">
                <p className="mb-3 text-sm font-semibold">
                  Password must contain:
                </p>

                <div className="grid gap-2 text-sm font-medium sm:grid-cols-2">
                  {passwordValidationRules.map((rule) => (
                    <span
                      className={
                        rule.valid
                          ? 'flex items-center gap-2 text-primary'
                          : rule.showError
                            ? 'flex items-center gap-2 text-destructive'
                            : 'flex items-center gap-2 text-on-surface-variant'
                      }
                      key={rule.label}
                    >
                      {rule.valid ? (
                        <CheckCircle2
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0"
                        />
                      ) : (
                        <XCircle
                          aria-hidden="true"
                          className={
                            rule.showError
                              ? 'h-4 w-4 shrink-0 text-destructive'
                              : 'h-4 w-4 shrink-0 text-outline'
                          }
                        />
                      )}

                      {rule.label}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                className="h-14 w-full rounded-2xl disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canResetPassword}
                type="submit"
              >
                Reset Password
              </Button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />

              <h1 className="mt-5 text-3xl font-semibold">
                Password updated
              </h1>

              <p className="mx-auto mt-2 max-w-md font-medium text-on-surface-variant">
                Your password has been reset. You can now sign in with
                your new credentials.
              </p>

              <Button
                asChild
                className="mt-8 h-14 rounded-2xl px-8"
              >
                <Link to={ROUTES.login}>
                  Back to Sign In
                </Link>
              </Button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

type PasswordInputProps = {
  autoComplete: string;
  errorId: string;
  id: string;
  invalid: boolean;
  label: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function PasswordInput({
  autoComplete,
  errorId,
  id,
  invalid,
  label,
  onBlur,
  onChange,
  placeholder,
  value,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>

      <input
        aria-describedby={invalid ? errorId : undefined}
        aria-invalid={invalid}
        autoComplete={autoComplete}
        className="h-14 w-full rounded-2xl border-0 bg-surface-container px-4 pr-14 font-medium outline-none ring-primary/20 focus:ring-2 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/50"
        id={id}
        maxLength={64}
        minLength={8}
        name={id}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        type={showPassword ? 'text' : 'password'}
        value={value}
      />

      <button
        aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
        aria-pressed={showPassword}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md text-on-surface-variant transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        onClick={() => {
          setShowPassword((currentValue) => !currentValue);
        }}
        type="button"
      >
        {showPassword ? (
          <EyeOff
            aria-hidden="true"
            className="h-5 w-5"
          />
        ) : (
          <Eye
            aria-hidden="true"
            className="h-5 w-5"
          />
        )}
      </button>
    </div>
  );
}