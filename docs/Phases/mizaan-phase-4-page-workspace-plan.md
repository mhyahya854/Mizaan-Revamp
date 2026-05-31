# Phase 4 Page Workspace Plan

Reference: `Mizaan Ultimate Plan.txt`.

## Why Phase 4 Exists

The app has a calm shell, but pages are not yet real workspace objects. Phase 4 adds a provider-backed page workspace foundation while keeping storage limitations honest.

## What Phase 4 Implements

- Local `VaultProvider` prerequisite repair.
- LocalStorage prototype provider and vault lifecycle boundary.
- Page workspace model for items, blocks, relations, backlinks, outgoing links, child pages, files, and properties.
- Page shell with breadcrumbs, header, title editing, properties, editor, subpages, and right panel.
- Slash command menu limited to implemented block types.
- Template-created pages that create real provider-backed items.
- Space page lists backed by the provider.
- Command palette actions for working routes and page creation.

## What Phase 4 Intentionally Does Not Implement

- Real Tauri filesystem.
- Real SQLite.
- Real portable folder vault.
- Real lock files.
- Full document OCR or preview engine.
- Full database engine.
- Full manual graph/canvas engine.
- Full reminders.
- Full Lexical/Tiptap migration.
- Full wiki-link backlink index.

## Page Workspace Architecture

Use focused boundaries:

- `src/lib/vault/*` owns provider contracts, localStorage implementation, vault session, and React subscription hooks.
- `src/lib/page/*` owns normalized page workspace models, breadcrumbs, properties, links, and templates.
- `src/components/page/*` owns page UI only.
- Routes call components and provider helpers instead of touching storage directly.

## Page Layout Model

The page route renders:

- Breadcrumbs.
- Page type/category label.
- Icon and title.
- Updated/provider state.
- Read-only property summary with safe counts.
- Editable blocks.
- Child pages.
- Right panel tabs for Properties, Relations, Backlinks, Outgoing, Files, Local Graph, and History.

## Editor Improvements

- Persist title edits through the provider.
- Persist block edits through the provider.
- Enter creates a new paragraph block.
- To-do blocks persist checked state.
- Slash menu filters implemented block commands.
- Empty pages get a starter paragraph block.

## Relation/Backlink Foundation

- Outgoing relations come from relation records where current item is source.
- Backlinks come from relation records where current item is target.
- Wiki-link parsing remains future work and is labeled honestly.

## Nested Page Foundation

- Child pages use optional `parentId`.
- Child page creation creates a real item.
- Breadcrumbs walk parent links safely and stop on missing parents or loops.

## Template Quality Scope

Implement current useful templates:

- Blank note.
- Meeting notes.
- Lecture notes.
- Project plan.
- Document record.
- Person profile.
- Finance record.
- Calendar event.
- Tracker.

Templates create real items with starter blocks and open in the workspace.

## Tests Plan

- Add provider and page model tests using the project test script.
- Cover normalization, breadcrumbs, child creation, relations, backlinks, templates, title/block persistence, deleted state, and slash command list.

## Spaghetti Cleanup Plan

- Centralize storage through VaultProvider.
- Replace mock-only page routes with provider-backed workspace routes.
- Remove dead page actions or convert them into honest empty states.
- Reuse one generic space page where it avoids repeated route logic.

Cleanup note:

- Centralize page workspace helpers to avoid duplicating page normalization inside routes. (spaghetti code cleared)
