import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { listDrills } from "@/lib/store";

export default async function RunsPage() {
  const drills = await listDrills();

  return (
    <AppShell>
      <div className="shell" style={{ padding: "28px 0 56px" }}>
        <header className="page-header">
          <div>
          <h1 className="page-title">Procurement runs</h1>
          <p className="page-lede">Saved quote decisions, CAW attempts, blocked mutations, and imported proof artifacts.</p>
          <div data-placeholder-example="blocked-run" />
          <div data-placeholder-example="imported-proof-run" />
          <div data-next-step-cta="open-run-detail" />
          </div>
        </header>

        <div className="surface run-list">
          {drills.map((drill) => (
            <Link
              key={drill.id}
              href={`/app/runs/${drill.id}`}
              className="row-h run-list-row"
              data-placeholder-example="saved-run"
            >
              <div>
                <strong>{drill.title}</strong>
                <div style={{ color: "var(--muted)", marginTop: 4 }}>{drill.purpose}</div>
              </div>
              <span className="mono">{drill.policy.tokenId}</span>
              <StatusBadge status={drill.status} />
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
