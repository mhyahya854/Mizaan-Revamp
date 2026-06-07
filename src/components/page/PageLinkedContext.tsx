import { Link } from "@tanstack/react-router";
import { Link2 } from "lucide-react";

import type { PageWorkspaceModel } from "@/lib/page/page-workspace";

export function PageLinkedContext({
  title,
  items,
  direction,
}: {
  title: string;
  items: PageWorkspaceModel["outgoingLinks"];
  direction: "source" | "target";
}) {
  return (
    <section>
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-faint">{title}</h3>
      <ul className="mt-2 space-y-1">
        {items.map((entry) => {
          const item = direction === "target" ? entry.target : entry.source;
          return (
            <li key={entry.relation.id}>
              <Link
                to="/page/$id"
                params={{ id: item.id }}
                className="flex min-w-0 items-center gap-2 rounded-sm px-2 py-1.5 text-[12.5px] hover:bg-muted"
              >
                <Link2 className="h-3.5 w-3.5 shrink-0 text-faint" />
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <span className="shrink-0 text-[11px] text-faint">{entry.relation.label}</span>
              </Link>
            </li>
          );
        })}
        {!items.length && (
          <li className="rounded-sm border border-dashed hairline px-2 py-3 text-[12.5px] text-faint">
            No relation records yet. Wiki-link indexing is planned for a later phase.
          </li>
        )}
      </ul>
    </section>
  );
}

