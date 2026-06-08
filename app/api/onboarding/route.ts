import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { slugify } from '@/lib/utils';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 0;

  while (true) {
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;

    if (!data) return slug;

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing organization name' },
        { status: 400 }
      );
    }

    //  generate collision-safe slug
    const slug = await generateUniqueSlug(name);

    //  create organization
    const { data, error } = await supabase
      .from('organizations')
      .insert({
        name,
        slug,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}