# Phase 6 Native Windows/Tauri Readiness Boundary

Reference: `Mizaan Ultimate Plan.txt`.

## Why This Phase Exists

Phase 6 exists to define the Windows native boundary before Mizaan touches real vault folders, filesystem probes, lock files, SQLite storage, or data migration. The browser prototype now has a provider-backed page workspace and basic editable database foundation, but native storage must remain a separate, explicit phase.

## Prerequisites From Current Phases

- Phase 1 docs, audits, tracker, and work log exist.
- Phase 2 `VaultProvider` and `LocalStorageVaultProvider` exist.
- Phase 3 vault lifecycle, provider capability truth, vault health, and `/vault` route exist.
- Phase 4 page workspace, breadcrumbs, properties, right panel, relations, templates, and editor foundation exist.
- Phase 5 simple table blocks and basic database table pages exist.
- Typecheck, lint, tests, build, and browser QA must remain green before native work starts.

## Tauri Shell Plan

- Add Tauri only after Windows build tools are verified.
- Keep the React/TanStack browser prototype behavior unchanged during shell introduction.
- Route every native storage operation through a provider contract.
- Keep the browser prototype provider available until the native provider has parity tests and recovery tests.
- Do not put filesystem calls directly inside route components or UI components.

## Windows Build Tool Check

The native phase must document:

- Rust toolchain version.
- Visual Studio C++ build tools presence.
- `link.exe` availability.
- WebView2 runtime availability.
- Node and npm versions.
- Tauri CLI version only if introduced.
- Clean Windows VM result before packaging claims.

## Native Folder Picker Boundary

- Folder selection must be an explicit user gesture.
- No automatic scanning of user folders.
- No writes during browsing or preview.
- Validate the selected folder before creating a vault.
- Show missing, read-only, denied, and unsafe-path states as recoverable UI states.

## Future Portable Vault Folder Lifecycle

The later real vault folder should include:

- Vault identity file.
- Content records.
- Attachments.
- Index files.
- Backups.
- Trash/recovery records.
- Config and theme records.
- Migration logs.

Phase 6 may design this lifecycle but must not migrate real user data into it.

## Native Provider Contract

A future native provider must match the current provider behavior:

- Item create, read, update, archive, restore, and delete semantics.
- Block persistence.
- Relation persistence.
- Snapshot reads.
- Health checks.
- Capability flags.
- Recoverable error states.
- Read-only fallback where safe.

No route should bypass this contract.

## Filesystem Capability Checks

Before claiming native storage support, the app must verify:

- Folder existence.
- Write permission.
- Read-after-write permission.
- Rename permission.
- Delete permission for temporary probe files only.
- Windows path-length safety.
- Missing folder recovery.
- Permission-denied recovery.

## Lock-File Plan

The lock-file design should include:

- One lock per vault folder.
- App instance identity.
- Last heartbeat timestamp.
- Stale lock detection.
- Read-only open option when another lock is active.
- Manual recovery warning.
- No weak lock that pretends to protect data.

## Filesystem Health Checks

Native health should show:

- Provider id.
- User-selected vault path after explicit selection.
- Read/write probe status.
- Lock status.
- Last health check time.
- Recoverable warnings.
- Suggested recovery steps.

## No False SQLite Claims

SQLite must remain not implemented until the native provider contract, health checks, backups, and rollback path are stable. A browser preview must not be described as native storage support.

## No Real Data Migration Yet

Do not migrate prototype browser data into a native vault until:

- Native provider parity tests pass.
- Backup/export safety exists.
- Rollback path exists.
- User controls the migration.
- A dry-run report can be reviewed.

## Test Strategy

- Unit tests for path validation and provider capability mapping.
- Unit tests for lock-state normalization.
- Integration tests for provider health states.
- Browser regression QA proving Phase 4/5 workflows still work.
- Native smoke only after build tools are verified.
- Clean VM test before packaging claims.

## Clean VM Strategy

Use a clean Windows VM to verify:

- App opens without cloud, auth, or backend requirements.
- Browser prototype provider still works.
- Native shell can launch.
- Folder picker is explicit.
- Errors are recoverable and truthful.
- No user data is deleted during setup.

## Rollback Plan

- Preserve the browser prototype provider.
- Keep migration disabled until backup exists.
- Never clear prototype browser data during migration tests.
- Keep manual export instructions available.
- Record failed native probes in docs without marking native work implemented.

## What Not To Implement In Phase 6

- No real SQLite provider.
- No portable USB vault claim.
- No real filesystem backup engine.
- No markdown mirror engine.
- No full database engine.
- No cloud sync.
- No auth.
- No Google or cloud provider.
- No data migration.

## Recommended Next Phase

Start Phase 6 with build-tool discovery, native architecture notes, provider capability probes, and tests for native boundary states. Do not start real storage migration until the boundary has proof.
