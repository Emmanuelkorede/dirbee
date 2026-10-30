type Row = { label: string; value: string };

export function ProjectDetails({ rows }: { rows: Row[] }) {
  return (
    <dl className="divide-y divide-border border-y border-border">
      {rows.map((row, index) => (
        <div key={`${row.label}-${index}`} className="grid grid-cols-[7rem_1fr] gap-4 py-4 sm:grid-cols-[12rem_1fr]">
          <dt className="pt-0.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">{row.label}</dt>
          <dd className="text-sm sm:text-base">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}