export default function VisualStep({ form, update }: StepProps) {
  return (
    <div className="space-y-4">
      <input placeholder="Preferred colors" value={form.colors || ''} onChange={(e) => update('colors', e.target.value)} className="input" />
      <textarea placeholder="Inspiration (brands, sites, etc.)" value={form.inspiration || ''} onChange={(e) => update('inspiration', e.target.value)} className="input" />
    </div>
  );
}