# Mizaan PRD Local-First Life OS

Date: 2026-06-04

This PRD is a product and engineering requirements document. It does not claim that all listed features are implemented. Each feature must be judged by its current status, evidence, tests, and QA proof.

## 1. Executive Summary

Mizaan is a local-first, page-first personal life operating system for a single user who wants notes, documents, projects, tasks, people, finance, trackers, goals, calendar, databases, graph relationships, templates, vault status, and recovery workflows in one calm workspace.

Mizaan exists because the user should be able to organize life data without being forced into cloud accounts, Google services, hosted databases, remote sync, telemetry, or backend dependency. The product direction is Notion-like in familiarity but local-first in law.

Current implementation truth: Mizaan is a React/TanStack/Vite browser prototype using `LocalStorageVaultProvider` and browser `localStorage` for provider-backed items, blocks, relations, provider/session/theme/right-panel state, and browser archive JSON. This is not lifetime storage.

Future direction: Mizaan should eventually become a Windows/native desktop app with a real native shell, SQLite runtime provider, native filesystem access, human-readable portable vault folders, backup/restore, and native document handling. Those are future phases only until implemented and verified.

There is no cloud/account dependency in the current product law or implementation target.

## 2. Product Laws

- Local-first is mandatory.
- Browser localStorage is a prototype boundary, not lifetime storage.
- No Google, Google Drive, OAuth, Firebase, Supabase, Clerk, auth provider, backend, telemetry, hidden remote state, cloud sync, or account dependency.
- Do not clear user data or `localStorage` as an implementation shortcut.
- Do not add fake UI, fake data, fake analytics, fake import/export, fake privacy, or dead controls.
- Do not overclaim. A module can be visible and still be partial.
- Tests, validation, and browser QA evidence must exist before implementation claims.
- Native/Tauri/SQLite/filesystem/mobile/encryption/app-lock work remains future until real code, tests, and QA prove it.
- Archive export/import in the browser is useful but is not a final native backup.
- Destructive restore or replace behavior must require preview and explicit confirmation.

## 3. Current Implementation Truth

