# Mizaan Product Blueprint

Date: 2026-06-01

## PRD Reference

- PRD exists at `docs/Plan/Mizaan_PRD.md`.
- The PRD is the product requirements and success criteria document.
- This Product Blueprint remains the implementation architecture and phase map.
- Future implementation phases must read the PRD before making product or status changes.
- Agent runbook exists at `docs/AGENT_RUNBOOK.md`; future phases should use the runbook, phase templates, QA checklist, and Mizaan npm helper scripts before implementation and closeout.

THIS IS A BLUEPRINT DOCUMENT.
IT IS NOT A CLAIM THAT ALL FEATURES ARE IMPLEMENTED.
EACH FEATURE HAS A STATUS.

This file is the clean current planning layer for Mizaan. The older
`docs/Plan/Mizaan_A_to_Z_Plan.md` remains historical source context and an
append-only implementation ledger. Future implementation prompts should read
this blueprint first, then fill one bounded phase at a time.

Status vocabulary:

- [IMPLEMENTED] - code, user-facing path when needed, persistence when stateful, tests, and verification exist for the scoped behavior.
- [PARTIAL] - some real behavior exists, but planned behavior, verification, storage, route integration, or native work is still missing.
- [BLUEPRINT ONLY] - planned in this document, not built as working app behavior.
- [NOT STARTED] - no working implementation beyond historical notes or route shells.
- [FUTURE NATIVE] - intentionally waits for Tauri, SQLite, filesystem, or Windows-native architecture.
- [FUTURE MOBILE] - intentionally waits for mobile companion planning and implementation.
- [FUTURE LOCAL AI] - intentionally waits for local AI architecture; no cloud AI dependency is allowed.
- [BLOCKED BY ARCHITECTURE] - requires a lower-level phase before it can be implemented honestly.
- [DO NOT IMPLEMENT YET] - explicitly out of scope until prerequisites are complete.

---

## 1. Executive Summary

Mizaan is a local-first, page-first personal life operating system for notes,
documents, projects, people, finance, calendar, trackers, databases, graph,
templates, vault health, and recovery tools. The current implementation is a
browser prototype using `LocalStorageVaultProvider` and provider-backed item,
block, relation, and metadata records. It is not the final Windows desktop app.
It does not have Tauri, SQLite, native filesystem access, portable vault folders,
mobile apps, encryption, OCR, real document import, or real document preview.

Product law:

- Mizaan must remain local-first.
- Mizaan must not depend on cloud services.
- Mizaan must not require an account.
- Mizaan must not use Google, OAuth, Firebase, Supabase, Clerk, auth providers, telemetry, backend sync, or hidden remote state.
- The current browser prototype is useful for shaping behavior, but browser localStorage is not lifetime storage.
- The future Windows/native version must use a native shell, SQLite runtime storage, and a human-readable portable vault folder only after those phases are built and verified.
- Mobile remains future planning only.
- A visible UI module is not proof that the module is complete; every UI status must say whether it is implemented, partial, blueprint-only, or future-only.

Blueprints are filled by bounded prompts. Each future prompt should choose one
roadmap phase, implement the scoped behavior, add tests, update this blueprint,
append the old master Markdown, update the DOCX work log, capture screenshots
when possible, commit, push, and report limitations plainly.

---

## 2. Current Implementation Truth

Current repo truth as of this blueprint pass:

- Repo: `E:\Github\Mizaan-Revamp`
- Branch: `main`
- Remote: `https://github.com/mhyahya854/Mizaan-Revamp.git`
- Latest known pre-blueprint commit: `148a8b3120bc0401c96a343aa573d4972e675daf`
- Current app type: React/TanStack/Vite browser prototype.
- Current storage: `LocalStorageVaultProvider` through `VaultProvider` interfaces.
- Current persistence: browser localStorage prototype for items, blocks, relations, provider/session/theme/right-panel state.
- Current truth warning: browser localStorage is not portable vault storage.

Current module truth:

- Home: [PARTIAL] - route exists, shows recent local items, vault health, quick capture, and template actions.
- Sidebar: [PARTIAL] - core navigation, pinned pages, page tree, system tools, pin/unpin, duplicate, trash, and child creation exist.
- Search: [PARTIAL] - provider-backed title, summary, status, category, type, tag, property, metadata, and block search exist with filters, including project/task, people/interaction, and finance metadata; saved searches and native indexes do not.
- Databases/Tables: [PARTIAL] - basic provider-backed table model, row/column/cell editing, stats, empty states, validation helper, and tests exist; full database engine does not.
- Calendar: [PARTIAL / IMPLEMENTED FOUNDATION] - local calendar module, typed event metadata helper, views, CRUD flow, Calendar detail metadata panel, relation IDs, template/command-palette creation, search metadata, graph edges, and tests exist; recurrence, reminders, ICS, native notifications, encrypted private calendar, app lock, and sync do not.
- Documents: [PARTIAL] - metadata-only document records now have typed helpers, provider-backed creation, route/list UI, detail metadata editing, template defaults, metadata search coverage, relation-id normalization helpers, tests, and browser QA. Real filesystem import, preview, OCR, thumbnails, duplicate detection, SQLite/native storage, and vault-file attachment remain not implemented.
- Projects: [PARTIAL] - typed project metadata helper, provider-backed project record creation, dedicated projects route/list, project detail metadata panel, linked task summary, project/task templates, metadata search, and project/task graph edges are implemented for the browser prototype. Full project management, kanban, timeline/Gantt, milestones, dependencies, reminders, calendar scheduling, dashboards, SQLite/native storage, and team/collaboration remain not implemented.
- Tasks: [PARTIAL] - typed task metadata helper, provider-backed task record creation, project-linked task creation/editing, task detail metadata panel, metadata search, template defaults, and graph edges are implemented for the browser prototype. There is no dedicated `/tasks` route, task database, recurring task engine, reminder engine, native notification path, dependency engine, mobile capture, or calendar-linked scheduling.
- Finance: [PARTIAL] - typed local finance metadata helper, provider-backed finance record creation, dedicated Finance route/list, finance detail metadata panel, amount/currency/date/status normalization, local summary totals, metadata search, graph edges, template defaults, and command-palette creation are implemented for the browser prototype. Bank sync/import, receipt OCR, tax/accounting systems, automated budgets, reminders, native notifications, SQLite/native storage, and encrypted private finance remain not implemented.
- Trackers: [PARTIAL] - typed tracker metadata helper, provider-backed tracker record creation, dedicated Trackers route/list, tracker detail metadata panel, target/current/frequency/check-in fields, metadata search, graph edges, template defaults, command-palette creation, and non-destructive legacy seeded-streak preservation are implemented for the browser prototype. Fake streak engines, charts, rollups, reminders, native notifications, AI coaching, wearable imports, medical tracking claims, SQLite/native storage, and encrypted private tracking remain not implemented.
- Goals: [PARTIAL] - typed goal metadata helper, provider-backed goal record creation, dedicated Goals route/list, goal detail metadata panel, target date/progress/priority fields, metadata search, graph edges including tracker links, template defaults, and command-palette creation are implemented for the browser prototype. Progress history, charts, reminders, native notifications, AI coaching, cloud sync, mobile capture, SQLite/native storage, and encrypted private goals remain not implemented.
- Graph: [PARTIAL] - graph model/helper, provider-backed global graph foundation, relation/document/project/task/people/interaction/finance/tracker/goal metadata edge extraction, parent hierarchy edges, orphan summaries, filters, direct local focus, and open-node actions are implemented for the browser prototype; backlink index, wiki links, manual canvas, saved layouts, clustering, export, and semantic/local-AI graph do not.
- Templates: [PARTIAL] - a tested static template registry now exposes implemented, partial, and future template statuses, category counts, search text, previews, safe starter blocks, future creation guards, and provider-backed creation for current module records. The `/templates` route has search, category/status filters, counts, preview, and disabled future entries. Full template editor, custom template storage, import/export, version history, AI generation, marketplace, and sync do not exist.
- Vault: [PARTIAL] - provider and health UI state prototype truth plus tested browser-prototype JSON archive export, validation, restore preview, safe merge apply, and guarded replace semantics. Portable folders, SQLite, Tauri filesystem, lock file, markdown mirrors, native backups, encrypted backups, and repair center do not exist.
- Trash: [PARTIAL] - soft trash/restore provider paths exist; retention policy, permanent deletion flow, audit history, and native recovery do not.
- Settings: [PARTIAL] - read-only prototype facts and theme controls; broad settings system does not.
- Tauri: [NOT STARTED]
- SQLite: [NOT STARTED]
- Portable vault folders: [NOT STARTED]
- Native filesystem: [NOT STARTED]
- Mobile: [NOT STARTED]
- Real document import/preview/OCR: [NOT STARTED]
- Browser-prototype archive/export/restore: [IMPLEMENTED] - JSON archive helpers, validation, restore preview, safe merge, explicit-confirmation replace guard, round-trip/corruption tests, and Settings/Vault UI exist for current provider/localStorage data only.
- Full native backup/export/restore: [NOT STARTED] - no native filesystem backup, SQLite backup, encrypted backup, portable vault backup, markdown mirror backup, or final import/export manager exists.
- Encryption/app lock/private pages: [NOT STARTED]
- Workflow acceleration and agent run system: [IMPLEMENTED] - runbook docs, phase templates, QA checklist, red-flag scan rules, next-phase queue, fast prompt template, PowerShell helper scripts, package shortcuts, and browser QA helper exist. These are engineering workflow helpers only; they do not change product storage or implement native infrastructure.

---

## 3. Workflow Acceleration Status

- Agent run system: [IMPLEMENTED] - `docs/AGENT_RUNBOOK.md`, phase templates, closeout template, QA checklist, red-scan rules, next-phase queue, and fast prompt template exist.
- QA automation status: [PARTIAL] - package shortcuts run preflight, fast verification, full verification, red scans, and route/screenshot browser QA. Human review, product judgment, DOCX visual render, and console inspection may still require manual work.
- Phase template status: [IMPLEMENTED] - future phases can start from `docs/PHASE_TEMPLATE.md` and close with `docs/PHASE_CLOSEOUT_TEMPLATE.md`.
- Red-scan script status: [IMPLEMENTED] - `scripts/mizaan-red-scan.ps1` runs categorized checks and fails on blocking source debug/fake-readiness/runtime URL issues.
- Browser QA script status: [PARTIAL] - `scripts/mizaan-browser-qa.ps1` starts a local dev server when needed, checks key routes by HTTP, captures isolated Chrome/Edge screenshots when available, and writes local logs under `docs/logs`; it does not capture browser console errors in its current HTTP/headless screenshot mode.
- Future phase acceleration status: [IMPLEMENTED] - package scripts let future prompts call standardized commands instead of restating every gate. The scripts are workflow helpers, not final native infrastructure.

---

## 4. Product Laws

1. Local-first by default.
2. No cloud dependency.
3. No Google dependency.
4. No account dependency.
5. No hidden sync.
6. No fake readiness.
7. No destructive migrations.
8. No clearing user storage.
9. Every user action must be honest.
10. Every future feature must say future until implemented.
11. Master plan and blueprint must remain traceable.
12. Tests are required before claiming implemented.
13. Browser prototype storage is not lifetime storage.
14. Native storage must not be claimed before Tauri, SQLite, and filesystem phases exist.
15. UI must never mislead users.

---

## 5. Information Architecture

### Core Modules

- Home - the daily starting point, recent work, quick capture, and vault truth.
- Search - local provider search over current prototype records.
- Databases - table/database surfaces.
- Graph - relation map and future knowledge graph surfaces.
- Calendar - app-level time module, not a normal promoted page.

### Page And Workspace Modules

- Notes - note pages and writing spaces.
- Documents - metadata records now, future native file records later.
- Projects - provider-backed project pages and linked task foundations.
- Tasks - provider-backed task records linked to projects; a route-level task workspace remains future.
- People - local personal profiles and relationship context.
- Finance - local financial records without bank sync.
- Trackers - provider-backed local tracker records.
- Goals - provider-backed local goal records.
- Custom pages/spaces - user-created page trees.

### System Tools

- Templates - creation sources, not ordinary documents.
- Vault - provider/storage health and future vault infrastructure.
- Import/Export Manager - browser archive JSON manager for current provider data.
- Repair Center - browser prototype health checks and recovery guidance.
- Trash - recovery infrastructure.
- Settings - app behavior and status controls.

### Blueprint-Only Or Future System Tools

- Imports - browser archive JSON import manager exists; broader native/file imports remain future.
- Exports - browser archive JSON export manager exists; markdown/CSV/PDF/native exports remain future.
- Backups - future backup and restore manager.
- Migration Center - future schema/provider migration UI.
- Privacy/Lock Center - future app lock, private pages, and encryption UX.
- Plugin Manager - future and explicitly not started.
- Local AI Center - future local-only AI planning; no cloud AI.
- Release/Update Center - future Windows release/update surface.

Calendar, Graph, and Search are core modules. Notes, Documents, Projects,
People, Finance, Trackers, Goals, and custom pages can be page-like spaces.
Templates create items. Vault and Trash are infrastructure. Blueprint UI may
show future modules, but it must label them honestly and avoid fake controls.

---

## 6. Feature Status Matrix

