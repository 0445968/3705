const traits = ['Bold', 'Minimal', 'Luxury', 'Playful', 'Professional'];

export default function PersonalityStep({ form, update, toggleArray }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {traits.map((t) => (
          <button
            key={t}
            onClick={() => toggleArray?.('personality', t)}
            className={`chip ${form.personality?.includes(t) ? 'active' : ''}`}
          >
            {t}
          </button>
        ))}
      </div>

      <input placeholder="Tone (e.g. Friendly, Authoritative)" value={form.tone || ''} onChange={(e) => update('tone', e.target.value)} className="input" />
    </div>
  );
}