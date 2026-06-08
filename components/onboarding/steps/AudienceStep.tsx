export default function AudienceStep({ form, update }: StepProps) {
  return (
    <textarea
      placeholder="Describe your target audience"
      value={form.audience || ''}
      onChange={(e) => update('audience', e.target.value)}
      className="input"
    />
  );
}