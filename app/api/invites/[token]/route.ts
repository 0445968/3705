import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(_: Request, { params }: any) {
  const tokenHash = crypto
    .createHash('sha256')
    .update(params.token)
    .digest('hex');

  const { data, error } = await supabase
    .from('invites')
    .select('*, organizations(*)')
    .eq('token_hash', tokenHash)
    .single();

  if (error || !data) {
    return Response.json({ error: 'Invalid invite' }, { status: 404 });
  }

  // 🚨 Expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return Response.json({ error: 'Invite expired' }, { status: 400 });
  }

  // 🚨 Already used
  if (data.accepted_at) {
    return Response.json({ error: 'Invite already used' }, { status: 400 });
  }

  return Response.json({
    org: data.organizations,
    email: data.email,
  });
}