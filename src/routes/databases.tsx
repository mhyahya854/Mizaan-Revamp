import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Database, Plus } from "lucide-react";
import { useState } from "react";

import { PageTemplatePicker } from "@/components/page/PageTemplatePicker";
import { createPageFromTemplate } from "@/lib/page/page-workspace";
import { normalizeDatabaseModel } from "@/lib/database/database-table";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";

export const Route = createFileRoute("/databases")({
  head: () => ({ meta: [{ title: "Databases - Mizaan" }] }),
  component: DatabasesPage,
});

function DatabasesPage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);
  const databases = snapshot.items
    .filter((item) => item.category === "databases" && item.type === "database")
    .filter((item) => !item.archivedAt && !item.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  async function createDatabase(templateId: string) {
    const item = await createPageFromTemplate(provider, templateId, { category: "databases" });
    navigate({ to: "/page/$id", params: { id: item.id } });
    setPickerOpen(false);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-6 pb-24 pt-12 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-faint">Tables</p>
          <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Databases</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] text-soft">
            Basic editable local table pages. This is not the final database engine; formulas,
            rollups, advanced views, and SQLite storage are later phases.
          </p>
        </div>
        <button
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-sm bg-foreground px-2.5 py-1.5 text-[12.5px] text-background hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          New database
        </button>
      </header>

      <ul className="mt-8 divide-y hairline border-y hairline">
        {databases.map((item) => {
          const model = normalizeDatabaseModel(item.metadata.database, item.id, item.title);
          return (
            <li key={item.id}>
              <Link
                to="/page/$id"
                params={{ id: item.id }}
                className="flex items-center gap-3 px-1 py-3 hover:bg-muted/40"
              >
                <span className="grid h-8 w-8 place-items-center rounded-sm border hairline">
                  <Database className="h-4 w-4 text-soft" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] text-foreground">{item.title}</span>
                  <span className="block truncate text-[12px] text-faint">
                    {model.rows.length} rows / {model.columns.length} properties
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        {!databases.length && (
          <li className="px-3 py-10 text-center text-[13px] text-faint">
            No database pages yet. Create one from the Basic Database template.
          </li>
        )}
      </ul>

      <PageTemplatePicker
        open={pickerOpen}
        category="databases"
        items={snapshot.items}
        title="Create database"
        onClose={() => setPickerOpen(false)}
        onSelect={createDatabase}
      />
    </div>
  );
}


