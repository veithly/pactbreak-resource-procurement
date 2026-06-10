# UI Mockup Manifest

## Source Truth
- PRD: `pitch/project_prd.md` § 9-11
- UIUX plan: `pitch/uiux_interaction_plan.md`
- GPT Pro visual review: `pitch/gpt-pro/responses/visual/01-visual-antisameness-response.md`
- Product context: `PRODUCT.md`
- Design context: `DESIGN.md`

## Mockups
| PNG | SVG Source | Route | PRD Section | User Case | Visual Lane | Prompt | Tool / Generator | QA Notes |
|---|---|---|---|---|---|---|---|---|
| `docs/ui-mockups/01-hero-frame.png` | `docs/ui-mockups/01-hero-frame.svg` | `/` | § 9, § 11 | UC-001 HERO PATH | operational-dashboard | `docs/ui-mockups/prompts/01-hero-frame.md` | hand-authored SVG rendered to PNG | V0 anchor only. Implementation must add explicit evidence mode, CAW boundary, and proof packet treatment. |
| `docs/ui-mockups/02-app-frame.png` | `docs/ui-mockups/02-app-frame.svg` | `/app/queue` | § 10, § 11 | UC-001 HERO PATH | operational-dashboard | `docs/ui-mockups/prompts/02-app-frame.md` | hand-authored SVG rendered to PNG | Good shell composition, but too card-like. Build must become ledger-first with status rails. |
| `docs/ui-mockups/03-mobile-first-run.png` | `docs/ui-mockups/03-mobile-first-run.svg` | `/app/queue?demo=judge` | § 11 | UC-001 HERO PATH | operational-dashboard | `docs/ui-mockups/prompts/03-mobile-first-run.md` | hand-authored SVG rendered to PNG | Good mobile hierarchy. Add proof drawer CTA and evidence-source labels in implementation. |

## V0 Critique
- Philosophy alignment: 8/10. The mockups show payout mutation but need clearer CAW boundary.
- Hierarchy: 8/10. The blocked row and action are visible, but proof packet must be secondary and explicit.
- Craft: 7/10. Current frames are useful anchors, not final UI. They need custom ledger anatomy and less card grammar.
- Functionality: 8/10. Main action is clear; evidence mode needs persistent labeling.
- Originality: 8/10. Stronger if implementation removes wallet-dashboard signals entirely.

Overall: 39/50. The frames are accepted as build anchors only because GPT Pro's fixes are now contract requirements.
