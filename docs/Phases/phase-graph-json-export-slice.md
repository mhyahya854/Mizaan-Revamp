# Graph JSON Export Slice - 2026-06-11

## Status

PARTIAL IMPLEMENTED.

This slice implements a safe browser JSON export for the active graph model. It does not implement manual canvas export, image/PDF export, native graph mirror files, clustering export, embeddings, or semantic graph AI.

## Implemented

- Added `createGraphExportPayload` in `src/lib/graph/graph-model.ts`.
- Export payload format is `mizaan.graph.export.v1`.
- Payload includes app id, timestamp, active graph scope, selected local item id when present, graph summary, sorted nodes, sorted edges, and explicit limitation strings.
- Added a visible `/graph` Export JSON button using browser `Blob` and object URL download.
- Updated product-map truth so the graph module claims browser JSON export only.
- Updated PRD and blueprint graph/export wording.

## Tests

- Red-first graph model test failed before implementation because `createGraphExportPayload` did not exist.
- Targeted graph model tests passed after implementation: 39/39.
- Targeted product-map tests passed after implementation: 13/13.
- `npm run typecheck`: passed.
- `npm run lint`: passed after formatting CRLF in touched test files.
- `npm run build`: passed.
- `npm run mizaan:browser-qa`: passed all configured routes and captured `docs/screenshots/20260611-214357-browser-qa-graph.png`.

## Browser Evidence

- Screenshot set: `docs/screenshots/20260611-214357-browser-qa-*.png`.
- Graph route screenshot shows the Export JSON control and future graph limitations.

## Limitations

- Export downloads the current in-browser graph model only.
- It is not a native vault backup, portable folder mirror, image export, PDF export, clustering export, or semantic graph export.
- Manual graph nodes, directed manual arrows, saved graph layouts, native graph-readable files, embeddings, and local AI graph data remain future.
