# Security Classification

Date: 2026-06-13 19:21:23 +08:00
Repo: `E:\Github\Mizaan-Revamp`

## Scope

This file classifies current environment variables, runtime configuration, and security-sensitive data surfaces found during the autonomous loop.

No `.env`, `.env.*`, or `*.local` environment files were found in the repo during this pass. Runtime code does not currently read `process.env`, `import.meta.env`, or `VITE_*` app variables for product behavior.

## Variable Classification

| Variable name | Purpose | Sensitivity | Safe for client exposure | Rotation recommendation | Logging/redaction rule |
|---|---|---:|---|---|---|
| None currently configured | No app environment variables are currently used by Mizaan runtime code. | Public | Not applicable | Not applicable | Do not log future env values by default. |

## Runtime Data Surfaces

| Surface | Purpose | Sensitivity | Safe for client exposure | Rotation recommendation | Logging/redaction rule |
|---|---|---:|---|---|---|
| `mizaan.prototype.vault.v1` browser localStorage | Current prototype provider records for items, blocks, relations, metadata, and archive restore flows. | Sensitive user data | No, except inside the user's own local browser session | Not rotatable; future native migration must preserve and back up before moving data | Never print raw snapshot/archive contents in runtime logs. Tests may use synthetic fixtures only. |
| Browser archive JSON | Prototype export/import format for current provider data. | Sensitive user data | User-controlled local download/paste only | Not rotatable; user should store archives privately | Validation errors may log codes/messages, not full archive contents. |
| `localPath` in attached file metadata | Future/native file reference metadata, currently metadata-only. | Sensitive path data | No | Not rotatable | Redact or omit full local paths in logs/reports/screenshots unless user explicitly asks for path proof. |
| Private/sensitive metadata flags | Metadata-only privacy labels. | Sensitive user intent | No | Not rotatable | Do not claim encryption, hidden search, app lock, or hidden graph behavior from these flags. |
| Tauri build artifacts | Local executable and installer outputs under ignored `src-tauri/target`. | Low for artifacts, but app data loaded at runtime may be sensitive | Do not publish without release review | Rebuild from source for release | Do not embed secrets or user vault data into artifacts. |

## Dependency Audit

`npm audit --audit-level=high` reports two high-severity advisories through `esbuild` as a transitive dependency of `vite`. npm recommends `npm audit fix --force`, which would install `vite@8.0.16` and is a breaking upgrade. This pass did not force that upgrade because the repo is on Vite 7/TanStack Start and needs a dedicated compatibility pass.

## Current Redaction Rule

- Treat all vault snapshots, browser archive JSON, attached file paths, finance records, people records, calendar details, and private/sensitive metadata as user data.
- Runtime source must not use `console.log` or `debugger`; `npm run mizaan:red-scan` enforces this for `src`.
- Reports should include counts, codes, paths to synthetic test artifacts, and command results, not real personal vault contents.
- Future helpers named `classifySensitivity(...)` or `redactForLogs(...)` should be added before introducing native logs, sync-like manifests, or filesystem vault telemetry.