| Area                                 | Status                             | Current truth                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                                 | Partial                            | Route exists with recent provider data, quick capture, product map status, and prototype vault truth.                                                                                                                                                                                                                                                                             |
| Sidebar/navigation                   | Partial                            | Core nav, system tools, pinned pages, page tree, duplicate, trash, pin/unpin, hover "+" child page creation, and child picker exist.                                                                                                                                                                                                                                              |
| Search                               | Partial                            | Local provider search indexes titles, summaries, tags, properties, metadata, and block text. No saved searches or native index.                                                                                                                                                                                                                                                   |
| Databases/tables                     | Partial                            | Basic provider-backed table model, stateful column sorting, cell filters, row/column/cell editing, stats, and validation helpers exist. No formulas, rollups, or SQLite.                                                                                                                                                                                                          |
| Documents                            | Partial                            | Metadata-only document records, typed helpers, route/list, detail metadata panel, templates, search, relation IDs, tests, and QA exist. No real file import, preview, OCR, thumbnails, or native document storage.                                                                                                                                                                |
| Graph                                | Implemented browser interactive foundation | Provider graph helper, interactive node selection, graph filters/search, local neighborhood focus, drag-to-position visual nodes, explicit relations, wiki-link edges, metadata-derived edges, parent hierarchy edges, orphan summaries, and current-graph browser JSON export exist. No manual canvas boards, custom nodes/arrows, persistent layouts, clustering, image/native export, or AI graph. |
| Projects/tasks                       | Partial                            | Typed project/task metadata, Projects/Tasks Kanban status tracking views with drag-and-drop, project route/list, dedicated `/tasks` route/list, board, bounded timeline UI, recurrence metadata, reminder metadata, calendar-link metadata, task records, linked task editing, templates, and graph edges exist. No saved task views, recurrence generation, reminder alarms, native notifications, dependencies, calendar scheduling, or full Gantt engine. |
| People/CRM                           | Partial                            | Typed person and interaction metadata, route/list, linked interactions, detail panels, templates, search, graph edges, and metadata-only privacy flags exist. No contact sync/import, reminders, full timeline, or privacy enforcement.                                                                                                                                           |
| Finance                              | Partial                            | Typed local finance records, route/list, detail panel, amount/currency/date/status normalization, summaries, templates, search, and graph edges exist. No bank sync/import, payment APIs, tax/accounting, OCR, or reminders.                                                                                                                                                      |
| Persistence/export/restore hardening | Implemented for browser archive    | JSON archive helpers, validation, restore preview, safe merge, explicit-confirmation replace, corruption tests, metadata round-trip, and Settings/Vault UI exist for current provider data.                                                                                                                                                                                       |
| Trackers/goals                       | Partial                            | Typed tracker and goal metadata, routes, creation, check-ins/progress fields, detail panels, templates, search, and graph edges exist. No charts, fake streak engine, reminders, notifications, AI coaching, wearable import, or medical claims.                                                                                                                                  |
| Calendar                             | Partial / implemented foundation   | Core local calendar, virtual deadline events derived from tasks and projects, provider-backed views/CRUD, metadata panel, template/command-palette, and tests exist. No recurrence, reminders, ICS, native notifications, or sync.                                                                                                                                                |
| Templates                            | Partial                            | A tested static template registry exposes implemented, partial, and future templates; `/templates` has search, category/status filters, counts, previews, and disabled future entries. Implemented templates create real provider-backed records for current modules. No template editor, custom template storage, version history, import/export, AI generation, or marketplace. |
| Vault                                | Partial                            | Provider status, health counts, capability truth, and browser archive controls exist. No portable folder, SQLite, Tauri filesystem, lock file, markdown mirrors, native backup, or encrypted backup.                                                                                                                                                                              |
| Import/Export Manager                | Partial                            | `/import-export` exists with browser archive JSON support, current capability truth, future-only unsupported formats, and the shared archive panel for export, paste/load, validate, preview, safe merge, and guarded replace. No native file/folder import or markdown/CSV/PDF export.                                                                                           |
| Repair/Recovery Center               | Partial                            | `/repair` exists with provider health summary, category counts, duplicate ID checks, orphan checks, invalid metadata-reference checks, issue/suggestion reporting, archive validation, restore preview, safe merge, and guarded replace. No automatic repair, migration rollback, native recovery, SQLite repair, or encrypted recovery.                                          |
| Trash                                | Partial                            | Soft delete and restore provider paths exist. No permanent delete policy, retention policy, restore history, or native recovery.                                                                                                                                                                                                                                                  |
| Settings                             | Hardened                           | System status, data safety warnings, complete feature status table, theme controls, provider facts, archive panel, and transparent limitations. Most settings remain read-only prototype facts.                                                                                                                                                                                                                                                           |
| DOCX work log                        | Partial evidence artifact          | Structurally readable and updated by previous phases. Visual render QA depends on local office tooling.                                                                                                                                                                                                                                                                           |
| Product Blueprint                    | Active architecture map            | `docs/Plan/Mizaan_Product_Blueprint.md` remains architecture/phase map and must reference this PRD.                                                                                                                                                                                                                                                                               |
| Old master Markdown                  | Append-only historical/source plan | `docs/Plan/Mizaan_A_to_Z_Plan.md` remains append-only. Do not rewrite old text.                                                                                                                                                                                                                                                                                                   |
| Browser/localStorage provider        | Implemented prototype              | `LocalStorageVaultProvider` stores provider data in browser localStorage. Not final lifetime storage.                                                                                                                                                                                                                                                                             |
| Tauri                                | Not started                        | No Tauri shell or commands.                                                                                                                                                                                                                                                                                                                                                       |
| SQLite                               | Not started                        | No SQLite provider, schema, migrations, or backup.                                                                                                                                                                                                                                                                                                                                |
| Native filesystem                    | Not started                        | No native file picker, folder picker, vault folders, or document file import.                                                                                                                                                                                                                                                                                                     |
| Mobile                               | Not started                        | No Android/iOS companion app.                                                                                                                                                                                                                                                                                                                                                     |
| Encryption/app lock                  | Not started                        | Private/sensitive flags are metadata only; no encryption, app lock, hidden search, or hidden graph behavior.                                                                                                                                                                                                                                                                      |

## 4. Target User Experience

- Notion-like page familiarity: pages, blocks, templates, sidebars, metadata panels, search, and graph should feel familiar and calm.
- Local-first vault model: the user should understand where data lives and what is prototype versus final storage.
- Clear spaces/pages/modules distinction: Notes/Documents/Projects/People/Finance/Trackers/Goals are page-like spaces; Calendar, Graph, Search, Vault, Trash, Settings, and future repair/import tools are system/core modules.
- Right panel metadata: user-facing module metadata should be edited in page context without direct localStorage writes.
- Sidebar behavior: navigation must be predictable, dense, and honest; pages and system tools should not expose fake actions.
- Templates as creation sources: templates create real provider-backed local records, not demo cards.
- Graph as relationship layer: graph shows real provider relations and typed metadata relations only.
- Search as universal local index: search should index current provider data and metadata without remote services.
- Settings/Vault as system control: these surfaces should explain provider truth, archive support, and limitations.

## 5. Scope

Implemented foundations:

- Browser provider data surface for items, blocks, relations, and typed metadata.
- Module foundations for documents, graph, projects/tasks, people/CRM, finance, trackers, and goals.
- Browser archive export, validation, restore preview, safe merge, and guarded replace.

Partial foundations:

- Home, sidebar, search, databases/tables, calendar, templates, vault, trash, settings, and privacy metadata flags.
- Browser QA and screenshot evidence exists for recent phases, but automation can time out.

Not implemented:

- Real markdown/CSV/PDF export, native document/file import, folder import, migration rollback, version history, permanent delete policy, real hidden search/graph, app lock, encryption, native backups.

Deliberately not implemented:

- Cloud, auth, Google, Google Drive, Firebase, Supabase, Clerk, backend, telemetry, remote sync, bank sync, payment providers, tax/accounting engines, and fake AI/cloud features.

Future native-only work:

- Tauri, native filesystem, SQLite, portable vault folders, markdown mirrors, native backup/restore, native document import, native notifications.

Future mobile work:

