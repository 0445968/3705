'use client';

import { useEffect, useState } from 'react';

import {
  getBrands,
  createBrand,
} from '@/lib/queries/brands';

import { useCurrentOrg } from '@/store/org-store';

import type { Brand } from '@/lib/queries/brands';

export function useBrands() {
  const currentOrg = useCurrentOrg();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadBrands() {
    if (!currentOrg?.id) {
      setBrands([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getBrands(currentOrg.id);

      setBrands(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addBrand(input: Partial<Brand>) {
    if (!currentOrg?.id) return;

    const brand = await createBrand({
      ...input,
      org_id: currentOrg.id,
    });

    setBrands((prev) => [brand, ...prev]);

    return brand;
  }

  useEffect(() => {
    loadBrands();
  }, [currentOrg?.id]);

  return {
    brands,
    loading,

    refreshBrands: loadBrands,
    addBrand,
  };
}