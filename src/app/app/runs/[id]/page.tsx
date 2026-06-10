import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { getPublicDrill } from "@/lib/store";

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drill = await getPublicDrill(id);
  if (!drill) notFound();

  return (
    <AppShell>
      <div className="shell" style={{ padding: "28px 0 56px" }}>
        <header className="page-header">
          <div>
            <h1 className="page-title">{drill.title}</h1>
            <p className="page-lede">A refresh-proof record of the current procurement order, selected vendor, and CAW evidence.</p>
            <div data-placeholder-example="timeline-event" />
            <div data-placeholder-example="proof-field" />
            <div data-next-step-cta="back-to-proof" />
          </div>
          <StatusBadge status={drill.status} />
        </header>

        <section className="content-grid">
          <div className="surface" style={{ padding: 18 }}>
            <h2 style={{ marginTop: 0 }}>Procurement intent</h2>
            <div className="evidence-line"><span className="evidence-label">amount</span><span className="mono evidence-value">{drill.amount} {drill.policy.tokenId}</span></div>
            <div className="evidence-line"><span className="evidence-label">recipient</span><span className="mono evidence-value">{drill.recipient}</span></div>
            <div className="evidence-line"><span className="evidence-label">vendor</span><span className="mono evidence-value">{drill.procurement.quotes.find((quote) => quote.id === drill.procurement.selectedQuoteId)?.vendorName ?? "none"}</span></div>
            <div className="evidence-line"><span className="evidence-label">owner</span><span className="mono evidence-value">{drill.ownerId}</span></div>
            <div className="evidence-line"><span className="evidence-label">agent</span><span className="mono evidence-value">{drill.agentId}</span></div>
          </div>
          <div className="surface" style={{ padding: 18 }}>
            <h2 style={{ marginTop: 0 }}>CAW proof</h2>
            <div className="evidence-line"><span className="evidence-label">pact</span><span className="mono evidence-value">{drill.caw.pactId ?? "none"}</span></div>
            <div className="evidence-line"><span className="evidence-label">pact status</span><span className="mono evidence-value">{drill.caw.pactStatus ?? "none"}</span></div>
            <div className="evidence-line"><span className="evidence-label">tx</span><span className="mono evidence-value">{drill.caw.transactionHash ?? "none"}</span></div>
            <div className="evidence-line"><span className="evidence-label">audit</span><span className="mono evidence-value">{drill.caw.auditLogUrl ?? "none"}</span></div>
          </div>
        </section>

        <section className="surface" style={{ marginTop: 16, padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Timeline</h2>
          {drill.events.map((item) => (
            <div className="timeline-row" key={item.id}>
              <time className="mono" style={{ color: "var(--muted)", fontSize: 13 }}>
                {new Date(item.at).toLocaleString()}
              </time>
              <div>
                <strong>{item.message}</strong>
                {item.evidence ? (
                  <pre className="mono" style={{ color: "var(--muted)", whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(item.evidence, null, 2)}
                  </pre>
                ) : null}
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