- Android/iOS companion, mobile capture, and manual local sync/conflict policy.

Future local AI work:

- Local-only OCR, embeddings, semantic graph, summarization, and planning after local document storage exists.

## 6. Module Requirements

Each module below must be implemented through provider-backed data, tested helper APIs, user-visible honest UI, and documented status updates before claiming completion.

### Home

- Purpose: daily entry point, recent work, quick capture, and product truth.
- User stories: create a local note quickly; see recent local work; understand current storage boundary.
- Current status: partial.
- Required data model: provider items, recent item ordering, quick-capture note input.
- Required UI: recent items, quick capture, product status, vault warning.
- Required persistence: provider-backed item create/update only.
- Required graph/search/template integration: created notes must be searchable and graphable when relations exist.
- Success criteria: quick capture persists after refresh and no fake dashboard data appears.
- Test criteria: provider create and home data helpers covered indirectly or directly.
- Browser QA criteria: create/capture, refresh, open created item.
- Limitations: no native dashboard or automation engine.

### Search

- Purpose: universal local index over provider data.
- User stories: find pages by title, tags, metadata, properties, and blocks.
- Current status: partial.
- Required data model: local search result model and query filters.
- Required UI: query input, filters, result list, empty/error states.
- Required persistence: no separate persistence until saved searches exist.
- Required graph/search/template integration: every typed module metadata should be indexed.
- Success criteria: module metadata is searchable with no remote requests.
- Test criteria: search-index tests for each typed metadata surface.
- Browser QA criteria: route loads and queries return expected local records.
- Limitations: no saved searches or native extracted document index.

### Databases/tables

- Purpose: local structured table records and simple table blocks.
- User stories: create/edit local database rows, columns, cells, descriptions, and empty states.
- Current status: partial.
- Required data model: database/table metadata in provider items/blocks.
- Required UI: table grid, stats, editable description, empty rows, validation warnings.
- Required persistence: provider-backed item/block updates.
- Required graph/search/template integration: database items searchable; relations future.
- Success criteria: edits persist and explicit empty rows stay empty.
- Test criteria: database and simple-table helper tests.
- Browser QA criteria: create/edit/delete/refresh table flow.
- Limitations: no formulas, rollups, relations as properties, CSV import/export, board/gallery/timeline.

### Documents

- Purpose: local document metadata records until native file storage exists.
- User stories: create a document record, add file metadata, link it to projects/people/finance, search it.
- Current status: partial.
- Required data model: typed document metadata on `MizaanItem.metadata`.
- Required UI: documents route, cards/list, document metadata panel, unsupported import/preview states.
- Required persistence: provider-backed document item metadata.
- Required graph/search/template integration: linked IDs feed graph and search.
- Success criteria: document metadata persists and does not pretend files are imported.
- Test criteria: document-record, search, graph, template tests.
- Browser QA criteria: create/edit/refresh/search document record.
- Limitations: no real file import, preview, OCR, thumbnails, duplicate detection, native storage.

### Graph

- Purpose: local relationship layer from provider relations and typed metadata IDs.
- User stories: see connected items, inspect edges, filter/search graph, open nodes, focus local neighborhood, drag to position, export the current graph model as browser JSON.
- Current status: implemented interactive browser foundation.
- Required data model: graph nodes/edges from provider items, relations, parent links, metadata relation IDs.
- Required UI: graph route, filters/search, summaries, local focus view, draggable visual layout, orphan state, scoped JSON export action.
- Required persistence: relations and metadata live in provider data. Layouts do not persist yet.
- Required graph/search/template integration: relation IDs must be normalized by module helpers.
- Success criteria: no fake graph edges; invalid targets are ignored or reported; local focus filters visual map; graph JSON export includes current nodes/edges plus honest limitations.
- Test criteria: graph-model tests for nodes, edge extraction, orphans, duplicates, invalid targets, search filtering, and export payload stability.
- Browser QA criteria: graph route loads, filters work, nodes are draggable, local focus switches context, and shows real module nodes/edges.
- Limitations: no manual canvas, custom nodes, custom arrows, saved layout, clustering, image/PDF export, native graph mirror/export, or local AI graph.

### Projects/tasks

- Purpose: local work planning records and task records.
- User stories: create projects and linked tasks, edit metadata, see task counts, link to people/documents/finance.
- Current status: partial.
- Required data model: typed project/task metadata and linked IDs.
- Required UI: projects route, project metadata panel, linked task section.
- Required persistence: provider-backed items.
- Required graph/search/template integration: project/task metadata indexed and graphed.
- Success criteria: linked task edits persist and no fake progress engine appears.
- Test criteria: project/task helper, graph, search, template tests.
- Browser QA criteria: create/edit project and task, refresh, search, graph proof.
- Limitations: no saved task views, full Gantt engine, recurrence generation, reminder alarms, dependencies, calendar event creation, calendar scheduling automation, or native notifications.

### People/CRM