| Area | Feature | Status | User-visible UI status | Data model status | Persistence status | Test status | Current limitation | Next implementation batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Core | Home | [PARTIAL] | Route exists | Provider snapshot | localStorage prototype | Covered indirectly | Not full dashboard or native home | Improve after module foundations |
| Core | Sidebar | [PARTIAL] | Navigation and page tree exist | Item metadata | localStorage prototype | Sidebar tree tests exist | Blueprint modules not fully visible yet | Blueprint UI baseline |
| Core | Search | [PARTIAL] | Route exists | Search helper | localStorage prototype | Unit tests exist | No saved searches or extracted document text | Search metadata expansion |
| Core | Databases | [PARTIAL] | Route and table page exist | Database metadata helper | localStorage prototype | Unit and browser QA exist | No filters/sorts/views/formulas/rollups | Database views and filters |
| Core | Graph | [PARTIAL] | Filterable route and local focus foundation | Provider items, relations, document metadata arrays, parentId hierarchy | localStorage prototype | Graph helper tests and browser QA | No backlink index/wiki links/manual canvas/export | Graph search/canvas later |
| Core | Calendar | [PARTIAL / IMPLEMENTED FOUNDATION] | Route exists with provider-backed events | Typed calendar event helper | localStorage prototype | Helper, graph, and search tests added; browser QA attempted | No recurrence/reminders/ICS/native notifications/sync | Template expansion or version history |
| System | Templates | [PARTIAL] | Template picker plus searchable/filterable `/templates` registry route exist | Static template definitions with status/category/preview metadata | provider-backed creations | Page template tests, template registry tests, full validation, and browser QA exist | No template editor, custom templates, version history, import/export, AI generation, marketplace, or sync | Version history or template management only after scoped data model |
| System | Vault | [PARTIAL] | Route exists with provider truth and browser archive controls | Provider info/health plus archive helper model | localStorage prototype | Provider and archive tests exist | No portable folder/SQLite/native/encrypted backup | Native readiness after archive hardening |
| System | Trash | [PARTIAL] | Route exists | deletedAt records | localStorage prototype | Limited | No retention/permanent deletion policy | Repair/recovery center |
| System | Settings | [PARTIAL] | Route exists | Theme/session/provider facts | localStorage prototype | Theme tests exist | Mostly read-only | Settings hardening |
| Pages | Notes | [PARTIAL] | Route/space exists | Item/block model | localStorage prototype | Page workspace tests | Rich text incomplete | Editor hardening |
| Pages | Documents | [PARTIAL] | Metadata-only records route and detail panel exist | Typed document metadata in item metadata | localStorage prototype | Helper tests and browser QA | Real import/preview/OCR/native storage missing | Native document import later |
| Pages | Projects | [PARTIAL] | Dedicated route/list and project detail metadata panel exist | Typed project metadata in item metadata | localStorage prototype | Helper/search/graph/template tests and browser QA | No kanban, timeline/Gantt, milestones, dependencies, reminders, native storage, or dashboards | People/CRM foundation |
| Pages | Tasks | [PARTIAL] | Project-linked task section and task metadata panel exist; no `/tasks` route | Typed task metadata in item metadata | localStorage prototype | Helper/search/graph/template tests and browser QA | No dedicated task route, task database, recurrence, reminders, notifications, dependencies, or calendar scheduling | People/CRM foundation |
| Pages | People | [PARTIAL] | Dedicated provider-backed route/list, person detail metadata panel, and interaction foundation exist | Typed person and interaction metadata in `MizaanItem.metadata` | localStorage prototype | Person/interaction helper tests, graph/search/template tests, and browser QA | No contact import/sync, encryption/app lock, hidden search/graph privacy, analytics, mobile capture, or full CRM timeline | Finance foundation |
| Pages | Finance | [PARTIAL] | Dedicated provider-backed route/list and finance detail metadata panel exist | Typed finance metadata in `MizaanItem.metadata` | localStorage prototype | Finance helper, graph, search, template tests, and browser QA | No bank sync/import, receipt OCR, tax/accounting, automated budgets, reminders, native storage, or encrypted private finance | Trackers/goals foundation |
| Pages | Trackers | [PARTIAL] | Dedicated provider-backed route/list and tracker detail metadata panel exist | Typed tracker metadata in `MizaanItem.metadata` | localStorage prototype | Tracker helper, graph, search, template tests, and browser QA | No fake streak engine, charts, rollups, reminders, native notifications, wearable import, or medical tracking | Tracker views/history later |
| Pages | Goals | [PARTIAL] | Dedicated provider-backed route/list and goal detail metadata panel exist | Typed goal metadata in `MizaanItem.metadata` | localStorage prototype | Goal helper, graph, search, template tests, and browser QA | No progress history, charts, reminders, native notifications, AI coaching, cloud sync, or mobile capture | Goal views/history later |
| Pages | Custom pages | [PARTIAL] | Page workspace exists | Item/block model | localStorage prototype | Page workspace tests | No full schema/versioning | Editor and metadata hardening |
| Pages | Page data panel | [PARTIAL] | Right panel exists | Workspace model | localStorage prototype | Limited | Many panes are informational only | Page data hardening |
| Pages | Relations | [PARTIAL] | Relation panel exists | Relation records | localStorage prototype | Provider tests | No rich relation picker | Graph relation foundation |
| Pages | Backlinks | [PARTIAL] | Panel exists | Relation lookup | localStorage prototype | Limited | No wiki-link parsing | Graph relation foundation |
| Pages | Subpages | [PARTIAL] | Create child exists | parentId and relation | localStorage prototype | Page workspace tests | No drag tree ordering | Page workspace hardening |
| Editor | Rich text | [PARTIAL] | Basic text blocks | Blocks | localStorage prototype | Limited | No marks/inline formatting | Editor foundation |
| Editor | Blocks | [PARTIAL] | Basic block editor | Block records | localStorage prototype | Limited | Limited block types | Editor foundation |
| Editor | Slash commands | [PARTIAL] | Implemented command menu | Block definitions | localStorage prototype | Limited | No custom commands | Editor foundation |
| Editor | Tables | [PARTIAL] | Simple table block exists | Table helper | localStorage prototype | Unit tests | No import/export/formulas | Database/table expansion |
| Editor | Todos | [PARTIAL] | Todo blocks exist | checked flag | localStorage prototype | Limited | Todo blocks are separate from provider-backed task records | Editor/task bridge later |
| Editor | Headings | [PARTIAL] | Heading blocks exist | Block type | localStorage prototype | Limited | No outline nav | Editor foundation |
| Editor | Callouts | [PARTIAL] | Callout blocks exist | Block type | localStorage prototype | Limited | Basic only | Editor foundation |
| Editor | Code blocks | [PARTIAL] | Code block type exists | Block type | localStorage prototype | Limited | No syntax highlighting | Editor foundation |
| Editor | Markdown shortcuts | [BLUEPRINT ONLY] | Not implemented | Not modeled | None | None | Slash commands only | Editor foundation |
| Editor | Drag/drop blocks | [BLUEPRINT ONLY] | Not implemented | Not modeled | None | None | No reordering UI | Editor foundation |
| Editor | Version history | [NOT STARTED] | Not visible | Not modeled | None | None | Needs storage/version layer | Version history |
| Editor | Export | [NOT STARTED] | Not visible | Not modeled | None | None | Needs export manager | Import/export manager |
| Documents | Metadata records | [IMPLEMENTED] | Dedicated metadata-only records exist | Typed document metadata helper | localStorage prototype | Unit tests and browser QA | Prototype storage only | Native storage later |
| Documents | Record creation | [IMPLEMENTED] | New document record action works | `createDocumentRecordInput` | localStorage prototype | Unit tests and browser QA | Creates records only, not files | Native file attachment later |
| Documents | Route/list foundation | [IMPLEMENTED] | Documents route lists real records with metadata states | Provider-backed document items | localStorage prototype | Browser QA | No bulk actions or import manager | Documents route expansion later |
| Documents | Detail metadata UI | [IMPLEMENTED] | Page right panel edits title, kind, status, source, date, file metadata, and notes | Item metadata | localStorage prototype | Browser QA | No rich relation picker or file attachment | Relation UI/native file phase |
| Documents | Template defaults | [IMPLEMENTED] | General, receipt, identity, invoice, contract, and reference record templates exist | Template metadata defaults | localStorage prototype | Unit tests | No template editor | Templates expansion |
| Documents | File import | [FUTURE NATIVE] | Should be future-only | Not modeled | None | None | Needs native filesystem | Native filesystem document import |
| Documents | PDF preview | [NOT STARTED] | Should be future-only | Not modeled | None | None | No renderer | Native/filesystem later |
| Documents | DOCX preview | [NOT STARTED] | Should be future-only | Not modeled | None | None | No renderer | Native/filesystem later |
| Documents | Image preview | [NOT STARTED] | Should be future-only | Not modeled | None | None | No file storage | Native/filesystem later |
| Documents | OCR | [FUTURE LOCAL AI] | Should be future-only | Not modeled | None | None | No local AI/OCR engine | Local AI planning |
| Documents | Tags/categories | [PARTIAL] | Record tags persist | Item tags and document metadata tags | localStorage prototype | Unit tests | No document taxonomy manager | Documents taxonomy later |
| Documents | Relations | [PARTIAL] | Generic relation panel plus normalized relation-id metadata helper | Relation records and metadata arrays | localStorage prototype | Unit tests/provider tests | No document-specific relation picker | Graph relation foundation |
| Documents | Search indexing | [PARTIAL] | Metadata fields are searchable through existing search route | Search helper indexes item metadata | localStorage prototype | Unit tests and browser QA | No extracted file text/OCR index | Native document index later |
| Documents | Duplicate detection | [NOT STARTED] | Not visible | Not modeled | None | None | Needs file hashes/storage | Future native/local AI |
| Documents | Similarity suggestions | [FUTURE LOCAL AI] | Not visible | Not modeled | None | None | Needs local embeddings | Local AI planning |
| Databases | Rows | [IMPLEMENTED] | Add/delete/edit basic rows | Database helper | localStorage prototype | Unit and browser QA | Prototype only | Database views and filters |
| Databases | Columns | [IMPLEMENTED] | Add/rename/delete basic columns | Database helper | localStorage prototype | Unit and browser QA | Basic types only | Database views and filters |
| Databases | Cell editing | [IMPLEMENTED] | Editable cells | Database helper | localStorage prototype | Unit and browser QA | No rich cell types | Database views and filters |
| Databases | Row-as-page | [PARTIAL] | Foundation exists | Item/metadata link | localStorage prototype | Tests | No full row detail UI | Database views and filters |
| Databases | Filters | [NOT STARTED] | Not visible | Not modeled | None | None | No filter model | Database views and filters |
| Databases | Sorting | [NOT STARTED] | Not visible | Not modeled | None | None | No sort model | Database views and filters |
| Databases | Grouping | [NOT STARTED] | Not visible | Not modeled | None | None | No grouping model | Later database phase |
| Databases | Board view | [NOT STARTED] | Not visible | Not modeled | None | None | No view engine | Later database phase |
| Databases | Calendar view | [NOT STARTED] | Not visible | Not modeled | None | None | No view engine | Later database phase |
| Databases | Gallery view | [NOT STARTED] | Not visible | Not modeled | None | None | No view engine | Later database phase |
| Databases | Timeline view | [NOT STARTED] | Not visible | Not modeled | None | None | No view engine | Later database phase |
| Databases | Relations | [NOT STARTED] | Not visible as property | Not modeled | None | None | No relation property type | Later database phase |
| Databases | Rollups | [NOT STARTED] | Not visible | Not modeled | None | None | Needs relations and formulas | Later database phase |
| Databases | Formulas | [NOT STARTED] | Not visible | Not modeled | None | None | Needs expression engine | Later database phase |
| Databases | CSV import/export | [NOT STARTED] | Not visible | Not modeled | None | None | Needs import/export manager | Import/export manager |
| Calendar | Month | [IMPLEMENTED FOUNDATION] | Works with provider-backed events | Calendar helper | localStorage prototype | Helper tests and browser QA screenshots | No final native calendar engine | Later scheduling/native phase |
| Calendar | Week | [IMPLEMENTED FOUNDATION] | Shows provider-backed events | Calendar helper | localStorage prototype | Helper tests and browser QA screenshots | No drag/resize scheduling | Later scheduling/native phase |
| Calendar | Day | [IMPLEMENTED FOUNDATION] | Shows provider-backed all-day/timed events | Calendar helper | localStorage prototype | Helper tests and browser QA screenshots | No drag/resize scheduling | Later scheduling/native phase |
| Calendar | Agenda | [IMPLEMENTED FOUNDATION] | Shows provider-backed event list | Calendar helper | localStorage prototype | Helper tests and browser QA screenshots | No saved agenda filters | Later scheduling/native phase |
| Calendar | Event create/edit/delete | [IMPLEMENTED FOUNDATION] | Create/edit works in prototype; move-to-trash exists | Typed Calendar helper/item records | localStorage prototype | Helper tests, full validation, and browser QA | No recurrence/reminders/native notifications; delete proof limited to existing move-to-trash behavior | Later scheduling phase |
| Calendar | All-day | [IMPLEMENTED FOUNDATION] | Route edit toggles all-day state | Typed Calendar helper | localStorage prototype | Tests and browser QA | No recurrence rules | Later scheduling phase |
| Calendar | Timed | [IMPLEMENTED FOUNDATION] | Route creation creates timed event defaults | Typed Calendar helper | localStorage prototype | Tests and browser QA | Native date/time automation was limited during browser QA; no drag/resize scheduling | Later scheduling phase |
| Calendar | Recurrence | [NOT STARTED] | Not visible as working | Not modeled | None | None | Requires recurrence rules | Later calendar phase |
| Calendar | Reminders | [FUTURE NATIVE] | Not visible | Not modeled | None | None | Needs native notifications | Native Windows readiness |
| Calendar | Task links | [PARTIAL] | Metadata relations can reference calendar ids | Relations/task metadata | localStorage prototype | Helper tests | No calendar-linked scheduling, reminders, recurrence, or native notifications | Later calendar/task scheduling phase |
| Calendar | ICS | [NOT STARTED] | Not visible | Not modeled | None | None | Needs import/export | Import/export manager |
| Graph | Global graph foundation | [IMPLEMENTED] | Route renders real nodes, edges, summaries, filters, orphan state, and node open actions | Provider items, provider relations, document metadata arrays, parentId hierarchy | localStorage prototype | Graph helper tests and browser QA | No backlink index/wiki-link parser/manual layout engine | Graph search/canvas later |
| Graph | Local automatic graph foundation | [PARTIAL] | Direct selected-node focus panel exists | Graph helper direct-neighbor model | localStorage prototype | Graph helper tests and browser QA | No second-degree expansion, wiki-link parsing, or saved layouts | Local graph expansion |
| Graph | Manual local canvas | [NOT STARTED] | Not visible | Not modeled | None | None | No canvas model | Later graph/canvas phase |
| Graph | Editable nodes | [NOT STARTED] | Not visible | Not modeled | None | None | No graph editor | Later graph/canvas phase |
| Graph | Directed arrows | [PARTIAL] | Relation lines exist | Relation records | localStorage prototype | Limited | No direction UI | Graph relation foundation |
| Graph | Filters | [IMPLEMENTED] | All, documents, pages/notes, projects, people, finance, orphans, and connected filters work on real graph nodes | Graph model node metadata | localStorage prototype | Browser QA | No saved graph views | Graph search/canvas later |
| Graph | Clustering | [NOT STARTED] | Not visible | Not modeled | None | None | No graph engine | Later graph/canvas phase |
| Graph | Focus mode | [PARTIAL] | Direct local focus panel works for selected real nodes | Graph helper direct-neighbor model | localStorage prototype | Graph helper tests and browser QA | No second-degree expansion or saved layout | Local graph expansion |
| Graph | Export image/PDF | [NOT STARTED] | Not visible | Not modeled | None | None | Needs export manager | Import/export manager |
| Vault/storage | VaultProvider | [PARTIAL] | Used app-wide | Interface exists | localStorage prototype | Provider tests | Final providers missing | Native readiness |
| Vault/storage | LocalStorage provider | [IMPLEMENTED] | Labeled prototype | Provider exists | browser localStorage | Provider tests | Prototype only | Keep until native storage |
| Vault/storage | SQLite provider | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs SQLite architecture | SQLite provider |
| Vault/storage | File vault | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs Tauri filesystem | Portable vault folders |
| Vault/storage | Lock file | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs filesystem | Portable vault folders |
| Vault/storage | Browser archive backup | [IMPLEMENTED] | Settings and Vault expose export/validate/preview/apply controls with prototype-only warnings | Versioned JSON archive with provider/source/counts/checksums/warnings | localStorage prototype archive only | Archive/provider round-trip tests and browser QA | Not native filesystem, SQLite, encrypted, or portable-vault backup | Native backup design later |
| Vault/storage | Restore preview | [IMPLEMENTED] | Restore preview reports create/update/remove/block-change counts before mutation | Restore plan model | localStorage prototype archive only | Archive/provider tests and browser QA | Preview does not solve final native migrations | Migration center later |
| Vault/storage | Restore merge | [IMPLEMENTED] | Apply Merge is available after valid preview | Merge restore plan | localStorage prototype provider | Archive/provider tests and browser QA | Browser prototype only; no cross-provider conflict policy | Migration/repair later |
| Vault/storage | Restore replace | [PARTIAL] | Replace requires explicit confirmation text before apply | Replace restore plan and confirmation flag | localStorage prototype provider | Archive/provider tests | No native rollback/history; guarded browser replace only | Repair/recovery center later |
| Vault/storage | Export manager | [PARTIAL] | `/import-export` route exposes browser archive export and future-only format limitations | Browser archive helper plus manager state helpers | localStorage prototype archive only | Archive/helper/product-map tests and browser QA | No selected-data, markdown, CSV, PDF, native, SQLite, encrypted, or portable-vault export | Future readable export formats |
| Vault/storage | Import manager | [PARTIAL] | `/import-export` route exposes paste/load JSON, validate, preview, safe merge, and guarded replace | Archive parse/preview plus manager state helpers | localStorage prototype archive only | Archive/helper/product-map tests and browser QA | No native file, folder, markdown, CSV, PDF, document, SQLite, encrypted, or portable-vault import | Future native import design |
| Vault/storage | Markdown mirrors | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs file vault writer | Markdown mirrors |
| Vault/storage | Repair/recovery | [PARTIAL] | `/repair` route exposes health checks, issue list, suggestions, and archive recovery controls | Vault health summary and archive restore plan | Read-only health checks plus localStorage prototype archive restore | Vault health/helper/product-map tests and browser QA | No automatic repair, migration rollback, native recovery, SQLite repair, encrypted recovery, or logs | Repair rule expansion later |
| Vault/storage | Migration | [NOT STARTED] | Not working | Not modeled | None | None | Needs migration manifests | Migration center |
| Security | Privacy mode | [NOT STARTED] | Not working | Not modeled | None | None | Requires privacy model | Privacy/lock UX |
| Security | Private pages | [NOT STARTED] | Not working | Not modeled | None | None | Requires privacy model | Privacy/lock UX |
| Security | App lock | [FUTURE NATIVE] | Not working | Not modeled | None | None | Requires native/security design | Privacy/lock UX |
| Security | Encryption | [DO NOT IMPLEMENT YET] | Not working | Not modeled | None | None | Requires serious design | Later security phase |
| Security | Hidden workspaces | [NOT STARTED] | Not working | Not modeled | None | None | Requires privacy model | Privacy/lock UX |
| Security | Hide from graph/search | [NOT STARTED] | Not working | Not modeled | None | None | Requires privacy-aware indexes | Privacy/lock UX |
| Native/mobile | Tauri | [FUTURE NATIVE] | Not working | Not modeled | None | None | No shell | Tauri shell |
| Native/mobile | Windows installer | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs native app | Windows release hardening |
| Native/mobile | Portable build | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs native app | Windows release hardening |
| Native/mobile | Native filesystem | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs Tauri commands | Native filesystem document import |
| Native/mobile | Native notifications | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs native shell | Native Windows readiness |
| Native/mobile | Android | [FUTURE MOBILE] | Not working | Not modeled | None | None | Needs mobile plan | Mobile companion planning |
| Native/mobile | iOS | [FUTURE MOBILE] | Not working | Not modeled | None | None | Needs mobile plan | Mobile companion planning |
| Native/mobile | USB workflow | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs portable vault | Portable vault folders |
| Native/mobile | Conflict handling | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs multi-device story | Portable vault folders |

