'use client';

import { useState } from 'react';

export default function GetStartedPage() {
  const [intent, setIntent] = useState<'call' | 'demo' | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
  });

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, intent }),
    });

    setLoading(false);

    if (!res.ok) {
      alert('Something went wrong');
      return;
    }

    if (intent === 'demo') {
      // 👉 send them into demo org
      window.location.href = '/demo/dashboard';
    } else {
      alert('We’ll reach out shortly to schedule your call.');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Get Started with Crafterkite
      </h1>

      {!intent && (
        <div className="space-y-4">
          <button
            onClick={() => setIntent('call')}
            className="w-full border p-4 rounded"
          >
            Request a Call
          </button>

          <button
            onClick={() => setIntent('demo')}
            className="w-full border p-4 rounded"
          >
            Explore Demo
          </button>
        </div>
      )}

      {intent && (
        <div className="space-y-4">
          <input
            placeholder="Your name"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            placeholder="Company"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, company: e.target.value })
            }
          />

          <input
            placeholder="Website (optional)"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, website: e.target.value })
            }
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded"
          >
            {loading
              ? 'Submitting...'
              : intent === 'demo'
              ? 'Enter Demo'
              : 'Request Call'}
          </button>
        </div>
      )}
    </div>
  );
}