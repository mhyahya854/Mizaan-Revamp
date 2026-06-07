# Mizaan A-to-Z Implementation Master Plan

**Canonical app name:** Mizaan  
**Canonical target:** Windows desktop local-first vault app  
**Canonical audience:** Built first for Mohammad Yahya's personal life, but understandable and usable by friends/family after explanation  
**Canonical document type:** Self-contained master implementation file for humans, Codex, Claude, Gemini, or any future AI agent  
**Current baseline source:** Uploaded `Mizaan-Revamp.zip`, inspected on 2026-05-31  
**Plan mode:** Zero-to-100 product plan, while acknowledging current codebase state

---

## 0. Non-Negotiable Product Definition

Mizaan is a local-first, vault-based personal life operating system.

Every important saved object must be representable as a page. Every opened page becomes an active working space. Templates can create either one page or a complete system of pages. Modules provide app-level tools. The workspace view is where the user works across notes, documents, media, projects, people, finance, calendar, tasks, trackers, databases, graph, backup, restore, search, and file management.

Mizaan is page-first.

That means:

```text
Page = saved object
Space = currently opened working context
Template = creation blueprint
Module = app-level tool
Workspace View = the screen where pages/modules are opened
Vault = the local data container
```

Mizaan must not become a fake dashboard, cloud workspace, AI assistant, or disconnected collection of modules. The app exists to connect the user’s life data through one local vault.

Important page rule:

```text
Every meaningful saved object must be representable as a page.
```

Examples:

```text
note
document
project
person
finance record
calendar event
task
goal
tracker
database
database row
canvas
daily note
journal
template
```

Media rule:

```text
Images, videos, audio files, and other media inserted into a page remain page attachments/blocks by default. They do not automatically become separate media pages unless the user explicitly promotes them into a media page or media collection.
```

Required lifetime rule:

```text
Mizaan must remain usable for a lifetime through a human-readable folder structure.
```

SQLite makes the app fast, structured, and reliable while Mizaan is running. The human-readable vault folders make the user’s data understandable, recoverable, portable, and inspectable outside the app.

The database must not become a hidden data trap.

The vault must include readable structures such as:

```text
page folders
Markdown/page files
JSON mirrors
metadata files
placement files
import history
edit history
graph/relation files
logs
backups
exports
version/snapshot files
```

The app’s promise is simple:

```text
The user owns the data.
The vault stores the data.
The app edits and manages the data.
If the app dies, the data survives.
```

This promise is non-negotiable.

Any implementation that traps user data only inside SQLite, localStorage, proprietary blobs, hidden caches, or unreadable app-only files violates Mizaan’s core purpose.

Implementation rule:

```text
SQLite is the runtime source of truth.
Human-readable vault folders are the lifetime and recovery layer.
Both must exist.
```

Mizaan must be designed so a user can open the vault folder in File Explorer and still understand the broad structure of their pages, files, metadata, history, and backups without needing Mizaan to run.

---

## 1. Product Identity Rules

### 1.1 Mizaan is

Mizaan is:

- a Windows desktop app
- a local-first personal life operating system
- a vault-based page workspace
- a human-readable lifetime archive
- a Notion-like workspace without cloud dependency
- an Obsidian-like vault without raw-file chaos
- a TickTick-like task/calendar/habit system without account dependency
- a Tarteeb-like disciplined file/document/media system
- a local graph and relationship system
- a backup/restore/repair-first app
- one app installer from the user's point of view

### 1.2 Mizaan is not

Mizaan is not:

- an AI app
- a chatbot app
- a cloud workspace
- a SaaS dashboard
- a team collaboration platform
- a Google Calendar clone
- a bank-sync finance app
- a public publishing platform
- a CRM sales tool
- a Trello/Jira clone
- a subscription-first product
- a web-only database app
- a fake dashboard with dead cards
- a hidden proprietary data trap

### 1.3 No AI features

Mizaan must not include AI features.

Do not add:

- AI chat
- AI summaries
- AI search answers
- AI auto-tagging
- AI document interpretation
- AI graph suggestions
- AI writing assistant
- cloud LLM calls
- local LLM features

Future AI must not be planned in this master plan. The product direction is local-first manual control, not AI automation.

---

## 2. User and Session Model

### 2.1 Local user profile, not cloud account

Mizaan may have a local user profile because the app needs to know who is using the app and whose vault is open.

This is not a cloud account.

Allowed:

- local display name
- local user profile
- vault owner name
- vault identity
- recent vaults
- local sign-off
- local security code later

Forbidden:

- cloud login
- online account requirement
- forced email account
- remote identity provider
- telemetry identity
- subscription account

### 2.2 Sign off, not log out

Use the term **Sign off**.

Sign off means:

1. Save all pending writes.
2. Flush autosave queue.
3. Close current vault cleanly.
4. Remove lock file if safe.
5. Clear active workspace state.
6. Return to first launch screen.
7. Allow another user to plug in another USB/external drive/local folder and open their vault.

Example:

```text
Mohammad is using Mizaan with his USB vault.
He signs off.
His friend plugs in a USB drive.
The friend opens their own Mizaan Vault.
No cloud login is involved.
```

### 2.3 No Internet Dependency

Mizaan must work offline after installation.

Normal app use must not require internet.

This rule applies to the full daily Mizaan experience, not only basic note writing.

The following workflows must work without internet after Mizaan has been installed and set up:

```text
creating vaults
opening vaults
signing off
switching local user/vault profiles
writing pages
autosaving pages
renaming pages
creating subpages
using templates already installed
importing files
copying files into the vault
moving files into the vault
viewing supported documents
viewing supported media
editing supported simple files
using bundled helper runtimes
using calendar
using tasks
using trackers
using goals
using finance
using people
using graph
using search
using backups
using restore
using trash
using settings
using themes
running vault health checks
running repair tools
```

Normal use must not require:

```text
cloud login
online account
remote server
subscription check
internet activation
online database
cloud calendar API
Google API
Microsoft API
Notion API
online file conversion
online document preview
online media processing
online AI service
telemetry connection
```

Mizaan may support internet only during installation/setup if the installer is a bootstrap installer.

However, the preferred final target is a full offline installer.

Installer models:

```text
Preferred final model:
Full offline installer.
Mizaan installer includes all required normal-use runtimes and helper engines.

Allowed development/setup model:
Bootstrap installer.
Installer may download required helper runtimes during setup only.

Forbidden normal-use model:
Mizaan downloads required helper tools when the user opens a file during daily use.
```

All required normal-use dependencies must be bundled with Mizaan or installed during Mizaan setup.

This includes any runtime/helper needed for supported offline workflows, such as:

```text
SQLite runtime
Tauri runtime requirements
PDF viewing support
document preview support
LibreOffice-compatible office helper if Office preview/editing is supported
FFmpeg/FFprobe if media metadata, thumbnails, conversion, trimming, or extraction are supported
VLC/libVLC/media helper if advanced playback is supported
image processing helper if native crop/annotation needs one
OCR helper later if OCR is implemented
```

After setup, Mizaan must not tell the user:

```text
Connect to the internet to open your vault.
Connect to the internet to view this document.
Connect to the internet to play this media file.
Connect to the internet to use search.
Connect to the internet to use calendar.
Connect to the internet to restore your backup.
Connect to the internet to continue using Mizaan.
```

If a helper runtime is missing or damaged, Mizaan must show a local repair message instead of trying to silently download it during normal use.

Example message:

```text
Mizaan’s document helper is missing or damaged.
Your vault data is safe.
Repair the Mizaan installation to restore this feature.
```

Internet may be optional only for non-core future actions such as:

```text
checking for updates
downloading optional extra templates
downloading optional helper packs
opening a user-provided external web link
```

These optional actions must never block normal offline use.

Implementation rules:

```text
Do not add cloud login.
Do not add forced online account checks.
Do not call online APIs for normal vault features.
Do not require internet for document viewing after setup.
Do not require internet for media viewing after setup.
Do not require internet for backup/restore.
Do not require internet for graph/search.
Do not silently download helper tools during normal use.
Do not hide online dependencies inside “first use” flows.
```

Done criteria:

```text
Mizaan can be installed and then used with internet disabled.
A new vault can be created offline.
An existing vault can be opened offline.
Pages can be created, edited, renamed, and autosaved offline.
Files can be imported offline.
Supported documents/media can be viewed offline using native viewers or installed/bundled helper runtimes.
Calendar/tasks/trackers/finance/people/search/graph work offline.
Backup and restore work offline.
Sign off and local profile/vault switching work offline.
No normal-use feature blocks on internet access.
```

Required tests:

```text
1. Disable internet after installation.
2. Launch Mizaan.
3. Create a vault.
4. Create pages and subpages.
5. Import files.
6. Open supported PDFs, TXT, Markdown, CSV, images, and media.
7. Open supported Office files if office helper is installed/bundled.
8. Use calendar, tasks, trackers, graph, search, backup, restore, settings, and sign off.
9. Confirm no normal-use workflow requires internet.
10. Confirm any missing helper shows a local repair message, not an online download requirement.
```

---

### 3. Current Uploaded Codebase Baseline

This section describes the uploaded `Mizaan-Revamp.zip` baseline inspected for this master plan.

This baseline is a **starting snapshot**, not a permanent source of truth.

Before implementing anything, Codex, a human developer, or any AI agent must re-audit the current repository state. The app may have changed after this document was written.

Implementation must follow this rule:

```text
Trust the current code after inspection.
Use this section as orientation.
Do not blindly assume this baseline is still complete or current.
```

---

### 3.1 Observed project shape

The uploaded baseline appears to contain a React/TanStack/Vite-style app structure.

Observed high-level structure:

```text
package.json
src/
  components/
  hooks/
  lib/
  routes/
  styles.css
  router.tsx
  routeTree.gen.ts
docs/
  multiple phase plans, audits, reports, and screenshot artifacts
```

This structure must be verified in the active repository before any implementation begins.

Do not invent files.

Do not assume paths.

Do not trust old docs over current code.

---

### 3.2 Observed package scripts

The uploaded baseline appears to include these package scripts:

```bash
npm run dev
npm run build
npm run build:dev
npm run preview
npm run typecheck
npm run test
npm run lint
npm run format
```

Before running any command, verify the current `package.json`.

If a script is missing, renamed, or broken, record that in the implementation report and use the correct current command.

Required command rule:

```text
Do not claim a script passed unless it was actually run successfully in the current repository.
```

---

### 3.3 Observed implemented or partially implemented areas

The uploaded baseline appears to already include or partially include:

```text
React/TanStack Router shell
page-first workspace foundation
sidebar zones
template picker
command palette
page workspace
page breadcrumbs/header/properties/right panel
basic block editor
slash command foundation
simple table block
basic database route
basic database table foundation
partial database row/page-like behavior
localStorage prototype provider
VaultProvider abstraction
vault route showing provider/capability truth
settings route showing provider/vault truth
search route foundation
graph route foundation
documents route
projects route
people route
finance route
calendar route
trackers route
trash route
docs, audits, and browser QA screenshot artifacts
```

These existing features must be treated as valuable working foundation unless code inspection proves otherwise.

Implementation must preserve working behavior while replacing prototype-only architecture.

Do not delete working routes, components, providers, editor behavior, template behavior, or UI foundations just because the final architecture is larger.

---

### 3.4 Observed missing, incomplete, or not-real-yet areas

The uploaded baseline appears to be missing, incomplete, or prototype-only in these areas:

```text
production-grade Windows desktop/Tauri implementation
native folder picker
portable vault folder implementation
SQLite provider
real vault identity files
lock file lifecycle
disk-backed page folders
Markdown mirrors
JSON mirrors
real autosave-to-disk
document import pipeline
PDF preview pipeline
Office preview/editing pipeline
media preview pipeline
LibreOffice helper/runtime integration
VLC/libVLC helper/runtime integration
FFmpeg/FFprobe helper integration
backup engine
restore engine
repair tools
migration system
app lock/security code
private content behavior
full search index
full graph index
manual graph/canvas
recurring calendar engine
full task engine
full tracker engine
goals system
advanced finance engine
editable template manager
full database engine
external-drive/USB disconnect handling
human-readable recovery rebuild
metadata correction review system
conflict detection for edited readable files
```

This list must be verified by code audit.

Do not claim something is implemented just because a route, placeholder, mock screen, old doc, or fake UI exists.

A feature counts as implemented only when it has:

```text
real data model
real storage behavior
real UI behavior
real error handling
real persistence
real tests or manual QA evidence
no fake placeholder state
```

---

### 3.5 Prototype warning

The current app may contain useful UI and provider abstractions, but prototype storage must not be mistaken for final architecture.

Prototype-only systems may include:

```text
localStorage persistence
demo data
mock capabilities
placeholder routes
fake graph nodes
fake vault status
fake backup status
fake import behavior
docs that describe future work but not current code
```

Codex must identify prototype-only behavior and replace it with real architecture in phases.

Do not leave two competing storage models active without a migration plan.

---

### 3.6 Required pre-implementation audit

Before making architectural changes, the implementer must inspect at minimum:

```text
package.json
src/router.tsx
src/routeTree.gen.ts
src/routes/
src/components/
src/lib/
src/hooks/
VaultProvider-related files
storage/provider files
editor/block files
template files
database/table files
search files
graph files
settings/vault files
test files
docs/
```

The audit must answer:

```text
What currently works?
What is prototype-only?
What is fake UI?
What is missing?
What can be preserved?
What must be replaced?
What risks data loss?
What tests currently exist?
What commands currently pass?
```

The implementer must write or update an audit report before large changes.

Recommended report path:

```text
docs/current-codebase-baseline-audit.md
```

---

### 3.7 Preservation rule

Implementation must preserve working current features while replacing prototype storage with the real architecture.

Preserve where possible:

```text
page workspace UI
sidebar/navigation structure
template picker foundation
command palette foundation
editor/block foundation
table/database foundation
routes
settings/vault truth screens
search/graph route foundations
existing tests
useful documentation
browser QA evidence
```

Replace where necessary:

```text
localStorage as final storage
fake/demo vault behavior
fake backup/import/graph/readiness claims
placeholder capability flags
stale docs
dead UI controls
mock data that pretends to be real
```

Do not rebuild the whole app from scratch unless the current code is proven unusable.

The correct implementation style is:

```text
audit
preserve working foundations
introduce real provider/storage layer
migrate features gradually
remove fake/prototype behavior
verify with tests and browser QA
```

---

### 3.8 Verification commands

After any meaningful implementation change, run the current equivalent of:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

If the project supports browser QA, also run a browser smoke test for affected routes.

If Tauri/native code is added, run the relevant Tauri/native checks available in the repository.

Do not claim success unless commands actually pass.

If a command cannot be run, record:

```text
command attempted
reason it could not run
error output
risk level
next required fix
```

---

### 3.9 No fake readiness rule

A feature is not ready because the UI exists.

A feature is ready only when it has real implementation and verification.

Examples:

```text
A vault screen is not a real vault system.
A graph route is not a real graph system.
A backup button is not a real backup engine.
A settings toggle is not a real privacy system.
A file card is not a real import pipeline.
A document route is not a real document preview system.
A calendar route is not a recurring calendar engine.
A database table UI is not a full database engine.
```

Every implementation report must distinguish:

```text
implemented
partially implemented
prototype-only
fake/placeholder
not implemented
blocked
```

---

### 3.10 Final rule

This master plan assumes a zero-to-100 product direction, but implementation must start from the actual current codebase.

The implementer must not hallucinate the codebase.

The implementer must not ignore existing work.

The implementer must not trust stale docs over source code.

The implementer must not delete user data or working features.

The correct path is:

```text
Inspect current code.
Record current truth.
Preserve what works.
Replace prototype storage safely.
Implement the real vault architecture in phases.
Verify every step.
```

### 3.11 2026-05-31 Baseline Feature Status Audit

Baseline audit date:
2026-05-31 14:15 +08:00.

Selected app folder:
`E:\Github\Mizaan-Revamp`.

Git status:
No `.git` directory was found in the selected app folder or parent path, so commit verification is unavailable and no commit hash exists for this baseline.

Work log status:
`docs\Plan\Mizaan Work Log.docx` was updated on 2026-05-31 with the `Baseline Audit and Implementation Batch` entry.

Source of truth rule:
This Markdown file is the active master plan, implementation tracker, and status audit. `Mizaan Ultimate Plan.txt` exists in `docs\Plan` as an archive/history file only and is not the working plan.

Status marker note:
The prompt rendered all three requested status examples as identical `[]` markers. To keep this master plan readable and auditable, this baseline uses explicit bracket labels in the required heading shape: `[implemented and verified]`, `[partially implemented]`, and `[not implemented]`.

Implementation batch selected:
Calendar Core Module Hardening.

Why selected:
Calendar already existed as a provider-backed route with month, week, agenda, CRUD, and filters, but it was still partial, had no day view, had event metadata gaps, and the older seed/provider model still treated Calendar as a promoted space in places.

Validation status for this baseline:
`npm run typecheck` passed. `npm test` passed with 6 files and 37 tests. `npm run lint` passed with 0 errors and 10 existing Fast Refresh warnings. `npm run build` passed with existing bundle-size and TanStack external-unused warnings. Browser QA passed for the route smoke checks and Calendar event persistence. Browser screenshot capture was attempted but failed with `Page.captureScreenshot` timeouts, so no new screenshot files are claimed for this run.

Spaghetti cleanup notes:

- Moved date range, event normalization, agenda sorting, day grouping, and provider input creation into `src/lib/calendar/calendar-events.ts` instead of duplicating event filtering inside the Calendar route component. (spaghetti code cleared)
- Removed Calendar Space from new seed/template creation and soft-deprecated legacy `space-calendar` records instead of keeping Calendar as both a core module and a promoted page. (spaghetti code cleared)

### Product law [partially implemented]

Goal:
Keep Mizaan as a local-first, page-first, vault-based personal life operating system with no fake cloud, AI, or dashboard claims.

[What Codex understood:
The product law is the contract that every implementation pass must respect before adding features.]

[How it is implemented:
The master plan states the law, the UI labels the current app as a browser localStorage prototype, and no cloud/auth/AI implementation was added. The final Windows desktop vault, SQLite runtime, readable mirrors, and lifetime folder guarantees are not implemented yet.]

### Local-first rule [partially implemented]

Goal:
Make Mizaan usable locally without cloud, login, Google, provider accounts, telemetry, or upload requirements.

[What Codex understood:
The current web prototype may use browser storage, but the real product must remain local-first and eventually portable.]

[How it is implemented:
The app uses `LocalStorageVaultProvider`, local React state, and local browser storage. This proves a prototype local-first path but not the final portable folder/SQLite desktop local-first architecture.]

### Vault model [partially implemented]

Goal:
Use a vault as the data boundary for pages, blocks, relations, files, health, and storage truth.

[What Codex understood:
The vault must be a real local data container, not just a UI word.]

[How it is implemented:
`VaultProvider` and `VaultSnapshot` model items, blocks, relations, health, and provider info. The real folder vault, lock file, SQLite database, and readable mirror layout are not implemented.]

### Portable vault model [not implemented]

Goal:
Support a user-owned portable folder vault that survives outside the app.

[What Codex understood:
Portable vault means real folders/files, not browser state.]

[How it is implemented:
No folder picker, file layout, USB handling, lock file, or portable write path exists. Provider health correctly reports portable vault support as not ready.]

### Folder structure [not implemented]

Goal:
Create the canonical human-readable vault folder structure for pages, files, metadata, logs, backups, and mirrors.

[What Codex understood:
The folder structure is a lifetime recovery layer, not a documentation-only idea.]

[How it is implemented:
Only the plan describes the folder structure. The app does not create or write the canonical vault folders.]

### Vault identity [partially implemented]

Goal:
Identify the active vault and show provider/storage truth to the user.

[What Codex understood:
Even the prototype needs an honest active-vault identity surface.]

[How it is implemented:
`vault-session.ts`, `useVaultLifecycleStatus`, Home, Settings, and Vault surfaces show a prototype local vault identity. There is no durable vault manifest, owner identity file, recent portable vault list, or real sign-off flow.]

### Lock file [not implemented]

Goal:
Prevent unsafe concurrent writes to a portable vault.

[What Codex understood:
Locking belongs to the real filesystem vault layer.]

[How it is implemented:
No lock file creation, stale lock handling, or USB removal write lock exists.]

### Storage architecture [partially implemented]

Goal:
Keep UI writes behind provider/service boundaries and prepare for SQLite plus readable mirrors later.

[What Codex understood:
UI must not become the storage engine.]

[How it is implemented:
Most page, sidebar, database, table, relation, and calendar writes go through `VaultProvider`. The only active provider is browser localStorage; there is no SQLite/filesystem transaction layer.]

### VaultProvider [partially implemented]

Goal:
Expose item, block, relation, snapshot, health, and subscription methods behind a provider interface.

[What Codex understood:
The provider boundary is the current bridge between prototype UI and future durable storage.]

[How it is implemented:
`src/lib/vault/types.ts` defines the provider contract, and `LocalStorageVaultProvider` implements it for prototype items, blocks, relations, archive/trash/restore, and health. It is not the final durable provider.]

### LocalStorage provider [implemented and verified]

Goal:
Provide an honest browser prototype provider for local item/block/relation work without pretending to be final storage.

[What Codex understood:
This provider is allowed only as prototype storage and must clearly say what it cannot do.]

[How it is implemented:
`LocalStorageVaultProvider` persists to `mizaan.prototype.vault.v1`, seeds prototype records, supports CRUD/archive/trash/restore/relations, migrates old generated spaces, and reports false for portable folder, SQLite, Tauri filesystem, and Markdown mirrors. Verified by `local-storage-vault-provider.test.ts` and the full test run.]

### Future SQLite provider [not implemented]

Goal:
Implement the real runtime source of truth for the desktop app.

[What Codex understood:
SQLite is required later, but adding it before web foundations are coherent is out of scope for this baseline.]

[How it is implemented:
No SQLite dependency, schema, provider, migration runner, or Tauri command boundary exists.]

### Home [implemented and verified]

Goal:
Show a useful local workspace home with prototype vault truth, recent pages, quick actions, and quick capture.

[What Codex understood:
Home should be a working first screen, not a marketing page.]

[How it is implemented:
`src/routes/index.tsx` reads provider items, shows health, recent items, projects, calendar records, trackers, template actions, and saves quick capture as a real local note. Verified by build/tests and browser smoke in this baseline.]

### Sidebar/navigation [partially implemented]

Goal:
Provide clear app navigation for core modules, pinned items, pages, and system tools.

[What Codex understood:
Navigation must separate app modules from page records and must not show dead routes.]

[How it is implemented:
`AppSidebar.tsx` provides Core, PINNED, PAGES, and System tools. Calendar is now kept as a core module and excluded from page trees. Sidebar action UI exists, but full keyboard/hover QA and all edge cases remain partial.]

### Pinned/pages model [implemented and verified]

Goal:
Allow pages and promoted non-calendar space pages to appear in PINNED while unpinned root pages appear in PAGES.

[What Codex understood:
Pinned behavior must be real metadata-backed behavior, not static lists.]

[How it is implemented:
Sidebar tree helpers sort pinned items by order/timestamp and exclude duplicates. Pin/unpin metadata persists through the provider. Verified by `page-workspace.test.ts` and browser smoke.]

### Spaces as promoted pages [partially implemented]

Goal:
Represent major non-calendar spaces as page records while preserving the newer vocabulary that Space means active working context.

[What Codex understood:
The old hard-coded spaces/page split is being phased out; Calendar must not be a promoted page.]

[How it is implemented:
Notes, Documents, Projects, People, Finance, and Trackers are still seeded as promoted page items. Calendar Space was removed from new seeds/templates and old `space-calendar` records are soft-deprecated. The broader vocabulary cleanup remains partial.]

### Calendar as core module [partially implemented]

Goal:
Keep Calendar as an app-level module with event records, not as a promoted page or sidebar page.

[What Codex understood:
Calendar events can be page-like records, but Calendar itself is a module route.]

[How it is implemented:
`/calendar` renders `CalendarView` directly, sidebar trees exclude calendar items, new seed data no longer creates Calendar Space, and event creation no longer parents to `space-calendar`. Recurrence, ICS import/export, reminders, drag/resizing, and final SQLite calendar tables remain missing.]

### Notes [partially implemented]

Goal:
Support local note pages with blocks, child pages, templates, and provider-backed persistence.

[What Codex understood:
Notes are real pages in the prototype, but not final rich documents.]

[How it is implemented:
Notes routes use `SpacePage` and `PageWorkspace`; templates and block editing persist through the provider. Rich editor behavior, Markdown mirrors, import/export, and final storage are not implemented.]

### Editor [partially implemented]

Goal:
Provide a usable block editor for page content.

[What Codex understood:
The editor should only expose controls that actually save.]

[How it is implemented:
`PageEditorSurface` supports implemented block types and simple table blocks with provider persistence. It is not a final rich editor and lacks advanced selection, drag/drop, wiki links, embeds, and Markdown mirror writes.]

### Documents [partially implemented]

Goal:
Represent document records locally and prepare for real import/preview later.

[What Codex understood:
Document records are not the same as a file import engine.]

[How it is implemented:
Documents use `SpacePage`, document templates, metadata, and page records. File import, previews, OCR, Office/PDF/TXT handling, and native helper engines are not implemented.]

### Projects [partially implemented]

Goal:
Support local project pages and relations to notes/documents/tasks later.

[What Codex understood:
Projects are page records with useful starter templates, not a full project management engine.]

[How it is implemented:
Projects route and templates create provider-backed project pages. Milestones, task integration, calendars, views, and project dashboards remain partial or missing.]

### Tasks [not implemented]

Goal:
Create a real task module with tasks as page-like records, statuses, due dates, relations, and calendar/project views.

[What Codex understood:
Task blocks in pages do not equal a task engine.]

[How it is implemented:
Only basic todo blocks exist in the editor. There is no task provider model, task route, task database, or task/calendar/project integration.]

### Calendar [partially implemented]

Goal:
Provide month, week, day, and agenda views with provider-backed event creation, editing, trashing, filtering, and refresh-safe persistence.

[What Codex understood:
Calendar is the selected implementation batch for this baseline.]

[How it is implemented:
`CalendarView` now supports month, week, day, and agenda. `calendar-events.ts` normalizes legacy date/time fields, creates provider event input, supports all-day/timed metadata, range navigation, agenda sorting, and day grouping. Events persist through `VaultProvider`. Recurrence, reminders, ICS, drag/resizing, and SQLite calendar tables remain missing, so Calendar is still partial.]

### Trackers [partially implemented]

Goal:
Support tracker pages now and a real tracker/check-in engine later.

[What Codex understood:
Tracker pages are a foundation, not the final habit/progress system.]

[How it is implemented:
Trackers route uses `SpacePage` and tracker templates create provider-backed pages. There is no check-in model, streak engine, charted tracker views, or notification support.]

### Goals [not implemented]

Goal:
Create goal records connected to tasks, projects, trackers, and review flows.

[What Codex understood:
Goals are planned as first-class page-like records.]

[How it is implemented:
No goal route, item category, provider model, templates, or UI exists.]

### People [partially implemented]

Goal:
Represent people as local pages with relationship context and links to other records.

[What Codex understood:
People are personal local profiles, not cloud contacts or CRM.]

[How it is implemented:
People route and templates create provider-backed person pages. There is no dedicated people engine, contact fields, timeline, birthday integration, or import/export.]

### Finance [partially implemented]

Goal:
Represent local finance records without bank sync, cloud, or fake finance automation.

[What Codex understood:
Finance is manual local records, not online banking.]

[How it is implemented:
Finance route and templates create provider-backed finance pages. No ledger engine, account model, budgets, recurring bills, charts, or imports exist.]

### Databases [partially implemented]

Goal:
Provide local database pages while clearly separating basic editable tables from the future full database engine.

[What Codex understood:
A database route and editable table are useful foundations but not Notion-level databases.]

[How it is implemented:
`/databases`, `DatabaseTable`, and `database-table.ts` support basic database page creation, columns, rows, cells, and row-as-page behavior. Advanced views, formulas, relations, rollups, CSV import/export, and SQLite storage are missing.]

### Basic database/table foundation [implemented and verified]

Goal:
Provide a real provider-backed editable table foundation for database pages.

[What Codex understood:
The foundation can be verified as implemented even though the full database engine remains partial.]

[How it is implemented:
`database-table.ts` normalizes database metadata, supports row/column/cell mutation, and creates row pages on demand. Verified by `database-table.test.ts` and the full test run.]

### Simple table blocks [implemented and verified]

Goal:
Allow page blocks to contain editable simple tables with safe normalization and persistence.

[What Codex understood:
Simple tables are block content, not full databases.]

[How it is implemented:
`simple-table.ts` and `SimpleTableBlock` support basic row/column/cell operations stored in serialized block content through the provider. Verified by `simple-table.test.ts` and the full test run.]

### Graph [partially implemented]

Goal:
Show provider-backed relations as graph nodes and edges.

[What Codex understood:
The current graph must not use fake nodes.]

[How it is implemented:
`/graph` renders provider items and relation records only. Wiki-link parsing, graph indexes, filters, local page graph, layout physics, and manual canvas are not implemented.]

### Manual local graph/canvas [not implemented]

Goal:
Allow user-authored canvas/graph layouts.

[What Codex understood:
Manual graph/canvas is separate from the automatic relation graph.]

[How it is implemented:
No canvas data model, route, editor, storage, or UI exists.]

### Search [partially implemented]

Goal:
Search local provider-backed items across titles, summaries, statuses, tags, and eventually blocks/files.

[What Codex understood:
Search must use real provider data, not hard-coded result rows.]

[How it is implemented:
`/search` searches active provider items by title, summary, status, and tags. Block full-text indexing, saved queries, file text, privacy filters, highlighting, and command-palette unification remain partial.]

### Templates [partially implemented]

Goal:
Create real pages from templates and later support a complete built-in/user template library.

[What Codex understood:
Templates should create actual provider records and starter blocks.]

[How it is implemented:
`page-workspace.ts` defines implemented templates, and `PageTemplatePicker` creates provider-backed pages. Calendar Space was removed from template creation. Template variables, editor, versioning, validation, preview, and the complete template content spec are not implemented.]

### Theme system [partially implemented]

Goal:
Support coherent light, dark, night, and system themes across the app.

[What Codex understood:
Theme must be global and truthful, not one-screen styling.]

[How it is implemented:
`ThemeProvider`, root flash-prevention script, `mizaan-theme`, and Settings segmented control exist. Full visual contrast audit across all states/themes is not complete.]

### Right panel/Page data [implemented and verified]

Goal:
Move page metadata into a useful right panel and keep the writing surface uncluttered.

[What Codex understood:
The center page should be document-first, while metadata belongs in Page data.]

[How it is implemented:
`PageRightPanel` provides Page data, Relations, Backlinks, Outgoing, Files, Local Graph, and History tabs with collapsible Page data groups. Verified by tests/build and browser smoke.]

### Sidebar hover menus [partially implemented]

Goal:
Expose page row actions through hover/focus menus without cluttering the sidebar.

[What Codex understood:
Menu actions must perform real provider operations or be disabled.]

[How it is implemented:
Sidebar row menus include Open, Rename, Duplicate, Pin/Unpin, Create subpage, Copy link, and Move to trash, with disabled protected/system actions. Automated tests cover the underlying operations, but full keyboard/hover browser QA remains partial.]

### Pin/unpin logic [implemented and verified]

Goal:
Persist sidebar pinning state and sort pinned items predictably.

[What Codex understood:
Pinning should survive refresh because it is provider metadata.]

[How it is implemented:
Pin/unpin writes `sidebarPinned` and `sidebarPinnedAt` metadata through the provider. Tests verify persistence, sorting, and duplicate avoidance.]

### Backup/export/restore [not implemented]

Goal:
Provide safe local backup, restore, and recovery workflows.

[What Codex understood:
Backup/restore cannot be claimed from docs or placeholder buttons.]

[How it is implemented:
No real backup archive writer, restore validation, recovery drill, or UI exists.]

### Import/export [not implemented]

Goal:
Import and export user data without destructive overwrites or lock-in.

[What Codex understood:
Import/export belongs to the real file/storage phase.]

[How it is implemented:
No import manager, export archive, Markdown/file export, duplicate handling, or validation exists.]

### Windows app/Tauri [not implemented]

Goal:
Ship a Windows desktop app with Tauri/native filesystem boundaries.

[What Codex understood:
Browser preview is not a Windows app.]

[How it is implemented:
No Tauri project, Rust commands, installer, native filesystem bridge, or desktop build exists.]

### Android/iOS companion [not implemented]

Goal:
Eventually provide mobile companion behavior without becoming cloud-first.

[What Codex understood:
Mobile is explicitly deferred.]

[How it is implemented:
No Android or iOS project, sync layer, mobile UI, or companion protocol exists.]

### Portable vault sync model [not implemented]

Goal:
Define safe portable-vault movement/sync behavior for drives and backup media.

[What Codex understood:
Sync must not be cloud/auth and must not corrupt local data.]

[How it is implemented:
Only the plan describes this. No sync state, conflict model, USB detection, or provider support exists.]

### Security/privacy [partially implemented]

Goal:
Keep data local, avoid secrets/cloud leakage, and later support locked/private content.

[What Codex understood:
No cloud/auth is good, but it is not full security.]

[How it is implemented:
The current app adds no cloud/auth/Google/telemetry and reports prototype storage truth. There is no security code, encryption, private content UX, lock screen, redaction, or log scrubbing.]

### Plugin system [not implemented]

Goal:
Allow future controlled extension points without compromising local data.

[What Codex understood:
Plugins are deferred and should not be added before core storage is stable.]

[How it is implemented:
No plugin manifest, loader, sandbox, settings, or API exists.]

### Page layouts [partially implemented]

Goal:
Provide usable page/workspace layouts for writing, properties, relations, tables, and subpages.

[What Codex understood:
Layouts should be useful and calm, not decorative shell cards.]

[How it is implemented:
Page workspace, right panel, editor, database table, and subpage sections exist. Mobile/responsive polish, layout presets, and advanced page layouts remain partial.]

### Navigation model [partially implemented]

Goal:
Separate Home, modules, pages, pinned items, and system tools in a stable route model.

[What Codex understood:
Calendar/Search/Graph are modules; pages are provider records.]

[How it is implemented:
TanStack routes exist for core app surfaces and dynamic pages. Some category pages are still generic `SpacePage` shells and final module/page vocabulary cleanup remains partial.]

### Import manager [not implemented]

Goal:
Handle file/folder/clipboard imports safely with metadata and duplicate checks.

[What Codex understood:
Import manager must not fake file access in a browser prototype.]

[How it is implemented:
No import manager UI, provider API, filesystem access, or import log exists.]

### Export format rules [not implemented]

Goal:
Export pages, files, mirrors, metadata, and backups in inspectable formats.

[What Codex understood:
Export must be real generated data, not a claim.]

[How it is implemented:
Only the plan defines export rules. No exporter is implemented.]

### Vault health dashboard [partially implemented]

Goal:
Show storage/provider health and warnings honestly.

[What Codex understood:
Health must distinguish prototype facts from final readiness.]

[How it is implemented:
Home, Settings, and Vault surfaces show provider mode, counts, warnings, and unsupported capabilities. There is no full integrity check, repair action, backup validation, or filesystem health probe.]

### Repair/recovery tools [not implemented]

Goal:
Repair missing mirrors, damaged SQLite, conflicts, missing files, and vault inconsistencies.

[What Codex understood:
Repair tools require the real vault/storage layer.]

[How it is implemented:
No repair/recovery actions exist beyond basic provider normalization.]

### Version history [not implemented]

Goal:
Track versions, snapshots, and restore comparisons for pages/files.

[What Codex understood:
History is planned and must not be implied by the current History tab.]

[How it is implemented:
The right panel History tab states that version history is planned. No version records, snapshots, restore UI, or provider methods exist.]

### Settings [partially implemented]

Goal:
Expose local app settings and provider truth without fake unavailable controls.

[What Codex understood:
Read-only truth is preferable to dead settings.]

[How it is implemented:
Settings shows workspace/provider facts, theme selector, and unavailable future features. Most settings are read-only and backup/security/storage settings are not implemented.]

### Notification engine [not implemented]

Goal:
Support local reminders/notifications for tasks, calendar, trackers, and goals.

[What Codex understood:
Notifications should not be added before core modules and storage are stable.]

[How it is implemented:
No notification model, scheduler, permission flow, or UI exists.]

### Command palette/shortcuts [partially implemented]

Goal:
Provide keyboard access to app actions and routes.

[What Codex understood:
Command palette actions must be real and align with routes/search.]

[How it is implemented:
`CommandPalette` and Ctrl/Cmd+K shell exist with navigation/actions. Full search unification, keyboard QA, and complete action coverage remain partial.]

### Template content spec [partially implemented]

Goal:
Define and implement realistic built-in templates for notes, projects, documents, finance, people, trackers, databases, and more.

[What Codex understood:
Template content needs structured data and real creation behavior.]

[How it is implemented:
The current app has a small implemented template set in `page-workspace.ts`. The full library, variables, validation, previews, user templates, and content spec remain missing.]

### Database engine spec [partially implemented]

Goal:
Build a full database engine with typed properties, views, filters, formulas, relations, rollups, and import/export.

[What Codex understood:
The implemented table foundation is not the final engine.]

[How it is implemented:
Basic database metadata and table UI are provider-backed and tested. The advanced engine spec remains largely unimplemented.]

### Canvas system [not implemented]

Goal:
Support visual canvas pages and graph/manual layout workflows.

[What Codex understood:
Canvas is later than relation graph foundations.]

[How it is implemented:
No canvas item type, route, storage, editor, or rendering system exists.]

### Document preview engine [not implemented]

Goal:
Preview documents, PDFs, Office files, text, media, and extracted content inside Mizaan safely.

[What Codex understood:
Document records are not previews.]

[How it is implemented:
No preview engine, helper runtime, LibreOffice/VLC/FFmpeg boundary, OCR, or file snapshot workflow exists.]

### Windows release plan [not implemented]

Goal:
Package the desktop app with installer, helper runtimes, rollback, and release gates.

[What Codex understood:
Release planning exists in docs, but release implementation does not.]

[How it is implemented:
No Tauri build, installer, updater, runtime bundle, or release artifact exists.]

### QA/testing standard [partially implemented]

Goal:
Require code checks, browser QA, screenshots for UI work, phase evidence, and honest blockers.

[What Codex understood:
The standard is active for this session, but the product is not fully QA-hardened.]

[How it is implemented:
This baseline ran typecheck, tests, lint, build, browser QA, and evidence updates. There is no complete e2e suite, performance suite, restore drill, or native QA yet.]

### Migration strategy [partially implemented]

Goal:
Migrate data structures safely without wiping user data.

[What Codex understood:
Migrations must be conservative and visible.]

[How it is implemented:
`LocalStorageVaultProvider` normalizes legacy records, seeds missing non-calendar spaces, and soft-deprecates legacy Calendar Space. There is no formal migration runner or SQLite/filesystem migration strategy.]

### Error states [partially implemented]

Goal:
Show clear loading, missing, empty, unavailable, and failure states.

[What Codex understood:
Dead silence and fake success are not acceptable.]

[How it is implemented:
Root error/not-found UI, page missing state, empty states, provider warnings, and unavailable settings copy exist. File/storage failure states, conflict states, disk/USB errors, and recovery UI are missing.]

### Privacy/locked content UX [not implemented]

Goal:
Protect private/locked content in UI, logs, search, graph, screenshots, and storage.

[What Codex understood:
Local-only is not the same as locked/private content.]

[How it is implemented:
No private-content model, app lock, search exclusion, graph redaction, screenshot warning, or security code exists.]

## 4. Contradictions Resolved

### 4.1 Database vs human-readable folders

Resolved decision:

```text
SQLite is the fast runtime brain.
Human-readable folders are the lifetime survival layer.
Both must exist.
```

Plain explanation:

- SQLite is the app's structured notebook. It lets Mizaan load fast, search fast, link pages, store properties, and avoid chaos.
- Human-readable folders are the user's archive. They let the user inspect pages, media, documents, metadata, history, and backups even if Mizaan stops existing.
- The app must write to both: SQLite for reliable app behavior, readable files for survival and recovery.

## 4.2 Source of Truth, Human-Readable Recovery, Mirrors, and Conflict Handling

### 4.2.1 Core rule

Mizaan must have two truth layers:

1. **Runtime source of truth**
2. **Lifetime/recovery source of truth**

These two layers exist for different reasons.

The runtime layer is for speed, consistency, search, relations, indexing, undo/redo, autosave, graph building, and app stability.

The lifetime/recovery layer is for human readability, long-term ownership, database damage recovery, manual inspection, portability, and survival if Mizaan itself stops working.

Mizaan must never become a black box where the user’s life data is trapped inside one unreadable database file.

The golden rule is:

```text
SQLite runs Mizaan.
The folder structure preserves the user’s life.
```

---

### 4.2.2 Runtime source of truth

While Mizaan is open and running, **SQLite is authoritative**.

```text
SQLite is the runtime source of truth while Mizaan is running.
```

This means SQLite owns the live working state for:

```text
pages
blocks
properties
relations
backlinks
tasks
calendar records
finance records
people records
trackers
goals
templates
file records
attachment records
media records
metadata records
graph edges
search index state
revision history
trash state
vault settings
provider state
migration state
backup history
repair history
```

The app must not depend on scanning the visible folder tree every time the user clicks a page. That would be slow, fragile, and error-prone.

SQLite is used because Mizaan needs:

```text
fast search
safe transactions
structured relationships
stable IDs
cross-page references
reliable autosave
history tracking
graph building
calendar/task queries
database-like views
backup verification
repair checks
large vault performance
```

The UI must never write directly to visible Markdown, JSON, metadata text, or placement files as its only save mechanism.

All app changes must go through the storage layer:

```text
UI action
→ VaultProvider
→ SQLite transaction
→ filesystem write/mirror update
→ index update
→ backup/revision event if needed
→ UI refresh
```

SQLite is not optional for the real desktop version.

The old localStorage prototype may exist only as a temporary development fallback, demo provider, or migration source. It must not be treated as the lifetime architecture.

---

### 4.2.3 Lifetime and recovery source of truth

The human-readable vault folder is the lifetime/recovery layer.

```text
Human-readable page folders, Markdown files, JSON files, metadata files, placement files, graph files, correction files, version files, history files, and backups must be sufficient to recover meaningful user data if SQLite is damaged.
```

The readable layer must preserve enough information to reconstruct:

```text
page titles
page types
page folders
page content
page blocks where possible
page properties
tags
relations
subpages
attached files
media placements
document placements
file metadata
user metadata corrections
edit history
import history
graph connections
manual graph layouts
template origin
trash status
version history
backup state
```

The readable folder structure does not need to perfectly recreate every internal cache, temporary index, thumbnail, or UI state.

However, it must preserve the meaningful user-owned content.

If the database is damaged, Mizaan should be able to run a recovery process such as:

```text
Scan vault folder
Read page folders
Read page Markdown files
Read page JSON files
Read metadata files
Read placement files
Read relation files
Read graph adjacency files
Read import/edit/correction history files
Read backup manifests
Rebuild SQLite
Rebuild search index
Rebuild graph index
Rebuild previews where possible
Show recovery report
```

The recovery result may not be perfect, but it must recover meaningful user data instead of failing completely.

---

### 4.2.4 Correct mental model for non-technical users

For a normal user, explain it like this:

```text
Mizaan keeps a fast internal notebook so the app can work quickly.
At the same time, Mizaan writes readable folders and files so your data is not trapped.
If the fast internal notebook breaks, Mizaan can rebuild a lot from the readable folders.
```

The user does not need to understand SQLite.

The app should show simple language:

```text
Database = fast app memory
Readable files = human backup and recovery layer
Backups = full safety copy
```

Do not expose database jargon unnecessarily in normal screens.

Use technical terms only in:

```text
Vault Health
Advanced Settings
Repair Mode
Migration Reports
Developer/Debug Reports
Backup Verification Reports
```

---

### 4.2.5 Human-readable folder rule

Every main page must have a visible human-readable folder.

A page folder must be created immediately when the page is created.

The folder must exist even if the page is initially empty.

This is required because the user wants the folder structure to reflect the life/work structure, not only the final files.

Example:

```text
Mizaan Vault (Mohammad)/
  01_System/
  02_Library/
    Pages/
      Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c/
```

Inside the page folder:

```text
Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c/
  note.md
  page.json

  00_Page Info/
  01_Content Media/
  02_Attached Files/
  03_Edits and Versions/
  04_Exports/
  05_Graph and Relations/
  06_Search and Index Notes/
  Subpages/
```

The exact folder names may evolve, but the principle must not change:

```text
The page is the main folder.
The attachments/media/history/metadata live under that page folder.
```

Subpages should appear as subfolders or clearly linked child page folders.

Mizaan must preserve both:

```text
internal stable IDs
human-readable folder names
```

The visible folder name may change when the page title changes, but the stable page ID must remain unchanged.

---

### 4.2.6 Stable IDs and readable names

Every page, file, block, relation, and graph object must have a stable internal ID.

Readable names are for humans.

Stable IDs are for the app.

Example:

```text
Human title:
Nerves

Visible folder:
Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c

Internal ID:
pg_8f3a2c91b77e4e0b9f02f12c
```

The user should be able to inspect a readable translation file such as:

```text
00_Page Info/
  id-map [do not edit - app generated].txt
```

Example contents:

```text
Page Title: Nerves
Page Type: Note
Visible Folder: Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c
Internal Page ID: pg_8f3a2c91b77e4e0b9f02f12c
Created Local Time: 2026-05-31 14:35:22
Created Country: Malaysia
Current Title: Cranial Nerves
Previous Folder Names:
- Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c
```

This file helps humans understand what internal IDs mean without editing the database.

---

### 4.2.7 Page renaming rule

When a user renames a page, Mizaan should rename the visible page folder to match the new title.

However, Mizaan must preserve the previous folder name in a readable history file.

Example:

```text
00_Page Info/
  rename-history [do not edit - app generated].txt
```

Example contents:

```text
2026-06-01 10:12:33 Malaysia
Old Title: Nerves
New Title: Cranial Nerves
Old Folder: Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c
New Folder: Cranial Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c
Reason: User renamed page in Mizaan
```

The internal ID must not change when the page title or folder name changes.

If folder rename fails because of permissions, file locks, USB issues, or invalid characters, Mizaan must:

```text
keep the old folder
update SQLite title
show repair warning
record failed rename in logs
allow retry
never lose content
```

---

### 4.2.8 Autosave rule

Mizaan must autosave active work every 5 seconds.

Autosave must be implemented safely.

Autosave does not mean blindly rewriting files every 5 seconds.

Autosave means:

```text
collect dirty changes
write to SQLite transaction
commit safely
queue mirror update
write readable mirror atomically
update status indicator
record failure if save fails
```

The UI should show save state:

```text
Saved
Saving...
Unsaved changes
Save failed
Vault disconnected
Read-only mode
Conflict detected
Repair required
```

Autosave must not silently fail.

If autosave fails, Mizaan must show a clear warning and stop pretending that content is safe.

---

### 4.2.9 Atomic write rule

All critical writes must be atomic where possible.

For readable files, Mizaan should use this pattern:

```text
write new content to temporary file
flush/write complete
rename temporary file over target file
verify file exists
verify size/checksum if required
record success/failure
```

Example:

```text
page.json.tmp
→ page.json
```

Mizaan must not partially overwrite user-readable files.

If a write is interrupted, the previous valid file should remain available where possible.

---

### 4.2.10 Mirror files

Mizaan must maintain readable mirror files for pages, files, metadata, placement, history, graph connections, and correction state.

Required mirror types:

```text
Markdown mirror
JSON mirror
metadata-source file
metadata-editable file
metadata-resolved file
correction-history file
placement file
import-history file
edit-history file
version manifest
graph adjacency file
page relation file
backup manifest
```

The purpose of each file must be clear from its filename.

Use names such as:

```text
metadata-source (App detected from file-exif-system) [do not edit].json
metadata-editable (User corrections) [safe to edit].json
metadata-resolved (Final value Mizaan uses) [do not edit].json
correction-history [do not edit].json
placement [do not edit - reference only].json
```

The app should prefer JSON for machine-readable correction and metadata files.

For normal users, Mizaan should also show the same data inside the app UI.

Readable files are a backup and power-user layer, not the main editing interface.

---

### 4.2.11 Markdown mirror

Each page should have a Markdown file named according to page type.

Examples:

```text
note.md
project.md
person.md
document.md
task.md
goal.md
tracker.md
finance.md
calendar-event.md
database.md
canvas.md
media.md
template.md
```

The Markdown file should contain the readable page content.

It should include frontmatter.

Example:

```markdown
---
id: pg_8f3a2c91b77e4e0b9f02f12c
title: Cranial Nerves
type: note
created_local: 2026-05-31 14:35:22
created_country: Malaysia
updated_local: 2026-06-01 10:12:33
tags:
  - anatomy
  - exam
relations:
  - target: pg_exam_2026
    label: related exam
private: false
---

# Cranial Nerves

Readable page content here.
```

Markdown should be human-readable.

Markdown should not be the only runtime storage model.

Blocks should still be stored in SQLite for stable editing, movement, relations, graph references, and undo/history.

---

### 4.2.12 JSON mirror

Each page should have a JSON mirror.

Example:

```text
page.json
```

This file should preserve structured data more accurately than Markdown.

It should include:

```text
page ID
page type
title
folder name
created time
updated time
properties
blocks
relations
attachments
media placements
template origin
privacy state
graph references
version state
trash/archive state
```

The JSON mirror is more recovery-friendly than Markdown for structured data.

The Markdown mirror is more human-friendly.

Both are needed.

---

### 4.2.13 Metadata source, editable, resolved, and correction history

Every page and every file/media item must have the metadata correction structure.

Required files:

```text
metadata-source (App detected from file-exif-system) [do not edit].json
metadata-editable (User corrections) [safe to edit].json
metadata-resolved (Final value Mizaan uses) [do not edit].json
correction-history [do not edit].json
```

Purpose:

#### metadata-source

This is what Mizaan detected automatically.

Sources may include:

```text
file EXIF
filesystem metadata
document properties
PDF metadata
media metadata
Office document metadata
user import context
Mizaan-created metadata
```

The user should not edit this file.

#### metadata-editable

This is the safe user correction file.

It should contain the same editable fields from `metadata-source`, but in a controlled format.

The user can edit this file without corrupting the original imported file.

Editing this file does not immediately change the truth.

It creates a correction request.

#### metadata-resolved

This is the final metadata value Mizaan actually uses after review.

It is generated by Mizaan.

The user should not edit it manually.

#### correction-history

This records every detected or accepted correction.

It must include:

```text
timestamp
field name
source value
editable/proposed value
accepted value
rejected value if applicable
review method
reason if provided
device ID
user/vault profile if available
```

---

### 4.2.14 Metadata correction flow

If `metadata-editable` differs from `metadata-source`, Mizaan must show a correction review screen.

The correction review screen should show:

```text
Field name
App-detected value
User-edited value
Current resolved value
Accept correction
Reject correction
Edit correction
Apply all safe corrections
Reject all
Open file location
View raw JSON
Repair malformed file
```

Mizaan must never silently accept corrections from `metadata-editable`.

Mizaan must never silently overwrite `metadata-editable`.

Mizaan must never accept malformed correction JSON without warning.

If malformed JSON is found, Mizaan must:

```text
mark correction file as invalid
show repair warning
keep current resolved metadata
preserve malformed file
create a repair copy if needed
guide user to fix the format
offer to regenerate editable metadata from resolved metadata
record the issue in correction-history and logs
```

---

### 4.2.15 Placement files

Every embedded or attached file must have a placement file.

Placement files explain how a file appears inside a page.

Example:

```text
placement [do not edit - reference only].json
```

For an image:

```json
{
  "placementId": "place_001",
  "pageId": "pg_8f3a2c91b77e4e0b9f02f12c",
  "blockId": "blk_001",
  "fileId": "file_001",
  "displayMode": "embedded",
  "position": "after-block",
  "caption": "Cranial nerve diagram",
  "createdLocal": "2026-05-31 14:45:20",
  "createdCountry": "Malaysia"
}
```

Placement files are important because the page folder may contain many files.

A human should be able to understand:

```text
which file belongs to which page
where the file appeared
whether it was embedded or attached
which block referenced it
what caption was used
```

Placement files also help rebuild pages if SQLite is damaged.

---

### 4.2.16 Graph readable files

Graph data must not live only in an internal index.

Mizaan should store graph-readable files inside each page folder.

Example:

```text
06_Graph/
  graph-links [do not edit - app generated].json
  graph-adjacency [do not edit - app generated].txt
  manual-graph-nodes.json
  manual-graph-edges.json
```

The graph-readable files should include:

```text
outgoing links
incoming known links if available
manual relations
wiki links
attachments
media references
task links
calendar links
finance links
people links
project links
parent-child links
manual graph edges
edge labels
edge direction
edge type
```

Graph indexes are rebuildable.

Human-readable graph files help recover relationships if the database or index is damaged.

Core rule:

```text
The graph index is cache.
The readable page relation files are recovery evidence.
The page/database records remain the source.
```

---

### 4.2.17 Backup rule

Backups must include every meaningful part of the vault.

A backup must include:

```text
SQLite database
page folders
Markdown mirrors
JSON mirrors
metadata files
placement files
graph files
attachments
media
edited media
versions
exports if selected
templates
settings
viewer/helper settings
import history
edit history
correction history
trash
logs
backup history
migration history
repair history
```

Backups should be treated as a continuation point.

The user should be able to restore and continue from where they left off.

Backup/restore must not only protect “important-looking” files.

Mizaan must assume every user file matters.

Before any destructive operation, Mizaan must create a backup or snapshot.

Destructive operations include:

```text
delete page
permanent delete
move many files
bulk rename
migration
schema upgrade
mirror regeneration that overwrites files
repair operation that changes files
restore operation
template reset
trash purge
```

---

### 4.2.18 Conflict rule

Mizaan must follow this conflict logic:

1. If SQLite and readable mirrors agree, there is no issue.
2. If SQLite is newer and mirrors are stale, regenerate mirrors.
3. If mirrors are newer because the user edited them outside Mizaan, show a conflict screen.
4. If `metadata-editable` differs from `metadata-source`, show correction review.
5. Never silently overwrite user-written readable files.
6. Never silently accept malformed metadata correction files.
7. Never silently delete a readable file because it does not match SQLite.
8. Never silently discard external edits.
9. Never silently merge ambiguous edits.
10. Always record conflict detection and resolution.

---

### 4.2.19 Conflict detection

Mizaan must track enough information to detect conflicts.

For every readable mirror file, Mizaan should store:

```text
last known checksum
last known modified time
last generated by Mizaan version
last generated from SQLite revision
last external edit detected time
file path
file type
mirror type
```

When opening a vault, autosaving, rebuilding mirrors, or running health check, Mizaan should compare:

```text
SQLite record revision
mirror file modified time
mirror file checksum
last known generated checksum
```

Possible states:

```text
clean
SQLite newer
mirror newer
both changed
mirror missing
mirror malformed
file locked
file unreadable
permission denied
unknown state
```

---

### 4.2.20 Conflict screen

If a conflict exists, Mizaan must show a clear conflict screen.

The conflict screen should avoid technical confusion.

For each conflict, show:

```text
Page/file affected
What changed inside Mizaan
What changed in the readable file
Last modified time
Which version is newer
Preview of both versions
Keep Mizaan version
Keep readable file version
Merge manually
Save both copies
Open folder
Open readable file
Postpone decision
```

For Markdown conflicts, the screen should show side-by-side text.

For JSON conflicts, the screen should show fields.

For metadata conflicts, the screen should show source, editable, and resolved values.

For graph conflicts, the screen should show changed nodes/edges where possible.

---

### 4.2.21 No silent overwrite rule

Mizaan must never silently overwrite user-written readable files.

This includes:

```text
Markdown files
JSON files
metadata-editable files
manual graph files
template files created by user
placement files if edited externally
page info files if changed externally
history files if changed externally
```

If a file has been edited outside Mizaan, Mizaan must either:

```text
ask the user
preserve both versions
create a conflict copy
open read-only
postpone mirror regeneration
```

Mizaan may automatically regenerate files only when it can prove the file is stale and not user-edited.

---

### 4.2.22 Missing mirror rule

If readable mirror files are missing but SQLite is healthy, Mizaan may regenerate them.

Before regenerating many missing files, Mizaan should show a repair summary:

```text
Missing mirror files found.
SQLite still has the data.
Mizaan can regenerate the readable files.
No user-created files will be deleted.
```

If a missing file was likely user-deleted, Mizaan should record the event.

---

### 4.2.23 Damaged SQLite rule

If SQLite is damaged, Mizaan must not panic or overwrite readable files.

Mizaan should enter recovery mode.

Recovery mode flow:

```text
Detect SQLite problem
Stop normal writes
Open vault read-only if possible
Show recovery screen
Offer backup before repair
Scan readable folders
Build recovery candidate database
Show what can be recovered
Create recovered SQLite as new database
Keep damaged database as archive
Never destroy original damaged database automatically
Generate recovery report
```

The damaged database should be moved or copied to:

```text
01_System/
  Recovery/
    Damaged Databases/
```

or another clearly marked recovery folder.

---

### 4.2.24 USB/external drive removal rule

If a vault is on USB, external SSD, SD card, portable hard drive, or removable storage, Mizaan must handle disconnection safely.

Autosave every 5 seconds helps, but it is not enough by itself.

If the drive disappears while Mizaan is open, Mizaan must:

```text
immediately stop writes
mark vault as disconnected
freeze editing or switch to emergency read-only memory state
show clear warning
keep unsaved in-memory changes if possible
do not write to wrong path
do not create a new empty vault accidentally
do not corrupt SQLite
do not overwrite mirrors
wait for drive reconnection
verify vault identity after reconnection
run health check
resume only if safe
```

The UI warning should say:

```text
Vault drive disconnected.
Mizaan stopped writing to protect your data.
Reconnect the same vault drive to continue.
```

When the drive reconnects, Mizaan must verify:

```text
same vault ID
same vault name
same schema version
same path or approved moved path
lock state
database health
recent save state
```

If verification fails, Mizaan must not resume writing.

---

### 4.2.25 Read-only mode

Mizaan must support read-only mode.

Read-only mode is used when:

```text
vault lock exists
stale lock is unresolved
drive may be unsafe
SQLite is damaged
file permissions deny writing
schema is too new
backup restore is being inspected
conflicts are unresolved
user chooses read-only open
```

In read-only mode, the user can inspect data but cannot modify it.

The UI must clearly show:

```text
Read-only mode
Reason: [reason]
How to fix: [repair action]
```

---

### 4.2.26 Logs

Logs should include enough detail for personal debugging and repair.

Since this is a personal-use app, logs may be detailed.

However, logs still must be clearly stored and visible to the user.

Logs should include:

```text
file operations
save operations
backup operations
restore operations
import operations
edit operations
external helper launches
preview generation
checksum changes
conflict detection
repair actions
migration actions
errors
warnings
drive disconnect events
permission failures
database errors
metadata correction events
```

Logs should be stored in the vault system area.

Example:

```text
01_System/
  Logs/
    mizaan-log-2026-05-31.txt
```

Because logs may include sensitive filenames or page titles, the app should clearly label them as private local logs.

---

### 4.2.27 Health check

Mizaan must include a Vault Health screen.

Vault Health should check:

```text
vault identity file
folder structure
SQLite integrity
schema version
lock state
page folders
missing mirrors
malformed JSON
missing attachments
orphan attachments
checksum mismatches
preview status
thumbnail status
search index status
graph index status
backup status
trash status
helper runtime status
drive safety status
```

Actions:

```text
Run health check
Repair missing mirrors
Rebuild search index
Rebuild graph index
Rebuild previews
Rebuild thumbnails
Check metadata corrections
Check missing files
Create backup now
Open recovery mode
Export health report
```

---

### 4.2.28 Rebuild everything safe command

Mizaan should include an advanced repair action:

```text
Rebuild Everything Safe
```

This command must not delete user data.

It may regenerate:

```text
search index
graph index
preview files
thumbnail files
resolved metadata files
readable mirrors if safe
cache files
health reports
```

It must not silently overwrite user-edited readable files.

Before running, it should create a backup or at least a repair snapshot.

---

### 4.2.29 Implementation requirements for AI/Codex

Any AI or human implementing this section must follow these rules:

```text
Do not treat SQLite as the only data survival mechanism.
Do not treat Markdown as the live app database.
Do not write UI directly to localStorage in the real implementation.
Do not silently overwrite readable files.
Do not silently accept malformed metadata.
Do not delete user data.
Do not perform destructive migration without backup.
Do not fake recovery.
Do not fake graph data.
Do not fake backup success.
Do not fake autosave success.
Do not claim vault safety without health checks.
```

The correct implementation order is:

```text
1. Build/verify VaultProvider abstraction.
2. Implement real vault folder structure.
3. Implement SQLite provider.
4. Implement page folders.
5. Implement Markdown and JSON mirrors.
6. Implement metadata source/editable/resolved/correction files.
7. Implement autosave with safe transactions.
8. Implement conflict detection.
9. Implement correction review screen.
10. Implement health check.
11. Implement backup/restore.
12. Implement recovery mode.
13. Implement graph/search rebuilds.
14. Implement advanced repair tools.
```

This order prevents the app from becoming visually impressive but unsafe.

---

## 4.3 Native Viewing, Bundled Helper Engines, LibreOffice, VLC, FFmpeg, and the One-App Experience

### 4.3.1 Core user experience rule

Mizaan is a one-app experience.

```text
The user installs Mizaan.
The user opens Mizaan.
The user works inside Mizaan.
```

The user should not be expected to manually install LibreOffice, VLC, FFmpeg, or other helper tools for the normal supported workflows.

For the user, Mizaan should feel like:

```text
one app
one installer
one vault
one workspace
one file/document/media workflow
```

However, Mizaan must not lie about what is truly native.

Some features are Mizaan-native.

Some features are powered by bundled helper engines.

The implementation must be honest internally and clear in technical documentation.

---

### 4.3.2 Personal-use assumption

This app is being built for personal use only.

It is not intended to be publicly uploaded, commercially distributed, licensed to customers, sold, or published as a public app store product.

That personal-use assumption means public redistribution/legal packaging requirements are not the main design blocker right now.

However, personal use does not remove technical requirements.

Mizaan must still handle:

```text
stable helper launching
crash isolation
file locking
snapshot creation
modified file detection
preview regeneration
version history
helper runtime corruption
missing helper files
large installer size
Windows path issues
portable mode
USB drive removal
backup/restore
repair mode
```

The app may bundle helper runtimes for personal use, but it must still be engineered cleanly.

---

### 4.3.3 Meaning of “one app”

“One app” means:

```text
The user installs Mizaan once.
The user opens Mizaan once.
Mizaan provides the workspace, vault, page system, file system, previews, edit workflow, history, graph, search, backup, and repair.
```

“One app” does not mean every capability must be hand-written inside the Mizaan React/Tauri UI.

“One app” also does not mean that LibreOffice, VLC, or FFmpeg are fake-native Mizaan components.

The correct model is:

```text
Mizaan is the main app.
Bundled helper engines provide heavyweight document/media capability.
Mizaan controls the workflow.
The vault remains the source of truth.
The helper engines never own the user’s data model.
```

---

### 4.3.4 Helper runtime principle

Mizaan may include internal helper runtimes.

Examples:

```text
LibreOffice-compatible runtime/helper
VLC/libVLC-compatible runtime/helper
FFmpeg runtime/helper
PDF renderer
image processing helper
OCR helper later
```

These helper runtimes should be bundled inside the Mizaan installation or portable app package.

They should not be installed globally as normal separate user-facing apps.

They should not require the user to visit another website and install software manually.

They should not become separate Start Menu apps unless intentionally exposed for debugging.

They should be treated as Mizaan-managed internal tools.

---

### 4.3.5 Where helper runtimes live

Helper runtimes belong to the app installation package, not the user data vault.

Recommended app package layout:

```text
Mizaan App/
  Mizaan.exe
  app/
  runtimes/
    office/
      libreoffice/
    media/
      vlc-or-libvlc/
    ffmpeg/
      ffmpeg.exe
      ffprobe.exe
  resources/
  runtime-manifest.json
```

The vault should store settings, logs, previews, metadata, and file history.

The vault should not normally store large helper binaries.

Recommended vault layout:

```text
Mizaan Vault (Mohammad)/
  01_System/
    Settings/
      helper-settings.json
    Logs/
      helper-launch-history.json
    Runtime Reports/
      helper-health-report.json
  02_Library/
```

Exception:

If Mizaan later supports a fully portable mode where the app and vault live together on the same external drive, then helper runtimes may live beside the app in the portable app folder.

Even then, helper runtimes should not be mixed with user page content.

---

### 4.3.6 Native Mizaan viewer definition

A Mizaan-native viewer means the content is displayed directly inside Mizaan’s own UI.

Native viewing should support:

```text
PDF viewing
TXT viewing and editing
Markdown viewing and editing
CSV viewing and basic editing
JSON viewing for metadata/debug files
images
page content
metadata files
placement files
import history
edit history
correction history
search results
graph views
backup reports
vault health reports
simple audio/video when supported by native playback
```

Native does not mean Mizaan must implement a full Office suite.

Native means Mizaan owns the UI and the interaction.

---

### 4.3.7 Files Mizaan should handle natively

Mizaan should handle these directly inside the app:

```text
.pdf
.txt
.md
.csv
.json
.png
.jpg
.jpeg
.webp
.gif preview
.svg preview if safe
basic audio playback when supported
basic video playback when supported
page folders
metadata files
placement files
history files
logs
backup reports
health reports
```

For these formats, the user should usually not need a helper window.

The user should be able to:

```text
open
preview
search
copy text
inspect metadata
link to page
attach to page
export
view history
repair missing metadata
```

For editable text formats, the user should be able to edit inside Mizaan where appropriate:

```text
.txt
.md
.csv basic editing
metadata-editable JSON through safe UI
```

---

### 4.3.8 Office-suite file rule

Office-suite files should use the bundled office helper runtime.

Office formats include:

```text
.doc
.docx
.odt
.rtf
.xls
.xlsx
.ods
.ppt
.pptx
.odp
```

For these files, Mizaan should support two modes:

1. **Preview inside Mizaan**
2. **Edit/view in managed Office helper window**

The default page experience should show the preview inside Mizaan.

The full editing experience should open a managed Office window powered by the bundled office runtime.

The office window may be separate from the main Mizaan WebView, but it is still part of the Mizaan workflow.

---

### 4.3.9 Office preview flow

When the user opens an Office file inside Mizaan, Mizaan should first show a preview.

Preview flow:

```text
User imports or opens Office file
→ Mizaan checks file type
→ Mizaan creates/updates file record in SQLite
→ Mizaan stores file in the page folder
→ Mizaan creates metadata-source
→ Mizaan creates metadata-editable
→ Mizaan creates metadata-resolved
→ Mizaan runs office helper in preview/conversion mode
→ office helper generates preview.pdf
→ Mizaan optionally generates preview.webp/images from preview.pdf
→ Mizaan stores preview files inside the file’s folder
→ Mizaan records preview generation in file history
→ Mizaan displays preview inside Mizaan
```

Example folder:

```text
02_Attached Files/
  Documents/
    001_Word Document/
      original.docx
      preview.pdf
      preview.webp
      document-info [do not edit - app generated].json
      metadata-source (App detected from file-exif-system) [do not edit].json
      metadata-editable (User corrections) [safe to edit].json
      metadata-resolved (Final value Mizaan uses) [do not edit].json
      correction-history [do not edit].json
      edit-history [do not edit].json
```

Preview generation failure must not block storage.

If preview fails, Mizaan should show:

```text
File stored safely.
Preview generation failed.
You can still open the file in the managed editor.
```

---

### 4.3.10 Office edit/view flow

When the user wants full Office viewing or editing, Mizaan opens a managed Office helper window.

Flow:

```text
User clicks Open/Edit
→ Mizaan verifies vault is writable
→ Mizaan verifies file exists
→ Mizaan verifies helper runtime is available
→ Mizaan creates pre-edit snapshot
→ Mizaan records checksum and modified time
→ Mizaan launches bundled office helper window
→ User views/edits document
→ User saves document
→ Mizaan detects modified time/checksum change
→ Mizaan records post-edit snapshot metadata
→ Mizaan updates file metadata
→ Mizaan regenerates preview
→ Mizaan updates search index if text extraction exists
→ Mizaan updates graph/file relationships if needed
→ Mizaan writes edit-history
→ Mizaan updates page UI
```

This must feel like Mizaan opened the document.

But technically, the Office helper is a managed separate process/window.

---

### 4.3.11 Why not embed the full LibreOffice desktop UI inside Mizaan WebView

Mizaan should not embed the full LibreOffice desktop UI directly inside the React/Tauri WebView unless a proven, tested, stable integration exists.

This is fragile because LibreOffice is a full desktop application with its own:

```text
window system
menus
toolbars
keyboard focus
dialogs
save prompts
file locks
document state
crash behavior
printing behavior
font handling
extension handling
platform behavior
```

Trying to force that directly inside a webview/page panel can create failures such as:

```text
keyboard shortcuts going to the wrong app
menus not working correctly
save dialogs appearing behind the main app
file locks not releasing
document state not syncing
LibreOffice crash affecting Mizaan
broken scaling on Windows
broken focus when switching tabs
printing/export dialogs behaving unpredictably
helper windows disappearing behind Mizaan
```

Therefore the correct architecture is:

```text
Preview inside Mizaan.
Full Office edit/view in managed helper window.
Mizaan controls snapshots, checksums, history, preview regeneration, and metadata.
```

---

### 4.3.12 Managed helper window requirements

A managed helper window is not the same as “the user opened random external software.”

A managed helper window must be launched and tracked by Mizaan.

Mizaan should know:

```text
which page launched it
which file launched it
which helper runtime launched it
process ID if available
launch time
pre-edit checksum
pre-edit modified time
whether a snapshot was created
whether the file changed
whether preview regeneration is needed
whether the helper closed cleanly
```

Mizaan should show status:

```text
Office editor open
Waiting for save
Changes detected
Updating preview
Editor closed
No changes detected
Edit failed
Helper crashed
File locked
```

If the helper crashes, Mizaan must not lose the original file.

---

### 4.3.13 Pre-edit snapshot rule

Before opening any Office file for editing, Mizaan must create a pre-edit snapshot.

Snapshot location:

```text
05_Versions/
```

or inside the file’s own version folder.

Example:

```text
02_Attached Files/
  Documents/
    001_Word Document/
      original.docx
      05_Versions/
        2026-05-31_150312_before-edit/
          original.docx
          snapshot-info.json
```

Snapshot info should include:

```text
file ID
page ID
original filename
snapshot reason
timestamp
country/local time
checksum before edit
file size before edit
helper runtime used
Mizaan version
```

This snapshot protects against accidental damage.

---

### 4.3.14 Post-edit detection

After the user saves or closes the Office helper window, Mizaan must check:

```text
file exists
modified time changed
checksum changed
file size changed
file lock released
preview needs update
metadata needs update
search index needs update
```

If no checksum changed, Mizaan should record:

```text
Editor opened, no saved changes detected.
```

If checksum changed, Mizaan should record:

```text
Office document edited.
Pre-edit snapshot exists.
Preview regenerated.
Metadata updated.
```

---

### 4.3.15 Snapshot vs new folder rule

Editing an existing Office file should not create a completely new document folder by default.

The edited file remains in the same file folder.

The previous version is stored inside that file’s version/snapshot area.

Correct:

```text
001_Word Document/
  original.docx
  preview.pdf
  05_Versions/
    2026-05-31_150312_before-edit/
      original.docx
      snapshot-info.json
```

Incorrect by default:

```text
002_Word Document Edited Copy/
```

A new folder should be created only if the user explicitly chooses:

```text
Save as new file
Duplicate file
Create edited copy
Export as separate file
```

---

### 4.3.16 Replace original with undo rule

For simple user edits where the user expects the visible file to change, Mizaan may replace the working file with the edited result.

However, it must always preserve undo/version history.

Rule:

```text
The visible current file may be replaced.
The previous version must never be lost.
```

For image crop/annotation, office editing, and simple media edits:

```text
current visible file updates
previous version goes to Versions
undo is available
edit-history records the change
```

If the operation is destructive or uncertain, Mizaan must ask first.

---

### 4.3.17 Image crop and annotation rule

Mizaan should support simple image crop and annotation natively.

The first supported image edits should be:

```text
crop
rotate
basic annotation
simple drawing/marking
blur/redaction later
resize later
```

When the user edits an image:

```text
create pre-edit snapshot
apply edit to current working image if user confirms
store previous version in Versions
update preview
update metadata
record edit-history
allow undo/restore
```

Do not create a new top-level media page by default.

The image remains part of the page where it was placed.

---

### 4.3.18 Media file rule

Images, photos, videos, and audio files are usually part of the page.

They should not automatically become separate Media Pages.

If the user adds an image/video/audio file into a page, Mizaan should create:

```text
file record
placement record
metadata files
preview/thumbnail
history files
block reference
```

But it should remain a continuation of the page unless the user explicitly chooses:

```text
Convert to Media Page
Open as Media Page
Create Media Collection
```

This allows the user to write above and below the media naturally.

Example:

```text
Paragraph block
Image block
Notes below image
Video block
Checklist below video
```

---

### 4.3.19 Video/audio playback rule

Mizaan should use native playback first.

Native playback means:

```text
Mizaan’s own UI/player can play the media directly.
```

If native playback cannot handle the format, Mizaan may use bundled media helper capability.

Flow:

```text
User opens video/audio
→ Mizaan tries native playback
→ If supported, play inside Mizaan
→ If unsupported, use bundled VLC/libVLC/media helper
→ If helper is needed, show managed playback window or managed playback panel
→ Record playback/helper status if needed
```

For personal use, the technical priority is stability.

The app should not spend early development time trying to clone VLC.

---

### 4.3.20 FFmpeg rule

FFmpeg should be the media processing engine.

FFmpeg should handle:

```text
thumbnail extraction
metadata extraction
duration detection
codec detection
resolution detection
audio extraction
video trim later
format conversion later
proxy creation later
preview generation later
```

FFprobe should be used for metadata where useful.

FFmpeg operations must be logged.

FFmpeg must never overwrite originals without snapshot/undo/version history.

---

### 4.3.21 VLC/helper media rule

VLC or libVLC-style helper support should be used only where native playback is not enough.

Examples:

```text
unsupported video codec
unusual audio format
problematic container
advanced playback support
```

Mizaan should not force VLC for every video if native playback works.

Preferred order:

```text
1. Native Mizaan playback.
2. Bundled helper playback.
3. Open managed playback window.
4. Show unsupported format message with repair/conversion option.
```

---

### 4.3.22 Helper runtime health check

Mizaan must include helper runtime health checks.

The app should verify:

```text
office helper exists
office helper launches
office helper can convert sample document
office helper can open document
FFmpeg exists
FFprobe exists
FFmpeg can read sample media
media helper exists if included
media helper launches
runtime paths are valid
runtime version is recorded
```

Health status should appear in:

```text
Settings
Vault Health
Runtime Reports
Repair Mode
```

If a helper is missing or broken, Mizaan should show:

```text
Mizaan helper runtime is missing or damaged.
Repair Mizaan installation or restore the helper runtime.
Your vault data is safe.
```

---

### 4.3.23 Helper settings

Even though helper runtimes are bundled, Mizaan should store helper settings.

Example:

```text
01_System/
  Settings/
    helper-settings.json
```

This may include:

```text
office runtime path
media runtime path
ffmpeg path
ffprobe path
preferred preview format
office preview timeout
media thumbnail timeout
open helper window behavior
regenerate preview after edit
snapshot before edit
```

Normal users should not need to edit these manually.

The app UI should expose simple settings.

Advanced users may inspect the JSON.

---

### 4.3.24 Timeouts and failure handling

Helper operations must have timeouts.

Examples:

```text
Office preview conversion timeout
Office editor launch timeout
FFmpeg thumbnail timeout
FFprobe metadata timeout
Media helper launch timeout
```

If a helper hangs, Mizaan must not hang forever.

Failure handling:

```text
stop waiting
record error
show user-friendly message
keep file stored safely
allow retry
allow open managed editor if preview failed
allow repair helper runtime
```

---

### 4.3.25 File locking

Office files may be locked while being edited.

Mizaan must detect and respect locks.

While a file is open in the managed Office window:

```text
do not overwrite it
do not regenerate preview from half-saved file
do not move it
do not delete it
do not rename its folder
do not run destructive repair on it
```

The UI should show:

```text
File is currently open in editor.
Some actions are paused until the editor closes.
```

After the helper closes, Mizaan should wait briefly and then verify the file is unlocked before updating preview and metadata.

---

### 4.3.26 Preview regeneration

After editing Office files, images, or media, Mizaan should regenerate previews.

Preview regeneration should update:

```text
preview.pdf
preview.webp
thumbnail.webp
metadata-resolved
document-info
edit-history
search index if applicable
graph/file relationships if applicable
```

If preview regeneration fails after editing, the edit itself should still be preserved.

Mizaan should show:

```text
File saved.
Preview update failed.
You can retry preview generation.
```

---

### 4.3.27 Text extraction and OCR

Text extraction should be separate from preview generation.

Office text extraction can happen after preview generation works.

OCR should be later.

Order:

```text
1. Safe file import.
2. Preview generation.
3. Metadata extraction.
4. Text extraction from supported documents.
5. Search indexing.
6. OCR for scanned documents/images later.
```

Scanned PDFs should be stored safely before OCR exists.

OCR failure must not block file storage.

---

### 4.3.28 Native PDF rule

PDF viewing should be native inside Mizaan.

Mizaan should support:

```text
page navigation
zoom
search text if available
copy text if available
open file location
link PDF to page
show metadata
show checksum
show file history
show repair status
```

PDF editing is not required early.

PDF annotation may come later.

---

### 4.3.29 Native TXT/Markdown/CSV rule

TXT, Markdown, and CSV should be viewable natively.

TXT and Markdown should be editable natively.

CSV should support basic native preview/editing.

For complex spreadsheet behavior, the user can open CSV/XLSX through the office helper.

Mizaan should avoid pretending its basic CSV viewer is a full Excel replacement.

---

### 4.3.30 “Open in app” wording

For user-facing copy, Mizaan can say:

```text
Open in Mizaan
Edit in Mizaan Office Window
Preview in Mizaan
```

Avoid saying:

```text
This is fully native Mizaan editing
```

unless Mizaan truly implements that editor itself.

Better wording:

```text
Mizaan-managed editor
Managed Office window
Powered by Mizaan’s bundled office engine
```

This keeps the user experience simple without lying technically.

---

### 4.3.31 Runtime manifest

Mizaan should include a runtime manifest.

Example:

```text
runtime-manifest.json
```

It should record:

```text
runtime name
runtime type
path
version if available
enabled/disabled
last health check
last successful launch
supported file types
timeout settings
```

Example:

```json
{
  "office": {
    "enabled": true,
    "type": "bundled-office-runtime",
    "path": "runtimes/office/libreoffice",
    "supports": [".docx", ".xlsx", ".pptx", ".odt", ".ods", ".odp"],
    "lastHealthCheck": "2026-05-31T10:30:00Z"
  },
  "ffmpeg": {
    "enabled": true,
    "path": "runtimes/ffmpeg/ffmpeg.exe",
    "probePath": "runtimes/ffmpeg/ffprobe.exe"
  }
}
```

---

### 4.3.32 Page/file folder examples

Office document example:

```text
Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c/
  note.md
  page.json

  02_Attached Files/
    Documents/
      001_Word Document/
        nerve-summary.docx
        preview.pdf
        preview.webp
        document-info [do not edit - app generated].json
        placement [do not edit - reference only].json
        metadata-source (App detected from file-exif-system) [do not edit].json
        metadata-editable (User corrections) [safe to edit].json
        metadata-resolved (Final value Mizaan uses) [do not edit].json
        correction-history [do not edit].json
        edit-history [do not edit].json
        05_Versions/
          2026-05-31_150312_before-edit/
            nerve-summary.docx
            snapshot-info.json
```

Image example:

```text
01_Content Media/
  001_Image/
    cranial-nerves.png
    preview.webp
    placement [do not edit - reference only].json
    image-info [do not edit - app generated].json
    metadata-source (App detected from file-exif-system) [do not edit].json
    metadata-editable (User corrections) [safe to edit].json
    metadata-resolved (Final value Mizaan uses) [do not edit].json
    correction-history [do not edit].json
    edit-history [do not edit].json
    05_Versions/
```

Video example:

```text
01_Content Media/
  002_Video/
    neck-dissection.mp4
    thumbnail.webp
    placement [do not edit - reference only].json
    video-info [do not edit - app generated].json
    metadata-source (App detected from file-exif-system) [do not edit].json
    metadata-editable (User corrections) [safe to edit].json
    metadata-resolved (Final value Mizaan uses) [do not edit].json
    correction-history [do not edit].json
    edit-history [do not edit].json
```

---

### 4.3.33 What helper engines must never do

Helper engines must never become the owner of the vault.

LibreOffice, VLC/media helper, and FFmpeg must not:

```text
decide vault structure
move files without Mizaan
rename files without Mizaan
delete files without Mizaan
overwrite originals without snapshot
store the only copy of metadata
store the only copy of edits
become the source of truth
bypass backup rules
bypass version history
bypass conflict detection
bypass privacy state
bypass graph/search indexing
```

Mizaan owns:

```text
vault
page
folder
file record
metadata
history
backup
restore
graph
search
privacy
repair
```

The helper only performs a specific operation.

---

### 4.3.34 Implementation order

The helper system should be implemented in this order:

```text
1. Native simple viewers:
   PDF, TXT, Markdown, CSV, images.

2. Safe file import:
   copy/move into page folders, checksum, metadata files, placement files.

3. Office preview:
   bundled office helper converts Office files into preview.pdf/preview images.

4. Office managed edit window:
   pre-edit snapshot, launch helper, detect save, update metadata, regenerate preview.

5. FFmpeg metadata/thumbnails:
   video/audio/image metadata and thumbnails.

6. Native media playback:
   play supported audio/video inside Mizaan.

7. Managed media helper:
   use bundled helper only when native playback is insufficient.

8. Simple native image editing:
   crop, rotate, annotation, version history, undo.

9. Advanced processing later:
   video trim, audio extraction, conversion, OCR, redaction.
```

Do not build advanced media editing before safe import, previews, snapshots, and recovery exist.

---

### 4.3.35 Error cases that must be handled

Mizaan must handle:

```text
helper runtime missing
helper runtime damaged
helper launch failed
helper crashes
helper hangs
helper output file missing
preview conversion failed
unsupported file format
file locked
file moved
file deleted
permission denied
no disk space
USB drive removed
checksum mismatch
snapshot creation failed
preview regeneration failed
metadata extraction failed
malformed metadata file
conflict detected
user closes helper without saving
user saves changes
user saves as another file
user opens same file twice
```

Each error must produce:

```text
clear user message
safe app state
log entry
repair/retry option where possible
no silent data loss
```

---

### 4.3.36 User-facing error examples

If Office preview fails:

```text
Mizaan stored your document safely, but could not generate a preview.
You can still open it in the managed Office editor.
```

If Office helper is missing:

```text
Mizaan’s Office helper is missing or damaged.
Your vault data is safe.
Repair the Mizaan installation to restore Office preview/editing.
```

If the file is locked:

```text
This file is currently open in the editor.
Close the editor or save your work before moving, deleting, or regenerating the preview.
```

If save is detected:

```text
Changes detected.
Mizaan is updating the preview, metadata, and version history.
```

If preview update after save fails:

```text
Your file was saved.
Mizaan could not update the preview.
You can retry preview generation from the file menu.
```

---

### 4.3.37 Final rule

Mizaan’s document/media architecture must follow this final rule:

```text
Simple files are handled natively inside Mizaan.
Heavy Office and advanced media workflows are powered by bundled helper engines.
The user experiences one app.
The helper engines run as controlled local processes/windows.
Mizaan owns the vault, metadata, page structure, versions, backups, graph, search, and recovery.
No helper engine is allowed to become the source of truth.
```

### 4.4 Edited Media Replacement, Undo, and Original Preservation

#### 4.4.1 Core rule

When the user crops, rotates, annotates, trims, or otherwise edits media, Mizaan may show the edited result in the page in place of the original.

However, this replacement is a **display replacement**, not destructive file deletion.

```text
The page may show the edited version.
The original Mizaan file must remain preserved.
Undo and version restore must be possible.
```

Mizaan must never destroy the original media file during a normal edit operation.

---

#### 4.4.2 User-facing behavior

From the user’s point of view:

```text
User adds image/video/audio to a page.
User edits it.
The page updates to show the edited result.
User can undo or restore the previous/original version.
```

Example:

```text
User inserts a photo.
User crops the photo.
The page now shows the cropped photo.
The original photo is still stored safely.
Undo can return the page block to the original photo.
```

The page should not automatically create duplicate visible blocks after every edit.

Correct behavior:

```text
one media block
active displayed version changes
history keeps previous versions
```

Incorrect behavior by default:

```text
original image block
cropped image block
annotated image block
another duplicate image block
```

Duplicates should appear only if the user explicitly chooses:

```text
Keep both visible
Insert edited copy as new block
Duplicate before editing
Export as separate file
```

---

#### 4.4.3 Data safety behavior

The original Mizaan file is the first file copied or moved into the Mizaan vault for that media item.

Example:

```text
User imports:
cranial-nerves.png

Mizaan original:
cranial-nerves.png
```

The original must be preserved unless the user explicitly performs a permanent delete with confirmation and a backup/snapshot exists.

Normal edits must not overwrite or delete the original.

Mizaan must preserve:

```text
original file
edited outputs
active display pointer
edit history
version history
metadata
checksum history
placement records
undo/restore state
```

---

#### 4.4.4 Correct technical model

Each media block should point to an active file version.

Example:

```json
{
  "blockId": "blk_001",
  "type": "image",
  "mediaId": "media_001",
  "activeVersionId": "ver_003",
  "displayFileId": "file_img_cropped_002"
}
```

The original file remains linked as:

```json
{
  "mediaId": "media_001",
  "originalFileId": "file_img_original_001",
  "activeFileId": "file_img_cropped_002"
}
```

Undo changes the active display pointer back to a previous version.

Undo must not require deleting files.

---

#### 4.4.5 Storage location

Edited media should stay inside the same page/media file area.

Recommended structure:

```text
01_Content Media/
  001_Image/
    cranial-nerves.png
    preview.webp
    placement [do not edit - reference only].json
    image-info [do not edit - app generated].json
    metadata-source (App detected from file-exif-system) [do not edit].json
    metadata-editable (User corrections) [safe to edit].json
    metadata-resolved (Final value Mizaan uses) [do not edit].json
    correction-history [do not edit].json
    edit-history [do not edit].json

    Edits/
      2026-06-01_101233_Malaysia_crop_001/
        cranial-nerves_crop_001.png
        edit-info.json
      2026-06-01_101800_Malaysia_annotation_002/
        cranial-nerves_annotation_002.png
        edit-info.json

    Versions/
      version-history.json
```

The original file remains at the top of the media folder.

Edited outputs live under `Edits/`.

Version metadata lives under `Versions/`.

The active display pointer is stored in SQLite and mirrored into readable JSON.

---

#### 4.4.6 Edit history

Every edit must create an edit-history entry.

The entry must include:

```text
edit ID
media ID
page ID
block ID
original file ID
input version ID
output version ID
operation type
local edit time
UTC edit time
timezone
country
country source
device ID
device name
user/vault profile
old checksum
new checksum
undo available
```

Example operation types:

```text
crop
rotate
annotate
draw
trim
extract_audio
compress
convert
resize
restore_original
restore_version
```

For now, early implementation should focus on:

```text
crop
rotate
basic annotation
restore original
restore previous version
```

Advanced operations may come later.

---

#### 4.4.7 Undo behavior

Undo should work at two levels:

```text
Immediate undo
Version restore
```

Immediate undo:

```text
Reverses the most recent edit/display-pointer change.
```

Version restore:

```text
Lets the user choose an older version from version history.
```

Undo must persist across app restart if the edit was already saved.

Undo cannot exist only as temporary UI memory.

The readable version history must be enough to understand what happened even outside Mizaan.

---

#### 4.4.8 Metadata and preview updates

After a media edit, Mizaan must update:

```text
active display pointer
edit history
version history
metadata-resolved
checksum
preview/thumbnail if needed
placement file if display file changed
search index if relevant
graph/file relation state if relevant
page updated timestamp
autosave state
```

If preview regeneration fails, the edited file must still remain safe.

Mizaan should show:

```text
Edit saved.
Preview update failed.
You can retry preview generation.
```

---

#### 4.4.9 Permanent delete rule

Permanent delete is separate from edit replacement.

Normal edit replacement must not physically delete the original.

Permanent deletion of an original file is allowed only when all of these are true:

```text
user explicitly chooses permanent delete
Mizaan shows a clear warning
backup or snapshot exists
file is not required by another page/block/version
the user confirms the action
delete event is logged
```

If the original is still referenced by any version, block, page, graph relation, or history record, Mizaan must warn before deletion.

---

#### 4.4.10 Required implementation behavior

Mizaan must implement edited media using this model:

```text
Original file remains preserved.
Edited output is stored as a separate file.
The page block points to the currently displayed version.
Undo changes the pointer back to a previous version.
Version history records all edits.
Permanent deletion is separate and requires explicit confirmation.
```

Forbidden behavior:

```text
Do not overwrite the original file during normal crop/annotation.
Do not delete the original after edit.
Do not create duplicate visible blocks unless the user asks.
Do not make undo temporary-only if the edit has been saved.
Do not lose edit history after app restart.
Do not store edited outputs outside the page/media folder without a record.
Do not update the UI without updating SQLite and readable mirrors.
```

Done criteria:

```text
User can import an image into a page.
User can crop or annotate it.
The page shows the edited result.
The original file still exists.
The edited file exists separately.
Undo restores the previous/original display.
Version history shows the edit.
Edit history records time, country, device, operation, input, and output.
Restarting Mizaan does not lose the active edited version or undo/version history.
```

### 4.5 USB removal and autosave

Autosave every 5 seconds reduces data loss. It does not make sudden drive removal safe by itself.

Required behavior:

- Autosave every 5 seconds.
- Writes must be atomic where possible.
- SQLite must use safe transaction mode.
- File writes must use temp-file-then-rename strategy.
- The app must detect missing/disconnected vault path.
- If drive disappears, Mizaan immediately freezes writes, marks vault offline, shows warning, and switches to safe recovery mode.
- The app must not continue pretending writes are saved.
- On reconnect, Mizaan must verify database integrity, lock status, pending operations, and last successful write.

Plain explanation of “atomic”:

> Atomic means a save either finishes fully or does not count. The app should not leave half-written files if the computer crashes or the USB is removed.

---

## 5. Canonical Vocabulary

Use these exact terms.

```text
Vault = the whole local data container
Page = the main saved object
Space = the currently opened active working context
Template = a blueprint that creates one page or a system of pages
Module = an app-level tool, not always a page
Workspace View = the screen where a page, space, or module is opened
Block = content unit inside a page
Relation = connection between pages/items/files
Attachment = file stored inside a page folder
Mirror = readable Markdown/JSON/text representation generated from database data
Snapshot = recoverable version of a page/file/database state
Backup = complete restorable package of vault state
```

Forbidden old wording:

- promoted page space
- space as permanent object type
- space as sidebar object
- space category
- fake workspace
- fake vault

Replacement wording:

- pinned page
- root page
- page collection
- module shortcut
- template-generated page system
- active space

---

## 6. Canonical App Model

### 6.1 Hierarchy

```text
Mizaan app
  Local user session
    Open vault
      Modules
      Pages
        Blocks
        Properties
        Child pages
        Attachments
        Relations
        Versions
      Indexes
      Backups
      Settings
      Logs
```

### 6.2 Page-first rule

Every meaningful saved object must be representable as a page.

Examples:

- note page
- document page
- project page
- person page
- finance page
- calendar event page-like record
- task page-like record
- goal page
- tracker page
- database page
- database row page
- canvas page
- media-containing page
- daily note page
- journal page
- template page

### 6.3 Module rule

Modules are app-level tools. Modules can create, display, and organize pages, but the module itself is not necessarily a page.

Modules:

- Home
- Search
- Graph
- Calendar
- Databases
- Templates
- Vault
- Trash
- Settings
- Import Manager
- Export Manager
- Backup Manager
- Repair Manager
- Media Manager
- Viewer/Editor Manager

### 6.4 Calendar rule

Calendar is a module.

Calendar events are page-like records and must be ICS-friendly in terms of metadata and export format even if they do not have a full calendar page structure.

### 6.5 Task rule

A task can appear in three forms:

1. **Task block** inside a page, like a checkbox line.
2. **Task record/page** in the global task system.
3. **Task shown on calendar/project/goal views** through relations.

Rule:

```text
Simple checkbox = block.
Real task with due date/reminder/status/project = task page-like record.
A task block may be promoted into a real task.
```

### 6.6 Media rule

Images, videos, and audio added inside a page are blocks/attachments inside that page by default.

They do not become separate media pages by default.

A user can optionally promote a media attachment into its own page later if they want metadata, relations, versions, or project context around that media.

### 6.7 Database row rule

Database rows must be able to open as pages.

A row can be lightweight at first, but the final system must allow:

- row properties
- row page content
- row attachments
- row relations
- row backlinks
- row history
- row export

---

## 7. First Launch and User Journey

### 7.1 First launch screen

Screen title:

```text
Welcome to Mizaan
Your private local life operating system.
No cloud. No forced account. Your data lives in your vault.
```

Buttons:

- Create New Vault
- Open Existing Vault
- Restore from Backup
- Demo Mode

Demo Mode may exist for testing, but it must be isolated and clearly labeled.

### 7.2 Create vault flow

Steps:

1. Ask for local user display name.
2. Ask for vault name.
3. User chooses location.
4. Location can be internal drive, USB drive, external SSD, SD card, portable hard drive, or later NAS/local network folder.
5. Mizaan creates `Mizaan Vault (UserName)` folder unless user customizes name.
6. Mizaan creates system structure.
7. Mizaan creates vault identity file.
8. Mizaan creates SQLite database.
9. Mizaan writes initial settings.
10. Mizaan runs health check.
11. Mizaan opens Home.

### 7.3 Open existing vault flow

Steps:

1. User selects folder.
2. Mizaan checks for vault identity.
3. Mizaan checks schema version.
4. Mizaan checks lock state.
5. Mizaan checks SQLite integrity.
6. Mizaan checks required folders.
7. Mizaan checks backups/indexes if available.
8. Mizaan opens read-only if unsafe.
9. Mizaan opens writable only if safe.

### 7.4 Restore vault flow

Steps:

1. User selects backup.
2. Mizaan validates backup manifest.
3. Mizaan shows backup summary.
4. Mizaan asks restore destination.
5. Mizaan restores into a new vault folder first.
6. Mizaan verifies restored vault.
7. Mizaan never overwrites current vault without explicit user confirmation and backup.

### 7.5 Sign off flow

Steps:

1. Finish autosave.
2. Flush write queue.
3. Close SQLite connection.
4. Write session close log.
5. Remove lock file if this device owns it.
6. Clear active local user session.
7. Return to first launch.

---

## 8. Canonical Vault Folder Structure

A visible system folder and visible library folder.

Canonical root name:

```text
Mizaan Vault (UserName)/
```

Example:

```text
Mizaan Vault (Mohammad Yahya)/
```

Canonical structure:

```text
Mizaan Vault (UserName)/
  01_System/
    00_App System/
      mizaan.vault.json
      mizaan.sqlite
      mizaan.sqlite-wal
      mizaan.sqlite-shm
      mizaan.lock.json
      active-session.json
      device-registry.json
      schema-version.json
      migration-state.json

    01_Settings/
      vault-settings.json
      user-profile.json
      app-preferences.json
      theme-settings.json
      editor-settings.json
      privacy-settings.json
      backup-settings.json
      import-export-settings.json
      keyboard-shortcuts.json

    02_Templates/
      Built-in Templates/
      User Templates/
      Hidden Built-in Templates/
      template-index.json
      template-history.json

    03_Viewers and Editors/
      libreoffice-settings.json
      vlc-settings.json
      ffmpeg-settings.json
      image-editor-settings.json
      viewer-health.json

    04_Import Rules/
      import-rules.json
      file-type-rules.json
      duplicate-rules.json
      naming-rules.json
      metadata-rules.json

    05_Reference Library/
      Icons/
      Covers/
      Default Files/
      Sample Structures/

    06_Indexes/
      search-index/
      graph-index/
      backlinks-index/
      thumbnails-index/
      file-checksums-index.json
      orphan-index.json
      unresolved-links-index.json

    07_Logs/
      app-log.txt
      vault-log.txt
      file-operation-log.txt
      import-log.txt
      edit-log.txt
      backup-log.txt
      restore-log.txt
      migration-log.txt
      error-log.txt
      security-log.txt

    08_Migrations/
      migration-history.json
      pre-migration-checks/
      migration-reports/
      rollback-points/

    09_Health and Repair/
      health-report.json
      repair-history.json
      last-integrity-check.json
      missing-files-report.json
      recovery-notes.txt

  02_Library/
    Pages/
    Inbox/
    Trash/
    Exports/
    Backups/
    Restore Staging/
```

### 8.1 Folder visibility rule

All vault files and folders are visible in File Explorer.

The app should not require users to manually edit the vault folder, but the vault must remain understandable if the user opens it.

### 8.2 App visibility rule

Everything important must also be visible through Mizaan's UI.

The user should not need to open File Explorer for normal use.

---

## 9. Page Folder Rules

### 9.1 When page folder is created

A page folder is created immediately when a page is created.

Autosave must run every 5 seconds.

## 9.2 Page Folder Naming, Stable IDs, Rename History, and Edit Location Logs

### 9.2.1 Core rule

Every page folder must be:

```text
human-readable
recoverable
unique
safe for Windows paths
linked to a stable internal page ID
understandable outside Mizaan
```

Folder names are for humans.

Internal IDs are for Mizaan.

The folder name may change when the page title changes, but the internal page ID must never change.

Mizaan must never use the visible folder name as the real database identity.

---

### 9.2.2 Canonical page folder format

Use this canonical format:

```text
PageTitle_YYYY-MM-DD_HHMMSS_Country_pg_SHORTID/
```

In actual folders, `pg_SHORTID` must look like this:

```text
pg_8f3a2c
```

Example:

```text
Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c/
```

Another example:

```text
Finance Review_2026-06-01_091530_Saudi-Arabia_pg_a91d44/
```

Required folder-name parts:

```text
Page title
Local creation date
Local creation time
Creation country folder token
Short stable page ID
```

Rules:

```text
Use local creation time in the folder name.
Include creation country in the folder name.
Include a short stable page ID in the folder name.
Store the full internal page ID inside page info files.
Sanitize invalid Windows filename characters.
Preserve readable spacing where safe.
Use hyphens inside multi-word country names.
Avoid symbols that break paths.
Do not use the folder name as the database identity.
```

---

### 9.2.3 Country naming rule

Mizaan must distinguish between country display name and country folder token.

Example:

```json
{
  "countryDisplay": "Saudi Arabia",
  "countryFolderToken": "Saudi-Arabia"
}
```

Display examples:

```text
Malaysia
Saudi Arabia
Egypt
Indonesia
Pakistan
Bangladesh
Other
Unknown
```

Folder-token examples:

```text
Malaysia
Saudi-Arabia
Egypt
Indonesia
Pakistan
Bangladesh
Other
Unknown
```

If the country is known, write it.

If the country is not known, use:

```text
Unknown
```

If the user chooses `Other`, allow a custom country name and generate a safe folder token from it.

Example:

```json
{
  "countryDisplay": "United Arab Emirates",
  "countryFolderToken": "United-Arab-Emirates"
}
```

---

### 9.2.4 Local time rule

Folder names use local creation time, not UTC.

However, page info files must store both local time and UTC time.

Required fields:

```text
created local time
created UTC time
created timezone
created country display name
created country folder token
country source
```

Example:

```json
{
  "createdLocal": "2026-05-31 14:35:22",
  "createdUtc": "2026-05-31T06:35:22Z",
  "createdTimezone": "Asia/Kuala_Lumpur",
  "createdCountryDisplay": "Malaysia",
  "createdCountryFolderToken": "Malaysia",
  "countrySource": "user-selected-session-country"
}
```

This prevents confusion when the same vault is used in different countries.

---

### 9.2.5 Stable ID rule

Every page must have a full internal ID.

Example:

```text
page_018fa9d2_8f3a_7b21_9c2f_9942a1ef0012
```

The folder name should use only a short readable page ID.

Example:

```text
pg_8f3a2c
```

The full internal page ID must be stored in page info files.

Required files:

```text
00_Page Info/
  page-info [do not edit - app generated].json
  id-map [readable summary].txt
```

Example `id-map [readable summary].txt`:

```text
Page Identity Map
=================

Page Title: Nerves
Page Type: Note
Short Page ID: pg_8f3a2c
Full Internal Page ID: page_018fa9d2_8f3a_7b21_9c2f_9942a1ef0012
Current Folder Name: Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c
Created Local Time: 2026-05-31 14:35:22
Created UTC Time: 2026-05-31T06:35:22Z
Created Timezone: Asia/Kuala_Lumpur
Created Country: Malaysia
Country Source: user-selected-session-country

Note:
This file explains how Mizaan’s internal ID maps to the visible folder.
Editing this file does not change the app.
```

---

### 9.2.6 Folder rename rule

The folder name may change when the page title changes.

If the user renames a page, Mizaan should rename the visible folder to match the new page title.

Example before rename:

```text
Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c/
```

Example after rename:

```text
Cranial Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c/
```

Rules:

```text
The short page ID must remain the same.
The full internal page ID must remain the same.
The creation date must remain the same.
The creation time must remain the same.
The creation country must remain the same.
Only the title portion of the folder name should change.
```

Do not change the creation country just because the page is later edited in another country.

---

### 9.2.7 Rename failure handling

If folder rename fails because of permissions, file locks, USB removal, invalid characters, path length, or filesystem error, Mizaan must:

```text
keep the old folder
update the page title in SQLite only if safe
mark folder rename as pending
show repair warning
record failed rename in logs
allow retry
never lose page content
never create a duplicate page accidentally
```

Required user message:

```text
Page title was updated, but Mizaan could not rename the folder.
Your data is safe.
You can retry folder repair from Vault Health.
```

---

### 9.2.8 Old folder name history

Old folder names must be recorded.

Store rename history in:

```text
00_Page Info/
  rename-history [do not edit - app generated].json
  rename-history [readable summary].txt
```

Example JSON:

```json
[
  {
    "eventId": "rename_20260601_101233_4ab2",
    "changedAtLocal": "2026-06-01 10:12:33",
    "changedAtUtc": "2026-06-01T02:12:33Z",
    "timezone": "Asia/Kuala_Lumpur",
    "countryDisplay": "Malaysia",
    "countryFolderToken": "Malaysia",
    "countrySource": "user-selected-session-country",
    "oldTitle": "Nerves",
    "newTitle": "Cranial Nerves",
    "oldFolderName": "Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c",
    "newFolderName": "Cranial Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c",
    "pageId": "page_018fa9d2_8f3a_7b21_9c2f_9942a1ef0012",
    "shortPageId": "pg_8f3a2c",
    "reason": "User renamed page"
  }
]
```

Example readable summary:

```text
2026-06-01 10:12:33 Malaysia
Page renamed.
Old Title: Nerves
New Title: Cranial Nerves
Old Folder: Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c
New Folder: Cranial Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c
Page ID: page_018fa9d2_8f3a_7b21_9c2f_9942a1ef0012
Short Page ID: pg_8f3a2c
```

Rename history is only for page title and folder name changes.

Normal content edits belong in edit history.

---

### 9.2.9 Edit location logging rule

Mizaan must log where a page was edited at country level.

This matters because the same vault may be used while the user is in:

```text
Saudi Arabia
Malaysia
Egypt
Indonesia
Pakistan
Bangladesh
another country
```

Every meaningful edit event must record:

```text
local edit time
UTC edit time
timezone
country display name
country folder token
country source
device name
device ID
vault profile/user name
page ID
short page ID
page title
operation type
operation summary
```

Meaningful edit events include:

```text
page created
page title changed
page content edited
block added
block deleted
block moved
file imported
file moved into vault
file copied into vault
metadata correction accepted
document edited through helper window
image cropped
image annotated
video thumbnail generated
backup created
restore performed
conflict resolved
page archived
page restored from trash
```

---

### 9.2.10 Edit history files

Each page must include edit history files.

Store them in:

```text
00_Page Info/
  edit-history [do not edit - app generated].json
  edit-history [readable summary].txt
```

Example JSON entry:

```json
{
  "eventId": "evt_20260601_101233_4ab2",
  "eventType": "page_content_edited",
  "pageId": "page_018fa9d2_8f3a_7b21_9c2f_9942a1ef0012",
  "shortPageId": "pg_8f3a2c",
  "pageTitle": "Cranial Nerves",
  "changedAtLocal": "2026-06-01 10:12:33",
  "changedAtUtc": "2026-06-01T02:12:33Z",
  "timezone": "Asia/Kuala_Lumpur",
  "countryDisplay": "Malaysia",
  "countryFolderToken": "Malaysia",
  "countrySource": "user-selected-session-country",
  "deviceId": "dev_mohammad_pc_001",
  "deviceName": "Mohammad-PC",
  "vaultProfileName": "Mohammad",
  "summary": "Edited page content",
  "details": {
    "blocksChanged": 2,
    "autosave": true
  }
}
```

Example readable summary:

```text
2026-06-01 10:12:33 Malaysia
Edited page content.
Page: Cranial Nerves
Device: Mohammad-PC
Autosave: yes
Blocks changed: 2
```

---

### 9.2.11 Country source rule

Mizaan must record how it knows the country.

Allowed country sources:

```text
user-selected-session-country
user-selected-vault-country
manual-edit-entry
timezone-inference
system-locale
unknown
```

Preferred order:

```text
1. user-selected-session-country
2. user-selected-vault-country
3. manual-edit-entry
4. timezone-inference
5. system-locale
6. unknown
```

Recommended behavior:

```text
Ask the user to choose the current country when creating/opening a vault if unknown.
Remember the last selected country for that vault/session.
Allow the user to change current country from Settings.
Use the selected country in folder names and logs.
Do not require internet.
Do not require GPS.
Do not silently track precise location.
Do not fake the country if uncertain.
```

Country selector:

```text
Malaysia
Saudi Arabia
Egypt
Indonesia
Pakistan
Bangladesh
Other
Unknown
```

If the user chooses `Other`, allow a custom country name.

---

### 9.2.12 Travel/session rule

If the user travels and opens the vault in another country, Mizaan must not rename old folders just because the current country changed.

Creation folder names keep the original creation country.

Edit logs record the country where the edit happened.

Example:

```text
Page created in Malaysia:
Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c

Later edited in Saudi Arabia:
edit-history records Saudi Arabia

Later edited in Egypt:
edit-history records Egypt
```

Do not change the original page folder country from Malaysia to Saudi Arabia or Egypt.

Only the title part of the folder name may change when the page title changes.

---

### 9.2.13 Privacy rule

Country-level edit logs are allowed.

Precise geolocation is not required.

Mizaan must not store GPS coordinates by default.

Mizaan must not store street address by default.

Mizaan must not require internet location lookup.

For now, store only:

```text
country display name
country folder token
timezone
local time
UTC time
country source
```

If future precise location support is added, it must be optional and clearly shown to the user.

---

### 9.2.14 Implementation requirements

Any AI or human implementing this must follow these rules:

```text
Use local creation time in folder names.
Include creation country in folder names.
Include short stable page ID in folder names.
Store full internal ID inside page info files.
Allow folder name to change when page title changes.
Record old folder names in rename history.
Record page edit country in edit logs.
Keep creation country stable.
Do not silently change folder country after travel.
Do not use folder name as the real database identity.
Do not change the internal page ID after rename.
Do not store precise geolocation by default.
Do not require internet for country detection.
Do not fake location if unknown.
Use Unknown if country cannot be determined or selected.
```

Done criteria:

```text
Creating a page creates a folder using the canonical format.
Folder name includes local time, country token, and short page ID.
Full page ID is stored in page info files.
Renaming a page changes only the title portion of the folder name.
Old folder name is recorded in rename history.
Editing a page in a different country records that country in edit history.
Creation country in the folder name does not change after travel.
No exact location/GPS is stored by default.
No internet is required for country selection/detection.
```

### 9.3 Page Markdown Filename

Markdown files must be named after the page type, not the page title.

The page title already appears in the folder name. The Markdown filename should remain stable even if the page title changes.

Correct examples:

```text
note.md
project.md
document.md
person.md
finance.md
task.md
goal.md
tracker.md
database.md
calendar-event.md
canvas.md
template.md
media.md
journal.md
daily-note.md
reference.md
```

Example:

```text
Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c/
  note.md
```

If the user renames the page from `Nerves` to `Cranial Nerves`, Mizaan may rename the folder:

```text
Cranial Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c/
  note.md
```

The Markdown filename remains `note.md`.

Rules:

```text
Do not name the Markdown file after the page title.
Do not rename the Markdown file every time the page title changes.
Use the page type for the Markdown filename.
Use stable internal IDs in page info files, not the Markdown filename.
```

If a page type changes later, Mizaan must decide whether to rename the Markdown file through a safe migration flow. That migration must update page info, history files, mirrors, and indexes.

---

### 9.4 Page Folder Base Structure

Every page folder must follow a predictable structure.

Canonical structure:

```text
PageTitle_YYYY-MM-DD_HHMMSS_Country_pg_SHORTID/
  note.md OR document.md OR project.md OR relevant-page-type.md
  page.json

  00_Page Info/
    page-info [do not edit - app generated].json
    page-identity-map [readable summary].txt
    page-name-history [do not edit - app generated].json
    page-folder-history [do not edit - app generated].json
    import-history [do not edit - app generated].json
    edit-history [do not edit - app generated].json
    page-metadata-source (App detected from file-exif-system) [do not edit].json
    page-metadata-editable (User corrections) [safe to edit].json
    page-metadata-resolved (Final value Mizaan uses) [do not edit].json
    correction-history [do not edit].json

  01_Content Media/
    001_Image/
    002_Video/
    003_Audio/

  02_Attached Files/
    PDFs/
    Documents/
    Presentations/
    Spreadsheets/
    Text Files/
    Other/

  03_Edits and Versions/
    Media Edits/
    Document Versions/
    Block Versions/
    Page Snapshots/

  04_Exports/

  05_Graph and Relations/
    relations [do not edit - app generated].json
    adjacency [do not edit - app generated].json
    backlinks [do not edit - app generated].json
    outgoing-links [do not edit - app generated].json
    graph-readable-summary [readable summary].txt
    manual-graph-data [user-created, app-managed].json

  06_Search and Index Notes/
    page-search-summary [do not edit - app generated].json
    extracted-text [do not edit - app generated].txt

  Subpages/
```

Rules:

```text
The Markdown file is the human-readable content mirror.
page.json is the structured recovery mirror.
00_Page Info stores identity, metadata, history, and correction files.
01_Content Media stores media displayed inside the page content.
02_Attached Files stores documents and files attached to the page.
03_Edits and Versions stores recoverable edits, versions, and snapshots.
04_Exports stores user-generated exports from this page.
05_Graph and Relations stores readable graph/relation recovery files.
06_Search and Index Notes stores generated search/extracted-text support files.
Subpages stores child page folders by default.
```

File extension rules:

```text
Use .json for structured app-readable files.
Use .txt for readable human summaries or extracted plain text.
Use .md for page content mirrors.
Do not store structured app data only in .txt.
Do not rely on folder names as the database identity.
```

The folder structure must remain understandable outside Mizaan, but normal users should not need to edit these files manually.

---

### 9.5 Subpages

Subpages are folders inside the parent page folder by default.

The main page has its main folder. Child pages live inside the parent page’s `Subpages/` folder unless the user moves them elsewhere.

Subpage folders must follow the same naming rules and base folder structure as main pages.

Example:

```text
Medical Exam Prep_2026-05-31_143522_Malaysia_pg_a1b2c3/
  project.md
  page.json

  00_Page Info/
  01_Content Media/
  02_Attached Files/
  03_Edits and Versions/
  04_Exports/
  05_Graph and Relations/
  06_Search and Index Notes/

  Subpages/
    Anatomy Notes_2026-05-31_150000_Malaysia_pg_d4e5f6/
      note.md
      page.json
      00_Page Info/
      01_Content Media/
      02_Attached Files/
      03_Edits and Versions/
      04_Exports/
      05_Graph and Relations/
      06_Search and Index Notes/
      Subpages/

    Physiology Study Plan_2026-05-31_151000_Malaysia_pg_g7h8i9/
      project.md
      page.json
      00_Page Info/
      01_Content Media/
      02_Attached Files/
      03_Edits and Versions/
      04_Exports/
      05_Graph and Relations/
      06_Search and Index Notes/
      Subpages/
```

Rules:

```text
Subpages are real pages.
Subpages must have stable internal page IDs.
Subpages must have their own page folders.
Subpages must have their own Markdown and JSON mirrors.
Subpages must have their own page info, history, metadata, graph, and search files.
The database must store parent-child relationships by stable IDs.
The folder nesting is a human-readable mirror of the parent-child relationship.
```

If the user moves a subpage elsewhere, Mizaan must update:

```text
parent-child relationship
folder path
page info files
folder history
breadcrumbs
graph relations
search index
old location references
```

Moving a subpage must not change the subpage’s internal page ID.

If folder movement fails, Mizaan must:

```text
keep the existing folder safe
mark move as pending
show repair warning
record failure in logs
allow retry from Vault Health
never create duplicate pages accidentally
```

Calendar warning:

```text
Calendar is a module, not a normal page by default.
Calendar events may be page-like records and should use calendar-event.md.
A study calendar page may exist as a planning page if created by a template, but it must not replace the Calendar module.
```

## 10. ID Translation and Human-Readable Mapping

Mizaan must use stable internal IDs while exposing human-readable mapping files.

Folder names, page titles, file names, and visible labels are for humans.

Internal IDs are for Mizaan.

Visible names may change. Internal IDs must remain stable.

Core rule:

```text
Human-readable names help the user.
Stable IDs protect the app.
Both must exist.
```

---

### 10.1 Internal IDs

Every important object must have a stable internal ID.

Required stable IDs include:

```text
vault ID
device ID
user profile ID
session ID
page ID
block ID
file ID
attachment ID
file version ID
relation ID
tag ID
property definition ID
template ID
template version ID
database ID
database view ID
database row ID
calendar event ID
task ID
goal ID
tracker ID
tracker check-in ID
finance record ID
finance account ID
person ID
graph node ID
graph edge ID
manual graph ID
backup ID
backup item ID
snapshot ID
revision ID
trash item ID
import event ID
edit event ID
conflict ID
migration ID
repair event ID
search index item ID
log event ID
```

Rules:

```text
IDs must not change when titles change.
IDs must not change when folders are renamed.
IDs must not change when a page is moved.
IDs must not change when a file display name changes.
IDs must not be derived only from visible names.
IDs must be unique inside the vault.
IDs must be stored in SQLite and mirrored into readable files where useful.
```

Recommended ID style:

```text
page_018fa9d2_8f3a_7b21_9c2f_9942a1ef0012
file_018fa9d3_90aa_42b1_a8d1_443fa1e09012
block_018fa9d4_11cf_4f21_88a0_7d917a2c9910
```

Short IDs may be used in folder names:

```text
pg_8f3a2c
file_91b8aa
blk_71a902
```

The short ID is for readability only. The full internal ID is authoritative.

---

### 10.2 Viewable ID Map

Every page folder must include a readable identity map.

Required file:

```text
00_Page Info/
  page-identity-map [readable summary].txt
```

This file explains how Mizaan’s internal IDs match the visible page folder.

It is explanatory only.

Editing this file must not change the app.

Example:

```text
Page Identity Map
=================

Human Title: Nerves
Current Folder: Nerves_2026-05-31_143522_Malaysia_pg_8f3a2c
Page Type: note
Short Page ID: pg_8f3a2c
Full Page ID: page_018fa9d2_8f3a_7b21_9c2f_9942a1ef0012
Vault ID: vault_20260531_mohammad_7ac91d
User/Vault Profile: Mohammad
Created Local Time: 2026-05-31 14:35:22
Created UTC Time: 2026-05-31T06:35:22Z
Created Timezone: Asia/Kuala_Lumpur
Created Country: Malaysia
Country Source: user-selected-session-country

Current Title History:
See page-name-history [do not edit - app generated].json

Current Folder History:
See page-folder-history [do not edit - app generated].json

Note:
This file explains how Mizaan's internal IDs match the visible folder.
Editing this file does not change Mizaan.
```

Rules:

```text
Do not use this file as the source of truth.
Do not parse user edits to this file as app updates.
Regenerate this file from SQLite/page metadata when safe.
If this file is edited externally, preserve it and show conflict/repair if needed.
```

---

## 11. Storage Architecture

Mizaan must use a layered storage architecture.

The UI must never directly control storage.

Canonical layers:

```text
React/TanStack UI
  ↓
Workspace/page/module services
  ↓
VaultProvider interface
  ↓
Tauri command boundary
  ↓
SQLite provider + filesystem provider
  ↓
Mizaan Vault folder
```

---

### 11.1 Layer Responsibilities

#### React/TanStack UI

Responsible for:

```text
screens
routes
components
forms
buttons
menus
workspace view
editor UI
dialogs
status indicators
```

Not responsible for:

```text
direct SQLite access
direct filesystem writes
direct Tauri command calls
direct localStorage persistence
vault repair logic
backup logic
migration logic
```

#### Workspace/page/module services

Responsible for:

```text
page behavior
block behavior
file behavior
template behavior
search behavior
graph behavior
calendar behavior
task behavior
finance behavior
people behavior
backup/restore behavior
repair behavior
```

Examples:

```text
PageService
BlockService
FileService
TemplateService
GraphService
SearchService
CalendarService
TaskService
TrackerService
GoalService
FinanceService
PeopleService
BackupService
RestoreService
RepairService
```

#### VaultProvider interface

Responsible for exposing safe storage operations.

The UI and services talk to the provider interface.

The provider hides whether data is coming from:

```text
localStorage prototype
SQLite desktop provider
read-only recovery provider
test provider
future import/recovery provider
```

#### Tauri command boundary

Responsible for controlled native operations:

```text
folder picker
file copy/move
atomic writes
SQLite access
helper runtime launch
preview generation
file watching
checksum calculation
backup compression
restore extraction
health checks
```

#### SQLite provider + filesystem provider

Responsible for:

```text
runtime database writes
human-readable folder writes
mirror generation
conflict detection
file import
file versioning
metadata files
logs
indexes
backup/restore operations
```

#### Mizaan Vault folder

Responsible for storing the user’s actual local data.

The vault folder must remain understandable outside Mizaan.

---

### 11.2 Provider Rule

UI must never talk directly to:

```text
localStorage
SQLite
filesystem
Tauri commands
helper runtimes
LibreOffice
VLC/libVLC
FFmpeg/FFprobe
```

UI must talk to services.

Services must talk to provider methods.

Provider methods must coordinate database and filesystem operations safely.

Correct flow:

```text
User action
→ UI component
→ service method
→ VaultProvider method
→ Tauri/native/storage implementation
→ SQLite/filesystem transaction
→ result returned to service
→ UI updates
```

Forbidden flow:

```text
UI component
→ direct localStorage write

UI component
→ direct SQLite write

UI component
→ direct filesystem write

UI component
→ direct Tauri command call
```

Exception:

Prototype/demo code may exist temporarily, but final implementation must not depend on it.

---

### 11.3 Provider Methods

Final `VaultProvider` must support the following capability groups.

The provider interface may be split internally into smaller provider modules. It must not become an unmaintainable God object.

Allowed internal grouping:

```text
vaultProvider.vault
vaultProvider.pages
vaultProvider.blocks
vaultProvider.files
vaultProvider.templates
vaultProvider.relations
vaultProvider.search
vaultProvider.graph
vaultProvider.backups
vaultProvider.repair
```

Required capabilities:

```text
createVault()
openVault()
closeVault()
signOff()
getVaultInfo()
getVaultHealth()
listRecentVaults()
checkLock()
forceUnlock()
openReadOnly()

createPage()
updatePage()
renamePage()
deletePage()
trashPage()
restorePage()
archivePage()
duplicatePage()
movePage()
listPages()
getPage()

listBlocks()
createBlock()
updateBlock()
deleteBlock()
moveBlock()
replaceBlocks()
convertBlock()

createRelation()
updateRelation()
deleteRelation()
listRelations()
rebuildRelations()

importFileToPage()
moveFileToPage()
copyFileToPage()
importFolder()
scanInbox()
repairMissingFile()
replaceFile()
createFileVersion()

createTemplate()
updateTemplate()
hideBuiltInTemplate()
deleteUserTemplate()
duplicateTemplate()
createFromTemplate()

createBackup()
validateBackup()
restoreBackup()
previewRestore()
createPreMigrationBackup()

rebuildSearchIndex()
rebuildGraphIndex()
rebuildBacklinks()
rebuildMirrors()
rebuildThumbnails()
checkHealth()
repairVault()

exportPage()
exportPageTree()
exportVault()
```

Each provider method must define:

```text
input
output
errors
side effects
SQLite changes
filesystem changes
mirror changes
log entries
backup/snapshot requirement
rollback behavior
repair behavior
```

---

### 11.4 Transaction and Failure Rule

Any operation that touches both SQLite and the filesystem must be designed as a recoverable operation.

Example: `createPage()` must coordinate:

```text
SQLite page row
page folder creation
Markdown mirror
page.json mirror
page info files
initial edit history
initial graph/relation files
search placeholder
log entry
```

If part of the operation fails, Mizaan must not leave an invisible broken state.

Allowed outcomes:

```text
operation fully succeeds
operation fully rolls back
operation enters visible pending-repair state
```

Forbidden outcome:

```text
SQLite says page exists but folder is missing and user is not warned.
Folder exists but SQLite does not know it and user is not warned.
Page appears in UI but cannot be recovered from readable files.
```

---

## 12. SQLite Database Schema

SQLite is required for the real Windows desktop vault.

SQLite is the runtime source of truth while Mizaan is running.

Readable files remain the lifetime/recovery layer.

This section defines the required schema surface. Actual migrations must define exact SQL, primary keys, foreign keys, indexes, unique constraints, nullable fields, delete behavior, and migration logic.

---

### 12.1 Core Tables

Required core tables:

```text
vault_info
user_profiles
device_registry
sessions
vault_locks

pages
page_folders
page_mirrors
blocks
block_order
properties
property_definitions
tags
page_tags

files
file_versions
file_placements
file_imports
file_edit_history
attachments

metadata_sources
metadata_editables
metadata_resolved
metadata_corrections

relations
page_links
unresolved_links
backlinks_cache

graph_nodes
graph_edges
graph_layouts
manual_graphs
manual_graph_nodes
manual_graph_edges

templates
template_versions

databases
database_views
database_rows
database_properties

calendar_events
calendar_recurrence_rules
calendar_exceptions

tasks
task_dependencies

trackers
tracker_checkins

goals
goal_milestones

finance_records
finance_accounts
finance_categories
budgets
subscriptions
bills

people
people_events

revisions
snapshots
trash

backups
backup_items
restore_points
restore_reports

settings
themes
runtime_helpers
helper_health_checks

search_index
search_documents

logs
conflicts
external_edit_detection

migration_history
repair_history
health_checks
integrity_checks

inbox_items
exports
```

A table only counts as implemented if it has real persistence behavior, not just a placeholder type.

---

### 12.2 Schema Rules

All major tables must include:

```text
id
created_at_utc
updated_at_utc
metadata_json where flexible extension is needed
```

Frequently queried fields must be normal columns.

Flexible or future-compatible extra data may live in `metadata_json`.

Do not hide core fields only inside `metadata_json`.

Core fields such as title, type, status, folder path, timestamps, parent ID, privacy state, and checksum must be normal columns.

Use soft delete for user data where appropriate.

Hard delete must be reserved for permanent delete flows with confirmation and backup/snapshot requirements.

---

### 12.3 Required Page Fields

The `pages` table must include at minimum:

```text
id
short_id
type
title
folder_name
folder_path
markdown_filename
icon
cover
summary
status

created_at_local
created_at_utc
created_timezone
created_country_display
created_country_folder_token
created_country_source

updated_at_local
updated_at_utc
updated_timezone
updated_country_display
updated_country_source

archived_at
deleted_at
pinned
favorite
private
parent_id
template_id
metadata_json
version
device_id
```

Rules:

```text
id is the stable internal page ID.
short_id is used in folder names.
folder_name is human-readable and may change.
folder_path is the current vault-relative path.
parent_id stores the parent page relation if the page is a subpage.
created country does not change after page creation.
updated country records where the latest meaningful edit happened.
```

---

### 12.4 Required Block Fields

The `blocks` table must include at minimum:

```text
id
page_id
parent_block_id
type
content
content_json
plain_text
order_index
checked
collapsed
metadata_json
version
created_at_local
created_at_utc
updated_at_local
updated_at_utc
deleted_at
```

Rules:

```text
content may store simple text.
content_json stores structured block content where needed.
plain_text supports search and recovery.
order_index controls block order.
parent_block_id supports nested blocks/toggles later.
deleted_at supports recovery/undo where appropriate.
```

---

### 12.5 Required File Fields

The `files` table must include at minimum:

```text
id
page_id
block_id
original_name
stored_name
file_role
file_kind
mime_type
extension
size_bytes
checksum_sha256
current_checksum_sha256
original_source_path
vault_relative_path
original_file_id
active_file_version_id
current_display_version_id
created_at_local
created_at_utc
imported_at_local
imported_at_utc
last_modified_at_local
last_modified_at_utc
last_modified_timezone
last_modified_country_display
last_seen_at
missing
metadata_source_id
metadata_editable_id
metadata_resolved_id
info_file_path
placement_file_path
metadata_json
```

Rules:

```text
original_name preserves the imported filename.
stored_name is the safe filename inside the vault if different.
original_source_path records where the file came from, if available.
vault_relative_path points to the file inside the vault.
checksum_sha256 records the first imported checksum.
current_checksum_sha256 records the current working file checksum.
active_file_version_id points to the active file version.
current_display_version_id points to the file version shown in the page block.
missing indicates the file cannot currently be found.
```

---

### 12.6 Required Relation Fields

The `relations` table must include at minimum:

```text
id
source_id
target_id
source_type
target_type
relation_type
label
direction
style
created_at_utc
updated_at_utc
metadata_json
```

Rules:

```text
source_id and target_id may refer to pages, files, blocks, people, tasks, events, or other supported object types.
direction may be undirected, source_to_target, target_to_source, or bidirectional.
style supports graph display and manual relation meaning.
relation_type defines semantic meaning.
```

---

### 12.7 Index Requirements

The database must include indexes for common queries.

Required indexes include:

```text
pages.title
pages.type
pages.parent_id
pages.updated_at_utc
pages.deleted_at
pages.archived_at
pages.private

blocks.page_id
blocks.order_index
blocks.parent_block_id
blocks.plain_text

files.page_id
files.block_id
files.checksum_sha256
files.current_checksum_sha256
files.missing
files.vault_relative_path

relations.source_id
relations.target_id
relations.relation_type

page_links.source_page_id
page_links.target_page_id
unresolved_links.target_title

tasks.due_at
tasks.status
tasks.priority

calendar_events.start_at_utc
calendar_events.end_at_utc

search_index.object_id
search_index.object_type

graph_edges.source_id
graph_edges.target_id
```

Exact SQL index names can be decided during implementation, but the query needs must be covered.

---

### 12.8 Migration Rule

Every schema change must have a migration.

Migration records must include:

```text
migration ID
previous schema version
new schema version
started_at
completed_at
status
backup created
errors
rollback available
```

Before any destructive or structural migration, Mizaan must create a pre-migration backup.

If migration fails, Mizaan must not corrupt the vault.

Allowed outcomes:

```text
migration succeeds
migration rolls back
migration stops and opens read-only repair mode
```

---

### 12.9 Schema Done Criteria

The SQLite schema is not done until:

```text
tables exist
primary keys exist
foreign keys are defined where appropriate
indexes exist for common queries
migrations exist
schema version is stored
health check validates the schema
backup includes the database
restore validates the database
readable mirrors can be rebuilt from the database
database can be partly rebuilt from readable mirrors
tests cover create/read/update/delete for pages, blocks, files, relations, backups, and recovery-critical tables
```

## 13. Human-Readable Mirrors

Human-readable mirrors are required.

SQLite is the runtime source of truth while Mizaan is running. Human-readable mirrors are the lifetime, recovery, inspection, export, and portability layer.

Mirrors must make the vault understandable outside Mizaan.

Core rule:

```text
SQLite runs the app.
Readable mirrors preserve the user’s data outside the app.
```

---

### 13.1 Mirror Types

Mizaan must write multiple readable and structured mirror layers.

Use this rule:

```text
.md = human-readable page content
.json = structured app-readable recovery data
.txt = human-readable summaries, extracted text, logs, and plain explanations
```

Required mirror types:

```text
page Markdown file
page JSON mirror
page info JSON files
page readable identity map text file
metadata source JSON file
metadata editable JSON file
metadata resolved JSON file
correction history JSON file
placement JSON file
relations JSON file
adjacency JSON file
backlinks JSON file
outgoing links JSON file
graph readable summary text file
version history JSON file
import history JSON file
edit history JSON file
backup manifest JSON file
logs text files
extracted text files
search summary JSON/text files
```

Structured files must use `.json` when Mizaan needs to parse, compare, validate, recover, rebuild, or reconcile the data.

Readable `.txt` files may exist as human summaries, but they must not be the only copy of structured recovery-critical data.

---

### 13.2 Required Mirror Files Per Page

Every page folder must contain at minimum:

```text
page-type.md
page.json

00_Page Info/
  page-info [do not edit - app generated].json
  page-identity-map [readable summary].txt
  page-name-history [do not edit - app generated].json
  page-folder-history [do not edit - app generated].json
  import-history [do not edit - app generated].json
  edit-history [do not edit - app generated].json
  page-metadata-source (App detected from file-exif-system) [do not edit].json
  page-metadata-editable (User corrections) [safe to edit].json
  page-metadata-resolved (Final value Mizaan uses) [do not edit].json
  correction-history [do not edit].json

05_Graph and Relations/
  relations [do not edit - app generated].json
  adjacency [do not edit - app generated].json
  backlinks [do not edit - app generated].json
  outgoing-links [do not edit - app generated].json
  graph-readable-summary [readable summary].txt

06_Search and Index Notes/
  page-search-summary [do not edit - app generated].json
  extracted-text [do not edit - app generated].txt
```

The exact page Markdown filename depends on page type:

```text
note.md
project.md
document.md
person.md
finance.md
task.md
goal.md
tracker.md
database.md
calendar-event.md
canvas.md
template.md
```

---

### 13.3 Mirror Generation Rules

Mirrors are generated after save debounce.

Autosave must write in this order:

```text
1. Validate change.
2. Write to SQLite through a safe transaction.
3. Commit SQLite transaction.
4. Queue mirror update.
5. Write mirrors atomically using temp-file-then-rename where possible.
6. Update mirror checksum/modified tracking.
7. Record success or failure.
8. Show failure in Vault Health if mirror generation fails.
```

Autosave must not pretend mirrors are healthy if mirror generation failed.

If SQLite save succeeds but mirror generation fails, the page can remain saved in the app, but Vault Health must show the mirror problem.

Example user-facing status:

```text
Page saved.
Readable mirror update failed.
Your content is safe in Mizaan, but recovery files need repair.
```

---

### 13.4 Mirror Failure Rules

Mirror failures must be visible in:

```text
page status
Vault Health
repair tools
logs
```

Mirror failure types include:

```text
missing mirror file
malformed mirror JSON
permission denied
file locked
path too long
disk full
USB/external drive disconnected
checksum mismatch
external edit conflict
atomic write failure
```

If a mirror is deleted but SQLite is healthy, Mizaan may regenerate it.

Before regenerating many mirrors, Mizaan should show a repair summary.

If a mirror was edited outside Mizaan, Mizaan must not silently overwrite it.

---

### 13.5 External Mirror Edit Rule

If the user edits mirror files outside Mizaan, Mizaan must detect this later.

Detection should compare:

```text
last known checksum
last known modified time
last generated SQLite revision
current file checksum
current file modified time
```

Possible states:

```text
clean
SQLite newer
mirror newer
both changed
mirror missing
mirror malformed
mirror externally edited
unknown
```

If a user-edited mirror differs from SQLite, Mizaan must show a conflict/reconciliation screen.

Mizaan must never silently overwrite user-written mirror files.

---

### 13.6 Damaged SQLite Recovery Rule

If SQLite is damaged, Mizaan should be able to partially recover from mirrors.

Recovery sources include:

```text
page Markdown files
page.json files
page info JSON files
metadata files
placement files
relations files
graph adjacency files
import history
edit history
version history
backup manifests
logs
```

Recovery may not recreate every temporary cache or UI state.

However, it must attempt to recover meaningful user-owned data:

```text
page titles
page types
content
properties
files
media placements
relations
subpages
metadata
corrections
edit history
versions
backups
```

Mizaan must not destroy readable mirrors while recovering from damaged SQLite.

---

### 13.7 Markdown Rule

Markdown mirrors must remain useful outside Mizaan.

Markdown must use relative paths.

Example:

```markdown
# Nerves

## Cranial Nerves

![Cranial nerves](01_Content%20Media/001_Image/cranial-nerves.png)

[PDF: cranial-nerve-notes.pdf](02_Attached%20Files/PDFs/001_PDF/cranial-nerve-notes.pdf)
```

Rules:

```text
Use relative paths.
Do not use absolute Windows-only paths in Markdown.
Do not require Mizaan to open linked files.
Keep Markdown readable in normal Markdown editors.
Keep media/file links understandable.
Keep page content meaningful even if some app-specific metadata is missing.
```

Because folder names may contain spaces, Markdown links must be generated safely.

Mizaan may either:

```text
URL-encode spaces as %20
or use Markdown-compatible relative paths that the target Markdown viewer supports
```

The chosen approach must be consistent.

---

### 13.8 Backup Manifest Rule

Every backup must include a structured manifest.

Required file:

```text
backup-manifest.json
```

The backup manifest must include:

```text
backup ID
vault ID
created local time
created UTC time
timezone
country
Mizaan version
schema version
included sections
page count
file count
total size
checksum summary
backup type
backup status
errors if any
restore compatibility
```

Backup manifests are required for restore preview, validation, and repair.

---

### 13.9 Logs Rule

Logs may be plain text for readability, but log events should also be stored in SQLite while the app is healthy.

Logs should include:

```text
timestamp
timezone
country
device
vault profile
operation type
page/file affected
result
error message if any
```

Logs must be visible in the vault folder.

Example:

```text
01_System/
  07_Logs/
    app-log.txt
    file-operation-log.txt
    edit-log.txt
    backup-log.txt
    restore-log.txt
    error-log.txt
```

Logs are personal local records. They may include filenames and page titles.

---

### 13.10 Mirror Done Criteria

Human-readable mirrors are not done until:

```text
Pages generate Markdown and JSON mirrors.
Page info files are generated.
Metadata files are generated.
Placement files are generated.
Relation/graph files are generated.
Version/history files are generated.
Backups include manifests.
Markdown uses relative paths.
Mirror generation is atomic where possible.
Mirror failures appear in Vault Health.
Deleted mirrors can be regenerated from SQLite.
External mirror edits are detected.
Malformed JSON mirrors are reported.
SQLite can be partially rebuilt from mirrors.
Tests cover mirror generation, regeneration, external edit detection, malformed file handling, and recovery.
```

---

## 14. Metadata Correction System

The metadata correction system is canonical.

Mizaan must preserve detected metadata, user correction metadata, resolved metadata, and correction history separately.

Core rule:

```text
Detected metadata is not automatically user-corrected metadata.
User-corrected metadata is not automatically accepted metadata.
Resolved metadata is the value Mizaan actually uses.
Correction history records how that decision happened.
```

---

### 14.1 Required Metadata Files for Pages

Every page must include:

```text
00_Page Info/
  page-metadata-source (App detected from file-exif-system) [do not edit].json
  page-metadata-editable (User corrections) [safe to edit].json
  page-metadata-resolved (Final value Mizaan uses) [do not edit].json
  correction-history [do not edit].json
```

Optional readable summaries may be added later, but the structured files must be JSON.

---

### 14.2 Required Metadata Files for Files and Media

Every imported, pasted, generated, edited, or versioned file must include metadata records.

Required files:

```text
metadata-source (App detected from file-exif-system) [do not edit].json
metadata-editable (User corrections) [safe to edit].json
metadata-resolved (Final value Mizaan uses) [do not edit].json
correction-history [do not edit].json
```

This applies to:

```text
original imported files
pasted files
generated screenshots
edited images
edited videos
edited audio
generated previews
generated thumbnails
Office documents
PDFs
text files
CSV files
unknown files
file versions
exports where metadata matters
```

Each generated or edited file must also record what it was derived from.

Example:

```json
{
  "fileId": "file_018fa9d3_90aa_42b1_a8d1_443fa1e09012",
  "derivedFromFileId": "file_018fa9d1_8821_4ad1_a88d_7700ac330001",
  "operation": "crop",
  "createdBy": "Mizaan image editor",
  "createdAtUtc": "2026-06-01T02:12:33Z"
}
```

---

### 14.3 Meaning of Metadata Files

#### metadata-source

`metadata-source` contains what Mizaan detected automatically.

Sources may include:

```text
file EXIF
filesystem metadata
document properties
PDF metadata
Office document metadata
media metadata
image metadata
FFprobe output
user import context
Mizaan-created app data
```

The user should not edit this file.

#### metadata-editable

`metadata-editable` is the safe user correction file.

It is JSON.

The user may edit it manually if needed.

Editing it does not corrupt the original file.

Editing it does not automatically change the metadata Mizaan uses.

It creates a correction proposal.

#### metadata-resolved

`metadata-resolved` contains the final accepted metadata Mizaan actually uses.

It is generated by Mizaan.

The user should not edit it manually.

#### correction-history

`correction-history` records every correction event.

It must include:

```text
correction event ID
field name
source value
proposed value
resolved value
decision
decision time
timezone
country
device ID
device name
vault profile
review method
reason if provided
```

Possible decisions:

```text
accepted
rejected
edited-before-accepting
restored-from-source
restored-from-last-valid
regenerated
invalid-json
pending-review
```

---

### 14.4 Metadata Correction UI

Mizaan must include an in-app metadata correction UI.

The user should not need to edit JSON manually.

Manual JSON editing remains a power-user fallback.

The correction UI must show:

```text
field name
source value
editable/proposed value
current resolved value
field type
confidence if available
accept
reject
edit
restore source value
restore last valid value
apply all safe corrections
reject all
open correction file
regenerate editable metadata
view correction history
```

The UI must explain the model in simple language:

```text
Detected = what Mizaan found.
Your correction = what you changed.
Used by Mizaan = the final value Mizaan accepts.
```

---

### 14.5 Correction Review Rule

If `metadata-editable` differs from `metadata-source` or `metadata-resolved`, Mizaan must show the correction in the metadata correction UI.

Mizaan must not silently accept user-edited metadata.

Mizaan must not silently overwrite user-edited metadata.

Mizaan must not treat malformed JSON as valid correction data.

Mizaan must record all correction decisions in `correction-history`.

---

### 14.6 Malformed Correction File

If `metadata-editable [user corrections] [safe to edit].json` is invalid:

1. Do not apply it.
2. Preserve the malformed file.
3. Show repair warning.
4. Show the exact file path.
5. Explain the JSON issue in simple language.
6. Offer “Open correction file.”
7. Offer “Restore from last valid correction.”
8. Offer “Regenerate editable metadata from resolved metadata.”
9. Log the issue.
10. Record the issue in correction history.
11. Keep using the last valid resolved metadata until the issue is fixed.

User-facing message:

```text
The metadata correction file has invalid JSON.
Mizaan did not apply it.
Your file is safe.
You can repair the correction file or regenerate it from the last accepted metadata.
```

---

### 14.7 Metadata Repair Actions

Mizaan must support these repair actions:

```text
open correction file
show JSON error
restore last valid correction
regenerate editable metadata from resolved metadata
regenerate editable metadata from source metadata
accept resolved metadata and clear correction proposal
create backup copy of malformed correction file
mark correction as ignored
retry validation
```

If Mizaan regenerates a correction file, it must preserve the malformed file as a backup.

Example:

```text
metadata-editable [user corrections] [safe to edit].invalid-2026-06-01-101233.json
```

---

### 14.8 Implementation Timing

Metadata files are required in the final design.

However, full correction review workflow should come after base file import is stable.

Implementation order:

```text
1. Generate metadata-source, metadata-editable, metadata-resolved, and correction-history files.
2. Store metadata records in SQLite.
3. Validate metadata-editable JSON.
4. Show malformed JSON warnings.
5. Add basic metadata display UI.
6. Add full metadata correction review UI.
7. Add batch correction/review tools.
8. Add advanced metadata conflict handling.
```

Base file import must come first because metadata correction depends on real imported files.

---

### 14.9 Metadata Done Criteria

The metadata correction system is not done until:

```text
Every page has required metadata files.
Every imported file has required metadata files.
Every edited/generated/versioned file has required metadata files where relevant.
Metadata files use JSON for structured data.
Metadata is also stored in SQLite.
metadata-editable can be safely edited manually.
Manual edits are detected.
Manual edits are not silently accepted.
Malformed JSON is detected.
Malformed JSON is preserved.
Repair actions exist.
Correction UI exists.
Correction history records decisions.
Vault Health reports metadata issues.
Tests cover valid correction, invalid correction, accept, reject, regenerate, and restore-last-valid flows.
```

## 15. File Import Flow

### 15.1 What “import flow” means

Import flow means the exact steps Mizaan follows when the user adds a file or folder.

It answers:

- where the file came from
- whether to copy or move
- where to store it
- how to name it
- how to detect duplicates
- how to create metadata
- how to show it in the page
- how to repair it later

### 15.2 File from PC into a page

When a user drags/selects a file while a page is open, show:

```text
Add this file to the page?

[Copy into page folder]
[Move into page folder]
[Cancel]
```

Rules:

- Ask every time.
- No external linking.
- Copy keeps original source file where it is.
- Move transfers the source file into Mizaan after safe verification.
- Move does not “delete” casually; it is a filesystem move. The file leaves its original location only after Mizaan confirms the new vault copy is valid.
- Never silently move.
- Preserve original filename.
- Store safe path internally.
- Calculate checksum.
- Detect exact duplicates using checksum.
- Do not block storage just because preview fails.

### 15.3 Folder import

Folder import means importing a whole folder of files, not just one file.

Flow:

1. User selects folder.
2. Mizaan asks copy folder or move folder.
3. Mizaan scans file list.
4. Mizaan shows summary: number of files, total size, detected types.
5. Mizaan asks destination page or new page system.
6. Mizaan imports files in batches.
7. Each file gets its own subfolder.
8. Folder hierarchy is preserved in readable form when useful.
9. Import log records every file.
10. Failed files are skipped with clear errors, not silently lost.

### 15.4 File added without page

If the user drops/selects a file when no page is selected:

```text
02_Library/Inbox/
```

Then show:

```text
Where should this go?

[Create new page]
[Add to existing page]
[Keep in Inbox]
[Cancel]
```

### 15.5 Clipboard image/screenshot

If user pastes image/screenshot:

- no source file exists
- Mizaan saves it directly into current page folder
- saved image becomes Mizaan original
- create preview
- create placement file
- create image info
- create metadata files
- add image block at cursor location

### 15.6 Clipboard text

If user pastes text:

- create or update text block
- do not create a file unless user chooses “Save pasted text as file”

### 15.7 Unknown file type

Unknown files must still be stored safely.

- Store under `02_Attached Files/Other/`
- Create `file-info`
- Create metadata files
- Show no-preview state
- Allow open/reveal/export

### 15.8 Duplicate detection

Use SHA-256 checksum for exact duplicates.

If duplicate detected:

```text
This file already exists in this vault.

[Use existing file]
[Import another copy]
[Cancel]
```

Near-duplicate detection is required later, not phase zero.

---

## 16. File and Attachment Folder Rules

### 16.1 Every file gets its own folder

Each imported/pasted/generated/edited file should get its own folder or subfolder.

Example:

```text
01_Content Media/
  001_Image/
    cranial-nerves.png
    preview.webp
    placement [do not edit - reference only].txt
    image-info [do not edit - app generated].txt
    metadata-source (App detected from file-exif-system).txt
    metadata-editable [user corrections].json
    metadata-resolved [do not edit - app generated].txt
    correction-history [do not edit - app generated].txt
    Versions/
    Edits/
```

### 16.2 Numbered placement folders

Use numbered folders:

```text
001_Image
002_Video
003_PDF
004_Word Document
005_Excel
```

Do not use raw line numbers.

Reason:

- page lines change
- block order is more stable
- numbered file blocks remain readable

### 16.3 Embedded vs attached files

Embedded content:

- appears directly inside page content
- has a block
- must be shown in Markdown page file
- lives under `01_Content Media` if image/video/audio displayed in content

Attached file:

- belongs to page but may not appear visually inline
- must still be listed in Markdown page file under an attachments section
- lives under `02_Attached Files`

Both must be visible in the page file.

---

## 17. Naming Rules

### 17.1 Preserve original filename

Never erase the original filename.

Store it in:

- database
- info file
- metadata source
- import history

### 17.2 Stored filename

By default, preserve original filename inside the file folder.

If unsafe characters exist, create safe stored filename but keep original name in metadata.

Unsafe cases:

- Windows-invalid characters
- duplicate filename in same folder
- path too long
- reserved Windows names like `CON`, `PRN`, `AUX`
- leading/trailing dots or spaces

### 17.3 Mizaan naming rules

Mizaan naming rules do not mean automatically renaming all user files.

They mean:

- page folder names follow a safe pattern
- file folders follow placement order
- unsafe filenames are sanitized only when needed
- edited/exported versions get clear suffixes
- original filename remains recorded forever

Examples:

```text
Original file: cranial nerves?.png
Stored safe file: cranial nerves_.png
Original name field: cranial nerves?.png
```

Edited versions:

```text
cranial-nerves_crop_001.png
cranial-nerves_annotated_001.png
neck-dissection_trim_001.mp4
lecture-audio_extract_001.mp3
```

---

## 18. Document, Office, PDF, Text, and OCR Handling

Mizaan must treat documents as first-class vault objects.

The app must support safe storage first, preview second, editing third, indexing fourth, and OCR later.

Core rule:

```text
Never reject safe file storage just because preview, text extraction, Office conversion, or OCR fails.
```

Mizaan owns:

```text
vault placement
file record
metadata
checksum
preview files
snapshots
version history
edit history
search/index state
graph/file relations
backup/restore behavior
repair behavior
```

Helper engines only provide viewing, conversion, editing, extraction, or processing capability.

---

### 18.1 PDF Handling

PDFs must be previewed inside Mizaan.

PDF viewing is a Mizaan-native workflow.

Required PDF features:

```text
PDF preview inside Mizaan
page count
file metadata
checksum
file size
import date
vault-relative file path
open file
reveal in vault folder
export/copy out
text extraction when available
search within extracted text when available
linked notes/projects/people/tasks
repair missing file
version/history display
OCR later for scanned PDFs
```

PDF preview must not require internet.

PDF preview must not require LibreOffice.

If native PDF preview fails, Mizaan must still store the PDF safely and show a repair/retry message.

User-facing failure message:

```text
Mizaan stored your PDF safely, but could not generate or display the preview.
You can retry preview generation or reveal the file in the vault.
```

PDF editing is not required in the early implementation.

PDF annotation, page rearrangement, merge/split, compression, signing, and redaction may come later, but must not block the base PDF preview/import pipeline.

---

### 18.2 PDF Storage Layout

Example PDF folder:

```text
02_Attached Files/
  PDFs/
    001_PDF/
      cranial-nerve-notes.pdf
      preview.webp
      pdf-info [do not edit - app generated].json
      placement [do not edit - reference only].json
      metadata-source (App detected from file-exif-system) [do not edit].json
      metadata-editable (User corrections) [safe to edit].json
      metadata-resolved (Final value Mizaan uses) [do not edit].json
      correction-history [do not edit].json
      extracted-text [do not edit - app generated].txt
      edit-history [do not edit].json
      version-history [do not edit].json
```

If the PDF is scanned and no text is available, `extracted-text` may contain a clear placeholder:

```text
No embedded text was found. OCR is not available yet or has not been run.
```

---

### 18.3 Office File Handling

Office files include:

```text
.doc
.docx
.rtf
.ppt
.pptx
.xls
.xlsx
.odt
.odp
.ods
```

User expectation:

```text
Office files feel like they are handled by Mizaan.
```

Implementation reality:

```text
Mizaan uses a required bundled/managed LibreOffice-compatible engine for Office preview and editing workflows.
```

Mizaan must not claim it has built a full native Office editor unless it actually implements one.

Correct language:

```text
Preview in Mizaan
Edit in Mizaan-managed Office window
Powered by bundled Office engine
```

Forbidden language unless truly implemented:

```text
Fully native Mizaan Word editor
Fully native Mizaan Excel editor
Fully native Mizaan PowerPoint editor
```

---

### 18.4 Office Preview Workflow

Office files should be previewed inside Mizaan whenever possible.

Preview flow:

```text
User imports or opens Office file
→ Mizaan stores file in the page folder
→ Mizaan creates/updates file record in SQLite
→ Mizaan calculates checksum
→ Mizaan creates metadata files
→ Mizaan creates placement file if embedded/attached to a block
→ Mizaan runs LibreOffice-compatible helper in headless conversion mode
→ helper generates preview PDF where possible
→ Mizaan may generate preview images/webp from preview PDF
→ Mizaan stores preview files inside the file folder
→ Mizaan records preview generation result
→ Mizaan displays preview inside Mizaan
```

Preview generation must be best-effort.

If preview conversion fails:

```text
The Office file must remain stored safely.
The file record must remain valid.
The user must see a clear preview failure state.
The user must be allowed to retry preview generation.
The user must still be able to open/edit through the managed Office workflow if the helper can open the file.
```

User-facing failure message:

```text
Mizaan stored your Office document safely, but could not generate a preview.
You can retry preview generation or open it in the managed Office editor.
```

---

### 18.5 Office Storage Layout

Example Word document folder:

```text
02_Attached Files/
  Documents/
    001_Word Document/
      nerve-summary.docx
      preview.pdf
      preview.webp
      document-info [do not edit - app generated].json
      placement [do not edit - reference only].json
      metadata-source (App detected from file-exif-system) [do not edit].json
      metadata-editable (User corrections) [safe to edit].json
      metadata-resolved (Final value Mizaan uses) [do not edit].json
      correction-history [do not edit].json
      extracted-text [do not edit - app generated].txt
      edit-history [do not edit].json
      version-history [do not edit].json

      Versions/
        2026-06-01_101233_Malaysia_before-edit/
          nerve-summary.docx
          snapshot-info.json
```

Example PowerPoint folder:

```text
02_Attached Files/
  Presentations/
    001_PowerPoint/
      cranial-nerves-slides.pptx
      preview.pdf
      preview.webp
      presentation-info [do not edit - app generated].json
      metadata-source (App detected from file-exif-system) [do not edit].json
      metadata-editable (User corrections) [safe to edit].json
      metadata-resolved (Final value Mizaan uses) [do not edit].json
      correction-history [do not edit].json
      edit-history [do not edit].json
      version-history [do not edit].json
```

Example spreadsheet folder:

```text
02_Attached Files/
  Spreadsheets/
    001_Excel/
      finance-table.xlsx
      preview.pdf
      preview.webp
      spreadsheet-info [do not edit - app generated].json
      metadata-source (App detected from file-exif-system) [do not edit].json
      metadata-editable (User corrections) [safe to edit].json
      metadata-resolved (Final value Mizaan uses) [do not edit].json
      correction-history [do not edit].json
      edit-history [do not edit].json
      version-history [do not edit].json
```

---

### 18.6 Office Open/Edit Workflow

Office files must use a controlled edit workflow.

The workflow must support:

```text
open/view
edit
detect change
save snapshot
regenerate preview
update metadata
log edit
```

Editing flow:

```text
1. User clicks Open or Edit.
2. Mizaan verifies vault is writable if edit mode is requested.
3. Mizaan verifies the file exists.
4. Mizaan verifies helper runtime is available.
5. Mizaan verifies the file is not already locked by another edit session.
6. Mizaan creates a pre-edit snapshot.
7. Mizaan records pre-edit checksum, file size, and modified time.
8. Mizaan opens the file through the managed Office helper workflow.
9. User views/edits the file.
10. User saves or closes the Office helper.
11. Mizaan waits until file lock is released.
12. Mizaan compares modified time, file size, and checksum.
13. If unchanged, Mizaan records “opened, no saved change detected.”
14. If changed, Mizaan records edit event.
15. Mizaan updates current checksum and metadata-resolved.
16. Mizaan regenerates preview PDF/images.
17. Mizaan updates extracted text if supported.
18. Mizaan updates search index if text exists.
19. Mizaan updates graph/file relations if needed.
20. Mizaan updates edit history and version history.
21. Mizaan refreshes the page UI.
```

Hard safety rule:

```text
No pre-edit snapshot, no edit.
```

If pre-edit snapshot creation fails, Mizaan must not open the file in writable edit mode.

User-facing message:

```text
Mizaan could not create a safety snapshot, so editing was not started.
Your original document is safe.
Fix the snapshot issue or open the file read-only.
```

---

### 18.7 Office Lock Handling

Office files may be locked while open.

While a document is open in the managed Office editor, Mizaan must not:

```text
overwrite the file
move the file
delete the file
rename the file folder
regenerate preview from half-saved file
run destructive repair on the file
start another edit session for the same file
```

Mizaan should show:

```text
This document is currently open in the Office editor.
Some actions are paused until the editor closes.
```

After the helper closes, Mizaan must verify that the file lock is released before reading, hashing, or regenerating preview.

---

### 18.8 Office Version and Snapshot Rule

Editing an existing Office file must not create a new page folder by default.

The document remains in the same file folder.

Previous versions are stored under that document’s version area.

Correct:

```text
001_Word Document/
  nerve-summary.docx
  preview.pdf
  Versions/
    2026-06-01_101233_Malaysia_before-edit/
      nerve-summary.docx
      snapshot-info.json
```

Incorrect by default:

```text
002_Word Document Edited Copy/
```

A new file folder is created only if the user explicitly chooses:

```text
Save as new file
Duplicate file
Create edited copy
Export as separate file
```

---

### 18.9 Text, Markdown, CSV, and JSON Handling

Mizaan may preview and edit these internally:

```text
.txt
.md
.csv
```

Mizaan may view `.json` internally.

Mizaan may edit `.json` only when it is a safe app-managed editable file or when the user enters an explicit power-user edit mode.

Examples of safe app-managed editable JSON:

```text
metadata-editable (User corrections) [safe to edit].json
helper-settings.json
import-rules.json
```

Rules:

```text
TXT and Markdown can be edited natively.
CSV can be edited with basic table/text editing.
JSON must be validated before saving.
App-critical JSON must not be casually edited without validation.
Editing must create snapshots or recoverable revisions.
Malformed JSON must not be accepted silently.
```

CSV warning:

```text
Mizaan’s basic CSV editor is not a full Excel replacement.
Complex spreadsheets should use the Office helper workflow.
```

---

### 18.10 Text/Markdown/CSV Snapshot Rule

Internal editing of text-like files must create recoverable history.

Snapshots or revisions are required before:

```text
manual edit session
bulk replace
file overwrite
format conversion
external helper edit
import over existing file
large automated cleanup
```

For ordinary autosave editing, Mizaan may use lightweight revisions instead of full file copies, but the user must be able to recover previous content.

---

### 18.11 Text Extraction and Indexing

Text extraction is separate from preview generation.

Extraction sources:

```text
embedded PDF text
Office document text if helper supports extraction
TXT/Markdown direct text
CSV direct text
OCR text later
manual corrections later
```

Indexing rules:

```text
Do not block file storage if extraction fails.
Do not block preview if extraction fails.
Do not treat OCR as required for file import.
Store extracted text in readable file where useful.
Store searchable text/index state in SQLite/search index.
Show extraction status in file metadata.
```

---

### 18.12 OCR

OCR is later.

OCR must not block:

```text
PDF import
image import
document storage
document preview
search index creation for non-OCR text
backup
restore
```

When OCR is implemented, indexing must include:

```text
text extracted directly from PDFs/docs
OCR text from scanned PDFs
OCR text from images
OCR text from screenshots
manual OCR corrections later
OCR confidence where available
OCR language settings where applicable
```

OCR output should be stored as readable text and structured metadata.

Example:

```text
extracted-text [do not edit - app generated].txt
ocr-output [do not edit - app generated].json
ocr-corrections [user corrections].json
```

OCR failure must be recorded but must not corrupt or reject the original file.

---

### 18.13 Required Error Handling

Mizaan must handle:

```text
PDF preview failure
PDF text extraction failure
Office helper missing
Office helper damaged
Office helper launch failure
Office preview conversion failure
Office file locked
Office file changed while open
Office file saved as another file
Office file opened twice
pre-edit snapshot failure
checksum mismatch
preview regeneration failure
text extraction failure
malformed JSON
CSV parse failure
unsupported file type
file moved
file missing
permission denied
disk full
USB/external drive disconnected
```

Each failure must produce:

```text
safe file state
clear user message
log entry
repair/retry option where possible
no silent data loss
```

---

### 18.14 Implementation Order

Implement document handling in this order:

```text
1. Safe file import into page folders.
2. File records, checksums, placement files, and metadata files.
3. Native PDF preview.
4. Native TXT/Markdown preview/edit.
5. Basic CSV preview/edit.
6. Office helper runtime detection.
7. Office preview conversion to PDF/images.
8. Office managed open/edit workflow.
9. Pre-edit snapshots and post-edit checksum detection.
10. Preview regeneration after edits.
11. Text extraction and search indexing.
12. OCR later.
13. Advanced document actions later.
```

Do not build Office editing before safe import, file records, snapshots, and metadata exist.

Do not build OCR before safe import, preview, and indexing foundations exist.

---

### 18.15 Done Criteria

Document handling is not done until:

```text
PDFs preview inside Mizaan.
PDF metadata/checksum/page count are shown.
Office files are stored safely.
Office preview generation works when helper succeeds.
Office preview failure does not break storage.
Office edit workflow creates pre-edit snapshots.
Office edit detection updates checksum, metadata, preview, and history.
Office edits stay in the same document folder by default.
TXT and Markdown can be edited internally.
CSV can be previewed/basic-edited internally.
JSON editing is validated and restricted to safe cases.
Text extraction status is visible.
OCR is clearly marked as later until implemented.
Vault Health reports document/helper/preview/indexing issues.
Tests cover import, preview, edit, failed preview, failed snapshot, changed checksum, unchanged checksum, locked file, and missing file.
```

### 18.16 Template System, Built-In Template Library, Template Implementation Contract, and Notion-Inspired Page Systems

Templates are a core Mizaan system.

Templates are not decoration.

Templates are not static duplicate pages.

Templates are not fake starter cards.

Templates are creation blueprints that can generate:

```text
one page
one page with prepared blocks
one page with properties
one page with attached databases
one page with subpages
a complete page system
a module-ready workspace
a reusable life system
```

The template system must be implemented deeply enough that a user can create, edit, hide, duplicate, apply, export, import, and evolve templates without corrupting the vault.

Core template rule:

```text
Template = reusable creation blueprint.
Template output = real Mizaan pages, blocks, properties, databases, files, relations, tasks, calendar records, trackers, finance records, graph links, and folders.
```

Templates must follow the same local-first, SQLite-plus-readable-folder architecture as the rest of Mizaan.

Templates must never become cloud templates, AI-generated templates, marketplace-only templates, fake UI, or hardcoded visual presets.

---

#### 18.16.1 Why Templates Matter in Mizaan

Templates are required because Mizaan is a lifetime app.

A lifetime app cannot expect the user to manually rebuild the same structure every time they need:

```text
budget planner
student planner
project dashboard
weekly planner
task system
expense tracker
subscription tracker
debt payoff tracker
watch list
wish list
career tracker
startup workspace
design project system
health tracker
insurance planner
travel planner
reading tracker
habit tracker
content planner
```

Templates let Mizaan create structured systems quickly while still preserving the user’s ownership and local vault structure.

Templates must reduce setup friction without hiding the underlying data.

The user should be able to inspect the created folders, pages, databases, files, metadata, and relations after a template is applied.

---

#### 18.16.2 Template Types

Mizaan must support these template types:

```text
single-page template
page-with-blocks template
page-with-properties template
page-with-files template
page-with-database template
page-with-subpages template
page-system template
module-linked template
recurring-use template
user-created template
built-in template
hidden built-in template
duplicated template
archived template
```

Definitions:

```text
Single-page template:
Creates one page only.

Page-with-blocks template:
Creates one page with prepared text, headings, checklists, tables, callouts, sections, and placeholders.

Page-with-properties template:
Creates one page with predefined properties such as status, category, due date, amount, priority, type, tags, linked person, linked project, or review date.

Page-with-database template:
Creates one page plus one or more databases or database views.

Page-with-subpages template:
Creates a parent page with child pages under Subpages/.

Page-system template:
Creates a complete local workspace system with multiple pages, databases, relations, trackers, tasks, calendar records, finance records, and graph links.

Module-linked template:
Creates pages/records that connect to a Mizaan module such as Tasks, Calendar, Finance, Trackers, People, Graph, Documents, or Backup.

Recurring-use template:
Can be reused repeatedly for weekly review, monthly review, project kickoff, class notes, meeting notes, finance review, etc.

User-created template:
A template created or edited by the user.

Built-in template:
A template shipped with Mizaan.

Hidden built-in template:
A built-in template the user hides from the picker without deleting the actual built-in definition.

Duplicated template:
A copy of a built-in or user template that becomes user-owned and editable.

Archived template:
A user template hidden from normal use but preserved.
```

---

#### 18.16.3 Built-In vs User Templates

Mizaan must distinguish built-in templates from user-created templates.

Built-in templates:

```text
ship with Mizaan
cannot be permanently destroyed by normal user action
can be hidden
can be duplicated
can be used as starting points
can be updated by app version if needed
must not overwrite user-edited copies
must have version numbers
must have stable template IDs
```

User-created templates:

```text
can be created by the user
can be edited by the user
can be duplicated
can be renamed
can be exported
can be imported
can be deleted with confirmation
can be restored from backup if available
must have stable template IDs
must have readable template files
```

Rule:

```text
Built-in templates can be hidden.
User-created templates can be deleted.
Duplicating a built-in template creates a user-owned editable copy.
```

Mizaan must not silently modify a user-owned template during app updates.

---

#### 18.16.4 Template Storage Architecture

Templates must be stored in SQLite and mirrored into readable files.

SQLite stores runtime template behavior.

Readable template files preserve inspectability and recovery.

Required SQLite areas:

```text
templates
template_versions
template_blocks
template_properties
template_databases
template_database_views
template_relations
template_files
template_assets
template_variables
template_creation_logs
template_usage_history
```

Required readable template folder structure:

```text
01_System/
  Templates/
    Built-In/
      Finance/
      Productivity/
      Projects/
      Students/
      Health/
      Entertainment/
      Hobbies/
      Design/
      Product/
      Startup/
      Career/
      Life Admin/
      Documents/
      People/
      Travel/
      Content/
      Operations/

    User Templates/
      Finance/
      Productivity/
      Projects/
      Students/
      Health/
      Entertainment/
      Hobbies/
      Design/
      Product/
      Startup/
      Career/
      Life Admin/
      Documents/
      People/
      Travel/
      Content/
      Operations/

    Hidden Built-In Templates/
    Template Exports/
    Template Import Inbox/
    Template Logs/
```

Each template folder should contain:

```text
template-manifest [do not edit - app generated].json
template-readable-summary.txt
template-preview.md
template-version-history [do not edit - app generated].json
template-usage-history [do not edit - app generated].json
template-validation-report [do not edit - app generated].json
template-assets/
```

For user templates, editable files may include:

```text
template-editable [user editable].json
template-notes.md
```

Structured template definitions must use JSON.

Readable summaries may use TXT or Markdown.

---

#### 18.16.5 Template Manifest

Every template must have a manifest.

Required manifest fields:

```text
templateId
shortTemplateId
templateName
templateSlug
templateCategory
templateSubcategory
templateType
builtIn
hidden
userOwned
version
createdAtLocal
createdAtUtc
updatedAtLocal
updatedAtUtc
createdCountry
authorType
requiredMizaanVersion
requiredSchemaVersion
description
useCase
createdObjects
requiredModules
optionalModules
variables
defaultProperties
defaultViews
defaultRelations
defaultFolders
defaultFiles
templateAssets
safetyRules
rollbackSupported
```

Example:

```json
{
  "templateId": "template_finance_money_system_001",
  "shortTemplateId": "tpl_money_001",
  "templateName": "Money System",
  "templateCategory": "Finance",
  "templateSubcategory": "Budgeting, Expenses, Debt, Subscriptions",
  "templateType": "page-system",
  "builtIn": true,
  "hidden": false,
  "userOwned": false,
  "version": 1,
  "description": "Creates a full personal money management system with budget, expenses, debt, subscriptions, bills, savings, receipts, and monthly review.",
  "requiredModules": ["Finance", "Tasks", "Calendar", "Documents"],
  "createdObjects": ["page", "database", "finance-record", "task", "calendar-event"],
  "rollbackSupported": true
}
```

---

#### 18.16.6 Template Variables and Creation Wizard

Templates must support variables.

Variables let the template ask questions before creation.

Examples:

```text
Name of project
Semester name
Budget month
Currency
Debt name
Subscription renewal date
Goal deadline
Class name
Exam date
Person name
Company name
Startup name
Travel destination
Insurance provider
Watch list category
Career target role
```

Variable types:

```text
text
long text
number
currency
date
date range
select
multi-select
checkbox
person
page relation
file picker
folder picker
country
timezone
recurrence rule
privacy flag
```

Template creation flow:

```text
User chooses template
→ Mizaan shows preview
→ Mizaan shows what will be created
→ Mizaan asks required variables
→ Mizaan validates inputs
→ Mizaan shows creation summary
→ User confirms
→ Mizaan creates all objects in one transaction/pending-repair-safe operation
→ Mizaan logs template usage
→ Mizaan opens the created parent page/system
```

The user must always know what a page-system template will create.

For large templates, show:

```text
pages to be created
databases to be created
tasks to be created
calendar records to be created
finance records to be created
trackers to be created
folders to be created
relations to be created
files/assets to be copied
```

---

#### 18.16.7 Template Creation Transaction Rule

Applying a template is a data-changing operation.

It must be recoverable.

Allowed outcomes:

```text
template creation fully succeeds
template creation rolls back
template creation enters visible pending-repair state
```

Forbidden outcomes:

```text
half-created template system with no warning
pages created but databases missing silently
database rows created but parent page missing silently
folders created but SQLite does not know them
SQLite records created but folders/mirrors missing without warning
tasks/calendar records created but not linked
files copied but placement files missing
```

Before applying a large page-system template, Mizaan should create a lightweight pre-template snapshot or operation checkpoint.

For destructive template actions, such as resetting a template-created system, Mizaan must create a backup or snapshot first.

---

#### 18.16.8 Template Rollback and Repair

If template creation fails, Mizaan must show a repair screen.

Repair screen should include:

```text
template name
template ID
operation ID
created objects
failed objects
SQLite status
folder status
mirror status
file copy status
relation status
rollback option
retry failed steps
open partial parent page read-only
save diagnostic report
```

Template rollback must remove or mark only objects created by that failed template operation.

It must not delete unrelated user data.

Template operation logs must be stored in:

```text
01_System/
  Templates/
    Template Logs/
```

and in SQLite logs.

---

#### 18.16.9 Template Picker

Mizaan must include a template picker.

Template picker must support:

```text
search
category filter
subcategory filter
built-in/user filter
recent templates
favorite templates
hidden templates management
template preview
template details
duplicate template
edit user template
hide built-in template
restore hidden built-in template
delete user template
create from template
create blank page
```

Template picker categories:

```text
Finance
Productivity
Projects
Operations
Students
Health
Entertainment
Hobbies
Design
Product
Startup
Career
Life Admin
Documents
People
Travel
Content
Databases
Graphs and Canvases
```

Every template card must show:

```text
template name
category
what it creates
complexity level
modules used
estimated setup time
built-in or user-created label
last used date
favorite/hide controls
```

Complexity levels:

```text
Simple = creates one page
Medium = creates one page plus database/views
Full System = creates multiple linked pages/databases/modules
```

---

#### 18.16.10 Template Editor

Mizaan must include a template editor for user templates.

Template editor must support:

```text
edit template name
edit description
edit category/subcategory
edit icon/cover
edit page structure
edit default blocks
edit default properties
edit default database fields
edit default database views
edit default relations
edit variables
edit creation wizard questions
edit privacy defaults
edit included subpages
edit included tasks/calendar/finance/tracker records where supported
preview output
validate template
duplicate template
export template
delete template
```

User should be able to create a template from:

```text
current page
current page tree
current database
selected pages
selected blocks
selected project system
selected finance system
selected student system
selected template-created system
```

When creating a template from existing pages, Mizaan must ask:

```text
Include subpages?
Include databases?
Include database rows?
Include files?
Include media?
Include tasks?
Include calendar events?
Include finance records?
Include trackers/check-ins?
Include people links?
Keep exact dates or convert to relative dates?
Keep exact names or convert to variables?
Keep private flags?
```

Templates created from real pages must scrub or variable-ize personal details when the user asks.

---

#### 18.16.11 Template Versioning

Templates must be versioned.

Template version history must record:

```text
template ID
version number
changed at local time
changed at UTC time
changed by profile/device
change summary
fields changed
old definition reference
new definition reference
migration notes
```

Built-in template updates must not overwrite user duplicates.

If a built-in template updates, Mizaan may show:

```text
Updated built-in template available.
Your existing user copy was not changed.
You can duplicate the new version or keep your current one.
```

Template-created pages should record template origin:

```text
createdFromTemplateId
createdFromTemplateVersion
createdFromTemplateName
templateOperationId
```

This helps with repair, updates, and understanding where a page system came from.

---

#### 18.16.12 Template Validation

Templates must be validated before use.

Validation checks:

```text
template manifest valid
template ID unique
required variables defined
required modules available
referenced blocks valid
referenced properties valid
referenced databases valid
referenced views valid
referenced relations valid
referenced assets exist
template output paths valid
no forbidden external links
no cloud dependency
no AI dependency
no invalid Windows filename characters
no duplicate folder conflict without resolution
no unsupported recurrence rules
no unsupported property types
no broken page references
```

If validation fails, Mizaan must not apply the template until fixed.

User-facing message:

```text
This template has problems and cannot be applied safely.
Your vault was not changed.
Open the validation report to repair the template.
```

---

#### 18.16.13 Template Categories to Implement

Mizaan must implement a practical built-in template library inspired by common personal productivity/template categories.

Do not copy Notion templates directly.

Use the category patterns, but implement Mizaan-native local-first page systems.

Required built-in categories:

```text
Finance and Money
Productivity and Life Planning
Projects and Operations
Student Life and Academic Planning
Health and Wellness
Entertainment and Watch Lists
Wish Lists and Shopping
Hobbies and Personal Interests
Design and Creative Work
Product and Startup
Career and Job Search
Life Admin and Documents
People and Relationships
Travel and Events
Content and Knowledge
Databases and Trackers
Graph and Canvas Systems
```

Each category should include simple templates and full page-system templates.

---

#### 18.16.14 Finance and Money Templates

Finance templates must be grouped together because money workflows overlap.

Required Finance and Money templates:

```text
Money System
Budget Planner
Expense Tracker
Income Tracker
Debt Payoff Tracker
Subscription Tracker
Recurring Payments Tracker
Bills Tracker
Savings Goals
Emergency Fund Tracker
Receipt Tracker
Loan Tracker
Insurance Planner
Monthly Finance Review
Annual Finance Review
Net Worth Tracker
Account Summary
Purchase Decision Log
Warranty and Returns Tracker
```

The primary built-in finance system should be:

```text
Money System
```

Money System must include:

```text
Budget Planner
Expense Tracker
Income Tracker
Debt Tracker
Subscription Tracker
Recurring Payments
Bills
Savings Goals
Receipts
Insurance
Loans
Monthly Reviews
Finance Documents
Finance Calendar
Finance Tasks
```

Money System created objects:

```text
parent finance page
budget database
expense database
income database
debt database
subscriptions database
bills database
savings goals database
receipts/document database
insurance database
loan database
monthly review pages
finance task views
finance calendar views
linked document areas
```

Required finance properties:

```text
amount
currency
category
account
payment method
date
due date
paid status
recurring status
frequency
next payment date
subscription renewal date
debt principal
debt remaining
interest rate
minimum payment
insurance provider
policy number
document link
receipt link
notes
```

Required finance views:

```text
This Month
Upcoming Bills
Overdue Bills
Subscriptions
Debt Payoff
Receipts
Insurance
Savings Goals
Monthly Review
By Category
By Account
Calendar View
```

Finance safety rules:

```text
No bank sync.
No payment APIs.
No tax engine.
No financial advice claims.
Manual records only.
User owns all finance data locally.
```

---

#### 18.16.15 Productivity and Life Planning Templates

Required Productivity templates:

```text
Life Dashboard
Daily Planner
Weekly Planner
Monthly Planner
Yearly Planner
Today Page
Weekly Review
Monthly Review
Quarterly Review
Annual Review
Habit Tracker
Routine Builder
Goal Planner
Personal OKR System
Focus Session Planner
Time Blocking Planner
Energy Tracker
Priority Matrix
Decision Log
Inbox Processing System
Personal Operating System
```

The primary built-in productivity system should be:

```text
Personal Operating System
```

Personal Operating System must include:

```text
Home page
Inbox
Today
Weekly planner
Monthly planner
Goals
Habits
Tasks
Calendar links
Projects
Review pages
Quick capture
Decision log
Reference notes
```

Required views:

```text
Today
This Week
This Month
Overdue
Waiting
Someday
Review Needed
Goals by Quarter
Habits Heatmap
```

---

#### 18.16.16 Project Management and Operations Templates

Required Project and Operations templates:

```text
Project Hub
Project Planner
Project Tracker
Project Roadmap
Kanban Project Board
Sprint Planner
Task Board
Milestone Tracker
Meeting Notes
Decision Log
Risk Register
Issue Tracker
Operations Manual
Standard Operating Procedure
Process Tracker
Launch Checklist
Client/Personal Work Tracker
Documentation Hub
Resource Library
```

Project Hub must include:

```text
project overview
status
goals
scope
tasks
milestones
documents
people
calendar events
decisions
risks
issues
meeting notes
activity log
project graph
archive section
```

Required project properties:

```text
status
priority
owner
start date
due date
project type
linked people
linked documents
linked tasks
linked calendar events
risk level
progress
archive state
```

Required project views:

```text
Active Projects
At Risk
Waiting
Completed
Archived
By Status
By Priority
By Deadline
Timeline
Board
Calendar
```

Operations templates must be local-first and personal/team-lite.

Do not build enterprise permissions, SaaS admin dashboards, or multiplayer workflows.

---

#### 18.16.17 Student Life and Academic Templates

Required Student templates:

```text
Student Life System
Student Planner
Class Dashboard
Course Tracker
Assignment Tracker
Exam Planner
Study Schedule
Lecture Notes
Reading Tracker
Research Notes
Grade Tracker
Semester Planner
Academic Calendar
Flashcard List
Revision Tracker
Lab/Practical Tracker
University Documents
Scholarship/Fees Tracker
Student Budget
Student Habit Tracker
Dorm/Home Essentials
Extracurricular Tracker
```

Student Life System must include:

```text
semester dashboard
course database
assignment database
exam database
study plan
lecture notes
reading list
revision tracker
grade tracker
academic documents
student budget
student calendar
student tasks
student goals
```

Required student properties:

```text
course
semester
instructor
assignment type
due date
exam date
priority
status
grade
weight
study hours
revision status
document links
notes
```

Required student views:

```text
Today’s Classes
Upcoming Assignments
Upcoming Exams
This Week
By Course
By Status
Revision Needed
Completed
Grade Overview
Academic Calendar
```

---

#### 18.16.18 Health and Wellness Templates

Required Health templates:

```text
Health Dashboard
Workout Tracker
Meal Planner
Sleep Tracker
Mood Tracker
Medication Tracker
Appointment Tracker
Water Tracker
Symptom Log
Medical Documents
Doctor Visit Notes
Fitness Goals
Body Measurement Tracker
Mental Health Journal
Routine Tracker
```

Health templates must avoid medical diagnosis claims.

Rules:

```text
Do not provide medical advice.
Do not diagnose.
Do not replace doctors.
Store user-entered records only.
Allow private flag by default for sensitive health pages.
```

Required health views:

```text
Today
This Week
Appointments
Medication Schedule
Workout Log
Meal Plan
Sleep Trends
Mood Trends
Medical Documents
```

---

#### 18.16.19 Entertainment, Watch List, and Media Templates

Required Entertainment templates:

```text
Watch List
Movie Tracker
TV Show Tracker
Anime Tracker
YouTube Watch Later
Podcast Tracker
Music Discovery Log
Game Backlog
Book/Reading Tracker
Entertainment Dashboard
Recommendation Log
Favorites List
```

Watch List must include:

```text
title
type
status
platform
priority
genre
recommended by
date added
start date
finish date
rating
notes
link
related people
```

Required watch-list views:

```text
To Watch
Watching
Completed
Dropped
High Priority
By Platform
By Genre
Recommended by People
Favorites
```

Entertainment templates must link to People when someone recommended something.

---

#### 18.16.20 Wish List, Shopping, and Purchase Planning Templates

Required Wish List templates:

```text
Wish List
Gift Ideas
Shopping List
Purchase Planner
Price Watch
Wishlist by Category
Home Purchase List
Tech Purchase List
Book Wishlist
Clothing Wishlist
Warranty Tracker
Returns Tracker
```

Wish List properties:

```text
item name
category
price
currency
priority
store
link
reason
occasion
gift recipient
status
purchased date
warranty end date
return deadline
notes
```

Required views:

```text
High Priority
Under Budget
By Category
Gift Ideas
Purchased
Waiting
Warranty Ending Soon
Returns Deadline
```

---

#### 18.16.21 Hobbies and Personal Interest Templates

Required Hobby templates:

```text
Hobby Dashboard
Reading Tracker
Recipe Collection
Meal Prep Planner
Travel Ideas
Language Learning Tracker
Photography Log
Art Practice Tracker
Writing Tracker
Gaming Tracker
Sports Tracker
Collection Tracker
Learning Project Tracker
```

Hobby templates should be simple but expandable.

Each hobby template should support:

```text
notes
resources
progress tracker
calendar sessions
tasks
files/media
favorites
review
```

---

#### 18.16.22 Design and Creative Work Templates

Required Design templates:

```text
Design Project Hub
Moodboard
Brand Board
Design Brief
Creative Brief
Asset Library
Inspiration Library
Design Review Notes
Client/Personal Design Tracker
Portfolio Project Tracker
UI Audit Checklist
Visual QA Checklist
```

Design templates should support:

```text
image/media attachments
references
versions
feedback notes
status
export links
decision log
asset folders
```

Required design views:

```text
Active Designs
In Review
Needs Revision
Approved
Assets
References
Portfolio Candidates
```

---

#### 18.16.23 Product and Startup Templates

Required Product/Startup templates:

```text
Startup Dashboard
Product Roadmap
Feature Backlog
MVP Planner
User Research Repository
Customer Interview Notes
Competitor Tracker
Launch Plan
Growth Experiment Tracker
Bug/Issue Tracker
Decision Log
Changelog
Release Notes
Investor/Business Notes
Idea Validation Board
Metrics Tracker
```

Product templates must be personal/local.

Do not add SaaS team admin, billing, cloud analytics, or online collaboration.

Product system required pages:

```text
vision
problem
users
features
roadmap
research
experiments
bugs
launch checklist
decisions
documents
metrics
archive
```

---

#### 18.16.24 Career and Job Search Templates

Required Career templates:

```text
Career Dashboard
Job Application Tracker
Resume Tracker
Cover Letter Tracker
Interview Prep
Networking Tracker
Company Research
Portfolio Tracker
Skills Tracker
Learning Plan
Certification Tracker
Work Log
Achievement Log
Salary/Offer Comparison
Career Goals
```

Job Application Tracker properties:

```text
company
role
location
source
status
date applied
deadline
salary range
resume version
cover letter version
contact person
interview date
follow-up date
notes
documents
```

Required views:

```text
To Apply
Applied
Interviewing
Offer
Rejected
Follow Up
By Company
By Deadline
By Source
```

---

#### 18.16.25 Life Admin, Documents, and Insurance Templates

Required Life Admin templates:

```text
Documents Hub
Identity Documents
Insurance Planner
Warranty Tracker
Medical Documents
Legal Documents
Receipts Hub
Home Inventory
Vehicle Documents
Travel Documents
Password Hint Vault without storing actual passwords
Important Contacts
Emergency Information
```

Insurance Planner must include:

```text
policy type
provider
policy number
premium
renewal date
coverage summary
documents
contact person
claim history
notes
```

Rules:

```text
Sensitive templates should support private flag by default.
Do not store real passwords unless a future secure vault/encryption system exists.
Do not claim encryption before implemented.
```

---

#### 18.16.26 People and Relationship Templates

Required People templates:

```text
Person Profile
Family Member Profile
Friend Profile
University Contact
Professional Contact
Doctor/Service Provider
Interaction Timeline
Birthday/Important Dates Tracker
Gift Ideas by Person
Relationship Notes
```

Person templates must support:

```text
name
nickname/context
where known from
relationship type
tier/trust/custom labels
important dates
notes
linked documents
linked projects
linked events
linked tasks
linked gifts
private flag
```

People templates are personal knowledge tools, not sales CRM.

Do not implement sales pipeline, lead scoring, or enterprise CRM features.

---

#### 18.16.27 Travel and Events Templates

Required Travel/Event templates:

```text
Travel Planner
Trip Dashboard
Packing List
Itinerary
Flight/Transport Tracker
Hotel/Lodging Tracker
Travel Documents
Travel Budget
Places to Visit
Food List
Event Planner
Party Planner
Wedding/Event Lite Planner
Conference Planner
```

Travel system should include:

```text
destination
dates
budget
documents
transport
lodging
packing
places
food
tasks
calendar events
people
notes
photos/media after trip
```

---

#### 18.16.28 Content and Knowledge Templates

Required Content templates:

```text
Content Calendar
Article Planner
Video Planner
Social Post Planner
Research Repository
Knowledge Base
Book Notes
Article Notes
Podcast Notes
Learning Notes
Topic Hub
Reference Library
Quote Collection
```

Content templates must be local-first.

No social media API integration required.

No cloud publishing required.

Content Calendar may export later, but not publish online.

---

#### 18.16.29 Databases, Trackers, and Utility Templates

Required database/utility templates:

```text
Blank Database
Table Database
List Database
Board Database
Calendar Database
Gallery Database later
Timeline Database later
Habit Tracker
Mood Tracker
Reading Tracker
Learning Tracker
Inventory Tracker
Decision Tracker
Issue Tracker
Bug Tracker
Changelog Tracker
Review Tracker
```

Every database template must define:

```text
properties
views
filters
sorts
sample rows optional
template rows optional
relation fields optional
rollups later
formulas later
```

Sample rows must be clearly marked as sample and easy to remove.

---

#### 18.16.30 Graph and Canvas Templates

Required graph/canvas templates:

```text
Blank Canvas
A4 Study Diagram
Endless Whiteboard
Mind Map
Concept Map
Family Tree
Project Dependency Map
Study Topic Map
Finance Relationship Map
People Relationship Map
Manual Local Graph
Research Map
Decision Tree
Timeline Map
```

Graph/canvas templates must support:

```text
manual nodes
manual edges
labels
arrows
groups
freehand notes later
linked page nodes
unlinked manual nodes
area selection to node later
export image later
```

Manual graph nodes do not need to be real pages unless the user promotes them.

---

#### 18.16.31 Template-Created Folder Structure

When a template creates a page, the output must follow normal page folder rules.

Example:

```text
02_Library/
  Pages/
    Money System_2026-06-01_100000_Malaysia_pg_a1b2c3/
      finance.md
      page.json
      00_Page Info/
      01_Content Media/
      02_Attached Files/
      03_Edits and Versions/
      04_Exports/
      05_Graph and Relations/
      06_Search and Index Notes/
      Subpages/
        Budget Planner_2026-06-01_100001_Malaysia_pg_b1b2b3/
        Expense Tracker_2026-06-01_100002_Malaysia_pg_c1c2c3/
        Debt Payoff_2026-06-01_100003_Malaysia_pg_d1d2d3/
        Subscriptions_2026-06-01_100004_Malaysia_pg_e1e2e3/
```

Template-created pages must include:

```text
template origin
template version
template operation ID
created variables
template-created flag
```

---

#### 18.16.32 Template-Created Relations

Templates may create relations.

Examples:

```text
Money System → contains → Budget Planner
Money System → contains → Expense Tracker
Subscription Tracker → creates calendar reminder → Renewal Event
Student Planner → contains → Course Tracker
Course Tracker → links to → Assignment Tracker
Project Hub → links to → Tasks
Career Dashboard → links to → Job Applications
Person Profile → links to → Gift Ideas
Watch List → recommended by → Person
```

Relations must use stable IDs.

Relations must be mirrored in graph/relation files.

Graph must show template-created relations as real data, not fake demo edges.

---

#### 18.16.33 Template Privacy Defaults

Templates may have privacy defaults.

Examples:

```text
Health Dashboard = private suggested
Medical Documents = private suggested
Identity Documents = private suggested
Insurance Planner = private suggested
Finance/Money System = private suggested
People Profile = optional private
Career Tracker = optional private
Watch List = normal
Project Hub = normal
Student Planner = normal
```

Mizaan must not force privacy unless the user chooses.

For sensitive templates, creation wizard should ask:

```text
Mark this system as private?
Hide from recent/search/graph until unlocked?
Blur previews?
```

If encryption is not implemented, Mizaan must not claim encryption.

---

#### 18.16.34 Template Preview

Before applying a template, Mizaan must show a preview.

Preview must show:

```text
template description
category
complexity
what will be created
required variables
modules used
folders created
pages created
databases created
relations created
tasks/calendar records created
privacy defaults
sample data included or not
estimated setup size
```

For full page systems, show a tree preview:

```text
Money System
  Budget Planner
  Expense Tracker
  Debt Payoff
  Subscriptions
  Bills
  Receipts
  Insurance
  Monthly Review
```

The user must confirm before large page-system creation.

---

#### 18.16.35 Template Sample Data Rule

Templates may include sample data only when useful.

Sample data must be clearly marked.

Sample data must be removable.

Rules:

```text
Do not mix sample data with real user data.
Do not create fake analytics.
Do not create fake graph links that look real.
Do not create fake finance records that look like real transactions.
Do not create fake people records that look like real people.
```

Template picker should offer:

```text
Create empty
Create with sample rows
Create with example instructions only
```

Default should usually be:

```text
Create empty with instructions
```

---

#### 18.16.36 Template QA Requirements

Template system tests must cover:

```text
create single-page template
create page-with-blocks template
create page-system template
create from built-in template
duplicate built-in template
edit user template
hide built-in template
restore hidden built-in template
delete user template
create template from existing page
create template from page tree
template variables validation
template output validation
template rollback on failure
template-created relations
template-created database views
template-created tasks/calendar/finance records
template folder/mirror generation
template origin metadata
template version history
malformed template manifest
missing template asset
unsupported property type
duplicate folder conflict
private template defaults
```

Manual QA must test:

```text
open template picker
search template
filter category
preview template
create Money System
create Student Planner
create Project Hub
create Watch List
create Wish List
create Job Application Tracker
hide built-in template
duplicate built-in template
edit duplicated template
delete user template
restart app and confirm template output remains
```

Template system is not done until these tests pass or are clearly documented as deferred.

---

#### 18.16.37 Template Release Blockers

Template system is blocked if:

```text
template creates fake UI only
template output does not persist
template output cannot survive restart
template-created pages lack folders
template-created pages lack page.json
template-created metadata is missing
template-created relations are fake
template-created databases are fake
template rollback can delete unrelated user data
template validation is missing
built-in template updates overwrite user copies
user-created templates cannot be edited
hidden built-in templates cannot be restored
template creation failure is silent
sample data looks like real user data without warning
```

Any one of these blocks template release.

---

#### 18.16.38 Template Implementation Order

Implement templates in this order:

```text
1. Template data model.
2. Template manifest format.
3. Built-in template registry.
4. Template picker.
5. Single-page template creation.
6. Page-with-blocks template creation.
7. Page-with-properties template creation.
8. Page-with-database template creation.
9. Page-with-subpages template creation.
10. Full page-system template creation.
11. Template origin tracking.
12. Template validation.
13. Template rollback/pending repair.
14. User-created templates.
15. Template editor.
16. Hide/restore built-in templates.
17. Duplicate built-in as user template.
18. Template versioning.
19. Template export/import.
20. Template QA and release proof.
```

Do not build the full template editor before single-page and page-system template creation are safe.

Do not build advanced template imports before validation and rollback exist.

---

#### 18.16.39 Template Done Criteria

Templates are not done until:

```text
built-in template registry exists
template manifest exists
template picker works
templates are searchable/filterable
single-page templates work
page-system templates work
template creation is transactional or repairable
created pages have real folders
created pages have real SQLite records
created pages have Markdown and JSON mirrors
created databases are real
created relations are real
created tasks/calendar/finance records are real where used
template origin is recorded
template validation exists
template rollback or repair exists
built-in templates can be hidden
hidden built-ins can be restored
built-ins can be duplicated as user templates
user templates can be created
user templates can be edited
user templates can be deleted with confirmation
template version history exists
template usage history exists
template-created systems survive restart
template output appears in search/graph where appropriate
private template defaults are honest
no fake template UI remains
template QA report exists
```

---

#### 18.16.40 Final Template Rule

Mizaan templates must behave like real local systems.

A template is not finished when it creates a pretty page.

A template is finished only when the created system is real, local, persistent, recoverable, editable, searchable, graph-linked, backup-safe, and understandable in the vault folder.

Final rule:

```text
Templates must create real Mizaan systems, not decorative starter pages.
```

## 19. Media System

### 19.1 Media inside pages

Images/photos/videos/audio are normally part of the page, as blocks and attachments.

They do not get new pages by default.

### 19.2 Optional promote to media page

User can later choose:

```text
Promote this media to its own page
```

This is optional for large media, editing projects, or standalone media archives.

### 19.3 Image editing

Early supported image tools:

- crop
- rotate
- simple annotation
- simple blur/redaction later

Rules:

- User sees edited image replace the displayed block.
- Undo restores previous display version.
- Original Mizaan file remains preserved.
- Edited output stays in the same file folder's `Edits/` or page `03_Edits and Versions/`.
- Every edit has `derived-from` metadata.

### 19.4 Video/audio

Required early:

- preview playback
- metadata extraction
- thumbnail generation
- open/play inside Mizaan
- preserve original

Later:

- simple trim
- extract frame
- extract audio
- convert format
- proxies for large video

FFmpeg handles thumbnails and processing.

VLC may support playback if bundled/managed.

---

## 20. Viewers and Editors

### 20.1 One app installer rule

The user should not feel like they installed ten apps.

Mizaan should package/manage required engines as sidecars where legally and technically possible.

Required engines:

- LibreOffice engine for Office preview/edit workflow
- VLC/libVLC or reliable internal player engine for playback support
- FFmpeg for metadata, thumbnails, conversion, trim/audio extraction
- image processing library for crop/annotation

### 20.2 Settings screen

Even if bundled, Mizaan needs a Viewer and Editor Manager screen.

It shows:

- LibreOffice status
- VLC status
- FFmpeg status
- image editor status
- version
- health
- test button
- repair/reinstall instructions

### 20.3 Path settings

If helper binaries are bundled, users normally do not set paths.

Advanced users may override paths in Settings.

Store path overrides in:

```text
01_System/03_Viewers and Editors/
```

### 20.4 No system default dependency

Do not rely on system default apps as the only solution.

System default apps may be fallback, but not the main architecture.

---

## 21. Editor and Block System

### 21.1 Simple explanation

The editor is where the user writes inside a page.

A block is one piece of page content, like:

- paragraph
- heading
- bullet
- checklist
- image
- video
- file
- table
- database view
- graph block
- calendar block

### 21.2 Final editor behavior

Required:

- inline title editing
- paragraph editing
- Enter creates new block
- Backspace safely merges/removes empty block
- autosave every 5 seconds
- slash command menu
- markdown shortcuts
- undo/redo
- block movement
- block duplicate/delete
- block type conversion
- file block insert
- table block insert
- image/video/audio block insert
- internal snapshots
- no content loss

### 21.3 Editor framework decision

Current custom editor may remain temporarily.

Final plan:

- keep custom editor only if it remains stable
- otherwise migrate to Tiptap/ProseMirror or Lexical
- migration must preserve block data model
- editor UI must never become the only data model

### 21.4 Data model rule

Blocks must be stored in SQLite.

Markdown is generated from blocks.

Markdown import can recreate blocks later.

### 21.5 External Markdown editing

External Markdown edits are supported later, not phase zero.

When supported:

- detect changed Markdown file
- compare with SQLite state
- show conflict resolver
- never silently overwrite

---

## 22. Workspace UI

### 22.1 App feeling

The app should feel like a Notion-style workspace, but local-first, calmer, more human-readable, and less fake-dashboard.

### 22.2 Layout

```text
Left sidebar
Top bar / command area
Center workspace
Right panel
Bottom status line optional
```

### 22.3 Sidebar

Core modules:

- Home
- Search
- Databases
- Graph
- Calendar

Page collections/templates can create:

- Notes
- Documents
- Projects
- People
- Finance
- Tasks
- Goals
- Trackers
- Media collections
- Study systems

System tools:

- Templates
- Vault
- Backup
- Import
- Export
- Trash
- Settings

### 22.4 Home

Home must be calm and useful.

Show:

- quick capture
- recent pages
- today tasks
- today calendar
- pinned projects
- backup warning
- vault health
- continue where you left off

Do not show fake analytics.

### 22.5 Right panel

Right panel owns:

- properties
- relations
- backlinks
- outgoing links
- files
- local graph
- history
- privacy
- storage
- metadata

Page content must remain clean.

### 22.6 Theme

Initial theme target:

- calm Notion-like workspace
- light/dark
- warm paper influence
- no gradients/glows/AI-dashboard styling
- border-led surfaces
- readable typography

Expanded theme system later:

- Mizaan Light
- Mizaan Dark
- Warm Paper
- Graphite Dark
- Sepia Reading
- OLED Black
- Academic
- High Contrast
- System

---

## 23. Templates

### 23.1 Template definition

Templates are pages/blueprints that can create one page or full page systems.

### 23.2 Template storage

Templates live in:

- SQLite templates tables
- `01_System/02_Templates/`

### 23.3 Built-in vs user templates

Built-in templates:

- cannot be permanently deleted casually
- can be hidden in Settings
- may be restored

User-created templates:

- can be created
- can be edited
- can be duplicated
- can be deleted/trash-restored
- can be exported/imported later

### 23.4 Template origin

Template-created pages must remember origin:

```text
template_id
template_name
template_version
created_from_template_at
```

This means the page knows which template created it.

Template updates should not automatically modify existing pages unless the user explicitly applies updates.

### 23.5 Template capabilities

Templates can define:

- page type
- page folder structure
- child pages
- starter blocks
- properties
- database schema
- tasks
- calendar events
- tracker setup
- finance setup
- document/media behavior
- right panel tabs
- module views
- privacy defaults
- export rules
- backup behavior

### 23.6 Default templates

Do not create separate hardcoded templates for every named idea unless needed.

Instead, include robust template categories and features:

- Blank Page
- Note
- Lecture Notes
- Project
- Document Record
- Person Profile
- Finance Record
- Task System
- Goal System
- Tracker
- Database
- Calendar/Event
- Media Collection
- Study System
- Daily Review
- Weekly Review

Medical exam prep can be a user-created or optional study-system template, not mandatory built-in unless explicitly added later.

---

## 24. Databases

Mizaan needs Notion-like databases but in phases.

### 24.1 Phase 1 database features

- table view
- list view
- custom fields
- filters
- sorting
- grouping
- tags
- status
- date
- checkbox
- text
- number
- select
- multi-select
- row opens as page

### 24.2 Phase 2 database features

- board view
- calendar view
- gallery view
- timeline view
- saved views
- database templates

### 24.3 Phase 3 database features

- relations
- rollups
- formulas
- charts
- dashboards
- local-only forms if useful

### 24.4 No cloud database features

Do not add:

- public forms
- team permissions
- cloud automations
- external synced databases
- billing/admin features

---

## 25. Graph System

### 25.1 Graph timing

Graph should be implemented fully after relations/backlinks/indexes are stable.

Reason:

```text
A graph is only useful if the underlying links are real.
A fake graph is worse than no graph.
```

### 25.2 Graph layers

Mizaan has three graph layers:

1. Global Graph
2. Automatic Local Graph
3. Manual Local Graph / Page Canvas Graph

### 25.3 Global graph

Generated from real vault data.

Shows:

- all pages
- orphan/unlinked pages
- documents
- media-containing pages
- projects
- people
- finance records
- calendar events
- tasks
- goals
- trackers
- database rows
- tags
- dates
- attachments by default

Unlinked/orphan nodes must be visible so the user can connect them.

### 25.4 Automatic local graph

Shown around current page.

Includes:

- current page
- child pages
- parent page
- backlinks
- outgoing links
- relations
- attachments
- related tasks
- related calendar events
- related people
- related finance
- tags/dates on hover or optional display

### 25.5 Manual graph/canvas

Manual graph is like a whiteboard canvas.

When creating manual graph, ask:

```text
Choose canvas type:
[A4 page]
[Endless whiteboard]
```

Manual graph may contain:

- nodes linked to real pages
- nodes not linked to pages
- selected drawn areas turned into one node
- arrows
- labels
- family tree structures
- study concept maps
- dependency maps
- custom relationship types

### 25.6 Graph edges

Edges support:

- direction
- arrows
- labels
- style
- hover details
- source information

Direction options:

- undirected
- source_to_target
- target_to_source
- bidirectional

### 25.7 Private graph behavior

Private nodes are blurred until unlocked.

Search/graph should show a lock indicator when private content is hidden.

### 25.8 Graph recovery files

Every page folder should include graph-readable files:

```text
05_Graph and Relations/
  relations [do not edit - app generated].txt
  adjacency [do not edit - app generated].json
  backlinks [do not edit - app generated].txt
  outgoing-links [do not edit - app generated].txt
```

Purpose:

- if database/index breaks, graph links can be rebuilt
- multiple recovery routes exist
- human can inspect what is connected to what

---

## 26. Search

### 26.1 Search scope

Search must include:

- page titles
- page blocks
- tags
- properties
- file names
- metadata
- extracted document text
- OCR text later
- media metadata
- graph relations
- trash by default with clear trash label

### 26.2 Search and private content

If private content is locked:

- hide private results
- show small lock indicator in search UI
- explain private files are hidden until unlock

If unlocked:

- private results may appear with private indicator

### 26.3 Command palette

Command palette and content search should be unified enough that user does not need two separate mental models.

Search result types:

- command
- page
- block
- file
- task
- event
- template
- setting
- graph node

---

## 27. Calendar, Tasks, Trackers, Goals

### 27.1 Calendar

Calendar is local-only.

No Google API.
No Microsoft API.
No server invites.

Required early:

- day view
- week view
- month view
- agenda view
- event create/edit/delete
- all-day events
- multi-day events
- recurring events
- recurring exceptions
- reminders
- local desktop notifications in Tauri
- tasks on calendar
- deadlines
- study blocks
- exam countdowns
- focus blocks
- linked projects/pages/people
- ICS import/export

### 27.2 Tasks

Tasks are app-wide.

Required early:

- inbox
- today
- upcoming
- overdue
- someday
- waiting
- project tasks
- recurring tasks
- subtasks
- priorities
- due dates
- reminders
- statuses
- tags
- task notes
- attachments
- task appears on calendar
- task can link to goal/project/page

### 27.3 Trackers

Trackers include:

- habits
- study
- mood
- health
- reading
- finance
- progress
- custom trackers

Required early:

- check-ins
- skipped vs failed distinction
- streak logic
- notes per check-in
- calendar heatmap
- weekly/monthly review
- reminders
- linked goals/tasks/notes

### 27.4 Goals

Goals connect:

- projects
- tasks
- trackers
- notes
- calendar events
- deadlines

Required:

- long-term goals
- short-term goals
- milestones
- progress
- reason/why
- status
- priority
- archive

### 27.5 Birthdays

Birthdays live in both People and Calendar.

People owns the personal context.
Calendar displays reminders/events.

---

## 28. People

People is personal knowledge, not CRM.

Required:

- person profile page
- relationship/context notes
- where known from
- important dates
- birthday
- linked pages
- linked documents
- linked projects
- linked meetings/events
- linked tasks
- trust/context labels if user wants
- relationship graph
- private/blur behavior later

No Google Contacts sync for now.

Communication history is manual notes only unless explicitly built later.

---

## 29. Finance

Finance should be more advanced than simple expense notes, but not bank-synced.

### 29.1 Required finance scope

- expenses
- income
- accounts
- cash/wallet accounts
- budgets
- categories
- receipts
- subscriptions
- bills
- loans
- debt tracking
- payment records
- recurring payments
- monthly review
- category reports
- CSV export
- finance dashboard based on real data only
- finance notes
- document/receipt linking
- bill/subscription calendar events

### 29.2 Rejected finance scope

Do not add:

- bank sync
- payment APIs
- tax engine
- multi-user accounting
- online finance connections
- business accounting complexity

### 29.3 Finance records as pages

Finance records are pages/page-like records.

Receipts are document/file records linked to finance records.

Subscriptions and bills can appear on calendar.

---

## 30. Privacy and Security

### 30.1 Security levels

Security comes later after core storage is 100% working.

Level 1:

- local-only
- no telemetry
- import validation
- lock file
- backup warnings
- secure temp cleanup

Level 2:

- app security code
- private pages
- blurred private previews
- hidden from recent/search/graph unless unlocked
- encrypted backups after backup engine is stable

Level 3:

- full vault encryption later
- per-page encryption later if ever needed

### 30.2 Security code

A security code is not encryption.

The app must say this honestly.

Allowed wording:

```text
Security code locks the app interface. It is not full vault encryption.
```

### 30.3 Private content behavior

Private content can:

- blur previews
- hide from recent
- hide from graph
- hide from search
- require unlock
- show lock indicator

Identity documents, sensitive finance, private people pages, medical records, private journals, and personal media should support privacy defaults later.

### 30.4 Logs

Logs are local-only.

User decision: logs may include full details.

Therefore:

- log all file operations
- log errors
- log paths
- log migrations
- log backup/restore
- log repairs
- log security events
- never upload logs
- warn user that logs may contain sensitive information

---

## 31. Backup, Restore, Repair, Migration

Backup/restore is core, not optional.

### 31.1 Backup types

- manual backup
- automatic backup
- before migration
- before restore
- before import batch
- before media edit
- weekly snapshot
- monthly archive

### 31.2 Backup includes

Every microscopic detail:

- vault identity
- SQLite database
- WAL/checkpoint state after safe close
- page folders
- Markdown mirrors
- JSON mirrors
- metadata files
- placement files
- relations/graph files
- attachments
- media originals
- edits
- previews/thumbnails if useful
- templates
- themes
- settings
- logs
- indexes if useful
- trash
- restore staging if needed
- migration history
- repair history

### 31.3 Backup rules

- Never migrate without backup.
- Never destructive-delete without backup.
- Restore into new folder first.
- Failed restore must not damage current vault.
- Validate backup before claiming success.
- Backup must include manifest and checksums.

### 31.4 Repair tools

Required:

- health check vault
- rebuild everything safe
- database integrity check
- missing attachment repair
- thumbnail rebuild
- search index rebuild
- graph index rebuild
- backlinks rebuild
- mirror regeneration
- stale lock recovery
- trash restore
- metadata repair
- broken preview rebuild
- orphan page detection
- duplicate file detection
- page folder/database mismatch repair

### 31.5 Migration rules

- Backup first.
- Show what migration will change.
- Run dry-run if possible.
- Log every step.
- If migration fails, rollback.
- Never fake migration success.

---

## 32. Error Handling

Mizaan must handle errors like a lifetime data app.

### 32.1 Required error cases

Handle:

- vault folder missing
- USB/external drive removed
- permission denied
- disk full
- corrupt SQLite
- corrupt JSON
- corrupt metadata file
- broken Markdown mirror
- stale lock
- schema too new
- schema too old
- preview generation failed
- LibreOffice unavailable
- VLC unavailable
- FFmpeg unavailable
- duplicate file
- checksum mismatch
- bad shutdown
- failed backup
- failed restore
- failed migration
- file path too long
- unsupported file type
- thumbnail rebuild failed
- user cancels operation
- app crash during write

### 32.2 USB/external drive removal

If vault disappears:

1. Stop writes immediately.
2. Freeze workspace editing or switch to read-only emergency mode.
3. Show clear warning.
4. Keep unsaved in-memory changes separate.
5. Do not claim autosave succeeded.
6. Offer reconnect check.
7. After reconnect, run integrity check.
8. Recover from last committed write.
9. Log event.

### 32.3 Disk full

If disk full:

- stop operation
- rollback temp files
- preserve previous state
- show exact action that failed
- show required/free space if possible
- log

### 32.4 Preview failure

Preview failure must not block import.

Show:

```text
File stored safely. Preview could not be generated.
```

Offer:

- retry preview
- open file
- reveal in folder
- view metadata

---

## 33. Import/Export from Other Apps

Current decision:

```text
Do not prioritize import from other apps.
Build Mizaan's own system first.
```

Still required eventually for portability:

- Markdown export
- PDF export
- DOCX export later
- CSV export
- ICS export
- full vault backup ZIP
- selected page/tree export
- media export
- graph JSON/image export

No Notion/Obsidian import in early phases unless explicitly requested later.

---

## 34. Implementation Roadmap From Scratch

This roadmap assumes the app is not built, but agents must still inspect and preserve the current codebase if it exists.

This roadmap is not a suggestion list.

It is the mandatory implementation order for Mizaan.

Every phase must obey:

```text
Section 36 — Codex / AI Agent Implementation Rules
Section 37 — Lifelong QA, Proof, Performance, Installer, Runtime, Release, and Final Acceptance Gate
```

No phase is complete because code was written.

No phase is complete because the UI appears.

No phase is complete because an agent says it is done.

A phase is complete only when:

```text
the real feature exists
the feature persists after app restart
the feature has error handling
the feature has tests or manual QA evidence
the feature has a report
the matching Section 37 gate passes
```

Implementation must proceed in this order:

```text
1. Audit truth.
2. Preserve working foundations.
3. Make the desktop/native boundary real.
4. Make vault lifecycle real.
5. Make SQLite and filesystem storage real.
6. Make page folders and mirrors real.
7. Make autosave and atomic writes safe.
8. Make file import and metadata real.
9. Make backup, restore, and repair real.
10. Make document/media/helper pipelines real.
11. Make search, graph, and life modules real.
12. Make privacy, installer, performance, and release proof real.
```

Do not build advanced features before safety foundations pass.

---

### 34.1 Roadmap-to-Gate Mapping

Each implementation phase must map to one or more proof gates from Section 37.

```text
Phase 0  → Gate 0
Phase 1  → Gate 0 / Gate 14 language cleanup evidence
Phase 2  → Gate 12
Phase 3  → Gate 1
Phase 4  → Gate 2
Phase 5  → Gate 3 / Gate 4
Phase 6  → Gate 7
Phase 7  → Gate 8 / Gate 12
Phase 8  → Gate 4 / Gate 14
Phase 9  → Gate 10
Phase 10 → Gate 10
Phase 11 → Gate 9
Phase 12 → Gate 9
Phase 13 → Gate 9
Phase 14 → Gate 10
Phase 15 → Gate 10 / Gate 11
Phase 16 → Gate 5 / Gate 6
Phase 17 → Gate 11
Phase 18 → Gate 14
Phase 19 → Gate 13 / Gate 14
```

A phase is not complete until its mapped gate evidence exists.

---

### 34.2 Phase 0 — Current Repo Audit and Canonical Docs

Goal:

Create one canonical implementation plan and remove contradiction risk.

Tasks:

```text
inspect app root
inspect package scripts
inspect docs
inspect storage/provider code
inspect routes/components
inspect tests
detect Git presence
detect current implemented features
detect prototype-only features
detect fake UI
detect stale docs
detect missing architecture
create/update docs/mizaan-a-to-z-implementation-master-plan.md
create/update docs/current-codebase-status.md
create/update docs/current-codebase-baseline-audit.md
create/update docs/contradictions-resolved.md
create/update docs/implementation-progress-report.md
mark stale docs if needed
do not delete user data
do not delete useful docs without recording why
```

Required audit questions:

```text
What currently works?
What is prototype-only?
What is fake UI?
What is not implemented?
What is partially implemented?
What can be preserved?
What must be replaced?
What risks data loss?
What tests currently exist?
What commands currently pass?
What docs are canonical?
What docs are stale?
```

Done when:

```text
current state is documented honestly
no fake readiness claims remain
all future tasks use this plan as canonical
docs/current-codebase-baseline-audit.md exists
docs/current-codebase-status.md exists
typecheck/lint/test/build status is recorded
known fake/prototype features are listed
implementation risks are listed
```

Mapped gate:

```text
Gate 0 — Current Codebase Audit
```

---

### 34.3 Phase 1 — Product Language Reset

Goal:

Remove old confusing terminology.

Tasks:

```text
remove promotedAsSpace concept from future-facing docs/code gradually
replace permanent “space” with page/root page/pinned page/module shortcut
keep Space only as session/active working context
update sidebar labels
update seed data terminology
update tests
update docs
update UI copy
remove misleading fake readiness copy
```

Canonical vocabulary:

```text
Page = saved object
Space = currently opened working context
Template = creation blueprint
Module = app-level tool
Workspace View = the screen where pages/modules are opened
Vault = local data container
```

Done when:

```text
database/storage uses Page/Item
Space is only UI/session state
templates are blueprints
old misleading terminology is removed or marked legacy
tests updated
UI copy matches canonical vocabulary
```

Mapped gate:

```text
Gate 0 / Gate 14
```

---

### 34.4 Phase 2 — Windows/Tauri Shell Boundary

Goal:

Make Mizaan a Windows desktop app without breaking the current app.

Tasks:

```text
verify Windows build tools
inspect current frontend build
add Tauri shell
preserve React/TanStack UI
add native command boundary
add app window state
add filesystem permissions carefully
add native folder picker
add native path utilities
add native app close handling
add native error handling foundation
add sidecar planning for LibreOffice/VLC/FFmpeg
add runtime manifest planning
preserve browser prototype fallback if needed
```

Required proof:

```text
desktop shell opens
existing UI still works
native folder picker works
window resize works
app can close cleanly
native errors do not crash UI silently
browser fallback still works if intentionally preserved
```

Done when:

```text
app runs as Windows desktop shell
existing UI still works
browser prototype fallback still works if needed
native command boundary exists
filesystem permissions are explicit
Tauri/native build status is recorded
```

Mapped gate:

```text
Gate 12 — Installer, Runtime, Portable Mode, and Helper Repair
```

---

### 34.5 Phase 3 — Real Vault Creation, Open, Close, and Sign Off

Goal:

Create, open, close, and sign off real vault folders.

Tasks:

```text
create vault folder structure
write vault identity file
write local user profile
create lock file
remove lock file safely on close
create recent vaults
implement sign off
implement stale lock warning
implement force unlock warning
implement read-only open
implement invalid vault rejection
implement vault health screen foundation
support vault on internal drive
support vault on USB/external drive
support opening another user’s vault after sign off
```

Required vault identity must include:

```text
vault ID
vault display name
vault owner/profile name
created local time
created UTC time
created timezone
created country if available
schema version
Mizaan version
last opened info
```

Done when:

```text
user can create vault on internal drive, USB, and external drive
close/reopen works
sign-off lets another user open another vault
invalid vault is rejected safely
lock file behavior is visible and testable
read-only open works
```

Mapped gate:

```text
Gate 1 — Vault Creation, Open, Close, and Sign Off
```

---

### 34.6 Phase 4 — SQLite Provider

Goal:

Replace localStorage as lifetime storage.

Tasks:

```text
create SQLite database file
create schema version system
create migrations table
create core schema
implement provider methods
implement pages persistence
implement blocks persistence
implement relations persistence
implement settings persistence
implement logs persistence
preserve LocalStorage provider only as prototype/import fallback
ensure UI goes through services/provider
write tests
document migration from prototype state if needed
```

Required proof:

```text
page created in UI writes to SQLite
block edits write to SQLite
relations write to SQLite
close app and reopen data
localStorage is not final storage
provider boundary is respected
```

Done when:

```text
pages/blocks/relations persist to SQLite
settings persist to SQLite
localStorage is not lifetime storage
migrations exist
schema version exists
basic provider tests pass
```

Mapped gate:

```text
Gate 2 — SQLite and Folder Structure
```

---

### 34.7 Phase 5 — Page Folder and Mirror Writer

Goal:

Every page has readable folder output.

Tasks:

```text
create page folder immediately on page creation
use canonical folder naming
write page Markdown by type
write page.json
write page info files
write identity map
write folder/name history
write metadata source/editable/resolved/correction files
write edit history
write import history
write graph/relation placeholders
write search/extracted text placeholders
write Subpages folder
autosave every 5 seconds
implement mirror regeneration
implement external mirror edit detection
implement mirror checksums
implement malformed mirror handling
```

Required folder behavior:

```text
folder uses local creation time
folder includes country token
folder includes short stable page ID
full internal page ID goes in page info files
folder title portion can change on rename
creation date/time/country do not change after rename
old folder names are recorded
```

Done when:

```text
page exists in SQLite and human-readable folder
page Markdown exists
page.json exists
page info exists
metadata files exist
app can reopen from database
user can inspect folder outside app
deleted mirror can be regenerated
externally edited mirror triggers conflict
```

Mapped gates:

```text
Gate 3 — Page Folders and Mirrors
Gate 4 — Autosave and Atomic Writes
```

---

### 34.8 Phase 6 — File Import Foundation

Goal:

Import files safely into page folders.

Tasks:

```text
ask copy or move every time
no external link option
copy file into vault
move file into vault
preserve original filename in metadata
create safe stored filename if needed
checksum SHA-256
duplicate detection
file mini-folders
info files
metadata files
placement files
edit history
version history
Inbox flow
folder import foundation
unknown file storage
missing file detection
checksum mismatch detection
repair missing file flow
```

Supported early files:

```text
PDF
images
video
audio
Office files
TXT
Markdown
CSV
JSON as file or app-managed safe import
unknown files
```

Done when:

```text
PDFs/images/videos/audio/docs/text/unknown files store safely
preview failure does not break import
metadata files are created
placement files are created
duplicates are detected
missing files are reported
```

Mapped gate:

```text
Gate 7 — File Import and Metadata
```

---

### 34.9 Phase 7 — Document and Media Preview Engines

Goal:

Make files viewable inside Mizaan.

Tasks:

```text
PDF preview
PDF page count
PDF metadata
PDF text extraction where available
image preview
video/audio playback
text/Markdown/CSV preview/edit
JSON safe viewer/editor
LibreOffice-powered Office preview
Office preview PDF/image generation
Office managed edit workflow
pre-edit snapshot
post-edit checksum detection
FFmpeg thumbnails/metadata
VLC/libVLC if needed
viewer health manager
helper runtime manifest
helper runtime health checks
helper failure messages
```

Required safety rule:

```text
File storage must never fail just because preview fails.
```

Required Office rule:

```text
No pre-edit snapshot, no edit.
```

Done when:

```text
common files are previewable inside Mizaan
Office files store safely
Office preview works when helper succeeds
Office preview failure is visible and repairable
Office edit preserves originals and versions
helper engine failures are honest and repairable
```

Mapped gates:

```text
Gate 8 — Documents, PDF, Office, Text, and Media
Gate 12 — Installer, Runtime, Portable Mode, and Helper Repair
```

---

### 34.10 Phase 8 — Editor Hardening

Goal:

No content loss.

Tasks:

```text
autosave queue
dirty state tracking
save status UI
undo/redo
block movement
block nesting foundation
slash commands
markdown shortcuts
snapshots
revisions
conflict detection
external edit detection
malformed mirror handling
crash/reopen survival
consider Tiptap/Lexical migration if current editor is too fragile
```

Done when:

```text
page editing is reliable
typing does not freeze
autosave works
save failures are visible
content survives close/reopen
content survives realistic crash/reopen scenarios
undo/redo works for supported operations
```

Mapped gates:

```text
Gate 4 — Autosave and Atomic Writes
Gate 14 — Final Release Acceptance
```

---

### 34.11 Phase 9 — Templates

Goal:

Templates create one page or page systems.

Tasks:

```text
built-in template registry
user templates
hide built-in templates
delete user templates
edit templates in app
template origin tracking
template-created page systems
template versioning
template import/export later
template restore behavior
template-generated child pages/databases/tasks/calendar/tracker structures
```

Done when:

```text
templates are real blueprints, not visual presets
templates persist
templates generate correct page systems
built-in templates can be hidden
user templates can be edited/deleted
template origin is recorded
```

Mapped gate:

```text
Gate 10 — Calendar, Tasks, Trackers, Goals, Finance, People
```

---

### 34.12 Phase 10 — Database Engine

Goal:

Build Notion-like databases locally.

Tasks:

```text
table view
list view
custom properties
property definitions
filters
sorting
grouping
row pages
saved views
database relations
database row page folders where needed
board view later
calendar view later
gallery view later
timeline later
relations/rollups/formulas later
```

Done when:

```text
database rows can be pages
database remains local
database persists to SQLite
database is exportable/recoverable
views are saved
filters/sorts work
```

Mapped gate:

```text
Gate 10 — Calendar, Tasks, Trackers, Goals, Finance, People
```

---

### 34.13 Phase 11 — Search and Indexing

Goal:

Search everything real.

Tasks:

```text
title search
block full-text search
tag search
property search
file search
trash-aware search
private lock indicator
extracted document text
OCR later
search index table
search rebuild
search health check
missing index repair
```

Done when:

```text
search results are fast, accurate, and repairable
search survives restart
trash results are labeled
private/locked state is respected
search index can be rebuilt
```

Mapped gate:

```text
Gate 9 — Search, Backlinks, Relations, and Graph
```

---

### 34.14 Phase 12 — Relations, Backlinks, and Graph Index

Goal:

Build real graph data.

Tasks:

```text
explicit relations
wiki links
backlinks
outgoing links
tags
date mentions
file links
attachment links
task links
calendar links
finance links
people links
page parent-child links
adjacency files
graph edge tables
graph node tables
rebuild graph index
orphan/unlinked node detection
private node behavior
```

Done when:

```text
graph is generated from real data
no fake graph nodes
backlinks are real
outgoing links are real
graph index is rebuildable
orphan/unlinked nodes are visible
```

Mapped gate:

```text
Gate 9 — Search, Backlinks, Relations, and Graph
```

---

### 34.15 Phase 13 — Graph UI and Manual Canvas

Goal:

Global/local/manual graphs.

Tasks:

```text
global graph
automatic local graph
orphan nodes visible
blurred private nodes
attachments visible by default
manual A4 canvas
manual endless canvas
manual node/edge labels
manual relation direction
selected drawing area to node
manual graph persistence
graph layout persistence
graph export later
```

Done when:

```text
graph is usable for discovery
manual graph saves/reopens
manual nodes can exist with or without linked pages
manual graph data is persisted
private nodes are blurred/hidden according to rules
```

Mapped gate:

```text
Gate 9 — Search, Backlinks, Relations, and Graph
```

---

### 34.16 Phase 14 — Calendar, Tasks, Trackers, and Goals

Goal:

Build local planning engine early.

Tasks:

```text
local calendar
day/week/month/agenda views
recurring events
recurrence exceptions
ICS import/export
reminders
task engine
task blocks that can create real tasks
task statuses
task dependencies
tracker engine
habit/study/mood/health/reading/progress trackers
skipped vs failed logic
goals engine
goals linked to tasks/projects/trackers/calendar
tasks on calendar
birthdays in people/calendar
```

Done when:

```text
planning works offline
planning links to pages
calendar events are ICS-friendly
tasks survive restart
trackers store check-ins
goals connect to pages/tasks/projects
```

Mapped gate:

```text
Gate 10 — Calendar, Tasks, Trackers, Goals, Finance, People
```

---

### 34.17 Phase 15 — Finance and People Engines

Goal:

Build serious personal finance and personal knowledge systems.

Finance tasks:

```text
finance records/pages
accounts
categories
budgets
subscriptions
bills
loans
receipts/documents linking
calendar links
finance search/filtering
finance export
no bank sync
```

People tasks:

```text
people profiles
relationship graph
people events
privacy blur later
links to pages/tasks/events/files/projects
manual communication notes only
no CRM sales framing
```

Done when:

```text
finance is useful but not bank-synced
people is personal knowledge, not CRM
finance/people data persists
records link to pages and documents
privacy flags work where implemented
```

Mapped gates:

```text
Gate 10 — Calendar, Tasks, Trackers, Goals, Finance, People
Gate 11 — Privacy and Security
```

---

### 34.18 Phase 16 — Backup, Restore, and Repair

Goal:

Make Mizaan trustworthy.

Tasks:

```text
full vault backup
backup manifest
checksum manifest
automatic backups
manual backups
external backup target
pre-migration backups
pre-destructive-operation backups
restore preview
restore to new folder
restore validation
repair tools
health check
rebuild everything safe
bad shutdown recovery
damaged SQLite recovery
missing mirror repair
malformed JSON repair
missing file repair
search rebuild
graph rebuild
thumbnail rebuild
backup restore drill
```

Done when:

```text
user can destroy app and recover vault
backup can be validated
backup can be restored into a new vault
restore does not overwrite current vault by default
repair tools are real
health check detects real problems
```

Mapped gates:

```text
Gate 5 — Backup and Restore
Gate 6 — Repair and Recovery
```

---

### 34.19 Phase 17 — Privacy and Security Code

Goal:

Protect sensitive local content honestly.

Tasks:

```text
app security code
manual lock
idle lock
private pages
private files
blurred previews
hidden recent/search/graph until unlock
privacy indicators
private trash behavior
private backup flag
secure temp cleanup
no false encryption claim
encrypted backups later
full vault encryption later
```

Done when:

```text
privacy behavior is consistent and honest
private content does not leak in Home/recent/search/graph
security copy is truthful
app does not claim encryption before encryption exists
```

Mapped gate:

```text
Gate 11 — Privacy and Security
```

---

### 34.20 Phase 18 — Export and Portability

Goal:

Never trap the user.

Tasks:

```text
Markdown export
page tree export
full vault package
selected files/media export
backup manifest export
health report export
PDF export
DOCX export later
CSV export
ICS export
media export
graph JSON export
graph image export
template export later
```

Done when:

```text
data can leave Mizaan safely
exports do not delete originals
exports preserve useful structure
full vault package can be inspected
export is not confused with backup
```

Mapped gate:

```text
Gate 14 — Final Release Acceptance
```

---

### 34.21 Phase 19 — QA, Proof, Performance, and Release Hardening

Goal:

Prove app works.

Tasks:

```text
unit tests
integration tests
storage tests
migration tests
backup/restore tests
file import tests
metadata tests
document preview tests
Office helper tests
graph/search tests
calendar recurrence tests
task reminder tests
Tauri command tests
browser UI tests
Tauri desktop UI tests
clean Windows install test
USB/external drive test
bad shutdown test
drive removed test
disk full test
permission denied test
large vault performance test
installer test
portable mode test
helper runtime repair test
final release report
```

Done when:

```text
features are proven, not just visually present
all required gates pass
large vault tests pass
installer tests pass
restore drill passes
known limitations are documented
no fake UI remains
```

Mapped gates:

```text
Gate 13 — Performance and Scale
Gate 14 — Final Release Acceptance
```

---

### 34.22 Phase Advancement Rule

Agents must not move to the next phase unless the previous phase has:

```text
implementation report
test results
manual QA evidence if UI changed
known limitations
risk rating
gate status
```

A phase may be marked:

```text
passed
partially passed
blocked
deferred
unsafe
```

Only `passed` allows normal advancement.

If a phase is `partially passed`, the next phase may begin only if the missing part is non-destructive and documented.

If a phase is `blocked` or `unsafe`, implementation must stop or switch to repair.

---

## 35. Required Test Matrix

This section defines the minimum proof required during implementation.

Tests are not optional.

A feature is not implemented unless it can be tested or manually verified.

---

### 35.1 Required Commands

Run when applicable:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
git diff --check
```

When Tauri/native exists:

```bash
cargo fmt --check
cargo check
cargo test
npm run tauri:build
```

Before running any command:

```text
inspect package.json
verify script exists
verify Tauri/Rust config exists before running native commands
do not invent scripts
```

If a command fails, record:

```text
command
result
error summary
likely cause
risk level
next fix
```

Forbidden:

```text
do not claim tests passed if not run
do not claim build passed if not run
do not hide command failures
do not treat manual confidence as test proof
```

---

### 35.2 Browser/Tauri QA

Must test when applicable:

```text
first launch
create vault
open vault
close vault
sign off
create page
create subpage
rename page
move page
edit block
autosave
save failure state
close/reopen
import image
import PDF
import Office file
import video
import audio
import unknown file
copy/move prompt
duplicate file
missing file repair
create template
create from template
search
graph
calendar recurrence
task reminder
tracker check-in
finance record
people profile
backup
restore
trash/restore
privacy lock indicator
vault health
repair screen
settings persistence
no dead buttons
no fake UI
```

Screenshots are required when:

```text
UI changed
error state changed
success flow changed
empty state changed
desktop shell changed
theme/layout changed
```

---

### 35.3 Failure Tests

Must test:

```text
USB removed during editing
USB removed during mirror write
disk full
permission denied
stale lock
corrupt metadata JSON
corrupt page.json
corrupt SQLite copy
preview engine missing
helper runtime damaged
backup validation failure
restore failure
migration failure
schema too new
Office helper crash
file locked during edit
folder rename failure
missing imported file
checksum mismatch
```

Each failure test must prove:

```text
no silent data loss
clear user message
log entry exists
repair/retry option exists where possible
app does not fake success
```

---

### 35.4 Data Durability Tests

Must test:

```text
create vault → close app → reopen vault
create page → close app → reopen page
edit page → close app → reopen edited page
create subpage → close app → reopen parent/child
create relation → close app → relation remains
create backup → restore into new folder
delete mirror → regenerate from SQLite
corrupt SQLite → recover from mirrors where possible
edit mirror outside app → conflict screen
malformed metadata → warning and preserve file
```

---

### 35.5 Performance Tests

Minimum generated-vault test:

```text
10,000 pages
100,000 blocks
50,000 files
10,000 relations
5,000 calendar events
10,000 tasks
10GB vault
```

Long-term stress target:

```text
50,000 pages
500,000 blocks
250,000 files
100GB+ vault
```

Measure:

```text
app launch time
vault open time
Home load time
page open time
typing responsiveness
autosave cost
search first result time
graph load time
backup time
restore time
health check time
memory usage
CPU usage
```

Report results in:

```text
docs/performance-report.md
```

---

### 35.6 Restore Drill Tests

Backup is not trusted until restore is tested.

Must test:

```text
create backup
validate backup
restore into new folder
open restored vault
compare page count
compare file count
compare checksums
rebuild search
rebuild graph
verify metadata files
verify private flags
verify trash state
verify settings
```

Report results in:

```text
docs/backup-restore-drill-report.md
```

---

## 36. Codex / AI Agent Implementation Rules

This section is mandatory for any AI agent.

These rules exist because AI agents can hallucinate, overbuild, delete useful work, skip verification, or claim success without proof.

---

### 36.1 Operating Mode

Work autonomously.

Do not ask questions unless:

```text
user data might be permanently destroyed
credentials/secrets/deployment are needed
legal/licensing blocker exists
repository state makes requested operation impossible
```

If no question is required, continue.

If a safe best-effort decision is available, make the decision and document it.

---

### 36.2 Before Coding

Always:

```text
inspect project root
inspect package.json
inspect current docs
inspect relevant source files
check Git status if .git exists
inspect current storage/provider code
inspect current routes/components
inspect current tests
identify user changes
do not discard user changes
create/update implementation status report
```

Required report:

```text
docs/current-codebase-status.md
```

---

### 36.3 Git Rules

If `.git` exists, run:

```bash
git status
git branch --show-current
git rev-parse HEAD
```

After work, run the current equivalent of:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
git diff --check
git status
```

Commit if requested/expected and Git is available.

Push only if remote exists and push is explicitly part of task.

If `.git` does not exist:

```text
do not fake commit hash
do not claim push happened
create a report saying Git is unavailable
still produce changed files
```

---

### 36.4 Destructive Operation Rules

Forbidden without backup:

```text
deleting user data
clearing localStorage migration source
deleting page folders
deleting attachments
deleting templates
permanent trash purge
overwriting vault
migration rewrite
restore overwrite
bulk rename
bulk move
schema migration
mirror regeneration that overwrites externally edited files
```

Required:

```text
backup before destructive action
log destructive action
user-visible confirmation for permanent delete
repair path if destructive operation fails
```

---

### 36.5 No Hallucination Rules

AI agent must not claim:

```text
SQLite works unless tested
Tauri works unless built/tested
backup works unless backup/restore tested
restore works unless restored vault opens
graph is real unless generated from real data
document import works unless files actually imported
Office editing works unless preview/edit/detection tested
privacy works unless search/recent/graph/private behavior tested
installer works unless installed/tested
portable mode works unless tested from portable path
performance is good unless measured
```

---

### 36.6 Required Reports

Each major implementation must update/create:

```text
docs/current-codebase-status.md
docs/implementation-progress-report.md
docs/qa-report.md
docs/known-limitations.md
docs/error-handling-report.md
docs/gate-acceptance-report.md
docs/performance-report.md when performance is tested
docs/installer-runtime-report.md when installer/runtime is touched
docs/backup-restore-drill-report.md when backup/restore is touched
docs/migration-report.md when schema/migration is touched
```

---

### 36.7 Report Honesty Rules

Reports must distinguish:

```text
implemented
partially implemented
prototype-only
fake/placeholder
not implemented
blocked
removed
deferred
```

Reports must not use vague claims such as:

```text
done
mostly done
ready enough
basically working
looks good
probably fine
```

unless backed by evidence.

---

### 36.8 Stop Conditions

Stop or switch to repair if:

```text
tests fail after attempted fix
build fails after attempted fix
user data risk is detected
migration fails
backup cannot be created before destructive work
restore cannot be validated
repository state is inconsistent
native toolchain is missing and required
```

If stopped, create a report explaining:

```text
what was attempted
what failed
what is safe
what is unsafe
what must happen next
```

---

## 37. Lifelong QA, Proof, Performance, Installer, Runtime, Release, and Final Acceptance Gate

This section is the final proof layer for Mizaan.

No feature is considered complete because it looks complete.

No feature is considered safe because it works once.

No feature is considered ready because Codex, Claude, Gemini, or any AI agent says it is ready.

A feature is ready only when it has:

```text
real implementation
real storage behavior
real error handling
real persistence
real backup/restore behavior where relevant
real tests
manual QA evidence
clear failure handling
no fake UI
no silent data loss
no hidden cloud dependency
no unresolved migration risk
```

This section exists to make Mizaan a lifelong app, not a prototype.

---

### 37.1 Core QA Principle

Mizaan is a local-first lifetime vault app.

Therefore, the QA standard is stricter than a normal web app.

A normal app can fail and reload.

Mizaan must protect the user’s life data.

Core QA rule:

```text
If a failure can damage, hide, orphan, corrupt, overwrite, misplace, or silently lose user data, that failure must be tested.
```

Mizaan must be tested against:

```text
normal use
long-term use
large vaults
offline use
USB/external drive use
app crashes
system crashes
disk full errors
permission errors
corrupt files
corrupt SQLite
malformed JSON
missing helper runtimes
failed preview generation
failed backup
failed restore
failed migration
schema mismatch
stale locks
private content leakage
```

---

### 37.2 No Fake Readiness Rule

A screen is not a feature.

A button is not a workflow.

A route is not implementation.

A file existing in the repo is not proof.

A markdown plan is not proof.

A passing build is not enough.

A feature is not ready unless it passes its required tests and manual QA.

Examples:

```text
A Backup button is not a backup engine.
A Graph route is not a graph system.
A Vault Health page is not a repair system.
A file card is not an import pipeline.
A document preview box is not an Office/PDF pipeline.
A privacy toggle is not private content behavior.
A database table UI is not a database engine.
A settings page is not a settings persistence system.
```

Every implementation report must classify each feature as exactly one of:

```text
implemented
partially implemented
prototype-only
fake/placeholder
not implemented
blocked
removed
deferred
```

Do not use vague words such as:

```text
done
mostly done
basically working
ready enough
probably fine
looks okay
```

unless backed by evidence.

---

### 37.3 Required Evidence for Every Implementation Pass

Every implementation pass must produce evidence.

Minimum required evidence:

```text
summary of files changed
summary of behavior changed
commands run
test results
build result
lint result
typecheck result
manual QA performed
screenshots if UI changed
known failures
known limitations
risk assessment
next required fixes
```

Required report format:

```text
What changed:
[exact summary]

What was preserved:
[existing behavior that still works]

Commands run:
[command]
[result]

Manual QA:
[route/screen/workflow tested]
[result]

Evidence:
[screenshot path, report path, logs, terminal output summary]

Known issues:
[list or "none found"]

Risk:
[low/medium/high]

Final verdict:
[ready / partially ready / blocked / unsafe]
```

A report must not say “verified” unless verification actually happened.

---

### 37.4 Required Commands

After meaningful code changes, run the current equivalent of:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

If the project later includes Tauri/native commands, also run the current equivalent of:

```bash
npm run tauri:dev
npm run tauri:build
cargo fmt --check
cargo check
cargo test
```

Only run commands that actually exist in the current repository.

Before running commands, verify `package.json`, Tauri config, and Rust project files.

If a command fails, the report must include:

```text
command
full error summary
likely cause
files involved
whether user data is at risk
next fix
```

If a command cannot be run, the report must say why.

Forbidden:

```text
Do not claim tests passed if they were not run.
Do not claim build passed if it was not run.
Do not hide failed commands.
Do not replace failed tests with manual confidence.
Do not mark blocked work as complete.
```

---

### 37.5 Browser and Desktop QA

If UI changes are made, manual UI QA is required.

For browser/web shell QA, test:

```text
Home
first launch
vault route
settings
workspace/page editor
templates
search
graph
documents
projects
people
finance
calendar
trackers
trash
backup/restore screens
vault health
repair screens
```

For desktop/Tauri QA, test:

```text
app launch
window resize
native folder picker
vault open
vault close
sign off
file import
file reveal in folder
helper runtime launch
offline behavior
USB/external drive behavior
app close/reopen
```

Screenshots must be captured for any visual workflow that changed.

Screenshot evidence should include:

```text
before screenshot if relevant
after screenshot
error state screenshot
empty state screenshot
success state screenshot
dark/light theme if affected
```

---

### 37.6 Lifelong Reliability Gates

Implementation must pass gates in order.

Do not build advanced features before foundational gates pass.

#### Gate 0 — Current Codebase Audit

Must prove:

```text
current project structure inspected
package scripts verified
routes inspected
providers inspected
storage layer inspected
prototype-only features identified
fake UI identified
existing useful features preserved
audit report written
```

Exit criteria:

```text
docs/current-codebase-baseline-audit.md exists
typecheck/lint/test/build status recorded
known fake/prototype features listed
implementation risks listed
```

#### Gate 1 — Vault Creation, Open, Close, and Sign Off

Must prove:

```text
create vault works
open vault works
close vault works
sign off works
recent vaults work
vault identity file exists
lock file behavior exists
read-only open exists
invalid vault rejected safely
```

Exit criteria:

```text
user can create a vault
user can close/reopen the vault
user can sign off and open another vault
no cloud login required
no internet required
```

#### Gate 2 — SQLite and Folder Structure

Must prove:

```text
SQLite database created
schema version stored
vault folder structure created
01_System exists
02_Library exists
database path correct
system files visible but app-managed
health check can inspect structure
```

Exit criteria:

```text
SQLite and visible folders agree
no localStorage final dependency
no fake vault status
```

#### Gate 3 — Page Folders and Mirrors

Must prove:

```text
page creation creates SQLite row
page creation creates folder
folder name follows canonical naming
page markdown file exists
page.json exists
page info files exist
metadata files exist
edit history exists
subpage structure works
folder rename works
rename failure has repair path
```

Exit criteria:

```text
page can be created, renamed, reopened, and recovered from readable files
```

#### Gate 4 — Autosave and Atomic Writes

Must prove:

```text
autosave every 5 seconds
SQLite transaction safe
mirror update queued
temp-file-then-rename strategy used where possible
save status visible
save failure visible
disk write failure handled
USB removal handled
```

Exit criteria:

```text
no silent save failure
no half-written critical files in normal tested failure cases
```

#### Gate 5 — Backup and Restore

Must prove:

```text
backup creation works
backup manifest exists
backup includes SQLite
backup includes page folders
backup includes mirrors
backup includes files/media
backup includes metadata/history/settings/logs
backup validation works
restore preview works
restore into new folder works
restore does not overwrite current vault by default
```

Exit criteria:

```text
a backup can be restored and opened as a working vault
```

#### Gate 6 — Repair and Recovery

Must prove:

```text
health check works
missing mirror regeneration works
malformed JSON detected
missing file detected
corrupt SQLite handled
read-only recovery mode works
search index rebuild works
graph index rebuild works
thumbnail rebuild works
repair report generated
```

Exit criteria:

```text
common damage cases are visible, repairable, and do not silently destroy data
```

#### Gate 7 — File Import and Metadata

Must prove:

```text
copy file into vault works
move file into vault works
linked external files are not used if forbidden
checksums created
duplicates detected
file folders created
placement files created
metadata files created
metadata editable JSON validated
malformed metadata handled
```

Exit criteria:

```text
files can be imported safely and remain understandable in the page folder
```

#### Gate 8 — Documents, PDF, Office, Text, and Media

Must prove:

```text
PDF preview works
TXT/MD preview/edit works
CSV basic preview/edit works
Office files stored safely
Office preview conversion works if helper succeeds
Office preview failure does not block storage
pre-edit snapshot required before Office edit
post-edit checksum detection works
media thumbnails work if implemented
native playback works where supported
helper playback fallback works where implemented
```

Exit criteria:

```text
document/media handling never risks original file loss
```

#### Gate 9 — Search, Backlinks, Relations, and Graph

Must prove:

```text
search index works
search rebuild works
page links work
unresolved links tracked
backlinks generated
relations stored by stable IDs
graph uses real data
manual graph data stored
graph rebuild works
private content behavior respected
```

Exit criteria:

```text
graph/search are real systems, not fake demo visuals
```

#### Gate 10 — Calendar, Tasks, Trackers, Goals, Finance, People

Must prove:

```text
records stored in SQLite
records mirrored where needed
calendar events are ICS-friendly
tasks can be blocks and real task records
trackers store check-ins
finance records have categories/budgets/subscriptions/bills
people records link to pages/tasks/events/files
all records survive restart
```

Exit criteria:

```text
core life modules persist and relate through pages/relations
```

#### Gate 11 — Privacy and Security

Must prove:

```text
app lock/security code behavior works when implemented
private pages hidden/blurred from recent/search/graph as specified
security copy is honest
no false encryption claim
logs indicate sensitive/private state carefully
private files do not leak through previews where protected
```

Exit criteria:

```text
privacy behavior matches claims and does not fake encryption
```

#### Gate 12 — Installer, Runtime, Portable Mode, and Helper Repair

Must prove:

```text
Windows installer works
portable mode works if implemented
app can run offline after setup
helper runtimes detected
runtime manifest exists
helper health checks work
damaged helper gives repair warning
uninstall does not delete vault
app update does not migrate vault without backup
rollback path exists or is documented
```

Exit criteria:

```text
Mizaan behaves like one app while keeping vault data safe
```

#### Gate 13 — Performance and Scale

Must prove performance targets with generated or real large vaults.

Minimum target vault:

```text
10,000 pages
100,000 blocks
50,000 files
10,000 relations
5,000 calendar events
10,000 tasks
10GB vault
```

Long-term stress target:

```text
50,000 pages
500,000 blocks
250,000 files
100GB+ vault
```

Required measurements:

```text
app launch time
vault open time
Home load time
page open time
search first result time
graph load time
backup time
restore time
health check time
memory usage
CPU spikes
UI responsiveness
```

Exit criteria:

```text
large vaults remain usable
long operations show progress
UI does not freeze without status
```

#### Gate 14 — Final Release Acceptance

Must prove:

```text
all required gates passed
all tests pass
manual QA completed
restore drill completed
migration test completed
offline test completed
USB removal test completed
installer test completed
helper runtime test completed
large vault test completed
no fake UI remains
known limitations documented
```

Exit criteria:

```text
Mizaan can be trusted with real long-term personal data.
```

---

### 37.7 Durability and Chaos Test Suite

Mizaan must include durability tests.

Required tests:

```text
create vault → close app → reopen vault
create page → close app → reopen page
create page → kill app during autosave → reopen safely
create page → delete page.json → regenerate mirror
create page → corrupt page.json → show repair/conflict
create page → edit Markdown outside app → conflict screen
create metadata JSON → corrupt JSON → repair warning
create file import → delete file → missing file warning
create file import → checksum mismatch → health warning
create backup → restore into new folder
create backup → corrupt backup → validation fails safely
create migration → fail migration → rollback or read-only repair
create USB vault → remove drive during write → writes freeze
create USB vault → reconnect same drive → verify identity
open vault twice → lock warning/read-only behavior
schema too new → refuse or open read-only safely
disk full during mirror write → no partial overwrite
permission denied during folder rename → pending repair
Office edit helper crash → original preserved
preview generation fails → file remains stored safely
```

Each durability test must record:

```text
setup
action
expected result
actual result
data loss risk
logs created
repair path
pass/fail
```

No durability failure may be ignored.

---

### 37.8 Backup and Restore Drill Contract

A backup is not trusted until restore has been tested.

Backup types:

```text
internal snapshot
external backup
archive backup
pre-migration backup
pre-destructive-operation backup
manual user backup
automatic scheduled backup
```

Backup must include:

```text
SQLite database
page folders
Markdown mirrors
JSON mirrors
metadata files
placement files
attachments
media originals
edited outputs
versions
snapshots
templates
settings
logs
trash
backup manifest
migration history
repair history
runtime/helper settings
```

Restore drill must verify:

```text
backup manifest valid
checksums valid
page count matches
file count matches
SQLite opens
page folders exist
mirrors exist
metadata files exist
search can rebuild
graph can rebuild
private state preserved
trash state preserved
settings restored
logs restored where included
restored vault opens independently
current vault not overwritten
```

Required restore rule:

```text
Restore must default to a new vault folder.
Restore must not overwrite the current vault unless the user explicitly confirms and a backup exists.
```

---

### 37.9 Migration and Schema Compatibility Contract

Every schema change must be versioned.

Every migration must include:

```text
migration ID
old schema version
new schema version
preflight checks
backup requirement
dry-run support where possible
migration steps
rollback behavior
failure behavior
verification checks
migration report
```

Rules:

```text
Never migrate without backup.
Never silently downgrade a vault.
Never open a newer unsupported schema as writable.
Never destroy old schema data without migration proof.
Never hide migration failure.
```

Schema compatibility behavior:

```text
schema supported → open normally
schema old but migratable → offer migration with backup
schema old but not migratable → open read-only or recovery mode
schema newer than app supports → open read-only if safe or refuse safely
schema damaged → recovery mode
```

Migration tests must include:

```text
empty vault migration
small vault migration
large vault migration
vault with files
vault with subpages
vault with private pages
vault with backups
vault with malformed mirrors
failed migration rollback
schema too-new behavior
```

---

### 37.10 Performance and Scale Targets

Mizaan must be tested against realistic large vaults.

Minimum target:

```text
10,000 pages
100,000 blocks
50,000 files
10,000 relations
5,000 calendar events
10,000 tasks
10GB vault
```

Long-term target:

```text
50,000 pages
500,000 blocks
250,000 files
100GB+ vault
```

Performance targets for normal vault:

```text
app opens within acceptable desktop-app time
Home loads without long blank screen
page opens quickly after vault load
typing stays responsive
autosave does not freeze editor
search returns first results quickly
local graph opens without freezing
backup shows progress
restore shows progress
health check shows progress
large import shows progress
```

Performance rules:

```text
No long operation may freeze the UI without progress.
Large operations must be cancellable where safe.
Large operations must be resumable or repairable where possible.
Background work must not corrupt active editing.
Indexes must be rebuildable.
Caches must be disposable.
```

Performance report must include:

```text
vault size
page count
block count
file count
relation count
test machine details
operation timings
memory usage
CPU behavior
known bottlenecks
```

---

### 37.11 Installer, Runtime, Portable Mode, Update, and Rollback Rules

Mizaan must support a one-app user experience.

Installer rules:

```text
user installs Mizaan once
normal use works offline after setup
helper runtimes are bundled or installed during setup
vault is not stored inside app install folder by default
uninstall must not delete vault
installer must not overwrite existing vault
installer must verify required runtime files
```

Portable mode rules:

```text
portable app may live on internal drive, USB, external SSD, or portable hard drive
portable vault may live beside app if user chooses
portable mode must still use lock files
portable mode must still support backups
portable mode must still detect drive removal
portable mode must not mix helper binaries into page content folders
```

Runtime manifest must track:

```text
runtime name
runtime type
runtime path
version
enabled state
supported file types
last health check
last successful launch
repair status
```

Helper runtime failure behavior:

```text
vault still opens
affected feature is disabled or degraded
clear repair message shown
user data remains safe
no crash
no silent download during normal use
```

Update rules:

```text
app update must not delete vault
app update must not migrate schema without backup
app update must verify helper runtimes
app update must preserve settings
app update must support rollback or safe reinstall where possible
```

Rollback rules:

```text
if app update fails, vault remains untouched
if helper update fails, helper repair is offered
if schema migration happened, rollback requires pre-migration backup
if newer schema cannot be opened by older app, older app must refuse writable open
```

---

### 37.12 Provider Method Contracts and Transaction State Machines

Every provider method that changes user data must have a contract.

Contract must define:

```text
method name
purpose
inputs
outputs
SQLite changes
filesystem changes
mirror changes
index changes
log entries
backup/snapshot requirement
error cases
rollback behavior
pending repair behavior
tests
```

Required contracts:

```text
createVault()
openVault()
closeVault()
signOff()
createPage()
renamePage()
movePage()
deletePage()
trashPage()
restorePage()
createBlock()
updateBlock()
moveBlock()
importFileToPage()
copyFileToPage()
moveFileToPage()
replaceFile()
createFileVersion()
createBackup()
restoreBackup()
rebuildMirrors()
rebuildSearchIndex()
rebuildGraphIndex()
repairVault()
runHealthCheck()
```

Allowed outcomes for data-changing methods:

```text
success
rollback
pending repair
read-only safe failure
```

Forbidden outcomes:

```text
SQLite says data exists but folder is missing without warning.
Folder exists but SQLite does not know it without repair path.
UI says saved but data is not saved.
Operation partially fails silently.
User data is deleted without backup/confirmation.
```

---

### 37.13 Privacy and Security Threat Model

Mizaan must be honest about what it protects.

Before full encryption exists, Mizaan may protect against:

```text
casual viewing inside the app
accidental appearance in recent pages
accidental search exposure
accidental graph exposure
accidental preview exposure
accidental opening by another local profile after sign off
```

Before full encryption exists, Mizaan does not protect against:

```text
someone with full disk access
malware
someone copying the vault folder
forensic recovery
Windows account compromise
unencrypted backup theft
```

Mizaan must never claim encryption unless encryption is actually implemented.

Privacy behavior matrix must define private content behavior for:

```text
recent pages
search results
graph nodes
file previews
home dashboard
calendar
tasks
exports
backups
logs
trash
```

Default private behavior:

```text
hide or blur in app UI
show lock/private indicator
exclude from recent unless unlocked
exclude or mask in search unless unlocked
blur or hide in graph unless unlocked
include in backup with privacy flag
do not leak private content in screenshots/reports unless user explicitly captures it
```

---

### 37.14 Import/Export Boundaries and Lock-In Prevention

Import must never mutate the source folder.

Export must never be the only backup format.

Supported early imports:

```text
individual files
folders
PDF
images
video
audio
Office files
TXT
Markdown
CSV
JSON as file or safe app-managed import only
```

Later imports:

```text
Obsidian vault
Notion export
ICS calendar
large external folder migrations
structured contact imports
```

Early exports:

```text
single page Markdown
page tree folder
full vault backup
selected files/media export
backup manifest
health report
```

Later exports:

```text
PDF
DOCX
CSV
ICS
graph JSON
graph image
template package
```

Export rule:

```text
Export creates a copy.
Export must not move or delete vault originals.
```

Import rule:

```text
Import copies or moves only after user chooses.
Import must preserve original filename in metadata.
Import must use checksums.
Import must log operation.
Import must not silently discard unsupported files.
```

---

### 37.15 UI State Matrix

Every major UI area must handle these states:

```text
empty
loading
ready
saving
saved
error
read-only
locked/private
conflict
missing file
vault disconnected
repair required
helper missing
preview failed
permission denied
disk full
unsupported format
```

Required screens:

```text
First Launch
Home
Vault Open
Workspace
Page Editor
Right Panel
File Viewer
PDF Viewer
Office Preview
Media Viewer
Search
Graph
Calendar
Tasks
Trackers
Goals
Finance
People
Templates
Backup
Restore
Vault Health
Repair
Settings
Trash
```

UI must not show dead controls.

Every visible button must either:

```text
work
be clearly disabled
show coming-later label
open a real flow
show a clear missing-dependency message
```

Forbidden:

```text
dead buttons
fake success states
fake loading states
fake backups
fake imports
fake graph nodes
fake privacy toggles
fake helper health
```

---

### 37.16 Logging, Audit Trail, and Log Retention

Logs are required for repair and long-term trust.

Log formats:

```text
human-readable .txt logs
structured .jsonl event logs where useful
SQLite logs table while database is healthy
```

Log types:

```text
app log
vault log
file operation log
edit log
backup log
restore log
migration log
repair log
error log
security/privacy log
helper runtime log
performance log
```

Each log event should include:

```text
event ID
timestamp local
timestamp UTC
timezone
country
device ID
vault profile
operation type
object affected
result
error if any
repair action if any
```

Retention rules:

```text
logs must not grow forever without rotation
critical repair/migration/backup logs must be preserved longer
user may export logs
user may clear non-critical logs with confirmation
clearing logs must be logged
```

Privacy rule:

```text
logs may include filenames and page titles because this is a personal local app
but logs must be clearly labeled private local logs
```

---

### 37.17 Deferred Features and Anti-Scope-Creep Rules

Do not build advanced features before safety foundations pass.

Forbidden too early:

```text
mobile app
cloud sync
collaboration
plugin system
AI features
bank sync
full encryption before storage/backup is stable
OCR before import/preview/search foundations
advanced graph before relations/backlinks are stable
advanced media editing before versioning is stable
advanced finance reports before records/categories/budgets are stable
theme overhauls before core layout/storage is stable
public sharing
publishing
remote accounts
```

Correct order:

```text
vault safety first
storage second
backup/restore third
repair/recovery fourth
page/editor fifth
file import sixth
metadata/versioning seventh
search/graph eighth
life modules ninth
privacy/security tenth
helper runtimes eleventh
visual polish after core reliability
```

---

### 37.18 Release Blockers

Mizaan must not be considered release-ready if any of these are true:

```text
data can be silently lost
autosave can silently fail
backup cannot be restored
restore overwrites current vault by default
SQLite corruption has no recovery path
USB removal corrupts vault silently
folder rename failure loses page
metadata JSON corruption crashes app
helper runtime crash loses document
private content leaks in recent/search/graph
fake UI remains unlabeled
tests fail
build fails
known critical errors are ignored
migration can run without backup
uninstall deletes vault
normal use requires internet
```

Any one of these blocks release.

---

### 37.19 Final 10/10 Acceptance Checklist

Mizaan reaches 10/10 readiness only when all of the following are true:

```text
A user can create a vault.
A user can open and close a vault.
A user can sign off and switch vaults.
A user can use the app fully offline after setup.
A user can create pages and subpages.
Page folders are human-readable.
SQLite and mirrors remain consistent.
Markdown and JSON mirrors are created.
Metadata files are created and validated.
Files can be imported safely.
PDFs preview inside Mizaan.
Office files can be stored safely.
Office previews work when helper succeeds.
Office edit workflow preserves originals and versions.
Media edits preserve originals and use display pointers.
Backups can be created.
Backups can be validated.
Backups can be restored into a new vault.
Corrupt SQLite can enter recovery mode.
Deleted mirrors can be regenerated.
Externally edited mirrors trigger conflicts.
Malformed metadata JSON does not crash the app.
USB removal stops writes safely.
Disk full does not silently corrupt files.
Permission errors are visible.
Schema migrations require backup.
Large vault tests pass.
Installer tests pass.
Portable mode tests pass if portable mode exists.
Helper runtime health checks pass.
Private content behavior is honest and tested.
No false encryption claims exist.
No fake UI remains.
All required commands pass.
Manual QA evidence exists.
Final implementation report exists.
```

---

### 37.20 Final Rule

Mizaan is not finished when the app opens.

Mizaan is not finished when the UI looks good.

Mizaan is not finished when tests pass once.

Mizaan is finished only when it can protect, preserve, repair, restore, and explain the user’s data under normal use, long-term use, and realistic failure conditions.

Final rule:

```text
Mizaan must earn trust through proof, not claims.
```

---

## 38. Final Product Rulebook

1. Mizaan is 100% Mizaan.
2. No AI features.
3. No forced cloud.
4. No forced internet.
5. No forced online account.
6. No fake readiness.
7. No dead UI.
8. No user-data deletion without backup and confirmation.
9. Every important object is a page or page-like record.
10. Space is only active UI context.
11. Templates are blueprints.
12. Modules are app tools.
13. Workspace is where the user works.
14. SQLite is runtime authority.
15. Human-readable folders are lifetime survival.
16. Every page gets a folder immediately.
17. Autosave every 5 seconds.
18. Sudden drive removal must be handled safely.
19. File import asks copy or move every time.
20. No external linking for files.
21. Preserve original filenames.
22. Use checksums for duplicates.
23. Every file gets info and metadata files.
24. Metadata editable files are JSON correction proposals.
25. App UI handles metadata correction.
26. LibreOffice/VLC/FFmpeg may be required sidecar engines, but do not lie about native editing.
27. Original files are preserved even when page display is replaced with edited version.
28. Graph uses real data only, except manual canvas nodes created by user.
29. Orphan/unlinked graph nodes are visible.
30. Private nodes are blurred until unlocked.
31. Search includes trash by default with trash label.
32. Finance is advanced personal finance, but no bank sync.
33. Calendar/tasks/trackers/goals are local and early.
34. Backup/restore/repair are core.
35. Logs are local and detailed.
36. Export prevents lock-in.
37. Tests prove features.
38. If app dies, data survives.
39. A phase is not complete until its mapped QA gate passes.
40. A feature is not complete until it has real persistence, error handling, and proof.
41. Backup is not trusted until restore has been tested.
42. Migration is not allowed without backup.
43. Installer/update/uninstall must never delete the vault.
44. Helper runtime failure must never prevent vault access.
45. Private content behavior must be honest and must not fake encryption.
46. Large vault performance must be tested, not assumed.
47. Reports must distinguish implemented, partial, prototype, fake, blocked, deferred, and removed.
48. Mizaan must earn trust through proof, not claims.

---

## Append-Only Full-App Baseline, Repair, and Implementation Ledger 20260531-215910

This appended section is the current authoritative implementation status. Older text above is preserved for historical continuity and must not be deleted.

Baseline audit timestamp: 20260531-215910
Selected app folder: E:\Github\Mizaan-Revamp
App-code-location audit: root folder contains package.json and src; no nested app folder was selected.
Git status: Git verification unavailable because selected app folder is not a Git repository.
Storage truth: current runtime is a React/TanStack/Vite browser prototype backed by LocalStorageVaultProvider, not a lifetime SQLite/Tauri/portable-vault implementation.
Known immediate red flag before repair: src/routes/\_\_root.tsx loads Google Fonts from fonts.googleapis.com/fonts.gstatic.com; this violates zero external Google dependency and must be removed in the repair pass.

### Append-Only Contradiction Correction Block 20260531-215910

- TXT is not active source of truth. Mizaan Ultimate Plan.txt is an archive/history file only and was not used as active planning input.
- Calendar is a core route/module, not a promoted page/space. Legacy calendar space data must remain deprecated or hidden from sidebar page lists.
- Tauri, SQLite, portable folder vault, folder picker, lock file, markdown mirrors, native filesystem, mobile apps, and encrypted backup are not implemented in current code.
- Backup/restore, markdown mirrors, and survival layer are not complete because there is no validated export/import/restore drill or lifetime folder layout.
- Graph is a partial relation visualization only; automatic graph indexing, filters, clustering, canvas editing, and export are not implemented.
- Database is a partial local table foundation only; formulas, rollups, advanced views, CSV import/export, grouping, filters, and full engine behavior are not implemented.
- localStorage is prototype storage only and must not be described as lifetime storage.
- Any old screenshot, phase, or commit claim is superseded by current evidence; no Git repository is present in the selected app folder, so this session cannot truthfully create a local commit unless Git metadata appears.
- Google Fonts are currently a real source-code dependency and must be repaired before claiming zero Google dependency.

### Feature: Product law [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Product law' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Local-first rule [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Local-first rule' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Zero cloud dependency [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Zero cloud dependency' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: No account/auth dependency [ IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'No account/auth dependency' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Current inspected code supports this without a fake placeholder. For auth specifically, package.json and src routes show no auth provider, OAuth flow, login screen, or account dependency. For Calendar page status, /calendar is a route/core module and sidebar tree filtering excludes calendar items from normal page lists.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Keep regression coverage active and rerun typecheck, lint, tests, build, and browser QA in this session before final claims.]

### Feature: Privacy-first architecture [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Privacy-first architecture' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Vault model [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Vault model' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Vault lifecycle [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Vault lifecycle' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Portable vault model [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Portable vault model' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Folder structure [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Folder structure' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Vault identity [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Vault identity' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Lock file [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Lock file' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Storage architecture [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Storage architecture' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: VaultProvider [ PARTIAL]

Goal:
Provide the Mizaan capability named 'VaultProvider' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: LocalStorage provider [ PARTIAL]

Goal:
Provide the Mizaan capability named 'LocalStorage provider' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Future SQLite provider [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Future SQLite provider' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Schema versioning [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Schema versioning' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Migration strategy [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Migration strategy' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Error states [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Error states' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Recovery rules [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Recovery rules' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Home [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Home' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Sidebar/navigation [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Sidebar/navigation' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Core modules [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Core modules' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: System tools [ PARTIAL]

Goal:
Provide the Mizaan capability named 'System tools' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Pinned/pages model [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Pinned/pages model' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Spaces as promoted pages [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Spaces as promoted pages' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Calendar as core module [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Calendar as core module' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Templates as creation source [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Templates as creation source' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Command palette [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Command palette' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Keyboard shortcuts [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Keyboard shortcuts' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Settings [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Settings' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Themes [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Themes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Right panel/Page data [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Right panel/Page data' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Sidebar hover menus [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Sidebar hover menus' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Pin/unpin logic [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Pin/unpin logic' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Page layouts [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Page layouts' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Empty states [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Empty states' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Error states in UI [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Error states in UI' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Responsiveness [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Responsiveness' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Accessibility [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Accessibility' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Notes [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Notes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Block editor [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Block editor' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Rich text foundation [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Rich text foundation' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Markdown shortcuts [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Markdown shortcuts' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Slash commands [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Slash commands' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Nested pages [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Nested pages' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Subpages [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Subpages' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Backlinks [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Backlinks' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Outgoing links [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Outgoing links' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Unlinked mentions [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Unlinked mentions' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Page mentions [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Page mentions' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Tag mentions [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Tag mentions' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Date mentions [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Date mentions' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Aliases [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Aliases' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Daily notes [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Daily notes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Journal pages [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Journal pages' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Meeting notes [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Meeting notes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Lecture notes [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Lecture notes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Research notes [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Research notes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Quick capture [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Quick capture' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Scratchpad [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Scratchpad' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Brainstorm [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Brainstorm' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Long-form writing [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Long-form writing' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Checklist notes [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Checklist notes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Note templates [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Note templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Version history [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Version history' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Restore previous version [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Restore previous version' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Export markdown [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Export markdown' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Export PDF [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Export PDF' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Export DOCX later [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Export DOCX later' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Duplicate/move/archive/trash restore [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Duplicate/move/archive/trash restore' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Private note lock later [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Private note lock later' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Focus mode [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Focus mode' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Typewriter mode [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Typewriter mode' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Distraction-free writing [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Distraction-free writing' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Word count [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Word count' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Reading time [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Reading time' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Documents module [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Documents module' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Document records [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Document records' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: PDF import [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'PDF import' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Image import [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Image import' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Office document import [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Office document import' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Text document import [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Text document import' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Drag/drop import [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Drag/drop import' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Folder import [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Folder import' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Batch import [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Batch import' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: PDF preview [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'PDF preview' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Image preview [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Image preview' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Text/Markdown preview [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Text/Markdown preview' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Office metadata preview [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Office metadata preview' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Thumbnail generation [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Thumbnail generation' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Unsupported file state [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Unsupported file state' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Metadata viewer [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Metadata viewer' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Document tags/categories [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Document tags/categories' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: OCR architecture [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'OCR architecture' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Extracted text/search indexing [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Extracted text/search indexing' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Duplicate detection [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Duplicate detection' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Document similarity [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Document similarity' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Related document suggestions [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Related document suggestions' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Document-to-note links [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Document-to-note links' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Document-to-project links [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Document-to-project links' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Document-to-people links [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Document-to-people links' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Document-to-finance links [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Document-to-finance links' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Document-to-task links [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Document-to-task links' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Projects [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Projects' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Project pages [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Project pages' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Project workspaces [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Project workspaces' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Milestones [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Milestones' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Deadlines [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Deadlines' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Timelines [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Timelines' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Kanban boards [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Kanban boards' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Task lists [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Task lists' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Tasks [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Tasks' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Subtasks [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Subtasks' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Priorities [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Priorities' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Due dates [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Due dates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Reminders [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Reminders' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Recurring tasks [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Recurring tasks' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Task status [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Task status' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Drag/drop task boards [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Drag/drop task boards' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Calendar-linked tasks [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Calendar-linked tasks' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: People [ PARTIAL]

Goal:
Provide the Mizaan capability named 'People' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Contact records [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Contact records' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Relationship notes [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Relationship notes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Context memory [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Context memory' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Meeting history [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Meeting history' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Interaction timeline [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Interaction timeline' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Linked conversations [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Linked conversations' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Linked projects [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Linked projects' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Linked notes [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Linked notes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Linked documents [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Linked documents' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Profiles [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Profiles' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Relationship graph [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Relationship graph' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: People network map [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'People network map' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Finance [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Finance' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Expenses [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Expenses' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Income [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Income' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Subscriptions [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Subscriptions' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Recurring payments [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Recurring payments' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Bills [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Bills' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Budgets [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Budgets' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Payment logs [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Payment logs' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Finance notes [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Finance notes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Finance categories/tags/accounts [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Finance categories/tags/accounts' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Reports [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Reports' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Receipt storage [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Receipt storage' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Linked transactions [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Linked transactions' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Invoice archive [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Invoice archive' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Calendar core module [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Calendar core module' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Calendar is not a page [ IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Calendar is not a page' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Current inspected code supports this without a fake placeholder. For auth specifically, package.json and src routes show no auth provider, OAuth flow, login screen, or account dependency. For Calendar page status, /calendar is a route/core module and sidebar tree filtering excludes calendar items from normal page lists.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Keep regression coverage active and rerun typecheck, lint, tests, build, and browser QA in this session before final claims.]

### Feature: Month view [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Month view' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Week view [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Week view' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Day view [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Day view' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Agenda view [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Agenda view' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Event creation [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Event creation' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Event editing [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Event editing' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Event delete/archive [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Event delete/archive' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Event persistence [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Event persistence' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: All-day events [ PARTIAL]

Goal:
Provide the Mizaan capability named 'All-day events' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Timed events [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Timed events' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Event metadata [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Event metadata' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Event details panel/modal [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Event details panel/modal' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Today/previous/next controls [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Today/previous/next controls' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Date range label [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Date range label' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Recurring events later [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Recurring events later' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Calendar-linked pages/tasks/people/projects/docs [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Calendar-linked pages/tasks/people/projects/docs' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Reminder integration later [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Reminder integration later' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Trackers [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Trackers' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Habit tracking [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Habit tracking' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Streaks [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Streaks' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Completion logs [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Completion logs' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Reminders [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Reminders' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Progress history [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Progress history' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Mood tracking [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Mood tracking' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Health tracking [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Health tracking' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Study tracking [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Study tracking' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Reading tracking [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Reading tracking' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Productivity tracking [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Productivity tracking' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Finance goals [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Finance goals' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Custom user-defined trackers [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Custom user-defined trackers' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Goals [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Goals' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Long-term goals [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Long-term goals' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Short-term goals [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Short-term goals' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Milestones [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Milestones' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Progress visualization [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Progress visualization' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Databases [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Databases' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Database rows as pages/items [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Database rows as pages/items' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Custom schemas [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Custom schemas' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Custom properties [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Custom properties' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Typed fields [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Typed fields' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Table view [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Table view' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Board view [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Board view' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: List view [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'List view' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Calendar view [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Calendar view' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Gallery view [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Gallery view' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Timeline view [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Timeline view' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Sort [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Sort' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Filter [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Filter' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Grouping [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Grouping' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Relations [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Relations' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Rollups [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Rollups' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Formulas [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Formulas' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Database templates [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Database templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Bulk edit [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Bulk edit' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: CSV import [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'CSV import' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: CSV export [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'CSV export' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Simple table blocks [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Simple table blocks' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Row/column/cell operations [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Row/column/cell operations' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Row-as-page behavior [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Row-as-page behavior' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Graph [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Graph' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Global graph [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Global graph' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Local automatic page graph [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Local automatic page graph' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Manual local graph/canvas [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Manual local graph/canvas' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Editable graph nodes [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Editable graph nodes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Directed arrows/edges [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Directed arrows/edges' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Relation graph [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Relation graph' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Graph filters [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Graph filters' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Graph clustering [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Graph clustering' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Graph search [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Graph search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Focus mode for selected nodes [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Focus mode for selected nodes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Canvas system [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Canvas system' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Add page card [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Add page card' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Add document card [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Add document card' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Add text card [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Add text card' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Add image [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Add image' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Connect cards [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Connect cards' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Move cards manually [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Move cards manually' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Zoom/pan [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Zoom/pan' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Save layout [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Save layout' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Export image/PDF [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Export image/PDF' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Search [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Universal search [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Universal search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Notes search [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Notes search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Documents search [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Documents search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: People search [ PARTIAL]

Goal:
Provide the Mizaan capability named 'People search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Projects search [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Projects search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Finance search [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Finance search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Task search [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Task search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Tag search [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Tag search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Metadata search [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Metadata search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Graph search [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Graph search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Advanced filters [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Advanced filters' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Saved searches [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Saved searches' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Compound conditions [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Compound conditions' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Templates system [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Templates system' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Built-in templates [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Built-in templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Custom templates [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Custom templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Template libraries [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Template libraries' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Duplicate from template [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Duplicate from template' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Template content spec [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Template content spec' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Notes templates [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Notes templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Documents templates [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Documents templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Projects templates [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Projects templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: People templates [ PARTIAL]

Goal:
Provide the Mizaan capability named 'People templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Finance templates [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Finance templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Calendar templates/events [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Calendar templates/events' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Trackers templates [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Trackers templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Goals templates [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Goals templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Database templates [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Database templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Canvas templates [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Canvas templates' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Local backups [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Local backups' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Manual backup [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Manual backup' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Scheduled backup [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Scheduled backup' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Snapshot backups [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Snapshot backups' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Versioned backups [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Versioned backups' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Restore points [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Restore points' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Rollback recovery [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Rollback recovery' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Import JSON [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Import JSON' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Import Markdown [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Import Markdown' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Import TXT [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Import TXT' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Import PDFs [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Import PDFs' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Import folders [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Import folders' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Import CSV [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Import CSV' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Import images [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Import images' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Import office docs [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Import office docs' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Export JSON [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Export JSON' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Export Markdown [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Export Markdown' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Export CSV [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Export CSV' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Export PDFs [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Export PDFs' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Full archive export [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Full archive export' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Selective export [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Selective export' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Markdown mirrors [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Markdown mirrors' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Survival layer [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Survival layer' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Local encryption later [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Local encryption later' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Vault locking [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Vault locking' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Password protection [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Password protection' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: App lock [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'App lock' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Privacy mode [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Privacy mode' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Hidden workspaces [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Hidden workspaces' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Private page [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Private page' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Private person profile [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Private person profile' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Blur private previews [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Blur private previews' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Hide from graph [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Hide from graph' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Hide from search [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Hide from search' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Encrypted backup later [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Encrypted backup later' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Trash/recovery [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Trash/recovery' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Soft delete [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Soft delete' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Trash restore [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Trash restore' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Permanent delete confirmation [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Permanent delete confirmation' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Restore history [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Restore history' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Windows app/Tauri [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Windows app/Tauri' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Native filesystem access [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Native filesystem access' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Native SQLite [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Native SQLite' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Native notifications [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Native notifications' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Startup launch [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Startup launch' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: System tray [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'System tray' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Local vault folders [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Local vault folders' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Windows release plan [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Windows release plan' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Development build [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Development build' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Portable build [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Portable build' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Installer build [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Installer build' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Unsigned build [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Unsigned build' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Signed build later [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Signed build later' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Clean VM test [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Clean VM test' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Uninstall behavior [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Uninstall behavior' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Vault stays untouched on uninstall [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Vault stays untouched on uninstall' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Update strategy [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Update strategy' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Version number [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Version number' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Release notes [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Release notes' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Template/page evidence: src/lib/page/page-workspace.ts and PageTemplatePicker define local templates and page creation helpers.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Android companion plan [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Android companion plan' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: iOS companion plan [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'iOS companion plan' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Portable USB vault workflow [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Portable USB vault workflow' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Cross-device manual sync workflow [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Cross-device manual sync workflow' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Conflict handling [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Conflict handling' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Last-writer/merge policy later [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Last-writer/merge policy later' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Unit tests [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Unit tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Storage tests [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Storage tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Migration tests [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Migration tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Backup/restore tests [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Backup/restore tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Import/export tests [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Import/export tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Documents evidence: src/routes/documents.tsx, SpacePage records, document-record template, and AttachedFile types; filesystem import/preview/OCR not implemented.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Graph index tests [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Graph index tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Graph evidence: src/routes/graph.tsx uses provider items and relations for a static relation visualization; no canvas editor exists.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Search tests [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Search tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Search evidence: src/routes/search.tsx and CommandPalette provider item scan; no full block index yet.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Editor tests [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Editor tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Calendar recurrence tests [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Calendar recurrence tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Calendar evidence: src/routes/calendar.tsx, src/components/calendar/CalendarView.tsx, src/lib/calendar/calendar-events.ts, src/lib/calendar/calendar-events.test.ts.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Filesystem tests [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Filesystem tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Tauri command tests [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Tauri command tests' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Browser/manual QA [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Browser/manual QA' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Database evidence: src/routes/databases.tsx, src/components/database/DatabaseTable.tsx, src/lib/database/database-table.ts, src/lib/database/database-table.test.ts.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Clean Windows VM test [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Clean Windows VM test' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: USB vault test [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'USB vault test' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. Vault evidence: src/lib/vault/types.ts, local-storage-vault-provider.ts, vault-session.ts, and src/routes/vault.tsx state prototype localStorage only and mark portable folder, SQLite, Tauri, mirrors, and lock files unavailable.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Bad shutdown test [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Bad shutdown test' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Performance checks [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Performance checks' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Accessibility checks [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'Accessibility checks' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Screenshot evidence [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Screenshot evidence' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: DOCX work log evidence [ NOT IMPLEMENTED]

Goal:
Provide the Mizaan capability named 'DOCX work log evidence' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
No current working implementation was found in the inspected runtime surfaces. If old plan text mentions this area, it remains future scope until real provider-backed code, UI, persistence, tests, and QA exist.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory. No dedicated working source file, route, provider method, test, or screenshot proof was found for this exact capability.]

[Next required work:
Design and implement the first real vertical slice before exposing this as ready in the UI or documentation.]

### Feature: Phase evidence reports [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Phase evidence reports' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Feature: Final honest review [ PARTIAL]

Goal:
Provide the Mizaan capability named 'Final honest review' as a real local-first feature, without cloud dependency, auth dependency, fake readiness, or destructive data behavior.

[What Codex understood:
This feature is part of the personal life operating system scope. It should be exposed only to the extent that current code, persistence, tests, and QA prove it works.]

[How it is implemented:
Some current React/prototype code or documentation support exists, but the implementation is incomplete, localStorage-backed, unverified in this session at baseline time, or missing lifetime architecture such as SQLite, portable folders, lock files, full import/export, or complete QA.]

[Evidence:
Inspected package.json, src/routes, src/components, src/lib/vault, src/lib/page, src/lib/calendar, src/lib/database, phase reports, docs/logs, and screenshot inventory.]

[Next required work:
Finish the missing vertical slice: provider model, UI control, persistence, error/empty states, tests, browser QA, screenshots, and lifetime-storage honesty.]

### Baseline Status Counts 20260531-215910

[ IMPLEMENTED] count in this appended baseline: 2
[ PARTIAL] count in this appended baseline: 123
[ NOT IMPLEMENTED] count in this appended baseline: 220
Total audited features in this appended baseline: 345

### First Repair Gate Notes 20260531-215910

- Do not begin feature implementation until this append is proven append-only, a phase report exists, and the work log DOCX is updated or an honest fallback is created.
- After this gate, run typecheck, lint, tests, build, red-flag scans, browser QA, and then implement the highest-priority safe batch.

---

## Append-Only Full-Repair Implementation Update 20260531-223100

Implementation batch selected: Batch B - Search System Hardening.

Why selected: Calendar already had provider-backed event creation, editing, delete/archive, month/week/day/agenda views, date labels, all-day/timed normalization, tests, and browser screenshots in this run. Search was still a narrower inline route search with no block-content indexing, no filters, weak result context, and no dedicated tests.

Red flags fixed:

- Removed remote Google Fonts and all third-party http/https head links from src/routes/\_\_root.tsx by routing head links through src/lib/app-head.ts. (spaghetti code cleared)
- Added src/lib/app-head.test.ts so remote/Google head links fail tests if reintroduced. (spaghetti code cleared)
- Removed unused TanStack example server function/config files that referenced backend/cloud/env patterns but were not used by Mizaan runtime. (spaghetti code cleared)

Files changed:

- src/lib/app-head.ts
- src/lib/app-head.test.ts
- src/routes/\_\_root.tsx
- src/lib/api/example.functions.ts removed
- src/lib/config.server.ts removed
- src/lib/search/search-index.ts
- src/lib/search/search-index.test.ts
- src/routes/search.tsx
- docs/Plan/Mizaan_A_to_Z_Plan.md
- docs/Plan/Mizaan Work Log.docx
- docs/Phases/phase-full-repair-audit-and-implementation-report.md
- docs/screenshots/_full-repair_.png and JSON evidence files

Tests run:

- pm run typecheck passed after implementation.
- pm run lint passed with 0 errors and 10 existing Fast Refresh warnings.
- pm test passed with 8 files and 42 tests.
- pm run build passed with Vite chunk-size/vendor warnings only.

Browser QA result: Browser plugin backend iab was unavailable and gent.browsers.list() returned no backends. Fallback headless Chrome QA opened home, settings, vault, trash, templates, calendar, search, databases, graph, and /page/note-principles; hydrated screenshots were captured; a CDP pass reported 0 console errors. Search implementation proof used query provider boundaries, returned the seeded Mizaan design principles page from block content, displayed the Block match badge, and highlighted the matching phrase.

Screenshots captured:

- docs/screenshots/20260531-2215-full-repair-home.png
- docs/screenshots/20260531-2215-full-repair-sidebar.png
- docs/screenshots/20260531-2215-full-repair-page-workspace.png
- docs/screenshots/20260531-2215-full-repair-settings.png
- docs/screenshots/20260531-2215-full-repair-calendar.png
- docs/screenshots/20260531-2215-full-repair-search.png
- docs/screenshots/20260531-2215-full-repair-database.png
- docs/screenshots/20260531-2215-full-repair-implementation-proof.png
- docs/screenshots/20260531-2229-full-repair-search-implementation-proof.png

Status changes from this batch:

### Feature: Zero cloud dependency [ IMPLEMENTED]

Goal:
Keep the current app free of forced cloud, Google, remote font, OAuth, Firebase, Supabase, Clerk, or external account runtime dependencies.

[What Codex understood:
The app must not silently fetch Google or cloud resources while presenting itself as local-first.]

[How it is implemented:
The root head now gets only local stylesheet and data-URI favicon links from getAppHeadLinks. The prior Google Fonts preconnect/stylesheet links were removed. The unused example server function/config files were removed.]

[Evidence:
src/lib/app-head.ts, src/lib/app-head.test.ts, src/routes/__root.tsx, final
g -n "fonts\.googleapis|fonts\.gstatic|https://|http://" src returned no hits,
pm test passed,
pm run build passed.]

[Next required work:
Keep the remote-link regression test and review any future dependency additions for local-first compliance.]

### Feature: Search [ PARTIAL]

Goal:
Provide useful provider-backed local search across Mizaan records without claiming a complete final search engine.

[What Codex understood:
Search should use real VaultProvider snapshot data and should not be hard-coded or page-title-only.]

[How it is implemented:
src/lib/search/search-index.ts builds results from active provider items and blocks. The /search route now supports title, summary, status, category, type, tag, property, metadata, and block-content matching with result snippets, match badges, highlighted query text, filters, recent-item mode, clear filters, and route links to matching pages.]

[Evidence:
src/lib/search/search-index.test.ts covers block-content search, category/status/tag filters, recent ordering, and highlighting. Browser proof 20260531-2229-full-repair-search-implementation-proof.png shows block-content search returning Mizaan design principles.]

[Next required work:
Add saved searches, compound conditions, search indexing performance work, document extracted-text search, graph search integration, and keyboard selection/command-palette unification before marking the complete search system implemented.]

### Feature: Universal search [ PARTIAL]

Goal:
Let one local search surface find all page-like provider records and their current text blocks.

[What Codex understood:
Universal search means one search path over provider data, not a cloud search or isolated static list.]

[How it is implemented:
The search index scans all active provider items and their blocks, and filters by category/type/status/tag. It is still limited to current provider snapshot data and does not yet include file OCR, binary document contents, graph indexes, saved searches, or advanced conditions.]

[Evidence:
src/lib/search/search-index.ts, /search,
pm test, and headless Chrome search proof.]

[Next required work:
Add durable indexed search and module-specific extracted content once real document import and lifetime storage exist.]

### Feature: Notes search [ PARTIAL]

Goal:
Find note pages by title, metadata, tags, and block text.

[What Codex understood:
Notes search must include current note block content, not only note titles.]

[How it is implemented:
Provider blocks are grouped by item and searched with snippets; note pages can be filtered by category and opened from result links.]

[Evidence:
search-index.test.ts verifies block-content matching; browser proof searches seeded note block text.]

[Next required work:
Add richer editor full-text indexing, ranking, and backlink/wiki-link search.]

### Feature: Tag search [ PARTIAL]

Goal:
Allow local items to be found and filtered by tags.

[What Codex understood:
Tags should affect results through real item tags rather than visual-only chips.]

[How it is implemented:
The search index matches tag text and the route exposes a tag filter derived from active provider item tags.]

[Evidence:
uildSearchResults tests category/status/tag filtering; /search renders tag filters and result tag chips.]

[Next required work:
Add tag pages, tag autocomplete, tag graph integration, and tag-specific saved filters.]

### Feature: Metadata search [ PARTIAL]

Goal:
Search user-visible properties and metadata attached to provider items.

[What Codex understood:
Metadata search should inspect provider-backed item data, but must stay honest about the absence of a durable search index.]

[How it is implemented:
The search index stringifies searchable primitive, array, and object values from item properties and metadata.]

[Evidence:
src/lib/search/search-index.ts includes property/metadata candidates and tests cover the shared result builder.]

[Next required work:
Add typed field-aware metadata filters, advanced conditions, and performance-safe indexing.]

### Feature: Search tests [ IMPLEMENTED]

Goal:
Protect the new search behavior with deterministic tests.

[What Codex understood:
Search should not regress silently back to title-only route logic.]

[How it is implemented:
search-index.test.ts validates block search, filters, recent mode, and highlighting.]

[Evidence:

pm test passed with 8 test files and 42 tests.]

[Next required work:
Add UI-level search tests when the project has a browser test runner.]

### Feature: Browser/manual QA [ PARTIAL]

Goal:
Verify the actual app routes render in a browser-like runtime.

[What Codex understood:
Automated tests are not enough; UI routes need runtime proof and screenshots.]

[How it is implemented:
The in-app Browser plugin was unavailable, so headless Chrome fallback captured hydrated screenshots and CDP route checks.]

[Evidence:
docs/screenshots/20260531-2215-full-repair-*.png, 20260531-2216-full-repair-browser-qa-cdp.json, 20260531-2229-full-repair-search-implementation-proof.json.]

[Next required work:
Run true interactive Browser/Playwright QA when the Browser backend is available, including click-level checks for create/edit flows.]

### Feature: Screenshot evidence [ PARTIAL]

Goal:
Keep visual proof for the repair and implementation pass.

[What Codex understood:
Screenshots should show actual rendered UI and not be claimed if they cannot be captured.]

[How it is implemented:
Headless Chrome captured screenshots for required routes and the search implementation proof.]

[Evidence:
Screenshot files under docs/screenshots with timestamps 20260531-2215 and 20260531-2229.]

[Next required work:
Capture additional interaction screenshots after future UI batches, especially create/edit/delete workflows.]

### Feature: DOCX work log evidence [ PARTIAL]

Goal:
Record the work in the Word work log or create an honest fallback.

[What Codex understood:
The DOCX should be updated if possible, but render QA must not be faked.]

[How it is implemented:
docs/Plan/Mizaan Work Log.docx was updated through direct OOXML because Python is unavailable. LibreOffice/soffice was not found, so DOCX visual render QA could not be completed.]

[Evidence:
DOCX entry verification showed the work-log entry exists; Get-Command soffice/libreoffice returned no renderer.]

[Next required work:
Render the DOCX on a machine with LibreOffice or install a renderer before claiming visual DOCX QA.]

Remaining limitations:

- Current app is still a browser/localStorage prototype, not Tauri, SQLite, portable folder vault, lock-file, markdown mirror, or native filesystem storage.
- Browser plugin backend was unavailable; headless Chrome fallback was used instead.
- Git metadata is missing, so no local commit can be made truthfully.
- Lint exits 0 but still reports existing Fast Refresh warnings in component/UI helper export files.
- Search is improved but remains partial relative to saved searches, advanced filters, document OCR/extracted text, graph search, and indexed performance requirements.

Next recommended step: harden database/table or document foundation next, while separately addressing Fast Refresh warnings and preserving the new local-first head-link regression test.

---

## Append-Only Repair Check and Bounded Implementation Update - 2026-06-01

Date/time: 2026-06-01 05:40 +08:00

Repo repair status:

- Canonical repo root is `E:\Github\Mizaan-Revamp`.
- Current branch before work was `main`.
- Remote was `https://github.com/mhyahya854/Mizaan-Revamp.git`.
- Latest commit before work was `abc0277`.
- `git fetch origin --prune` completed.
- `git rev-list --left-right --count main...origin/main` returned `0 0` before implementation.
- Worktree was clean before screenshots and implementation files were created.

Validation status:

- Before implementation, `npm run typecheck` passed.
- Before implementation, `npm run lint` passed with 0 errors and 10 existing Fast Refresh warnings.
- Before implementation, `npm test` passed with 8 files and 42 tests.
- Before implementation, `npm run build` passed with existing Vite chunk-size and TanStack unused-external warnings.
- After implementation, targeted database/table tests passed with 2 files and 16 tests.
- After implementation, `npm run typecheck` passed.
- After implementation, `npm run lint` passed with the same 10 existing Fast Refresh warnings.
- After implementation, `npm test` passed with 8 files and 48 tests.
- After implementation, `npm run build` passed with existing Vite chunk-size and TanStack unused-external warnings.

Red-flag scan status:

- `rg -n "localStorage" src` found expected prototype storage, theme, right-panel, vault-session, vault-provider, test, and honest UI label references.
- `rg -n "Google|Drive|OAuth|Firebase|Supabase|Clerk|auth|cloud" src` found icon names, `class-variance-authority`, documentation-safe local-first wording, and the head-link regression test. No runtime cloud/auth provider was found.
- `rg -n "portable vault ready|SQLite ready|Tauri ready|folder picker ready|USB vault ready" src docs` found no active fake readiness claim beyond historical phase-report notes saying no matches.
- `rg -n "TODO|FIXME|mock|fake|placeholder|any" src` found generated router `as any` casts and ordinary placeholder text, not new fake UI.
- `rg -n "console.log|debugger" src` found no matches.
- `rg -n "https://|http://|fonts.googleapis|fonts.gstatic" src` found no runtime source matches.

Browser QA status:

- In-app Browser backend was attempted first and failed because `iab` was unavailable.
- Chrome DevTools fallback initially failed because Chrome was not running on `127.0.0.1:9222`.
- An isolated Chrome profile was started with remote debugging, without touching the user's normal browser storage.
- Preview server was restarted after rebuild to avoid stale asset-map 404s.
- Routes checked before implementation: `/`, `/search`, `/settings`, `/vault`, `/templates`, `/calendar`, `/databases`, `/graph`, `/documents`, `/trash`, `/page/note-principles`.
- Changed database flow checked after implementation: create Basic Database, add row, edit cell, add property, rename property, delete row, delete property, reload, verify persisted row/cell/property counts and values.
- Console checks during the successful final browser flow found no warnings or errors.

Selected implementation batch:

- Database/Table Hardening.

Why selected:

- Calendar had already received a focused hardening batch.
- Search had already received a focused hardening batch.
- The database/table foundation existed but still needed stronger helper coverage, explicit empty table states, stats, metadata, validation, and browser proof before deeper graph, document, native storage, or backup work.

What was implemented:

- Added database stats helper for row/property counts and empty-state booleans.
- Added simple-table stats helper for row/column counts and empty-state booleans.
- Preserved explicit empty row states instead of silently refilling rows during normalization.
- Allowed deleting the final database row so the UI can honestly show an empty database table.
- Allowed deleting the final simple-table row so block tables can honestly show an empty table.
- Added database title/description metadata helper while preserving existing table data.
- Added database model validation reporting for duplicate columns, duplicate rows, and stale row-order entries.
- Added DatabaseTable UI row/property count chips.
- Added DatabaseTable description metadata input that persists through the provider-backed database metadata.
- Added SimpleTableBlock empty-row state and row/column count footer.
- Kept database/table writes provider-backed through existing item metadata/block content paths.

Files changed:

- `src/lib/database/database-table.ts`
- `src/lib/database/database-table.test.ts`
- `src/lib/table/simple-table.ts`
- `src/lib/table/simple-table.test.ts`
- `src/components/database/DatabaseTable.tsx`
- `src/components/table/SimpleTableBlock.tsx`
- `docs/Plan/Mizaan_A_to_Z_Plan.md`
- `docs/Phases/phase-repair-check-and-bounded-implementation.md`
- `docs/Plan/Mizaan Work Log.docx`
- screenshot files under `docs/screenshots`

Tests added/updated:

- Added database tests for explicit empty row normalization, stats, final-row deletion, title/description metadata preservation, and validation repair reporting.
- Added simple-table tests for explicit empty row normalization, stats, and final-row deletion.
- Existing database tests still cover add row, delete row, add column, rename column, delete column, edit cell, provider persistence, and row-as-page creation.
- Existing simple-table tests still cover add/delete rows, add/rename/delete columns, edit cell, serialization, and preserving data after structure changes.

Screenshots captured:

- `docs/screenshots/20260601-0529-repair-check-home.png`
- `docs/screenshots/20260601-0529-repair-check-sidebar.png`
- `docs/screenshots/20260601-0529-repair-check-search.png`
- `docs/screenshots/20260601-0529-repair-check-calendar.png`
- `docs/screenshots/20260601-0529-repair-check-databases.png`
- `docs/screenshots/20260601-0529-bounded-batch-databases.png`
- `docs/screenshots/20260601-0529-bounded-batch-table-edit.png`
- `docs/screenshots/20260601-0529-bounded-batch-proof.png`

Spaghetti cleanup notes:

- Moved database count/empty-state logic into shared helpers instead of making the route and table UI infer counts independently. (spaghetti code cleared)
- Preserved explicit empty row arrays in database and simple-table normalizers instead of silently creating fake rows after the user deletes the last row. (spaghetti code cleared)
- Added validation helper reporting for duplicate/stale database structures instead of leaving malformed metadata repairs invisible. (spaghetti code cleared)

Remaining limitations:

- Database/Table hardening remains partial relative to a full Notion-like database engine.
- Formulas, rollups, relations as properties, grouping, board/gallery/timeline views, CSV import/export, filters, sorting UI, and full schema designer are not implemented.
- The app remains a browser localStorage prototype, not Tauri, SQLite, portable vault folders, native filesystem storage, or a backup/restore engine.
- The in-app Browser backend was unavailable; browser QA used isolated local Chrome/DevTools fallback.
- DOCX visual render QA remains dependent on a local renderer if LibreOffice/soffice is unavailable.

Next recommended step:

- Document System Foundation, because database/table now has stronger helper coverage and browser proof, while documents still need a real record/detail foundation without pretending filesystem import or preview is implemented.

### Feature: Database/Table hardening [• PARTIAL]

Goal:
Make basic database and table behavior more real, editable, persistent, helper-backed, and honest inside the current browser prototype.

[What Codex understood:
The database/table system should become stronger without pretending to be full Notion parity or future SQLite/native storage.]

[How it is implemented:
Database metadata remains provider-backed on Mizaan items, simple table data remains block-backed, and shared helpers now cover stats, metadata details, explicit empty row states, final-row deletion, and validation reporting. UI count chips, description metadata, and empty states use those helpers.]

[Evidence:
`npx vitest run src/lib/database/database-table.test.ts src/lib/table/simple-table.test.ts` passed with 16 tests. `npm test` passed with 48 tests. Chrome fallback QA created a Basic Database, added/edited/deleted rows/properties, refreshed the page, and verified persisted values and counts.]

[Next required work:
Add sorting/filtering UI, richer property schemas, row detail editing, relation properties, import/export, and final SQLite-backed persistence in later bounded batches.]

### Feature: Database/table stats and metadata [✅ IMPLEMENTED]

Goal:
Expose row/property counts and basic database description metadata without duplicating logic in UI components.

[What Codex understood:
Counts and metadata should be helper-backed so routes and components do not invent separate table interpretations.]

[How it is implemented:
`getDatabaseStats`, `getTableStats`, and `updateDatabaseDetails` were added. `DatabaseTable` displays row/property count chips and a provider-backed description input. `SimpleTableBlock` displays a row/column footer.]

[Evidence:
Targeted helper tests cover stats and metadata preservation. Browser QA showed row/property count changes from 1/3 to 2/4, then persisted at 1/3 after row/property deletion and refresh.]

[Next required work:
Use the same stats surface for future sort/filter/view metadata once those features exist.]

### Feature: Explicit empty table states [✅ IMPLEMENTED]

Goal:
Allow users to delete all rows and see an honest empty state instead of regenerated fake rows.

[What Codex understood:
Empty tables are valid. Normalization should repair malformed data, but it should not erase an intentional empty row array.]

[How it is implemented:
Database and simple-table normalizers now preserve explicit `rows: []`. `removeDatabaseRow` and `removeTableRow` allow final-row deletion. `DatabaseTable` and `SimpleTableBlock` show empty-row guidance when no rows exist.]

[Evidence:
New tests prove explicit empty rows remain empty and final-row deletion produces zero rows. Targeted tests and full test suite passed.]

[Next required work:
Add browser QA for simple table block final-row deletion in a future editor-specific batch.]

### Feature: Database validation helper [✅ IMPLEMENTED]

Goal:
Report repairs for invalid database metadata rather than silently normalizing everything.

[What Codex understood:
Invalid table data should be repaired safely, but the system should be able to say what was repaired.]

[How it is implemented:
`validateDatabaseModel` returns the normalized model plus issues for duplicate database columns, duplicate database rows, stale row-order entries, and fully invalid models.]

[Evidence:
New tests prove duplicate columns, duplicate rows, and stale row order entries are repaired and reported.]

[Next required work:
Surface validation warnings in the database UI only when doing so will not create noisy or misleading prototype states.]

---

## Blueprint Layer Added - 2026-06-01

Date/time: 2026-06-01 15:18 +08:00

Blueprint file:

- `docs/Plan/Mizaan_Product_Blueprint.md`

Purpose:

- A new clean, current product blueprint layer now exists for the full Mizaan app.
- The blueprint covers product definition, current implementation truth, product laws, information architecture, feature status matrix, module blueprints, UI blueprint, route map, data model blueprint, implementation roadmap, testing standard, and future prompt standard.
- The blueprint is not an implementation claim. It is a planning and traceability layer.

How future prompts should use it:

- Read `docs/Plan/Mizaan_Product_Blueprint.md` first.
- Read this historical master Markdown second.
- Implement one bounded roadmap phase at a time.
- Update the blueprint status only after verified implementation.
- Append this master Markdown when a phase changes the implementation state.

Current UI baseline goal:

- The app now exposes a Product Map / Blueprint UI at `/blueprint`.
- The sidebar includes a `Product Map` system-tool link.
- Home includes a Product Map summary.
- Future-only modules are shown as planned/status-only areas, not as fake working routes.

Current implementation status remains:

- Browser/localStorage prototype.
- `LocalStorageVaultProvider` remains the active provider.
- Tauri remains not implemented.
- SQLite remains not implemented.
- Portable vault folders remain not implemented.
- Native filesystem access remains not implemented.
- Mobile apps remain not implemented.
- Real document import, preview, OCR, thumbnails, and native document vault storage remain not implemented.

Next prompt should start from:

- The Phase Roadmap in `docs/Plan/Mizaan_Product_Blueprint.md`.
- The next recommended bounded phase is Phase B - Documents foundation.

---

## Append-Only Document System Foundation Implementation - 2026-06-01

Date/time: 2026-06-01 16:00 +08:00

Selected phase:

- Phase B - Documents foundation.

Blueprint file read:

- `docs/Plan/Mizaan_Product_Blueprint.md`

Blueprint updated:

- Yes. Documents remains [• PARTIAL] overall.
- Document metadata model, record creation, route/list foundation, detail metadata UI, template defaults, metadata search coverage, and relation-id normalization helpers were updated accurately.
- Real filesystem import, PDF/DOCX/image preview, OCR, thumbnails, duplicate detection, native vault storage, SQLite, Tauri commands, encryption, cloud sync, Google Drive sync, and mobile capture remain not implemented.

Validation before work:

- `npm run typecheck`: passed.
- `npm run lint`: passed with 10 known Fast Refresh warnings.
- `npm test`: passed with 9 files and 56 tests.
- `npm run build`: passed with existing build warnings.

Red-flag scans:

- `localStorage` hits remained the expected prototype/provider/theme/session/right-panel references.
- Cloud/auth/provider hits remained documentation/product-law language, icon names, and `class-variance-authority`; no runtime provider integration was added.
- Fake readiness phrases remained historical report text only.
- `console.log|debugger`: no source matches.
- Runtime URL/font scan in `src`: no matches.

Browser QA before work:

- Checked `/`, `/blueprint`, `/documents`, `/search`, `/settings`, `/templates`, `/databases`, `/calendar`, `/graph`, `/trash`, and `/page/note-principles`.
- Screenshots captured before implementation.

Implementation summary:

- Added typed document metadata helpers and tests.
- Replaced the generic `/documents` space view with a dedicated metadata-only document record route.
- Added a real provider-backed New document record action.
- Added document record template defaults for general, receipt, identity, invoice, contract, and reference records.
- Added document-specific metadata editing in the page right panel.
- Preserved existing provider/localStorage architecture and did not add direct UI localStorage writes.
- Kept import, preview, OCR, thumbnails, native vault files, SQLite, Tauri, cloud, and mobile future-only.

Files changed:

- `src/lib/documents/document-record.ts`
- `src/lib/documents/document-record.test.ts`
- `src/routes/documents.tsx`
- `src/components/documents/DocumentMetadataPanel.tsx`
- `src/components/page/PageWorkspace.tsx`
- `src/components/page/PageRightPanel.tsx`
- `src/lib/page/page-workspace.ts`
- `docs/Plan/Mizaan_Product_Blueprint.md`
- `docs/Phases/phase-document-system-foundation.md`
- `docs/Plan/Mizaan Work Log.docx`
- Document implementation screenshots under `docs/screenshots`

Tests added/updated:

- Added `src/lib/documents/document-record.test.ts`.
- Covered defaults, enum normalization, trimming, unknown safe field preservation, update preservation, relation ID normalization, metadata-only/import/preview honesty, create input defaults, display labels, template defaults, and metadata search coverage.

Screenshots:

- `docs/screenshots/20260601-1531-doc-impl-before-home.png`
- `docs/screenshots/20260601-1531-doc-impl-before-blueprint.png`
- `docs/screenshots/20260601-1531-doc-impl-before-documents.png`
- `docs/screenshots/20260601-1555-doc-impl-documents.png`
- `docs/screenshots/20260601-1555-doc-impl-new-record.png`
- `docs/screenshots/20260601-1556-doc-impl-metadata.png`
- `docs/screenshots/20260601-1556-doc-impl-unsupported-state.png`
- `docs/screenshots/20260601-1557-doc-impl-documents-after-create.png`
- `docs/screenshots/20260601-1557-doc-impl-proof.png`
- `docs/screenshots/20260601-1558-doc-impl-search-if-implemented.png`

Browser QA after work:

- Created a new metadata-only document record.
- Edited title, kind, status, source, document date, file name, file type, extension, and notes.
- Refreshed the page and verified metadata persisted.
- Verified Documents list showed the edited metadata.
- Searched for `policy-2026` and verified the document was found through metadata search.
- Console warnings/errors: none found in checked routes.

Remaining limitations:

- Documents is still a browser/localStorage prototype feature.
- The Documents module remains [• PARTIAL] because real file import, real previews, OCR, thumbnails, duplicate detection, native vault files, SQLite, Tauri, and mobile capture are not implemented.

Next recommended blueprint phase:

- Phase C - Graph relation foundation, because Documents now has normalized metadata relation IDs and the next system dependency is stronger relation/graph behavior.

### Feature: Documents module [• PARTIAL]

Goal:
Make Documents useful as metadata-only local records while keeping native file behavior future-only.

[What Codex understood:
Documents should become usable now as provider-backed metadata records, not as fake imported files.]

[How it is implemented:
`/documents` now lists real document records, creates new metadata-only records, shows record templates, displays metadata state badges, and links records into `/page/$id` detail pages with a document metadata panel.]

[Evidence:
Document helper tests pass; browser QA created and edited `Insurance Policy 2026`, refreshed it, found it on `/documents`, and found `policy-2026` through `/search`.]

[Next required work:
Native filesystem import, preview, OCR, thumbnails, duplicate detection, and vault-file storage remain future phases.]

### Feature: Document metadata model [✅ IMPLEMENTED]

Goal:
Provide typed, normalized metadata for document records.

[What Codex understood:
Document fields need a helper-owned model, not scattered route parsing.]

[How it is implemented:
`src/lib/documents/document-record.ts` defines document kind/status/import/preview/storage states, metadata defaults, normalization, update helpers, display summaries, unsupported reasons, and relation ID normalization.]

[Evidence:
`npx vitest run src/lib/documents/document-record.test.ts` passed with 11 tests.]

[Next required work:
Add migration/native-storage tests when SQLite and vault-file storage exist.]

### Feature: Document record creation [✅ IMPLEMENTED]

Goal:
Create real provider-backed metadata-only document records.

[What Codex understood:
The action must create a `MizaanItem`, persist through the provider, and avoid fake file paths or attachments.]

[How it is implemented:
`createDocumentRecordInput` builds document items, and `/documents` uses `provider.createItem` plus starter blocks before routing to `/page/$id`.]

[Evidence:
Browser QA clicked New document record and opened a new provider-backed page at `/page/item-...`.]

[Next required work:
Native file attachment remains future.]

### Feature: Documents route/list foundation [✅ IMPLEMENTED]

Goal:
Show document records with metadata and honest unsupported states.

[What Codex understood:
The route should not list the promoted Documents space as a document record and should not expose fake import/preview buttons.]

[How it is implemented:
`src/routes/documents.tsx` filters document records with `isDocumentRecordItem`, shows metadata badges, templates, empty state, search, and future-native explanations.]

[Evidence:
Browser QA showed the edited document record with file name, file type, source, date, import state, preview state, and storage state.]

[Next required work:
Bulk actions and import manager remain future.]

### Feature: Document detail metadata UI [✅ IMPLEMENTED]

Goal:
Allow metadata edits on document pages.

[What Codex understood:
Document-specific metadata belongs in page detail context without cluttering normal notes/pages.]

[How it is implemented:
`DocumentMetadataPanel` appears only for document record items inside the right panel and edits title, kind, status, source, date, file metadata, and notes through `provider.updateItem`.]

[Evidence:
Browser QA edited all supported fields, refreshed the page, and verified values persisted.]

[Next required work:
Document-specific relation picker and native file attachment remain future.]

### Feature: Honest unsupported import/preview state [✅ IMPLEMENTED]

Goal:
Make unsupported document features visible without fake controls.

[What Codex understood:
Import, preview, OCR, thumbnails, and native vault file storage must be clearly future-only.]

[How it is implemented:
Documents route and detail panel show record-only import, unavailable preview, browser-record storage, and explanatory text. No active import/preview/OCR buttons were added.]

[Evidence:
Screenshots captured `doc-impl-unsupported-state` and no fake import/preview controls were present.]

[Next required work:
Build real native import/preview only after Tauri/native filesystem phases.]

### Feature: Document template integration [✅ IMPLEMENTED]

Goal:
Allow templates to create provider-backed document records with correct metadata defaults.

[What Codex understood:
Templates must create real records, not static fake examples.]

[How it is implemented:
`page-workspace.ts` now includes general, receipt, identity, invoice, contract, and reference document record templates using `createDefaultDocumentMetadata`.]

[Evidence:
Document helper tests verify invoice template metadata defaults and starter callout block creation.]

[Next required work:
Template editor and user-authored template management remain future.]

### Feature: Document search integration [• PARTIAL]

Goal:
Make document metadata findable through local search.

[What Codex understood:
Search should use existing provider metadata indexing without rewriting the search engine.]

[How it is implemented:
Document metadata is stored in item metadata, which the existing search helper already indexes. Tests verify `fileName` metadata search, and browser QA found `policy-2026` on `/search`.]

[Evidence:
Search test passed and browser QA screenshot `doc-impl-search-if-implemented` captured the result.]

[Next required work:
Extracted text, OCR text, metadata filters, duplicate detection, and native indexes remain future.]

### Feature: Document relation normalization [• PARTIAL]

Goal:
Normalize and preserve document relation ID arrays.

[What Codex understood:
Relation metadata can be normalized now, but a document-specific relation picker should not be faked.]

[How it is implemented:
`normalizeDocumentRelationIds` removes invalid/duplicate IDs for linked pages, projects, people, and finance records; existing generic relation UI remains available separately.]

[Evidence:
Unit tests cover duplicate and invalid relation ID repair.]

[Next required work:
Graph relation foundation should add richer relation UI and graph behavior.]

### Feature: Real filesystem import [❌ NOT IMPLEMENTED]

Goal:
Attach real files to document records.

[What Codex understood:
This requires native filesystem/Tauri and must not be faked in the browser prototype.]

[How it is implemented:
Not implemented. The UI states this is future native work and exposes no fake import button.]

[Evidence:
No Tauri/native filesystem code was added.]

[Next required work:
Native filesystem document import phase.]

### Feature: PDF/DOCX preview [❌ NOT IMPLEMENTED]

Goal:
Preview real document files.

[What Codex understood:
Preview requires real file storage and renderers; adding fake previews would mislead users.]

[How it is implemented:
Not implemented. Preview state is displayed as unavailable.]

[Evidence:
No PDF/DOCX preview renderer was added.]

[Next required work:
Native/filesystem preview phase after file storage exists.]

### Feature: OCR/document intelligence [❌ NOT IMPLEMENTED]

Goal:
Extract text and intelligence from documents.

[What Codex understood:
OCR belongs to a future local-AI/native document phase and must not call cloud services.]

[How it is implemented:
Not implemented. OCR is mentioned only as future/unavailable.]

[Evidence:
No OCR engine, extracted text index, local AI runtime, cloud AI, or remote service was added.]

[Next required work:
Local AI planning after document storage exists.]

## Append-Only Graph Relation Foundation Implementation - 2026-06-01

Date/time: 2026-06-01 22:05 +08:00

Selected phase:

- Phase C - Graph Relation Foundation.

Blueprint file read:

- `docs/Plan/Mizaan_Product_Blueprint.md`

Blueprint updated:

- Yes. Graph remains [PARTIAL] overall.
- The bounded graph model/helper, provider-backed global graph foundation, route filters, direct local focus, source summaries, orphan state, and open-node behavior were recorded as implemented for the browser prototype.

Validation before work:

- `npm run typecheck`: passed.
- `npm run lint`: passed with 0 errors and 10 existing Fast Refresh warnings.
- `npm test`: passed with 10 files and 67 tests.
- `npm run build`: passed with existing Vite chunk-size and TanStack external-unused warnings.

Red-flag scans before work:

- `localStorage`: expected prototype/provider/theme/session/right-panel references only.
- Cloud/auth/provider hits: documentation/product-law text, historical notes, `class-variance-authority`, and `HardDrive` icon names only.
- Fake readiness phrases: historical report text only.
- `TODO|FIXME|mock|fake|placeholder|any`: generated route-tree casts, normal placeholders, and anti-fake copy/tests only.
- `console.log|debugger`: no source matches.
- Runtime URL/font scan in `src`: no matches.

Browser QA before work:

- Checked `/`, `/blueprint`, `/graph`, `/documents`, `/search`, `/settings`, `/templates`, `/databases`, `/calendar`, `/trash`, and `/page/note-principles`.
- In-app Browser route smoke passed with meaningful DOM, no framework overlay, and 0 console warnings/errors.
- In-app Browser screenshots initially timed out, so isolated headless Chrome captured before screenshots.

Graph code inspection summary:

- `src/routes/graph.tsx` used route-local circular SVG logic from the first 24 `snapshot.items` and explicit provider `snapshot.relations`.
- `VaultProvider` already exposes real provider-backed items and relations.
- Page workspace/right panel already resolves outgoing and incoming provider relations.
- Document metadata already normalizes `linkedPageIds`, `linkedProjectIds`, `linkedPersonIds`, and `linkedFinanceIds`.
- Search has metadata indexing but no graph index.
- No reusable graph helper or graph test module existed before this phase.

Implementation summary:

- Added `src/lib/graph/graph-model.ts`.
- Added `src/lib/graph/graph-model.test.ts`.
- Rebuilt `/graph` to use the helper instead of route-local ad hoc graph construction.
- Added real node/edge summaries, type counts, edge-source counts, orphan state, filters, node list, edge list, visual map, direct local focus panel, and open-node actions.
- Kept manual canvas, editable standalone graph nodes, saved layouts, graph export, clustering, embeddings, OCR-derived edges, and semantic/local-AI graph as future-only text, not active controls.

What was implemented:

- Graph model/helper.
- Provider-backed global graph foundation.
- Relation edge extraction from provider relations.
- Relation edge extraction from document metadata relation arrays when targets exist.
- Parent/child hierarchy edge extraction from real `parentId` values.
- Duplicate edge dedupe and invalid target skipping.
- Orphan node detection.
- Deterministic node and edge IDs.
- Global graph summaries.
- Direct local selected-item graph.
- Graph filters for all, documents, pages/notes, projects, people, finance, orphans, and connected nodes.
- Node focus and open actions.

What was deliberately not implemented:

- Tauri.
- SQLite.
- Native filesystem storage.
- Portable vault folders.
- Mobile.
- Encryption/app lock/private graph behavior.
- OCR.
- Embeddings.
- Semantic AI graph.
- Cloud graph or sync.
- Manual local graph/canvas.
- Editable standalone graph nodes.
- Directed manual arrows.
- Saved canvas layouts.
- Graph export image/PDF.
- Graph clustering.
- Graph version history.
- Native graph persistence.

Files changed:

- `src/lib/graph/graph-model.ts`
- `src/lib/graph/graph-model.test.ts`
- `src/routes/graph.tsx`
- `docs/Plan/Mizaan_Product_Blueprint.md`
- `docs/Plan/Mizaan_A_to_Z_Plan.md`
- `docs/Plan/Mizaan Work Log.docx`
- `docs/Phases/phase-graph-relation-foundation.md`
- `docs/screenshots/20260601-2130-graph-foundation-before-home.png`
- `docs/screenshots/20260601-2130-graph-foundation-before-graph.png`
- `docs/screenshots/20260601-2130-graph-foundation-before-documents.png`
- `docs/screenshots/20260601-2130-graph-foundation-before-page.png`
- `docs/screenshots/20260601-2155-graph-foundation-route.png`
- `docs/screenshots/20260601-2155-graph-foundation-global.png`
- `docs/screenshots/20260601-2155-graph-foundation-local-if-implemented.png`
- `docs/screenshots/20260601-2155-graph-foundation-empty-or-orphans.png`
- `docs/screenshots/20260601-2155-graph-foundation-proof.png`

Tests added/updated:

- Added `src/lib/graph/graph-model.test.ts`.
- Coverage includes node creation, category/type mapping, document relation arrays, invalid target skipping, duplicate edge dedupe, orphan detection, global summaries, direct local graph, empty graph behavior, no fake edges, unknown categories, deterministic IDs, edge type counts, and parent-child hierarchy.

Validation after implementation before documentation:

- `npx vitest run src/lib/graph/graph-model.test.ts`: failed first because `./graph-model` did not exist, then passed with 20 tests after implementation.
- `npm run typecheck`: passed.
- `npm run lint`: passed with 0 errors and 10 existing Fast Refresh warnings after formatting touched graph files.
- `npm test`: passed with 11 files and 87 tests.
- `npm run build`: passed with existing Vite chunk-size and TanStack external-unused warnings.

Browser QA after implementation:

- In-app Browser verified `/graph` identity, nonblank DOM, future notices, 0 console warnings/errors, Connected filter behavior, direct local focus behavior, and open-node navigation to `/page/doc-architecture`.
- In-app Browser click-by-role was flaky, so DOM CUA and isolated headless Chrome were used for interaction/screenshot proof without clearing user storage.
- Verified filter: Connected changed the graph to 13 of 14 real nodes.
- Verified local focus: focused `Mizaan Revamp` showed a direct local graph with 4 nodes, 3 edges, and 0 local orphans.
- Verified orphan filter: Orphans changed the graph to 1 of 14 real nodes.
- Verified open action: Open navigated to the real `Architecture Notes` document record page.

Screenshots:

- `docs/screenshots/20260601-2130-graph-foundation-before-home.png`
- `docs/screenshots/20260601-2130-graph-foundation-before-graph.png`
- `docs/screenshots/20260601-2130-graph-foundation-before-documents.png`
- `docs/screenshots/20260601-2130-graph-foundation-before-page.png`
- `docs/screenshots/20260601-2155-graph-foundation-route.png`
- `docs/screenshots/20260601-2155-graph-foundation-global.png`
- `docs/screenshots/20260601-2155-graph-foundation-local-if-implemented.png`
- `docs/screenshots/20260601-2155-graph-foundation-empty-or-orphans.png`
- `docs/screenshots/20260601-2155-graph-foundation-proof.png`

Remaining limitations:

- Graph remains a browser/localStorage prototype.
- No backlink index or wiki-link parser exists.
- No manual canvas/editor exists.
- No graph layout persistence exists.
- No privacy-aware graph hiding exists.
- No native graph index or readable graph files exist.
- No semantic/local-AI graph exists.

Next recommended blueprint phase:

- Calendar completion or Projects/tasks foundation. Calendar remains a core module with recurrence/reminders/ICS still missing; Projects/tasks would make graph relations more useful by adding stronger typed project/task entities.

### Feature: Graph module [PARTIAL]

Goal:
Make Mizaan's local knowledge relationships visible without fake graph data.

[What Codex understood:
The Graph module should remain partial overall, but this phase should make the automatic provider-backed relation foundation truthful and testable.]

[How it is implemented:
`/graph` now consumes `buildGlobalGraph` and `buildLocalGraph`, renders real provider-backed nodes/edges, summaries, filters, local focus, node lists, edge lists, and future-only graph/canvas notices.]

[Evidence:
Graph helper tests passed with 20 tests; full tests passed with 87 tests; browser QA verified filter, focus, orphan, and open-node behavior.]

[Next required work:
Backlink indexing, wiki-link parsing, manual graph/canvas, saved layouts, export, privacy-aware hiding, and native graph persistence.]

### Feature: Graph model/helper [IMPLEMENTED]

Goal:
Create a reusable pure graph model that can be tested outside the route.

[What Codex understood:
Graph construction should not be route-local UI math and should not read browser storage directly.]

[How it is implemented:
`src/lib/graph/graph-model.ts` builds deterministic global/local graph models from provider `items` and `relations`.]

[Evidence:
`npx vitest run src/lib/graph/graph-model.test.ts` passed with 20 tests.]

[Next required work:
Extend only when new real edge sources, privacy fields, or graph layout persistence exist.]

### Feature: Provider-backed global graph [IMPLEMENTED]

Goal:
Show current local provider items and real relation edges.

[What Codex understood:
Sparse real data is better than a visually rich fake graph.]

[How it is implemented:
Global graph nodes come from active provider items. Edges come from explicit provider relations, document metadata relation IDs, and parentId hierarchy when real targets exist.]

[Evidence:
Browser QA showed 14 real nodes, 9 real edges, 1 orphan, type/source summaries, and the Connected filter.]

[Next required work:
Backlink index, wiki-link parsing, saved graph views, and later native graph storage.]

### Feature: Relation edge extraction [IMPLEMENTED]

Goal:
Extract edges only from safe real sources.

[What Codex understood:
Edges must not come from title similarity, random generation, shared category, or AI inference.]

[How it is implemented:
Provider relations, document `linkedPageIds`, `linkedProjectIds`, `linkedPersonIds`, `linkedFinanceIds`, and parentId hierarchy are accepted. Invalid/missing targets and duplicate edges are skipped.]

[Evidence:
Unit tests cover document relation fields, invalid targets, duplicate IDs, duplicate provider edges, and parent-child hierarchy.]

[Next required work:
Add wiki-link/backlink extraction only after stored page link IDs exist.]

### Feature: Local graph foundation [PARTIAL]

Goal:
Show a selected real item's direct relation neighborhood.

[What Codex understood:
Local graph in this phase means direct neighbors only, not a full manual canvas or second-degree graph.]

[How it is implemented:
`buildLocalGraph` filters the global graph to the selected node and its direct incoming/outgoing neighbors. `/graph` exposes this through Focus actions.]

[Evidence:
Browser QA focused `Mizaan Revamp` and verified 4 local nodes, 3 edges, and 0 local orphans.]

[Next required work:
Second-degree expansion, wiki links, saved local layout, and page-right-panel integration if needed.]

### Feature: Graph route/list/visual UI [IMPLEMENTED]

Goal:
Make graph truth inspectable in the route.

[What Codex understood:
A truthful structured graph UI is safer than a fake complex graph editor.]

[How it is implemented:
The route shows summary cards, filterable visual map, node list, edge list, source summary, local focus panel, and future-only graph work.]

[Evidence:
Screenshots show route, global/filter state, local focus, orphan state, and document open proof.]

[Next required work:
Richer layout controls only after a saved layout model exists.]

### Feature: Graph filters/focus/open behavior [IMPLEMENTED]

Goal:
Provide real controls with observable state changes.

[What Codex understood:
Every visible button must work or be clearly future-only text.]

[How it is implemented:
Filter buttons update the graph view. Focus buttons select a local graph. Open links navigate to real provider page routes.]

[Evidence:
Browser QA verified Connected, Orphans, Focus, and Open behavior with 0 console warnings/errors.]

[Next required work:
Saved filters/search integration later.]

### Feature: Manual local graph/canvas [NOT IMPLEMENTED]

Goal:
Allow user-authored canvas/graph layouts later.

[What Codex understood:
Manual canvas is separate from automatic relation graph foundation.]

[How it is implemented:
Not implemented. The route only shows future-only text and no active canvas controls.]

[Evidence:
No manual canvas model, standalone nodes, arrow editor, or layout persistence was added.]

[Next required work:
Create a real canvas data model, editor UI, tests, persistence, and browser QA before enabling controls.]

### Feature: Editable standalone graph nodes [NOT IMPLEMENTED]

Goal:
Let users add graph-only nodes later.

[What Codex understood:
Adding fake "Add node" controls would be misleading without a saved model.]

[How it is implemented:
Not implemented.]

[Evidence:
No standalone node model or button was added.]

[Next required work:
Manual graph/canvas phase.]

### Feature: Directed manual arrows [NOT IMPLEMENTED]

Goal:
Let users draw/edit manual arrows later.

[What Codex understood:
Provider relation direction exists, but manual arrow editing is a different feature.]

[How it is implemented:
Not implemented.]

[Evidence:
No arrow editor or manual edge persistence was added.]

[Next required work:
Manual graph/canvas phase.]

### Feature: Graph clustering/export [NOT IMPLEMENTED]

Goal:
Cluster and export graph views later.

[What Codex understood:
These depend on stronger graph/layout/export foundations.]

[How it is implemented:
Not implemented.]

[Evidence:
No clustering engine, image export, or PDF export was added.]

[Next required work:
Graph layout/export phase after manual graph model exists.]

### Feature: Local AI semantic graph [NOT IMPLEMENTED]

Goal:
Use local-only AI/embeddings later.

[What Codex understood:
This phase must not add semantic inference, embeddings, OCR-derived graph edges, or cloud AI.]

[How it is implemented:
Not implemented.]

[Evidence:
No embedding, OCR, semantic, cloud, or AI graph code was added.]

[Next required work:
Future local AI architecture only.]

## Append-Only Projects and Tasks Foundation Implementation - 2026-06-02 13:05 +08:00

Date/time:
2026-06-02 13:05 +08:00

Selected phase:
Projects and Tasks Foundation.

Blueprint file read:
`docs/Plan/Mizaan_Product_Blueprint.md`

Blueprint updated:
Yes. Projects and Tasks remain [PARTIAL] overall, while the scoped project/task metadata models, provider-backed records, route/detail foundation, metadata search, graph relation extraction, and templates are recorded as implemented where tested/QA verified.

Validation before work:
`npm run typecheck` passed.
`npm run lint` passed with 0 errors and 10 existing Fast Refresh warnings.
`npm test` passed with 11 files and 87 tests.
`npm run build` passed with existing Vite/TanStack warnings.

Red-flag scans before work:
Allowed localStorage references were limited to prototype provider/theme/session/right-panel/vault/test paths.
No runtime cloud/auth/OAuth/Firebase/Supabase/Clerk/backend integration was found.
No source `console.log` or `debugger` matches were found.
No runtime external font/resource URLs were found in `src`.

Browser QA before work:
Chrome DevTools fallback was used because the in-app Browser MCP was unavailable.
Routes checked: `/`, `/blueprint`, `/projects`, `/search`, `/graph`, `/documents`, `/settings`, `/templates`, `/databases`, `/calendar`, `/trash`, and `/page/note-principles`.
No blank screen or route crash was observed.

Project/task code inspection summary:
`/projects` was a generic `SpacePage` surface.
No dedicated task route existed.
The provider already supported item creation/update and relation records.
Document metadata helper/panel patterns were the safest local precedent.
Search already indexed item metadata recursively.
Graph could safely accept project/task metadata edges if relation ids were normalized and missing targets were ignored.

Implementation summary:
Added typed project and task metadata helpers, provider-compatible record inputs, project/task templates, provider vocabulary for task items, dedicated Projects route/list, project detail metadata panel, linked-task creation/list/editing, task metadata panel, title synchronization, graph metadata edges, search metadata tests, and browser QA proof.

What was implemented:

- [IMPLEMENTED] Projects module foundation: dedicated `/projects` route lists real provider-backed project records.
- [IMPLEMENTED] Project metadata model: status, priority, area, start date, deadline, description, notes, and relation id arrays are normalized and tested.
- [IMPLEMENTED] Project record creation: creates real provider-backed `projects/project` items.
- [IMPLEMENTED] Projects route/list foundation: shows real project records, status, priority, deadline, task count, relation counts, templates, and honest empty/future states.
- [IMPLEMENTED] Project detail metadata UI: right panel edits project title/status/priority/area/deadline/description/notes and persists via provider update.
- [PARTIAL] Tasks system: task records are real and editable, but there is no dedicated `/tasks` route or full task workspace.
- [IMPLEMENTED] Task metadata model: status, priority, due date, project id, relation ids, notes, done/overdue helpers, and provider-compatible input are normalized and tested.
- [IMPLEMENTED] Task record creation: linked tasks are real `tasks/task` provider items.
- [IMPLEMENTED] Project-task relation foundation: project `linkedTaskIds` and task `taskProjectId` are stored as normalized metadata.
- [IMPLEMENTED] Project/task graph integration: graph shows project-task and task-project metadata edges from real ids.
- [IMPLEMENTED] Project/task search integration: search indexes project/task metadata through the existing metadata search path.
- [IMPLEMENTED] Project/task template integration: project and task templates create normalized provider-backed metadata defaults.
- [NOT IMPLEMENTED] Kanban boards.
- [NOT IMPLEMENTED] Timeline/Gantt.
- [NOT IMPLEMENTED] Recurring tasks.
- [NOT IMPLEMENTED] Reminders/native notifications.
- [NOT IMPLEMENTED] Calendar-linked task scheduling.

What was deliberately not implemented:
Tauri, SQLite, native filesystem, portable vault folders, encryption/app lock, native notifications, cloud sync, OAuth/auth, backend, telemetry, AI planning, team/collaboration, mobile task capture, dependency engine, budget automation, recurring tasks, reminders, kanban, timeline/Gantt, and calendar scheduling.

Files changed:
Source files include project/task helpers, Projects route, project metadata panel, page workspace/right-panel/template integration, graph model, search tests, provider vocabulary, command palette, product map, and supporting route/component updates.
Docs include Product Blueprint, this append-only master Markdown, phase report, DOCX work log, and screenshots.

Tests added/updated:
Project helper tests, task helper tests, graph relation tests, search metadata tests, and page workspace/template tests.

Screenshots:
`docs/screenshots/20260602-0245-projects-before-home.png`
`docs/screenshots/20260602-0245-projects-before-projects.png`
`docs/screenshots/20260602-0245-projects-before-graph.png`
`docs/screenshots/20260602-1248-projects-foundation-route.png`
`docs/screenshots/20260602-1248-projects-foundation-new-project.png`
`docs/screenshots/20260602-1248-projects-foundation-project-metadata.png`
`docs/screenshots/20260602-1248-projects-foundation-task-section.png`
`docs/screenshots/20260602-1248-projects-foundation-proof.png`
`docs/screenshots/20260602-1248-projects-foundation-graph-if-implemented.png`

Validation after work:
Targeted tests passed: 5 files and 75 tests.
Full validation before documentation passed: typecheck, lint, 13-file/120-test suite, and build.
Final validation is recorded in `docs/Phases/phase-projects-tasks-foundation.md`.

Browser QA after work:
Created a real project, edited metadata, created a linked task, edited task title/status/priority/due date, refreshed the project page, verified persistence, searched project metadata, verified graph project/task edges, and swept required routes for nonblank rendering.
Chrome reported no error/warn console messages. Generic form-field issue notices about missing `id`/`name` attributes were observed and recorded as non-runtime-error browser issues.

Remaining limitations:
Still browser/localStorage prototype only.
No dedicated `/tasks` route.
No kanban, timeline/Gantt, recurring task engine, reminder engine, native notifications, calendar scheduling, dependency graph, project budget automation, AI planning, team/collaboration, mobile task capture, SQLite, Tauri, native filesystem, portable vault folders, or encryption.

Spaghetti cleanup:
Project/task normalization moved into helper modules, route-only metadata parsing was avoided, real provider records replaced fake rows, search reused the existing metadata path, and graph relations are metadata-id based rather than inferred from titles. (spaghetti code cleared)

Next recommended blueprint phase:
People/CRM foundation, because projects/tasks now have safe `linkedPersonIds` relation fields but People still needs a typed local profile model before project ownership/contact context can be honest.

## Append-Only People and CRM Foundation Implementation - 2026-06-02 18:25 +08:00

Date/time:
2026-06-02 18:25 +08:00.

Selected phase:
People and CRM Foundation.

Blueprint file read:
`docs/Plan/Mizaan_Product_Blueprint.md`.

Blueprint updated:
Yes. People, Person/Contact Model, and Phase I status were updated to reflect the implemented foundation while keeping People/CRM overall [PARTIAL].

Validation before work:
`npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` passed before implementation. Baseline tests were 13 files and 120 tests.

Red-flag scans:
Scans for localStorage, cloud/auth/Google Contacts terms, fake readiness phrases, placeholder/mock terms, console/debugger, external runtime URLs/fonts, and privacy/encryption/lock language were run before implementation. No runtime cloud/auth/contact sync, fake people data, direct route localStorage writes, external runtime font/resource, or fake privacy implementation was found.

Browser QA before work:
The in-app Browser tool was unavailable, so isolated Chrome DevTools fallback was used without clearing user storage. Routes `/`, `/blueprint`, `/people`, `/projects`, `/graph`, `/search`, `/documents`, `/settings`, `/templates`, `/databases`, `/calendar`, `/trash`, `/page/note-principles`, `/page/project-mizaan`, and `/page/doc-architecture` loaded nonblank. Before screenshots were captured.

People/CRM code inspection summary:
`src/routes/people.tsx` was a generic `SpacePage` wrapper. The provider model already supported category `people` and type `person`, but there was no typed person helper, no typed interaction item type, no relationship/follow-up/privacy metadata panel, no person-derived graph edges, and no people-specific route list. Projects/tasks/documents already exposed safe `linkedPersonIds`, so People could become a real graph/search relation target.

Implementation summary:
The phase added typed person and interaction helpers, provider-backed person records, provider-backed linked interaction records, a dedicated People route/list, a person/interaction right-panel metadata UI, graph/search/template integration, and tests. The implementation keeps private/sensitive flags as metadata only and does not claim encryption, app lock, or hidden search/graph behavior.

Feature blocks:
[ IMPLEMENTED] People module foundation - provider-backed local people route/list and person page metadata UI.
[ IMPLEMENTED] Person metadata model - tested normalization, enums, relation IDs, privacy summary, graph targets, and search metadata.
[ IMPLEMENTED] Person record creation - real provider-backed records via helper input and People route New person action.
[ IMPLEMENTED] People route/list foundation - real records only, no fake contact rows or fake CRM metrics.
[ IMPLEMENTED] Person detail metadata UI - relationship, contact-context, follow-up, notes/context/boundaries, and metadata-only privacy fields persist through provider updates.
[ IMPLEMENTED] Interaction log foundation - real provider-backed interaction records can be created from person detail and edited; full timeline views remain future.
[ IMPLEMENTED] People graph integration - person/interaction nodes and metadata relation edges are covered by graph tests and browser proof.
[ IMPLEMENTED] People search integration - person and interaction metadata are indexed through the existing search path.
[ IMPLEMENTED] People template integration - Person Profile, Relationship Notes, Contact Context, Follow-up Note, and Interaction Log templates produce normalized metadata.
[ IMPLEMENTED] Privacy metadata flags - private/sensitive booleans are local metadata only with honest UI copy.
[ NOT IMPLEMENTED] Real privacy/app lock - no encryption, lock, or hidden-from-search/graph behavior exists.
[ NOT IMPLEMENTED] Google Contacts/contact import - no Google Contacts, vCard/CSV import, phone contact import, or cloud sync was added.
[ NOT IMPLEMENTED] CRM automation - no AI summaries, automatic interaction capture, relationship analytics, team CRM, reminders, or native notifications were added.

What was deliberately not implemented:
Google Contacts, contact import/sync, phone contact import, email/message import, AI relationship summaries, automatic meeting history, real privacy/app lock, encrypted contacts, hidden-from-search behavior, hidden-from-graph behavior, reminder engines, native notifications, mobile capture, cloud CRM, and team/collaboration were excluded because this phase is a truthful local-first browser/localStorage foundation.

Files changed:
Source files include people helper modules, People route, People metadata panel, page workspace/right-panel integration, graph model, product map, command palette, template metadata, and vault type vocabulary.
Test files include person, interaction, graph, search, and page-template tests.
Docs/screenshots include the product blueprint, this append-only plan entry, the phase report, DOCX work log entry, and People/CRM screenshots.

Tests added/updated:
Person helper tests, interaction helper tests, graph model relation tests, search metadata test, and page-workspace template metadata test.

Screenshots:
`docs/screenshots/20260602-1723-people-before-home.png`
`docs/screenshots/20260602-1723-people-before-people.png`
`docs/screenshots/20260602-1723-people-before-graph.png`
`docs/screenshots/20260602-1807-people-foundation-route.png`
`docs/screenshots/20260602-1807-people-foundation-new-person.png`
`docs/screenshots/20260602-1807-people-foundation-person-metadata.png`
`docs/screenshots/20260602-1807-people-foundation-interaction-section.png`
`docs/screenshots/20260602-1807-people-foundation-proof.png`
`docs/screenshots/20260602-1807-people-foundation-graph-if-implemented.png`

Validation after work:
Implementation validation passed before documentation updates: targeted people/interaction/graph/search/template tests, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. Final validation and final push evidence are recorded in `docs/Phases/phase-people-crm-foundation.md`.

Browser QA after work:
Created a real person, edited relationship/contact/follow-up/notes/privacy metadata, created a real linked interaction, edited interaction metadata, refreshed and verified persistence, searched person metadata, verified graph person/interaction nodes and edges, and swept required routes for nonblank rendering. Chrome reported no runtime console errors; form-field `id`/`name` issue notices remained as a nonblocking accessibility issue.

Remaining limitations:
Still browser/localStorage prototype only. People/CRM is partial. No Google Contacts sync, vCard/CSV import, phone contact import, cloud CRM, email/message import, AI relationship summaries, automatic interaction capture, encrypted private contacts, real app lock/privacy lock, hidden-from-search behavior, hidden-from-graph behavior, reminder engine, native notifications, mobile contact capture, full interaction timeline, relationship analytics, collaboration/team CRM, SQLite, Tauri, native filesystem, or portable vault folders.

Spaghetti cleanup:
Person and interaction metadata parsing moved into tested helper modules, route-only metadata parsing was avoided, direct localStorage writes were not added, fake people/contact/import/privacy controls were avoided, and graph relations are metadata-id based rather than inferred from names or organizations. (spaghetti code cleared)

Next recommended blueprint phase:
Finance foundation, because People now provides local person relation targets and the next missing core data layer is local finance records that can connect to documents, projects, tasks, calendar, and people without bank/cloud integration.

## Append-Only Finance Foundation Implementation - 2026-06-02 23:09 +08:00

Date/time:
2026-06-02 23:09 +08:00.

Selected phase:
Finance Foundation.

Blueprint file read:
`docs/Plan/Mizaan_Product_Blueprint.md`.

Blueprint updated:
Yes. Finance, Finance Model, Product Map, and Phase J status were updated to reflect the implemented foundation while keeping Finance overall [PARTIAL].

Validation before work:
`npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` passed before implementation. Baseline tests were 15 files and 150 tests.

Red-flag scans:
Scans for localStorage, cloud/auth/bank/payment provider terms, fake readiness phrases, TODO/mock/fake/placeholder/any, console/debugger, external runtime URLs/fonts, privacy/encryption/lock language, and tax/accounting/ledger/receipt terms were run before implementation. No runtime cloud/auth/bank/payment provider integration, fake finance engine, fake privacy implementation, source console/debugger, or external runtime URL/font was found.

Browser QA before work:
The in-app Browser tool timed out, so isolated Chrome DevTools fallback was used without clearing user storage. Routes `/`, `/blueprint`, `/finance`, `/people`, `/projects`, `/graph`, `/search`, `/documents`, `/settings`, `/templates`, `/databases`, `/calendar`, `/trash`, `/page/note-principles`, `/page/project-mizaan`, and `/page/doc-architecture` loaded nonblank. Before screenshots were captured.

Finance code inspection summary:
`src/routes/finance.tsx` was a generic `SpacePage` wrapper. The provider already supported category `finance` and type `finance`, but there was no typed finance metadata helper, no typed transaction/budget/bill/subscription metadata, no finance detail metadata panel, no local totals, no finance-owned graph edges, and no finance-specific route list. Existing generic finance pages are preserved and normalized at read time.

Implementation summary:
The phase added typed finance helpers, provider-backed finance records, a dedicated Finance route/list, a finance right-panel metadata UI, local transaction totals from real records only, graph/search/template integration, command-palette creation, seed metadata defaults, and tests. The implementation keeps private/sensitive flags as metadata only and does not claim encryption, app lock, hidden search/graph behavior, banking, tax, or accounting readiness.

Feature blocks:
[ IMPLEMENTED] Finance module foundation - provider-backed local finance route/list and finance page metadata UI.
[ IMPLEMENTED] Finance metadata model - tested normalization for kind, transaction type, status, payment method, currency, amount, dates, relation IDs, privacy summary, graph targets, and totals.
[ IMPLEMENTED] Finance record creation - real provider-backed records for expenses, income, bills, subscriptions, budgets, reimbursements, and generic finance records.
[ IMPLEMENTED] Finance route/list foundation - real records only, no fake bank rows or fake accounting metrics.
[ IMPLEMENTED] Finance detail metadata UI - title, kind, status, amount, currency, dates, category, account/wallet labels, counterparties, payment method, recurring note, relation IDs, notes, and metadata-only privacy flags persist through provider updates.
[ IMPLEMENTED] Finance graph integration - finance records create metadata edges to documents, projects, tasks, people, and calendar records.
[ IMPLEMENTED] Finance search integration - finance metadata is indexed through the existing local metadata search path.
[ IMPLEMENTED] Finance template integration - finance templates and command-palette creation produce normalized provider-backed metadata.
[ IMPLEMENTED] Local summary totals - totals use real finance transaction records only and mark mixed currencies instead of converting.
[ NOT IMPLEMENTED] Bank sync/import, online payment APIs, receipt OCR, tax filing, accounting-grade ledgers, double-entry bookkeeping, automated budgets, reminders/native notifications, encrypted private finance, app/privacy lock, mobile receipt capture, AI finance advice, SQLite/native storage, Tauri, native filesystem, and portable vault folders.

What was deliberately not implemented:
Plaid/open banking, Stripe, PayPal, Wise, crypto/investment/brokerage integrations, CSV import/export, receipt OCR, automatic receipt extraction, tax filing, accounting systems, double-entry ledgers, recurring payment automation, bill reminders, native notifications, real privacy/app lock, hidden-from-search behavior, hidden-from-graph behavior, encryption, mobile capture, cloud sync, auth, backend, telemetry, SQLite, Tauri, native filesystem, and portable vault folders were excluded because this phase is a truthful local-first browser/localStorage foundation.

Files changed:
Source files include finance helper module/tests, Finance route, Finance metadata panel, page workspace/right-panel integration, graph model, search tests, template metadata, command palette, vault seed metadata, and product map.
Docs/screenshots include the product blueprint, this append-only plan entry, the phase report, DOCX work log entry, and Finance screenshots.

Tests added/updated:
Finance helper tests, graph model finance relation tests, search metadata test, and page-workspace finance template metadata test.

Screenshots:
`docs/screenshots/20260602-2242-finance-before-home.png`
`docs/screenshots/20260602-2242-finance-before-finance.png`
`docs/screenshots/20260602-2242-finance-before-graph.png`
Post-implementation screenshots are recorded in `docs/Phases/phase-finance-foundation.md`.

Validation after work:
Targeted finance/graph/search/template tests passed, `npm run typecheck` passed, and `npm run lint` passed with the existing 10 Fast Refresh warnings before this append. Final validation and final push evidence are recorded in `docs/Phases/phase-finance-foundation.md`.

Browser QA after work:
Post-implementation browser QA is recorded in `docs/Phases/phase-finance-foundation.md`, including finance create/edit/refresh/search/graph proof and route sweep.

Remaining limitations:
Still browser/localStorage prototype only. Finance is partial. No bank sync/import, payment API, receipt OCR, tax/accounting system, double-entry ledger, automated budget engine, recurring payment engine, reminder engine, native notifications, encrypted private finance, real app lock/privacy lock, hidden-from-search behavior, hidden-from-graph behavior, mobile receipt capture, CSV import/export, SQLite, Tauri, native filesystem, or portable vault folders.

Spaghetti cleanup:
Finance parsing moved into a tested helper module, route-only metadata parsing was avoided, direct localStorage writes were not added, fake finance/bank/tax/accounting controls were avoided, and graph relations are metadata-id based rather than inferred from titles or amounts. (spaghetti code cleared)

Next recommended blueprint phase:
Trackers/goals foundation, because Finance now supplies real local money records and relation targets while trackers/goals remain the next generic page-like modules without typed local engines.

## Append-Only Persistence Export Restore Hardening Implementation - 2026-06-03 14:16 +08:00

Date/time:
2026-06-03 14:16 +08:00.

Selected phase:
Persistence, Export, Restore, and Data-Hardening.

Why this came before Trackers/Goals:
Finance added the newest typed provider-backed metadata surface. Adding more product modules before export/restore hardening would increase the localStorage data surface without a tested archive round-trip, so this phase came first.

Validation before work:
`git status -sb`, branch, remote, fetch, parity, and required path checks passed. `main...origin/main` was `0 0`, tracked worktree was clean, and latest pre-work commit was `ff8c6d2 Implement finance foundation`. `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` passed before implementation.

Code inspection summary:
The provider stores versioned items, blocks, and relations under browser localStorage key `mizaan.prototype.vault.v1`. Settings and Vault showed provider facts but no archive controls. Finance, People, Projects, Tasks, Documents, and Graph store typed data in `MizaanItem.metadata` and relation IDs that needed round-trip preservation. Provider preview and restore semantics needed to stay preview-first and non-destructive.

Implementation summary:
Added a tested browser-prototype archive layer, provider restore helper, and Settings/Vault archive UI. Archive helpers create versioned Mizaan archives, validate JSON, reject corrupt/wrong-app/unsupported future archives, preserve unknown safe metadata, preview restore without mutation, merge safely, and guard replace behind explicit confirmation. UI supports export JSON, file/paste load, validation, restore preview, safe merge apply, and replace confirmation copy.

Feature blocks:
[ IMPLEMENTED] Browser prototype archive export for current provider/localStorage items, blocks, relations, trash/template summaries, metadata, warnings, counts, and checksums.
[ IMPLEMENTED] Archive validation for version/app/source/items/counts and corruption cases.
[ IMPLEMENTED] Restore preview that reports create/update/remove/block-change counts and does not mutate current data.
[ IMPLEMENTED] Restore merge for current browser provider data.
[ PARTIAL] Restore replace, guarded by explicit confirmation and tested, but no native rollback/history exists.
[ IMPLEMENTED] Finance, People, Project/Task, Document, and Graph relation metadata round-trip tests.
[ IMPLEMENTED] Settings and Vault browser archive panel with honest localStorage-only warnings.
[ NOT IMPLEMENTED] Native filesystem backup, SQLite backup, encrypted backup, app lock, portable vault backup, Tauri, cloud sync, auth, backend, bank sync, mobile, or final migration rollback.

What was deliberately not implemented:
Native filesystem storage, portable vault folders, SQLite provider/backups, Tauri, encrypted backup, real app lock, cloud/auth/backend, Google/Drive/OAuth/Firebase/Supabase/Clerk, telemetry, bank sync, OCR, mobile, and final import/export manager routes were excluded. The archive is a browser/localStorage prototype safety layer only.

Files changed:
Source files include `src/lib/vault/vault-archive.ts`, `src/lib/vault/types.ts`, `src/lib/vault/local-storage-vault-provider.ts`, `src/components/vault/VaultArchivePanel.tsx`, `src/routes/settings.tsx`, and `src/routes/vault.tsx`.
Test files include `src/lib/vault/vault-archive.test.ts` and `src/lib/vault/local-storage-vault-provider.test.ts`.
Docs/screenshots include this append-only entry, the product blueprint, the phase report, the DOCX work log entry, and persistence screenshots.

Tests added/updated:
Archive helper tests and provider restore tests cover invalid JSON, wrong app, unsupported newer version, missing items, invalid IDs, duplicate IDs, corrupt archive no-wipe behavior, unknown safe metadata preservation, module metadata preservation, graph relation IDs, non-mutating preview, merge, guarded replace, empty archives, and export/parse/validate/restore/export count stability.

Screenshots:
`docs/screenshots/20260603-0427-persistence-before-settings.png`
`docs/screenshots/20260603-0427-persistence-before-vault.png`
`docs/screenshots/20260603-0427-persistence-before-finance.png`
`docs/screenshots/20260603-1417-persistence-settings.png`
`docs/screenshots/20260603-1417-persistence-vault.png`
`docs/screenshots/20260603-1417-persistence-export.png`
`docs/screenshots/20260603-1417-persistence-restore-preview.png`
`docs/screenshots/20260603-1417-persistence-proof.png`

Validation after work:
Targeted archive/provider tests passed, `npm run typecheck` passed, `npm run lint` passed with the existing 10 Fast Refresh warnings, `npm test` passed with 17 files and 193 tests, and `npm run build` passed with existing Vite/TanStack warnings. Final validation and push evidence are recorded in `docs/Phases/phase-persistence-export-restore-hardening.md`.

Browser QA after work:
Preview ran on `http://127.0.0.1:4184`. `/settings` exported, validated, previewed, and safely merge-applied a browser archive without data loss. `/vault` exposed the same Browser Archive panel and continued to label native vault, SQLite, Tauri, markdown mirrors, and lock-file support as not implemented. Route sweep for Settings, Vault, Finance, People, Projects, Documents, Graph, Search, Templates, Databases, Calendar, Trash, and `/page/note-principles` loaded nonblank with no runtime console errors.

Remaining limitations:
Mizaan remains a browser/localStorage prototype. The archive is not lifetime storage and not a native vault backup. Native filesystem backup, SQLite backup, encrypted backup, portable vault backup, app lock, final migration rollback, and full import/export manager remain future.

Phase B decision:
Trackers + Goals Foundation was not started before Phase A final commit/push/parity. It may start only if final Phase A validation, docs, DOCX, push, parity, and clean worktree all pass.

Next recommended blueprint phase:
Trackers/goals foundation, only after Phase A final validation and push parity are clean.

## Append-Only Trackers Goals Foundation Implementation - 2026-06-03 14:55 +08:00

Selected phase:
Trackers + Goals Foundation.

Why this started after Persistence Export Restore Hardening:
Persistence/export/restore hardening was completed, committed, pushed, and verified at parity before this phase started. The archive layer now round-trips current provider/localStorage metadata, so adding tracker and goal metadata did not expand the prototype data surface without tested export/restore safety.

Validation before work:
Phase B started from `main` at parity `0 0` after Phase A closure commit `e898150`. `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` passed before Phase B implementation. Lint had the same 10 known Fast Refresh warnings and 0 errors.

Code inspection summary:
`src/routes/trackers.tsx` was a generic `SpacePage`; no `src/routes/goals.tsx` existed. `ItemCategory` and `ItemType` lacked `goals` and `goal`. The provider seeded a generic tracker item with `properties.streak`, page templates had no Goals space/template, graph did not read tracker/goal metadata, search only had generic metadata coverage, and the page right panel lacked tracker/goal metadata panels.

Implementation summary:
[ IMPLEMENTED] Tracker metadata model - typed tracker title, type, status, frequency, target/current/unit fields, dates, relation IDs, real check-ins, tags, and metadata-only private/sensitive flags.
[ IMPLEMENTED] Goal metadata model - typed goal title, status, horizon, target date, progress fields, priority, relation IDs including linked trackers, tags, and metadata-only private/sensitive flags.
[ IMPLEMENTED] Provider-backed tracker records - dedicated `/trackers` route, create actions for habit/study/reading/productivity/finance/custom trackers, tracker cards, local stats, search field, and route empty state.
[ IMPLEMENTED] Provider-backed goal records - dedicated `/goals` route, create actions for short-term/medium-term/long-term/lifetime/custom goals, goal cards, local stats, search field, and route empty state.
[ IMPLEMENTED] Detail metadata UI - `TrackerMetadataPanel` and `GoalMetadataPanel` edit typed metadata from `/page/$id`. Tracker check-ins are real metadata entries, not fake streaks.
[ IMPLEMENTED] Graph/search/template integration - tracker and goal metadata are searchable; graph helper creates tracker metadata edges and goal metadata edges including `tracker-link`; templates create normalized tracker/goal metadata.
[ IMPLEMENTED] Provider vocabulary and seed hardening - `goals` and `goal` were added to provider types, a Goals space is seeded, the seeded tracker now has typed metadata, and legacy seeded `streak` is preserved as metadata instead of shown as a fake active streak property.

What was deliberately not implemented:
Fake streaks, fake progress history, tracker charts, goal charts, rollups, reminder engines, native notifications, AI coaching, wearable integrations, medical/health tracking claims, cloud sync, mobile capture, calendar scheduling, encrypted private tracking/goals, real privacy/app lock, hidden search/graph behavior, SQLite, Tauri, native filesystem storage, and portable vault folders.

Files changed:
Source files include tracker/goal helper modules, tracker/goal route files, tracker/goal metadata panels, page workspace templates, provider vocabulary/seed migration, right-panel integration, graph model, command palette, top bar, route tree, home labels, and product map.
Tests include tracker helper tests, goal helper tests, graph model tracker/goal edge tests, search metadata tests, page-workspace template tests, and product-map tracker/goal status tests.
Docs/screenshots include the product blueprint, this append-only plan entry, the phase report, the DOCX work log entry, and Trackers/Goals screenshots.

Screenshots:
`docs/screenshots/20260603-1451-trackers-route.png`
`docs/screenshots/20260603-1451-tracker-metadata-checkin.png`
`docs/screenshots/20260603-1451-goals-route.png`
`docs/screenshots/20260603-1451-goal-metadata-progress.png`
`docs/screenshots/20260603-1451-trackers-goals-search.png`
`docs/screenshots/20260603-1451-trackers-goals-graph.png`
`docs/screenshots/20260603-1451-trackers-goals-graph-metadata-edge.png`

Validation after implementation:
Focused tracker/goal/model tests passed with 6 files and 94 tests. `npm run typecheck` passed after TanStack route-tree regeneration. `npm run lint` passed with 0 errors and the existing 10 Fast Refresh warnings. `npm test` passed with 19 files and 220 tests. `npm run build` passed with existing Vite chunk-size and TanStack external-unused warnings. Final post-documentation validation is recorded in `docs/Phases/phase-trackers-goals-foundation.md`.

Browser QA after work:
Preview ran on `http://127.0.0.1:4196` in an isolated Chrome profile. `/trackers` loaded, created a Study tracker, opened the tracker page, showed `TrackerMetadataPanel`, and added a real check-in. `/goals` loaded, created a Long-term goal, opened the goal page, showed `GoalMetadataPanel`, and edited progress to `24 credits`. `/search` found the created tracker. `/graph` loaded tracker and goal nodes. A supplemental graph proof linked the created goal to the created tracker and showed rendered `tracker-link` and `goal-metadata` evidence. Route sweep for `/trackers`, `/goals`, `/finance`, `/people`, `/projects`, `/documents`, `/graph`, and `/search` loaded nonblank with 0 severe console messages.

Remaining limitations:
Mizaan remains a browser/localStorage prototype. Trackers and Goals are partial local foundations, not final engines. Private/sensitive flags remain metadata-only and do not encrypt, lock, hide from search, or hide from graph. Native storage, SQLite, Tauri, app lock/encryption, mobile, reminders, notifications, charts, automation, health integrations, and cloud sync remain future.

Phase B status:
Trackers + Goals Foundation was started and implemented after Phase A passed. It still requires final validation, DOCX update verification, commit, push, and parity proof before closure.

Next recommended phase:
Choose the next bounded phase only after this phase is committed, pushed, and parity is clean. Based on current evidence, the next safest follow-up is a repair/recovery or import/export manager foundation rather than a larger product module.

## Append-Only Trackers Goals Foundation Closure Evidence - 2026-06-03 15:02 +08:00

Closure status:
Trackers + Goals Foundation final validation passed, DOCX structural verification passed, implementation commit `537051b Implement trackers and goals foundation` was pushed to `origin/main`, and `main...origin/main` parity was verified as `0 0`.

Final validation:
`npm run typecheck` passed. `npm run lint` passed with 0 errors and the existing 10 Fast Refresh warnings. `npm test` passed with 19 files and 220 tests. `npm run build` passed with existing Vite chunk-size and TanStack external-unused warnings. `git diff --check` passed with CRLF normalization warnings only. Red-flag scans found expected prototype/docs/test hits only and no runtime cloud/auth/bank/payment integration, no active fake native-readiness claim, no `console.log` or `debugger`, no remote URL or Google font reference in source, and no claim of real encryption, app lock, hidden search, or hidden graph behavior.

DOCX closure:
`docs/Plan/Mizaan Work Log.docx` contains `Trackers Goals Foundation Implementation`; structural XML verification passed. LibreOffice/soffice was not available for visual render QA.

Phase B final status:
Started after Phase A passed. Completed as a bounded browser/localStorage foundation. Trackers and Goals remain partial local foundations, not final engines.

## Append-Only PRD Created - 2026-06-04

PRD path:
`docs/Plan/Mizaan_PRD.md`

Why it was created:
Mizaan needed one clean Markdown PRD that consolidates product laws, current implementation truth, module requirements, success criteria, QA gates, failure criteria, roadmap, open risks, and future prompt rules before the next repair/recovery or import/export implementation phase.

What it contains:
The PRD includes executive summary, product laws, current implementation truth, target UX, scope, module requirements, data model requirements, persistence and recovery requirements, import/export manager requirements, security/privacy requirements, UI requirements, QA/testing standards, definition of done, success criteria, failure criteria, roadmap, open risks, and future prompt rules.

Relationship between PRD, Product Blueprint, and old master Markdown:
The PRD is the product requirements and success criteria document. `docs/Plan/Mizaan_Product_Blueprint.md` remains the implementation architecture and phase map. This old master Markdown remains historical source context and an append-only implementation ledger.

Current product truth:
Mizaan remains a browser/localStorage prototype using provider-backed items, blocks, relations, and typed metadata. Browser archive export, validation, restore preview, safe merge, and guarded replace exist for current provider data only. Tauri, SQLite, native filesystem, portable vault folders, native backup, encryption, app lock, mobile, cloud, auth, backend, and remote sync remain not implemented.

Next implementation phase:
Repair/Recovery Center Foundation and Import/Export Manager Foundation, bounded to browser-prototype management around the existing archive and restore helpers.

Success criteria for future prompts:
Future prompts must verify repo health, read the PRD and Blueprint, run validation before implementation, inspect current code, write tests before behavior changes, implement one bounded phase, update PRD/Blueprint/master Markdown/DOCX/phase report, perform browser QA where UI changes, capture screenshots where possible, commit, push, verify parity, and report limitations honestly.

## Append-Only Repair Recovery Import Export Manager Implementation - 2026-06-04

PRD path:
`docs/Plan/Mizaan_PRD.md`

Implementation summary:
Created bounded browser-prototype foundations for the Import/Export Manager and Repair/Recovery Center after the PRD gate passed.

Implemented:
`/import-export` route, `/repair` route, sidebar/top-bar/command-palette navigation, product-map status updates, vault health summary helpers, archive manager state helpers, archive metadata round-trip coverage for trackers/goals, route-tree generation, and real shared archive controls for export, paste/load JSON, validate, preview restore, safe merge, and guarded replace.

Not implemented:
Native filesystem import, folder import, markdown export, CSV export, PDF export, real document/file import, migration rollback, repair logs, automatic repair actions, SQLite backup, portable vault backup, encrypted backup, app lock, Tauri commands, mobile, cloud, auth, backend, or remote sync.

Validation:
Targeted helper/product-map tests passed. Full tests passed with 21 files and 231 tests. Typecheck passed. Lint passed with 0 errors and the known 10 Fast Refresh warnings. Build passed with existing chunk-size/TanStack warnings.

Browser QA:
Performed through local preview at `http://127.0.0.1:4198/` using the available Chrome extension browser backend. Routes checked: `/`, `/settings`, `/vault`, `/import-export`, `/repair`, `/finance`, `/people`, `/projects`, `/trackers`, `/goals`, `/graph`, and `/search`. The Import/Export flow checked export, validation, restore preview, blocked invalid JSON, and guarded replace remaining disabled without `REPLACE`. The Repair flow checked visible health checks and category counts. Browser console errors reported: none.

Screenshots:
`docs/screenshots/20260604-0056-prd-created.png`
`docs/screenshots/20260604-0056-import-export-manager.png`
`docs/screenshots/20260604-0056-repair-recovery-center.png`
`docs/screenshots/20260604-0056-archive-validation.png`
`docs/screenshots/20260604-0056-restore-preview.png`
`docs/screenshots/20260604-0056-proof.png`

Next phase:
Calendar completion or Template expansion, chosen only after final validation and browser QA evidence.

## Append-Only Workflow Acceleration and Agent Run System - 2026-06-04

Why this exists:
Future Mizaan phases were repeating repo checks, PRD/Blueprint reading, validation, red-flag scans, browser QA, screenshots, documentation updates, DOCX updates, commits, pushes, parity proof, and closeout reporting. This phase keeps those quality gates but standardizes them with reusable documentation and scripts.

Docs created:
`docs/AGENT_RUNBOOK.md`, `docs/PHASE_TEMPLATE.md`, `docs/PHASE_CLOSEOUT_TEMPLATE.md`, `docs/QA_CHECKLIST.md`, `docs/RED_FLAG_SCAN_RULES.md`, `docs/NEXT_PHASE_QUEUE.md`, and `docs/FAST_PHASE_PROMPT_TEMPLATE.md`.

Scripts created:
`scripts/mizaan-preflight.ps1`, `scripts/mizaan-verify-fast.ps1`, `scripts/mizaan-verify-full.ps1`, `scripts/mizaan-red-scan.ps1`, `scripts/mizaan-browser-qa.ps1`, and `scripts/mizaan-phase-closeout.ps1`.

Package shortcuts added:
`npm run mizaan:preflight`, `npm run mizaan:verify:fast`, `npm run mizaan:verify:full`, `npm run mizaan:red-scan`, and `npm run mizaan:browser-qa`.

Validation results during implementation:
`npm run mizaan:preflight` passed with the expected in-progress dirty-worktree warning. `npm run mizaan:red-scan` passed blocking checks after a PowerShell interpolation fix. `npm run mizaan:verify:fast` passed. `npm run mizaan:verify:full` passed with 0 lint errors, the known 10 Fast Refresh warnings, 21 test files and 231 tests passing, and the existing Vite/TanStack build warnings. `scripts/mizaan-phase-closeout.ps1` passed a dry run with validation skipped.

Browser QA:
The browser QA helper was adjusted to use a dedicated local dev server on port `4199` instead of reusing an unrelated existing server on port `4173`. The successful run checked `/`, `/settings`, `/vault`, `/import-export`, `/repair`, `/finance`, `/people`, `/projects`, `/trackers`, `/goals`, `/graph`, `/search`, `/templates`, and `/calendar` with HTTP 200 responses and captured isolated Chrome/Edge screenshots under `docs/screenshots` using timestamp `20260604-053732`. Console capture is not implemented in the helper's current HTTP/headless screenshot mode.

What remains manual:
Human review, product judgment, overclaim review, DOCX visual render when `soffice` is unavailable, and any deep browser console inspection remain manual. The scripts are workflow helpers, not product infrastructure.

Current product truth:
Mizaan remains browser/localStorage-only. This phase did not implement Tauri, SQLite, portable vault folders, native filesystem access, mobile, encryption, app lock, cloud, auth, backend, or sync.

Next recommended phase:
Calendar Completion and Hardening using the new workflow system.

## Append-Only Calendar Completion and Hardening Implementation - 2026-06-04

Selected phase:
Calendar Completion and Hardening.

Original master Markdown proof:
The original master Markdown at `docs\Plan\Mizaan_A_to_Z_Plan.md` was accessible before implementation.
Before master plan hash: `6707E2CEF7353F8917E3C5950657FB0BF38E53A41E46CCD8EE27234B34D36C9B`.
Before master plan length: `793903`.

Why Calendar came next:
The PRD, Product Blueprint, Next Phase Queue, and previous workflow acceleration phase all identified Calendar Completion and Hardening as the next bounded phase. Calendar was already a local core module but still lacked typed event metadata, Calendar-owned relation edges, template/command-palette creation, detail metadata editing, and stronger validation.

Calendar Feature Opportunity Inventory summary:
Safe features included typed event metadata, provider-backed creation/editing, move-to-trash deletion, cancel/archive status behavior, month/day/agenda hardening, all-day/timed normalization, date/time validation helpers, event type/status normalization, location, notes, metadata-only private/sensitive flags, linked project/task/person/document/finance IDs, search metadata, graph edges, templates, command-palette creation, empty states, and browser QA.

Risky or future-only features excluded:
Recurring event engine, reminder engine, native notifications, push notifications, Google Calendar sync, ICS import/export, cloud calendar sync, AI scheduling, mobile calendar capture, encrypted private Calendar, app lock, Tauri, SQLite, native filesystem, and portable vault folders remain not implemented.

Code inspection summary:
`src/routes/calendar.tsx` remained a thin route wrapper around `CalendarView`. `src/components/calendar/CalendarView.tsx` already supported provider-backed month/week/day/agenda views and modal CRUD. `src/lib/calendar/calendar-events.ts` had simple date/time helpers but no typed relation metadata. Search already indexed item metadata and properties. Graph already supported metadata edge passes for other modules but not Calendar-owned edges. Page templates and command palette creation existed but Calendar event template metadata was not normalized.

Implementation summary:
Added `src/lib/calendar/calendar-event.ts` with typed Calendar event metadata, default factory, normalization, update helper, provider-compatible record input, type/status normalization, relation ID dedupe, display/state helpers, date/month/agenda helpers, search metadata, graph targets, and range validation. `src/lib/calendar/calendar-events.ts` now re-exports the new helper for compatibility. Added Calendar helper tests, graph edge tests, and search metadata tests. Added `CalendarMetadataPanel` for Calendar event page context. Wired Calendar event template metadata and command-palette Calendar event creation. Added Calendar-owned graph edges to projects, tasks, people, documents, and finance records. Updated PRD, Product Blueprint, this master append, and the phase report.

Implemented features:

- Typed Calendar event metadata model.
- Event type/status normalization.
- All-day and timed event normalization.
- Start/end date and time range validation helper.
- Location and notes metadata.
- Metadata-only private/sensitive flags.
- linkedProjectIds, linkedTaskIds, linkedPersonIds, linkedDocumentIds, and linkedFinanceIds.
- Search metadata coverage through existing metadata/property search.
- Calendar-owned graph edges.
- Calendar Event template metadata defaults.
- Command palette Calendar event creation.
- Calendar detail metadata panel.
- Existing provider-backed Calendar route CRUD remains the route foundation.

Partially implemented:

- Calendar route modal still has the earlier compact create/edit controls; the new metadata panel provides the richer typed relation/privacy editing on Calendar event pages.
- Browser QA and screenshot capture were still pending at the time of this append and are recorded in the phase report after final attempts.

Validation during implementation:
`npm run mizaan:preflight` passed. Baseline `npm run mizaan:verify:fast` passed. Baseline `npm run mizaan:red-scan` passed blocking checks. Baseline `npm run mizaan:verify:full` timed out in this environment. Decomposed baseline typecheck and lint passed before implementation; full `npm test` failed before implementation because Vitest worker startup timed out after 4 files and 18 passing tests; `npm run build` timed out in the same validation environment. After implementation, `npx tsc --noEmit --pretty false` passed. Focused Vitest and eslint commands timed out in the same Node process environment. Touched-path `git diff --check` passed with line-ending warnings only.

Files changed:
Calendar helper and tests, Calendar route helper compatibility module, Calendar metadata panel, PageRightPanel integration, page workspace templates, CommandPalette, graph model/tests, search index tests, PRD, Product Blueprint, phase report, and this append-only master plan.

Remaining limitations:
Mizaan remains a browser/localStorage prototype. Calendar is an implemented local foundation but overall Calendar remains partial. There is no recurring event engine, reminder engine, native notification path, push notification path, Google Calendar sync, ICS import/export, cloud calendar sync, automatic scheduling, AI scheduling, mobile calendar capture, encrypted private calendar, real app lock/privacy lock, SQLite, Tauri, native filesystem, or portable vault folder storage.

Next recommended phase:
Template Expansion and Template QA, because Calendar event creation now has typed template support and the next queue item can broaden verified provider-backed templates without native/cloud scope.

## Append-Only Calendar Completion and Hardening Continuation Closeout - 2026-06-05

Selected phase:
Calendar Completion and Hardening continuation from the in-progress dirty worktree.

Continuation rule:
This continuation did not restart the phase, reset the repo, discard current work, remove the Calendar implementation, remove `vitest.config.ts`, or remove `scripts/run-vitest-serial.ps1`.

Original master Markdown proof:
The original master Markdown remained readable. This continuation captured the current pre-append master Markdown hash and length because the earlier session had already appended the first Calendar implementation section.
Continuation before hash: `7EE07C52742AB85FC9414CAA71D80725E99A5BF33FAA83A91FD4619564A0ADCB`.
Continuation before length: `799658`.
The after hash/length and prefix-preservation proof for this continuation are recorded in `docs/Phases/phase-calendar-completion-hardening.md` after the append.

Continuation recovery:
The live repo was `E:\Github\Mizaan-Revamp` on branch `main`, with parity `main...origin/main = 0 0` before closeout work. The worktree already contained Calendar helper, UI, tests, docs, screenshots, `vitest.config.ts`, and the serial Vitest wrapper. The old phase report still recorded the previous stop as partial because validation and browser QA had earlier timed out.

Validation environment hardening:
The standard `npm test` path now runs through `scripts/run-vitest-serial.ps1`. The wrapper runs test files serially, retries worker-start timeouts, and forwards targeted test paths. The committed `vitest.config.ts` keeps unit tests on a minimal config instead of loading the full app config.

Implementation summary:
Calendar now has a typed event metadata helper, provider-compatible event input, metadata normalization, relation ID dedupe, display/state helpers, search metadata, graph target extraction, invalid-range detection, compatibility re-export, Calendar metadata panel, graph/search/template/command-palette integration, and normalized route filter values. The route modal remains a compact create/edit surface; richer relation/privacy/location metadata is available through Calendar event page metadata.

Browser QA after work:
`npm run mizaan:browser-qa` passed route checks and captured screenshots on `20260605-143540` for `/`, `/settings`, `/vault`, `/import-export`, `/repair`, `/finance`, `/people`, `/projects`, `/trackers`, `/goals`, `/graph`, `/search`, `/templates`, and `/calendar`.

Interactive Calendar QA after work:
The in-app Browser flow created a provider-backed Calendar event from the June month grid, edited title/type/status/notes, changed it from timed to all-day, verified it in month/week/day/agenda views, refreshed `/calendar`, and confirmed the edited event persisted. Browser console logs captured during the successful Calendar flow showed no relevant errors or warnings.

Browser tooling limitations:
Native date/time input automation did not accept direct ISO or segmented keyboard entry in the in-app Browser, so date proof used the Calendar grid create control and timed/all-day proof used default timed fields plus all-day toggling. Search input proof and graph relation browser proof were not completed after Browser virtual-clipboard and CDP timeout failures. Search metadata and Calendar-owned graph edges are covered by targeted unit tests, and `/search` plus `/graph` route reachability/screenshots are covered by the browser QA helper.

Screenshots:
`docs/screenshots/20260605-143540-browser-qa-calendar.png`
`docs/screenshots/20260605-1441-calendar-new-event.png`
`docs/screenshots/20260605-1442-calendar-event-edited.png`
`docs/screenshots/20260605-1443-calendar-day-view.png`
`docs/screenshots/20260605-1443-calendar-week-view.png`
`docs/screenshots/20260605-1443-calendar-agenda-view.png`

Validation after work:
`npm run mizaan:preflight` passed. `npm run mizaan:red-scan` passed blocking checks. `npm run mizaan:verify:fast -- src/lib/calendar/calendar-event.test.ts` passed with typecheck, targeted Calendar tests, and fast red scan. `npm run mizaan:verify:full` passed with typecheck, lint, serial tests, build, diff check, and full red scan. Full serial Vitest ran 22 test files and 240 tests with 0 failed. Lint produced the known 10 Fast Refresh warnings and 0 errors. `git diff --check` passed with line-ending warnings only.

DOCX / fallback:
`docs/Plan/Mizaan Work Log.docx` still failed `python-docx` parsing with `XMLSyntaxError: xml namespace URI mapped to wrong prefix, line 5006, column 85`, and `word/document.xml` did not contain `Calendar Completion and Hardening`. The DOCX was preserved unchanged and `docs/Plan/Mizaan Work Log - fallback.md` was updated with the Calendar work-log entry.

What remains deliberately not implemented:
Recurring event engine, reminder engine, native notifications, push notifications, Google Calendar sync, ICS import/export, cloud calendar sync, automatic scheduling, AI scheduling, mobile calendar capture, encrypted private Calendar, app lock/privacy lock, Tauri, SQLite, native filesystem, and portable vault folders.

Next recommended phase:
Template Expansion and Template QA, because Calendar event template metadata now exists and template work can stay bounded to provider-backed browser/localStorage records without native/cloud scope.

## Append-Only Template Expansion and Template QA Implementation - 2026-06-05

This section records the bounded Template Expansion and Template QA phase. It was appended after the existing Calendar closeout content without rewriting historical master-plan text.

Original master Markdown access gate:

- File: `docs/Plan/Mizaan_A_to_Z_Plan.md`
- Before hash: `BE025E69A21BCDD4698E2AAB9C19945F25AFA05ABC08AC6B63FEC7826689C26C`
- Before length: `804989`
- Before copy used for append-only proof: `C:\Users\mhyah\AppData\Local\Temp\mizaan-template-expansion-phase\before-master-plan.txt`

Phase interpretation:
Templates are creation sources for real provider-backed local records, not fake starter cards. The bounded implementation could safely expand static built-in templates, add a registry/status model, add template QA tests, and improve the `/templates` route. It could not honestly implement editable user templates, template import/export, AI generation, template marketplace, sync, native template packs, or template version history.

Implementation summary:

- Added `src/lib/templates/template-registry.ts` with implemented/partial/future status, category metadata, search text, preview derivation, status/category counts, safe starter block validation, metadata normalization, future guards, and provider-backed creation.
- Added `src/lib/templates/template-registry.test.ts` with registry coverage for uniqueness, counts, search, safe starter blocks, provider-backed creation, typed metadata normalization, database/table honesty, partial/future rejection, previews, command-palette template IDs, forbidden capability flags, duplicate names, relation defaults, and caller-provided title propagation.
- Expanded safe built-in templates for notes, documents, project/task records, finance records, tracker records, goal records, calendar event records, and database/table variants.
- Updated `/templates` with search, category/status filters, counts, clear state, selected preview, metadata/properties/limitations display, enabled create action for implemented templates, and disabled create action for partial/future templates.
- Updated `src/lib/blueprint/product-map.ts`, `docs/Plan/Mizaan_PRD.md`, `docs/Plan/Mizaan_Product_Blueprint.md`, `docs/Plan/Mizaan Work Log - fallback.md`, and `docs/Phases/phase-template-expansion-and-qa.md`.

Validation evidence:

- `npm run mizaan:preflight`: passed before implementation.
- Baseline `npm run mizaan:verify:fast`: passed.
- Baseline `npm run mizaan:red-scan`: passed blocking checks.
- Baseline `npm run mizaan:verify:full`: passed.
- TDD red proof: the new custom-title metadata test initially failed because Calendar metadata kept the template default title.
- `npm test -- src/lib/templates/template-registry.test.ts`: passed with 13 tests.
- `npm test -- src/lib/templates/template-registry.test.ts src/lib/page/page-workspace.test.ts`: passed with 2 files and 35 tests.
- `npm run lint`: passed with the known 10 Fast Refresh warnings and 0 errors.
- `npm run typecheck`: passed.
- `npm run mizaan:verify:fast -- src/lib/templates/template-registry.test.ts`: passed.
- `npm run mizaan:verify:full`: passed with typecheck, lint, serial tests, build, diff check, and full red scan.
- `npm run mizaan:browser-qa`: passed route checks and screenshots.

Browser QA evidence:

- Browser QA route sweep passed for `/`, `/settings`, `/vault`, `/import-export`, `/repair`, `/finance`, `/people`, `/projects`, `/trackers`, `/goals`, `/graph`, `/search`, `/templates`, and `/calendar`.
- Final templates screenshot: `docs/screenshots/20260605-182705-browser-qa-templates.png`
- Final Browser QA log: `docs/logs/browser-qa-20260605-182705.md`
- Final Browser QA JSON: `docs/logs/browser-qa-20260605-182705.json`
- Earlier templates screenshot also captured during implementation QA: `docs/screenshots/20260605-181242-browser-qa-templates.png`
- In-app Browser QA loaded `http://127.0.0.1:4199/templates`, verified the search input, found Subscription Record via search, selected the future filter, verified future-only cards were visible, and verified the Not available create button was disabled.

DOCX / fallback:
`docs/Plan/Mizaan Work Log.docx` still failed `python-docx` parsing with `XMLSyntaxError: xml namespace URI mapped to wrong prefix, line 5006, column 85`. The DOCX was preserved unchanged and `docs/Plan/Mizaan Work Log - fallback.md` was updated with this work-log entry.

What remains deliberately not implemented:
Template editor, custom template storage, template import/export, template version history, AI template generation, cloud template marketplace, template sync, native template packs, large multi-page page-system template application, reminder engines, native notifications, Tauri, SQLite, native filesystem, portable vault folders, encryption, app lock, mobile, cloud, auth, backend, and bank/payment integrations.

Next recommended phase:
Version history or scoped template management data-model design. Editable templates should not start until provider storage rules, migration rules, validation tests, and unsupported-future guards are defined.

---

## Append-Only Gemini Web Core Remaining Features Pass — 2026-06-07

Date/time: 2026-06-07 16:34 +08:00

Why Gemini was used:
Gemini was used for a safe high-output implementation pass while Codex limits refresh, focusing only on browser/localStorage scope and preserving all safety rules.

Before plan hash: F361336285069B5AAC96EA6136C3C3EF99F8F395BE2E02197E3DA2D8E4409975
Before plan length: 804270

Implemented Features:
- **Sidebar Tree Subpage Creation**: Added subpage creation button in `AppSidebar.tsx` to prompt and create child pages directly.
- **Database Table Sorting/Filtering**: Implemented case-insensitive text filtering and column-based sorting (text/number/checkbox/date) inside a pure helper function `filterAndSortRows` within `src/lib/database/database-table.ts`, and updated `DatabaseTable.tsx` to consume it.
- **Projects & Tasks Kanban**: Verified status columns and drag-and-drop capability in `/projects` projects and tasks boards.
- **Calendar Deadline Integration**: Integrated virtual deadlines dynamically from tasks and projects as event pills inside `CalendarView.tsx`.

Test Additions:
- Added `filterAndSortRows` tests to `src/lib/database/database-table.test.ts` for text filtering, text sorting, and number sorting.
- Verified that all unit tests run and pass serially.

Validation Results:
- All fast/full verification tests, red scans, typecheck, lint, and build checks successfully pass.
- Browser QA route tests passed and generated new screenshots verifying page states and layout parity.

Remaining Limitations:
Mizaan is local-only and browser-bound. SQLite database, Tauri desktop packaging, native folder vaults, encryption, app lock, cloud sync, auth, backend, AI scheduling, and automatic database formulas remain future non-goals.

## Append-Only Interactive Graph Foundation � 2026-06-07

* Phase: Interactive Graph Foundation
* Before hash: E555D3191649D39666F6956CB14A188A010F2B7B55F2F06971FAE68E91242949
* Before length: 806058
* Features implemented: Graph node interactive selection, Graph filters, Local neighborhood focus, Details panel, Route/open actions, Draggable visual node layout, Status honesty future labels.
* Features deliberately future: Persistent graph layout, Manual graph/canvas, Custom nodes/arrows, AI graph clustering, Native storage.
* Tests: Graph helper tests coverage and UI layout structure.
* Browser QA: Passed with screenshot proofs.
* Validation: Full baseline validation passed.
* Next recommended phase: System and Settings hardening or native readiness.

## Append-Only Settings Hardening � 2026-06-07
- **Phase:** Settings Hardening
- **Before Hash:** 5243F079B3F81A6C7DF99A7718C4C6DF6F60EAC837ECF210C16120B218DDAB01
- **Before Length:** 806821
- **Append-only proof:** Preserved.
- **Settings improvements:** Implemented explicit System Status showing browser/local prototype mode. Added explicit Data Safety warning with links to Import/Export, Vault, and Repair. Implemented full Feature Status table denoting prototype readiness vs future modules. Disclosed future limitations accurately.
- **Validation results:** All red scans, full verification, tests, and build checks passed cleanly.
- **Browser QA:** Passed, route checks 200 OK.
- **Screenshots:** Captured settings-system-status (and standard QA screenshots).
- **Limitations:** Tauri, SQLite, encryption, cloud sync, and native backups remain absent as intended.
- **Next recommended phase:** Native Windows/Tauri Readiness Boundary or Vault Encryption Preparation.

## Append-Only Native Windows Tauri Readiness Probe � 2026-06-07
- **Selected phase:** Native Windows / Tauri Readiness Probe
- **Before Hash:** 3536B6482A2F3271784F0A98E248DB4C29DF42375369B05CCC79FF249D6D6C52
- **Before Length:** 807798
- **Append-only proof:** Preserved.
- **Safe tool checks:** Node, npm, Rust, Cargo installed. Tauri CLI missing.
- **Build/QA results:** Tests, typecheck, lint, and browser QA passed completely.
- **Provider boundary audit:** VaultProvider correctly encapsulates localStorage, but uses a strictly synchronous API.
- **Readiness matrix summary:** Frontend ready. Path/file handling blocked by browser APIs. Provider boundary blocked by synchronous architecture. Tooling blocked by missing Tauri CLI.
- **Blockers:** Synchronous provider interface is the main structural blocker before Tauri shell scaffold.
- **Next native plan:** Phase N1 (Async Provider Refactor), Phase N2 (Tauri Scaffold), Phase N3 (Native File System Provider), Phase N4 (SQLite Prototype), Phase N5 (Portable Vault).
- **Deliberately not implemented:** No Tauri scaffold, SQLite, native paths, packaging, app lock, or toolchain installations were performed.
