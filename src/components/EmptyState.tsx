import Link from "next/link";

interface EmptyStateProps {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  examples: string[];
}

export function EmptyState({ title, body, ctaHref, ctaLabel, examples }: EmptyStateProps) {
  return (
    <section className="empty-state surface" style={{ padding: 18, display: "grid", gap: 12 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>{title}</h2>
        <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>{body}</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {examples.map((example) => (
          <span key={example} className="kbd" data-placeholder-example={example}>
            {example}
          </span>
        ))}
      </div>
      <Link className="control-button primary min-h-12 min-w-12" href={ctaHref} data-empty-cta data-next-step-cta>
        {ctaLabel}
      </Link>
    </section>
  );
}
