# Mizaan Product Blueprint

Date: 2026-06-01

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
- Search: [PARTIAL] - provider-backed title, summary, status, category, type, tag, property, metadata, and block search exist with filters; saved searches and native indexes do not.
- Databases/Tables: [PARTIAL] - basic provider-backed table model, row/column/cell editing, stats, empty states, validation helper, and tests exist; full database engine does not.
- Calendar: [PARTIAL] - local calendar module, event model helpers, views, CRUD flow, and tests exist; recurrence, reminders, ICS, native notifications, and sync do not.
- Documents: [PARTIAL] - metadata-only document records now have typed helpers, provider-backed creation, route/list UI, detail metadata editing, template defaults, metadata search coverage, relation-id normalization helpers, tests, and browser QA. Real filesystem import, preview, OCR, thumbnails, duplicate detection, SQLite/native storage, and vault-file attachment remain not implemented.
- Graph: [PARTIAL] - relation graph foundation renders provider items and relation edges; backlink index, wiki links, manual canvas, filters, clustering, and export do not.
- Templates: [PARTIAL] - implemented templates create provider-backed pages; full template editor and template management do not.
- Vault: [PARTIAL] - provider and health UI state prototype truth; portable folders, SQLite, Tauri filesystem, lock file, markdown mirrors, backup/restore engine, and repair center do not.
- Trash: [PARTIAL] - soft trash/restore provider paths exist; retention policy, permanent deletion flow, audit history, and native recovery do not.
- Settings: [PARTIAL] - read-only prototype facts and theme controls; broad settings system does not.
- Tauri: [NOT STARTED]
- SQLite: [NOT STARTED]
- Portable vault folders: [NOT STARTED]
- Native filesystem: [NOT STARTED]
- Mobile: [NOT STARTED]
- Real document import/preview/OCR: [NOT STARTED]
- Full backup/export/restore: [NOT STARTED]
- Encryption/app lock/private pages: [NOT STARTED]

---

## 3. Product Laws

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

## 4. Information Architecture

### Core Modules

- Home - the daily starting point, recent work, quick capture, and vault truth.
- Search - local provider search over current prototype records.
- Databases - table/database surfaces.
- Graph - relation map and future knowledge graph surfaces.
- Calendar - app-level time module, not a normal promoted page.

### Page And Workspace Modules

- Notes - note pages and writing spaces.
- Documents - metadata records now, future native file records later.
- Projects - project pages and task foundations.
- People - local personal profiles and relationship context.
- Finance - local financial records without bank sync.
- Trackers - habit/progress tracking pages.
- Goals - future goal system.
- Custom pages/spaces - user-created page trees.

### System Tools

- Templates - creation sources, not ordinary documents.
- Vault - provider/storage health and future vault infrastructure.
- Trash - recovery infrastructure.
- Settings - app behavior and status controls.

### Blueprint-Only Or Future System Tools

- Imports - future import manager.
- Exports - future export manager.
- Backups - future backup and restore manager.
- Repair Center - future data repair/recovery UI.
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

## 5. Feature Status Matrix

