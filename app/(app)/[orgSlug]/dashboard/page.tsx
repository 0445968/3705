// app/(app)/[orgSlug]/dashboard/page.tsx

import { headers } from 'next/headers';

async function getOrgFromHeader() {
  const slug = headers().get('x-org-slug');
  return slug;
}

export default async function DashboardPage({
  params,
}: {
  params: { orgSlug: string };
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Dashboard: {params.orgSlug}
      </h2>

      <p className="text-muted-foreground">
        This is your client workspace dashboard.
      </p>
    </div>
  );
}