---

## 7. Module Blueprints

Each module below defines what should exist, what exists now, and what counts as
done. The current app may show a module card before the module is complete, but
the UI must show its status.

### 6.1 Home

- Purpose: open the day, show recent work, quick capture, and storage truth.
- User mental model: start here, then jump to pages/modules.
- Current status: [PARTIAL]
- UI now: current route, recent items, quick actions, vault warning.
- Implemented now: quick capture note creation, template picker, vault stats.
- Not implemented yet: customizable dashboard, widgets, saved views.
- Data model: provider snapshot items, blocks, relations, health.
- Routes: `/`
- Main components: home route, template picker, provider snapshot.
- Empty states: recent/project/calendar/tracker sections say when empty.
- Error states: provider warnings only.
- Actions: create note/project/document/finance/calendar record via templates.
- Disabled/future actions: no fake dashboard settings.
- Tests required: quick capture, template creation, status cards after UI baseline.
- Screenshots required: home and sidebar.
- Done criteria: all home cards are honest, persisted quick capture works, tests and QA pass.
- Future phases: module summaries, saved local views, better keyboard actions.

### 6.2 Search

- Purpose: find local pages and records.
- User mental model: search the active local prototype vault.
- Current status: [PARTIAL]
- UI now: search route with filters and result list.
- Implemented now: helper-backed search across titles, metadata, properties, tags, statuses, blocks.
- Not implemented yet: saved searches, index persistence, extracted document text, OCR text, graph search.
- Data model: provider snapshot and search helper results.
- Routes: `/search`
- Main components: search route and `search-index` helper.
- Empty states: blank query shows recent items; unmatched query shows no results.
- Error states: none beyond route errors.
- Actions: search and filter.
- Disabled/future actions: no fake OCR/document-content search.
- Tests required: search helper tests and route QA.
- Screenshots required: search results after query.
- Done criteria: local results are accurate and no remote calls exist.
- Future phases: document metadata search, saved queries, native index.

### 6.3 Databases

- Purpose: manage local table/database pages.
- User mental model: lightweight Notion-like table foundation, not final database engine.
- Current status: [PARTIAL]
- UI now: database list route and table page.
- Implemented now: row/column/cell editing, stats, empty states, validation helper, provider persistence.
- Not implemented yet: filters, sorting, grouping, board/gallery/calendar/timeline views, formulas, rollups, relation properties, CSV import/export.
- Data model: database metadata on item metadata.
- Routes: `/databases`, `/page/$id` for database pages.
- Main components: databases route, `DatabaseTable`, database helper.
- Empty states: no database pages, no rows, no properties.
- Error states: validation helper exists but UI warning is future.
- Actions: create database, add/delete rows, add/rename/delete columns, edit cells.
- Disabled/future actions: no fake view buttons.
- Tests required: helper tests, provider persistence, browser CRUD proof.
- Screenshots required: database list and table edit proof.
- Done criteria: all visible actions work and persist.
- Future phases: views and filters, richer property schema, SQLite provider.

### 6.4 Graph

- Purpose: visualize relations across local items.
- User mental model: see connected pages and relation links.
- Current status: [PARTIAL]
- UI now: provider-backed global graph route with summaries, filters, node/edge lists, a visual map, direct local focus, orphan state, source summaries, and open-node actions.
- Implemented now: tested `src/lib/graph/graph-model.ts` helper, provider items as nodes, explicit provider relations as edges, document relation metadata arrays as edges when targets exist, parentId hierarchy as edges, deterministic edge IDs, duplicate/invalid edge filtering, orphan detection, global summary counts, direct local graph builder, route filters, and focus/open behavior.
- Not implemented yet: backlink index, wiki-link parsing, manual canvas, editable standalone nodes, manual arrows, saved layouts, clustering, export, graph search, privacy-aware hiding, embeddings, OCR-derived graph edges, and semantic/local-AI graph.
- Data model: `MizaanRelation`, provider `MizaanItem`, document metadata arrays, parentId hierarchy, and graph helper models.
- Routes: `/graph`
- Main components: graph route.
- Empty states: sparse/empty graph explains current relation limits.
- Error states: invalid/missing relation targets are skipped; orphan nodes are labeled.
- Actions: filter, focus, and open real nodes.
- Disabled/future actions: no fake graph editing, fake canvas controls, fake export, or fake AI graph controls.
- Tests required: graph helper tests exist.
- Screenshots required: graph route, global/filter state, local focus, orphan state, and open-node proof.
- Done criteria: full Graph remains partial until backlink indexing, wiki-link parsing, manual graph/canvas, saved layouts, export, privacy-aware graph hiding, and later native graph persistence are implemented.
- Future phases: graph relation foundation and canvas.

### 6.5 Calendar

- Purpose: manage local time and events.
- User mental model: app-level calendar, not a normal page.
- Current status: [PARTIAL]
- UI now: route with month/week/day/agenda and event editor.
- Implemented now: core event helpers, local event records, create/edit/delete flow, filters.
- Not implemented yet: recurrence, reminders, ICS, native notifications, sync.
- Data model: calendar metadata/properties on provider items plus helper normalization.
- Routes: `/calendar`, `/page/$id` for event pages if opened as records.
- Main components: `CalendarView`, calendar helper.
- Empty states: no events in range.
- Error states: invalid date repair by helper.
- Actions: create, edit, delete/archive event.
- Disabled/future actions: no reminders/sync buttons.
- Tests required: helper tests and browser QA.
- Screenshots required: calendar view and event editor.
- Done criteria: event CRUD and all-day/timed behavior verified.
- Future phases: recurrence and native notifications later.

### 6.6 Notes

- Purpose: writing, thinking, lists, and page-based knowledge.
- User mental model: pages made of blocks.
- Current status: [PARTIAL]
- UI now: notes route, note templates, page workspace.
- Implemented now: block editor foundation and basic note templates.
- Not implemented yet: rich inline marks, drag/drop, markdown shortcuts, version history, export.
- Data model: `MizaanItem` and `MizaanBlock`.
- Routes: `/notes`, `/page/$id`
- Main components: `SpacePage`, `PageWorkspace`, `PageEditorSurface`.
- Empty states: no local pages.
- Error states: page not found.
- Actions: create pages, edit title, edit blocks, archive.
- Disabled/future actions: icon editing is labeled future.
- Tests required: page workspace and block behavior tests.
- Screenshots required: notes page and editor.
- Done criteria: persisted edits and no fake editor controls.
- Future phases: editor foundation and version history.

### 6.7 Documents

- Purpose: organize important document records now and attach real files later.
- User mental model: a document record is a local page containing metadata and notes.
- Current status: [PARTIAL]
- UI now: documents route is a dedicated metadata-only document record list with provider-backed creation, record template buttons, metadata state badges, and honest unsupported import/preview/storage messaging.
- Implemented now: typed document metadata helper, metadata normalization/update/create helpers, provider-backed new record action, detail metadata editor in the page right panel, document template defaults, relation-id normalization helpers, and metadata search coverage through the existing local search index.
- Not implemented yet: real file import, folder/batch/drag-drop import, PDF/DOCX/image preview, OCR, thumbnails, extracted text indexing, duplicate detection, similarity suggestions, native vault file storage, SQLite document storage, Tauri filesystem commands, document encryption/app lock, cloud sync, Google Drive sync, and mobile document capture.
- Data model: document fields live in provider-backed `MizaanItem.metadata` in the current browser/localStorage prototype; future native phases need SQLite rows plus vault file pointers.
- Routes: `/documents`, `/page/$id`
- Main components: documents route, `DocumentMetadataPanel`, and `src/lib/documents/document-record.ts`.
- Empty states: explain metadata-only record creation and future native import.
- Error states: unsupported import/preview/storage state is visible in route and detail UI.
- Actions: create metadata-only document record; create from document record templates; edit metadata fields in the page right panel.
- Disabled/future actions: import, preview, OCR, thumbnails, native file paths.
- Tests required: helper tests exist for defaults, enum normalization, update preservation, relation-id normalization, create input, template defaults, state honesty, and search metadata coverage. Route/detail UI remains covered by browser QA rather than component tests.
- Screenshots required: captured for documents route, new record, metadata panel, unsupported state, search, and persistence proof.
- Done criteria: foundational metadata-only record phase is implemented and verified, but the overall Documents module remains partial until real file import/preview/native storage exists.
- Future phases: native file import, preview, local OCR.

