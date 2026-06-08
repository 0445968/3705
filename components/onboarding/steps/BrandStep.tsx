export default function BrandStep({ form, update }: StepProps) {
  return (
    <div className="space-y-4">
      <select value={form.hasBrand || ''} onChange={(e) => update('hasBrand', e.target.value)} className="input">
        <option value="">Do you have branding?</option>
        <option>Yes</option>
        <option>No</option>
      </select>

      <textarea placeholder="What do you like?" value={form.brandLikes || ''} onChange={(e) => update('brandLikes', e.target.value)} className="input" />
      <textarea placeholder="What do you dislike?" value={form.brandDislikes || ''} onChange={(e) => update('brandDislikes', e.target.value)} className="input" />
    </div>
  );
}