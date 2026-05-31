import { Plus, Trash2 } from "lucide-react";

import {
  addTableColumn,
  addTableRow,
  editTableCell,
  getTableStats,
  normalizeTableData,
  removeTableColumn,
  removeTableRow,
  renameTableColumn,
  serializeTableData,
} from "@/lib/table/simple-table";
import type { MizaanBlock } from "@/lib/vault/types";

export function SimpleTableBlock({
  block,
  onChange,
}: {
  block: MizaanBlock;
  onChange: (content: string) => void;
}) {
  const table = normalizeTableData(block.content);
  const stats = getTableStats(table);

  function save(next: typeof table) {
    onChange(serializeTableData(next));
  }

  return (
    <div className="my-3 overflow-x-auto rounded-md border hairline bg-surface">
      <table className="min-w-[560px] w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b hairline bg-surface-muted/70">
            {table.columns.map((column) => (
              <th key={column.id} className="min-w-[150px] border-r hairline p-0 text-left">
                <div className="flex items-center gap-1 px-2 py-1.5">
                  <input
                    value={column.name}
                    onChange={(event) =>
                      save(renameTableColumn(table, column.id, event.target.value))
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] font-medium outline-none"
                    aria-label={`Rename ${column.name}`}
                  />
                  <button
                    onClick={() => save(removeTableColumn(table, column.id))}
                    className="grid h-6 w-6 place-items-center rounded-sm text-faint hover:bg-muted hover:text-foreground"
                    aria-label={`Remove ${column.name}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </th>
            ))}
            <th className="w-12 px-2 py-1.5">
              <button
                onClick={() => save(addTableColumn(table))}
                className="grid h-6 w-6 place-items-center rounded-sm text-faint hover:bg-muted hover:text-foreground"
                aria-label="Add column"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.id} className="border-b hairline last:border-b-0">
              {table.columns.map((column) => (
                <td key={column.id} className="min-w-[150px] border-r hairline p-0 align-top">
                  <textarea
                    value={row.cells[column.id] ?? ""}
                    onChange={(event) =>
                      save(editTableCell(table, row.id, column.id, event.target.value))
                    }
                    rows={1}
                    className="min-h-9 w-full resize-none bg-transparent px-2 py-2 leading-relaxed outline-none focus:bg-background"
                    placeholder="Empty"
                  />
                </td>
              ))}
              <td className="w-12 px-2 py-1.5 align-top">
                <button
                  onClick={() => save(removeTableRow(table, row.id))}
                  className="grid h-6 w-6 place-items-center rounded-sm text-faint hover:bg-muted hover:text-foreground"
                  aria-label="Remove row"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!table.rows.length && (
        <div className="border-t hairline px-4 py-6 text-center text-[13px] text-faint">
          No rows yet. Add a row to keep working in this simple table block.
        </div>
      )}
      <div className="flex items-center justify-between border-t hairline px-2 py-1.5">
        <button
          onClick={() => save(addTableRow(table))}
          className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[12px] text-soft hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          New row
        </button>
        <span className="text-[11px] text-faint">
          {stats.rowCount} {stats.rowCount === 1 ? "row" : "rows"} / {stats.columnCount}{" "}
          {stats.columnCount === 1 ? "column" : "columns"}
        </span>
      </div>
    </div>
  );
}