### 6.8 Projects

- Purpose: long-running threads of work and tasks.
- User mental model: a project page with milestones, tasks, and relations.
- Current status: [PARTIAL]
- UI now: dedicated `/projects` list backed by real project records, project cards with status/priority/deadline/task/relation counts, and a project metadata panel in the page right panel.
- Implemented now: typed project metadata helper, provider-backed project record creation, project status/priority/deadline/area/description/notes editing, linked task count, linked document/person/finance counts, project templates, metadata search, and project/task graph edge extraction.
- Not implemented yet: full project dashboard, milestones, kanban boards, timeline/Gantt, dependency graph, project budget automation, calendar-linked task scheduling, recurring tasks, reminders, native notifications, AI planning, team/collaboration, mobile task capture, SQLite/native storage, and portable vault storage.
- Data model: provider-backed `MizaanItem` with `category: "projects"`, `type: "project"`, and normalized project metadata in `item.metadata`.
- Routes: `/projects`, `/page/$id`
- Main components: dedicated projects route, `ProjectMetadataPanel`, `PageWorkspace`, `PageRightPanel`, and project helper modules.
- Empty states: no project records yet, with a real New project action.
- Error states: generic page errors.
- Actions: create provider-backed project record, edit project metadata, open project detail/page, create linked task records from a project, and search project metadata.
- Disabled/future actions: kanban, timeline/Gantt, recurring tasks, reminders, native notifications, dependency graph, AI planning, and calendar scheduling remain future-only and are not active controls.
- Tests required: project record helper, project/task graph integration, project metadata search, and project template defaults are covered by unit tests; route/detail flows are covered by browser QA.
- Screenshots required: project route, new project, metadata panel, task section, graph, and persistence proof are captured for this phase.
- Done criteria: scoped foundation is implemented and verified for the browser/localStorage prototype; overall Projects remains partial until fuller planning views, scheduling, native storage, and dashboard work exist.
- Future phases: People/CRM foundation next; later project phases should add views only after typed people/finance/calendar relations are stronger.

### 6.8.1 Tasks

- Purpose: actionable work records that can be linked to projects and later to calendar/reminder systems.
- User mental model: a task is a local provider-backed item with status, priority, due date, and project relation.
- Current status: [PARTIAL]
- UI now: project-linked task creation/list/editing inside project detail metadata, plus a task metadata panel when opening a task page.
- Implemented now: typed task metadata helper, provider-backed task record creation, status/priority/due date/notes editing, project relation, task template defaults, metadata search, graph edges, and project task counts.
- Not implemented yet: dedicated `/tasks` route, task database/list route, kanban, recurring tasks, reminders, native notifications, calendar scheduling, dependency engine, AI planning, team/collaboration, and mobile capture.
- Data model: provider-backed `MizaanItem` with `category: "tasks"`, `type: "task"`, and normalized task metadata in `item.metadata`.
- Routes: `/page/$id` for task record pages; no dedicated task route exists yet.
- Main components: `ProjectMetadataPanel`, `TaskMetadataPanel`, task helper module, and graph/search/template integration.
- Empty states: projects show an honest empty linked-task state with a real New task action.
- Error states: generic page errors.
- Actions: create linked task, edit task title/status/priority/due date/notes, mark done through status, open task page, and search task metadata.
- Disabled/future actions: recurrence, reminder scheduling, native notifications, calendar scheduling, dependencies, AI planning, and mobile capture.
- Tests required: task metadata helper, task search metadata, task graph relations, and task template defaults are covered by unit tests; linked task creation/edit/refresh is covered by browser QA.
- Screenshots required: task section and persistence proof are captured for this phase.
- Done criteria: scoped task foundation is implemented and verified in the browser/localStorage prototype; overall Tasks remains partial until route-level task management and scheduling/reminder systems exist.
- Future phases: route-level task workspace later, after People/CRM and Finance foundations improve relation targets.

### 6.9 People

- Purpose: local relationship context and personal profiles.
- User mental model: people are local profile pages, not a cloud CRM.
- Current status: [PARTIAL]
- UI now: dedicated provider-backed People route, person records list, person templates, person detail metadata panel, and linked interaction section.
- Implemented now: typed local person metadata, typed interaction metadata, provider-backed person creation, provider-backed linked interaction creation/editing, relationship type/status fields, contact-context fields, follow-up metadata, private/sensitive metadata badges, graph relations, search metadata, and template defaults for the browser/localStorage prototype.
- Not implemented yet: Google Contacts, contact import/sync, phone contact import, email/message import, encrypted private contacts, real app lock/privacy lock, hidden-from-search behavior, hidden-from-graph behavior, native reminders, CRM automation, mobile capture, and full interaction timeline.
- Data model: provider-backed `MizaanItem.metadata` with typed person/interaction helper normalization.
- Routes: `/people`, `/page/$id`
- Main components: `PeoplePage`, `PageWorkspace`, `PageRightPanel`, `PeopleMetadataPanel`.
- Empty states: honest empty state with working New person action.
- Error states: provider errors remain surfaced through the shared provider/UI patterns.
- Actions: create person record, open person page, edit person metadata, mark private/sensitive as metadata only, create linked interaction record, edit interaction metadata, search person metadata, and show graph person/interaction relations.
- Disabled/future actions: no cloud contact sync, Google Contacts, contact import, real privacy lock, fake encryption, fake reminders, or CRM integrations.
- Tests required: [IMPLEMENTED] person metadata helper, interaction metadata helper, graph relations, search metadata, and template defaults.
- Screenshots required: [IMPLEMENTED] people route, new person, person metadata, interaction section, graph proof, and persistence/search proof.
- Done criteria: [IMPLEMENTED FOR FOUNDATION] local people profiles and linked interactions work without sync; overall People/CRM remains partial until privacy enforcement, import, full timeline, and native/mobile systems exist.
- Future phases: Finance foundation.

### 6.10 Finance

- Purpose: local finance records, budgets, and planning.
- User mental model: local records without bank connections.
- Current status: [PARTIAL]
- UI now: dedicated Finance route/list, working create actions for expenses, income, bills, subscriptions, budgets, and reimbursements, finance record cards, local summary stats, metadata search field, and finance detail metadata panel in `/page/$id`.
- Implemented now: typed finance metadata helper, provider-backed finance record inputs, amount/currency/date/status normalization, transaction/budget/bill/subscription/reimbursement/general kinds, local transaction totals from real provider records, metadata-only private/sensitive flags with honest warnings, normalized relation IDs for documents/projects/tasks/people/calendar records, finance graph edge extraction, search metadata coverage, template defaults, command-palette create action, and seed metadata defaults.
- Not implemented yet: bank sync/import, open banking, payment APIs, Plaid/Stripe/PayPal/Wise integrations, CSV import/export, receipt OCR or automatic extraction, tax filing, accounting-grade ledgers, double-entry bookkeeping, automated budgets, recurring payment engine, bill reminders, native notifications, encrypted private finance, app/privacy lock, mobile receipt capture, AI finance advice, SQLite/native storage, and portable vault folders.
- Data model: `category: "finance"` and `type: "finance"` provider items with typed finance metadata in `MizaanItem.metadata`.
- Routes: `/finance`, `/page/$id`
- Main components: Finance route, `FinanceMetadataPanel`, `PageWorkspace`.
- Empty states: no real finance records.
- Error states: generic page errors and inline invalid amount metadata state.
- Actions: create expense, income, bill, subscription, budget, reimbursement, and finance template records.
- Disabled/future actions: no bank sync, payment APIs, or online connections.
- Tests required: finance helper tests, graph relation tests, search metadata tests, template metadata tests, and browser QA for create/edit/refresh/search/graph.
- Screenshots required: finance route, created record, metadata panel, summary/search proof, and graph proof.
- Done criteria: [IMPLEMENTED FOR FOUNDATION] local finance records persist with typed metadata and honest limitation copy; overall Finance remains partial until native storage, imports/exports, privacy enforcement, and richer reporting are implemented.
- Future phases: Trackers/goals foundation; later finance expansions after import/export, privacy, and native storage phases.

### 6.11 Trackers

- Purpose: habits, study, exercise, custom progress.
- User mental model: local tracker records with typed metadata and real local check-ins, not a finished analytics/reminder engine.
- Current status: [PARTIAL]
- UI now: dedicated Trackers route/list, provider-backed create actions, tracker record cards, search field, local summary stats, tracker templates, command-palette creation, and tracker detail metadata panel in `/page/$id`.
- Implemented now: typed tracker metadata helper, provider-backed tracker record inputs, tracker type/status/frequency normalization, target/current/unit fields, real local check-ins when added, relation IDs for projects/tasks/people/documents/finance, metadata-only private/sensitive flags with honest warnings, tracker graph edge extraction, search metadata coverage, template defaults, command-palette create action, seed metadata defaults, and non-destructive legacy seeded-streak preservation.
- Not implemented yet: fake streak engine, charts, rollups, automated progress history, reminder engine, native notifications, AI coaching, wearable imports, medical tracking claims, health-data integrations, mobile capture, SQLite/native storage, encrypted private trackers, app/privacy lock, hidden-from-search behavior, hidden-from-graph behavior, and portable vault folders.
- Data model: `category: "trackers"` and `type: "tracker"` provider items with typed tracker metadata in `MizaanItem.metadata`.
- Routes: `/trackers`, `/page/$id`
- Main components: Trackers route, `TrackerMetadataPanel`, `PageWorkspace`.
- Empty states: no tracker records yet, with a real New tracker action.
- Error states: generic page errors.
- Actions: create habit, study, reading, productivity, finance, or custom tracker records; edit typed tracker metadata; add real local check-ins; search tracker metadata; open tracker detail pages.
- Disabled/future actions: no fake streaks, charts, rollups, reminders, native notifications, AI coaching, wearable imports, health/medical claims, cloud sync, or mobile capture.
- Tests required: [IMPLEMENTED] tracker helper tests, graph relation tests, search metadata test, template metadata tests, product map tests, and browser QA.
- Screenshots required: [IMPLEMENTED] tracker route, created tracker, tracker metadata/check-in panel, search/graph proof, and route proof screenshots for this phase.
- Done criteria: [IMPLEMENTED FOR FOUNDATION] provider-backed tracker records persist with typed metadata and real local check-ins; overall Trackers remains partial until analytics/history/reminder/native systems exist.
- Future phases: tracker history/views after storage/index policy is stronger.

### 6.12 Goals

- Purpose: outcome planning and goal tracking.
- User mental model: goals connect to projects, trackers, and calendar.
- Current status: [PARTIAL]
- UI now: dedicated Goals route/list, provider-backed create actions, goal record cards, search field, local summary stats, goal templates, command-palette creation, and goal detail metadata panel in `/page/$id`.
- Implemented now: typed goal metadata helper, provider-backed goal record inputs, goal status/horizon/priority normalization, target date and progress fields, relation IDs for projects/tasks/trackers/people/documents/finance, metadata-only private/sensitive flags with honest warnings, goal graph edge extraction including tracker links, search metadata coverage, template defaults, and command-palette create action.
- Not implemented yet: automated progress history, charts, reminders, native notifications, AI coaching, cloud sync, mobile capture, calendar scheduling, encrypted private goals, app/privacy lock, hidden-from-search behavior, hidden-from-graph behavior, SQLite/native storage, and portable vault folders.
- Data model: `category: "goals"` and `type: "goal"` provider items with typed goal metadata in `MizaanItem.metadata`.
- Routes: `/goals`, `/page/$id`.
- Main components: Goals route, `GoalMetadataPanel`, `PageWorkspace`.
- Empty states: no goal records yet, with a real New goal action.
- Error states: generic page errors and inline invalid progress metadata state.
- Actions: create short-term, medium-term, long-term, lifetime, or custom goal records; edit typed goal metadata; search goal metadata; open goal detail pages.
- Disabled/future actions: no fake progress history, charts, reminders, native notifications, AI coaching, cloud sync, mobile capture, or native scheduling.
- Tests required: [IMPLEMENTED] goal helper tests, graph relation tests, search metadata test, template metadata tests, product map tests, and browser QA.
- Screenshots required: [IMPLEMENTED] goal route, created goal, goal metadata panel, search/graph proof, and route proof screenshots for this phase.
- Done criteria: [IMPLEMENTED FOR FOUNDATION] provider-backed goal records persist with typed metadata and relation IDs; overall Goals remains partial until progress history, scheduling/reminders, native storage, and privacy enforcement exist.
- Future phases: goal history/views after storage/index policy is stronger.

### 6.13 Templates

- Purpose: create real local pages from known blueprints.
- User mental model: a template is a creation source.
- Current status: [PARTIAL]
- UI now: route, picker, search, category/status filters, counts, preview panel, and disabled future entries.
- Implemented now: static registry, expanded provider-backed built-in templates, implemented/partial/future status split, typed metadata defaults, safe starter blocks, preview derivation, future-template creation guards, and provider-backed creation.
- Not implemented yet: template editor, custom templates, import/export, template versions, AI generation, marketplace, and sync.
- Data model: static template definitions with status/category/preview metadata.
- Routes: `/templates`
- Main components: `PageTemplatePicker`, templates route, and `src/lib/templates/template-registry.ts`.
- Empty states: route shows no-match state for active filters.
- Error states: unknown, partial, and future template IDs are rejected by the registry creation helper.
- Actions: create implemented provider-backed items from templates.
- Disabled/future actions: partial/future template cards are visible but cannot create records.
- Tests required: [IMPLEMENTED] page workspace tests and template registry tests.
- Screenshots required: [IMPLEMENTED] templates route screenshot via browser QA.
- Done criteria: static expansion is complete for this bounded phase; overall Templates remain partial until template editor and custom storage are verified.
- Future phases: version history, custom template storage, template import/export, and template management.

