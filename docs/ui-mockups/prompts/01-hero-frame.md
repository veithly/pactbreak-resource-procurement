# UI Mockup Prompt: Hero Frame

```json
{
  "type": "UI mockup",
  "goal": "Show the 5-second hook and a concrete risky payout blocked before signature.",
  "source": {
    "prd_section": "Project PRD § 9 and § 11",
    "user_case": "UC-001 HERO PATH",
    "route_or_slide": "/"
  },
  "subject": {
    "left": "Hero claim, one primary CTA, short proof-oriented subtitle",
    "right": "Treasury queue incident panel with safe payout, mutated amount, blocked decision"
  },
  "layout": {
    "desktop": "Editorial split hero with wide headline and right-side incident console",
    "mobile": "Single column with action first, then incident panel"
  },
  "style": {
    "visual_lane": "operational-dashboard",
    "palette": ["#121A21", "#18242C", "#EEF4F2", "#6EE7B7", "#F87171", "#F7C948"],
    "typography_or_texture": "clean product sans, monospace evidence fields"
  },
  "constraints": {
    "must_keep": [
      "Try to drain the agent payout. CAW blocks it before signature.",
      "One primary CTA only",
      "Concrete bad payout row",
      "Blocked before signature decision"
    ],
    "avoid": [
      "wallet balance dashboard",
      "AI chat",
      "purple-blue gradients",
      "generic SaaS feature cards",
      "fake tx hash"
    ]
  }
}
```

## QA Notes
The existing frame captures the broad split composition but implementation must add stronger CAW boundary and evidence-mode labels per GPT Pro visual review.
