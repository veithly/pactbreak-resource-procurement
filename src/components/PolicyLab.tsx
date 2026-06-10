"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { DEFAULT_POLICY, evaluateIntent } from "@/lib/policy";

export function PolicyLab() {
  const [amount, setAmount] = useState("0.001");
  const [recipient, setRecipient] = useState("0x1111111111111111111111111111111111111111");
  const [purpose, setPurpose] = useState("security-audit API/data package procurement");

  const decision = useMemo(
    () =>
      evaluateIntent({
        amount: Number(amount),
        recipient,
        purpose,
        policy: DEFAULT_POLICY
      }),
    [amount, recipient, purpose]
  );

  return (
    <div className="shell" style={{ padding: "28px 0 56px" }}>
      <header className="page-header">
        <div>
        <div className="page-kicker">
          <SlidersHorizontal size={18} aria-hidden />
          Policy lab
        </div>
        <h1 className="page-title">Inspect the procurement boundary before money moves</h1>
        </div>
      </header>

      <section className="policy-grid">
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ display: "grid", gap: 14 }}>
            <div className="field">
              <label htmlFor="labAmount">Amount</label>
              <input id="labAmount" aria-label="Policy amount" title="Policy amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="labRecipient">Recipient</label>
              <input id="labRecipient" aria-label="Policy recipient" title="Policy recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} className="mono" />
            </div>
            <div className="field">
              <label htmlFor="labPurpose">Purpose</label>
              <input id="labPurpose" aria-label="Policy purpose" title="Policy purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)} />
            </div>
          </div>
        </div>

        <div className="surface-strong" style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {decision.allowed ? <CheckCircle2 size={20} color="var(--green)" /> : <AlertTriangle size={20} color="var(--red)" />}
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{decision.allowed ? "CAW request can proceed" : "Request must be blocked"}</h2>
          </div>
          <ul style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            {decision.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <div style={{ display: "grid", gap: 8, marginTop: 18 }} data-placeholder-example="policy-examples">
            <div className="row-h mono">chain_in: {DEFAULT_POLICY.chainId}</div>
            <div className="row-h mono">token_in: {DEFAULT_POLICY.tokenId}</div>
            <div className="row-h mono">deny_if.amount_gt: {DEFAULT_POLICY.maxAmount}</div>
            <div className="row-h mono">completion: {DEFAULT_POLICY.approvalWindowHours}h</div>
          </div>
        </div>
      </section>
    </div>
  );
}
