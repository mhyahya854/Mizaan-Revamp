# Task Dependency Metadata Slice - 2026-06-11

## Status

PARTIAL IMPLEMENTED.

This slice stores and displays task dependency relation metadata in the browser/localStorage prototype. It does not implement a dependency engine, blocker workflow automation, scheduling, or full Gantt behavior.

## Implemented

- Added normalized dependency metadata arrays: `dependsOnTaskIds` and `blockingTaskIds`.
- Added dependency display/state labels and `dependencyMetadataCount` to task totals.
- Added dependency graph edge types for task dependency and blocker relations.
- Added a Dependencies stat, dependency metadata counts, task-card metadata, and task-board badges on `/tasks`.
- Added dependency ID editing to task page metadata panels and project-linked task cards.
- Updated product-map truth, PRD, blueprint, fallback log, and master Markdown append-only queue evidence.

## Tests

- Red-first task helper test failed before implementation because dependency normalization, graph targets, display, and totals did not exist.
- Targeted task helper tests passed after implementation: 21/21.
- Targeted product-map tests passed after implementation: 13/13.
- Targeted graph model tests passed after implementation: 39/39.
- npm run typecheck: passed after adding the dependency edge types to the graph edge union.
- npm run lint: passed after formatting touched files.
- npm run build: passed.
- npm run mizaan:browser-qa: passed all configured routes and captured `docs/screenshots/20260611-224224-browser-qa-tasks.png`.

## Browser Evidence

- Screenshot set: `docs/screenshots/20260611-224224-browser-qa-*.png`.
- Tasks route screenshot shows the Dependencies stat, metadata-only copy, and existing board/list/timeline controls without obvious overlap.

## Limitations

- Dependency links are stored as relation IDs only.
- Mizaan does not calculate blockers, enforce task order, schedule dependencies, generate Gantt chains, send reminders/native notifications, or persist this through SQLite/Tauri/native filesystem storage.
