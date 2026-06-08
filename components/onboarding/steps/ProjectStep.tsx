const services = ['Branding', 'Website', 'Marketing', 'Full Service'];

export default function ProjectStep({ form, update, toggleArray }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {services.map((s) => (
          <button
            key={s}
            onClick={() => toggleArray?.('services', s)}
            className={`chip ${form.services?.includes(s) ? 'active' : ''}`}
          >
            {s}
          </button>
        ))}
      </div>

      <textarea placeholder="Describe your project" value={form.projectDescription || ''} onChange={(e) => update('projectDescription', e.target.value)} className="input" />

      <select value={form.budget || ''} onChange={(e) => update('budget', e.target.value)} className="input">
        <option value="">Select budget</option>
        <option>$1k–$5k</option>
        <option>$5k–$10k</option>
        <option>$10k+</option>
      </select>
    </div>
  );
}