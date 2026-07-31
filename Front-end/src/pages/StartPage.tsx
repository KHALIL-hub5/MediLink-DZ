import { motion } from 'framer-motion';
import { ShieldPlus } from 'lucide-react';

const languages = ['EN', 'FR', 'AR'] as const;

export function StartPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#12171c] text-white">
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:14px_14px] p-0 sm:p-6">
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-primary px-8 text-center shadow-2xl sm:min-h-[min(92vh,760px)] sm:max-w-[350px] sm:rounded-[2rem] sm:border-[9px] sm:border-slate-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_42%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(ellipse_at_center,rgba(255,255,255,0.45)_0_12%,transparent_13%)] [background-size:49px_49px]" />

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-soft backdrop-blur"
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ShieldPlus
                aria-hidden
                className="h-12 w-12 fill-white text-white"
                strokeWidth={1.7}
              />
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-7"
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h1 className="text-4xl font-bold tracking-normal sm:text-[2.45rem]">
                MediLink DZ
              </h1>
              <p className="mt-3 text-base font-medium text-white/60">
                Professional Healthcare Network
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 mt-44 w-full max-w-[190px] sm:mt-40">
            <div className="h-1 overflow-hidden rounded-full bg-white/20 shadow-[0_0_16px_rgba(255,255,255,0.35)]">
              <motion.div
                animate={{ x: ['-100%', '115%'] }}
                className="h-full w-2/3 rounded-full bg-white"
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div className="mx-auto mt-8 flex w-fit items-center rounded-full bg-black/15 px-3 py-2 text-xs font-bold text-white/50 backdrop-blur">
              {languages.map((language, index) => (
                <span
                  className={language === 'EN' ? 'text-white' : undefined}
                  key={language}
                >
                  {language}
                  {index < languages.length - 1 && (
                    <span className="mx-3 text-white/25">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
