import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Archive,
  ArrowRight,
  Briefcase,
  Calendar,
  Database,
  DollarSign,
  Flag,
  FilePlus2,
  FileText,
  FolderOpen,
  HardDrive,
  ListTodo,
  Network,
  Search,
  Settings,
  Target,
  Users,
  Wrench,
} from "lucide-react";

import { createPageFromTemplate } from "@/lib/page/page-workspace";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { ItemCategory } from "@/lib/vault/types";

type PaletteAction = {
  id: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub?: string;
  run: () => void;
};

const createActions: Array<{
  title: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  templateId: string;
  category?: ItemCategory;
}> = [
  {
    title: "New page",
    sub: "Create from the Blank Page template",
    icon: FilePlus2,
    templateId: "blank-page",
    category: "notes",
  },
  {
    title: "New note",
    sub: "Create a note from the Blank Note template",
    icon: FileText,
    templateId: "blank-note",
    category: "notes",
  },
  {
    title: "New project",
    sub: "Create a project from the Project Plan template",
    icon: Briefcase,
    templateId: "project-plan",
  },
  {
    title: "New task",
    sub: "Create an unlinked provider-backed task record",
    icon: ListTodo,
    templateId: "task-record",
  },
  {
    title: "New document record",
    sub: "Create a document record template",
    icon: FolderOpen,
    templateId: "document-record",
  },
  {
    title: "New person profile",
    sub: "Create a person profile template",
    icon: Users,
    templateId: "person-profile",
  },
  {
    title: "New interaction log",
    sub: "Create a provider-backed interaction record",
    icon: Users,
    templateId: "interaction-log",
  },
  {
    title: "New finance record",
    sub: "Create a local finance metadata record",
    icon: DollarSign,
    templateId: "finance-record",
  },
  {
    title: "New tracker",
    sub: "Create a local tracker metadata record",
    icon: Target,
    templateId: "tracker",
  },
  {
    title: "New goal",
    sub: "Create a local goal metadata record",
    icon: Flag,
    templateId: "goal",
  },
  {
    title: "New database",
    sub: "Create a basic editable database table",
    icon: Database,
    templateId: "basic-database",
  },
  {
    title: "New table page",
    sub: "Create a note with an editable simple table block",
    icon: FilePlus2,
    templateId: "simple-table-page",
  },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setIndex(0);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const create = createActions.map((action): PaletteAction => {
    return {
      id: `create-${action.title}`,
      group: "Create",
      icon: action.icon,
      title: action.title,
      sub: action.sub,
      run: () => {
        const item = createPageFromTemplate(provider, action.templateId, {
          category: action.category,
        });
        navigate({ to: "/page/$id", params: { id: item.id } });
      },
    };
  });
  const pages = snapshot.items
    .filter((item) => !item.archivedAt && !item.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((item): PaletteAction => {
      return {
        id: `open-${item.id}`,
        group: "Open page",
        icon: iconFor(item.category),
        title: item.title,
        sub: `${labelFor(item.category)} - ${item.status ?? "No status"}`,
        run: () => navigate({ to: "/page/$id", params: { id: item.id } }),
      };
    });
  const goTo: PaletteAction[] = [
    {
      id: "go-search",
      group: "Go to",
      icon: Search,
      title: "Search pages",
      sub: "Open the local page search route",
      run: () => navigate({ to: "/search" }),
    },
    {
      id: "go-databases",
      group: "Go to",
      icon: Database,
      title: "Open Databases",
      sub: "Editable local database tables",
      run: () => navigate({ to: "/databases" }),
    },
    {
      id: "go-trackers",
      group: "Go to",
      icon: Target,
      title: "Open Trackers",
      sub: "Local tracker metadata records",
      run: () => navigate({ to: "/trackers" }),
    },
    {
      id: "go-goals",
      group: "Go to",
      icon: Flag,
      title: "Open Goals",
      sub: "Local goal metadata records",
      run: () => navigate({ to: "/goals" }),
    },
    {
      id: "go-vault",
      group: "Go to",
      icon: HardDrive,
      title: "Open Vault",
      sub: "Prototype vault status and health",
      run: () => navigate({ to: "/vault" }),
    },
    {
      id: "go-import-export",
      group: "Go to",
      icon: Archive,
      title: "Open Import / Export",
      sub: "Browser JSON archive manager",
      run: () => navigate({ to: "/import-export" }),
    },
    {
      id: "go-repair",
      group: "Go to",
      icon: Wrench,
      title: "Open Repair / Recovery",
      sub: "Vault health checks and restore preview",
      run: () => navigate({ to: "/repair" }),
    },
    {
      id: "go-settings",
      group: "Go to",
      icon: Settings,
      title: "Open Settings",
      sub: "Provider and local workspace settings",
      run: () => navigate({ to: "/settings" }),
    },
    {
      id: "go-graph",
      group: "Go to",
      icon: Network,
      title: "Open Graph",
      sub: "Relation graph foundation",
      run: () => navigate({ to: "/graph" }),
    },
  ];
  const actions = [...create, ...pages, ...goTo];

  if (!open) return null;

  const filtered = actions.filter((action) => {
    const haystack = `${action.title} ${action.sub ?? ""} ${action.group}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  const groups = Array.from(new Set(filtered.map((action) => action.group)));
  const clampedIndex = Math.min(index, Math.max(filtered.length - 1, 0));

  function runAction(action: PaletteAction) {
    action.run();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-foreground/15" />
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-[560px] overflow-hidden rounded-md border hairline bg-popover shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b hairline px-3">
          <Search className="h-4 w-4 text-faint" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setIndex((value) => Math.min(value + 1, filtered.length - 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setIndex((value) => Math.max(value - 1, 0));
              }
              if (event.key === "Enter" && filtered[clampedIndex]) {
                event.preventDefault();
                runAction(filtered[clampedIndex]);
              }
            }}
            placeholder="Search pages or run page commands"
            className="h-11 w-full bg-transparent text-[14px] outline-none placeholder:text-faint"
          />
          <kbd className="hidden rounded-sm border hairline px-1.5 py-0.5 text-[10.5px] text-faint sm:inline-block">
            esc
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto py-1 scrollbar-thin">
          {groups.map((group) => (
            <div key={group}>
              <div className="px-3 pb-1 pt-2 text-[10.5px] font-medium uppercase tracking-wider text-faint">
                {group}
              </div>
              {filtered
                .filter((action) => action.group === group)
                .map((action) => {
                  const Icon = action.icon;
                  const active = filtered.indexOf(action) === clampedIndex;
                  return (
                    <button
                      key={action.id}
                      onMouseEnter={() => setIndex(filtered.indexOf(action))}
                      onClick={() => runAction(action)}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left ${active ? "bg-muted" : ""}`}
                    >
                      <Icon className="h-4 w-4 text-soft" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px]">{action.title}</div>
                        {action.sub && (
                          <div className="truncate text-[11.5px] text-faint">{action.sub}</div>
                        )}
                      </div>
                      {active && <ArrowRight className="h-3.5 w-3.5 text-faint" />}
                    </button>
                  );
                })}
            </div>
          ))}
          {!filtered.length && (
            <div className="px-3 py-8 text-center text-[13px] text-faint">No results.</div>
          )}
        </div>

        <div className="flex items-center justify-between border-t hairline px-3 py-2 text-[11px] text-faint">
          <span>Working commands only</span>
          <span>Mizaan - Quick switcher</span>
        </div>
      </div>
    </div>
  );
}

function iconFor(category: ItemCategory) {
  const icons: Record<ItemCategory, React.ComponentType<{ className?: string }>> = {
    notes: FileText,
    documents: FolderOpen,
    projects: Briefcase,
    tasks: ListTodo,
    people: Users,
    finance: DollarSign,
    calendar: Calendar,
    trackers: Target,
    goals: Flag,
    databases: Database,
    templates: FilePlus2,
  };
  return icons[category];
}

function labelFor(category: ItemCategory) {
  const labels: Record<ItemCategory, string> = {
    notes: "Notes",
    documents: "Documents",
    projects: "Projects",
    tasks: "Tasks",
    people: "People",
    finance: "Finance",
    calendar: "Calendar",
    trackers: "Trackers",
    goals: "Goals",
    databases: "Databases",
    templates: "Templates",
  };
  return labels[category];
}
