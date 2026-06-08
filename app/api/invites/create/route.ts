import { generateInviteToken } from '@/lib/server/invites';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { orgId, email } = await req.json();

  const { rawToken, tokenHash } = generateInviteToken();

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  const { error } = await supabase.from('invites').insert({
    org_id: orgId,
    email,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${rawToken}`;

  return Response.json({ inviteUrl });
}