- Purpose: local relationship context and interaction records.
- User stories: create person records, edit contact/relationship metadata, add linked interactions, search and graph people context.
- Current status: partial.
- Required data model: person and interaction metadata.
- Required UI: people route, person/interaction metadata panels, interaction section.
- Required persistence: provider-backed people category items.
- Required graph/search/template integration: relation IDs feed graph/search.
- Success criteria: linked interaction records are real and privacy flags are metadata-only.
- Test criteria: person/interaction helper, graph, search, template tests.
- Browser QA criteria: create/edit person and interaction, refresh, search, graph.
- Limitations: no Google Contacts, vCard/CSV import, phone/email sync, reminders, privacy enforcement.

### Finance

- Purpose: local manual finance records without bank/payment integration.
- User stories: create transactions/budgets/bills/subscriptions, edit amount/status/category, link to documents/projects/people.
- Current status: partial.
- Required data model: typed finance metadata.
- Required UI: finance route, summary cards, finance metadata panel.
- Required persistence: provider-backed finance items.
- Required graph/search/template integration: finance metadata indexed and relation IDs graphed.
- Success criteria: totals derive from real local records and no bank/accounting claim exists.
- Test criteria: finance helper, graph, search, template, archive round-trip tests.
- Browser QA criteria: create/edit finance record, refresh, search, graph.
- Limitations: no bank sync, payment API, tax/accounting, OCR, reminders, native finance privacy.

### Trackers/goals

- Purpose: local tracker records and local goal records.
- User stories: create trackers/goals, edit metadata, add tracker check-ins, set goal progress, link goals to trackers.
- Current status: partial.
- Required data model: typed tracker and goal metadata.
- Required UI: tracker/goal routes, detail metadata panels, check-in/progress controls.
- Required persistence: provider-backed tracker/goal items.
- Required graph/search/template integration: tracker/goal metadata indexed and graphed.
- Success criteria: check-ins/progress fields persist without fake streak/progress history claims.
- Test criteria: tracker/goal helper, graph, search, template, archive round-trip tests.
- Browser QA criteria: create/edit tracker and goal, refresh, search, graph.
- Limitations: no charts, rollups, reminders, notifications, AI coaching, wearable/medical import.

### Calendar

- Purpose: local time module.
- User stories: create local events, view by month/week/day/agenda, link future tasks/goals.
- Current status: implemented browser/localStorage foundation; overall Calendar remains partial.
- Required data model: typed calendar event metadata with event type, status, dates, times, location, notes, relation IDs, and metadata-only private/sensitive flags.
- Required UI: calendar route and views plus Calendar event metadata panel for page context.
- Required persistence: provider-backed calendar items.
- Required graph/search/template integration: search event metadata; graph links when relation IDs exist; templates and command palette create provider-backed Calendar event records.
- Success criteria: event CRUD persists, Calendar remains a core module, typed metadata normalizes safely, and unsupported scheduling/reminder/sync features remain honest future work.
- Test criteria: calendar helper/view tests, graph edge tests, search metadata tests, serial `npm test`, full validation, and red scans.
- Browser QA criteria: route sweep, Calendar create/edit/refresh persistence, month/week/day/agenda visibility, screenshot proof, console inspection when tooling supports it, and honest limitation notes for any browser-control gaps.
- Limitations: the route modal covers compact event creation/editing while richer relation/privacy/location metadata is handled on Calendar event pages; no recurrence, ICS, reminders, native notifications, Google Calendar sync, cloud sync, encrypted private calendar, or app lock.

### Templates

- Purpose: creation sources for provider-backed records.
- User stories: create pages/records from templates without fake starter cards.
- Current status: partial.
- Required data model: static template registry with status/category fields, typed metadata defaults, safe starter blocks, preview data, and future-template guards.
- Required UI: template picker and templates route with search, category/status filters, counts, preview, and disabled partial/future creation.
- Required persistence: template outputs persist as provider items.
- Required graph/search/template integration: output metadata searchable and graphable.
- Success criteria: templates create real records only.
- Test criteria: page-workspace template tests plus template registry tests for uniqueness, status/category counts, metadata normalization, safe blocks, previews, future guards, and custom title propagation.
- Browser QA criteria: route sweep, templates route screenshot, search/filter proof, future-template disabled proof, and representative create/refresh proof when browser automation can safely create records.
- Limitations: no template editor, custom template storage, template library management, import/export, version history, AI generation, cloud marketplace, or sync.

### Vault

- Purpose: storage/provider truth, health, archive controls.
- User stories: understand active provider, export archive JSON, validate archive, preview restore, merge safely, replace only with confirmation.
- Current status: partial, with browser archive implemented.
- Required data model: provider info, vault health, archive manifest, restore plan.
- Required UI: vault route, capability truth, archive manager controls, health warnings.
- Required persistence: provider-backed snapshot restore only after preview and confirmation.
- Required graph/search/template integration: archive must preserve all module metadata and relation IDs.
- Success criteria: browser archive round-trips current provider data and never claims native backup.
- Test criteria: archive/provider restore tests.
- Browser QA criteria: export, validate, preview, safe merge, replace disabled until confirmation.
- Limitations: no native backup, SQLite backup, encrypted backup, portable vault folder, lock file.

### Settings

