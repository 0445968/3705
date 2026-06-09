import Link from 'next/link';
import { Wind } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Wind className="h-6 w-6" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Go to dashboard
          </Link>

          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition hover:bg-accent"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}