import type { DrillStatus } from "@/lib/types";

const statusCopy: Record<DrillStatus, { label: string; color: "green" | "amber" | "red" }> = {
  queued: { label: "queued", color: "amber" },
  quote_selected: { label: "quote selected", color: "green" },
  mutated: { label: "policy clear", color: "green" },
  policy_blocked: { label: "blocked", color: "red" },
  configuration_blocked: { label: "configuration blocked", color: "amber" },
  pact_submitted: { label: "pact submitted", color: "amber" },
  pact_active: { label: "pact active", color: "green" },
  transfer_allowed: { label: "transfer allowed", color: "green" },
  transfer_denied: { label: "transfer denied", color: "red" },
  evidence_imported: { label: "evidence imported", color: "green" }
};

export function StatusBadge({ status }: { status: DrillStatus }) {
  const copy = statusCopy[status] ?? statusCopy.queued;
  return (
    <span className="status-badge">
      <span className={`status-dot ${copy.color}`} />
      {copy.label}
    </span>
  );
}