### 6.14 Vault

- Purpose: show storage truth and health.
- User mental model: understand what is currently persisted, export a browser-prototype JSON archive, validate an archive, and preview restore before any mutation.
- Current status: [PARTIAL]
- UI now: provider info, health route, and browser archive export/validate/preview/apply controls.
- Implemented now: provider info, health counts, prototype warnings, versioned browser archive export, archive validation, restore preview, safe merge apply, and explicit-confirmation replace guard.
- Not implemented yet: portable folder, SQLite, lock file, markdown mirrors, native repair, native filesystem backups, encrypted backups, final vault portability, and rollback history.
- Data model: `VaultProviderInfo`, `VaultHealth`, browser archive model, and restore plan model.
- Routes: `/vault`
- Main components: vault route, provider, and `VaultArchivePanel`.
- Empty states: no special empty state.
- Error states: provider warnings and invalid archive validation states.
- Actions: open settings, export JSON archive, validate archive JSON/file, preview restore, apply merge, and apply replace only after explicit confirmation.
- Disabled/future actions: no fake folder picker, native backup, SQLite backup, encrypted backup, app lock, or portable vault claim.
- Tests required: provider tests, archive validation tests, round-trip tests, and future storage tests.
- Screenshots required: vault route and archive panel states.
- Done criteria: [IMPLEMENTED FOR BROWSER ARCHIVE] current provider/localStorage data can be exported, validated, previewed, and restored safely in merge mode with guarded replace semantics; native providers and recovery remain future.
- Future phases: native storage, repair/recovery, import/export manager.

### 6.15 Trash

- Purpose: recover deleted local prototype items.
- User mental model: soft-deleted pages can be restored.
- Current status: [PARTIAL]
- UI now: trash route.
- Implemented now: deleted item listing and restore where records exist.
- Not implemented yet: permanent delete policy, retention windows, history.
- Data model: `deletedAt` and provider restore.
- Routes: `/trash`
- Main components: trash route.
- Empty states: trash empty explanation.
- Error states: none beyond provider state.
- Actions: restore items.
- Disabled/future actions: no permanent delete control until safety design.
- Tests required: provider trash/restore tests.
- Screenshots required: trash route.
- Done criteria: restore/permanent-delete safety rules verified.
- Future phases: Repair/recovery center.

### 6.16 Settings

- Purpose: expose app behavior and status controls.
- User mental model: inspect current storage/settings, change safe preferences.
- Current status: [PARTIAL]
- UI now: route with theme controls, read-only provider facts, and browser archive controls.
- Implemented now: theme state, prototype facts, browser archive export/validation/restore-preview/merge UI, and guarded replace confirmation UI.
- Not implemented yet: full settings model, native vault configuration, privacy settings, keyboard settings, native backup location, app lock, or encrypted backup settings.
- Data model: theme/right-panel local state, provider info, and browser archive restore plan state.
- Routes: `/settings`
- Main components: settings route, theme hook.
- Empty states: none.
- Error states: provider warnings and archive validation/restore-blocked messages.
- Actions: theme selection, browser archive export, archive validate, restore preview, safe merge apply, and guarded replace apply.
- Disabled/future actions: no fake native backup, folder picker, SQLite backup, encrypted backup, app lock, or portable vault controls.
- Tests required: theme tests, archive helper tests, provider restore tests, and route QA.
- Screenshots required: settings/sidebar and browser archive states.
- Done criteria: settings persist, browser archive flows are honest, and no dangerous controls are exposed without preview/confirmation.
- Future phases: settings hardening and privacy/lock UX.

### 6.17 Imports

- Purpose: safe import manager for the current browser archive JSON flow, with future Markdown, CSV, and document imports clearly blocked.
- User mental model: preview before importing, never destructive by surprise.
- Current status: [PARTIAL]
- UI now: `/import-export` route with supported browser archive features, future-only unsupported features, and archive controls.
- Implemented now: browser archive JSON paste/load, validation, restore preview, safe merge, guarded replace, and error messaging for invalid JSON, wrong app, unsupported version, corrupt/duplicate records, and empty archives.
- Not implemented yet: native file import, folder import, document import, markdown/CSV/PDF import, import mappings, SQLite import, encrypted backup import, portable vault import.
- Data model: browser archive validation state, restore preview state, and future feature descriptors; broader import manifest remains future.
- Routes: `/import-export`.
- Main components: `VaultArchivePanel`, archive manager helpers, and import/export route.
- Empty states: no archive text loaded and future-only feature list.
- Error states: invalid JSON, wrong app archive, unsupported newer archive, missing/corrupt records, duplicate IDs, restore blocked.
- Actions: validate archive, preview restore, apply merge after preview, apply replace after preview and exact confirmation.
- Disabled/future actions: native/file/folder/markdown/CSV/PDF/SQLite/encrypted/portable imports remain future-only copy, not working controls.
- Tests required: import/export manager helper tests and archive restore safety tests.
- Screenshots required: import/export manager, archive validation, restore preview.
- Done criteria: browser archive manager works without fake native import and no destructive import occurs without preview and confirmation.
- Future phases: native import and readable-format import design after storage architecture.

### 6.18 Exports

- Purpose: browser archive JSON export manager foundation plus future local export planning.
- User mental model: export the current browser prototype archive now; readable selected-data formats are future.
- Current status: [PARTIAL]
- UI now: Settings, Vault, and `/import-export` expose browser-prototype JSON archive export with prototype-only warnings.
- Implemented now: versioned browser archive JSON export for current provider/localStorage items, blocks, relations, trash/template summaries, settings placeholder, metadata, checksums, warnings, and manager route status.
- Not implemented yet: selected-data export manifest, Markdown/PDF/DOCX exports, CSV export manager, graph export, native filesystem output, or final portable vault export.
- Data model: browser archive helper now; selected-data export manifest remains future.
- Routes: `/import-export`.
- Main components: `VaultArchivePanel`, archive manager helpers, and import/export route.
- Empty states: no archive text loaded.
- Error states: archive validation errors and restore-blocked states.
- Actions: browser archive JSON export now; future readable export preview/execute later.
- Disabled/future actions: non-archive exports remain future.
- Tests required: archive export validation now, future file output tests later.
- Screenshots required: browser archive export UI now, export manager UI later.
- Done criteria: [IMPLEMENTED FOR BROWSER ARCHIVE] current provider archive JSON is generated and validated; full export manager remains future.
- Future phases: readable export formats after archive policy matures.

### 6.19 Backups

- Purpose: future backup and restore surface.
- User mental model: protect the current browser prototype through previewable JSON archives while understanding this is not final vault portability.
- Current status: [PARTIAL]
- UI now: Settings/Vault expose browser archive export, file/text load, validation, restore preview, safe merge, and guarded replace controls; dedicated backup route remains future.
- Implemented now: browser archive manifest-like fields, archive validation, restore preview, safe merge restore, guarded replace restore, corruption rejection, wrong-app rejection, unsupported-newer-version rejection, and round-trip tests.
- Not implemented yet: dedicated backup route, native backup manifest file, native file output, SQLite backup, encrypted backup, portable vault backup, backup history, rollback, scheduled backups, or native recovery center.
- Data model: browser archive model now; full backup manifest remains future native.
- Routes: future `/backups`.
- Main components: future backup manager.
- Empty states: no backups yet.
- Error states: invalid JSON, wrong app archive, unsupported version, missing items, duplicate IDs, corrupt items, and restore-blocked messages.
- Actions: browser archive export, validate, restore preview, safe merge apply, and guarded replace apply.
- Disabled/future actions: native backup, SQLite backup, encrypted backup, portable folder backup, and real app lock remain future.
- Tests required: [IMPLEMENTED FOR BROWSER ARCHIVE] archive validation, corruption rejection, preview non-mutation, merge, guarded replace, and round-trip tests.
- Screenshots required: browser archive export and restore preview states now; backup route later.
- Done criteria: [IMPLEMENTED FOR BROWSER ARCHIVE] safe browser archive backup and restore are validated; final native backups remain future.
- Future phases: native backup design, repair/recovery center, migration center.

### 6.20 Repair Center

- Purpose: detect malformed browser prototype data and guide safe archive recovery.
- User mental model: inspect issues, validate archives, preview recovery, and avoid destructive action by surprise.
- Current status: [PARTIAL]
- UI now: `/repair` route with health score, provider counts, category counts, duplicate IDs, orphan blocks/relations, invalid metadata references, issue/suggestion list, and archive controls.
- Implemented now: vault health summary helpers, duplicate ID detection, orphan detection, invalid metadata-reference detection, browser archive validation, restore preview, safe merge, guarded replace, and current limitations.
- Not implemented yet: automatic repair, repair previews for non-archive mutations, migration rollback, repair logs, native filesystem recovery, SQLite repair, encrypted recovery, or mirror rebuild.
- Data model: vault health summary and browser archive restore plan; full repair report/log remains future.
- Routes: `/repair`.
- Main components: repair route, vault health helpers, and `VaultArchivePanel`.
- Empty states: no local vault items stored yet; no detected issues.
- Error states: validation/preview failure states; data unchanged.
- Actions: inspect health, validate archive, preview restore, merge after preview, replace after explicit confirmation.
- Disabled/future actions: automatic repair, native recovery, SQLite repair, encrypted recovery, rollback, and log export remain future.
- Tests required: vault health tests, archive manager tests, restore preview safety tests, and route QA.
- Screenshots required: repair/recovery center, archive validation, restore preview.
- Done criteria: health checks are real and restore actions stay previewed and confirmation-gated.
- Future phases: repair rule expansion after storage architecture.

### 6.21 Privacy/Lock Center

- Purpose: future privacy, lock, private pages, and encryption UX.
- User mental model: hide or lock sensitive local content.
- Current status: [BLUEPRINT ONLY]
- UI now: product-map future status only.
- Implemented now: none.
- Not implemented yet: private metadata, app lock, encryption, search/graph exclusion.
- Data model: privacy/lock metadata.
- Routes: future `/privacy`.
- Main components: future privacy center.
- Empty states: no locked/private content.
- Error states: locked state and recovery state.
- Actions: future privacy settings.
- Disabled/future actions: all lock/encryption actions are future.
- Tests required: privacy-aware search/graph/storage tests.
- Screenshots required: privacy center.
- Done criteria: privacy does not leak through search, graph, backups, or exports.
- Future phases: Privacy/lock UX.

### 6.22 Local AI Center

- Purpose: future local-only AI planning for OCR, similarity, summarization, and suggestions.
- User mental model: optional local intelligence without cloud calls.
- Current status: [FUTURE LOCAL AI]
- UI now: product-map future status only.
- Implemented now: none.
- Not implemented yet: local model runtime, OCR, embeddings, extracted text, summaries.
- Data model: local AI job/index metadata.
- Routes: future `/local-ai`.
- Main components: future local AI center.
- Empty states: future.
- Error states: local model unavailable.
- Actions: future local jobs.
- Disabled/future actions: no cloud AI buttons.
- Tests required: local-only network scans and deterministic helper tests.
- Screenshots required: local AI center.
- Done criteria: no remote AI dependency and all jobs are local/optional.
- Future phases: Local AI planning.

### 6.23 Native Windows

- Purpose: future Windows desktop shell, native filesystem, SQLite, installers.
- User mental model: the real local desktop app.
- Current status: [FUTURE NATIVE]
- UI now: product-map future status only.
- Implemented now: none.
- Not implemented yet: Tauri shell, SQLite provider, folder picker, file access, notifications, installer.
- Data model: native provider configs and vault metadata.
- Routes: no route by itself; surfaces across Vault/Settings/Repair.
- Main components: future Tauri commands and providers.
- Empty states: native unavailable.
- Error states: native permission/folder/lock conflicts.
- Actions: future open vault, choose folder, backup, import files.
- Disabled/future actions: no fake native controls.
- Tests required: native command tests, clean Windows VM tests.
- Screenshots required: Windows app proof.
- Done criteria: installed app stores data in SQLite and readable vault folders.
- Future phases: Native Windows readiness through portable vault folders.

### 6.24 Mobile Companion

- Purpose: future companion capture/review experiences.
- User mental model: mobile is an optional companion, not cloud sync by default.
- Current status: [FUTURE MOBILE]
- UI now: product-map future status only.
- Implemented now: none.
- Not implemented yet: Android, iOS, scan/upload, manual sync, conflict handling.
- Data model: mobile sync/export/import manifests.
- Routes: no current web route.
- Main components: future mobile apps.
- Empty states: mobile unavailable.
- Error states: sync conflict states.
- Actions: future mobile capture and sync.
- Disabled/future actions: no fake mobile buttons.
- Tests required: mobile plan, emulator/device tests later.
- Screenshots required: mobile companion proof.
- Done criteria: local-first companion workflow verified without hidden cloud.
- Future phases: Mobile companion planning.

---

## 8. UI Blueprint

Sidebar structure:

- Brand link points to Vault or Home with prototype truth visible.
- Core section: Home, Search, Databases, Graph, Calendar, and Blueprint/Product Map after this phase.
- Pinned section: user-pinned page spaces and pages.
- Pages section: unpinned root pages.
- System tools: Templates, Vault, Trash, Settings.
- Future-only tools may appear in Product Map cards, not as active sidebar routes unless the route exists.

Top bar behavior:

- Show breadcrumbs.
- Keep command palette button.
- Keep right-panel toggle.
- Do not add fake native/file/import controls.

Page workspace layout:

- Main article for title, metadata-specific panels, editor or module content.
- Right panel for page data, relations, backlinks, outgoing, files, local graph, history.
- Tabs or panels that are future-only must say so or remain absent.

