'use client';

export function ProjectPlaceholderPanel({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-2 text-base font-semibold tracking-tight text-foreground">
        {title}
      </h2>

      <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}