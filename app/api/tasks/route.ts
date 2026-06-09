import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function GET(req: Request) {
  try {
    const supabase = createServiceClient();
    const { searchParams } = new URL(req.url);

    const orgId = searchParams.get('orgId');
    const projectId = searchParams.get('projectId');
    const subjectId = searchParams.get('subjectId');
    const status = searchParams.get('status');

    if (!orgId) {
      return NextResponse.json({ error: 'Missing orgId' }, { status: 400 });
    }

    let query = supabase
      .from('tasks')
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
      .eq('org_id', orgId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load tasks';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createServiceClient();
    const body = await req.json();

    const orgId = body.org_id;
    const projectId = body.project_id;
    const title = body.title?.trim();

    if (!orgId || !projectId || !title) {
      return NextResponse.json(
        { error: 'Missing org_id, project_id, or title' },
        { status: 400 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, org_id, subject_id')
      .eq('id', projectId)
      .eq('org_id', orgId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Selected project does not belong to this organization' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        org_id: orgId,
        project_id: projectId,
        subject_id: body.subject_id ?? project.subject_id ?? null,

        title,
        description: body.description ?? null,

        status: body.status ?? 'backlog',
        priority: body.priority ?? 'medium',

        assigned_to: body.assigned_to ?? null,
        position: body.position ?? 0,
        due_date: body.due_date || null,

        created_by: body.created_by ?? null,
      })
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
      err instanceof Error ? err.message : 'Failed to create task';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}