- Purpose: workspace status and limited preference controls.
- User stories: change theme, inspect provider facts, access vault/archive controls.
- Current status: partial.
- Required data model: theme/session/provider facts.
- Required UI: settings route, theme segmented control, read-only storage facts.
- Required persistence: theme/local session only; provider data through provider APIs.
- Required graph/search/template integration: none.
- Success criteria: no destructive storage controls are exposed without guardrails.
- Test criteria: theme/root tests and route smoke.
- Browser QA criteria: theme and archive panel route loads.
- Limitations: broader settings system future.

### Trash

- Purpose: soft-deleted item recovery.
- User stories: restore deleted local prototype items.
- Current status: partial.
- Required data model: `deletedAt` and `archivedAt` fields.
- Required UI: trash list and restore actions.
- Required persistence: provider restore paths.
- Required graph/search/template integration: deleted items should be excluded from normal active views.
- Success criteria: restore works and permanent deletion is not faked.
- Test criteria: provider/trash behavior tests.
- Browser QA criteria: move to trash and restore when scoped.
- Limitations: no retention policy, permanent delete, restore history, native recovery.

### Import/Export Manager

- Purpose: central user-facing data movement manager for current browser archive and future export/import plans.
- User stories: create a browser archive, paste archive JSON, validate it, preview restore, apply safe merge, understand unsupported future export/import formats.
- Current status: partial; `/import-export` exists for browser archive JSON export/import management and reuses the real archive panel.
- Required data model: archive validation state, restore preview state, unsupported future feature descriptors.
- Required UI: route or section with current supported archive features and future-only disabled features.
- Required persistence: existing provider archive/restore helpers only.
- Required graph/search/template integration: archive must preserve all current module metadata and relation IDs.
- Success criteria: no fake native file import; no dead controls; destructive replace guarded.
- Test criteria: import/export manager helper tests.
- Browser QA criteria: route/section loads, validate good/bad archive, preview restore, blocked invalid archive.
- Limitations: no markdown/CSV/PDF export, native file/folder import, or real document/file import.

### Repair/Recovery Center

- Purpose: inspect local prototype data health and guide safe recovery.
- User stories: see counts, duplicates, orphans, invalid metadata IDs, archive support status, repair suggestions, and limitations.
- Current status: partial; `/repair` exists for read-only provider health checks plus archive validation and recovery controls.
- Required data model: health summary, issue list, repair report, archive validation result.
- Required UI: route or section with data health checks, issue severity, suggestions, and current limitations.
- Required persistence: read-only health checks unless a future explicitly previewed repair action is implemented.
- Required graph/search/template integration: graph orphan and metadata invalid-target checks should be visible when implemented.
- Success criteria: shows real issues from provider snapshot and does not mutate data during checks.
- Test criteria: vault-health tests.
- Browser QA criteria: route/section loads, health summary visible, invalid archive rejected without mutation.
- Limitations: no migration rollback, native repair, file repair, SQLite repair, or mirror rebuild.

### Privacy/App Lock

- Purpose: future privacy controls and lock behavior.
- Current status: not started.
- Requirement: current private/sensitive flags remain metadata-only until real enforcement exists.
- Success criteria before claiming privacy: encryption/app lock/search hiding/graph hiding/backups must all be implemented and tested.

### Native Windows/Tauri

- Purpose: future Windows desktop shell and native command boundary.
- Current status: not started.
- Requirement: do not introduce Tauri or native commands in this prompt.

### SQLite/portable vault

- Purpose: future runtime storage and lifetime readable vault model.
- Current status: not started.
- Requirement: do not implement SQLite, portable vault folders, lock files, markdown mirrors, or native backups in this prompt.

### Mobile companion

- Purpose: future capture/review companion.
- Current status: not started.
- Requirement: no mobile implementation in this prompt.

### Local AI

- Purpose: future local-only OCR, embeddings, summaries, planning, and semantic graph.
- Current status: not started.
- Requirement: no AI implementation in this prompt.

## 7. Data Model Requirements

- Mizaan item model: stable `id`, `type`, `category`, title, status, tags, parent ID, timestamps, soft-delete/archive fields, `properties`, `metadata`, attached file metadata.
- Metadata model: typed per module, unknown safe fields preserved where possible, private/sensitive flags metadata-only.
- Blocks: provider-backed page block records with `itemId`, type, content, order, timestamps, optional checked state.
- Relations: provider relation records plus typed metadata relation ID arrays.
- Documents: metadata-only records until native file storage exists.
- Projects/tasks: typed planning metadata and linked task/project IDs.
- People: person metadata and interaction metadata.
- Finance: transaction/budget/bill/subscription/reimbursement metadata without bank/provider integration.
- Trackers/goals: tracker check-ins and goal progress fields in metadata.
- Graph nodes/edges: derived from provider items, provider relations, parent hierarchy, and normalized metadata relation IDs.
- Archive/export manifest: browser archive with archive version, app name, provider, source, schema version, counts, items, blocks, relations, trash/template summaries, settings, metadata, checksums, warnings, and unsupported future fields.
- Restore plan: merge/replace mode, creates, updates, unchanged records, removals for replace, warnings, confirmation flag.
- Repair report: health summary, issue counts, issue list, warnings, suggestions, checked timestamp.
- Migration manifest future: from/to versions, dry-run, rollback notes, logs.
- Privacy flags: metadata-only `private`/`sensitive` flags until real enforcement exists.

