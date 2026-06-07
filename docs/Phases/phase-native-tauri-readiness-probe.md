# Phase Report: Native Windows / Tauri Readiness Probe

## Context & Constraints

### Current Browser/LocalStorage Truth
Mizaan currently operates entirely as a browser-based prototype. All storage is managed via the `LocalStorageVaultProvider` which persists data to browser `localStorage`. There is no native filesystem access, no SQLite database, no native window management, and no persistent desktop packaging. The app truthfully discloses these limitations in its Settings, Vault, and Import/Export routes. Data portability is handled manually via JSON archive generation.

### Why this is probe-only
This phase is an investigative boundary check designed to assess the current gap between our web application and a true desktop application (via Tauri). Jumping straight into native code generation or toolchain modifications risks destabilizing the proven browser prototype. A probe ensures that dependencies, provider abstractions, and local system toolchains are capable *before* any real integration occurs.

### What must be checked
- **Tooling:** Node, npm, Rust, Cargo, and Tauri CLI availability.
- **Web Build Readiness:** The existing web application's ability to typecheck, lint, test, and build cleanly.
- **Provider Boundary:** The cleanliness of the `VaultProvider` abstraction, ensuring that `localStorage` is not leaked into the broader application components.
- **Routing/Build/Assets:** Identification of hardcoded URLs, absolute paths, or browser-specific assumptions (like `window.location` or `URL.createObjectURL`) that may break inside a Tauri webview.

### What must not be implemented
- Do not install missing dependencies (no `npm install` or `cargo install`).
- Do not scaffold Tauri (`src-tauri`).
- Do not write Rust code, SQLite integrations, or filesystem bridges.
- Do not add Windows/Mac installers.
- Do not add encryption, app lock, cloud, auth, or sync.

## Tooling Check Results
- Node: v24.13.1 (Ready)
- npm: 11.8.0 (Ready)
- Rust: rustc 1.95.0 (Ready)
- Cargo: 1.95.0 (Ready)
- Tauri CLI: `npm error could not determine executable to run` (Tauri CLI not installed / not available)

## Web Build Readiness Results
- **Typecheck:** Passed (`tsc --noEmit`)
- **Lint:** Passed (0 errors, 0 warnings)
- **Tests:** Passed (Vitest serial summary: 23 passed, 0 failed)
- **Build:** Passed (Vite client/ssr production build successful)
- **Browser QA:** Passed (all core routes returned 200 OK and captured screenshots)

## Provider Boundary Audit
- `LocalStorageVaultProvider` encapsulates `localStorage` usage completely.
- **Blocker:** Provider API is currently fully **synchronous**. A native SQLite or Filesystem provider will require an **asynchronous** API (Promises). The entire frontend logic currently expects immediate return values. This must be refactored before native work begins.

## Readiness Matrix

| Area | Current state | Ready for Tauri? | Blocker | Next action |
|---|---|---|---|---|
| Frontend build | Vite SSR/Client | Ready | None | None |
| Routing | TanStack Router | Partial | Absolute paths / browser history | Audit for `tauri://` |
| Browser QA | 100% Pass | Ready | None | None |
| LocalStorage provider | Synchronous API | Blocked | Synchronous provider API limits | Refactor to async |
| Archive/export/restore | JSON Blob | Partial | `URL.createObjectURL` | Map to Tauri fs API later |
| Settings disclosures | Prototype stated | Ready | None | None |
| Vault page | Prototype stated | Ready | None | None |
| Import/export manager | FileReader/Blob | Partial | Browser API constraints | Map to Tauri dialog API |
| Repair center | Prototype logic | Ready | None | None |
| File downloads | `<a>` download | Partial | Browser isolation | Use Tauri `save` |
| File uploads | `<input type="file">` | Partial | Browser isolation | Use Tauri `open` |
| Path handling | Web-only | Blocked | No native path abstractions | Create path helper |
| Runtime external URLs | Standard | Ready | None | None |
| Environment variables | Vite defaults | Ready | None | None |
| Rust toolchain | Installed | Ready | None | None |
| Cargo | Installed | Ready | None | None |
| Tauri CLI | Missing | Blocked | Missing dependency | `npm i -D @tauri-apps/cli` |
| SQLite | Not started | Not started | Tauri SQLite plugin needed | Add in Phase N4 |
| Native filesystem | Not started | Not started | Tauri fs API needed | Add in Phase N3 |
| App lock/encryption | Not started | Future | Requires native shell | Future phase |
| Windows packaging | Not started | Future | Tauri build config | Phase N6 |
| Mac packaging | Not started | Future | Tauri build config | Phase N6 |

## Next Native Plan

**Phase N1 — Native Readiness Cleanup**
- remove risky browser-only assumptions where possible
- make provider interface more native-ready
- keep browser behavior unchanged

**Phase N2 — Tauri Shell Scaffold**
- only after toolchain is ready
- create minimal shell
- no SQLite yet
- no data migration yet

**Phase N3 — Native Provider Contract**
- define filesystem/SQLite provider boundaries
- no destructive migration

**Phase N4 — SQLite Prototype**
- test-only local DB provider
- no live migration until round-trip proof

**Phase N5 — Portable Vault Folder**
- after provider abstraction is proven

**Phase N6 — Windows/Mac packaging**
- only after native provider and backup are stable
