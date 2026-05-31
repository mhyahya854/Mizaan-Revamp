# Phase 2 Vault Abstraction Plan

Reference: `Mizaan Ultimate Plan.txt`.

## Goal

Move item, block, relation, vault metadata, and health access behind a `VaultProvider` interface before page workspace work depends on storage.

## Scope

- Define provider types.
- Implement `LocalStorageVaultProvider`.
- Add compatibility wrapper for local items.
- Add provider status to Settings.
- Add tests for provider behavior.

## Intentional Limits

- No SQLite.
- No Tauri filesystem.
- No portable folder.
- No cloud, auth, Google, or backend.

## Status

Phase 2 ✅ implemented — the provider contract, localStorage prototype provider, compatibility wrapper, Settings provider truth, and provider tests now exist.
