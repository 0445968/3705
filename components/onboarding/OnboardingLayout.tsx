'use client';

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import all steps
import ContactStep from '@/components/onboarding/steps/ContactStep';
import ProjectStep from '@/components/onboarding/steps/ProjectStep';
import BrandStep from '@/components/onboarding/steps/BrandStep';
import StrategyStep from '@/components/onboarding/steps/StrategyStep';
import AudienceStep from '@/components/onboarding/steps/AudienceStep';
import PersonalityStep from '@/components/onboarding/steps/PersonalityStep';
import GoalsStep from '@/components/onboarding/steps/GoalsStep';
import VisualStep from '@/components/onboarding/steps/VisualStep';
import SocialStep from '@/components/onboarding/steps/SocialStep';
import SWOTStep from '@/components/onboarding/steps/SWOTStep';
import CommunicationStep from '@/components/onboarding/steps/CommunicationStep';
import AgreementStep from '@/components/onboarding/steps/AgreementStep';
import ReviewStep from '@/components/onboarding/steps/ReviewStep';

// Step config
const steps = [
  { label: 'Contact', component: ContactStep },
  { label: 'Project', component: ProjectStep },
  { label: 'Brand', component: BrandStep },
  { label: 'Strategy', component: StrategyStep },
  { label: 'Audience', component: AudienceStep },
  { label: 'Personality', component: PersonalityStep },
  { label: 'Goals', component: GoalsStep },
  { label: 'Visuals', component: VisualStep },
  { label: 'Social', component: SocialStep },
  { label: 'SWOT', component: SWOTStep },
  { label: 'Communication', component: CommunicationStep },
  { label: 'Agreement', component: AgreementStep },
  { label: 'Review', component: ReviewStep },
];

export default function OnboardingLayout({ orgId }: { orgId?: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<any>({});

  // --- Helpers ---
  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: string, value: string) => {
    const arr = form[key] || [];
    update(
      key,
      arr.includes(value)
        ? arr.filter((v: string) => v !== value)
        : [...arr, value]
    );
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
  const payload = {
    ...form,
    orgId,
  };

  const res = await fetch('/api/onboarding', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    alert('Something went wrong');
    return;
  }

  // redirect after completion
  window.location.href = `/app/${orgId}`;
};

  // --- Autosave ---
  useEffect(() => {
    localStorage.setItem('onboarding-form', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    const saved = localStorage.getItem('onboarding-form');
    if (saved) setForm(JSON.parse(saved));
  }, []);

  const StepComponent = steps[currentStep].component;

  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 border-r bg-card p-6 flex-col">
        <div className="mb-8">
          <h2 className="text-lg font-semibold">Crafterkite</h2>
          <p className="text-sm text-muted-foreground">
            Client Onboarding
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={index}
                onClick={() => setCurrentStep(index)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  className={`h-6 w-6 flex items-center justify-center rounded-full border text-xs
                  ${
                    isCompleted
                      ? 'bg-primary text-white border-primary'
                      : isActive
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    index + 1
                  )}
                </div>

                <span
                  className={`text-sm ${
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto text-xs text-muted-foreground">
          {progress}% complete
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              {steps[currentStep].label}
            </h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Step Content */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <StepComponent
                  form={form}
                  update={update}
                  toggleArray={toggleArray}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={back}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-md border text-sm disabled:opacity-50"
            >
              Back
            </button>

            <button
              onClick={next}
              className="px-4 py-2 rounded-md bg-primary text-white text-sm"
            >
              {currentStep === steps.length - 1
                ? 'Submit'
                : 'Continue'}
            </button>
          </div>
        </div>
      </main>

      {/* Shared styles */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .chip {
          padding: 6px 12px;
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