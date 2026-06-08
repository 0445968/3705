export default function SocialStep({ form, update }: StepProps) {
  return (
    <textarea
      placeholder="Social media links"
      value={form.socialLinks || ''}
      onChange={(e) => update('socialLinks', e.target.value)}
      className="input"
    />
  );
}