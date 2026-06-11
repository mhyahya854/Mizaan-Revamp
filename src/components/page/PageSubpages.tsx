import { Link } from "@tanstack/react-router";
import { FilePlus2, Files } from "lucide-react";

import type { PageWorkspaceModel } from "@/lib/page/page-workspace";

export function PageSubpages({
  model,
  onCreateChild,
}: {
  model: PageWorkspaceModel;
  onCreateChild: () => void;
}) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-editorial text-[20px]">
          <Files className="h-4 w-4 text-faint" />
          Subpages
        </h2>
        <button
          onClick={onCreateChild}
          className="inline-flex items-center gap-1 rounded-sm border hairline px-2 py-1 text-[12px] hover:bg-muted"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          New child
        </button>
      </div>
      <ul className="mt-3 divide-y hairline border-y hairline">
        {model.childPages.map((child) => (
          <li key={child.id}>
            <Link
              to="/page/$id"
              params={{ id: child.id }}
              className="flex items-center gap-2 py-2.5 text-[13px] hover:bg-muted/40"
            >
              <span className="grid h-6 w-6 place-items-center rounded-sm border hairline text-[12px]">
                {child.icon}
              </span>
              <span className="min-w-0 flex-1 truncate">{child.title}</span>
              <span className="text-[11px] text-faint">{child.status ?? "Draft"}</span>
            </Link>
          </li>
        ))}
        {!model.childPages.length && (
          <li className="py-3 text-[12.5px] text-faint">
            No child pages yet. Creating one will add a real provider item with this page as parent.
          </li>
        )}
      </ul>
    </section>
  );
}