| Area | Feature | Status | User-visible UI status | Data model status | Persistence status | Test status | Current limitation | Next implementation batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Core | Home | [PARTIAL] | Route exists | Provider snapshot | localStorage prototype | Covered indirectly | Not full dashboard or native home | Improve after module foundations |
| Core | Sidebar | [PARTIAL] | Navigation and page tree exist | Item metadata | localStorage prototype | Sidebar tree tests exist | Blueprint modules not fully visible yet | Blueprint UI baseline |
| Core | Search | [PARTIAL] | Route exists | Search helper | localStorage prototype | Unit tests exist | No saved searches or extracted document text | Search metadata expansion |
| Core | Databases | [PARTIAL] | Route and table page exist | Database metadata helper | localStorage prototype | Unit and browser QA exist | No filters/sorts/views/formulas/rollups | Database views and filters |
| Core | Graph | [PARTIAL] | Route exists | Relation edges | localStorage prototype | Limited | No indexes/wiki links/manual canvas | Graph relation foundation |
| Core | Calendar | [PARTIAL] | Route exists | Calendar helper | localStorage prototype | Unit and browser QA exist | No recurrence/reminders/ICS | Calendar completion |
| System | Templates | [PARTIAL] | Template picker and route exist | Template definitions | provider-backed creations | Page template tests exist | No template editor | Templates expansion |
| System | Vault | [PARTIAL] | Route exists | Provider info/health | localStorage prototype | Provider tests exist | No portable folder/SQLite/native | Backup/export/restore hardening |
| System | Trash | [PARTIAL] | Route exists | deletedAt records | localStorage prototype | Limited | No retention/permanent deletion policy | Repair/recovery center |
| System | Settings | [PARTIAL] | Route exists | Theme/session/provider facts | localStorage prototype | Theme tests exist | Mostly read-only | Settings hardening |
| Pages | Notes | [PARTIAL] | Route/space exists | Item/block model | localStorage prototype | Page workspace tests | Rich text incomplete | Editor hardening |
| Pages | Documents | [PARTIAL] | Metadata-only records route and detail panel exist | Typed document metadata in item metadata | localStorage prototype | Helper tests and browser QA | Real import/preview/OCR/native storage missing | Native document import later |
| Pages | Projects | [PARTIAL] | Route/space exists | Generic item only | localStorage prototype | Limited | No task engine | Projects/tasks foundation |
| Pages | People | [PARTIAL] | Route/space exists | Generic item only | localStorage prototype | Limited | No contact schema | People foundation |
| Pages | Finance | [PARTIAL] | Route/space exists | Generic item only | localStorage prototype | Limited | No ledger/model validation | Finance foundation |
| Pages | Trackers | [PARTIAL] | Route/space exists | Generic item only | localStorage prototype | Limited | No tracker engine | Trackers/goals foundation |
| Pages | Goals | [BLUEPRINT ONLY] | Not visible as working module | Not modeled | None | None | No route/model | Goals foundation |
| Pages | Custom pages | [PARTIAL] | Page workspace exists | Item/block model | localStorage prototype | Page workspace tests | No full schema/versioning | Editor and metadata hardening |
| Pages | Page data panel | [PARTIAL] | Right panel exists | Workspace model | localStorage prototype | Limited | Many panes are informational only | Page data hardening |
| Pages | Relations | [PARTIAL] | Relation panel exists | Relation records | localStorage prototype | Provider tests | No rich relation picker | Graph relation foundation |
| Pages | Backlinks | [PARTIAL] | Panel exists | Relation lookup | localStorage prototype | Limited | No wiki-link parsing | Graph relation foundation |
| Pages | Subpages | [PARTIAL] | Create child exists | parentId and relation | localStorage prototype | Page workspace tests | No drag tree ordering | Page workspace hardening |
| Editor | Rich text | [PARTIAL] | Basic text blocks | Blocks | localStorage prototype | Limited | No marks/inline formatting | Editor foundation |
| Editor | Blocks | [PARTIAL] | Basic block editor | Block records | localStorage prototype | Limited | Limited block types | Editor foundation |
| Editor | Slash commands | [PARTIAL] | Implemented command menu | Block definitions | localStorage prototype | Limited | No custom commands | Editor foundation |
| Editor | Tables | [PARTIAL] | Simple table block exists | Table helper | localStorage prototype | Unit tests | No import/export/formulas | Database/table expansion |
| Editor | Todos | [PARTIAL] | Todo blocks exist | checked flag | localStorage prototype | Limited | No task rollups | Projects/tasks foundation |
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
| Calendar | Month | [PARTIAL] | Works | Calendar helper | localStorage prototype | Tests | Needs more QA | Calendar completion |
| Calendar | Week | [PARTIAL] | Works | Calendar helper | localStorage prototype | Tests | Needs polish | Calendar completion |
| Calendar | Day | [PARTIAL] | Works | Calendar helper | localStorage prototype | Tests | Needs polish | Calendar completion |
| Calendar | Agenda | [PARTIAL] | Works | Calendar helper | localStorage prototype | Tests | Needs polish | Calendar completion |
| Calendar | Event create/edit/delete | [PARTIAL] | Works in prototype | Calendar helper/item records | localStorage prototype | Tests and QA | No recurrence/reminders | Calendar completion |
| Calendar | All-day | [PARTIAL] | Basic field | Calendar helper | localStorage prototype | Tests | Needs more UI | Calendar completion |
| Calendar | Timed | [PARTIAL] | Basic field | Calendar helper | localStorage prototype | Tests | Needs more UI | Calendar completion |
| Calendar | Recurrence | [NOT STARTED] | Not visible as working | Not modeled | None | None | Requires recurrence rules | Later calendar phase |
| Calendar | Reminders | [FUTURE NATIVE] | Not visible | Not modeled | None | None | Needs native notifications | Native Windows readiness |
| Calendar | Task links | [PARTIAL] | Relation model can link | Relations | localStorage prototype | Limited | No task engine | Projects/tasks foundation |
| Calendar | ICS | [NOT STARTED] | Not visible | Not modeled | None | None | Needs import/export | Import/export manager |
| Graph | Global graph | [PARTIAL] | Route exists | Provider items/relations | localStorage prototype | Limited | No index/filter | Graph relation foundation |
| Graph | Local automatic graph | [NOT STARTED] | Not visible | Not modeled | None | None | No wiki-link parsing | Graph relation foundation |
| Graph | Manual local canvas | [NOT STARTED] | Not visible | Not modeled | None | None | No canvas model | Later graph/canvas phase |
| Graph | Editable nodes | [NOT STARTED] | Not visible | Not modeled | None | None | No graph editor | Later graph/canvas phase |
| Graph | Directed arrows | [PARTIAL] | Relation lines exist | Relation records | localStorage prototype | Limited | No direction UI | Graph relation foundation |
| Graph | Filters | [NOT STARTED] | Not visible | Not modeled | None | None | No filter model | Graph relation foundation |
| Graph | Clustering | [NOT STARTED] | Not visible | Not modeled | None | None | No graph engine | Later graph/canvas phase |
| Graph | Focus mode | [NOT STARTED] | Not visible | Not modeled | None | None | No focused graph | Later graph/canvas phase |
| Graph | Export image/PDF | [NOT STARTED] | Not visible | Not modeled | None | None | Needs export manager | Import/export manager |
| Vault/storage | VaultProvider | [PARTIAL] | Used app-wide | Interface exists | localStorage prototype | Provider tests | Final providers missing | Native readiness |
| Vault/storage | LocalStorage provider | [IMPLEMENTED] | Labeled prototype | Provider exists | browser localStorage | Provider tests | Prototype only | Keep until native storage |
| Vault/storage | SQLite provider | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs SQLite architecture | SQLite provider |
| Vault/storage | File vault | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs Tauri filesystem | Portable vault folders |
| Vault/storage | Lock file | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs filesystem | Portable vault folders |
| Vault/storage | Backups | [NOT STARTED] | Not working | Not modeled | None | None | Needs backup manifest | Backup/export/restore hardening |
| Vault/storage | Restore | [NOT STARTED] | Not working | Not modeled | None | None | Needs safe restore preview | Backup/export/restore hardening |
| Vault/storage | Export | [NOT STARTED] | Not working | Not modeled | None | None | Needs export manager | Import/export manager |
| Vault/storage | Import | [NOT STARTED] | Not working | Not modeled | None | None | Needs import manager | Import/export manager |
| Vault/storage | Markdown mirrors | [FUTURE NATIVE] | Not working | Not modeled | None | None | Needs file vault writer | Markdown mirrors |
| Vault/storage | Repair/recovery | [NOT STARTED] | Not working | Not modeled | None | None | Needs audit/repair helpers | Repair/recovery center |
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

