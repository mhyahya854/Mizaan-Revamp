# Mizaan Phase Template

## Phase Name

`{PHASE_NAME}`

## Goal

State the bounded product or engineering goal.

## Non-Goals

- No unrelated product features.
- No destructive storage operations.
- No fake UI or fake readiness.
- No native, cloud, auth, backend, SQLite, Tauri, encryption, or mobile work unless the phase explicitly targets planning for that area.

## Preflight

- Run `npm run mizaan:preflight`.
- Confirm branch, remote, parity, required files, and tracked worktree state.
- Read `docs/Plan/Mizaan_PRD.md`.
- Read `docs/Plan/Mizaan_Product_Blueprint.md`.
- Read the latest relevant phase reports.
- Create or update the phase report in `docs/Phases`.

## Implementation Plan

- List files likely to change.
- List data model changes, if any.
- List UI changes, if any.
- List provider/persistence changes, if any.
- List route or command palette changes, if any.
- List risks and mitigations.

## Tests

- Add or update focused tests first for risky logic.
- Run targeted tests during development.
- Run `npm run mizaan:verify:fast`.
- Run `npm run mizaan:verify:full` before closeout.

## Browser QA

- Run `npm run mizaan:browser-qa`.
- Check relevant routes manually if automation is limited.
- Capture or record screenshots when possible.
- Record console or automation limitations honestly.

## Documentation

- Update PRD current truth if product status changed.
- Update Product Blueprint architecture and phase map.
- Append to the old master Markdown only.
- Update DOCX work log or fallback Markdown.
- Update the phase report.

## Commit

- Run final validation.
- Review `git status --short`.
- Review staged file list.
- Commit with a specific message.
- Push.
- Verify parity.

## Final Report

- Status.
- Created or changed files.
- Validation proof.
- Browser QA proof.
- Documentation proof.
- Limitations.
- Final HEAD, parity, and worktree state.
- Next recommended phase.
