import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase,
  Calendar,
  Archive,
  ChevronRight,
  ChevronsLeft,
  Command,
  Copy,
  Database,
  Edit3,
  FileText,
  FolderOpen,
  HardDrive,
  Home,
  LayoutTemplate,
  MoreHorizontal,
  Network,
  Pin,
  PinOff,
  Plus,
  Search,
  Settings,
  Target,
  Trash2,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

import { useVaultSnapshot, useVaultProvider } from "@/lib/vault/use-vault";
import type { MizaanItem } from "@/lib/vault/types";
import { cn } from "@/lib/utils";
import { createChildPage } from "@/lib/page/page-workspace";
import { buildSidebarTrees, type TreeItem } from "@/lib/sidebar/sidebar-tree";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type NavTo =
  | "/"
  | "/blueprint"
  | "/search"
  | "/notes"
  | "/documents"
  | "/projects"
  | "/people"
  | "/finance"
  | "/calendar"
  | "/trackers"
  | "/databases"
  | "/templates"
  | "/graph"
  | "/vault"
  | "/import-export"
  | "/repair"
  | "/trash"
  | "/settings";

type NavItem = { label: string; to: NavTo; icon: React.ComponentType<{ className?: string }> };

const coreNav: NavItem[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Search", to: "/search", icon: Search },
  { label: "Graph", to: "/graph", icon: Network },
  { label: "Calendar", to: "/calendar", icon: Calendar },
];

const systemTools: NavItem[] = [
  { label: "Product Map", to: "/blueprint", icon: FileText },
  { label: "Templates", to: "/templates", icon: LayoutTemplate },
  { label: "Vault", to: "/vault", icon: HardDrive },
  { label: "Import / Export", to: "/import-export", icon: Archive },
  { label: "Repair", to: "/repair", icon: Wrench },
  { label: "Trash", to: "/trash", icon: Trash2 },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function AppSidebar({
  onOpenPalette,
  collapsed,
  onToggle,
}: {
  onOpenPalette: () => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const snapshot = useVaultSnapshot();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "space-notes": true,
    "space-projects": true,
  });
  const { pinnedTree, pagesTree } = buildSidebarTrees(snapshot.items);

  if (collapsed) {
    return (
      <aside className="hidden w-12 shrink-0 flex-col items-center gap-1 border-r hairline bg-sidebar py-3 md:flex">
        <button
          onClick={onToggle}
          className="grid h-8 w-8 place-items-center rounded-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={onOpenPalette}
          className="grid h-8 w-8 place-items-center rounded-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label="Open command palette"
        >
          <Search className="h-4 w-4" />
        </button>
        {coreNav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-sm",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
            </Link>
          );
        })}

        <div className="my-1.5 w-5 border-t hairline" />

        {pinnedTree.map((item) => {
          const active = pathname === `/page/${item.id}`;
          return (
            <Link
              key={item.id}
              to="/page/$id"
              params={{ id: item.id }}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-sm text-[12px] font-bold border hairline",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent-foreground/30"
                  : "text-sidebar-muted border-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              title={item.title}
            >
              {item.icon}
            </Link>
          );
        })}

        <div className="my-1.5 w-5 border-t hairline" />

        {systemTools.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-sm",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
            </Link>
          );
        })}

        <div className="my-1.5 w-5 border-t hairline" />
      </aside>
    );
  }

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r hairline bg-sidebar md:flex">
      <div className="flex items-center justify-between px-3 pb-2 pt-3">
        <Link
          to="/vault"
          className="flex min-w-0 items-center gap-2 rounded-sm px-1.5 py-1 hover:bg-sidebar-accent"
        >
          <div className="grid h-6 w-6 place-items-center rounded-sm bg-foreground/90 text-[11px] font-medium text-background">
            M
          </div>
          <div className="min-w-0 text-left">
            <div className="truncate text-[13px] font-medium text-sidebar-accent-foreground">
              Mizaan
            </div>
            <div className="truncate text-[11px] text-sidebar-muted">Prototype local vault</div>
          </div>
        </Link>
        <button
          onClick={onToggle}
          className="grid h-7 w-7 place-items-center rounded-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label="Collapse sidebar"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="px-2 pb-2">
        <button
          onClick={onOpenPalette}
          className="flex w-full items-center gap-2 rounded-sm border hairline bg-background/60 px-2 py-1.5 text-[12.5px] text-sidebar-muted transition-colors hover:text-sidebar-accent-foreground"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search pages</span>
          <span className="flex items-center gap-0.5 text-[10.5px] text-sidebar-muted/80">
            <Command className="h-3 w-3" />K
          </span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-1 pb-3 scrollbar-thin">
        <SectionList label="Core" items={coreNav} pathname={pathname} />

        <div className="mx-3 my-2.5 border-t hairline" />

        <div className="px-2 mt-3">
          <h2 className="px-3 pb-1 text-[10.5px] font-medium uppercase tracking-wider text-sidebar-muted">
            PINNED
          </h2>
          <ul className="space-y-px">
            {pinnedTree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                openIds={openIds}
                setOpenIds={setOpenIds}
                pathname={pathname}
              />
            ))}
            {!pinnedTree.length && (
              <li className="px-3 py-1.5 text-[12px] text-sidebar-muted">
                Pinned items appear here.
              </li>
            )}
          </ul>
        </div>

        <div className="mx-3 my-2.5 border-t hairline" />

        <div className="px-2 mt-3">
          <h2 className="px-3 pb-1 text-[10.5px] font-medium uppercase tracking-wider text-sidebar-muted">
            PAGES
          </h2>
          <ul className="space-y-px mt-0.5">
            {pagesTree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                openIds={openIds}
                setOpenIds={setOpenIds}
                pathname={pathname}
              />
            ))}
            {!pagesTree.length && (
              <li className="px-3 py-1.5 text-[12px] text-sidebar-muted">
                Unpinned or recent pages appear here.
              </li>
            )}
          </ul>
        </div>

        <div className="mx-3 my-2.5 border-t hairline" />

        <div className="px-2 mt-3">
          <SectionList label="System tools" items={systemTools} pathname={pathname} />
        </div>

        <div className="mx-3 my-2.5 border-t hairline" />
      </nav>

      <div className="border-t hairline px-3 py-2 text-[11px] text-sidebar-muted">
        <div className="flex items-center justify-between">
          <span>Browser prototype</span>
          <span className="font-mono">v0.1</span>
        </div>
      </div>
    </aside>
  );
}

