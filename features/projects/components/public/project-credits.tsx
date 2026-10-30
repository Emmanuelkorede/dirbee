type ProjectCreditsProps = { credits: { label: string; value: string }[] };

export function ProjectCredits({ credits }: ProjectCreditsProps) {
  if (credits.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Credits</h2>
      <dl className="space-y-3">
        {credits.map((credit, index) => (
          <div key={`${credit.label}-${index}`}>
            <dt className="text-xs text-muted-foreground">{credit.label}</dt>
            <dd className="text-sm">{credit.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}