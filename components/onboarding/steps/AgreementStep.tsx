export default function AgreementStep({ form, update }: StepProps) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={form.agreed || false}
        onChange={(e) => update('agreed', e.target.checked)}
      />
      I agree to the Statement of Work
    </label>
  );
}