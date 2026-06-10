# Design

## Product
PactBreak Resource Procurement

## Register
product

## Design Anchor
CAW-bound procurement command surface: a dense operational workspace where a judge sees an agent choose a vendor quote, mutates price or wallet address, and opens a proof packet.

## Visual Lane
operational-dashboard

## Scene Sentence
A judge at a hackathon table watches a RiskOps Agent buy audit data, changes the order, and sees the CAW boundary recorded before money moves.

## Color Strategy
Restrained dark operational palette with semantic state colors. The body stays in cool near-black blue-gray. Accent colors are used only for action, warning, denial, success, and CAW/proof state.

### Tokens
```css
:root {
  --bg: oklch(0.17 0.018 238);
  --panel: oklch(0.22 0.022 238);
  --panel-2: oklch(0.26 0.023 238);
  --ink: oklch(0.94 0.012 245);
  --muted: oklch(0.72 0.018 245);
  --line: oklch(0.35 0.025 238);
  --green: oklch(0.78 0.18 155);
  --amber: oklch(0.78 0.16 78);
  --red: oklch(0.68 0.2 29);
  --blue: oklch(0.72 0.14 235);
  --violet: oklch(0.72 0.13 300);
}
```

## Typography
Use Geist or system UI for all interface text. Use SFMono, Cascadia Code, Roboto Mono, or ui-monospace for wallet IDs, hashes, policy codes, API paths, and evidence fields.

Product UI uses fixed rem scales. Route headings should stay compact, usually 2rem or below inside app screens. Hero copy on `/` can be larger, but it must not become a multi-line marketing wall.

## Layout
- Root shell width: `min(1440px, calc(100vw - 32px))`.
- App shell: sidebar plus main content on desktop, one-column stack on mobile.
- Primary app screen: procurement mission and quote table on the left, judge controls and proof state on the right.
- Mobile: mission cards, stacked quote rows, quick attack controls, proof as full-screen sheet.
- Border radius: 8px for panels, controls, and repeated items unless a native component needs a pill.

## Components
- Procurement mission cards.
- Vendor quote table with stable row height.
- Agent decision log.
- Mutation controls for price and vendor wallet.
- Policy status rail with reason codes.
- CAW boundary divider.
- Pact JSON preview.
- Proof packet drawer.
- Run timeline.
- Evidence import form.
- Density toggle.
- Command palette for desktop shortcuts.

Every interactive component needs default, hover, focus, disabled, loading, error, and empty states.

## Motion
Motion vocabulary: subtle product state feedback.

Defaults: 150-250ms ease-out transitions for hover, drawer reveal, row state changes, and status stamps. No page-load choreography. Reduced motion should disable transforms and keep state changes instant or cross-faded.

## Brand System
The production brand pack lives in `public/brand/`:
- `logomark.svg`
- `wordmark.svg`
- `logo-mono.svg`
- `favicon.svg`
- `og.png`

The mark should read as a bounded treasury route or shielded ledger, not a generic wallet. Keep the SVG geometric, low color count, and readable at 32px.

## Source Markers
Top product shell must include `data-visual-lane="operational-dashboard"`. Primary hero/app surface must include `data-hero-composition="agent-procurement-command-table"` or the route-specific equivalent from `pitch/visual-build-contract.md`.

## Bans
- Gradient text.
- Decorative glass cards.
- Emoji as primary glyphs.
- Fake tx hashes.
- "AI-powered", "seamless", "next-generation", "MVP", "demo mode", or "wallet assistant" as visible product copy.
- Nested cards and generic icon-card grids.
