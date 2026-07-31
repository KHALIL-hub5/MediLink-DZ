import { Download, FileText, QrCode, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function MedicalRecordsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-primary p-8 text-white">
        <QrCode className="h-10 w-10" />
        <h1 className="mt-4 text-3xl font-semibold">Medical Records</h1>
        <p className="mt-2 max-w-2xl font-medium opacity-85">
          Secure patient documents, prescriptions, lab reports, and shareable QR access.
        </p>
      </section>
      <div className="grid gap-5 lg:grid-cols-3">
        {['Blood Test Report', 'Cardiology Visit Summary', 'Prescription History'].map((record) => (
          <article className="rounded-[2rem] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]" key={record}>
            <FileText className="h-7 w-7 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">{record}</h2>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              Updated by MediLink partner clinic.
            </p>
            <Button className="mt-6 rounded-2xl" variant="outline">
              <Download className="h-5 w-5" />
              Download
            </Button>
          </article>
        ))}
      </div>
      <div className="glass-card rounded-[2rem] p-6">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <p className="mt-3 font-medium text-on-surface-variant">
          Access is encrypted and controlled by the patient profile.
        </p>
      </div>
    </div>
  );
}
