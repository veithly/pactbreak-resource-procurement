export type DrillStatus =
  | "queued"
  | "quote_selected"
  | "mutated"
  | "policy_blocked"
  | "configuration_blocked"
  | "pact_submitted"
  | "pact_active"
  | "transfer_allowed"
  | "transfer_denied"
  | "evidence_imported";

export type DrillEventType =
  | "created"
  | "quote_selected"
  | "quote_rejected"
  | "procurement_receipt_attached"
  | "mutated"
  | "policy_check"
  | "caw_pact_submitted"
  | "caw_pact_active"
  | "caw_transfer_allowed"
  | "caw_transfer_denied"
  | "caw_audit_synced"
  | "evidence_imported"
  | "configuration_blocked";

export interface DrillEvent {
  id: string;
  type: DrillEventType;
  at: string;
  message: string;
  evidence?: Record<string, string | number | boolean | null>;
}

export interface TreasuryPolicy {
  chainId: string;
  tokenId: string;
  maxAmount: number;
  denylistedRecipients: string[];
  allowedPurpose: string;
  approvalWindowHours: number;
}

export interface CawState {
  pactId?: string;
  pactStatus?: string;
  pactApiKey?: string;
  txId?: string;
  transactionHash?: string;
  requestId?: string;
  statusDisplay?: string;
  denialCode?: string;
  denialReason?: string;
  denialSuggestion?: string;
  auditAllowedCount?: number;
  auditDeniedCount?: number;
  auditLogUrl?: string;
  importedByUser?: boolean;
  evidenceSource?: "none" | "live_caw" | "operator_attested_imported" | "configuration_blocked";
  signatureStatus?: "not_signed" | "owner_gated" | "signed";
}

export interface ProcurementQuote {
  id: string;
  vendorName: string;
  resource: string;
  sla: string;
  riskScore: number;
  walletAddress: string;
  price: number;
  tokenId: string;
  allowlisted: boolean;
  agentDecision: "selected" | "rejected";
  reason: string;
}

export interface ProcurementOrder {
  id: string;
  businessNeed: string;
  expectedArtifact: string;
  budget: number;
  selectedQuoteId: string;
  status: "quote_selected" | "payment_ready" | "receipt_attached" | "mutated_blocked";
  cawRole: string;
  decisionLog: string[];
  quotes: ProcurementQuote[];
}

export interface TreasuryDrill {
  id: string;
  title: string;
  ownerId: string;
  agentId: string;
  agentName: string;
  purpose: string;
  amount: number;
  originalAmount: number;
  recipient: string;
  originalRecipient: string;
  procurement: ProcurementOrder;
  policy: TreasuryPolicy;
  status: DrillStatus;
  riskReason?: string;
  caw: CawState;
  createdAt: string;
  updatedAt: string;
  events: DrillEvent[];
}

export interface PublicDrill extends Omit<TreasuryDrill, "caw"> {
  caw: Omit<CawState, "pactApiKey"> & {
    hasPactScopedKey: boolean;
  };
}

export interface PolicyDecision {
  allowed: boolean;
  severity: "clear" | "warning" | "blocked";
  reasons: string[];
}
