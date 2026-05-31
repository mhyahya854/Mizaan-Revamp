import { createFileRoute, Link } from "@tanstack/react-router";

import { useVaultSnapshot } from "@/lib/vault/use-vault";

export const Route = createFileRoute("/graph")({
  head: () => ({ meta: [{ title: "Graph - Mizaan" }] }),
  component: GraphPage,
});

function GraphPage() {
  const snapshot = useVaultSnapshot();
  const nodes = snapshot.items.slice(0, 24).map((item, index, all) => {
    const angle = (Math.PI * 2 * index) / Math.max(all.length, 1);
    const radius = all.length > 6 ? 34 : 24;
    return {
      item,
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
    };
  });
  const byId = new Map(nodes.map((node) => [node.item.id, node]));
  const edges = snapshot.relations.flatMap((relation) => {
    const source = byId.get(relation.sourceId);
    const target = byId.get(relation.targetId);
    return source && target ? [{ relation, source, target }] : [];
  });

  return (
    <div className="flex h-full flex-col">
      <header className="border-b hairline px-6 pb-4 pt-8 md:px-10">
        <p className="text-[12px] uppercase tracking-wider text-faint">Knowledge</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-editorial text-[34px] tracking-normal">Graph</h1>
            <p className="mt-1 text-[13.5px] text-soft">
              Relation graph foundation from provider items and relation records. Wiki links and
              automatic graph indexing are not implemented yet.
            </p>
          </div>
          <div className="text-[11.5px] text-soft">
            {nodes.length} nodes / {edges.length} relation links
          </div>
        </div>
      </header>

      <div className="relative min-h-[560px] flex-1 bg-dotgrid">
        {nodes.length > 0 ? (
          <>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              {edges.map(({ relation, source, target }) => (
                <line
                  key={relation.id}
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
            {nodes.map((node) => (
              <Link
                key={node.item.id}
                to="/page/$id"
                params={{ id: node.item.id }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 outline-none"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <span
                  className="grid place-items-center rounded-full border hairline bg-surface text-[11px] shadow-sm"
                  style={{ width: 32, height: 32 }}
                >
                  {node.item.icon}
                </span>
                <span className="max-w-[140px] truncate rounded-sm bg-background/80 px-1 py-px text-[10.5px] text-soft">
                  {node.item.title}
                </span>
              </Link>
            ))}
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center px-6 text-center text-[13px] text-faint">
            No provider items exist yet. Create pages to build a relation graph foundation.
          </div>
        )}

        <div className="absolute bottom-4 left-4 max-w-[320px] rounded-md border hairline bg-popover px-3 py-2 text-[11.5px] text-soft shadow-sm">
          This graph is relation-based only. Full backlinks, wiki-link parsing, graph indexes, and
          manual canvases are later phases.
        </div>
      </div>
    </div>
  );
}
