import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function createServiceClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const supabase = createServiceClient();
    const { id } = await context.params;
    const body = await req.json();

    const orgId = body.org_id;

    if (!orgId) {
      return NextResponse.json({ error: 'Missing org_id' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if ('title' in body) updates.title = body.title?.trim();
    if ('description' in body) updates.description = body.description ?? null;
    if ('status' in body) updates.status = body.status ?? 'backlog';
    if ('priority' in body) updates.priority = body.priority ?? 'medium';
    if ('assigned_to' in body) updates.assigned_to = body.assigned_to ?? null;
    if ('position' in body) updates.position = body.position ?? 0;
    if ('due_date' in body) updates.due_date = body.due_date || null;

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('org_id', orgId)
      .select(
        `
        *,
        project:projects (
          id,
          name,
          subject_id
        ),
        subject:subjects (
          id,
          name,
          slug
        )
      `
      )
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to update task';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const supabase = createServiceClient();
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);

    const orgId = searchParams.get('orgId');

    if (!orgId) {
      return NextResponse.json({ error: 'Missing orgId' }, { status: 400 });
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('org_id', orgId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to delete task';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}