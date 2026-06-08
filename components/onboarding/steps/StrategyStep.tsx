export default function StrategyStep({ form, update }: StepProps) {
  return (
    <div className="space-y-4">
      <input placeholder="Industry" value={form.industry || ''} onChange={(e) => update('industry', e.target.value)} className="input" />
      <textarea placeholder="Competitors" value={form.competitors || ''} onChange={(e) => update('competitors', e.target.value)} className="input" />
    </div>
  );
}