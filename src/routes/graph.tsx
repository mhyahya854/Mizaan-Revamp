import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

import {
  buildGlobalGraph,
  buildLocalGraph,
  type GraphEdge,
  type GraphNode,
} from "@/lib/graph/graph-model";
import { useVaultSnapshot } from "@/lib/vault/use-vault";

export const Route = createFileRoute("/graph")({
  head: () => ({ meta: [{ title: "Graph - Mizaan" }] }),
  component: GraphPage,
});

type GraphFilter =
  | "all"
  | "documents"
  | "pages"
  | "projects"
  | "people"
  | "finance"
  | "orphans"
  | "connected";

const filterOptions: Array<{ id: GraphFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "documents", label: "Documents" },
  { id: "pages", label: "Pages/notes" },
  { id: "projects", label: "Projects" },
  { id: "people", label: "People" },
  { id: "finance", label: "Finance" },
  { id: "orphans", label: "Orphans" },
  { id: "connected", label: "Connected" },
];

function GraphPage() {
  const snapshot = useVaultSnapshot();
  const [filter, setFilter] = useState<GraphFilter>("all");
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [isLocalFocus, setIsLocalFocus] = useState(false);

  const globalGraph = useMemo(
    () =>
      buildGlobalGraph({
        items: snapshot.items,
        blocks: snapshot.blocks,
        relations: snapshot.relations,
      }),
    [snapshot.items, snapshot.blocks, snapshot.relations],
  );
  const localGraph = useMemo(
    () =>
      selectedItemId
        ? buildLocalGraph({
            selectedItemId,
            items: snapshot.items,
            blocks: snapshot.blocks,
            relations: snapshot.relations,
          })
        : undefined,
    [selectedItemId, snapshot.items, snapshot.blocks, snapshot.relations],
  );

  const activeGraph = isLocalFocus && localGraph ? localGraph : globalGraph;

  const relationCountByNode = useMemo(
    () => countEdgesByNode(activeGraph.edges),
    [activeGraph.edges],
  );
  const filteredNodes = activeGraph.nodes.filter((node) => matchesFilter(node, filter));
  const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));
  const filteredEdges = globalGraph.edges.filter(
    (edge) => filteredNodeIds.has(edge.sourceId) && filteredNodeIds.has(edge.targetId),
  );
  const selectedNode = selectedItemId
    ? globalGraph.nodes.find((node) => node.id === selectedItemId)
    : undefined;

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="border-b hairline px-6 pb-5 pt-8 md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-[12px] uppercase tracking-wider text-faint">Knowledge</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="font-editorial text-[34px] tracking-normal">Graph</h1>
              <span className="rounded-sm border hairline bg-muted/45 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-soft">
                Partial
              </span>
            </div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-soft">
              Provider-backed local graph foundation. Nodes come from real provider items; edges
              come from provider relations, metadata, parent hierarchy, and resolved wiki links.
            </p>
          </div>
          <div className="rounded-md border hairline bg-surface px-3 py-2 text-[11.5px] text-soft">
            Manual canvas, editable standalone nodes, saved layouts, export, clustering, embeddings,
            and semantic graph AI remain future phases.
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-6 py-6 md:px-10">
        <SummaryGrid
          nodeCount={globalGraph.summary.nodeCount}
          edgeCount={globalGraph.summary.edgeCount}
          orphanCount={globalGraph.summary.orphanCount}
          typeCount={Object.keys(globalGraph.summary.typeCounts).length}
          relationSourceCount={Object.keys(globalGraph.summary.relationSourceCounts).length}
        />

        <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-4">
            <div className="rounded-md border hairline bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline px-4 py-3">
                <div>
                  <h2 className="text-[14px] font-semibold">
                    {isLocalFocus ? "Local focus graph" : "Global graph"}
                  </h2>
                  <p className="mt-0.5 text-[12.5px] text-faint">
                    Showing {filteredNodes.length} of {activeGraph.summary.nodeCount} real nodes and{" "}
                    {filteredEdges.length} visible edges.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFilter(option.id)}
                      className={`rounded-sm px-2 py-1 text-[11.5px] transition-colors ${
                        filter === option.id
                          ? "bg-foreground text-background"
                          : "bg-muted/55 text-soft hover:bg-muted"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <GraphMap nodes={filteredNodes} edges={filteredEdges} onFocus={setSelectedItemId} />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <NodeList
                nodes={filteredNodes}
                relationCountByNode={relationCountByNode}
                selectedItemId={selectedItemId}
                onFocus={(id) => {
                  setSelectedItemId(id);
                  setIsLocalFocus(false);
                }}
              />
              <EdgeList edges={filteredEdges} nodes={activeGraph.nodes} />
            </div>
          </div>

          <aside className="space-y-4">
            <LocalGraphPanel
              localGraph={localGraph}
              selectedNode={selectedNode}
              isLocalFocus={isLocalFocus}
              onToggleFocus={() => setIsLocalFocus(!isLocalFocus)}
            />
            <SourceSummary
              typeCounts={activeGraph.summary.typeCounts}
              edgeTypeCounts={activeGraph.summary.edgeTypeCounts}
              relationSourceCounts={activeGraph.summary.relationSourceCounts}
            />
            <FutureGraphPanel />
          </aside>
        </section>
      </main>
    </div>
  );
}

function SummaryGrid({
  nodeCount,
  edgeCount,
  orphanCount,
  typeCount,
  relationSourceCount,
}: {
  nodeCount: number;
  edgeCount: number;
  orphanCount: number;
  typeCount: number;
  relationSourceCount: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryCard label="Nodes" value={nodeCount} detail="Provider-backed items" />
      <SummaryCard label="Edges" value={edgeCount} detail="Real relation sources" />
      <SummaryCard label="Orphans" value={orphanCount} detail="No direct relation edges" />
      <SummaryCard label="Item types" value={typeCount} detail="Current type spread" />
      <SummaryCard label="Sources" value={relationSourceCount} detail="Edge source classes" />
    </div>
  );
}

function SummaryCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-md border hairline bg-surface px-4 py-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-1 font-editorial text-[28px] leading-none">{value}</div>
      <div className="mt-1 text-[11.5px] text-soft">{detail}</div>
    </div>
  );
}

function GraphMap({
  nodes,
  edges,
  onFocus,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onFocus: (itemId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const visualNodes = useMemo(() => {
    return nodes.slice(0, 32).map((node, index, all) => {
      const angle = (Math.PI * 2 * index) / Math.max(all.length, 1);
      const radius = all.length > 8 ? 36 : 26;
      return {
        ...node,
        x: positions[node.id]?.x ?? 50 + Math.cos(angle) * radius,
        y: positions[node.id]?.y ?? 50 + Math.sin(angle) * radius,
      };
    });
  }, [nodes, positions]);

  const visualById = useMemo(
    () => new Map(visualNodes.map((node) => [node.id, node])),
    [visualNodes],
  );

  const visualEdges = useMemo(() => {
    return edges.flatMap((edge) => {
      const source = visualById.get(edge.sourceId);
      const target = visualById.get(edge.targetId);
      return source && target ? [{ edge, source, target }] : [];
    });
  }, [edges, visualById]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, id: string) => {
    if (e.button !== 0) return;
    setDraggingId(id);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPositions((prev) => ({
      ...prev,
      [draggingId]: { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) },
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (draggingId) {
      setDraggingId(null);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="relative min-h-[460px] bg-dotgrid touch-none select-none" ref={containerRef}>
      {visualNodes.length > 0 ? (
        <>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {visualEdges.map(({ edge, source, target }) => (
              <line
                key={edge.id}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="var(--hairline)"
                strokeWidth={0.16}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          {visualNodes.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => {
                if (!draggingId) onFocus(node.id);
              }}
              onPointerDown={(e) => handlePointerDown(e, node.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-sm outline-none focus:ring-2 focus:ring-ring ${
                draggingId === node.id ? "z-10 cursor-grabbing" : "cursor-grab"
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <span
                className={`grid place-items-center rounded-full border hairline text-[11px] shadow-sm ${
                  node.isOrphan ? "bg-background text-faint" : "bg-surface text-foreground"
                }`}
                style={{ width: 34, height: 34 }}
              >
                {node.type.slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-[140px] truncate rounded-sm bg-background/85 px-1 py-px text-[10.5px] text-soft">
                {node.label}
              </span>
            </button>
          ))}
          {nodes.length > visualNodes.length && (
            <div className="absolute bottom-4 left-4 rounded-md border hairline bg-popover px-3 py-2 text-[11.5px] text-soft shadow-sm">
              Showing the first {visualNodes.length} filtered nodes in the visual map. The lists
              below include all filtered nodes and edges.
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-[13px] text-faint">
          No graph nodes match this filter. The graph will stay sparse until real local items and
          relation metadata exist.
        </div>
      )}
    </div>
  );
}

function NodeList({
  nodes,
  relationCountByNode,
  selectedItemId,
  onFocus,
}: {
  nodes: GraphNode[];
  relationCountByNode: Map<string, number>;
  selectedItemId?: string;
  onFocus: (itemId: string) => void;
}) {
  return (
    <section className="rounded-md border hairline bg-surface">
      <div className="border-b hairline px-4 py-3">
        <h2 className="text-[14px] font-semibold">Nodes</h2>
        <p className="mt-0.5 text-[12.5px] text-faint">Real provider items only.</p>
      </div>
      <div className="max-h-[420px] overflow-auto">
        {nodes.length ? (
          <ul className="divide-y hairline">
            {nodes.map((node) => (
              <li key={node.id} className="px-4 py-3">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-[13px] font-medium">{node.label}</span>
                      {node.isOrphan && (
                        <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10.5px] text-faint">
                          Orphan
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11.5px] text-faint">
                      {node.type} / {node.category} / {relationCountByNode.get(node.id) ?? 0}{" "}
                      relations
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => onFocus(node.id)}
                      className={`rounded-sm border hairline px-2 py-1 text-[11px] ${
                        selectedItemId === node.id
                          ? "bg-foreground text-background"
                          : "bg-background text-soft hover:bg-muted"
                      }`}
                    >
                      Focus
                    </button>
                    <Link
                      to="/page/$id"
                      params={{ id: node.itemId }}
                      className="rounded-sm border hairline bg-background px-2 py-1 text-[11px] text-soft hover:bg-muted"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-6 text-[12.5px] text-faint">No nodes to list.</div>
        )}
      </div>
    </section>
  );
}

function EdgeList({ edges, nodes }: { edges: GraphEdge[]; nodes: GraphNode[] }) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <section className="rounded-md border hairline bg-surface">
      <div className="border-b hairline px-4 py-3">
        <h2 className="text-[14px] font-semibold">Edges</h2>
        <p className="mt-0.5 text-[12.5px] text-faint">
          Derived from explicit provider and metadata sources.
        </p>
      </div>
      <div className="max-h-[420px] overflow-auto">
        {edges.length ? (
          <ul className="divide-y hairline">
            {edges.map((edge) => {
              const source = nodeById.get(edge.sourceId);
              const target = nodeById.get(edge.targetId);
              return (
                <li key={edge.id} className="px-4 py-3">
                  <div className="text-[13px] font-medium">
                    {source?.label ?? edge.sourceId}
                    {" -> "}
                    {target?.label ?? edge.targetId}
                  </div>
                  <div className="mt-1 text-[11.5px] text-faint">
                    {edge.type} / {edge.sourceField} / {edge.label}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-4 py-6 text-[12.5px] text-faint">
            No visible edges for this filter. Sparse real graph data is expected until more relation
            records exist.
          </div>
        )}
      </div>
    </section>
  );
}

function LocalGraphPanel({
  localGraph,
  selectedNode,
  isLocalFocus,
  onToggleFocus,
}: {
  localGraph: ReturnType<typeof buildLocalGraph> | undefined;
  selectedNode: GraphNode | undefined;
  isLocalFocus: boolean;
  onToggleFocus: () => void;
}) {
  return (
    <section className="rounded-md border hairline bg-surface p-4">
      <h2 className="text-[14px] font-semibold">Local graph</h2>
      {localGraph && selectedNode ? (
        <div className="mt-2 space-y-3">
          <p className="text-[12.5px] text-soft">
            Focused on <span className="font-medium text-foreground">{selectedNode.label}</span>.
            Direct neighbors only; second-degree expansion and manual canvas are future work.
          </p>
          <button
            type="button"
            onClick={onToggleFocus}
            className="w-full rounded-sm border hairline bg-background px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-muted"
          >
            {isLocalFocus ? "Back to global graph" : "Enter local focus view"}
          </button>
          <div className="grid grid-cols-3 gap-2 text-center text-[11.5px]">
            <MiniMetric label="Nodes" value={localGraph.summary.nodeCount} />
            <MiniMetric label="Edges" value={localGraph.summary.edgeCount} />
            <MiniMetric label="Orphans" value={localGraph.summary.orphanCount} />
          </div>
          {localGraph.edges.length ? (
            <ul className="space-y-1">
              {localGraph.edges.map((edge) => (
                <li key={edge.id} className="rounded-sm bg-muted/30 px-2 py-1.5 text-[12px]">
                  {edge.sourceId}
                  {" -> "}
                  {edge.targetId}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-sm border border-dashed hairline px-3 py-3 text-[12.5px] text-faint">
              The selected item has no direct relation edges yet.
            </div>
          )}
        </div>
      ) : (
        <p className="mt-2 text-[12.5px] text-faint">
          Select Focus on a real node to inspect its direct local relation graph.
        </p>
      )}
    </section>
  );
}

function SourceSummary({
  typeCounts,
  edgeTypeCounts,
  relationSourceCounts,
}: {
  typeCounts: Record<string, number>;
  edgeTypeCounts: Record<string, number>;
  relationSourceCounts: Record<string, number>;
}) {
  return (
    <section className="rounded-md border hairline bg-surface p-4">
      <h2 className="text-[14px] font-semibold">Source summary</h2>
      <SummaryList title="Item types" values={typeCounts} />
      <SummaryList title="Edge types" values={edgeTypeCounts} />
      <SummaryList title="Relation sources" values={relationSourceCounts} />
    </section>
  );
}

function SummaryList({ title, values }: { title: string; values: Record<string, number> }) {
  const entries = Object.entries(values).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return (
    <div className="mt-3">
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-faint">{title}</h3>
      {entries.length ? (
        <ul className="mt-1 space-y-1 text-[12px] text-soft">
          {entries.map(([label, count]) => (
            <li key={label} className="flex justify-between gap-3">
              <span>{label}</span>
              <span className="font-medium text-foreground">{count}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-[12px] text-faint">No entries yet.</p>
      )}
    </div>
  );
}

function FutureGraphPanel() {
  const futureItems = [
    "Manual editable graph/canvas",
    "Editable standalone nodes",
    "Directed manual arrows",
    "Saved canvas layout",
    "Graph export image/PDF",
    "Graph clustering",
    "Local AI semantic graph",
  ];

  return (
    <section className="rounded-md border hairline bg-surface p-4">
      <h2 className="text-[14px] font-semibold">Future graph work</h2>
      <p className="mt-1 text-[12.5px] text-soft">
        These are intentionally not active controls in this phase.
      </p>
      <ul className="mt-3 space-y-1 text-[12px] text-faint">
        {futureItems.map((item) => (
          <li key={item}>Future: {item}</li>
        ))}
      </ul>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm bg-muted/35 px-2 py-2">
      <div className="font-editorial text-[20px] leading-none">{value}</div>
      <div className="mt-1 text-faint">{label}</div>
    </div>
  );
}

function countEdgesByNode(edges: GraphEdge[]) {
  const counts = new Map<string, number>();
  for (const edge of edges) {
    counts.set(edge.sourceId, (counts.get(edge.sourceId) ?? 0) + 1);
    counts.set(edge.targetId, (counts.get(edge.targetId) ?? 0) + 1);
  }
  return counts;
}

function matchesFilter(node: GraphNode, filter: GraphFilter) {
  switch (filter) {
    case "documents":
      return node.type === "document";
    case "pages":
      return node.type === "note" || node.type === "page";
    case "projects":
      return node.type === "project";
    case "people":
      return node.type === "person" || node.type === "interaction";
    case "finance":
      return node.type === "finance";
    case "orphans":
      return node.isOrphan;
    case "connected":
      return !node.isOrphan;
    case "all":
    default:
      return true;
  }
}
