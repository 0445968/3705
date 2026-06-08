'use client';

import React, { useState } from 'react';

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;

  services: string[];
  projectDescription: string;
  budget: string;

  hasBrand: string;
  brandLikes: string;
  brandDislikes: string;

  industry: string;
  competitors: string;

  audience: string;

  personality: string[];
  tone: string;

  goals: string;

  colors: string;
  inspiration: string;

  socialLinks: string;

  strengths: string;
  weaknesses: string;

  communication: string;
  availability: string;

  agreed: boolean;
};

const initialData: FormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  website: '',

  services: [],
  projectDescription: '',
  budget: '',

  hasBrand: '',
  brandLikes: '',
  brandDislikes: '',

  industry: '',
  competitors: '',

  audience: '',

  personality: [],
  tone: '',

  goals: '',

  colors: '',
  inspiration: '',

  socialLinks: '',

  strengths: '',
  weaknesses: '',

  communication: '',
  availability: '',

  agreed: false,
};

const steps = [
  'Contact',
  'Project',
  'Brand',
  'Strategy',
  'Audience',
  'Personality',
  'Goals',
  'Visuals',
  'Social',
  'SWOT',
  'Communication',
  'Agreement',
];

export default function CrafterkiteOnboardingForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialData);

  const update = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArray = (field: keyof FormData, value: string) => {
    const arr = form[field] as string[];
    update(
      field,
      arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value]
    );
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const progress = ((step + 1) / steps.length) * 100;

  const submit = () => {
    console.log('FORM DATA:', form);
    alert('Submitted!');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-black rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm mt-2">
          Step {step + 1} of {steps.length} — {steps[step]}
        </p>
      </div>

      {/* Steps */}
      {step === 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
          <input placeholder="Full Name" onChange={(e) => update('name', e.target.value)} className="input" />
          <input placeholder="Company" onChange={(e) => update('company', e.target.value)} className="input" />
          <input placeholder="Email" onChange={(e) => update('email', e.target.value)} className="input" />
          <input placeholder="Phone" onChange={(e) => update('phone', e.target.value)} className="input" />
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Project</h2>

          <div className="flex flex-wrap gap-2">
            {['Branding', 'Website', 'Marketing'].map((s) => (
              <button
                key={s}
                onClick={() => toggleArray('services', s)}
                className={`chip ${form.services.includes(s) ? 'active' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Project description"
            onChange={(e) => update('projectDescription', e.target.value)}
            className="input mt-4"
          />

          <select onChange={(e) => update('budget', e.target.value)} className="input mt-4">
            <option value="">Select budget</option>
            <option>$1k–$5k</option>
            <option>$5k–$10k</option>
            <option>$10k+</option>
          </select>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Branding</h2>

          <select onChange={(e) => update('hasBrand', e.target.value)} className="input">
            <option value="">Do you have branding?</option>
            <option>Yes</option>
            <option>No</option>
          </select>

          <textarea placeholder="What do you like?" onChange={(e) => update('brandLikes', e.target.value)} className="input mt-4"/>
          <textarea placeholder="What do you dislike?" onChange={(e) => update('brandDislikes', e.target.value)} className="input mt-4"/>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Strategy</h2>
          <input placeholder="Industry" onChange={(e) => update('industry', e.target.value)} className="input"/>
          <textarea placeholder="Competitors" onChange={(e) => update('competitors', e.target.value)} className="input mt-4"/>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Audience</h2>
          <textarea placeholder="Describe your audience" onChange={(e) => update('audience', e.target.value)} className="input"/>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Personality</h2>

          <div className="flex flex-wrap gap-2">
            {['Bold', 'Minimal', 'Luxury', 'Playful', 'Professional'].map((p) => (
              <button
                key={p}
                onClick={() => toggleArray('personality', p)}
                className={`chip ${form.personality.includes(p) ? 'active' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>

          <input placeholder="Tone" onChange={(e) => update('tone', e.target.value)} className="input mt-4"/>
        </div>
      )}

      {step === 6 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Goals</h2>
          <textarea placeholder="Business & brand goals" onChange={(e) => update('goals', e.target.value)} className="input"/>
        </div>
      )}

      {step === 7 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Visual Direction</h2>
          <input placeholder="Preferred colors" onChange={(e) => update('colors', e.target.value)} className="input"/>
          <textarea placeholder="Inspiration" onChange={(e) => update('inspiration', e.target.value)} className="input mt-4"/>
        </div>
      )}

      {step === 8 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Social Media</h2>
          <textarea placeholder="Links" onChange={(e) => update('socialLinks', e.target.value)} className="input"/>
        </div>
      )}

      {step === 9 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Strengths & Weaknesses</h2>
          <textarea placeholder="Strengths" onChange={(e) => update('strengths', e.target.value)} className="input"/>
          <textarea placeholder="Weaknesses" onChange={(e) => update('weaknesses', e.target.value)} className="input mt-4"/>
        </div>
      )}

      {step === 10 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Communication</h2>
          <input placeholder="Preferred communication" onChange={(e) => update('communication', e.target.value)} className="input"/>
          <input placeholder="Availability" onChange={(e) => update('availability', e.target.value)} className="input mt-4"/>
        </div>
      )}

      {step === 11 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Agreement</h2>
          <label className="flex gap-2 items-center">
            <input type="checkbox" onChange={(e) => update('agreed', e.target.checked)} />
            I agree to the Statement of Work
          </label>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button onClick={back} disabled={step === 0} className="btn">
          Back
        </button>

        {step === steps.length - 1 ? (
          <button onClick={submit} className="btn-primary">
            Submit
          </button>
        ) : (
          <button onClick={next} className="btn-primary">
            Next
          </button>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-top: 8px;
        }

        .btn {
          padding: 10px 16px;
          border-radius: 8px;
          background: #eee;
        }

        .btn-primary {
          padding: 10px 16px;
          border-radius: 8px;
          background: black;
          color: white;
        }

        .chip {
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid #ccc;
        }

        .chip.active {
          background: black;
          color: white;
        }
      `}</style>
    </div>
  );
}