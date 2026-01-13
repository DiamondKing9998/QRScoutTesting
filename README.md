# QRScout (FRC 6753 CBA RoboKings Edition)

Modernized QRScout with rebuilt UI, config, and Blue Alliance-powered helpers. This fork keeps the core QR-based workflow but adds scheduling, richer inputs, and easier config management. Credit to FRC2713 for the original QRScout App. Link here: https://github.com/FRC2713/QRScout / https://frc2713.github.io/QRScout/

## Whats New vs Original QRScout
- TBA schedule integration: Fetch event schedules with your API key, cache history, and reuse locally.
- Floating info bar: Shows manual team (left) and schedule-based team for the selected robot slot + match (right); uses the fetched schedule and your API key.
- No hardcoded API keys: All TBA calls require the key you type or have cached from the schedule modal.
- Multi-increment counters: 7 buttons for +18 and -18 to speed up cycle tracking.
- Form layout updates: Commit/Reset row separated; first four columns stay pinned on top.
- New scouting fields: Fuel dropped/missed (auto/teleop), Approx Accuracy slider, merged Endgame/Postmatch section, reordered prematch fields.
- Config editor polish: Same in-browser editor, plus default config upgraded (`config/2026Rebuilt.json`).
- Deployment ready: Vite 6 + gh-pages flow for GitHub Pages.

## Quick Start
1. Prereqs: Node 18+ and npm.
2. Install: `npm install`
3. Dev server: `npm run dev` then open the printed URL.
4. Build: `npm run build`
5. Deploy to GitHub Pages: `npm run deploy` (uses repository Pages settings; served under `/QRScoutTesting/`).

## Using the App
- Load config
  - Use the in-app editor to view/edit the active config.
  - Upload a local JSON or load from URL for team-specific configs.
  - Reset to default to reload `2026Rebuilt.json`; clear the `qrScout` localStorage key if you need a hard reset.
- Schedule viewer (TBA)
  - Open the schedule modal and enter your TBA API key and event ID, then **Fetch Schedule**.
  - The key is stored locally; no keys ship in the repo. History keeps your recent schedules.
  - [Screenshot: Schedule modal with API key input, event ID, fetch + history]
- Floating info bar
  - Left side: manual team number (from the form) with name/logo.
  - Right side: team from the fetched schedule for the chosen robot position + match number.
  - Requires a fetched schedule and your API key for names/logos.
  - [Screenshot: Floating bar showing left manual team and right schedule team]
- Counters
  - Each counter has quick buttons for 1..8 increments.
  - [Screenshot: Counter with 7 buttons]
- Endgame/Postmatch
  - Includes Approx Accuracy slider (EAAcc), offense skill, and fuel tracking fields.
- Commit/Reset
  - **Commit** generates the QR payload for the current form.
  - **Reset** clears fields based on each fields reset behavior (prematch values preserved where configured).

## Config Notes
- Schema-compatible with original QRScout; enhanced defaults live in `config/2026Rebuilt.json`.
- Prematch order: ScouterName, Team#, Match#, Robot (color/pos), startingPos, noshow.
- New field codes (examples): `EAAcc` (Approx Accuracy), `FDA/FMA/FDT/FMT` (fuel dropped/missed auto/teleop).
- Counter inputs now render multiple increment buttons automatically.

## Blue Alliance Key Handling
- All TBA requests read the API key from localStorage (set via the schedule modal).
- If no key is present, TBA lookups are skipped and logos/names fall back to defaults.
- There are **no** hardcoded keys in the repo; each user must supply their own key.

## Troubleshooting
- Missing Approx Accuracy or new fields: Reset to default config or clear the `qrScout` localStorage key and reload.
- Schedule info not showing on the floating bar: Ensure you fetched a schedule and the match/robot position are set.
- Names/logos missing: Confirm your TBA API key is set in the schedule modal.
