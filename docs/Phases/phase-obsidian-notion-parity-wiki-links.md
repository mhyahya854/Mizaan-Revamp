# Phase Report: Obsidian / Notion Parity Wiki-Link Slice

Date: 2026-06-11

## Scope

Implement the safest browser/provider-backed parity gap from the master Markdown queue: automatic page links from stored block content. Native filesystem, Tauri, SQLite, markdown mirrors, cloud collaboration, mobile apps, encryption, app lock, AI automation, and plugin systems were not in scope.

## Parity Table

| Capability | Obsidian | Notion | Mizaan | Status | Gap | Safe action |
|---|---|---|---|---|---|---|
| Page links | `[[Page]]` links between markdown notes | Page mentions and linked pages | Exact-title `[[Page Title]]` parsing from stored page blocks | Implemented partial | Alias creation, rename tracking, raw markdown files | Added parser/resolver and page/graph surfaces |
| Backlinks | Automatic backlinks from wiki links | Backlinks and page mentions | Wiki backlinks plus provider relation backlinks in page panel | Implemented partial | Unlinked mentions, aliases, title rename repair | Added `wikiBacklinks` and right-panel section |
| Outgoing links | Wiki links visible in note graph/backlinks | Page references visible through page context | Wiki outgoing links plus relation outgoing links in page panel | Implemented partial | Rich inline mention UI | Added `wikiOutgoingLinks` and count fields |
| Graph | Local note graph from links | Relation-like page graph through references | Provider relations, typed metadata, parent hierarchy, and wiki-link graph edges | Implemented partial | Manual canvas, clustering, saved layouts, export | Added `wiki-link` graph edge source |
| Databases | Community plugins/dataview | Native databases | Existing browser database/table foundation | Partial | Full Notion formulas, rollups, views | Future, no change in this slice |
| Native vault | Filesystem markdown folder | Cloud workspace/export | Browser provider snapshot only | Future/blocked | Tauri/native filesystem provider missing | Deferred honestly |
| Collaboration | Sync/community plugins | Cloud collaboration | Local-only single-user prototype | Future | Cloud/auth intentionally out of scope | Deferred honestly |
| Plugins | Plugin marketplace | Integrations/templates | Built-in templates only | Future | Plugin runtime unsafe/not scoped | Deferred honestly |
| Privacy lock | Local files plus OS controls/plugins | Account/workspace controls | No encryption/app lock | Future/blocked | Real crypto/native lock missing | Deferred honestly |

## Implemented

- `src/lib/wiki/wiki-links.ts` parses exact-title `[[Page Title]]` links, supports `[[Page|alias]]` matching to `Page`, normalizes whitespace/case, skips empty links, and ignores archived/deleted targets.
- Duplicate normalized titles are treated as ambiguous and are not linked automatically.
- `buildGlobalGraph` and `buildLocalGraph` accept provider blocks and emit `wiki-link` edges with `relationSource: "wiki-links"`.
- Page workspace models expose `wikiOutgoingLinks`, `wikiBacklinks`, `wikiOutgoingCount`, and `wikiBacklinksCount`.
- Page right-panel Backlinks and Outgoing tabs now show relation links and wiki links separately.
- Graph route copy now reflects resolved wiki links and no longer lists wiki-link parsing as a future gap.

## Tests

- Added `src/lib/wiki/wiki-links.test.ts`.
- Updated `src/lib/graph/graph-model.test.ts`.
- Updated `src/lib/page/page-workspace.test.ts`.

## Validation

- Red-first targeted tests failed before implementation for missing wiki helper, absent graph wiki edges, and missing page wiki fields.
- `npm.cmd test -- src/lib/wiki/wiki-links.test.ts src/lib/graph/graph-model.test.ts src/lib/page/page-workspace.test.ts`: passed after implementation.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run mizaan:verify:full`: passed, including typecheck, lint, 24 Vitest files / 242 tests, build, diff check, and full red scan.
- `npm run mizaan:red-scan`: passed blocking checks.
- `git diff --check`: passed.
- `npm run mizaan:browser-qa`: passed all configured route checks and captured screenshots under `docs/screenshots/20260611-195650-browser-qa-*.png`.
- In-app Browser plugin smoke was attempted after scripted browser QA, but the `iab` browser was unavailable in this session. This was treated as a tooling blocker and the scripted browser QA evidence was used as the safe fallback.

## Limitations

- Wiki links are exact-title browser/provider links, not native Obsidian markdown files.
- Renames do not rewrite stored block content.
- Aliases are recognized only for display split syntax, not as alternate page-title metadata.
- Unlinked mentions, graph clustering, manual canvas, saved layouts, markdown mirrors, native filesystem, SQLite, Tauri, mobile, cloud collaboration, plugin marketplace, encryption, and app lock remain future work.