## 6. Module Blueprints

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
- UI now: global relation graph route.
- Implemented now: provider items as nodes and relations as lines.
- Not implemented yet: local graph, manual canvas, filters, clustering, backlinks index, wiki-link parsing, export.
- Data model: `MizaanRelation` plus provider items.
- Routes: `/graph`
- Main components: graph route.
- Empty states: no provider items.
- Error states: invalid relations are skipped.
- Actions: open nodes.
- Disabled/future actions: no fake graph editing.
- Tests required: relation graph helper once extracted.
- Screenshots required: graph overview.
- Done criteria: filters and relation focus work before full implemented claim.
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
- UI now: generic project space and templates.
- Implemented now: project pages and generic blocks.
- Not implemented yet: task model, milestones, statuses, project dashboard, timeline.
- Data model: generic item and blocks.
- Routes: `/projects`, `/page/$id`
- Main components: `SpacePage`, `PageWorkspace`.
- Empty states: no project pages.
- Error states: generic page errors.
- Actions: create project page.
- Disabled/future actions: no fake task automations.
- Tests required: project record helper once introduced.
- Screenshots required: project list and detail.
- Done criteria: task foundation and project metadata verified.
- Future phases: projects/tasks foundation.

### 6.9 People

- Purpose: local relationship context and personal profiles.
- User mental model: people are local profile pages, not a cloud CRM.
- Current status: [PARTIAL]
- UI now: people route and person template.
- Implemented now: generic person pages.
- Not implemented yet: typed contact model, interactions, relationship links, privacy rules.
- Data model: generic item and blocks.
- Routes: `/people`, `/page/$id`
- Main components: `SpacePage`, `PageWorkspace`.
- Empty states: no people pages.
- Error states: generic page errors.
- Actions: create person page.
- Disabled/future actions: no cloud contact sync or CRM integrations.
- Tests required: person metadata helper later.
- Screenshots required: people list and detail.
- Done criteria: local profile model and relation UI verified.
- Future phases: People/CRM foundation.

