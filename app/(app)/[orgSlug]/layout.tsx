import { notFound, redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/server/supabase';

// -----------------------------
// Fetch org by slug
// -----------------------------
async function getOrg(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/organizations/slug/${slug}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return null;
  return res.json();
}

// -----------------------------
// Layout
// -----------------------------
export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgSlug: string };
}) {
  // 🔐 1. Require auth
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 🧠 2. Get org (RLS will enforce membership)
  const org = await getOrg(params.orgSlug);

  if (!org) {
    return notFound();
  }

  // 🚨 3. Enforce onboarding flow
  if (org.status === 'pending') {
    redirect(`/invite`); // or your onboarding route
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <h1 className="font-semibold">{org.name}</h1>
        <span className="text-sm text-muted-foreground">
          {org.slug}
        </span>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}