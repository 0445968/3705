import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSupabaseServerClient } from '@/lib/server/supabase';

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServerClient();

    // 🔐 1. Require auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { token, data } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 400 }
      );
    }

    // 🔐 2. Hash token
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 3. Find invite
    const { data: invite } = await supabase
      .from('invites')
      .select('*')
      .eq('token_hash', tokenHash)
      .single();

    if (!invite) {
      return NextResponse.json(
        { error: 'Invalid invite' },
        { status: 400 }
      );
    }

    // 🚨 Email must match logged-in user
    if (
      invite.email.toLowerCase() !==
      (user.email || '').toLowerCase()
    ) {
      return NextResponse.json(
        { error: 'Email mismatch' },
        { status: 403 }
      );
    }

    // 🚨 Expired
    if (
      invite.expires_at &&
      new Date(invite.expires_at) < new Date()
    ) {
      return NextResponse.json(
        { error: 'Invite expired' },
        { status: 400 }
      );
    }

    // 🚨 Already used
    if (invite.accepted_at) {
      return NextResponse.json(
        { error: 'Invite already used' },
        { status: 400 }
      );
    }

    // 4. Create membership
    await supabase.from('org_members').upsert({
      org_id: invite.org_id,
      user_id: user.id,
      role: invite.role || 'member',
    });

    // 5. Save onboarding data
    await supabase.from('onboarding').upsert({
      org_id: invite.org_id,
      data,
    });

    // 6. Activate org
    await supabase
      .from('organizations')
      .update({ status: 'active' })
      .eq('id', invite.org_id);

    // 7. Mark invite as used
    await supabase
      .from('invites')
      .update({
        accepted_at: new Date(),
        status: 'accepted',
      })
      .eq('id', invite.id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}