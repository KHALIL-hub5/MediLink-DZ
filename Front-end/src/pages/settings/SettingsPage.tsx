export function SettingsPage() {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="mt-8 space-y-4">
        {['Language preferences', 'Notification settings', 'Privacy and security', 'Dark mode ready'].map((item) => (
          <label className="flex items-center justify-between rounded-2xl bg-surface-container-low p-5 font-semibold" key={item}>
            {item}
            <input className="h-5 w-5 rounded border-outline-variant text-primary" type="checkbox" />
          </label>
        ))}
      </div>
    </div>
  );
}