## 8. Persistence and Recovery Requirements

- Current truth: browser/localStorage prototype only.
- Archive export: JSON archive from current provider snapshot.
- Archive validation: reject invalid JSON, wrong app, unsupported version, corrupt items, duplicate IDs, missing items array.
- Restore preview: must not mutate current data.
- Safe merge: creates/updates incoming records without removing absent current records.
- Guarded replace: can remove absent current records only after preview and exact explicit confirmation.
- Corruption rejection: bad archives must not wipe existing data.
- Metadata round-trip: finance, people, projects, tasks, documents, trackers, goals, graph IDs, privacy flags, and unknown safe metadata must survive archive round-trip.
- Future native backup: not implemented until native filesystem and vault folders exist.
- Future SQLite backup: not implemented until SQLite provider exists.
- Future encrypted backup: not implemented until encryption and key handling exist.
- Migration strategy: future dry-run manifests and rollback policy; never clear user storage as a shortcut.
- Repair/recovery center: implemented as a browser-prototype foundation with provider health checks, issue reporting, archive validation, and restore preview; automatic repair actions remain future.

## 9. Import/Export Manager Requirements

- Current supported import/export: `/import-export` browser archive JSON export, paste/load archive JSON, validate, preview restore, merge, guarded replace.
- Future markdown export: not implemented.
- Future CSV export: not implemented.
- Future PDF export: not implemented.
- Future document/file import: not implemented.
- Import validation: classify bad JSON, wrong app, unsupported version, corrupt records, duplicate IDs, empty archive, unknown safe fields.
- Error states: show errors without mutation.
- User confirmation flows: apply merge only after preview; replace only after exact confirmation.
- No fake native import: file/folder import must be hidden or disabled with honest reason until native implementation exists.

## 10. Security and Privacy Requirements

- Private/sensitive flags are metadata only currently.
- No encryption currently.
- No app lock currently.
- No real hidden-from-search behavior currently.
- No real hidden-from-graph behavior currently.
- Future app lock must include tests, UX, failure states, and recovery policy before any claim.
- Future encrypted vault must include storage, key handling, backup, restore, migration, and QA proof before any claim.
- Future hidden search/graph behavior must include search/graph/export/privacy tests before any claim.

## 11. UI Requirements

- Module status badges must distinguish implemented, partial, blueprint-only, not started, future native, future mobile, and future local AI.
- Future-only badges must not look like working controls.
- No fake actions. If a command is visible, it must work or be disabled with an explicit reason.
- Disabled controls need honest copy.
- Empty states must reflect real provider state.
- Error states must state whether data changed. Default for validation/preview failures: data did not change.
- Right panel metadata should be dense, calm, and provider-backed.
- Layout should remain Notion-like, restrained, and work-focused.
- Keyboard/command palette entries must navigate to real routes or create real provider-backed records only.
- Accessibility: buttons need labels, inputs should have labels or clear context, text must fit on mobile/desktop, controls should be keyboard usable.

## 12. QA and Testing Standard

Required gates for implementation phases:

- `git status -sb`
- `git branch --show-current`
- `git remote -v`
- `git fetch origin --prune`
- `git rev-list --left-right --count main...origin/main`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `git diff --check`
- Red-flag scans for localStorage scope, cloud/auth/provider terms, fake readiness, TODO/mock/fake/placeholder/any, console/debugger, runtime URLs/fonts, and privacy/encryption/lock overclaims.
- Browser QA with isolated profile when possible.
- Screenshot evidence for UI-facing changes when tooling permits.
- DOCX structural verification or fallback Markdown.
- Phase report with commands, results, screenshots, limitations, commit, push, and parity evidence.
- Storage round-trip tests for archive/restore behavior.

## 13. Definition of Done

For any feature:

- Data model exists.
- Provider-backed persistence exists if user-facing data changes.
- UI exists if user-facing.
- Tests exist and pass.
- Browser QA is attempted for UI-facing work.
- Screenshots are captured if possible.
- PRD/Blueprint/master Markdown/DOCX/phase report are updated where status changes.
- No dead buttons or fake controls.
- No overclaiming.
- Typecheck, lint, tests, build, diff check, red-flag scans pass or are honestly blocked.
- Commit, push, parity, and worktree status are verified when the prompt requires push.

## 14. Success Criteria

- Repo health: correct branch, remote, parity, clean tracked state before work, clean final tracked state after push.
- Local data safety: no localStorage clear, no destructive action without preview and confirmation.
- Module implementation: helper model, UI, provider persistence, tests, QA, docs.
- Export/restore: validate, preview, safe merge, guarded replace, round-trip metadata.
- Repair/recovery: real `/repair` health checks, issue/suggestion reporting, archive validation, and restore preview; no automatic repair until future previewed repair actions exist.
- UI honesty: all unsupported areas are future-labeled or disabled with reason.
- Documentation: PRD, Blueprint, master append, DOCX/fallback, phase report.
- QA: commands and browser route checks recorded.
- Release readiness: only claimed after final validation, commit, push, parity, and clean worktree.

## 15. Failure Criteria

A feature fails if:

