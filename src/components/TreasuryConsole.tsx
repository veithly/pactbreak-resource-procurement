"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileClock,
  Import,
  PackageCheck,
  Play,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShoppingCart,
  WalletCards,
  XCircle
} from "lucide-react";
import type { PolicyDecision, ProcurementQuote, PublicDrill } from "@/lib/types";
import { DensityToggle } from "@/components/DensityToggle";
import { StatusBadge } from "@/components/StatusBadge";

type ApiState = "idle" | "loading";

function formatAmount(value: number, token: string) {
  return `${value.toFixed(3)} ${token}`;
}

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = (await response.json()) as T & { message?: string; error?: unknown };
  if (!response.ok) {
    throw new Error(json.message ?? JSON.stringify(json.error ?? json));
  }
  return json;
}

async function postDrillAction<T>(body: Record<string, unknown>): Promise<T> {
  return postJson<T>("/api/drills", body);
}

function quoteVerdict(quote: ProcurementQuote, cap: number) {
  if (!quote.allowlisted) return "wallet not allowlisted";
  if (quote.price > cap) return "above pact cap";
  return "approved for CAW payment";
}

export function TreasuryConsole() {
  const [drill, setDrill] = useState<PublicDrill | null>(null);
  const [decision, setDecision] = useState<PolicyDecision | null>(null);
  const [evidence, setEvidence] = useState({ pactId: "", transactionHash: "", auditLogUrl: "", note: "" });
  const [inlineNote, setInlineNote] = useState("judge order mutation");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<ApiState>("idle");

  async function refresh() {
    const response = await fetch("/api/drills", { cache: "no-store" });
    const json = (await response.json()) as { drills: PublicDrill[] };
    setDrill(json.drills[0] ?? null);
  }

  useEffect(() => {
    refresh().catch((error) => setMessage(error.message));
  }, []);

  const proofReady = Boolean(drill?.caw.transactionHash || drill?.caw.auditLogUrl || drill?.caw.pactId);
  const cawReady = Boolean(drill?.caw.hasPactScopedKey);
  const selectedQuote = useMemo(() => {
    if (!drill) return null;
    return (
      drill.procurement.quotes.find((quote) => quote.id === drill.procurement.selectedQuoteId) ??
      drill.procurement.quotes[0]
    );
  }, [drill]);
  const eventRows = useMemo(() => drill?.events.slice(0, 8) ?? [], [drill]);

  async function runAction(label: string, action: () => Promise<void>) {
    setBusy("loading");
    setMessage("");
    try {
      await action();
      setMessage(label);
    } catch (error) {
      await refresh().catch(() => undefined);
      setMessage(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusy("idle");
    }
  }

  async function selectQuote(quoteId: string) {
    await runAction("Agent quote decision saved.", async () => {
      const json = await postDrillAction<{ drill: PublicDrill; decision: PolicyDecision }>({
        id: drill?.id,
        action: "select_quote",
        quoteId
      });
      setDrill(json.drill);
      setDecision(json.decision);
    });
  }

  async function mutateOrder(next: { amount: number; recipient: string; label: string }) {
    await runAction(next.label, async () => {
      const json = await postDrillAction<{ drill: PublicDrill; decision: PolicyDecision }>({
        id: drill?.id,
        action: "mutate",
        amount: next.amount,
        recipient: next.recipient
      });
      setDrill(json.drill);
      setDecision(json.decision);
    });
  }

  if (!drill || !selectedQuote) {
    return (
      <div className="shell" style={{ padding: "40px 0" }}>
        <div className="surface" style={{ padding: 24 }} data-placeholder-example="loading-procurement">
          Loading procurement order...
        </div>
      </div>
    );
  }

  const attackAmount = Math.max(selectedQuote.price + 0.004, drill.policy.maxAmount + 0.003);
  const attackRecipient =
    drill.policy.denylistedRecipients.find((address) => address !== "0x0000000000000000000000000000000000000000") ??
    "0xdead00000000000000000000000000000000beef";

  return (
    <div className="shell" style={{ padding: "28px 0 56px" }} data-visual-lane="operational-dashboard">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <ShoppingCart size={18} aria-hidden />
            CAW-bound agent procurement
          </div>
          <h1 className="page-title">RiskOps Agent buys audit data with scoped wallet authority</h1>
          <p className="page-lede">
            Compare vendor quotes, select the approved resource, attach existing live CAW payment proof, then mutate
            price or wallet address to verify the boundary.
          </p>
        </div>
        <div className="action-cluster">
          <DensityToggle />
          <StatusBadge status={drill.status} />
        </div>
      </header>

      <section className="surface-strong procurement-hero" data-hero-composition="agent-procurement-command-table">
        <div className="procurement-mission">
          <div className="toolbar-row">
            <div>
              <strong>{drill.title}</strong>
              <div style={{ color: "var(--muted)", marginTop: 4 }}>{drill.agentName} can spend only inside this CAW Pact boundary.</div>
              <div style={{ color: "var(--muted)", marginTop: 8, fontSize: 13 }}>
                Inline edit note:{" "}
                <span
                  contentEditable={true}
                  suppressContentEditableWarning
                  onBlur={(event) => setInlineNote(event.currentTarget.textContent || "judge order mutation")}
                  className="mono inline-edit"
                >
                  {inlineNote}
                </span>
              </div>
            </div>
            <Link className="control-button min-h-12 min-w-12" href={`/app/runs/${drill.id}`} aria-label="Open run detail">
              <FileClock size={18} aria-hidden />
              Inspect run
            </Link>
          </div>

          <div className="procurement-cards">
            <div className="surface procurement-card" data-placeholder-example="agent-mission">
              <span className="evidence-label">Agent mission</span>
              <strong>{drill.procurement.businessNeed}</strong>
              <p>{drill.procurement.expectedArtifact}</p>
            </div>
            <div className="surface procurement-card" data-placeholder-example="caw-budget">
              <span className="evidence-label">CAW budget</span>
              <strong>{formatAmount(drill.procurement.budget, drill.policy.tokenId)}</strong>
              <p>{drill.procurement.cawRole}</p>
            </div>
            <div className="surface procurement-card" data-placeholder-example="selected-vendor">
              <span className="evidence-label">Selected vendor</span>
              <strong>{selectedQuote.vendorName}</strong>
              <p>{quoteVerdict(selectedQuote, drill.policy.maxAmount)}</p>
            </div>
          </div>

          <div className="agent-log surface">
            <div className="agent-log-header">
              <PackageCheck size={18} aria-hidden />
              <strong>RiskOps Agent decision log</strong>
            </div>
            <ol>
              {drill.procurement.decisionLog.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="procurement-side">
          <h2 style={{ margin: "0 0 14px", fontSize: "1.1rem" }}>Judge attacks</h2>
          <div className="button-stack">
            <button
              className="control-button primary min-h-12 min-w-12"
              disabled={busy === "loading"}
              data-cta-primary
              onClick={() =>
                runAction("Existing live CAW receipt attached.", async () => {
                  const json = await postDrillAction<{ drill: PublicDrill }>({
                    id: drill.id,
                    action: "attach_receipt"
                  });
                  setDrill(json.drill);
                  setDecision({
                    allowed: true,
                    severity: "clear",
                    reasons: ["Existing live CAW allowed-transfer proof is attached as prototype procurement evidence."]
                  });
                })
              }
            >
              <Play size={18} aria-hidden />
              Attach live CAW receipt
            </button>
            <button
              className="control-button danger min-h-12 min-w-12"
              disabled={busy === "loading"}
              onClick={() =>
                mutateOrder({
                  amount: attackAmount,
                  recipient: selectedQuote.walletAddress,
                  label: "Price mutation blocked."
                })
              }
            >
              <ShieldAlert size={18} aria-hidden />
              Raise price above limit
            </button>
            <button
              className="control-button danger min-h-12 min-w-12"
              disabled={busy === "loading"}
              onClick={() =>
                mutateOrder({
                  amount: selectedQuote.price,
                  recipient: attackRecipient,
                  label: "Vendor wallet mutation blocked."
                })
              }
            >
              <XCircle size={18} aria-hidden />
              Replace vendor wallet
            </button>
            <button
              className="control-button min-h-12 min-w-12"
              disabled={busy === "loading"}
              onClick={() => selectQuote("quote-auditmesh")}
              data-next-step-cta
            >
              <RefreshCw size={18} aria-hidden />
              Restore approved order
            </button>
          </div>

          {decision ? (
            <div className="surface" style={{ marginTop: 16, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {decision.allowed ? <CheckCircle2 size={18} color="var(--green)" /> : <AlertTriangle size={18} color="var(--red)" />}
                <strong>{decision.allowed ? "Order stays inside CAW bounds" : "Order blocked before wallet authority"}</strong>
              </div>
              <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "var(--muted)", lineHeight: 1.5 }}>
                {decision.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section className="surface" style={{ marginTop: 16, padding: 18 }}>
        <div className="section-heading-row">
          <div>
            <h2 style={{ margin: 0, fontSize: "1.15rem" }}>Vendor quote table</h2>
            <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>Seeded vendor quotes persist as product state; only the approved resource maps to CAW payment authority.</p>
          </div>
          <span className="mono" style={{ color: "var(--muted)" }}>order {drill.procurement.id}</span>
        </div>
        <div className="table-scroll">
          <table className="ledger-table quote-table">
            <thead>
              <tr>
                <th className="row-h">Vendor</th>
                <th className="row-h">Resource and SLA</th>
                <th className="row-h">Risk</th>
                <th className="row-h">Price</th>
                <th className="row-h">Wallet</th>
                <th className="row-h">Decision</th>
                <th className="row-h">Action</th>
              </tr>
            </thead>
            <tbody>
              {drill.procurement.quotes.map((quote) => {
                const selected = quote.id === drill.procurement.selectedQuoteId;
                const blocked = !quote.allowlisted || quote.price > drill.policy.maxAmount;
                return (
                  <tr key={quote.id} className={selected ? "selected-row" : ""}>
                    <td className="row-h" data-label="Vendor">
                      <strong>{quote.vendorName}</strong>
                    </td>
                    <td className="row-h" data-label="Resource">
                      <span>{quote.resource}</span>
                      <small>{quote.sla}</small>
                    </td>
                    <td className="row-h mono" data-label="Risk">{quote.riskScore}</td>
                    <td className="row-h mono" data-label="Price">{formatAmount(quote.price, quote.tokenId)}</td>
                    <td className="row-h mono" data-label="Wallet">
                      <span className="hash-cell">{quote.walletAddress}</span>
                    </td>
                    <td className="row-h" data-label="Decision">
                      <span className={`quote-chip ${blocked ? "blocked" : "approved"}`}>{quote.reason}</span>
                    </td>
                    <td className="row-h" data-label="Action">
                      <button className="control-button min-h-12 min-w-12" disabled={busy === "loading"} onClick={() => selectQuote(quote.id)}>
                        {selected ? "Selected" : "Use quote"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-grid" style={{ marginTop: 16 }}>
        <div className="surface" style={{ padding: 18 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>CAW execution</h2>
          <div className="button-stack">
            <button className="control-button min-h-12 min-w-12" disabled={busy === "loading"} onClick={() => runAction("Pact submitted.", async () => {
              const json = await postDrillAction<{ drill: PublicDrill }>({ id: drill.id, action: "caw_pact" });
              setDrill(json.drill);
            })}>
              <WalletCards size={18} aria-hidden />
              Submit pact
            </button>
            <button className="control-button min-h-12 min-w-12" disabled={busy === "loading"} onClick={() => runAction("Pact status refreshed.", async () => {
              const json = await postDrillAction<{ drill: PublicDrill }>({ id: drill.id, action: "caw_poll" });
              setDrill(json.drill);
            })}>
              <RefreshCw size={18} aria-hidden />
              Poll approval
            </button>
            <button className="control-button primary min-h-12 min-w-12" disabled={busy === "loading" || !cawReady} onClick={() => runAction("Allowed transfer attempted.", async () => {
              const json = await postDrillAction<{ drill: PublicDrill }>({ id: drill.id, action: "caw_transfer", mode: "allowed" });
              setDrill(json.drill);
            })}>
              <Play size={18} aria-hidden />
              Execute safe transfer
            </button>
            <button className="control-button danger min-h-12 min-w-12" disabled={busy === "loading" || !cawReady} onClick={() => runAction("Denied transfer attempted.", async () => {
              const json = await postDrillAction<{ drill: PublicDrill }>({ id: drill.id, action: "caw_transfer", mode: "denied" });
              setDrill(json.drill);
            })}>
              <ShieldAlert size={18} aria-hidden />
              Ask CAW to block edited transfer
            </button>
          </div>
          <p style={{ color: "var(--muted)", lineHeight: 1.5, marginBottom: 0 }}>
            Live execution stays server-side. Without CAW env values or owner approval, the UI records a configuration blocker instead of a fake receipt.
          </p>
        </div>

        <div className="surface" style={{ padding: 18 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>Proof import</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <div className="field">
              <label htmlFor="pactId">Pact ID</label>
              <input id="pactId" aria-label="Pact ID" title="Pact ID" value={evidence.pactId} onChange={(event) => setEvidence({ ...evidence, pactId: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="txHash">Transaction hash</label>
              <input id="txHash" aria-label="Transaction hash" title="Transaction hash" value={evidence.transactionHash} onChange={(event) => setEvidence({ ...evidence, transactionHash: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="auditLog">Audit log URL</label>
              <input id="auditLog" aria-label="Audit log URL" title="Audit log URL" value={evidence.auditLogUrl} onChange={(event) => setEvidence({ ...evidence, auditLogUrl: event.target.value })} />
            </div>
            <button className="control-button min-h-12 min-w-12" disabled={busy === "loading"} onClick={() => runAction("Evidence imported.", async () => {
              const json = await postDrillAction<{ drill: PublicDrill }>({
                id: drill.id,
                action: "import_evidence",
                ...evidence
              });
              setDrill(json.drill);
            })}>
              <Import size={18} aria-hidden />
              Import CAW receipt
            </button>
          </div>
        </div>

        <div className="surface" style={{ padding: 18 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>Live CAW evidence</h2>
          <div style={{ display: "grid", gap: 10 }} data-next-step-cta>
            <div className="evidence-line">
              <span className="evidence-label">Pact</span>
              <span className="mono evidence-value">{drill.caw.pactId ?? "not submitted"}</span>
            </div>
            <div className="evidence-line">
              <span className="evidence-label">Allowed tx</span>
              <span className="mono evidence-value">{drill.caw.transactionHash ?? "none"}</span>
            </div>
            <div className="evidence-line">
              <span className="evidence-label">Denied code</span>
              <span className="mono evidence-value">{drill.caw.denialCode ?? "none"}</span>
            </div>
            <button className="control-button min-h-12 min-w-12" disabled={busy === "loading"} onClick={() => runAction("Audit log synced.", async () => {
              const json = await postDrillAction<{ drill: PublicDrill }>({ id: drill.id, action: "caw_audit" });
              setDrill(json.drill);
            })}>
              <ClipboardCheck size={18} aria-hidden />
              Sync CAW audit
            </button>
          </div>
          <p style={{ color: proofReady ? "var(--green)" : "var(--muted)", lineHeight: 1.5 }}>
            {proofReady ? "Existing live CAW proof is attached. It is not claimed as a new vendor settlement." : "Attach CAW evidence after a real wallet run."}
          </p>
        </div>
      </section>

      <section className="surface" style={{ marginTop: 16, padding: 18 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>Execution timeline</h2>
        {eventRows.map((item) => (
          <div className="timeline-row" key={item.id}>
            <time className="mono" style={{ color: "var(--muted)", fontSize: 13 }}>
              {new Date(item.at).toLocaleTimeString()}
            </time>
            <div>
              <strong>{item.message}</strong>
              {item.evidence ? (
                <pre className="mono" style={{ margin: "8px 0 0", color: "var(--muted)", whiteSpace: "pre-wrap", fontSize: 12 }}>
                  {JSON.stringify(item.evidence, null, 2)}
                </pre>
              ) : null}
            </div>
          </div>
        ))}
      </section>

      {message ? (
        <div role="status" className="toast">
          {message}
        </div>
      ) : null}
    </div>
  );
}
