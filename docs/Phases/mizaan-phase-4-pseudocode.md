# Phase 4 Pseudocode — Notion-like Page Workspace and Editor Foundation

## 1. Phase 4 Objective

Build a calm page-first workspace foundation on top of the current local prototype. Do not claim real Tauri, SQLite, portable folder vault, full graph, full database, full reminder, or full Lexical/Tiptap editor readiness.

## 2. Master Plan References

- Core product law: local-first, no forced cloud, no forced login.
- Storage architecture: VaultProvider now, future TauriSQLiteVaultProvider later.
- Items, blocks, relations, attachments, properties, and tags from the database model.
- Notes, editor, templates, command palette, graph, search, settings, and page layout sections.

## 3. Current State After Phase 1-3

Current checkout reality:

- Master TXT exists.
- Phase tracker was missing and is being reconstructed from the TXT.
- Work log DOCX was missing and must be created.
- VaultProvider and vault lifecycle code are missing.
- Page UI is mock-driven and does not persist edits.

## 4. Phase 1-3 Verification Pseudocode

```text
verifyPhaseOne():
  assert docs/Mizaan Ultimate Plan.txt exists
  assert docs/mizaan-implementation-phases.md exists
  assert phase docs exist or create honest reports
  scan docs for unsupported readiness claims

verifyPhaseTwo():
  assert VaultProvider interface exists
  assert LocalStorageVaultProvider delegates all item/block/relation storage
  assert local item compatibility wrapper uses provider
  assert Settings shows provider status honestly
  run provider tests

verifyPhaseThree():
  assert vault session helper exists
  assert recent vaults helper exists
  assert demo and prototype local modes are represented
  assert /vault route exists
  assert sidebar and Settings link to Vault
  run lifecycle tests
```

## 5. Spaghetti Code Cleanup Targets

```text
cleanupPhaseFourSurface():
  remove mock-only page storage from page routes
  centralize item/block/relation access through VaultProvider
  centralize template creation
  replace dead UI actions with provider-backed actions or honest empty states
  keep old mock data only as seed data when needed
```

## 6. Page Workspace Data Model Pseudocode

```text
buildPageWorkspaceModel(itemId, snapshot):
  item = snapshot.items.find(id)
  if item missing:
    return { state: "missing", breadcrumbs: Home / Unknown }
  blocks = snapshot.blocks.filter(itemId).sort(order)
  outgoing = snapshot.relations where sourceId == itemId
  incoming = snapshot.relations where targetId == itemId
  children = snapshot.items where parentId == itemId and not deleted
  breadcrumbs = buildBreadcrumbs(item, snapshot.items)
  properties = buildPageProperties(item, blocks, outgoing, incoming)
  return PageWorkspaceModel
```

## 7. Page Shell Pseudocode

```text
PageWorkspace(itemId):
  load provider snapshot through hook
  model = buildPageWorkspaceModel(itemId, snapshot)
  if missing: render missing state
  render:
    PageBreadcrumbs(model.breadcrumbs)
    PageHeader(model.item)
    PageProperties(model.properties)
    PageEditorSurface(model.blocks)
    PageSubpages(model.childPages)
    PageRightPanel(model)
```

## 8. Page Header Pseudocode

```text
PageHeader:
  show icon button or placeholder
  show type/category label
  show editable title input
  on title change debounce/save via provider.updateItem
  show subtle autosave/updated state
  show archive and child page actions when safe
```

## 9. Breadcrumb Pseudocode

```text
buildBreadcrumbs(item, items):
  crumbs = [Home]
  crumbs.push(space crumb from item.category)
  parentChain = walk parentId until none or missing or loop
  crumbs.push(parent pages)
  crumbs.push(current page as non-clickable)
```

## 10. Icon/Title/Cover Placeholder Pseudocode

```text
renderIcon:
  if item.icon exists show it
  else show page type icon placeholder

renderCover:
  if item.cover exists show cover band
  else show subtle local-first cover placeholder with no fake image

renderTitle:
  input value = item.title
  on blur or Enter save
```

