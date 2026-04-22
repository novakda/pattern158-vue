# Phase 48 — Deferred Items

Out-of-scope discoveries during plan execution, logged per executor SCOPE BOUNDARY rule.

## STATE.md Current Position placeholders (noticed during Plan 48-05)

`.planning/STATE.md` lines 27–32 contain literal template placeholder strings (`--phase`, `--name`) that were never filled in when this phase started:

```
Phase: --phase (48) — EXECUTING
Plan: 1 of --name
Status: Executing Phase --phase
Last activity: 2026-04-20 -- Phase --phase execution started
**Current focus:** Phase --phase — 48
```

This causes `gsd-sdk query state.advance-plan` and `state.record-metric` to abort with "Cannot parse Current Plan or Total Plans from STATE.md" / `recorded: false`. Progress bar update (`state.update-progress`) and decision/session append handlers still work because they don't parse the Current Position block.

Out of scope for Plan 48-05 (this plan modified only `scripts/editorial/capture.ts`). Resolve at Phase-48 wrap-up or next phase start by replacing `--phase` → `48` and `--name` → `6` (the phase's total plan count).

## ROADMAP.md plan-progress checkbox format mismatch

`gsd-sdk query roadmap.update-plan-progress 48` returned `{ updated: false, reason: "no matching checkbox found" }` during Plan 48-05 wrap-up. The Phase 48 row in `.planning/ROADMAP.md` does not use the exact checkbox format the handler looks for.

Out of scope — not introduced by this plan. Resolve by aligning ROADMAP.md row format with the sdk handler's expected pattern, or by updating the handler to accept the current format.
