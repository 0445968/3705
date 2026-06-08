'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wind, Building2, ArrowRight, Info } from 'lucide-react';

import { useCreateOrganization } from '@/hooks/use-organizations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { slugify, cn } from '@/lib/utils';

// --------------------
// Schema
// --------------------
const createOrgSchema = z.object({
  name: z
    .string()
    .min(1, 'Organization name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name is too long'),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug is too long')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
});

type CreateOrgFormData = z.infer<typeof createOrgSchema>;

export default function CreateOrgPage() {
  const router = useRouter();
  const { mutate: createOrg, isPending } = useCreateOrganization();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
  } = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: '',
      slug: '',
      email: '',
    },
  });

  const orgName = watch('name');

  // Auto-generate slug from name
  useEffect(() => {
    if (orgName) {
      setValue('slug', slugify(orgName), { shouldValidate: false });
    }
  }, [orgName, setValue]);

  // --------------------
  // Submit Logic
  // --------------------
  const onSubmit = (data: CreateOrgFormData) => {
  createOrg(data, {
    onSuccess: async (org: any) => {
      try {
        const res = await fetch('/api/send-onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            orgId: org.id,
            orgName: org.name,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || 'Email failed');
        }

        console.log('Invite URL:', result.inviteUrl);

        toast({
          title: 'Invite ready',
          description: (
            <a href={result.inviteUrl} target="_blank" className="underline">
              Open invite link
            </a>
          ),
        });

        router.push('/dashboard');
      } catch (err) {
        toast({
          title: 'Organization created',
          description:
            'Org was created, but we failed to send the invite email.',
          variant: 'destructive',
        });

        router.push('/dashboard');
      }
    },

    onError: (error) => {
      console.error('🔥 CREATE ORG ERROR:', error);

      const apiError = error as { message?: string; statusCode?: number };

      if (apiError.statusCode === 409) {
        setError('slug', {
          message: 'This slug is already taken. Please choose another.',
        });
      } else {
        toast({
          title: 'Failed to create organization',
          description:
            apiError.message ?? JSON.stringify(error, null, 2),
          variant: 'destructive',
        });
      }
    },
  }); 
};

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      {/* Brand */}
      <div className="mb-12 flex items-center gap-2.5 text-[#390099]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Wind className="h-5 w-5 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight">Crafterkite</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        {/* Icon */}
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Building2 className="h-6 w-6 text-primary" />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Set up your workspace
          </h1>
          <p className="mt-1.5 text-[13.5px] text-muted-foreground leading-relaxed">
            Create an organization and invite your client to begin the brand onboarding process.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[13px] font-medium opacity-70">Organization name</Label>
            <Input
              id="name"
              placeholder="Acme Creative Studio"
              autoFocus
              className={cn(
                'h-10 text-[13.5px]',
                errors.name && 'border-destructive focus-visible:ring-destructive'
              )}
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium opacity-70">Primary Contact Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="client@company.com"
              className={cn(
                'h-10 text-[13.5px]',
                errors.email && 'border-destructive focus-visible:ring-destructive'
              )}
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug" className="text-[13px] font-medium opacity-70">Organization URL</Label>
              <div className="flex items-center gap-1 text-[11.5px] text-muted-foreground opacity-50">
                <Info className="h-3 w-3" />
                <span>Auto-generated</span>
              </div>
            </div>

            <div
              className={cn(
                'flex h-10 w-full items-center rounded-md border border-input bg-transparent text-[13.5px] shadow-sm',
                'focus-within:ring-1 focus-within:ring-ring',
                errors.slug && 'border-destructive focus-within:ring-destructive'
              )}
            >
              <span className="pl-3 pr-1 text-muted-foreground opacity-50">
                app.crafterkite.io/
              </span>
              <input
                id="slug"
                placeholder="acme-creative"
                className="flex-1 bg-transparent pr-3 focus:outline-none"
                {...register('slug')}
              />
            </div>
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          {/* Action Button */}
          <Button
  type="submit"
  className="w-full h-11 gap-2 font-semibold text-[14px]"
  loading={isPending}
>
            {isPending ? (
              'Creating Workspace...'
            ) : (
              <>
                Create & Invite Client
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-[11.5px] text-muted-foreground opacity-50">
          By creating a workspace, you agree to our Terms of Service.
        </p>
      </div>

      {/* Progress */}
      <div className="mt-8 flex items-center gap-2">
        <div className="h-1 w-8 rounded-full bg-primary" />
        <div className="h-1 w-8 rounded-full bg-muted" />
      </div>
      <p className="mt-2 text-[11.5px] font-medium text-muted-foreground opacity-60 uppercase tracking-wider">
        Step 1 of 2 — Org Setup
      </p>
    </div>
  );
}