### 6.10 Finance

- Purpose: local finance records, budgets, and planning.
- User mental model: local records without bank connections.
- Current status: [PARTIAL]
- UI now: finance route and finance template.
- Implemented now: generic finance pages.
- Not implemented yet: ledger schema, receipt links, budget views, calculations, imports.
- Data model: generic item/properties.
- Routes: `/finance`, `/page/$id`
- Main components: `SpacePage`, `PageWorkspace`.
- Empty states: no finance pages.
- Error states: generic page errors.
- Actions: create finance record.
- Disabled/future actions: no bank sync, payment APIs, or online connections.
- Tests required: finance model helper later.
- Screenshots required: finance list and detail.
- Done criteria: local records and validation verified.
- Future phases: Finance foundation.

### 6.11 Trackers

- Purpose: habits, study, exercise, custom progress.
- User mental model: local tracker pages and future check-in records.
- Current status: [PARTIAL]
- UI now: trackers route and template.
- Implemented now: generic tracker pages.
- Not implemented yet: tracker schema, check-ins, charts, rollups, goals integration.
- Data model: generic item/properties/blocks.
- Routes: `/trackers`, `/page/$id`
- Main components: `SpacePage`, `PageWorkspace`.
- Empty states: no tracker pages.
- Error states: generic page errors.
- Actions: create tracker page.
- Disabled/future actions: no fake charts.
- Tests required: tracker helper later.
- Screenshots required: tracker list and detail.
- Done criteria: check-in persistence and summaries verified.
- Future phases: Trackers/goals foundation.

### 6.12 Goals

- Purpose: outcome planning and goal tracking.
- User mental model: goals connect to projects, trackers, and calendar.
- Current status: [BLUEPRINT ONLY]
- UI now: product-map status only.
- Implemented now: none.
- Not implemented yet: route, data model, templates, links, progress logic.
- Data model: proposed goal item and goal metadata.
- Routes: future `/goals`.
- Main components: future goal route and helper.
- Empty states: future.
- Error states: future.
- Actions: future create/edit goal.
- Disabled/future actions: all goal actions are future.
- Tests required: goal model and route tests.
- Screenshots required: future goal list/detail.
- Done criteria: persisted goals linked to projects/trackers/calendar.
- Future phases: Trackers/goals foundation.

### 6.13 Templates

- Purpose: create real local pages from known blueprints.
- User mental model: a template is a creation source.
- Current status: [PARTIAL]
- UI now: route and picker.
- Implemented now: fixed template definitions and provider-backed creation.
- Not implemented yet: template editor, custom templates, template versions.
- Data model: static template definitions.
- Routes: `/templates`
- Main components: `PageTemplatePicker`, templates route.
- Empty states: none needed while fixed templates exist.
- Error states: unknown template falls back to first template.
- Actions: create items from templates.
- Disabled/future actions: no template editing controls.
- Tests required: template creation helper tests.
- Screenshots required: templates route.
- Done criteria: template editor and custom storage verified.
- Future phases: Templates expansion.

### 6.14 Vault

