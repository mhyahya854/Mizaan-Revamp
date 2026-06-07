import { Archive, FilePlus2, RotateCcw } from "lucide-react";

import type { PageWorkspaceModel } from "@/lib/page/page-workspace";

export function PageHeader({
  model,
  title,
  onTitleChange,
  onCreateChild,
  onArchive,
  onRestore,
}: {
  model: PageWorkspaceModel;
  title: string;
  onTitleChange: (title: string) => void;
  onCreateChild: () => void;
  onArchive: () => void;
  onRestore: () => void;
}) {
  const isArchived = Boolean(model.item.archivedAt || model.item.deletedAt);

  return (
    <header className="pt-6 pb-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <button
              className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-muted/40 hover:bg-muted text-[24px] font-medium transition-colors"
              aria-label="Page icon"
              title="Icon editing comes after the page workspace foundation."
            >
              {model.item.icon}
            </button>
            <input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              className="min-w-0 flex-1 bg-transparent font-editorial text-[36px] font-semibold leading-tight tracking-tight text-foreground outline-none placeholder:text-faint/60"
              placeholder="Untitled"
            />
          </div>
          {isArchived && (
            <div className="mt-2 pl-[60px]">
              <span className="inline-block rounded-sm bg-destructive/10 px-1.5 py-0.5 text-[11px] font-medium text-destructive">
                Archived or deleted
              </span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 self-start pt-2">
          <button
            onClick={onCreateChild}
            className="inline-flex items-center gap-1 rounded-sm border hairline bg-background px-2.5 py-1 text-[12px] text-soft hover:bg-muted hover:text-foreground transition-colors"
          >
            <FilePlus2 className="h-3.5 w-3.5" />
            <span>Child page</span>
          </button>
          {isArchived ? (
            <button
              onClick={onRestore}
              className="inline-flex items-center gap-1 rounded-sm border hairline bg-background px-2.5 py-1 text-[12px] text-soft hover:bg-muted hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restore</span>
            </button>
          ) : (
            <button
              onClick={onArchive}
              className="inline-flex items-center gap-1 rounded-sm border hairline bg-background px-2.5 py-1 text-[12px] text-soft hover:bg-muted hover:text-foreground transition-colors"
            >
              <Archive className="h-3.5 w-3.5" />
              <span>Archive</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

