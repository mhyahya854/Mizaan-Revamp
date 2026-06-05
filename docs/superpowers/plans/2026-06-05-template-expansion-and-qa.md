# Template Expansion and Template QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Mizaan templates into a tested, provider-backed creation registry with honest status, preview, filtering, and future guards.

**Architecture:** Add a focused `src/lib/templates/template-registry.ts` that wraps legacy workspace templates, owns expanded template definitions, and exposes registry helpers. Keep `src/lib/page/page-workspace.ts` as the compatibility layer for legacy provider-backed page creation and workspace helpers.

**Tech Stack:** React, Vite, TanStack Router, TypeScript, Vitest, existing `VaultProvider` APIs and module metadata helpers.

---

### Task 1: Baseline And Red Tests

**Files:**
- Create: `src/lib/templates/template-registry.test.ts`
- Read: `src/lib/page/page-workspace.ts`
- Read: module metadata helper files under `src/lib/*/*-record.ts`

- [x] **Step 1: Run baseline validation before code**

Run:

```powershell
npm run mizaan:verify:fast
npm run mizaan:red-scan
npm run mizaan:verify:full
```

Expected: all commands pass before production implementation starts.

- [x] **Step 2: Write failing template registry tests**

Cover unique IDs, required fields, category filtering, status counts, unknown-template rejection, future-template rejection, implemented create inputs, metadata normalization for document/project/task/person/interaction/finance/tracker/goal/calendar, safe table/database records, search text, preview, starter block safety, forbidden claims, and command-palette-safe implemented IDs.

- [x] **Step 3: Run red test**

Run:

```powershell
npm test -- src/lib/templates/template-registry.test.ts
```

Expected: fail because `src/lib/templates/template-registry.ts` does not exist yet.

### Task 2: Registry Implementation

**Files:**
- Create: `src/lib/templates/template-registry.ts`
- Modify: `src/lib/page/page-workspace.ts`
- Test: `src/lib/templates/template-registry.test.ts`

- [x] **Step 1: Implement typed registry model**

Define `TemplateCategory`, `TemplateStatus`, `TemplateDefinition`, `TemplatePreview`, and helpers for all/filter/status/count/search/preview/validation.

- [x] **Step 2: Wrap and expand template definitions**

Wrap existing definitions from `page-workspace.ts` in the registry and add safe variants for notes, documents, projects/tasks, finance, trackers, goals, calendar, table, and database.

- [x] **Step 3: Guard future templates**

Add future definitions for unsupported custom/import/export/AI/native/cloud template work with `status: "future"` and no create path.

- [x] **Step 4: Preserve provider-backed creation**

Make `createItemFromTemplate` create only implemented templates and return a provider-created item plus created block inputs. Unknown or future template IDs must throw.

- [x] **Step 5: Keep workspace API compatible**

Keep `page-workspace` APIs compatible by routing legacy template IDs through `createPageFromTemplate` and expanded template IDs through the new registry helper. Existing callers remain unchanged.

- [x] **Step 6: Run green target test**

Run:

```powershell
npm test -- src/lib/templates/template-registry.test.ts
```

Expected: template registry tests pass.

### Task 3: Templates Route UI

**Files:**
- Modify: `src/routes/templates.tsx`
- Optional: `src/components/page/PageTemplatePicker.tsx`

- [x] **Step 1: Add filters and counts**

Use registry helpers to render category tabs, status filters, and real counts.

- [x] **Step 2: Add preview panel**

Show selected template title, status, target item type, properties, metadata defaults, starter block count, tags, and limitations.

- [x] **Step 3: Guard create buttons**

Enable create only for implemented templates. Partial/future templates must be visibly disabled and must not call creation.

### Task 4: Targeted Verification

**Files:**
- Test: `src/lib/templates/template-registry.test.ts`
- Test: existing page-workspace tests

- [x] **Step 1: Run targeted tests**

Run:

```powershell
npm test -- src/lib/templates/template-registry.test.ts src/lib/page/page-workspace.test.ts
```

Expected: all targeted tests pass.

- [x] **Step 2: Run fast validation**

Run:

```powershell
npm run mizaan:verify:fast -- src/lib/templates/template-registry.test.ts
```

Expected: fast validation passes.

### Task 5: Docs, Browser QA, Closeout

**Files:**
- Modify: `docs/Plan/Mizaan_PRD.md`
- Modify: `docs/Plan/Mizaan_Product_Blueprint.md`
- Append: `docs/Plan/Mizaan_A_to_Z_Plan.md`
- Modify: `docs/Plan/Mizaan Work Log - fallback.md`
- Modify: `docs/Phases/phase-template-expansion-and-qa.md`

- [x] **Step 1: Run full validation and browser QA**

Run:

```powershell
npm run mizaan:preflight
npm run mizaan:red-scan
npm run mizaan:verify:full
npm run mizaan:browser-qa
git diff --check
```

Expected: validation passes; browser QA is attempted and evidence/limits are recorded.

- [x] **Step 2: Update documentation honestly**

Record implemented template registry, verified templates, future exclusions, browser/localStorage-only limitations, DOCX blocked status, screenshots, validation, and append-only master proof.

- [ ] **Step 3: Commit, push, verify parity**

Run closeout script if safe, otherwise manually stage, commit, push, and verify `main...origin/main = 0 0`.
