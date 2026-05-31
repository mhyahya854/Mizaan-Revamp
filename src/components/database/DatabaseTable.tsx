import { useNavigate } from "@tanstack/react-router";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

import {
  addDatabaseColumn,
  addDatabaseRow,
  changeDatabaseColumnType,
  editDatabaseCell,
  ensureDatabaseRowPage,
  normalizeDatabaseModel,
  removeDatabaseColumn,
  removeDatabaseRow,
  renameDatabaseColumn,
  toDatabaseMetadata,
  type DatabaseCellValue,
  type DatabaseColumnType,
} from "@/lib/database/database-table";
import type { MizaanItem, VaultProvider } from "@/lib/vault/types";

const COLUMN_TYPES: DatabaseColumnType[] = ["text", "number", "select", "checkbox", "date"];

export function DatabaseTable({ item, provider }: { item: MizaanItem; provider: VaultProvider }) {
  const navigate = useNavigate();
  const model = normalizeDatabaseModel(item.metadata.database, item.id, item.title);

  function save(next: typeof model) {
    provider.updateItem(item.id, { metadata: { database: toDatabaseMetadata(next) } });
  }

  function openRow(rowId: string) {
    const result = ensureDatabaseRowPage(provider, item, model, rowId);
    navigate({ to: "/page/$id", params: { id: result.page.id } });
  }

  return (
    <section className="mt-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-medium">Table view</h2>
          <p className="text-[12px] text-faint">
            Basic local database foundation. Formulas, rollups, charts, filters, and advanced views
            are not implemented yet.
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => save(addDatabaseRow(model))}
            className="inline-flex items-center gap-1 rounded-sm border hairline px-2 py-1 text-[12px] hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            New row
          </button>
          <button
            onClick={() => save(addDatabaseColumn(model))}
            className="inline-flex items-center gap-1 rounded-sm border hairline px-2 py-1 text-[12px] hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Property
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border hairline bg-surface">
        <table className="min-w-[760px] w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b hairline bg-surface-muted/70">
              <th className="w-12 px-2 py-2 text-left font-medium text-faint">Open</th>
              {model.columns.map((column) => (
                <th key={column.id} className="min-w-[170px] border-l hairline p-0 text-left">
                  <div className="space-y-1 px-2 py-2">
                    <div className="flex items-center gap-1">
                      <input
                        value={column.name}
                        onChange={(event) =>
                          save(renameDatabaseColumn(model, column.id, event.target.value))
                        }
                        className="min-w-0 flex-1 bg-transparent text-[12px] font-medium outline-none"
                        aria-label={`Rename ${column.name}`}
                      />
                      <button
                        onClick={() => save(removeDatabaseColumn(model, column.id))}
                        className="grid h-6 w-6 place-items-center rounded-sm text-faint hover:bg-muted hover:text-foreground"
                        aria-label={`Remove ${column.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <select
                      value={column.type}
                      onChange={(event) =>
                        save(
                          changeDatabaseColumnType(
                            model,
                            column.id,
                            event.target.value as DatabaseColumnType,
                          ),
                        )
                      }
                      className="w-full rounded-sm border hairline bg-background px-1 py-0.5 text-[11px] text-faint outline-none"
                    >
                      {COLUMN_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </th>
              ))}
              <th className="w-12 border-l hairline px-2 py-2">
                <button
                  onClick={() => save(addDatabaseColumn(model))}
                  className="grid h-6 w-6 place-items-center rounded-sm text-faint hover:bg-muted hover:text-foreground"
                  aria-label="Add property"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {model.rows.map((row) => (
              <tr key={row.id} className="border-b hairline last:border-b-0 hover:bg-muted/30">
                <td className="w-12 px-2 py-2 align-top">
                  <button
                    onClick={() => openRow(row.id)}
                    className="grid h-7 w-7 place-items-center rounded-sm text-faint hover:bg-muted hover:text-foreground"
                    aria-label="Open row as page"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </td>
                {model.columns.map((column) => (
                  <td key={column.id} className="min-w-[170px] border-l hairline p-0 align-top">
                    <DatabaseCell
                      type={column.type}
                      value={row.cells[column.id]}
                      onChange={(value) => save(editDatabaseCell(model, row.id, column.id, value))}
                    />
                  </td>
                ))}
                <td className="w-12 border-l hairline px-2 py-2 align-top">
                  <button
                    onClick={() => save(removeDatabaseRow(model, row.id))}
                    className="grid h-7 w-7 place-items-center rounded-sm text-faint hover:bg-muted hover:text-foreground"
                    aria-label="Remove row"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!model.rows.length && (
          <div className="px-4 py-8 text-center text-[13px] text-faint">
            No rows yet. Add a row to start this local database table.
          </div>
        )}
      </div>
    </section>
  );
}

function DatabaseCell({
  type,
  value,
  onChange,
}: {
  type: DatabaseColumnType;
  value: DatabaseCellValue | undefined;
  onChange: (value: DatabaseCellValue) => void;
}) {
  if (type === "checkbox") {
    return (
      <label className="flex min-h-10 items-center px-2">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-3.5 w-3.5 accent-foreground"
        />
      </label>
    );
  }

  return (
    <input
      type={type === "number" ? "number" : type === "date" ? "date" : "text"}
      value={value === null || value === undefined ? "" : String(value)}
      onChange={(event) =>
        onChange(type === "number" ? Number(event.target.value) : event.target.value)
      }
      className="min-h-10 w-full bg-transparent px-2 py-2 outline-none focus:bg-background"
      placeholder="Empty"
    />
  );
}
