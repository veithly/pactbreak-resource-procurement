import type { PactSpecInput } from "@cobo/agentic-wallet";
import type { PolicyDecision, TreasuryDrill, TreasuryPolicy } from "@/lib/types";

export const DEFAULT_POLICY: TreasuryPolicy = {
  chainId: process.env.CAW_CHAIN_ID ?? "SETH",
  tokenId: process.env.CAW_TOKEN_ID ?? "SETH",
  maxAmount: 0.002,
  denylistedRecipients: [
    "0x0000000000000000000000000000000000000000",
    "0xdead00000000000000000000000000000000beef"
  ],
  allowedPurpose: "security-audit API/data package procurement",
  approvalWindowHours: 24
};

export function evaluateIntent(
  input: Pick<TreasuryDrill, "amount" | "recipient" | "purpose" | "policy">
): PolicyDecision {
  const reasons: string[] = [];
  const recipient = input.recipient.toLowerCase();

  if (!/^0x[a-fA-F0-9]{40}$/.test(input.recipient)) {
    reasons.push("Recipient must be a valid EVM address.");
  }

  if (input.amount <= 0) {
    reasons.push("Amount must be greater than zero.");
  }

  if (input.amount > input.policy.maxAmount) {
    reasons.push(
      `Amount ${input.amount} ${input.policy.tokenId} exceeds the pact cap of ${input.policy.maxAmount} ${input.policy.tokenId}.`
    );
  }

  if (input.policy.denylistedRecipients.map((item) => item.toLowerCase()).includes(recipient)) {
    reasons.push("Recipient is on the treasury denylist.");
  }

  if (!input.purpose.toLowerCase().includes("audit")) {
    reasons.push("Purpose no longer matches the approved audit procurement intent.");
  }

  if (reasons.length === 0) {
    return {
      allowed: true,
      severity: "clear",
      reasons: ["Intent fits the pact budget, vendor wallet, token, and procurement purpose boundaries."]
    };
  }

  return {
    allowed: false,
    severity: reasons.some((reason) => reason.includes("exceeds") || reason.includes("denylist"))
      ? "blocked"
      : "warning",
    reasons
  };
}

export function buildCawPactSpec(drill: TreasuryDrill): PactSpecInput {
  return {
    policies: [
      {
      name: "procurement-agent-max-transfer",
        type: "transfer" as const,
        rules: {
          effect: "allow",
          when: {
            chain_in: [drill.policy.chainId],
            token_in: [
              {
                chain_id: drill.policy.chainId,
                token_id: drill.policy.tokenId
              }
            ],
            destination_address_in: [
              {
                chain_id: drill.policy.chainId,
                address: drill.originalRecipient
              }
            ]
          },
          deny_if: {
            amount_gt: String(drill.policy.maxAmount)
          }
        }
      }
    ],
    completion_conditions: [
      {
        type: "time_elapsed" as const,
        threshold: String(drill.policy.approvalWindowHours * 3600)
      }
    ]
  };
}
