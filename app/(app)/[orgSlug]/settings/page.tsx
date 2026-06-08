// app/(app)/[orgSlug]/settings/page.tsx

export default function SettingsPage({
  params,
}: {
  params: { orgSlug: string };
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Settings</h2>

      <p className="text-sm text-muted-foreground">
        Manage your organization settings for: {params.orgSlug}
      </p>

      {/* Add real settings later */}
    </div>
  );
}