- Purpose: show storage truth and health.
- User mental model: understand what is currently persisted and what is not.
- Current status: [PARTIAL]
- UI now: provider info and health route.
- Implemented now: provider info, health counts, prototype warnings.
- Not implemented yet: portable folder, SQLite, lock file, markdown mirrors, native repair.
- Data model: `VaultProviderInfo`, `VaultHealth`.
- Routes: `/vault`
- Main components: vault route and provider.
- Empty states: no special empty state.
- Error states: warnings.
- Actions: open settings.
- Disabled/future actions: no fake folder picker or backup buttons.
- Tests required: provider tests and future storage tests.
- Screenshots required: vault route.
- Done criteria: native providers and recovery verified.
- Future phases: backup/export/restore, native storage.

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
- UI now: route with theme controls and read-only provider facts.
- Implemented now: theme state and prototype facts.
- Not implemented yet: full settings model, vault configuration, privacy settings, keyboard settings.
- Data model: theme/right-panel local state and provider info.
- Routes: `/settings`
- Main components: settings route, theme hook.
- Empty states: none.
- Error states: provider warnings.
- Actions: theme selection.
- Disabled/future actions: no fake backup/native controls.
- Tests required: theme tests and route QA.
- Screenshots required: settings/sidebar.
- Done criteria: settings persist and no dangerous controls.
- Future phases: settings hardening and privacy/lock UX.

### 6.17 Imports

- Purpose: future safe import manager for JSON, Markdown, CSV, and documents.
- User mental model: preview before importing, never destructive by surprise.
- Current status: [BLUEPRINT ONLY]
- UI now: product-map future status only.
- Implemented now: none.
- Not implemented yet: route, validation, preview, mappings, error states.
- Data model: import manifest.
- Routes: future `/imports`.
- Main components: future import manager.
- Empty states: future unsupported state.
- Error states: invalid import preview.
- Actions: future import preview and commit.
- Disabled/future actions: all import actions are future.
- Tests required: import validation and restore safety.
- Screenshots required: import preview and failure states.
- Done criteria: no destructive import without confirmation.
- Future phases: Import/export manager.

### 6.18 Exports

- Purpose: future local export manager.
- User mental model: export selected data into readable formats.
- Current status: [BLUEPRINT ONLY]
- UI now: product-map future status only.
- Implemented now: none.
- Not implemented yet: route, export manifest, Markdown/PDF/DOCX/JSON exports.
- Data model: export manifest.
- Routes: future `/exports`.
- Main components: future export manager.
- Empty states: future.
- Error states: export failure state.
- Actions: future export preview/execute.
- Disabled/future actions: all export actions are future.
- Tests required: export validation and file output tests.
- Screenshots required: export UI.
- Done criteria: exported files verified.
- Future phases: Import/export manager.

### 6.19 Backups

- Purpose: future backup and restore surface.
- User mental model: protect the vault through previewable local backups.
- Current status: [BLUEPRINT ONLY]
- UI now: product-map future status only.
- Implemented now: none.
- Not implemented yet: backup manifest, restore preview, validation, native file output.
- Data model: backup manifest.
- Routes: future `/backups`.
- Main components: future backup manager.
- Empty states: no backups yet.
- Error states: invalid backup restore state.
- Actions: future backup/restore.
- Disabled/future actions: all backup actions are future.
- Tests required: backup validation and restore tests.
- Screenshots required: backup route and restore preview.
- Done criteria: safe backup and restore validated.
- Future phases: Backup/export/restore hardening.

### 6.20 Repair Center

- Purpose: future detection and repair of malformed data.
- User mental model: inspect issues and approve repairs.
- Current status: [BLUEPRINT ONLY]
- UI now: product-map future status only.
- Implemented now: helper-level validation exists for some database data only.
- Not implemented yet: route, issue registry, repair previews, repair logs.
- Data model: repair report.
- Routes: future `/repair`.
- Main components: future repair center.
- Empty states: no issues.
- Error states: failed repair with rollback instructions.
- Actions: future inspect and repair.
- Disabled/future actions: all repair actions are future.
- Tests required: repair helpers and UI safety tests.
- Screenshots required: issue list and clean state.
- Done criteria: repairs are previewable and non-destructive.
- Future phases: Repair/recovery center.

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

## 7. UI Blueprint

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

## 8. Route Map

