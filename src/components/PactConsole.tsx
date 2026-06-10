"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, Play, RefreshCw, ShieldAlert, WalletCards } from "lucide-react";
import type { PublicDrill } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = (await response.json()) as T & { message?: string; drill?: PublicDrill };
  if (!response.ok) {
    throw new Error(json.message ?? "CAW action did not complete.");
  }
  return json;
}

async function postDrillAction<T>(body: Record<string, unknown>): Promise<T> {
  return postJson<T>("/api/drills", body);
}

export function PactConsole() {
  const [drill, setDrill] = useState<PublicDrill | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const response = await fetch("/api/drills", { cache: "no-store" });
    const json = (await response.json()) as { drills: PublicDrill[] };
    setDrill(json.drills[0] ?? null);
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
      setMessage(error instanceof Error ? error.message : "CAW action failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!drill) {
    return <div className="surface" style={{ padding: 18 }} data-placeholder-example="loading-pact">Loading Pact console...</div>;
  }

  const readiness = drill.status === "configuration_blocked" ? "Configuration blocked" : drill.caw.pactId ? "Pact evidence attached" : "Pact not submitted";
  const canTransfer = Boolean(drill.caw.hasPactScopedKey);

  return (
    <div className="shell" style={{ padding: "28px 0 56px" }} data-visual-lane="operational-dashboard">
      <header className="page-header">
        <div>
          <h1 className="page-title">CAW procurement Pact console</h1>
          <p className="page-lede">Submit the scoped Pact, poll owner approval, and execute only the approved resource purchase path.</p>
        </div>
        <StatusBadge status={drill.status} />
      </header>

      <section className="surface-strong" data-hero-composition="caw-boundary-console" style={{ padding: 18, display: "grid", gap: 16 }}>
        <div className="card-grid">
          <div className="surface" style={{ padding: 14 }} data-placeholder-example="readiness">
            <strong>Evidence mode</strong>
            <div style={{ color: "var(--muted)", marginTop: 8 }}>{readiness}</div>
          </div>
          <div className="surface" style={{ padding: 14 }} data-placeholder-example="pact-cap">
            <strong>Pact cap</strong>
            <div className="mono" style={{ color: "var(--muted)", marginTop: 8 }}>{drill.policy.maxAmount} {drill.policy.tokenId}</div>
          </div>
          <div className="surface" style={{ padding: 14 }} data-placeholder-example="signature-status">
            <strong>Signature status</strong>
            <div className="mono" style={{ color: "var(--muted)", marginTop: 8 }}>{drill.caw.signatureStatus ?? "not_signed"}</div>
          </div>
        </div>

        <div className="two-col-grid">
          <div className="surface" style={{ padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Procurement Pact draft</h2>
            <pre className="mono" style={{ whiteSpace: "pre-wrap", color: "var(--muted)", lineHeight: 1.5 }}>
{JSON.stringify({
  chain: drill.policy.chainId,
  token: drill.policy.tokenId,
  maxAmount: drill.policy.maxAmount,
  denylistedRecipients: drill.policy.denylistedRecipients,
  purpose: drill.policy.allowedPurpose,
  selectedVendor: drill.procurement.quotes.find((quote) => quote.id === drill.procurement.selectedQuoteId)?.vendorName,
  maxSpend: `${drill.policy.maxAmount} ${drill.policy.tokenId}`,
  walletId: "AGENT_WALLET_WALLET_ID"
}, null, 2)}
            </pre>
          </div>

          <div className="surface" style={{ padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Actions</h2>
            <div className="button-stack">
              <button className="control-button min-h-12 min-w-12" disabled={busy} data-cta-primary onClick={() => action("Pact submitted.", async () => {
                const json = await postDrillAction<{ drill: PublicDrill }>({ id: drill.id, action: "caw_pact" });
                setDrill(json.drill);
              })}>
                <WalletCards size={18} aria-hidden />
                Submit Pact
              </button>
              <button className="control-button min-h-12 min-w-12" disabled={busy} onClick={() => action("Owner approval polled.", async () => {
                const json = await postDrillAction<{ drill: PublicDrill }>({ id: drill.id, action: "caw_poll" });
                setDrill(json.drill);
              })}>
                <RefreshCw size={18} aria-hidden />
                Poll owner
              </button>
              <button className="control-button primary min-h-12 min-w-12" disabled={busy || !canTransfer} data-next-step-cta onClick={() => action("Safe transfer attempted.", async () => {
                const json = await postDrillAction<{ drill: PublicDrill }>({ id: drill.id, action: "caw_transfer", mode: "allowed" });
                setDrill(json.drill);
              })}>
                <Play size={18} aria-hidden />
                Execute approved purchase
              </button>
              <button className="control-button danger min-h-12 min-w-12" disabled={busy || !canTransfer} onClick={() => action("Edited transfer sent to CAW boundary.", async () => {
                const json = await postDrillAction<{ drill: PublicDrill }>({ id: drill.id, action: "caw_transfer", mode: "denied" });
                setDrill(json.drill);
              })}>
                <ShieldAlert size={18} aria-hidden />
                Test denied transfer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="surface" style={{ marginTop: 16, padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>CAW proof fields</h2>
        <div className="evidence-line"><span className="evidence-label">Pact ID</span><span className="mono evidence-value">{drill.caw.pactId ?? "none"}</span></div>
        <div className="evidence-line"><span className="evidence-label">Pact status</span><span className="mono evidence-value">{drill.caw.pactStatus ?? "none"}</span></div>
        <div className="evidence-line"><span className="evidence-label">Evidence source</span><span className="mono evidence-value">{drill.caw.evidenceSource ?? "none"}</span></div>
      </section>

      {message ? <div role="status" className="toast">{message}</div> : null}
    </div>
  );
}