- Fake UI exists.
- Data does not persist.
- localStorage is cleared or user data is deleted.
- Tests fail.
- Build fails.
- Docs overclaim.
- Native readiness is falsely claimed.
- Restore can destroy data without preview/confirmation.
- Browser QA is not attempted for a UI feature.
- Runtime cloud/auth/backend/bank/payment/provider integration is added against product law.
- Privacy/encryption/app lock/hidden search/graph is claimed without enforcement and tests.

## 16. Roadmap

1. Repair/Recovery Center Foundation - completed as a browser-prototype foundation.
2. Import/Export Manager Foundation - completed as a browser archive manager foundation.
3. Calendar completion - completed as a browser/localStorage foundation; overall Calendar remains partial until scheduling/native/privacy systems exist.
4. Template expansion - completed as a browser-prototype static registry and `/templates` QA route; overall Templates remain partial until editor/management/user-template systems exist.
5. Version history.
6. Privacy/app lock UX.
7. Native Windows readiness.
8. Tauri shell.
9. SQLite provider.
10. Portable vault folders.
11. Markdown mirrors.
12. Native filesystem documents.
13. Full backup/restore.
14. Mobile companion.
15. Local AI planning.
16. Release hardening.

## 17. Open Risks

- Browser/localStorage prototype risk: storage is not lifetime storage and can be browser-profile dependent.
- No native storage.
- No SQLite.
- No portable vault folders.
- No encryption.
- No app lock.
- No mobile.
- No full file import.
- Import/Export Manager is browser archive JSON only; markdown/CSV/PDF/native imports remain future.
- Repair/Recovery Center is health/reporting plus archive recovery only; automatic repair and rollback remain future.
- DOCX visual render may be unavailable without `soffice`/LibreOffice.
- Fast Refresh lint warnings remain known non-error warnings.
- Vite chunk-size and TanStack external-unused warnings remain known build warnings.
- Browser automation can time out.
- Download/file-picker automation is unreliable; archive helper tests and visible UI evidence are safer proof.

## 18. Workflow Acceleration and Agent Run System

Mizaan now has reusable engineering workflow helpers for future phases. These helpers standardize repeated gates; they do not replace human review, code inspection, product judgment, or honest final reporting.

Core runbook and templates:

- `docs/AGENT_RUNBOOK.md`
- `docs/PHASE_TEMPLATE.md`
- `docs/PHASE_CLOSEOUT_TEMPLATE.md`
- `docs/QA_CHECKLIST.md`
- `docs/RED_FLAG_SCAN_RULES.md`
- `docs/NEXT_PHASE_QUEUE.md`
- `docs/FAST_PHASE_PROMPT_TEMPLATE.md`

Package commands:

- `npm run mizaan:preflight` checks repo path, branch, remote, parity, required files, and worktree state.
- `npm run mizaan:verify:fast` runs typecheck, optional targeted tests, and critical red-flag scans.
- `npm run mizaan:verify:full` runs typecheck, lint, tests, build, diff check, and full red-flag scans.
- `npm run mizaan:red-scan` runs categorized scans for localStorage, cloud/auth, fake readiness, console/debugger, runtime URLs/fonts, privacy/encryption/app-lock language, and import/export truthfulness.
- `npm run mizaan:browser-qa` starts a local dev server when needed, checks key routes by HTTP, captures isolated headless screenshots when Chrome or Edge is available, and writes a local QA summary under `docs/logs`.

Validation tiers:

- Preflight: branch, remote, parity, required files, and worktree status.
- Fast verify: typecheck plus critical source-policy scans.
- Full verify: typecheck, lint, full tests, build, diff check, and full scans.
- Browser QA: route reachability plus screenshot proof when local tooling supports it.

Speed strategy:

- Future prompts can reference this PRD, the runbook, and templates instead of restating every gate.
- Standard scripts reduce repeated manual commands.
- The red-scan script keeps policy checks consistent across phases.
- The browser-QA script creates repeatable route and screenshot evidence without clearing localStorage.
- The phase-closeout helper supports dry-run review and safe push workflows, but final commits still require judgment.

Limitations:

- These scripts are workflow helpers, not product features.
- They do not implement native storage, SQLite, Tauri, portable vault folders, encryption, app lock, mobile, cloud, auth, backend, or sync.
- Browser QA still depends on local dev tooling and available Chrome/Edge headless support.
- In-app browser control can still fail on some native inputs or clipboard-backed field fills; fall back to route-level helper evidence plus targeted tests when that happens and document the exact gap.
- DOCX visual render still depends on an available document renderer.
- Script success does not prove a feature is complete unless the PRD, tests, UI, provider persistence, docs, and browser QA criteria also pass.

## 19. Future Prompt Rules

Future Codex prompts should follow this template:

1. Verify repo with `npm run mizaan:preflight`.
2. Read this PRD, Product Blueprint, latest phase report, and relevant source/tests.
3. Create/update the phase report before implementation.
4. Run baseline validation before edits when the phase changes product behavior.
5. Inspect current code and choose the bounded phase from evidence.
6. Write failing tests first for new helper behavior when practical.
7. Implement only the bounded phase.
8. Run `npm run mizaan:verify:fast` during implementation.
9. Update this PRD if current status changes.
10. Update the Product Blueprint.
11. Append the old master Markdown only.
12. Update DOCX work log or create fallback.
13. Run `npm run mizaan:verify:full`.
14. Run `npm run mizaan:browser-qa` for UI-facing work and capture screenshots if possible.
15. Commit, push, verify parity, and report final HEAD.
16. Provide an honest final report with limitations and next recommended phase.

