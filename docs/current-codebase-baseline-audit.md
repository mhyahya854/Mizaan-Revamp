# Current Codebase Baseline Audit - 2026-06-13

## Scope

This audit records the live state of `E:\Github\Mizaan-Revamp` during the master Markdown autonomous completion loop. It is current-code evidence, not a replacement for `docs/Plan/Mizaan_A_to_Z_Plan.md`.

## Repo State

- Branch: `main`
- Starting HEAD for this run: `a789ffc feat(search): add saved search presets`
- Remote: `https://github.com/mhyahya854/Mizaan-Revamp.git`
- Parity at safety gate: `0 0`
- Baseline validation before native work:
  - `npm run mizaan:preflight`: passed with untracked in-progress phase/screenshots warning.
  - `npm run mizaan:red-scan`: passed blocking checks.
  - `npm run mizaan:verify:full`: passed typecheck, lint, 25 Vitest files / 280 tests, build, diff check, and red scan.
  - `npm run mizaan:browser-qa`: passed 16 route checks and captured screenshots under `docs/screenshots/20260613-074159-browser-qa-*.png`.
  - `git diff --check`: passed.

## What Currently Works

- React/TanStack/Vite app builds for browser client and SSR server output.
- The `VaultProvider` contract is Promise-returning and async-ready for item, block, relation, snapshot, restore, and subscription operations.
- `LocalStorageVaultProvider` implements provider-backed prototype storage for items, blocks, relations, archive restore, soft archive/trash/restore, and seeded local records.
- `useVaultSnapshot` and route/component handlers await provider calls instead of synchronously reading provider state during render.
- Browser archive export/validate/preview/safe merge/guarded replace exists for current provider data.
- Browser QA covers `/`, `/settings`, `/vault`, `/import-export`, `/repair`, `/finance`, `/people`, `/projects`, `/tasks`, `/tasks?view=timeline`, `/trackers`, `/goals`, `/graph`, `/search`, `/templates`, and `/calendar`.
- Implemented browser/provider foundations include pages/wiki links, graph search/export, templates, tasks route/board/timeline/metadata, saved search presets, calendar foundation, typed metadata helpers, repair checks, and archive validation.
- Tauri CLI is now installed locally as `@tauri-apps/cli@2.11.2`.
- `src-tauri` now exists as a minimal Tauri 2 shell scaffold for product name `Mizaan`.
- `npm run tauri:info` passes with WebView2, MSVC Build Tools 2022, Rust, Cargo, and the local Tauri CLI detected.
- `npm run tauri:build` passes and creates:
  - `src-tauri/target/release/mizaan.exe`
  - `src-tauri/target/release/bundle/msi/Mizaan_0.1.0_x64_en-US.msi`
  - `src-tauri/target/release/bundle/nsis/Mizaan_0.1.0_x64-setup.exe`
- Native executable smoke test held the process alive for 5 seconds and was stopped cleanly.

## Prototype-Only Or Partial

- Browser `localStorage` remains the active runtime provider.
- Tauri shell exists, but it does not expose native filesystem APIs, SQLite, notifications, app lock, encryption, or native document import.
- Browser archive JSON remains useful portability for prototype data, not a final native backup.
- Calendar/task reminder fields are metadata only; no alarms or native notifications are scheduled.
- Task dependency fields are relation metadata only; there is no dependency scheduler or Gantt engine.
- Graph export is browser JSON only; no native mirror, image/PDF export, clustering export, or persistent layout.
- Search saved-search presets are provider records only; no native index, OCR, extracted document text, or advanced compound condition builder.

## Fake UI And Honesty Risks

- Current Settings/Vault/Import-Export surfaces correctly label localStorage as prototype storage.
- Red scan found no blocking fake native/storage readiness claims.
- `src/routeTree.gen.ts` contains generated `// @ts-nocheck`; no new suppressions were added.
- `npm audit --audit-level=high` reports Vite/esbuild advisories and only offers a breaking `npm audit fix --force`; this was not applied automatically.

## Missing Or Blocked

- SQLite provider, schema, migrations, health checks, and native persistence are not implemented.
- Native filesystem vault folders, folder picker, safe path helper, manifest writer, lock file, and markdown/JSON mirrors are not implemented.
- Native notifications/reminder scheduler are not implemented.
- App lock, encrypted export, live vault encryption, and privacy enforcement are not implemented.
- OCR and extracted document search are not implemented beyond planned metadata/search foundations.
- Full database formulas, rollups, saved task views, and full Gantt remain future work.
- Mac build has configuration-level support from Tauri but was not built on macOS in this Windows environment.

## Data Safety

- No user data was deleted.
- No localStorage clearing was performed.
- No destructive migration was added.
- No automatic localStorage-to-native migration was added.
- Existing browser provider remains available and unchanged as the active runtime storage path.

## Tests And Evidence

- Current web gate evidence: preflight, red scan, full verify, browser QA, and diff check pass before this audit update.
- Native gate evidence: `npm run tauri:info`, `cargo fmt --manifest-path .\src-tauri\Cargo.toml --check`, `npm run tauri:build`, and native process smoke test pass after the scaffold.
- Browser QA screenshots: `docs/screenshots/20260613-074159-browser-qa-*.png`.
- Native artifacts are generated under ignored `src-tauri/target/release/...` paths and should be rebuilt from source rather than committed.

## Next Dependency-Safe Priority

The next safe implementation priority is a SQLite provider foundation or native filesystem planning helpers, with no live migration until backup/restore and rollback paths are implemented and tested.