| Route | Purpose | Current status | UI expectation | Data source | Actions | Future actions | Done criteria | Test requirements |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Home | [PARTIAL] | Recent work, vault truth | Provider snapshot | Quick create, quick capture | Custom widgets | Persisted quick capture and honest status | Route QA and helper tests |
| `/search` | Search local records | [PARTIAL] | Search/filter results | Provider snapshot | Query/filter/open | Saved searches, native index | Accurate results and no remote calls | Search helper tests and QA |
| `/databases` | Database list | [PARTIAL] | Create/open database pages | Provider items | New database | Filters/views/import/export | No fake view controls | Database tests and QA |
| `/graph` | Relation graph | [PARTIAL] | Nodes/edges from provider | Items/relations | Open nodes | Filters/canvas/export | Real relations only | Graph tests later |
| `/calendar` | Calendar module | [PARTIAL] | Views and event editor | Calendar item records | Event CRUD | Recurrence/reminders/ICS | Local event persistence | Calendar tests and QA |
| `/documents` | Document records | [PARTIAL] | Metadata-only records | Document items | New document record after next phase | Import/preview/OCR | Honest metadata records | Document tests and QA |
| `/templates` | Template sources | [PARTIAL] | Create provider items | Static templates | Create from template | Template editor | Templates create real items | Template tests |
| `/vault` | Vault health | [PARTIAL] | Storage truth | Provider info/health | Open settings | Folder picker, backup | No native overclaim | Provider tests and QA |
| `/trash` | Trash/recovery | [PARTIAL] | Deleted items | Provider items | Restore | Permanent delete policy | Safe restore | Provider tests |
| `/settings` | Settings/status | [PARTIAL] | Theme/prototype facts | Theme/local/provider state | Theme changes | Vault config/privacy | Safe preferences persist | Theme tests and QA |
| `/page/$id` | Page workspace | [PARTIAL] | Page editor/detail | Provider item/blocks | Edit title/blocks, archive, subpages | Version history/export/native files | Persisted edits | Page workspace tests and QA |
| `/blueprint` | Product map | [PARTIAL] | Honest product/module statuses | Product-map constants | Open live routes | Future modules stay disabled/status-only | Statuses match blueprint | Product-map tests and QA |
| `/imports` | Import manager | [BLUEPRINT ONLY] | Future-only | Import manifest | None now | Preview/import | No destructive import | Future tests |
| `/exports` | Export manager | [BLUEPRINT ONLY] | Future-only | Export manifest | None now | Export selected data | Verified exports | Future tests |
| `/backups` | Backup manager | [BLUEPRINT ONLY] | Future-only | Backup manifest | None now | Backup/restore | Restore preview | Future tests |
| `/repair` | Repair center | [BLUEPRINT ONLY] | Future-only | Repair report | None now | Preview repairs | Non-destructive repairs | Future tests |
| `/privacy` | Privacy/lock center | [BLUEPRINT ONLY] | Future-only | Privacy metadata | None now | Lock/private/encrypt | No leaks | Future tests |
| `/local-ai` | Local AI center | [FUTURE LOCAL AI] | Future-only | Local AI metadata | None now | Local OCR/similarity | No cloud calls | Future tests |

---

## 9. Data Model Blueprint

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

- Current status: [PARTIAL]
- Proposed fields: title, date, time, all-day flag, status, calendar type, notes.
- Storage now: calendar item properties/metadata.
- Storage later: SQLite event table plus mirror.
- Validation rules: valid dates/times and safe fallbacks.
- Migration notes: existing calendar records must remain openable.
- Test requirements: calendar event tests.

### Person/Contact Model

- Current status: [NOT STARTED]
- Proposed fields: name, relationship, contact notes, categories, linked items.
- Storage now: generic item until helper exists.
- Storage later: SQLite person table plus mirror.
- Validation rules: no cloud contact sync, local-only fields.
- Migration notes: preserve person pages.
- Test requirements: person helper tests.

### Project/Task Model

- Current status: [NOT STARTED]
- Proposed fields: project status, milestones, task records, due dates, links.
- Storage now: generic items/blocks.
- Storage later: SQLite project/task tables plus mirror.
- Validation rules: no fake task rollups.
- Migration notes: preserve current project pages.
- Test requirements: project/task helper and UI tests.

### Finance Model

- Current status: [NOT STARTED]
- Proposed fields: record type, amount, currency, date, category, linked documents.
- Storage now: generic item/properties.
- Storage later: SQLite finance table plus mirror.
- Validation rules: numeric/date normalization, no bank sync.
- Migration notes: preserve finance pages.
- Test requirements: finance helper tests.

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