## Native Tauri Readiness Probe
- **Current status:** Investigated and verified web toolchain parity. Async provider refactor is now implemented and validated on the feature branch.
- **Blockers:** Tauri CLI is not installed. Native shell work must not be claimed until the CLI/dev dependency path is intentionally added and validated.
- **Next phases:** Tauri Shell Scaffold, Native Provider Contract, SQLite Prototype, and Portable Vault Folder.
- **Limitation:** Do not claim native integration is implemented until the shell and provider boundaries are verified.

## Obsidian / Notion Parity Slice - Wiki Links

- **Current status:** Implemented a browser-safe wiki-link foundation for exact-title `[[Page Title]]` links inside stored page blocks.
- **What works now:** Wiki links resolve to active, non-deleted, non-archived page titles; ambiguous duplicate titles are ignored instead of guessed; self-links and missing targets are ignored; resolved links appear in page outgoing/backlink panels and in the graph model as `wiki-link` edges.
- **Graph status:** Graph remains partial overall, but it now includes provider relations, typed metadata relations, parent hierarchy, and resolved wiki links.
- **Not implemented:** Native Obsidian folder compatibility, markdown mirror writing, plugin ecosystem, cloud collaboration, mobile apps, AI automation, encryption, and app lock remain future work.
- **Validation:** Targeted wiki/parser, graph, and page workspace tests pass; typecheck and lint pass after the implementation.

## Obsidian / Notion Parity Slice - Daily Notes and Capture Templates

- **Current status:** Implemented workspace-level note templates for Daily Note, Journal Page, Quick Capture, Research Notes, and Brainstorm.
- **What works now:** These templates create real provider-backed note pages from the workspace template picker and template registry, with starter blocks, tags, `noteKind` metadata, and local prototype persistence.
- **Command palette:** Added quick-create commands for Daily Note, Quick Capture, and Journal Page.
- **Not implemented:** Automatic daily recurrence, reminders, global hotkeys, mobile capture, encryption, app lock, hidden search/graph behavior, AI generation, web import, and citation management remain future work.
- **Validation:** Page workspace and template registry targeted tests pass; typecheck and lint pass after implementation.

## Graph Search Slice

- **Current status:** Implemented browser-safe graph search for the `/graph` route.
- **What works now:** Users can search the current graph node set by label, type, category, status, route/item id, and metadata summary while combining that search with the existing graph filters.
- **Implementation detail:** Filtering/search is handled by a pure `filterGraphNodes` helper with unit coverage.
- **Not implemented:** Saved graph searches, advanced query syntax, graph clustering, manual canvas search, full-text block graph search, and native graph persistence remain future work.
- **Validation:** Graph model targeted tests, typecheck, and lint pass after implementation.
- **Full verification:** `npm run mizaan:verify:full` passed with 24 Vitest files / 244 tests, build, diff check, and full red scan; `npm run mizaan:browser-qa` passed with screenshots under `docs/screenshots/20260611-202147-browser-qa-*.png`.

## Graph JSON Export Slice

- **Current status:** Implemented browser-safe current-graph JSON export for the `/graph` route.
- **What works now:** Users can export the active global or local graph model as `mizaan.graph.export.v1` JSON with sorted nodes, sorted edges, graph summary, scope, timestamp, and explicit limitations.
- **Implementation detail:** Export payload creation is handled by pure `createGraphExportPayload` with unit coverage. The route download uses browser `Blob`/object URL only.
- **Not implemented:** Manual canvas export, standalone graph node export, saved layout export, graph image/PDF export, native graph mirror files, clustering export, semantic graph export, and AI embeddings remain future work.
- **Validation:** Graph model and product-map targeted tests, typecheck, and lint pass after implementation.

## Tasks Route Slice

- **Current status:** Implemented a bounded browser-safe `/tasks` route.
- **What works now:** Users can view provider-backed task records, use the default status board, drag tasks between status columns, switch to a bounded timeline over existing task dates, record recurrence metadata, record reminder metadata, record calendar-link metadata, search task metadata, filter by status/priority/recurrence, create unlinked task records, and edit task status/priority inline.
- **Implementation detail:** Route statistics use the pure `computeTaskTotals` helper, the board uses `groupTaskRecordsByStatus`, the timeline uses `createTaskTimelineEntries`, and recurrence/reminder/calendar-link fields are normalized as metadata only; `/tasks` is in the generated route tree and browser QA route list.
- **Not implemented:** Task database engine, saved task views, full Gantt engine, dependency engine, recurrence generation, reminder alarms, native notifications, calendar event creation, calendar scheduling automation, mobile capture, SQLite, Tauri, native filesystem, and portable vault task storage remain future work.
- **Validation:** Targeted task/product-map tests, typecheck, lint, build, browser QA, and `npm run mizaan:verify:full` pass after implementation.
