'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [checking, setChecking] = useState(true);

  // 🔥 Check org status on load
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/organizations/slug/${orgSlug}`);

        if (!res.ok) {
          router.replace('/');
          return;
        }

        const org = await res.json();

        // 🚨 If already onboarded → skip this page
        if (org.status === 'active') {
          router.replace(`/${orgSlug}/dashboard`);
          return;
        }

        setChecking(false);
      } catch {
        router.replace('/');
      }
    };

    checkStatus();
  }, [orgSlug, router]);

  const handleSubmit = async () => {
    if (!brandName.trim()) return;

    setLoading(true);

    const res = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug,
        data: { brandName },
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert('Failed to complete onboarding');
      return;
    }

    // 🔥 redirect to dashboard
    router.push(`/${orgSlug}/dashboard`);
  };

  // ⏳ Prevent flicker while checking
  if (checking) {
    return (
      <div className="flex justify-center mt-20 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold">Welcome 👋</h1>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Brand name"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? 'Saving...' : 'Continue'}
      </button>
    </div>
  );
}