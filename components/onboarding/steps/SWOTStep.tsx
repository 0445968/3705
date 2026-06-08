export default function SWOTStep({ form, update }: StepProps) {
  return (
    <div className="space-y-4">
      <textarea placeholder="Strengths" value={form.strengths || ''} onChange={(e) => update('strengths', e.target.value)} className="input" />
      <textarea placeholder="Weaknesses" value={form.weaknesses || ''} onChange={(e) => update('weaknesses', e.target.value)} className="input" />
    </div>
  );
}