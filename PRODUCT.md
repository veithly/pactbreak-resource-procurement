# Product

## Register

product

## Users
Hackathon judges, Cobo sponsor reviewers, technical reviewers, and treasury operators use PactBreak Resource Procurement in a high-pressure evaluation setting. Their job is to test whether an agent can buy a resource under a narrow wallet mandate, then inspect evidence that price or vendor tampering was blocked before signature.

The primary first-run user is a judge with no setup time. They need to reach the procurement console in one click, see vendor quotes, attach existing CAW proof, mutate price or wallet address, see a state change within 60 seconds, and open a proof artifact without connecting a wallet.

## Product Purpose
PactBreak turns agent resource procurement into a visible CAW-bound drill. A RiskOps Agent selects a security-audit API/data package. Deterministic policy and CAW-scoped authority decide whether the order is selected, blocked, owner-gated, transferred, or recorded as a configuration/evidence-import event.

Success means a judge can retell the product in one sentence: "The agent bought audit data, and CAW blocked a changed price or vendor." Every visible claim must map to a run record, quote decision, policy decision, Pact ID, wallet ID, transaction hash, denial record, audit log, configuration blocker, or imported operator-attested evidence.

## Brand Personality
Authoritative, exacting, and calm under pressure.

The product voice should feel like a procurement control room, not a launch page. It uses concrete verbs, short status labels, explicit evidence names, and plain limitations. It avoids hype, vague security language, and claims of live CAW success unless the run has live evidence.

## Anti-references
- Generic wallet dashboard with balances, APY cards, portfolio charts, and soft risk scores.
- AI chat assistant that explains what it might do instead of changing payment state.
- Dark DeFi terminal with decorative neon and no proof artifact.
- SaaS card grid where every section has an icon, heading, and paragraph but no workflow consequence.
- Fake transaction hashes, undisclosed mock success, or "demo mode" copy that weakens trust.
- Full marketplace claims without discovery, fulfillment, dispute, or settlement lifecycle.

## Design Principles
1. Lead with the purchase and the attack. The first screen should show agent quote selection and mutation controls.
2. Make the boundary visible. Quote status, local policy, CAW Pact state, owner approval, and proof evidence need distinct labels and positions.
3. Treat proof as the product. Every important state should leave a durable run trace that survives refresh.
4. Prefer operational density over spectacle. Use tables, rails, drawers, hashes, and status stamps where they help a judge scan.
5. Be honest about missing credentials. Configuration blockers, imported evidence, and existing live CAW proof are valid states, not errors to hide.

## Accessibility & Inclusion
Target WCAG 2.1 AA for contrast and keyboard operation. Status must never rely on color alone; chips need text and reason codes. Touch targets on mobile should be at least 44px. Motion should be limited to state feedback and drawer transitions with reduced-motion alternatives. Long hashes should wrap safely but remain copyable with clear labels.
