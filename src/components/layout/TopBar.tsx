import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Command, Menu } from "lucide-react";
import { useRightPanel } from "@/hooks/use-right-panel";

const labels: Record<string, string> = {
  "/": "Home",
  "/search": "Search",
  "/databases": "Databases",
  "/notes": "Notes",
  "/documents": "Documents",
  "/projects": "Projects",
  "/people": "People",
  "/finance": "Finance",
  "/calendar": "Calendar",
  "/trackers": "Trackers",
  "/templates": "Templates",
  "/graph": "Graph",
  "/page": "Page",
  "/vault": "Vault",
  "/trash": "Trash",
  "/settings": "Settings",
};

export function TopBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segments = pathname.split("/").filter(Boolean);
  const root = segments[0] ? `/${segments[0]}` : "/";
  const rootLabel = labels[root] ?? "Home";
  const { toggleRightPanel } = useRightPanel();

  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b hairline bg-background px-3">
      <nav className="flex min-w-0 items-center gap-1 text-[13px] text-soft">
        <Link to="/" className="rounded-sm px-1.5 py-0.5 hover:bg-muted">
          Mizaan
        </Link>
        <ChevronRight className="h-3 w-3 text-faint" />
        <Link
          to={root === "/page" ? "/notes" : (root as "/")}
          className="rounded-sm px-1.5 py-0.5 text-foreground hover:bg-muted"
        >
          {rootLabel}
        </Link>
        {segments.slice(1).map((segment, index) => (
          <span key={`${segment}-${index}`} className="flex min-w-0 items-center gap-1">
            <ChevronRight className="h-3 w-3 text-faint" />
            <span className="truncate rounded-sm px-1.5 py-0.5 text-foreground">
              {index === 0 && root === "/page" ? "Current page" : decodeURIComponent(segment)}
            </span>
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-0.5 text-soft">
        <button
          onClick={onOpenPalette}
          className="hidden items-center gap-1 rounded-sm px-2 py-1 text-[12px] hover:bg-muted sm:flex"
        >
          <Command className="h-3.5 w-3.5" />
          Commands
        </button>
        <button
          onClick={toggleRightPanel}
          className="grid h-7 w-7 place-items-center rounded-sm hover:bg-muted"
          aria-label="Toggle Page Metadata"
        >
          <Menu className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
