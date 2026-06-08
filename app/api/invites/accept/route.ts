import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/server/supabase';

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();

  // 🔐 require auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { token, data } = await req.json();

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // 1) find invite
  const { data: invite } = await supabase
    .from('invites')
    .select('*')
    .eq('token_hash', tokenHash)
    .single();

  if (!invite) {
    return NextResponse.json({ error: 'Invalid invite' }, { status: 400 });
  }

  // 🚨 email must match logged-in user
  if (invite.email.toLowerCase() !== (user.email || '').toLowerCase()) {
    return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
  }

  // 🚨 expired / used
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invite expired' }, { status: 400 });
  }
  if (invite.accepted_at) {
    return NextResponse.json({ error: 'Invite already used' }, { status: 400 });
  }

  // 2) add membership (idempotent)
  await supabase.from('org_members').upsert({
    org_id: invite.org_id,
    user_id: user.id,
    role: invite.role || 'member',
  });

  // 3) save onboarding
  await supabase.from('onboarding').upsert({
    org_id: invite.org_id,
    data,
  });

  // 4) activate org
  await supabase
    .from('organizations')
    .update({ status: 'active' })
    .eq('id', invite.org_id);

  // 5) mark invite used
  await supabase
    .from('invites')
    .update({
      accepted_at: new Date(),
      status: 'accepted',
    })
    .eq('id', invite.id);

  return NextResponse.json({ success: true });
}