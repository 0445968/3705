import { notFound, redirect } from 'next/navigation';

async function getOrg(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/organizations/slug/${slug}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgSlug: string };
}) {
  const org = await getOrg(params.orgSlug);

  if (!org) return notFound();

  // 🚨 Block dashboard if not onboarded
  if (org.status === 'pending') {
    redirect(`/${org.slug}/onboarding`);
  }

  return <>{children}</>;
}