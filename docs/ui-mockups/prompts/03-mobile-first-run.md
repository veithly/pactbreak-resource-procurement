# UI Mockup Prompt: Mobile First Run

```json
{
  "type": "UI mockup",
  "goal": "Show QR-scanned first run: attack button, blocked row, proof drawer path.",
  "source": {
    "prd_section": "Project PRD § 11",
    "user_case": "UC-001 HERO PATH",
    "route_or_slide": "/app/queue?demo=judge"
  },
  "subject": {
    "top": "Drain drill context",
    "middle": "Security vendor payout, cap, judge edit",
    "action": "Mutate payout",
    "result": "Blocked before signature with reason"
  },
  "layout": {
    "mobile": "Single-column 390x844 composition with 44px+ controls and no hover-only UI"
  },
  "style": {
    "visual_lane": "operational-dashboard",
    "palette": ["#121A21", "#1B2730", "#EEF4F2", "#AAB8BE", "#F87171"],
    "typography_or_texture": "compact product UI, status text plus color"
  },
  "constraints": {
    "must_keep": [
      "attack action visible in first screen",
      "blocked before signature result",
      "proof drawer available after block",
      "touch targets at least 44px"
    ],
    "avoid": [
      "mobile hero fluff",
      "unreadable tables",
      "hover-only controls",
      "tiny status chips"
    ]
  }
}
```

## QA Notes
The existing mobile frame is usable and close to the target. Implementation must add proof drawer CTA and evidence-source labeling after the blocked result.
