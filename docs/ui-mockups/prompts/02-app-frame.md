# UI Mockup Prompt: App Frame

```json
{
  "type": "UI mockup",
  "goal": "Show the primary product loop where the judge mutates a payout and sees the block.",
  "source": {
    "prd_section": "Project PRD § 10 and § 11",
    "user_case": "UC-001 HERO PATH",
    "route_or_slide": "/app/queue"
  },
  "subject": {
    "navigation": "Compact product shell",
    "center": "Ledger-style treasury queue with payout intent, amount, recipient, rule, and decision",
    "right": "Judge controls for amount, recipient, and mutate action"
  },
  "layout": {
    "desktop": "Sidebar plus ledger and control rail",
    "mobile": "Stacked queue summary, inputs, primary action, proof result"
  },
  "style": {
    "visual_lane": "operational-dashboard",
    "palette": ["#121A21", "#18242C", "#344550", "#EEF4F2", "#F87171", "#6EE7B7"],
    "typography_or_texture": "dense table text, monospace addresses, semantic status stamps"
  },
  "constraints": {
    "must_keep": [
      "payment queue is the primary object",
      "mutate payout action visible without scrolling",
      "blocked result shown as audit stamp",
      "no balance cards"
    ],
    "avoid": [
      "portfolio terminal",
      "risk score chart",
      "equal-weight card grid",
      "decorative glow"
    ]
  }
}
```

## QA Notes
The existing frame proves route composition but is too card-heavy. Implementation must convert the center panel into a ledger-first row with CAW boundary and proof packet link.
