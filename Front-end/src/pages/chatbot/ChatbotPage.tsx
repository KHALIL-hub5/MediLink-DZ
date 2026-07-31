import { Bot, Send, ShieldAlert, User } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ChatbotPage() {
  return (
    <div className="grid h-[calc(100vh-9rem)] overflow-hidden rounded-[2rem] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] lg:grid-cols-[20rem_1fr]">
      <aside className="hidden border-r border-outline-variant/30 bg-surface-container-low p-6 lg:block">
        <h1 className="text-2xl font-semibold text-primary">AI Health</h1>
        <div className="mt-6 space-y-3">
          {['Symptom Checker', 'Medication Advice', 'Emergency Guidance'].map((item) => (
            <div className="rounded-2xl bg-white p-4 font-semibold text-on-surface-variant" key={item}>
              {item}
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] bg-error-container p-5 text-on-error-container">
          <ShieldAlert className="h-6 w-6" />
          <p className="mt-3 text-sm font-semibold">
            This assistant does not replace emergency medical care.
          </p>
        </div>
      </aside>
      <section className="flex min-h-0 flex-col">
        <header className="border-b border-outline-variant/30 p-5">
          <h2 className="text-2xl font-semibold">MediLink Assistant</h2>
          <p className="text-sm font-medium text-on-surface-variant">
            Calm, guided health support for first steps.
          </p>
        </header>
        <div className="flex-1 space-y-5 overflow-y-auto bg-surface p-6">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-container text-white">
              <Bot className="h-5 w-5" />
            </span>
            <p className="max-w-xl rounded-[2rem] rounded-bl-md bg-white p-4 font-medium shadow-sm">
              Bonjour. Tell me your symptoms, duration, and any medication you
              are taking.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <p className="max-w-xl rounded-[2rem] rounded-br-md bg-primary p-4 font-medium text-white">
              I have a headache and mild fever since yesterday.
            </p>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest">
              <User className="h-5 w-5" />
            </span>
          </div>
        </div>
        <footer className="border-t border-outline-variant/30 p-4">
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-surface-container px-4">
            <input className="w-full bg-transparent font-medium outline-none" placeholder="Type your health question..." />
            <Button size="icon" className="rounded-2xl">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
}