Module landing page layout:

- Eyebrow, title, short local-first description.
- Status badge and prototype truth when relevant.
- Working actions only.
- Empty state that tells the user what can be done now.
- Future-only list for unavailable planned features.

Right panel and Page data panel:

- Basic facts are implemented.
- Relations/backlinks rely on explicit relation records now.
- File, local graph, and history panes must not pretend unsupported behaviors work.

Blueprint/future badge behavior:

- Implemented: active route/action can be shown.
- Partial: active route/action can be shown with limitation text.
- Blueprint only/not started/future native/future mobile/future local AI: no active action unless a safe status-only route exists.

Empty state design rules:

- Explain what can be done now.
- Mention future limitations only when the user needs to avoid misunderstanding.
- Avoid scary copy while being explicit.

Disabled action design rules:

- Prefer no button for future actions.
- If visible for context, use disabled state and a short reason.
- Never use a disabled button as evidence of implementation.

Feature status badges:

- Use short labels: Implemented, Partial, Blueprint only, Not started, Future native, Future mobile, Future local AI.
- Keep status text consistent with this blueprint.

Module cards:

- Show module name, category, status, route if live, and next phase.
- Future-only modules show future reason instead of an open action.

Relation badges:

- Show counts and relationship labels only from real provider relation records.
- Do not infer invisible relations as real data.

Table UI:

- Keep helper-backed rows, columns, counts, and empty states.
- Future views/filters/sorts are absent until implemented.

Document metadata UI:

- After the document foundation phase, document records should show metadata fields and unsupported import/preview states.
- Do not show fake file previews or fake thumbnails.

Graph UI:

- Current graph can show relation-based nodes/edges.
- Manual canvas, filters, clustering, export, and focus mode remain future until real.

Calendar UI:

- Current views should show real provider events.
- Reminders, recurrence, ICS, and sync stay absent/future.

Search UI:

- Search only current provider-backed data.
- File content/OCR/extracted text must be absent or future-labeled.

Settings UI:

- Current settings show prototype facts and safe preferences.
- Native vault configuration and backup controls remain future.

Vault health UI:

- Must keep browser/localStorage prototype warning visible.
- Must show Tauri, SQLite, portable folder, and markdown mirrors as not implemented.

Trash UI:

- Restore working soft-deleted items.
- Permanent delete remains future until safety policy exists.

Template picker UI:

- Only templates that create real provider-backed items should be selectable.
- Template editor stays future.

Command palette UI:

- Commands must either work or be absent.
- Future commands should not be searchable as active commands.

Responsive rules:

- Sidebar can collapse on desktop and hide on smaller layouts.
- Module cards wrap cleanly.
- Tables must not overflow without horizontal handling.

Theme rules:

- Light, dark, night, and system themes may exist.
- Do not load remote fonts.

Accessibility rules:

- Buttons need accessible names.
- Disabled future actions must be obvious.
- Keyboard path must remain usable for key CRUD flows.

Hover/three-dot menu behavior:

- Page row menus can expose working open, rename, duplicate, pin, subpage, copy link, and trash actions when safe.
- Disabled actions should have real disabled state.

Notion-like familiarity rules:

- Page-first workspace, calm typography, compact controls, simple badges.
- Avoid fake dashboards and abstract product theatre.

Mizaan-specific differentiation:

- Local-first vault truth is visible.
- Every important saved object is a page or can become one.
- Future native storage is planned but never overclaimed.

---

## 9. Route Map

| Route | Purpose | Current status | UI expectation | Data source | Actions | Future actions | Done criteria | Test requirements |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Home | [PARTIAL] | Recent work, vault truth | Provider snapshot | Quick create, quick capture | Custom widgets | Persisted quick capture and honest status | Route QA and helper tests |
| `/search` | Search local records | [PARTIAL] | Search/filter results | Provider snapshot | Query/filter/open | Saved searches, native index | Accurate results and no remote calls | Search helper tests and QA |
| `/databases` | Database list | [PARTIAL] | Create/open database pages | Provider items | New database | Filters/views/import/export | No fake view controls | Database tests and QA |
| `/graph` | Relation graph | [PARTIAL] | Nodes/edges from provider | Items/relations | Open nodes | Filters/canvas/export | Real relations only | Graph tests later |
| `/calendar` | Calendar module | [PARTIAL] | Views and event editor | Calendar item records | Event CRUD | Recurrence/reminders/ICS | Local event persistence | Calendar tests and QA |
| `/documents` | Document records | [PARTIAL] | Metadata-only records | Document items | New document record after next phase | Import/preview/OCR | Honest metadata records | Document tests and QA |
| `/templates` | Template sources | [PARTIAL] | Create provider items | Static templates | Create from template | Template editor | Templates create real items | Template tests |
| `/vault` | Vault health | [PARTIAL] | Storage truth | Provider info/health | Archive controls, open settings | Folder picker, native backup | No native overclaim | Provider tests and QA |
| `/trash` | Trash/recovery | [PARTIAL] | Deleted items | Provider items | Restore | Permanent delete policy | Safe restore | Provider tests |
| `/settings` | Settings/status | [PARTIAL] | Theme/prototype facts | Theme/local/provider state | Theme changes | Vault config/privacy | Safe preferences persist | Theme tests and QA |
| `/page/$id` | Page workspace | [PARTIAL] | Page editor/detail | Provider item/blocks | Edit title/blocks, archive, subpages | Version history/export/native files | Persisted edits | Page workspace tests and QA |
| `/blueprint` | Product map | [PARTIAL] | Honest product/module statuses | Product-map constants | Open live routes | Future modules stay disabled/status-only | Statuses match blueprint | Product-map tests and QA |
| `/import-export` | Import/export manager | [PARTIAL] | Browser archive manager | Archive helpers/provider snapshot | Export JSON, load/paste JSON, validate, preview, merge, guarded replace | Native/file/markdown/CSV/PDF exports and imports | No fake native import/export | Archive manager tests and QA |
| `/backups` | Backup manager | [BLUEPRINT ONLY] | Future-only | Backup manifest | None now | Backup/restore | Restore preview | Future tests |
| `/repair` | Repair center | [PARTIAL] | Health checks and recovery controls | Vault health summary/provider snapshot | Inspect issues, validate archive, preview restore, merge, guarded replace | Automatic repair, rollback, native recovery | Non-destructive checks and guarded recovery | Vault health tests and QA |
| `/privacy` | Privacy/lock center | [BLUEPRINT ONLY] | Future-only | Privacy metadata | None now | Lock/private/encrypt | No leaks | Future tests |
| `/local-ai` | Local AI center | [FUTURE LOCAL AI] | Future-only | Local AI metadata | None now | Local OCR/similarity | No cloud calls | Future tests |

---

## 10. Data Model Blueprint

### MizaanItem

- Current status: [PARTIAL]
- Proposed fields: current `id`, `type`, `category`, `title`, `icon`, `summary`, `status`, `tags`, timestamps, parent, properties, attached files, metadata.
- Storage now: provider item in browser localStorage.
- Storage later: SQLite item table plus readable vault mirror.
- Validation rules: stable id, known category/type, safe strings, arrays normalized, metadata preserved.
- Migration notes: preserve unknown safe metadata.
- Test requirements: provider tests and migration tests.

### Pages

- Current status: [PARTIAL]
- Proposed fields: page item, parentId, blocks, relations, page metadata.
- Storage now: item and blocks.
- Storage later: SQLite plus Markdown/JSON mirror.
- Validation rules: parent loops prevented, missing pages handled.
- Migration notes: existing item/block records must be preserved.
- Test requirements: page workspace tests and migrations.

### Spaces

- Current status: [PARTIAL]
- Proposed fields: page item with `promotedAsSpace`, sidebar metadata, space template id.
- Storage now: item metadata.
- Storage later: same concept in SQLite/mirrors.
- Validation rules: core modules not promoted as ordinary pages unless deliberately represented.
- Migration notes: Calendar remains core module.
- Test requirements: sidebar/page tree tests.

### Blocks

- Current status: [PARTIAL]
- Proposed fields: id, itemId, type, content, order, checked, timestamps.
- Storage now: provider blocks.
- Storage later: SQLite blocks plus Markdown mirror.
- Validation rules: supported block type, stable order.
- Migration notes: table block content needs helper normalization.
- Test requirements: editor and block helper tests.

### Properties

- Current status: [PARTIAL]
- Proposed fields: JSON-safe values and typed property metadata later.
- Storage now: item properties.
- Storage later: SQLite JSON/properties table plus mirror.
- Validation rules: JSON-safe only, typed helpers for feature-specific models.
- Migration notes: preserve unknown safe fields.
- Test requirements: helper normalization tests.

### Relations

- Current status: [PARTIAL]
- Proposed fields: id, sourceId, targetId, relationType, label, metadata.
- Storage now: provider relation records.
- Storage later: SQLite relation table plus graph mirror.
- Validation rules: valid existing endpoints, no duplicate accidental relations.
- Migration notes: keep relation semantics stable.
- Test requirements: provider and graph tests.

### Templates

- Current status: [PARTIAL]
- Proposed fields: template id, category, type, defaults, blocks, metadata.
- Storage now: static definitions.
- Storage later: user templates in provider/SQLite.
- Validation rules: template creates real provider item.
- Migration notes: static templates can seed user templates later.
- Test requirements: template creation tests.

### Database Model

- Current status: [PARTIAL]
- Proposed fields: database id/title/description, columns, rows, rowOrder, metadata.
- Storage now: item metadata.
- Storage later: SQLite tables and JSON mirror.
- Validation rules: unique columns/rows, repair duplicate/stale state.
- Migration notes: normalize safely, do not destroy user cells.
- Test requirements: database helper tests.

### Simple Table Model

- Current status: [PARTIAL]
- Proposed fields: columns, rows, cells.
- Storage now: serialized block content.
- Storage later: block table JSON in SQLite/mirror.
- Validation rules: repair malformed tables, preserve explicit empty rows.
- Migration notes: do not regenerate fake rows after intentional deletion.
- Test requirements: simple-table tests.

### Document Metadata Model

- Current status: [IMPLEMENTED]
- Proposed fields: title, kind, status, source, date, file name/type/size/extension, import state, preview state, storage state, category, tags, notes, linked page/project/person/finance ids.
- Storage now: provider-backed `MizaanItem.metadata` in the browser/localStorage prototype.
- Storage later: SQLite document table plus vault file pointer.
- Validation rules: normalize invalid enums, trim strings, preserve unknown safe metadata, remove duplicate/invalid relation ids, no fake file paths.
- Migration notes: keep generic document pages intact.
- Test requirements: document metadata helper tests exist; native storage migration tests remain future.

### Calendar Event Model

- Current status: [IMPLEMENTED FOUNDATION]
- Implemented fields now: event title, event type, event status, start/end date, start/end time, all-day flag, location, notes, linked project/task/person/document/finance ids, metadata-only private/sensitive flags, and explicit false flags for recurrence/reminder/native-notification engines.
- Storage now: provider-backed calendar item properties/metadata in the browser/localStorage prototype.
- Storage later: SQLite event table plus mirror.
- Validation rules: normalize invalid enums, valid date/time strings, safe fallbacks, relation-id dedupe, metadata preservation, and explicit invalid-range detection.
- Migration notes: existing calendar records must remain openable.
- Test requirements: calendar event tests, legacy calendar-events compatibility tests, search metadata tests, graph edge tests, serial full test suite, and browser route QA.

### Person/Contact Model

- Current status: [PARTIAL]
- Implemented fields now: display name, legal name, preferred name, aliases, relationship type, relationship status, where-known-from, organization, role/title, location note, primary email/phone as local text metadata, preferred contact method, last interaction date, next follow-up date, follow-up status, birthday, private/sensitive metadata flags, notes, context, boundaries, linked project/task/document/finance/calendar/goal ids, and tags.
- Implemented interaction fields now: interaction title, type, status, person id, interaction date, summary, follow-up-needed flag, follow-up date, linked project/task/document/calendar ids, notes, and private/sensitive metadata flags.
- Proposed fields later: import source metadata, privacy enforcement policy, hidden-from-search/graph flags after real privacy rules, richer timeline views, reminder scheduling metadata, mobile capture metadata, and native contact import manifests if explicitly allowed later.
- Storage now: provider-backed `MizaanItem.metadata` in the browser/localStorage prototype.
- Storage later: SQLite person table plus mirror.
- Validation rules: normalize invalid enums, trim strings, preserve unknown safe metadata, dedupe relation ids, remove invalid ids, keep private/sensitive as metadata-only flags, and do not claim encryption, hidden indexes, Google Contacts, or cloud sync.
- Migration notes: preserve existing person pages and normalize older generic people metadata at read/use time.
- Test requirements: [IMPLEMENTED] person helper tests, interaction helper tests, graph edge tests, search metadata tests, and template default tests.

### Project/Task Model

- Current status: [PARTIAL]
- Implemented fields now: project title, status, priority, area, start date, deadline, description, notes, linked task/document/person/finance/calendar/goal ids; task title, status, priority, start date, due date, completed-at, project id, linked page/document/person/finance/calendar ids, and notes.
- Proposed fields later: milestones, dependencies, saved views, kanban columns, timeline/Gantt data, reminder schedules, recurring rules, calendar scheduling metadata, and native notification metadata.
- Storage now: provider-backed `MizaanItem.metadata` in the browser/localStorage prototype.
- Storage later: SQLite project/task tables plus mirror.
- Validation rules: normalize invalid enums, trim strings, preserve unknown safe metadata, dedupe relation ids, remove invalid ids, and never invent task rollups from fake data.
- Migration notes: preserve existing project pages and task records; generic project pages must remain openable during later migration.
- Test requirements: project/task helper tests, graph relation tests, search metadata tests, and template metadata tests exist for this foundation. Route/detail UI is verified by browser QA.

### Finance Model

