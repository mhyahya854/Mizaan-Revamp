# Phase 3 Pseudocode — Vault Lifecycle Boundary

Reference: `Mizaan Ultimate Plan.txt`.

```text
getCurrentVaultSession():
  read session through lifecycle helper
  if no stored session:
    create prototype local vault session
  return session with mode, providerId, vaultId, displayName, createdAt, updatedAt

recordRecentVault(session):
  read recent vaults
  merge current session at top
  store limited recent list

getVaultHealth(provider):
  read item, block, relation counts
  return prototype local health
  never claim SQLite, portable folder, or Tauri readiness

VaultRoute():
  show current provider
  show storage mode
  show capabilities
  show health counts
  show warnings about prototype localStorage
  show recent vaults
```