function SectionList({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div className="mt-3 first:mt-0">
      <h2 className="px-3 pb-1 text-[10.5px] font-medium uppercase tracking-wider text-sidebar-muted">
        {label}
      </h2>
      <ul className="space-y-px px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "group flex items-center gap-2 rounded-sm px-2 py-[5px] text-[13px]",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                <span className="flex-1 truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PageRowActionsMenu({
  node,
  active,
  onForceOpen,
}: {
  node: TreeItem;
  active: boolean;
  onForceOpen?: (id: string) => void;
}) {
  const provider = useVaultProvider();
  const navigate = useNavigate();
  const isPinned = node.metadata.sidebarPinned === true || node.metadata.pinned === true;
  const isSpace = node.id.startsWith("space-") || node.metadata.promotedAsSpace === true;
  const isProtectedItem = node.id === "note-getting-started" || node.id === "note-principles";
  const disableRename = isProtectedItem || isSpace;
  const disableDuplicate = isSpace;
  const disableTrash = isProtectedItem || isSpace;

  const handleOpen = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate({ to: "/page/$id", params: { id: node.id } });
  };

  const handleRename = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newTitle = window.prompt("Rename page:", node.title);
    if (newTitle && newTitle.trim()) {
      await provider.updateItem(node.id, { title: newTitle.trim() });
    }
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const item = await provider.getItem(node.id);
    if (!item) return;

    const newItem = await provider.createItem({
      title: `${item.title} (Copy)`,
      category: item.category,
      type: item.type,
      icon: item.icon,
      cover: item.cover,
      summary: item.summary,
      status: item.status,
      tags: [...item.tags],
      properties: { ...item.properties },
      metadata: {
        ...item.metadata,
        sidebarPinned: false,
        sidebarPinnedAt: null,
      },
    });

    const blocks = await provider.getBlocks(item.id);
    if (blocks.length > 0) {
      await provider.replaceBlocks(
        newItem.id,
        blocks.map((b) => ({
          type: b.type,
          content: b.content,
          order: b.order,
          checked: b.checked,
        })),
      );
    }
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await provider.updateItem(node.id, {
      metadata: {
        ...node.metadata,
        sidebarPinned: !isPinned,
        sidebarPinnedAt: !isPinned ? new Date().toISOString() : null,
      },
    });
  };

  const handleCreateSubpage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const subTitle = window.prompt(isSpace ? "Enter page title:" : "Enter subpage title:");
    if (subTitle && subTitle.trim()) {
      const child = createChildPage(provider, node.id, subTitle.trim());
      if (onForceOpen) {
        onForceOpen(node.id);
      }
      navigate({ to: "/page/$id", params: { id: child.id } });
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const link = window.location.origin + "/page/" + node.id;
    navigator.clipboard.writeText(link).then(() => {
      // Link copied successfully
    });
  };

  const handleTrash = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmText = `Are you sure you want to move "${node.title}" to the trash?`;
    if (window.confirm(confirmText)) {
      await provider.trashItem(node.id);
      if (active) {
        navigate({ to: "/" });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={async (e) => {
            e.stopPropagation();
          }}
          className={cn(
            "grid h-5 w-5 place-items-center rounded-sm text-sidebar-muted hover:bg-sidebar-accent-foreground/10 hover:text-sidebar-accent-foreground opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 focus:opacity-100 data-[state=open]:opacity-100 shrink-0",
            active && "opacity-100",
          )}
          aria-label="Page actions"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleOpen}>
          <FolderOpen className="h-4 w-4 mr-2" />
          <span>Open</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleRename} disabled={disableRename}>
          <Edit3 className="h-4 w-4 mr-2" />
          <span>Rename</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDuplicate} disabled={disableDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          <span>Duplicate</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleTogglePin}>
          {isPinned ? (
            <>
              <PinOff className="h-4 w-4 mr-2" />
              <span>Unpin from sidebar</span>
            </>
          ) : (
            <>
              <Pin className="h-4 w-4 mr-2" />
              <span>Pin to sidebar</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCreateSubpage}>
          <Plus className="h-4 w-4 mr-2" />
          <span>{isSpace ? "Create page inside" : "Create subpage"}</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="h-4 w-4 mr-2" />
          <span>Copy link</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleTrash}
          disabled={disableTrash}
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Move to trash</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TreeNode({
  node,
  openIds,
  setOpenIds,
  pathname,
  depth = 0,
}: {
  node: TreeItem;
  openIds: Record<string, boolean>;
  setOpenIds: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  pathname: string;
  depth?: number;
}) {
  const provider = useVaultProvider();
  const navigate = useNavigate();
  const to = `/page/${node.id}`;
  const active = pathname === to;
  const isPinned = node.metadata.sidebarPinned === true || node.metadata.pinned === true;
  const open = !!openIds[node.id];
  const onToggle = () => setOpenIds((state) => ({ ...state, [node.id]: !state[node.id] }));
  const onForceOpen = (id: string) => setOpenIds((state) => ({ ...state, [id]: true }));

  return (
    <li>
      <div
        onClick={async () => {
          navigate({ to: "/page/$id", params: { id: node.id } });
        }}
        className={cn(
          "group flex items-center gap-1 rounded-sm pr-1 text-[13px] relative cursor-pointer select-none",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
        style={{ paddingLeft: 6 + depth * 12 }}
      >
        {node.children.length ? (
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
            className="grid h-5 w-5 place-items-center rounded-sm text-sidebar-muted hover:bg-sidebar-accent-foreground/10"
            aria-label={open ? "Collapse child pages" : "Expand child pages"}
          >
            <ChevronRight className={cn("h-3 w-3 transition-transform", open && "rotate-90")} />
          </button>
        ) : (
          <span className="inline-block w-5" />
        )}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 py-[4px]">
          <span className="w-4 text-center text-[12px] leading-none opacity-80">{node.icon}</span>
          <span className="truncate">{node.title}</span>
        </div>

        {isPinned && (
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await provider.updateItem(node.id, {
                metadata: {
                  ...node.metadata,
                  sidebarPinned: false,
                  sidebarPinnedAt: null,
                },
              });
            }}
            className="grid h-5 w-5 place-items-center rounded-sm text-sidebar-muted hover:bg-sidebar-accent-foreground/10 hover:text-sidebar-accent-foreground shrink-0 mr-0.5"
            aria-label="Unpin page"
          >
            <Pin className="h-3 w-3" />
          </button>
        )}

        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const subTitle = window.prompt("Enter subpage title:");
            if (subTitle && subTitle.trim()) {
              const child = createChildPage(provider, node.id, subTitle.trim());
              onForceOpen(node.id);
              navigate({ to: "/page/$id", params: { id: child.id } });
            }
          }}
          className="grid h-5 w-5 place-items-center rounded-sm text-sidebar-muted hover:bg-sidebar-accent-foreground/10 hover:text-sidebar-accent-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 mr-0.5 transition-opacity"
          aria-label="Add subpage"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>

        <PageRowActionsMenu node={node} active={active} onForceOpen={onForceOpen} />
      </div>
      {open && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              openIds={openIds}
              setOpenIds={setOpenIds}
              pathname={pathname}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}


