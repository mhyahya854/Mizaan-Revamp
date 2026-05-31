# Combined Phase 4/5 Pseudocode - Notion-like Workspace and Editable Tables

Reference: `Mizaan Ultimate Plan.txt`.

## 1. Combined Phase 4/5 Objective

Build on the current Phase 4 page workspace and add the missing Notion-like workflow pieces: sidebar zones, template-first page creation, editable simple table blocks, and a basic provider-backed database/table page foundation. Keep the app local-first and keep native storage, SQLite, real filesystem vaults, lock files, OCR, full graph, full canvas, and mobile work out of scope.

## 2. Master Plan References

- Product law: no forced cloud, login, account, Google, backend, or hidden data trap.
- Storage architecture: all page, block, relation, and database edits must use `VaultProvider`.
- Item/block model: pages are items, editor content is blocks, relations connect pages.
- Database model: database pages and table rows are foundations now; formulas, rollups, charts, advanced views, and native SQLite tables are later.
- Sidebar spaces: Home, Search, Databases, Graph, active spaces, Templates, Vault, Trash, Settings.

## 3. Current State After Phase 1-3 and Previous Phase 4 Attempt

```text
currentState():
  docs exist at root docs folder
  app code is at E:\Github\Mizaan-Revamp because mizaan-life-os is absent
  Git metadata is absent, so commit proof is blocked
  VaultProvider and LocalStorageVaultProvider exist
  vault route, settings provider truth, and recent vault model exist
  page workspace, breadcrumbs, right panel, relation context, and template helpers exist
  simple table block type is absent
  database item/category/route is absent
  New page paths can bypass templates and need template-first flow
```

## 4. Git/Repo Recovery Pseudocode

```text
recoverRepo():
  list root files
  search recursively for .git
  check expected mizaan-life-os folder and package/src paths
  check cleanup/quarantine git folders
  if .git exists in app folder:
    require branch == main
    check latest Phase 3 commit
    continue there
  else if .git exists only in backup/quarantine:
    stop and report safest recovery option
  else:
    continue local implementation in root app
    record commit/clean-tree verification blocked
```

## 5. Docs Sync Pseudocode

```text
syncDocs():
  keep E:\Github\Mizaan-Revamp\docs as human master docs location
  if nested app repo exists:
    copy root docs into mizaan-life-os\docs
  else:
    record that root docs and active app root share the same local folder
  maintain mizaan-docs-boundary-note.md with required wording
```

## 6. Spaghetti Code Cleanup Targets

```text
cleanupTargets():
  centralize table block data normalization in src/lib/table
  centralize database model/mutations in src/lib/database
  route all new page creation through templates
  split database UI into components instead of embedding table mutation logic in routes
  restructure sidebar arrays into target zones
  remove or hide dead Search/Database controls by making routes real
```

## 7. Sidebar Restructure Pseudocode

```text
renderSidebar():
  header = logo/avatar + vault display name + storage mode + collapse button
  quickSearch = button/input opens command palette with Cmd/Ctrl K hint
  coreNav = Home, Search, Databases, Graph
  pinnedSpaces = Notes, Documents, Projects, People, Finance, Calendar, Trackers
  pagesSection = pinned/recent/nested pages, not every vault page
  systemTools = Templates, Vault, Trash, Settings
  footer = Browser prototype + version
```

## 8. Pinned Spaces Pseudocode

```text
getPinnedSpaces():
  return active master-plan spaces for this phase
  do not expose pin/unpin settings yet
  render as "Pinned spaces"
  keep unpin customization documented as future settings work
```

## 9. Pages Section Pseudocode

```text
buildSidebarPages(snapshot):
  activeItems = items excluding archived/deleted/templates/database rows
  currentOrPinned = items with metadata.sidebarPinned true
  recent = most recently updated page items limited to a small count
  nested = child pages under visible roots
  return merged unique roots with child tree
```

## 10. Template-based Page Creation Pseudocode

```text
openTemplatePicker(context):
  list Blank Page first
  list templates matching current category/context next
  list recently used template ids from item metadata or static fallback
  on choose:
    createPageFromTemplate(provider, templateId, context)
    navigate to /page/$id
    persist title, category, type, metadata.templateId, blocks, and database/table data
```

## 11. Page Workspace Data Model Pseudocode

```text
buildPageWorkspaceModel(provider, itemId, snapshot):
  item = normalize item or missing state
  blocks = sorted provider blocks for item
  if item.type == database:
    databaseModel = normalizeDatabaseFromItem(item)
  properties = counts + tags + status + custom properties + database summary
  relations = outgoing provider relations
  backlinks = incoming provider relations
  childPages = provider items with parentId
  attachedFiles = safe defaults
  return model
```

## 12. Page Shell Pseudocode

```text
PageWorkspace():
  if snapshot hydrating: show local vault loading state
  if missing: show route-safe missing state
  render left/main/right layout
  if database page: render DatabaseTable inside workspace
  else: render PageEditorSurface blocks
  always render subpages, provider warning, and right context panel
```

## 13. Page Header Pseudocode

```text
PageHeader():
  show category/type label
  show icon placeholder
  inline title input saves through provider.updateItem
  actions:
    New child opens template picker scoped to parent
    Archive/restore uses provider
  show updated/provider mode subtly
```

## 14. Breadcrumb Pseudocode

