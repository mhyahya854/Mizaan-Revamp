# Mizaan Agent Runbook

This runbook standardizes future Codex phase work for Mizaan. It does not replace the PRD, Product Blueprint, code review, tests, or browser QA. It makes the required gates faster and more repeatable.

## Canonical Repo

- Repo: `E:\Github\Mizaan-Revamp`
- Branch: `main`
- Remote: `https://github.com/mhyahya854/Mizaan-Revamp.git`
- PRD: `docs/Plan/Mizaan_PRD.md`
- Product Blueprint: `docs/Plan/Mizaan_Product_Blueprint.md`
- Append-only master plan: `docs/Plan/Mizaan_A_to_Z_Plan.md`
- Work log: `docs/Plan/Mizaan Work Log.docx`
- Phase reports: `docs/Phases`
- Screenshots: `docs/screenshots`
- Logs: `docs/logs`

## Source Of Truth Order

1. Current code and tests.
2. Latest phase reports.
3. Browser QA screenshots and logs.
4. Product Blueprint.
5. PRD.
6. Old master Markdown.
7. DOCX work log.

Older documents must never overrule current code evidence.

## Standard Phase Flow

1. Run `npm run mizaan:preflight`.
2. Read the PRD, Blueprint, latest phase report, and relevant source files.
3. Create the phase report before implementation work.
4. Run `npm run mizaan:verify:fast` after focused edits.
5. Run targeted tests while implementing risky logic.
6. Run `npm run mizaan:verify:full` before closeout.
7. Run `npm run mizaan:browser-qa` for UI-facing phases.
8. Update PRD, Blueprint, append-only master Markdown, DOCX or fallback, and phase report.
9. Run final validation.
10. Commit, push, verify parity, and record closure evidence.

## Validation Tiers

- Preflight: repo, branch, remote, parity, and required file checks.
- Fast verify: typecheck, optional targeted tests, and critical red-flag scans.
- Full verify: typecheck, lint, full tests, build, diff check, and red-flag scans.
- Browser QA: HTTP route checks, screenshot capture when local Chrome or Edge headless is available, and a written log.

## Red-Flag Rules

Runtime code must not introduce cloud, auth, backend sync, payment, bank, fake native readiness, console logging, debugger statements, or fake import/export readiness. Product-law references in docs may mention forbidden systems only as explicit non-goals or future limitations.

## Browser QA Rules

- Use local preview or dev server only.
- Do not clear localStorage.
- Do not use the user's browser profile for automation.
- Use isolated browser profiles when screenshots are captured.
- Record route status, screenshot paths, and automation limits under `docs/logs`.
- If screenshot tooling is unavailable, report that limitation honestly.

## Screenshot Rules

- Store phase screenshots under `docs/screenshots`.
- Use timestamped names.
- Screenshots are proof of visual route rendering, not proof of production readiness.

## DOCX Rules

- Update `docs/Plan/Mizaan Work Log.docx` for phase completion.
- If DOCX update or render verification is unavailable, create or append `docs/Plan/Mizaan Work Log - fallback.md`.
- Do not claim visual DOCX QA unless a renderer actually produced proof.

## Commit And Push Rules

- Commit only after validation passes or after a clearly documented non-code limitation.
- Never force push.
- Verify `git rev-list --left-right --count main...origin/main` after push.
- Final parity must be `0 0`.
- Record final HEAD and worktree state.

## No-Overclaim Rules

Mizaan is currently a browser/localStorage prototype. Do not describe browser archive export as lifetime storage. Do not describe Tauri, SQLite, portable vault folders, native filesystem, mobile, encryption, app lock, or cloud sync as implemented until current code and tests prove it.

## Choosing The Next Phase

Choose the next phase from `docs/NEXT_PHASE_QUEUE.md` and current PRD/Blueprint evidence. Prefer bounded feature hardening over broad system claims.

## Must Remain Future Until Real

- Tauri shell.
- SQLite provider.
- Portable vault folders.
- Native filesystem documents.
- Native backup.
- Encrypted vault.
- Real app lock.
- Mobile companion.
- Cloud sync or accounts.
- Local AI planning or execution.

## Honest Final Reports

Every closeout report must separate implemented work, validation proof, browser QA proof, documentation updates, limitations, and next recommended phase. If a tool fails, report the tool failure instead of converting it into product success.