- Current status: [NOT STARTED]
- Proposed fields: backup id, createdAt, app version, vault id, file list, checksums.
- Storage now: none.
- Storage later: backup manifest in vault/backups folder.
- Validation rules: checksums and restore preview required.
- Migration notes: old backups may need adapter.
- Test requirements: backup/restore tests.

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

## 10. Implementation Phase Roadmap

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

- Goal: make relations more explicit and graph filters/focus more useful.
- Why now: documents/projects/people need relation truth.
- Preconditions: document metadata relation ids normalized.
- Implementation tasks: graph helpers, filters, relation summaries, selected node focus.
- Files likely touched: graph route, relation helpers/tests, page panel.
- Tests required: node/edge/filter tests.
- Browser QA required: graph route and linked records.
- Screenshots required: graph filtered/focus states.
- Documentation required: blueprint and reports.
- Done criteria: graph uses real provider records and filters work.
- What not to implement: full manual canvas.
- Next phase: Calendar completion.

### Phase D - Calendar completion

- Goal: finish local calendar event behavior short of recurrence/reminders.
- Why now: calendar is core and already partial.
- Preconditions: stable provider/event helpers.
- Implementation tasks: day/week polish, all-day/timed behavior, delete/archive, route QA.
- Files likely touched: calendar helpers/tests and view.
- Tests required: event model, date navigation, persistence.
- Browser QA required: create/edit/delete/refresh.
- Screenshots required: month/week/day/agenda.
- Documentation required: blueprint and reports.
- Done criteria: local event management is verified.
- What not to implement: reminders, recurrence, ICS, sync.
- Next phase: Database views and filters.

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
- Implementation tasks: export JSON validation, restore preview, failed import state.
- Files likely touched: vault/export helpers/routes.
- Tests required: validation, restore preview, destructive confirmation.
- Browser QA required: export/preview/failure.
- Screenshots required: backup/export screens.
- Documentation required: blueprint and reports.
- Done criteria: no destructive restore without confirmation.
- What not to implement: native filesystem backup.
- Next phase: Templates expansion.

### Phase G - Templates expansion

- Goal: improve real provider-backed templates.
- Why now: modules need creation sources.
- Preconditions: document and database templates stable.
- Implementation tasks: more templates, template tests, route organization.
- Files likely touched: page workspace templates and picker.
- Tests required: each template creates valid item/blocks/metadata.
- Browser QA required: create selected templates.
- Screenshots required: templates route and created pages.
- Documentation required: blueprint and reports.
- Done criteria: no fake templates.
- What not to implement: full template editor unless scoped.
- Next phase: Projects/tasks foundation.

### Phase H - Projects/tasks foundation

- Goal: add task/project metadata foundation.
- Why now: projects need structured work tracking.
- Preconditions: relation and template foundations.
- Implementation tasks: project/task helpers, route/list/detail UI.
- Files likely touched: projects route, helpers/tests, page panel.
- Tests required: task normalization and persistence.
- Browser QA required: create/edit project/task.
- Screenshots required: project/task views.
- Documentation required: blueprint and reports.
- Done criteria: tasks are real provider-backed records.
- What not to implement: complex scheduling/automation.
- Next phase: People/CRM foundation.

### Phase I - People/CRM foundation

- Goal: local person profile model and relation summaries.
- Why now: projects/documents/finance link to people.
- Preconditions: relation helpers stable.
- Implementation tasks: person metadata helper, route/list/detail UI.
- Files likely touched: people route, helpers/tests.
- Tests required: person normalization.
- Browser QA required: create/edit person.
- Screenshots required: people route/detail.
- Documentation required: blueprint and reports.
- Done criteria: local people profiles work without sync.
- What not to implement: cloud contacts or CRM integrations.
- Next phase: Finance foundation.

### Phase J - Finance foundation

- Goal: local finance records with validation and document links.
- Why now: receipts/invoices connect to documents.
- Preconditions: document and relation helpers.
- Implementation tasks: finance metadata helper, route/list/detail UI.
- Files likely touched: finance route, helpers/tests.
- Tests required: amount/date/category normalization.
- Browser QA required: create/edit finance record.
- Screenshots required: finance route/detail.
- Documentation required: blueprint and reports.
- Done criteria: local finance records persist.
- What not to implement: bank sync, online payment APIs.
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

## 11. Testing Standard

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

## 12. Prompting Standard For Future Runs

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
