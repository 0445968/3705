// app/api/organizations/slug/[slug]/route.ts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error) {
    return Response.json(null, { status: 404 });
  }

  return Response.json(data);
}