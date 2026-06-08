export default function GoalsStep({ form, update }: StepProps) {
  return (
    <textarea
      placeholder="Business & branding goals"
      value={form.goals || ''}
      onChange={(e) => update('goals', e.target.value)}
      className="input"
    />
  );
}