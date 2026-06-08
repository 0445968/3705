import { supabase } from '@/lib/supabase/client';

export type Brand = {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  website?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export async function getBrands(orgId: string) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Brand[];
}

export async function getBrand(id: string) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Brand;
}

export async function createBrand(input: Partial<Brand>) {
  const { data, error } = await supabase
    .from('brands')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Brand;
}

export async function updateBrand(id: string, updates: Partial<Brand>) {
  const { data, error } = await supabase
    .from('brands')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Brand;
}

export async function deleteBrand(id: string) {
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw error;
  return true;
}