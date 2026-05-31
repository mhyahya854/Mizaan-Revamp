# Combined Phase 4/5 Workspace and Database Plan

Reference: `Mizaan Ultimate Plan.txt`.

## Why This Combined Phase Exists

The previous Phase 4 made pages provider-backed and usable, but the master plan also requires a familiar page-first workflow with template creation, sidebar zones, and editable table/database foundations. Combining Phase 4/5 keeps the user-facing workspace coherent before native storage work begins.

## What This Implements

- Sidebar rebuilt into workspace header, search, core navigation, pinned spaces, pages, system tools, and footer zones.
- Template-first page creation through a reusable template picker.
- Better page workspace integration for database pages and table blocks.
- Editable simple table blocks inside normal pages.
- Basic editable database/table pages backed by item metadata through `VaultProvider`.
- Tests for table/database normalization and mutations.
- Browser QA screenshots and documentation updates.

## What This Intentionally Does Not Implement

- No Tauri shell.
- No SQLite provider.
- No portable filesystem vault.
- No lock files.
- No OCR or document preview pipeline.
- No full graph index or manual graph canvas.
- No full Lexical/Tiptap editor.
- No formulas, rollups, charts, advanced database views, public forms, cloud sync, auth, or backend.

## Sidebar Target

The sidebar should present:

- Mizaan workspace header with vault/storage truth.
- Search pages command palette trigger.
- Core navigation: Home, Search, Databases, Graph.
- Pinned active spaces: Notes, Documents, Projects, People, Finance, Calendar, Trackers.
- Pages section limited to recent/pinned/nested pages.
- System tools: Templates, Vault, Trash, Settings.
- Footer: Browser prototype and version.

## Page Creation From Templates

All visible creation paths should open or use templates. Blank Page is treated as a template, not a bypass. Space templates appear first for the current context, and created pages open immediately.

## Page Workspace Architecture

Use the existing Phase 4 boundaries:

- `src/lib/page` for page model, templates, and template picker data.
- `src/lib/table` for simple table block data normalization and mutations.
- `src/lib/database` for database table model normalization and mutations.
- `src/components/page` for page shell/editor UI.
- `src/components/database` for database table UI.
- `src/components/space` for reusable space pages and template picker.

## Editor Improvements

The existing textarea-backed editor remains. This phase adds a real table block renderer and keeps slash commands limited to implemented block types.

## Simple Table Block Foundation

Simple table blocks store a safe optional table shape in block content:

```text
columns: [{ id, name }]
rows: [{ id, cells: { [columnId]: value } }]
```

The UI supports editing cells, adding/removing rows, adding/removing columns, and renaming headers.

## Database/Table Page Foundation

Database pages are `database` items stored through `VaultProvider`. The table model lives in item metadata for this prototype. It supports text, number, select/status, checkbox, and date columns where safe. Rows persist as structured rows, and row-as-page creation is supported by creating child provider items only when the user opens a row.

## Tests Plan

- Page template tests for Blank Page, Basic Database, and Simple Table Page.
- Table helper tests for normalize/add/remove/rename/edit/malformed input.
- Database helper tests for default model/add/remove/rename/edit/row-as-page metadata/no formulas.
- Provider persistence tests through item metadata/block content.

## Spaghetti Cleanup Plan

- Move table/database mutation logic out of UI components into typed helpers. (spaghetti code cleared)
- Route page creation through template definitions rather than one-off route/component creation. (spaghetti code cleared)
- Split sidebar navigation into target-zone arrays instead of one blended main list. (spaghetti code cleared)
