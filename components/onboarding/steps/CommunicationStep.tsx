export default function CommunicationStep({ form, update }: StepProps) {
  return (
    <div className="space-y-4">
      <input placeholder="Preferred communication (Email, Slack, etc.)" value={form.communication || ''} onChange={(e) => update('communication', e.target.value)} className="input" />
      <input placeholder="Availability" value={form.availability || ''} onChange={(e) => update('availability', e.target.value)} className="input" />
    </div>
  );
}