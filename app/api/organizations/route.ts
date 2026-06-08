import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ----------------------
// Helper: create supabase client WITH token
// ----------------------
function getSupabaseWithAuth(req: Request) {
  const authHeader = req.headers.get('authorization');

  console.log('AUTH HEADER:', authHeader);

  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

// ----------------------
// GET: fetch orgs
// ----------------------
export async function GET(req: Request) {
  try {
    const supabase = getSupabaseWithAuth(req);

    if (!supabase) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log('USER:', user);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // get org memberships
    const { data, error } = await supabase
      .from('org_members')
      .select(`organizations (*)`)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    const orgs = data.map((row: any) => row.organizations);

    return NextResponse.json(orgs);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// ----------------------
// POST: create org
// ----------------------
export async function POST(req: Request) {
  try {
    const supabase = getSupabaseWithAuth(req);

    if (!supabase) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log('USER:', user);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing name or slug' },
        { status: 400 }
      );
    }

    // 1️⃣ create org
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name,
        slug,
        status: 'pending',
      })
      .select()
      .single();

    if (orgError) {
      console.error('ORG ERROR:', orgError);

      const isDuplicate =
        orgError.code === '23505' ||
        orgError.message.includes('duplicate');

      return NextResponse.json(
        { message: orgError.message },
        { status: isDuplicate ? 409 : 400 }
      );
    }

    // 2️⃣ create membership
    const { error: memberError } = await supabase
      .from('org_members')
      .insert({
        org_id: org.id,
        user_id: user.id,
        role: 'owner',
      });

    if (memberError) {
      console.error('MEMBER ERROR:', memberError);
    }

    return NextResponse.json(org);
  } catch (err: any) {
    console.error('SERVER ERROR:', err);

    return NextResponse.json(
      {
        error: err.message,
        stack: err.stack, // keep for debugging
      },
      { status: 500 }
    );
  }
}