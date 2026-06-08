'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState('');
  const [org, setOrg] = useState<any>(null);

  useEffect(() => {
    const loadInvite = async () => {
      const res = await fetch(`/api/invites/${token}`);

      if (!res.ok) {
        router.replace('/');
        return;
      }

      const data = await res.json();

      setOrg(data.org);
      setLoading(false);
    };

    loadInvite();
  }, [token, router]);

  const handleSubmit = async () => {
    const res = await fetch('/api/invites/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, data: { brandName } }),
    });

    if (!res.ok) {
      alert('Failed to accept invite');
      return;
    }

    router.push(`/${org.slug}/dashboard`);
  };

  if (loading) return <div className="mt-20 text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold">
        Join {org.name}
      </h1>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Brand name"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2 rounded"
      >
        Accept & Continue
      </button>
    </div>
  );
}