## 11. Properties Panel Pseudocode

```text
buildPageProperties:
  type/category
  status if present
  tags if present
  created date
  updated date
  block count
  outgoing relation count
  incoming relation count
  child page count
  archived/deleted state
  provider mode
```

## 12. Right Panel Tabs Pseudocode

```text
PageRightPanel:
  tabs = Properties, Relations, Backlinks, Outgoing, Files, Local Graph, History
  Properties: render computed properties
  Relations: render outgoing relation records and add/remove when safe
  Backlinks: render incoming relation records
  Outgoing: render outgoing relation records
  Files: render attached files or honest empty state
  Local Graph: show relation-based foundation only
  History: say version history is future
```

## 13. Block Editor Behavior Pseudocode

```text
PageEditorSurface:
  render blocks sorted by order
  contenteditable/input per block
  on edit update block through provider
  Enter from text block creates next paragraph block
  todo checkbox persists checked state
  empty page creates one paragraph starter block
  no direct localStorage calls
```

## 14. Slash Command Behavior Pseudocode

```text
SlashCommandMenu:
  command list only includes implemented block types
  search filters commands
  click inserts block at index
  Escape closes
  keyboard selection if safe
```

## 15. Nested Pages/Subpages Pseudocode

```text
createChildPage(parentId):
  parent = provider.getItem(parentId)
  newItem = provider.createItem({ category: parent.category, parentId })
  provider.upsertBlocks(new starter blocks)
  navigate to child page
  breadcrumbs include parent
```

## 16. Template-to-Page Creation Pseudocode

```text
createPageFromTemplate(templateId):
  template = implemented template definition
  item = provider.createItem(template defaults)
  provider.upsertBlocks(template starting blocks)
  navigate to item page
```

## 17. Backlinks/Outgoing Links/Relation Context Pseudocode

```text
buildLinkedContext:
  outgoing = relations where sourceId == current
  backlinks = relations where targetId == current
  resolve target/source item titles
  wiki links remain future unless parser exists
```

## 18. Page List/Space Pages Pseudocode

```text
SpacePage(category):
  items = provider.listItems({ category, notDeleted })
  New action creates provider-backed item
  Template action uses template definitions where supported
  item click opens page workspace
  empty state is useful
```

## 19. Command Palette Page Commands Pseudocode

```text
CommandPalette:
  list working commands only
  New note/project/document/person creates real item
  Open page searches provider items
  Open Vault/Settings/Graph navigates existing routes
```

## 20. Tests Pseudocode

```text
test normalize item into workspace model
test missing optional fields use defaults
test Home / Space / Page breadcrumb
test parent child breadcrumb
test child page creation
test relation outgoing and incoming context
test template page has title and blocks
test title and block update through provider
test deleted item state
test slash command list excludes unsupported commands
```

## 21. Browser QA Pseudocode

```text
start dev server
open home
open notes
create note from template
edit title and block
open slash command menu
open right panel tabs
refresh and verify persistence
open document/project/person records
open Vault, Settings, Graph, Trash
capture screenshots
check console logs
```

## 22. DOCX Update Pseudocode

```text
open or create Mizaan Work Log.docx
append date/time, title, summary, files changed, function changes
insert screenshots with captions
append verification results and limitations
```

## 23. MD Phase Tracker Update Pseudocode

```text
update Phase 1-4 statuses from actual code and verification
leave future phases not implemented
do not add product direction outside TXT
```

## 24. TXT Status Update Pseudocode

```text
append or refresh IMPLEMENTATION STATUS TRACKER near end
mark only actual implemented or partial items
do not alter product law sections casually
```

## 25. Phase 5 Blueprint Pseudocode

```text
if Phase 4 verification is stable:
  create native Windows/Tauri readiness blueprint
  explicitly defer SQLite and real portable folder migration
else:
  document Phase 5 deferred
```

## 26. Commit Pseudocode

```text
if active folder is a git repo:
  git diff --check
  git add .
  git commit -m "Improve page workspace foundation"
else:
  document no Git metadata and skip commit truthfully
```
