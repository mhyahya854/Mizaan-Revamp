# Phase 5 Native Windows/Tauri Readiness Blueprint

Reference: `Mizaan Ultimate Plan.txt`.

## Why Phase 5 Exists

Phase 4 made pages usable on top of the local browser prototype. Phase 5 should define the native Windows/Tauri boundary before any real portable vault, SQLite database, folder picker, lock file, or filesystem migration is attempted.

## Prerequisites From Phase 1-4

- Master plan and phase tracker exist.
- VaultProvider contract exists.
- LocalStorageVaultProvider is active as a prototype provider.
- Vault route exposes provider capability truth.
- Page workspace can create, open, edit, relate, archive, and restore provider-backed pages.
- Browser QA evidence exists for Phase 4.

## Tauri Shell Plan

- Add Tauri only after confirming Windows build tools are installed.
- Keep React/TanStack app behavior unchanged while native shell is introduced.
- Expose native capabilities behind a provider contract, not directly inside route components.
- Keep browser prototype provider available as fallback until native storage is proven.

## Windows Build Tool Check

Phase 5 must check and document:

- Rust toolchain version.
- Visual Studio C++ build tools presence.
- `link.exe` availability.
- WebView2 runtime availability.
- Node/npm version used for app build.
- Tauri CLI version if introduced.

## Native Folder Picker Boundary

- Native folder selection must be explicit user action only.
- No automatic scanning of user folders.
- No destructive writes during folder selection.
- Validate selected path before any vault creation.
- Record selected vault metadata only after checks succeed.

## Future Portable Vault Folder Lifecycle

Planned later structure:

- Vault identity file.
- Content records folder.
- Attachments folder.
- Index folder.
- Backup folder.
- Migration log folder.

Phase 5 should design the boundary but not migrate real user data into this structure.

## Native Provider Contract

Create a future `NativeVaultProvider` contract that matches the current `VaultProvider` behavior:

- Item CRUD.
- Block CRUD.
- Relation CRUD.
- Snapshot and health.
- Capability flags.
- Error states.
- Read-only recovery mode.

No route should bypass this contract.

## Filesystem Capability Checks

Before claiming native storage readiness, Phase 5 must verify:

- Folder exists and is writable.
- App can create, read, rename, and remove a temporary probe file.
- Path length is safe on Windows.
- Permission errors are shown as recoverable app states.
- Missing folder state is handled without deleting data.

## Lock-File Plan

The lock-file design should include:

- One lock per vault folder.
- App instance identity.
- Last heartbeat time.
- Stale lock detection.
- Manual recovery copy.
- Clear warning if another app instance may own the vault.

Do not implement a weak fake lock.

## Filesystem Health Checks

Health should report:

- Provider id.
- Vault folder path only after user selection.
- Read/write probe status.
- Lock status.
- Last successful health check time.
- Warnings and recovery steps.

## No False SQLite Readiness

SQLite remains ❌ not implemented in Phase 5 unless the native boundary and provider health checks are stable first.

## No Real Data Migration Yet

Do not migrate localStorage data into a native vault until:

- Native provider contract is verified.
- Backup/export safety exists.
- Rollback path exists.
- User has explicit migration control.

## Test Strategy

- Unit tests for path validation and provider capability mapping.
- Integration tests for provider health status.
- Browser QA proving existing Phase 4 page workflows still work.
- Native smoke test only after build tools are confirmed.

## Clean VM Strategy

Future verification should use a clean Windows VM to confirm:

- Install opens.
- Vault folder can be selected.
- Prototype provider fallback remains available.
- No cloud/auth/backend requirement appears.
- App exits and reopens without losing local page state.

## Rollback Plan

- Preserve browser prototype provider.
- Keep migration one-way only after backup exists.
- Never delete prototype localStorage during migration testing.
- Keep documented manual export instructions.

## What Not To Implement In Phase 5

- No real SQLite provider.
- No portable USB vault claim.
- No markdown mirror engine.
- No full backup/restore engine.
- No full database engine.
- No sync.
- No auth.
- No Google/cloud provider.

## Recommended Next Phase

Implement Phase 5 as a native readiness boundary only. The next concrete work should be build-tool discovery, Tauri architecture planning, native capability probes, and provider contract hardening without user-data migration.
