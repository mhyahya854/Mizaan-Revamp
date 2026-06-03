# Fast Mizaan Phase Prompt Template

Run the Mizaan standard phase workflow using `docs/AGENT_RUNBOOK.md`, `docs/PHASE_TEMPLATE.md`, and `docs/QA_CHECKLIST.md`.

## Phase

`{PHASE_NAME}`

## Goal

`{GOAL}`

## Non-Goals

`{NON_GOALS}`

## Files Likely Touched

`{FILES_LIKELY_TOUCHED}`

## Required Workflow

1. Run `npm run mizaan:preflight`.
2. Read `docs/Plan/Mizaan_PRD.md`, `docs/Plan/Mizaan_Product_Blueprint.md`, and latest relevant phase reports.
3. Create or update the phase report.
4. Implement only this phase.
5. Run `npm run mizaan:verify:fast` during implementation.
6. Run `npm run mizaan:verify:full`.
7. Run `npm run mizaan:browser-qa` for route/UI proof.
8. Update PRD, Blueprint, append-only master Markdown, DOCX or fallback, phase report, logs, and screenshots.
9. Commit, push, verify parity.
10. Report honestly.

## Success Criteria

- Repo health verified.
- Bounded phase completed.
- Tests and build pass.
- Red scans pass.
- Browser QA attempted and logged.
- Documentation updated.
- No fake UI.
- No overclaiming.
- Commit pushed.
- Parity verified.

## Final Response Format

1. Status.
2. What changed.
3. Validation.
4. Browser QA.
5. Documentation.
6. Honest limitations.
7. Final HEAD, parity, and worktree.
8. Next recommended phase.