- Current status: [PARTIAL]
- Implemented fields now: finance title, finance kind, transaction type, finance status, amount, amount-invalid flag, currency, transaction date, due date, category, subcategory, account label, wallet label, merchant, payee, payer, payment method, recurring flag, recurring note, notes, private/sensitive metadata flags, no-bank-sync/no-accounting-grade booleans, linked document/project/task/person/calendar ids, and tags.
- Storage now: provider-backed `finance/finance` items with typed finance metadata in `MizaanItem.metadata` and summary properties mirrored for route/detail display.
- Storage later: SQLite finance table plus mirror.
- Validation rules: numeric amount normalization, invalid amount tracking, ISO date string normalization, enum fallback for kind/type/status/payment method, 3-letter currency normalization, duplicate/invalid relation id removal, and no bank sync/accounting-grade claims.
- Migration notes: preserve existing generic finance pages and normalize them at read time; do not clear browser localStorage or force seed resets.
- Test requirements: finance helper tests, graph relation tests, search metadata tests, template metadata tests, and browser QA exist for this foundation.

### Tracker Model

- Current status: [NOT STARTED]
- Proposed fields: tracker type, check-ins, frequency, target, rollups.
- Storage now: generic item/properties.
- Storage later: SQLite tracker table plus mirror.
- Validation rules: valid dates and check-in values.
- Migration notes: preserve tracker pages.
- Test requirements: tracker helper tests.

### Graph Node/Edge Model

- Current status: [PARTIAL]
- Proposed fields: nodes from items, edges from relations, future indexes and layouts.
- Storage now: computed from provider snapshot.
- Storage later: SQLite graph index plus mirror.
- Validation rules: skip dangling edges.
- Migration notes: relation semantics stable.
- Test requirements: graph helper tests.

### Vault Metadata Model

- Current status: [PARTIAL]
- Proposed fields: provider id, vault id, storage mode, health, warnings.
- Storage now: provider info and session records.
- Storage later: vault manifest file plus SQLite metadata.
- Validation rules: no fake ready flags.
- Migration notes: migration manifests later.
- Test requirements: provider/health tests.

### Backup Manifest Model

- Current status: [PARTIAL]
- Implemented browser archive fields now: archiveVersion, appName, createdAt, provider, source, schemaVersion, itemCount, blockCount, relationCount, items, blocks, relations, trash summary, templates summary, settings placeholder, metadata, checksums, warnings, and unsupportedFutureFields preservation.
- Proposed final native backup fields: backup id, createdAt, app version, vault id, file list, checksums, provider id, storage mode, and native file pointers.
- Storage now: browser/localStorage prototype archive JSON generated from current provider snapshots.
- Storage later: backup manifest in vault/backups folder plus SQLite/native metadata.
- Validation rules: archive version/app/source checks, item/block/relation count checks, duplicate item rejection, corrupt item rejection, unsupported newer archive rejection unless explicitly allowed, wrong-app rejection, and restore preview before mutation.
- Migration notes: browser archive validation is implemented, but migration rollback and old-backup adapters remain future.
- Test requirements: [IMPLEMENTED FOR BROWSER ARCHIVE] archive validation, corruption rejection, wrong-app rejection, unsupported-version rejection, non-mutating restore preview, merge, guarded replace, metadata preservation, and round-trip tests; native backup tests remain future.

### Migration Manifest Model

- Current status: [NOT STARTED]
- Proposed fields: from version, to version, steps, dry-run results, rollback notes.
- Storage now: none.
- Storage later: vault migration logs.
- Validation rules: dry-run and non-destructive policy.
- Migration notes: never clear user storage.
- Test requirements: migration tests.

### Privacy/Lock Metadata Model

- Current status: [NOT STARTED]
- Proposed fields: private flag, hide from search, hide from graph, lock policy, encryption metadata later.
- Storage now: none.
- Storage later: SQLite and protected vault metadata.
- Validation rules: no privacy leaks through indexes/backups/exports.
- Migration notes: requires careful design before implementation.
- Test requirements: privacy-aware search/graph/export tests.

---

## 11. Implementation Phase Roadmap

### Phase A - Blueprint and UI baseline

- Goal: create this blueprint and a user-visible product map/status UI.
- Why now: future work needs a single clean planning layer before deeper modules.
- Preconditions: repo healthy, validation passing, master plan present.
- Implementation tasks: blueprint file, product-map data, `/blueprint` route, sidebar/home visibility, tests, screenshots, docs.
- Files likely touched: docs plan, routes, sidebar, product-map helper/tests.
- Tests required: product-map data invariants.
- Browser QA required: home, blueprint/product-map, settings, search, databases, documents, calendar, graph, templates, vault.
- Screenshots required: home, product map, statuses, sidebar/settings.
- Documentation required: master append, phase report, DOCX.
- Done criteria: route visible, future modules disabled/status-only, validation passes, commit/push verified.
- What not to implement: deep feature behavior.
- Next phase: Documents foundation.

### Phase B - Documents foundation

- Goal: make document metadata-only records useful in the browser prototype.
- Current status: [IMPLEMENTED] as a bounded foundation; Documents overall remains [PARTIAL].
- Why now: documents need honest records before native import/preview.
- Preconditions: Phase A complete and pushed.
- Implementation tasks: document metadata helper, record defaults, route/list hardening, detail metadata panel, template/search/relation integration if safe.
- Files likely touched: document helpers/tests, documents route, page workspace, templates, search helper, docs.
- Tests required: metadata normalization and UI-safe helper tests.
- Browser QA required: create/edit/refresh/search document record.
- Screenshots required: documents list, new record, metadata panel, unsupported state.
- Documentation required: blueprint update, master append, phase report, DOCX.
- Done criteria: create and edit persisted metadata-only document record with no fake file behavior. Verified for the browser prototype on 2026-06-01.
- What not to implement: native import, preview, OCR, thumbnails, duplicate detection.
- Next phase: Graph relation foundation.

### Phase C - Graph relation foundation

- Current status: [IMPLEMENTED] as a bounded browser-prototype foundation; Graph overall remains [PARTIAL].
- Goal: make relations more explicit and graph filters/focus more useful.
- Why now: documents/projects/people need relation truth.
- Preconditions: document metadata relation ids normalized.
- Implementation tasks: graph helpers, filters, relation summaries, selected node focus.
- Files likely touched: graph route, relation helpers/tests, page panel.
- Tests required: graph helper tests.
- Browser QA required: graph route and linked records.
- Screenshots required: graph filtered/focus states.
- Documentation required: blueprint and reports.
- Done criteria: graph uses real provider records and filters work. This bounded foundation is implemented; full Graph remains partial.
- What not to implement: full manual canvas.
- Next phase: Calendar completion.

### Phase D - Calendar completion

- Goal: finish local calendar event foundation short of recurrence/reminders.
- Why now: calendar is core and already partial.
- Preconditions: stable provider/event helpers.
- Implementation tasks: [IMPLEMENTED FOUNDATION] typed event model, day/week/month/agenda proof, all-day/timed behavior, status/type normalization, Calendar detail metadata panel, graph/search/template/command-palette integration, route QA, screenshots, docs, and serial validation hardening.
- Files touched: calendar helpers/tests, Calendar view, Calendar metadata panel, graph/search/template/command-palette integrations, package test script, serial Vitest wrapper, PRD/Blueprint/master append/phase report/fallback work log.
- Tests required: [IMPLEMENTED] event model, legacy calendar compatibility, graph edges, search metadata, full serial Vitest suite, typecheck, lint, build, red scans, and browser route QA.
- Browser QA required: [PARTIAL BUT ACCEPTED WITH LIMITS] route sweep passed; create/edit/refresh/month/week/day/agenda passed; native date/time direct field entry, search-input proof, and graph-relation browser proof were limited by browser-control tooling and are covered by tests plus route-level QA.
- Screenshots required: [IMPLEMENTED] route sweep plus Calendar new event, edited event, day/week/agenda, and persistence proof screenshots.
- Documentation required: [IMPLEMENTED] PRD, Blueprint, append-only master Markdown, phase report, and fallback work log because the DOCX remains structurally unparsable.
- Done criteria: [IMPLEMENTED FOUNDATION] local event management is verified for the browser/localStorage prototype; overall Calendar remains [PARTIAL] until recurrence, reminders, native notifications, sync, ICS, and privacy enforcement exist.
- What not to implement: reminders, recurrence, ICS, Google Calendar sync, cloud sync, native notifications, encrypted private calendar, app lock, Tauri, SQLite, native filesystem, or portable vault folders.
- Next phase: Template Expansion and Template QA.

### Phase E - Database views and filters

- Goal: add safe sort/filter metadata and UI.
- Why now: database foundation exists.
- Preconditions: current database helper stable.
- Implementation tasks: filter/sort helpers, UI controls, tests, persistence.
- Files likely touched: database helper, table UI, route.
- Tests required: sort/filter preservation and invalid-state repair.
- Browser QA required: filter/sort/edit/refresh.
- Screenshots required: database filtered state.
- Documentation required: blueprint and reports.
- Done criteria: filters/sorts work without fake advanced views.
- What not to implement: formulas/rollups/board/gallery/timeline.
- Next phase: Backup/export/restore hardening.

### Phase F - Backup/export/restore hardening

- Goal: make browser-prototype JSON export/import safety real.
- Why now: before broader data growth.
- Preconditions: provider snapshot and validation helpers.
- Implementation tasks: [IMPLEMENTED FOR BROWSER ARCHIVE] versioned archive helper, JSON parse/validation, restore preview, merge plan/apply, guarded replace plan/apply, provider restore helper, Settings/Vault archive panel, failure states, tests, browser QA, screenshots, and documentation.
- Files touched: vault archive helper/tests, localStorage provider restore helper/tests, provider types, Settings route, Vault route, archive panel, blueprint/docs/screenshots.
- Tests required: [IMPLEMENTED] validation, restore preview, destructive confirmation guard, corruption rejection, metadata preservation, provider non-clear preview behavior, and round-trip safety.
- Browser QA required: [IMPLEMENTED] export, validation, restore preview, non-destructive merge apply, route sweep, console review, and screenshots.
- Screenshots required: [IMPLEMENTED] settings, vault, export, restore preview, and proof.
- Documentation required: [IMPLEMENTED] blueprint, phase report, old master Markdown append, and DOCX work log entry.
- Done criteria: [IMPLEMENTED FOR BROWSER ARCHIVE] no destructive restore without preview and explicit confirmation, and current provider/localStorage data round-trips safely through tests.
- What not to implement: native filesystem backup, SQLite backup, portable vault backup, encrypted backup, real app lock, cloud sync, auth, backend, or Tauri.
- Next phase: Trackers/goals foundation only if Phase A final validation, commit, push, parity, and clean worktree all pass.

### Phase G - Templates expansion

- Goal: [IMPLEMENTED FOR STATIC REGISTRY] improve real provider-backed templates.
- Why now: modules need creation sources.
- Preconditions: document and database templates stable.
- Implementation tasks: [IMPLEMENTED] expanded built-in templates, template registry tests, provider-backed creation helper, route search/category/status organization, previews, future guards, docs, and QA.
- Files touched: template registry/tests, templates route, PRD, Blueprint, master append, phase report, fallback work log, screenshots/logs.
- Tests required: [IMPLEMENTED] each implemented template creates valid provider item/blocks/metadata; partial/future templates cannot create records.
- Browser QA required: [IMPLEMENTED] route sweep, `/templates` screenshot, in-app browser search/filter/future-disabled proof.
- Screenshots required: [IMPLEMENTED] templates route screenshot.
- Documentation required: [IMPLEMENTED] blueprint and reports.
- Done criteria: [IMPLEMENTED FOR STATIC REGISTRY] no fake templates; unsupported template systems remain disabled/future.
- What not to implement: full template editor, custom storage, version history, AI generation, import/export, marketplace, or sync unless scoped later.
- Next phase: Version history or template management data-model design.

### Phase H - Projects/tasks foundation

- Goal: add task/project metadata foundation.
- Why now: projects need structured work tracking.
- Preconditions: relation and template foundations.
- Implementation tasks: [IMPLEMENTED] project/task helpers, route/list/detail UI, provider-backed project and task records, project-task metadata relations, graph/search/template integration, browser QA, screenshots, phase report, master append, and DOCX log.
- Files touched: project/task helpers/tests, projects route, page workspace/template creation, right-panel metadata panels, graph/search tests, provider vocabulary, blueprint/docs/screenshots.
- Tests required: [IMPLEMENTED] task/project normalization, record creation, relation id handling, graph edge extraction, search metadata, and template defaults.
- Browser QA required: [IMPLEMENTED] create/edit project/task, refresh persistence, search proof, graph proof, route sweep, and screenshots.
- Screenshots required: [IMPLEMENTED] project route, new project, project metadata, task section, graph, and persistence proof.
- Documentation required: [IMPLEMENTED] blueprint, phase report, old master Markdown append, and DOCX work log entry.
- Done criteria: [IMPLEMENTED FOR FOUNDATION] tasks are real provider-backed records linked to projects; overall project/task systems remain partial.
- What not to implement: complex scheduling/automation.
- Next phase: People/CRM foundation.

### Phase I - People/CRM foundation

