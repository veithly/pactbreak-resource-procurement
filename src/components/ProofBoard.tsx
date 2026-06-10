"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, Import, RefreshCw } from "lucide-react";
import type { PublicDrill } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(json.message ?? "Proof action failed.");
  }
  return json;
}

async function postDrillAction<T>(body: Record<string, unknown>): Promise<T> {
  return postJson<T>("/api/drills", body);
}

export function ProofBoard() {
  const [drills, setDrills] = useState<PublicDrill[]>([]);
  const [evidence, setEvidence] = useState({ pactId: "pact_operator_attested_001", transactionHash: "", auditLogUrl: "", note: "Operator-attested CAW evidence imported for review." });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const drill = drills[0] ?? null;
  const events = useMemo(() => drill?.events.slice(0, 10) ?? [], [drill]);

  async function refresh() {
    const response = await fetch("/api/drills", { cache: "no-store" });
    const json = (await response.json()) as { drills: PublicDrill[] };
    setDrills(json.drills);
  }

  useEffect(() => {
    refresh().catch((error) => setMessage(error.message));
  }, []);

  async function action(label: string, fn: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await fn();
      setMessage(label);
    } catch (error) {
      await refresh().catch(() => undefined);
      setMessage(error instanceof Error ? error.message : "Proof action failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!drill) {
    return <div className="surface" style={{ padding: 18 }} data-placeholder-example="loading-proof">Loading proof board...</div>;
  }

  return (
    <div className="shell" style={{ padding: "28px 0 56px" }} data-visual-lane="operational-dashboard">
      <header className="page-header">
        <div>
          <h1 className="page-title">Procurement proof board</h1>
          <p className="page-lede">Inspect vendor selection, live CAW payment proof, denial evidence, audit counts, imported receipts, and local run trace.</p>
        </div>
        <StatusBadge status={drill.status} />
      </header>

      <section className="surface-strong two-col-grid" data-hero-composition="proof-packet-board" style={{ padding: 18 }}>
        <div>
          <h2 style={{ marginTop: 0 }}>Latest run</h2>
          <div className="surface" style={{ padding: 14, marginBottom: 12 }} data-placeholder-example="latest-run">
            <strong>{drill.title}</strong>
            <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>{drill.riskReason ?? "Waiting for a blocked mutation or CAW-backed procurement proof event."}</p>
          </div>
          <div className="surface" style={{ padding: 14 }} data-placeholder-example="evidence-source">
            <div className="evidence-line"><span className="evidence-label">Evidence source</span><span className="mono evidence-value">{drill.caw.evidenceSource ?? "none"}</span></div>
            <div className="evidence-line"><span className="evidence-label">Signature</span><span className="mono evidence-value">{drill.caw.signatureStatus ?? "not_signed"}</span></div>
            <div className="evidence-line"><span className="evidence-label">Transaction hash</span><span className="mono evidence-value">{drill.caw.transactionHash ?? "none"}</span></div>
            <div className="evidence-line"><span className="evidence-label">Audit log</span><span className="mono evidence-value">{drill.caw.auditLogUrl ?? "none"}</span></div>
          </div>
        </div>

        <div className="surface" style={{ padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Import operator-attested CAW evidence</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <div className="field">
              <label htmlFor="proofPact">Pact ID</label>
              <input id="proofPact" aria-label="Proof pact ID" title="Proof pact ID" value={evidence.pactId} onChange={(event) => setEvidence({ ...evidence, pactId: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="proofTx">Transaction hash</label>
              <input id="proofTx" aria-label="Proof transaction hash" title="Proof transaction hash" value={evidence.transactionHash} onChange={(event) => setEvidence({ ...evidence, transactionHash: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="proofAudit">Audit URL</label>
              <input id="proofAudit" aria-label="Proof audit URL" title="Proof audit URL" value={evidence.auditLogUrl} onChange={(event) => setEvidence({ ...evidence, auditLogUrl: event.target.value })} />
            </div>
            <button className="control-button min-h-12 min-w-12" disabled={busy} data-cta-primary onClick={() => action("Operator-attested evidence imported.", async () => {
              const json = await postDrillAction<{ drill: PublicDrill }>({
                id: drill.id,
                action: "import_evidence",
                ...evidence
              });
              setDrills([json.drill]);
            })}>
              <Import size={18} aria-hidden />
              Import evidence
            </button>
            <button className="control-button min-h-12 min-w-12" disabled={busy} data-next-step-cta onClick={() => action("Audit sync attempted.", async () => {
              const json = await postDrillAction<{ drill: PublicDrill }>({ id: drill.id, action: "caw_audit" });
              setDrills([json.drill]);
            })}>
              <ClipboardCheck size={18} aria-hidden />
              Sync CAW audit
            </button>
            <button className="control-button min-h-12 min-w-12" disabled={busy} onClick={() => refresh()}>
              <RefreshCw size={18} aria-hidden />
              Refresh board
            </button>
          </div>
        </div>
      </section>

      <section className="surface" style={{ marginTop: 16, padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>Run trace</h2>
        {events.map((item) => (
          <div className="timeline-row" key={item.id}>
            <time className="mono" style={{ color: "var(--muted)", fontSize: 13 }}>{new Date(item.at).toLocaleTimeString()}</time>
            <div>
              <strong>{item.message}</strong>
              {item.evidence ? <pre className="mono" style={{ color: "var(--muted)", whiteSpace: "pre-wrap" }}>{JSON.stringify(item.evidence, null, 2)}</pre> : null}
            </div>
          </div>
        ))}
        <Link href={`/app/runs/${drill.id}`} className="control-button primary min-h-12 min-w-12" data-next-step-cta>
          Open full run
        </Link>
      </section>

      {message ? <div role="status" className="toast">{message}</div> : null}
    </div>
  );
}
