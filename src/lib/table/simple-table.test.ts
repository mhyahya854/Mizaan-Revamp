import { describe, expect, it } from "vitest";

import {
  addTableColumn,
  addTableRow,
  createDefaultTableData,
  editTableCell,
  getTableStats,
  normalizeTableData,
  removeTableColumn,
  removeTableRow,
  renameTableColumn,
  serializeTableData,
} from "./simple-table";

describe("simple table block model", () => {
  it(``, async () => {
    const table = normalizeTableData({ columns: "bad", rows: null });

    expect(table.columns.length).toBe(2);
    expect(table.rows.length).toBe(2);
    expect(table.rows[0]?.cells[table.columns[0]?.id ?? ""]).toBe("");
  });

  it(``, async () => {
    const table = createDefaultTableData();
    const withRow = addTableRow(table, "row-custom");

    expect(withRow.rows.some((row) => row.id === "row-custom")).toBe(true);

    const removed = removeTableRow(withRow, "row-custom");

    expect(removed.rows.some((row) => row.id === "row-custom")).toBe(false);
    expect(removeTableRow(removed, removed.rows[0]?.id ?? "").rows.length).toBeGreaterThan(0);
  });

  it(``, async () => {
    const table = createDefaultTableData();
    const withColumn = addTableColumn(table, "Notes", "col-notes");
    const renamed = renameTableColumn(withColumn, "col-notes", "Evidence");
    const edited = editTableCell(renamed, renamed.rows[0]?.id ?? "", "col-notes", "Receipt");
    const removed = removeTableColumn(edited, table.columns[0]?.id ?? "");

    expect(renamed.columns.find((column) => column.id === "col-notes")?.name).toBe("Evidence");
    expect(edited.rows[0]?.cells["col-notes"]).toBe("Receipt");
    expect(removed.columns.some((column) => column.id === table.columns[0]?.id)).toBe(false);
    expect(removed.rows[0]?.cells["col-notes"]).toBe("Receipt");
  });

  it(``, async () => {
    const table = editTableCell(createDefaultTableData(), "row-1", "col-1", "Persisted");
    const parsed = normalizeTableData(JSON.parse(serializeTableData(table)));

    expect(parsed.rows[0]?.cells["col-1"]).toBe("Persisted");
  });

  it(``, async () => {
    const table = normalizeTableData({
      columns: [{ id: "name", name: "Name" }],
      rows: [],
    });

    expect(table.rows).toEqual([]);
    expect(getTableStats(table)).toEqual({
      rowCount: 0,
      columnCount: 1,
      hasRows: false,
      hasColumns: true,
    });
  });

  it(``, async () => {
    const table = normalizeTableData({
      columns: [{ id: "name", name: "Name" }],
      rows: [{ id: "row-1", cells: { name: "Only row" } }],
    });
    const withoutRows = removeTableRow(table, "row-1");

    expect(withoutRows.rows).toEqual([]);
    expect(getTableStats(withoutRows).rowCount).toBe(0);
  });
});

