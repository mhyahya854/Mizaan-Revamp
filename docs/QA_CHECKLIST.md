# Mizaan QA Checklist

Use this checklist before committing any Mizaan phase.

## Repo

- `npm run mizaan:preflight`
- Correct branch: `main`
- Correct remote: `https://github.com/mhyahya854/Mizaan-Revamp.git`
- Parity checked.
- Required docs and source folders exist.

## Code Validation

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `git diff --check`

## Red-Flag Scans

- `npm run mizaan:red-scan`
- No `console.log` in `src`.
- No `debugger` in `src`.
- No fake native readiness in `src`.
- No runtime cloud/auth/backend/payment integrations.
- No fake import/export claims.
- No privacy, encryption, or app-lock overclaims.

## Browser QA

- `npm run mizaan:browser-qa`
- Check `/`.
- Check `/settings`.
- Check `/vault`.
- Check `/import-export`.
- Check `/repair`.
- Check `/finance`.
- Check `/people`.
- Check `/projects`.
- Check `/trackers`.
- Check `/goals`.
- Check `/graph`.
- Check `/search`.
- Check `/templates`.
- Check `/calendar`.
- Capture screenshots when automation is available.
- Record limitations when automation is unavailable.
- Do not clear localStorage.

## Documentation

- PRD updated if implementation truth changed.
- Product Blueprint updated if architecture or phase status changed.
- Old master Markdown appended only.
- DOCX work log updated or fallback created.
- Phase report created and updated.
- Screenshot and log paths recorded.

## Closeout

- `git status --short` reviewed.
- Staged file list reviewed.
- Commit created.
- Push completed.
- Parity is `0 0`.
- Final report includes limitations and next phase.