- Goal: local person profile model and relation summaries.
- Why now: projects/documents/finance link to people.
- Preconditions: relation helpers stable.
- Implementation tasks: [IMPLEMENTED FOR FOUNDATION] person metadata helper, interaction metadata helper, provider-backed person/interaction records, People route/list, person detail metadata UI, graph/search/template integration, tests, browser QA, screenshots, and docs.
- Files touched: people helpers/tests, People route, People metadata panel, page workspace/right panel, graph/search/template tests, provider vocabulary, product map, blueprint/docs/screenshots.
- Tests required: [IMPLEMENTED] person normalization, interaction normalization, record inputs, relation id handling, privacy-summary honesty, graph edges, search metadata, and template defaults.
- Browser QA required: [IMPLEMENTED] create/edit person, create/edit linked interaction, refresh persistence, search proof, graph proof, route sweep, and screenshots.
- Screenshots required: [IMPLEMENTED] people route, new person, metadata panel, interaction section, graph, and persistence/search proof.
- Documentation required: [IMPLEMENTED] blueprint, phase report, old master Markdown append, and DOCX work log entry.
- Done criteria: [IMPLEMENTED FOR FOUNDATION] local people profiles work without sync and linked interactions are real provider-backed records; overall People/CRM remains partial.
- What not to implement: cloud contacts, Google Contacts, contact import/sync, real privacy/app lock, encrypted contacts, hidden search/graph behavior, reminders, AI summaries, mobile capture, or CRM integrations.
- Next phase: Finance foundation.

### Phase J - Finance foundation

- Goal: local finance records with validation and document links.
- Why now: receipts/invoices connect to documents.
- Preconditions: document and relation helpers.
- Implementation tasks: [IMPLEMENTED FOR FOUNDATION] finance metadata helper, provider-backed finance records, Finance route/list, finance detail metadata UI, local summary totals, graph/search/template integration, command-palette creation, tests, browser QA, screenshots, and docs.
- Files touched: finance helper/tests, Finance route, finance metadata panel, page workspace/right panel, graph/search/template tests, vault seed metadata, command palette, product map, blueprint/docs/screenshots.
- Tests required: [IMPLEMENTED] amount/date/currency/status/payment-method normalization, invalid amount tracking, relation ID normalization, provider-compatible inputs, real-record totals, graph edges, search metadata, and template defaults.
- Browser QA required: [IMPLEMENTED] create/edit finance record, metadata panel edit, refresh persistence, search proof, graph proof, route sweep, and screenshots.
- Screenshots required: [IMPLEMENTED] finance route, new finance transaction, metadata panel, summary/search proof, graph proof, and route sweep proof.
- Documentation required: [IMPLEMENTED] blueprint, phase report, old master Markdown append, and DOCX work log entry.
- Done criteria: [IMPLEMENTED FOR FOUNDATION] local finance records persist with typed metadata and honest no-bank/no-accounting limitations; overall Finance remains partial.
- What not to implement: bank sync/import, online payment APIs, receipt OCR, tax/accounting systems, automated budgets, recurring payment engines, reminders/native notifications, real privacy/encryption, native storage, or cloud/mobile integrations.
- Next phase: Trackers/goals foundation.

### Phase K - Trackers/goals foundation

- Goal: tracker and goal records with check-ins and progress summaries.
- Why now: goals need project/tracker ties.
- Preconditions: projects and relations.
- Implementation tasks: tracker/goal helpers, route/cards.
- Files likely touched: trackers route, future goals route, helpers/tests.
- Tests required: check-in/progress normalization.
- Browser QA required: create/check-in/refresh.
- Screenshots required: tracker/goal UI.
- Documentation required: blueprint and reports.
- Done criteria: real local check-ins persist.
- What not to implement: fake charts or advanced analytics.
- Next phase: Import/export manager.

### Phase L - Import/export manager

- Goal: centralized import/export UI and safety model.
- Why now: several modules need data movement.
- Preconditions: backup/export helpers and typed models.
- Implementation tasks: route(s), manifests, preview, validation.
- Files likely touched: routes/imports, routes/exports, helpers/tests.
- Tests required: validation and failure states.
- Browser QA required: preview and failure flow.
- Screenshots required: import/export screens.
- Documentation required: blueprint and reports.
- Done criteria: safe previewable imports/exports.
- What not to implement: native file system flows.
- Next phase: Repair/recovery center.

### Phase M - Repair/recovery center

- Goal: inspect and repair malformed local prototype data.
- Why now: more models create more repair needs.
- Preconditions: validation helpers.
- Implementation tasks: issue registry, repair previews, logs.
- Files likely touched: repair helpers/routes/tests.
- Tests required: repair dry runs and non-destructive application.
- Browser QA required: clean/issue states.
- Screenshots required: repair center.
- Documentation required: blueprint and reports.
- Done criteria: repairs are transparent.
- What not to implement: destructive blind migrations.
- Next phase: Version history.

### Phase N - Version history

- Goal: page/block version snapshot foundation.
- Why now: recovery and trust improve before native storage.
- Preconditions: provider and repair center.
- Implementation tasks: snapshot helpers, UI read-only history, restore preview.
- Files likely touched: version helpers, page panel.
- Tests required: snapshot and restore preview tests.
- Browser QA required: edit/history proof.
- Screenshots required: history panel.
- Documentation required: blueprint and reports.
- Done criteria: restore is previewable and safe.
- What not to implement: native file snapshots.
- Next phase: Privacy/lock UX.

### Phase O - Privacy/lock UX

- Goal: privacy metadata and UI boundaries without encryption claims.
- Why now: search/graph/export need privacy rules.
- Preconditions: search/graph/export foundations.
- Implementation tasks: private flags, hide from search/graph, UI notices.
- Files likely touched: privacy helpers, search, graph, page panel.
- Tests required: privacy-aware search/graph/export.
- Browser QA required: private item visibility checks.
- Screenshots required: privacy center.
- Documentation required: blueprint and reports.
- Done criteria: privacy rules are enforced in prototype.
- What not to implement: encryption/app lock unless scoped and designed.
- Next phase: Native Windows readiness.

### Phase P - Native Windows readiness

- Goal: prepare code for native shell without implementing Tauri yet.
- Why now: provider boundaries must be clean.
- Preconditions: typed models and validation.
- Implementation tasks: provider abstractions, capability gates, no browser-only assumptions.
- Files likely touched: provider interfaces, storage helpers.
- Tests required: provider contract tests.
- Browser QA required: no regressions.
- Screenshots required: vault/settings truth.
- Documentation required: blueprint and reports.
- Done criteria: code can accept native provider later.
- What not to implement: Tauri commands.
- Next phase: Tauri shell.

### Phase Q - Tauri shell

- Goal: introduce native app shell.
- Why now: native storage/file phases need shell.
- Preconditions: native readiness.
- Implementation tasks: Tauri config, shell boot, command boundary.
- Files likely touched: Tauri files, build config.
- Tests required: Tauri build/run smoke.
- Browser QA required: web app still works if needed.
- Screenshots required: native shell.
- Documentation required: native phase report.
- Done criteria: native shell runs without claiming storage complete.
- What not to implement: SQLite/file vault unless scoped.
- Next phase: SQLite provider.

### Phase R - SQLite provider

- Goal: implement SQLite runtime provider.
- Why now: final runtime storage needs structured persistence.
- Preconditions: Tauri shell.
- Implementation tasks: schema, provider, migrations, tests.
- Files likely touched: native provider, schema, commands.
- Tests required: schema/provider/migration tests.
- Browser QA required: native app smoke.
- Screenshots required: vault provider state.
- Documentation required: native report.
- Done criteria: SQLite stores provider data and passes migrations.
- What not to implement: portable folder mirrors.
- Next phase: Portable vault folders.

### Phase S - Portable vault folders

- Goal: human-readable folder layer.
- Why now: lifetime data promise.
- Preconditions: SQLite provider.
- Implementation tasks: folder manifest, mirrors, lock file, conflict rules.
- Files likely touched: native filesystem provider and mirror writer.
- Tests required: file output, lock, recovery.
- Browser QA required: native app smoke.
- Screenshots required: folder proof.
- Documentation required: native report.
- Done criteria: user can inspect vault folder.
- What not to implement: mobile sync.
- Next phase: Markdown mirrors.

### Phase T - Markdown mirrors

- Goal: readable page mirrors.
- Why now: human-readable vault promise.
- Preconditions: portable folders.
- Implementation tasks: Markdown writer, JSON metadata mirror, update policy.
- Files likely touched: mirror helpers/native commands.
- Tests required: mirror content and update tests.
- Browser QA required: native app smoke.
- Screenshots required: folder/file proof.
- Documentation required: native report.
- Done criteria: page content mirrored safely.
- What not to implement: bidirectional sync unless scoped.
- Next phase: Native filesystem document import.

### Phase U - Native filesystem document import

- Goal: real document file import/linking.
- Why now: documents metadata foundation and native vault exist.
- Preconditions: Tauri, SQLite, portable folders.
- Implementation tasks: file picker, copy/link policy, file metadata, missing-file detection.
- Files likely touched: document helpers/native commands/routes.
- Tests required: file import and missing-file tests.
- Browser QA required: native document flow.
- Screenshots required: import proof.
- Documentation required: document/native report.
- Done criteria: real files are stored or linked honestly.
- What not to implement: OCR unless local AI phase.
- Next phase: Native backup/restore.

### Phase V - Native backup/restore

- Goal: native vault backups and restore.
- Why now: after real vault folders exist.
- Preconditions: portable folders and SQLite.
- Implementation tasks: backup manifest, compression/copy, restore preview.
- Files likely touched: backup helpers/native commands/routes.
- Tests required: backup and restore integration.
- Browser QA required: native flow.
- Screenshots required: backup proof.
- Documentation required: native report.
- Done criteria: restore is safe and verified.
- What not to implement: cloud backup.
- Next phase: Mobile companion planning.

### Phase W - Mobile companion planning

- Goal: define local-first mobile companion architecture.
- Why now: native vault and conflict policy must exist first.
- Preconditions: portable vault and backup/recovery story.
- Implementation tasks: plan, sync manifests, conflict rules.
- Files likely touched: docs and maybe shared schema.
- Tests required: none until implementation.
- Browser QA required: no app changes unless route added.
- Screenshots required: planning UI only if added.
- Documentation required: mobile plan.
- Done criteria: no hidden cloud assumption.
- What not to implement: mobile app code unless explicitly scoped.
- Next phase: Local AI planning.

### Phase X - Local AI planning

- Goal: plan local-only AI/OCR/similarity without cloud.
- Why now: document storage and native runtime prerequisites should exist.
- Preconditions: native document import and local storage.
- Implementation tasks: local model strategy, OCR pipeline plan, privacy rules.
- Files likely touched: docs and future local AI route.
- Tests required: future local-only network scans.
- Browser QA required: status route only if added.
- Screenshots required: local AI status.
- Documentation required: local AI plan.
- Done criteria: explicit no-cloud AI architecture.
- What not to implement: cloud LLM/OCR.
- Next phase: final QA and release hardening.

### Phase Y - Final QA and release hardening

- Goal: verify product-wide stability and release evidence.
- Why now: after major planned systems exist.
- Preconditions: feature phases implemented and verified.
- Implementation tasks: regression matrix, accessibility, performance, installer, docs.
- Files likely touched: tests, release docs, CI/config.
- Tests required: full suite, native tests, browser QA, clean machine.
- Browser QA required: full route and core workflows.
- Screenshots required: release proof set.
- Documentation required: release notes and final report.
- Done criteria: no fake readiness and repeatable release.
- What not to implement: new feature scope.
- Next phase: maintenance.

---

## 12. Testing Standard

Required evidence before a feature can be marked [IMPLEMENTED]:

- Unit tests for helper/model behavior.
- Provider tests when persistence or storage behavior changes.
- Storage tests before storage claims.
- Migration tests before migration claims.
- Route tests or browser QA for user-facing routes.
- Screenshot QA when UI changes are visible.
- Accessibility checks for keyboard and accessible names on new controls.
- Keyboard checks for editable workflows.
- No-console-error checks in browser QA.
- Red-flag scans for localStorage scope, cloud/auth/provider terms, fake readiness, TODO/mock/fake/any, console/debugger, and remote URLs/fonts.
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `git diff --check`
- Git status and parity before and after push.
- DOCX structural verification for work-log updates.
- Master Markdown append/update verification.
- Phase report with evidence paths.

Implemented criteria:

A feature is implemented only if code exists, UI exists when user-facing,
persistence exists when stateful, tests exist, browser QA passes when UI-facing,
documentation is updated, no fake controls are present, and no major core
behavior is missing for the scoped claim.

Partial criteria:

A feature remains [PARTIAL] when it works only in the browser prototype, lacks
native/final storage, lacks full UI, lacks enough tests, lacks browser QA, or is
usable only for a foundational subset.

Not implemented criteria:

A feature is [NOT STARTED] or [BLUEPRINT ONLY] when it is docs-only, a disabled
future state, absent from provider-backed state, or intentionally waiting for a
later architecture phase.

---

## 13. Prompting Standard For Future Runs

Future prompts should name the exact phase from this roadmap.

Required future-prompt flow:

1. Read `docs/Plan/Mizaan_Product_Blueprint.md`.
2. Read `docs/Plan/Mizaan_A_to_Z_Plan.md`.
3. Verify Git branch, remote, fetch, parity, and worktree.
4. Run baseline validation.
5. Run red-flag scans.
6. Run browser QA if possible.
7. Implement only the named phase.
8. Add or update tests first where production behavior changes.
9. Update this blueprint status accurately.
10. Append the old master Markdown when required.
11. Create a phase report.
12. Update the DOCX work log or create the fallback.
13. Run final validation and red-flag scans.
14. Run browser QA and capture screenshots if possible.
15. Commit and push only after checks pass.
16. Verify parity after push.
17. Final report must separate implemented, partial, not implemented, deliberately not implemented, blocked, future-only, and risky/uncertain work.

Mini template:

```text
PROMPT - MIZAAN BLUEPRINT PHASE <PHASE NAME>

Use E:\Github\Mizaan-Revamp.
Read docs\Plan\Mizaan_Product_Blueprint.md first.
Implement only Phase <letter/name>.
Do not implement future native/mobile/cloud/auth/encryption/OCR/import behavior unless this phase explicitly allows it.
Run typecheck, lint, tests, build, git diff --check, red-flag scans, browser QA, screenshots, docs updates, DOCX update, commit, push, and parity verification.
Report honestly with implemented, partial, not implemented, deliberately not implemented, blocked, and future-only categories.
```
