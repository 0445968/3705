'use client';

import { useEffect, useState } from 'react';

import {
  getContacts,
  createContact,
} from '@/lib/queries/contacts';

import { useCurrentOrg } from '@/store/org-store';

import type { Contact } from '@/lib/queries/contacts';

export function useContacts() {
  const currentOrg = useCurrentOrg();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadContacts() {
    if (!currentOrg?.id) {
      setContacts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getContacts(currentOrg.id);

      setContacts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addContact(input: Partial<Contact>) {
    if (!currentOrg?.id) return;

    const contact = await createContact({
      ...input,
      org_id: currentOrg.id,
    });

    setContacts((prev) => [contact, ...prev]);

    return contact;
  }

  useEffect(() => {
    loadContacts();
  }, [currentOrg?.id]);

  return {
    contacts,
    loading,

    refreshContacts: loadContacts,
    addContact,
  };
}