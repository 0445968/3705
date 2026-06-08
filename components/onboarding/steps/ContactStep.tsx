export default function ContactStep({ form, update }: StepProps) {
  return (
    <div className="space-y-4">
      <input placeholder="Full Name" value={form.name || ''} onChange={(e) => update('name', e.target.value)} className="input" />
      <input placeholder="Company Name" value={form.company || ''} onChange={(e) => update('company', e.target.value)} className="input" />
      <input placeholder="Email" value={form.email || ''} onChange={(e) => update('email', e.target.value)} className="input" />
      <input placeholder="Phone" value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} className="input" />
      <input placeholder="Website" value={form.website || ''} onChange={(e) => update('website', e.target.value)} className="input" />
    </div>
  );
}