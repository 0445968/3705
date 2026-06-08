import { supabase } from '@/lib/supabase/client';

export type Contact = {
  id: string;
  org_id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  company?: string | null;
  created_at: string;
  updated_at: string;
};

export async function getContacts(orgId: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Contact[];
}

export async function getContact(id: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function createContact(input: Partial<Contact>) {
  const { data, error } = await supabase
    .from('contacts')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function updateContact(id: string, updates: Partial<Contact>) {
  const { data, error } = await supabase
    .from('contacts')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function deleteContact(id: string) {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
  return true;
}