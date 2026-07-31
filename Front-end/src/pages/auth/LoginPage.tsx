import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const normalizedEmail = email.trim();

  const isEmailEmpty = normalizedEmail.length === 0;

  const isEmailFormatValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  const isEmailValid =
    !isEmailEmpty && isEmailFormatValid;

  const isPasswordEmpty = password.length === 0;

  /*
   * Change this rule if your login system allows
   * passwords shorter than 8 characters.
   */
  const isPasswordLengthValid = password.length >= 8;

  const isPasswordValid =
    !isPasswordEmpty && isPasswordLengthValid;

  const showEmailValidation =
    emailTouched ||
    submitted ||
    email.length > 0;

  const showPasswordValidation =
    passwordTouched ||
    submitted ||
    password.length > 0;

  const showEmailError =
    showEmailValidation && !isEmailValid;

  const showPasswordError =
    showPasswordValidation && !isPasswordValid;

  const canSignIn =
    isEmailValid && isPasswordValid;

  function getEmailErrorMessage(): string {
    if (isEmailEmpty) {
      return 'Email address is required.';
    }

    if (!isEmailFormatValid) {
      return 'Please enter a valid email address.';
    }

    return '';
  }

  function getPasswordErrorMessage(): string {
    if (isPasswordEmpty) {
      return 'Password is required.';
    }

    if (!isPasswordLengthValid) {
      return 'Password must contain at least 8 characters.';
    }

    return '';
  }

  function handleEmailChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setPassword(event.target.value);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitted(true);
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!canSignIn) {
      return;
    }

    /*
     * Replace this section with your real login API request.
     *
     * Example:
     *
     * await login({
     *   email: normalizedEmail,
     *   password,
     *   rememberMe,
     * });
     */

    navigate(ROUTES.dashboard);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-0 md:p-6">
      <section className="flex min-h-screen w-full max-w-[1100px] overflow-hidden bg-white shadow-[0_4px_40px_rgba(0,0,0,0.06)] md:min-h-[700px] md:rounded-[3rem]">
        <div className="relative hidden w-1/2 overflow-hidden bg-primary-container md:block">
          <img
            alt="Modern clinic lobby"
            className="h-full w-full object-cover opacity-80 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
          />

          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <div>
              <h1 className="text-3xl font-bold">
                MediLink DZ
              </h1>

              <p className="mt-4 max-w-sm text-lg font-medium leading-8 opacity-90">
                Connecting Algeria to trusted healthcare,
                powered by digital access and medical
                expertise.
              </p>
            </div>

            <div className="glass-card rounded-[2rem] p-6 text-on-background">
              <div className="mb-3 flex items-center gap-3 font-semibold">
                <ShieldCheck className="h-5 w-5 text-primary" />

                Ministry of Health Approved
              </div>

              <p className="text-sm text-on-surface-variant">
                Secure medical access with privacy at the
                core.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center bg-surface-bright px-4 py-12 md:w-1/2 md:px-20">
          <header className="mb-10">
            <Link
              className="mb-8 block text-center text-2xl font-bold text-primary md:hidden"
              to="/"
            >
              MediLink DZ
            </Link>

            <h2 className="text-3xl font-semibold">
              Welcome back
            </h2>

            <p className="mt-2 font-medium text-on-surface-variant">
              Access your medical dashboard securely
            </p>
          </header>

          <form
            className="space-y-5"
            noValidate
            onSubmit={handleSubmit}
          >
            <div>
              <div className="relative">
                <label
                  className="sr-only"
                  htmlFor="login-email"
                >
                  Email address
                </label>

                <input
                  aria-describedby={
                    showEmailError
                      ? 'login-email-error'
                      : undefined
                  }
                  aria-invalid={showEmailError}
                  autoComplete="email"
                  className={`
                    h-14 w-full rounded-2xl border bg-surface-container
                    px-4 pr-12 font-medium outline-none transition
                    ${
                      isEmailValid
                        ? 'border-primary ring-2 ring-primary/20'
                        : showEmailError
                          ? 'border-destructive ring-2 ring-destructive/20'
                          : 'border-transparent focus:ring-2 focus:ring-primary/20'
                    }
                  `}
                  id="login-email"
                  name="email"
                  onBlur={() => setEmailTouched(true)}
                  onChange={handleEmailChange}
                  placeholder="Email Address"
                  required
                  type="email"
                  value={email}
                />

                {isEmailValid && (
                  <CheckCircle2
                    aria-hidden="true"
                    className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary"
                  />
                )}

                {showEmailError && (
                  <XCircle
                    aria-hidden="true"
                    className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-destructive"
                  />
                )}
              </div>

              {showEmailError && (
                <p
                  className="mt-2 flex items-center gap-2 text-sm font-semibold text-destructive"
                  id="login-email-error"
                  role="alert"
                >
                  <XCircle
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                  />

                  {getEmailErrorMessage()}
                </p>
              )}

              {isEmailValid && (
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                  />

                  Email address is valid.
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <label
                  className="sr-only"
                  htmlFor="login-password"
                >
                  Password
                </label>

                <input
                  aria-describedby={
                    showPasswordError
                      ? 'login-password-error'
                      : undefined
                  }
                  aria-invalid={showPasswordError}
                  autoComplete="current-password"
                  className={`
                    h-14 w-full rounded-2xl border bg-surface-container
                    px-4 pr-20 font-medium outline-none transition
                    ${
                      isPasswordValid
                        ? 'border-primary ring-2 ring-primary/20'
                        : showPasswordError
                          ? 'border-destructive ring-2 ring-destructive/20'
                          : 'border-transparent focus:ring-2 focus:ring-primary/20'
                    }
                  `}
                  id="login-password"
                  minLength={8}
                  name="password"
                  onBlur={() => setPasswordTouched(true)}
                  onChange={handlePasswordChange}
                  placeholder="Password"
                  required
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                />

                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                  {isPasswordValid && (
                    <CheckCircle2
                      aria-hidden="true"
                      className="h-5 w-5 text-primary"
                    />
                  )}

                  {showPasswordError && (
                    <XCircle
                      aria-hidden="true"
                      className="h-5 w-5 text-destructive"
                    />
                  )}

                  <button
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    aria-pressed={showPassword}
                    className="rounded-md text-on-surface-variant transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    onClick={() =>
                      setShowPassword(
                        (currentValue) => !currentValue,
                      )
                    }
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
              </div>

              {showPasswordError && (
                <p
                  className="mt-2 flex items-center gap-2 text-sm font-semibold text-destructive"
                  id="login-password-error"
                  role="alert"
                >
                  <XCircle
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                  />

                  {getPasswordErrorMessage()}
                </p>
              )}

              {isPasswordValid && (
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                  />

                  Password is valid.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm font-semibold">
              <label className="flex cursor-pointer items-center gap-2 text-on-surface-variant">
                <input
                  checked={rememberMe}
                  className="h-5 w-5 rounded border-outline-variant text-primary accent-primary"
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  type="checkbox"
                />

                Remember me
              </label>

              <Link
                className="text-secondary hover:underline"
                to={ROUTES.forgotPassword}
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              className="h-14 w-full rounded-2xl disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canSignIn}
              type="submit"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-semibold text-on-surface-variant">
            New to MediLink DZ?{' '}

            <Link
              className="text-primary hover:underline"
              to={ROUTES.register}
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}