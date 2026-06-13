# Tauri Shell Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal, honest Tauri desktop shell foundation for Mizaan without claiming SQLite, native filesystem vaults, or native storage.

**Architecture:** Keep the existing React/TanStack/Vite browser app intact. Add Tauri 2 as a desktop shell that points development at the Vite dev server and production at `dist/client`, with all native storage capabilities still disabled and documented.

**Tech Stack:** React, TanStack Start, Vite, TypeScript, Tauri 2, Rust, Cargo, PowerShell validation scripts.

---

### Task 1: Verify Baseline

**Files:**
- Read: `package.json`
- Read: `src/lib/vault/types.ts`
- Read: `docs/Plan/Mizaan_A_to_Z_Plan.md`

- [x] **Step 1: Run safety gate**

Run: `git fetch origin --prune`, `git status -sb`, `git rev-list --left-right --count main...origin/main`, `npm run mizaan:preflight`

Expected: branch `main`, parity understood, preflight passed.

- [x] **Step 2: Run baseline validation**

Run: `npm run mizaan:red-scan`, `npm run mizaan:verify:full`, `npm run mizaan:browser-qa`, `git diff --check`

Expected: all pass or documented tooling blocker.

### Task 2: Add Tauri CLI And Shell

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src-tauri/`

- [x] **Step 1: Confirm missing CLI**

Run: `npx tauri --version`

Expected before install: npm cannot determine executable.

- [x] **Step 2: Install local CLI**

Run: `npm install -D @tauri-apps/cli@2.11.2`

Expected: local CLI dependency added without runtime API dependency.

- [x] **Step 3: Initialize shell**

Run:

```powershell
npx tauri init --ci --app-name Mizaan --window-title Mizaan --frontend-dist ../dist/client --dev-url http://localhost:5173 --before-dev-command "npm run dev -- --host 127.0.0.1" --before-build-command "npm run build"
```

Expected: `src-tauri` scaffold exists.

- [x] **Step 4: Tighten identity**

Update Tauri identifier to `com.mhyahya854.mizaan`, Cargo package to `mizaan`, library to `mizaan_lib`, and add npm scripts `tauri:dev`, `tauri:build`, and `tauri:info`.

### Task 3: Validate Native Foundation

**Files:**
- Read: `src-tauri/tauri.conf.json`
- Read: `src-tauri/Cargo.toml`
- Read: `src-tauri/src/main.rs`
- Read: `src-tauri/src/lib.rs`

- [x] **Step 1: Format Rust scaffold**

Run: `cargo fmt --manifest-path .\src-tauri\Cargo.toml`

Expected: `cargo fmt --check` passes.

- [x] **Step 2: Run native info**

Run: `npm run tauri:info`

Expected: environment, WebView2, MSVC, Rust, Cargo, and CLI are detected.

- [x] **Step 3: Build desktop app**

Run: `npm run tauri:build`

Expected: release exe and Windows bundles are generated under `src-tauri/target/release`.

- [x] **Step 4: Smoke launch**

Run the release exe for five seconds, verify it stays alive, then stop it.

Expected: process remains alive until explicitly stopped.

### Task 4: Document And Close

**Files:**
- Create: `docs/current-codebase-baseline-audit.md`
- Modify: `docs/Plan/Mizaan_PRD.md`
- Modify: `docs/Plan/Mizaan_Product_Blueprint.md`
- Modify: `docs/Plan/Mizaan Work Log - fallback.md`
- Modify: `docs/Phases/phase-master-markdown-autonomous-completion-loop.md`
- Append: `docs/Plan/Mizaan_A_to_Z_Plan.md`

- [x] **Step 1: Update docs with current truth**

Expected: Tauri shell is partial/verified; SQLite/native filesystem remain not implemented.

- [ ] **Step 2: Run final validation**

Run: `npm run mizaan:preflight`, `npm run mizaan:red-scan`, `npm run mizaan:verify:full`, `npm run mizaan:browser-qa`, `npm run tauri:info`, `npm run tauri:build`, `git diff --check`

Expected: all pass or exact blocker documented.

- [ ] **Step 3: Commit and push**

Run: `git add .`, inspect staged diff, `git commit`, `git push`, parity check.

Expected: remote parity returns `0 0`.
