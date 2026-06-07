import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, Trash2 } from "lucide-react";

import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";

export const Route = createFileRoute("/trash")({
  head: () => ({ meta: [{ title: "Trash - Mizaan" }] }),
  component: TrashPage,
});

function TrashPage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const items = snapshot.items
    .filter((item) => item.archivedAt || item.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-12 md:px-10">
      <p className="text-[12px] uppercase tracking-wider text-faint">System</p>
      <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Trash</h1>
      <p className="mt-1 text-[13.5px] text-soft">
        Archived or deleted prototype items appear here. Restore returns the item to normal local
        page lists.
      </p>

      <ul className="mt-8 divide-y hairline border-y hairline">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3 text-[13.5px]">
            <Trash2 className="h-3.5 w-3.5 text-faint" />
            <Link
              to="/page/$id"
              params={{ id: item.id }}
              className="min-w-0 flex-1 truncate hover:underline"
            >
              {item.title}
            </Link>
            <span className="text-[12px] text-faint">
              {item.deletedAt
                ? `deleted ${formatDate(item.deletedAt)}`
                : `archived ${formatDate(item.archivedAt)}`}
            </span>
            <button
              onClick={async () => await provider.restoreItem(item.id)}
              className="inline-flex items-center gap-1 rounded-sm border hairline px-2 py-1 text-[12px] hover:bg-muted"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restore
            </button>
          </li>
        ))}
        {!items.length && (
          <li className="py-8 text-center text-[13px] text-faint">
            Trash is empty for the current prototype vault.
          </li>
        )}
      </ul>

      <p className="mt-4 text-[12px] text-faint">
        Permanent deletion and retention windows are not implemented yet.
      </p>
      <span className="sr-only">{snapshot.health.checkedAt}</span>
    </div>
  );
}

function formatDate(value: string | undefined) {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}


