import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

import type { PageWorkspaceModel } from "@/lib/page/page-workspace";

export function PageBreadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: PageWorkspaceModel["breadcrumbs"];
}) {
  return (
    <nav className="flex min-w-0 items-center gap-1 text-[12px] text-faint" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <span key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1">
          {index > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
          {crumb.href ? (
            <Link
              to={crumb.href as "/"}
              className="flex min-w-0 items-center gap-1 rounded-sm px-1.5 py-0.5 hover:bg-muted hover:text-foreground"
            >
              {index === 0 && <Home className="h-3 w-3" />}
              <span className="truncate">{crumb.label}</span>
            </Link>
          ) : (
            <span className="truncate rounded-sm px-1.5 py-0.5 text-foreground">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

