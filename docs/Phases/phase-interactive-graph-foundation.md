# Phase: Interactive Graph Foundation

## What Graph currently does
- Builds a global graph from `MizaanItem`s and `MizaanRelation`s.
- Marks orphans and calculates edges based on explicit relations, parent hierarchy, and metadata-linked fields.
- Provides a static circle-based visual map of up to 32 nodes.
- Shows node and edge lists with basic filtering (All, Documents, Pages, Projects, etc.).
- Calculates local graph metrics (nodes, edges, orphans) and displays them in a text-only side panel when a node is selected.
- No dragging, no switching the main view to a local focus, and node positions are hardcoded via a circular math formula.

## What Gemini previously verified
- Fast Refresh warning cleanup was completed.
- Lint has 0 errors and warnings.
- Browser QA route sweep passed.
- Storage remains browser/localStorage-only prototype.
- Base application is stable with no critical flaws.

## What this phase will implement
- **A. Node selection enhancements**: Display more details on the selected node and incoming/outgoing edges.
- **B. Better graph filtering**: Expand filter states to preserve selections. (Current code mostly handles this, but we'll ensure it works robustly).
- **C. Local graph focus**: Add an action to switch the main graph map and lists to the `localGraph` view instead of the `globalGraph`, showing only the selected node and its direct neighbors. Provide a "Back to global graph" button.
- **D. Basic draggable visual positioning**: Add UI-only dragging for nodes in the visual graph. Position overrides will be stored in component state for the session, unpersisted to avoid risking localStorage corruption at this stage. Layout persistence is documented as future.
- **E. Graph legend and status honesty**: Add clear labels for "Local focus graph" vs "Global graph" and keep the "Future" panel emphasizing manual canvas features are not active.
- **F. Tests**: Add/update tests in `graph-model.test.ts` to ensure local focus logic works correctly.

## What this phase will not implement (and what remains future)
- Manual canvas boards.
- Custom manual graph nodes or fake arrows.
- Saved/persistent canvas layouts across sessions.
- Graph export (image/PDF).
- AI graph clustering or semantic graph.
- Native SQLite/Tauri storage.