```text
buildBreadcrumbs(item, items):
  crumbs = Home + Space
  walk parentId chain with loop protection
  add parents as clickable page links
  add current title as final crumb
  missing parents stop without crash
```

## 15. Page Properties Pseudocode

```text
buildPageProperties():
  category/type/status/tags
  created/updated
  block count
  relation/backlink/outgoing counts
  child count
  attached file count
  database column/row counts when item is a database
  archived/deleted truth
```

## 16. Right Panel Tabs Pseudocode

```text
PageRightPanel():
  tabs = Properties, Relations, Backlinks, Outgoing, Files, Local Graph, History
  stateful current tab
  Relations can add/remove provider relations
  Backlinks/outgoing show relation-based context
  Files shows attached files or honest later-phase empty state
  Local Graph says relation-based only until graph index exists
  History says future snapshots/versioning
```

## 17. Add/Edit/Delete/Archive/Restore Page Pseudocode

```text
pageLifecycle():
  add = template picker -> provider.createItem -> provider.replaceBlocks
  edit title = provider.updateItem
  edit blocks = provider.updateBlock/createBlock
  archive = provider.archiveItem
  restore = provider.restoreItem
  trash route lists archived/deleted and restores safely
```

## 18. Block Editor Behavior Pseudocode

```text
PageEditorSurface():
  render each block by type
  paragraph/headings/lists/todo/quote/callout/code remain textarea-backed
  divider renders as hr
  table renders SimpleTableBlock
  Enter creates next paragraph where safe
  slash menu filters implemented commands
  all block changes call provider.updateBlock
```

## 19. Slash Command Behavior Pseudocode

```text
slashMenu():
  commands = text, heading 1/2/3, bullet, numbered, to-do, quote, callout, divider, code, simple table
  filter by query
  Enter inserts first filtered command
  Escape closes
  no relation/page-link/database commands unless implemented
```

## 20. Simple Table Block Pseudocode

```text
normalizeTableBlock(block):
  parse block.content as JSON table shape if valid
  else parse legacy plain text into safe one-column table
  ensure columns array has ids/names
  ensure rows have ids and cell records

mutateTableBlock(provider, block, nextTable):
  provider.updateBlock(block.id, { content: serializeTableData(nextTable) })
```

## 21. Database Page/Table Model Pseudocode

```text
normalizeDatabaseModel(item):
  read item.metadata.database
  if missing/malformed:
    create default table model with two text columns and one starter row
  return { id, title, columns, rows, rowOrder, viewType: "table" }
```

## 22. Add/Remove/Rename Column Pseudocode

```text
addColumn(database, input):
  append column with id, name, type
  add empty cell for each row

renameColumn(database, columnId, name):
  update column name with fallback "Untitled"

removeColumn(database, columnId):
  keep at least one column
  remove cell values for that column from each row
```

## 23. Add/Remove/Edit Row Pseudocode

```text
addRow(database):
  create row id, title, empty cells for columns
  append to rowOrder

editCell(database, rowId, columnId, value):
  set row.cells[columnId] based on column type

removeRow(database, rowId):
  remove row and rowOrder entry
```

## 24. Row-as-Page Behavior Pseudocode

```text
openRowAsPage(row):
  if row.pageId exists and provider item exists:
    navigate /page/$pageId
  else:
    create provider item with parentId = database item id
    metadata.databaseRow = true
    create starter block with row summary
    set row.pageId and persist database metadata
    navigate to row page
```

## 25. Tests Pseudocode

```text
tests():
  page template tests fail first for blank page/database/table templates
  simple table tests fail first for normalize/add/remove/rename/edit/malformed
  database tests fail first for default model/add/remove/rename/edit/persist/no formulas
  provider-boundary tests verify metadata persists through provider updateItem
```

## 26. Browser QA Pseudocode

```text
browserQa():
  start dev server
  open Home
  verify sidebar zones
  open command palette/search
  create note via template picker
  edit title/block
  insert simple table from slash menu
  edit cells/add/remove row/column/refresh
  open Databases/create database/edit cells/add/remove row/column/refresh
  open Vault/Settings/Graph/Trash
  check console errors
```

## 27. Screenshot Pseudocode

```text
screenshots():
  save to docs/screenshots
  capture sidebar, home, template picker, page workspace, right panel, slash menu,
  simple table editor, database editor, vault, settings
```

## 28. DOCX Update Pseudocode

```text
updateDocx():
  append session entry with date/time/title/summary/files/functions
  insert screenshots with filename, date/time, explanation, route/page shown
  include validation results and limitations
```

## 29. MD Phase Tracker Update Pseudocode

```text
updatePhaseTracker():
  preserve full phase list from master plan
  mark Phase 4 implemented or partial based on actual checks
  mark Phase 5 table/database foundation partial if implemented
  keep native/Tauri phases not implemented
```

## 30. TXT Status Update Pseudocode

```text
updateMasterStatus():
  update only IMPLEMENTATION STATUS TRACKER
  use allowed markers only
  do not alter product law
  keep database/native/final graph truth conservative
```

## 31. Commit Pseudocode

```text
commitIfGitExists():
  if .git exists:
    run git diff --check
    git add .
    git commit -m "Improve workspace pages and database tables"
  else:
    do not initialize repo
    document commit blocked by missing Git metadata
```
