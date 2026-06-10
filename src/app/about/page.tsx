import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function AboutPage() {
  return (
    <AppShell>
      <div className="shell" style={{ padding: "28px 0 56px" }}>
        <header style={{ marginBottom: 22 }}>
          <h1 style={{ margin: 0, fontSize: "2rem", letterSpacing: 0 }}>Architecture</h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.55, maxWidth: 760 }}>
            PactBreak Resource Procurement is a narrow Cobo Track prototype: one agent order, one vendor quote table, one CAW Pact boundary, one judge-editable failure path, and one proof board.
          </p>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <div className="surface" style={{ padding: 18 }}>
            <h2 style={{ marginTop: 0 }}>Real backbones</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.55 }}>
              File-backed persistent state for local demo evidence, Cobo Agentic Wallet SDK calls for Pact and transfer execution, and a multi-step procurement workflow.
            </p>
          </div>
          <div className="surface" style={{ padding: 18 }}>
            <h2 style={{ marginTop: 0 }}>CAW boundary</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.55 }}>
              The agent never receives a raw private key. It works only through a pact-scoped API key returned after wallet-owner approval.
            </p>
          </div>
          <div className="surface" style={{ padding: 18 }}>
            <h2 style={{ marginTop: 0 }}>Honest fallback</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.55 }}>
              If CAW credentials are missing, the product records the blocker and lets the operator import real pact or transaction evidence from a separate CAW run.
            </p>
          </div>
        </section>

        <Link className="control-button primary min-h-12 min-w-12" href="/app/queue" style={{ marginTop: 18 }}>
          Start procurement
        </Link>
      </div>
    </AppShell>
  );
}
