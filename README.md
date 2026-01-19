# QRScout (FRC 6753 CBA RoboKings Edition)

Modernized QRScout with rebuilt UI, config, and Blue Alliance-powered helpers. This fork keeps the core QR-based workflow but adds scheduling, richer inputs, and easier config management. Credit to FRC2713 for the original QRScout App. Links to the original app and GitHub repo can be found here:
- https://github.com/FRC2713/QRScout
- https://frc2713.github.io/QRScout/

## What's New vs Original QRScout
- TBA schedule integration: Fetch event schedules with your API key, cache history, and reuse locally.
- Floating info bar: Shows team info for the manual team number input field (left) and the team for the selected robot color/position and match (right) via the qualification schedule associated with your event ID.
- No hardcoded API keys: All TBA calls require the key you type or have cached from the schedule modal.
- Multi-increment counter fields : 8 new buttons for +1 through +8 and -1 through -8 to speed up cycle tracking (since bots can hold up to 8 fuel at once in REBUILT).
- Form layout updates: Commit/Reset row separated; first four columns stay pinned on top (Pregame/Auton/Teleop/Endgame)
- Config editor polish: Same in-browser editor, plus default config upgraded for REBULIT 2026 (`config/2026Rebuilt.json`).
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
  - Open the schedule modal and enter your TBA API read key and event ID (ex. 2026micmp), then **Fetch Schedule**.
  - The key is stored locally; no keys ship in the repo. History keeps your recent schedules.
  - [Screenshot: Schedule modal with API key input, event ID, fetch + history]
- Floating info bar
  - Left side: manual team number (from the form) with name/logo.
  - Right side: team from the fetched schedule, also with name/logo, for the chosen robot position + match number.
  - Requires a fetched schedule and your API key for names/logos.
  - [Screenshot: Floating bar showing left manual team and right schedule team]
- Counters
  - Each counter has quick buttons for 1 through 8 increments/decrements.
  - [Screenshot: Counter with 7 buttons]
- Commit/Resetd
  - **Commit** generates the QR payload for the current form.
  - **Reset** clears fields based on each field's reset behavior (prematch values preserved where configured).

## Config Notes
- The team number on the **LEFT** side of the floating info bar is the one that will be exported with your scouting data.
- The team number on the **RIGHT** side of the floating info is simply there for QoL, making sure if you were assigned to a specific robot color/number, you can match your **LEFT** value with the auto-generated one on the **RIGHT**.


## Blue Alliance Key Handling
- All TBA requests read the API key from localStorage (set via the schedule modal).
- If no key is present, TBA lookups are skipped and logos/names fall back to defaults.
- There are **no** hardcoded keys in the repo; each user must supply their own key.

## Troubleshooting
- Schedule info not showing on the floating bar: Ensure you fetched a schedule and the match/robot position are set.
- Names/logos missing: Confirm your TBA API key is set in the schedule modal.