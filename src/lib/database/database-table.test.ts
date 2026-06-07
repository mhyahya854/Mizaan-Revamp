import { describe, expect, it } from "vitest";

import {
  addDatabaseColumn,
  addDatabaseRow,
  changeDatabaseColumnType,
  createDefaultDatabaseModel,
  editDatabaseCell,
  ensureDatabaseRowPage,
  getDatabaseStats,
  normalizeDatabaseModel,
  removeDatabaseColumn,
  removeDatabaseRow,
  renameDatabaseColumn,
  toDatabaseMetadata,
  updateDatabaseDetails,
  validateDatabaseModel,
  filterAndSortRows,
} from "./database-table";
import {
  LocalStorageVaultProvider,
  createMemoryStorage,
} from "../vault/local-storage-vault-provider";

function createProvider() {
  let sequence = 0;
  return new LocalStorageVaultProvider({
    storage: createMemoryStorage(),
    now: () => "2026-05-29T00:00:00.000Z",
    idFactory: (prefix) => `${prefix}-${++sequence}`,
    seedOnEmpty: false,
  });
}

describe("database table model", () => {
  it(``, async () => {
    const model = normalizeDatabaseModel(undefined, "db-1", "Reading List");

    expect(model.id).toBe("db-1");
    expect(model.title).toBe("Reading List");
    expect(model.viewType).toBe("table");
    expect(model.columns.length).toBeGreaterThan(1);
    expect(model.rows.length).toBeGreaterThan(0);
    expect(model.unsupportedFeatures).toEqual([]);
  });

  it(``, async () => {
    const model = normalizeDatabaseModel({ columns: "bad", rows: false }, "db-2", "Broken");

    expect(model.columns.length).toBeGreaterThan(0);
    expect(model.rows.length).toBeGreaterThan(0);
  });

  it(``, async () => {
    const model = normalizeDatabaseModel(
      {
        columns: [{ id: "name", name: "Name", type: "text" }],
        rows: [],
        rowOrder: [],
      },
      "db-empty",
      "Empty Database",
    );

    expect(model.rows).toEqual([]);
    expect(getDatabaseStats(model)).toEqual({
      rowCount: 0,
      columnCount: 1,
      hasRows: false,
      hasColumns: true,
    });
  });

  it(``, async () => {
    const model = createDefaultDatabaseModel("db", "Database");
    const withColumn = addDatabaseColumn(model, {
      id: "col-status",
      name: "Status",
      type: "select",
    });
    const renamed = renameDatabaseColumn(withColumn, "col-status", "State");
    const typed = changeDatabaseColumnType(renamed, "col-status", "checkbox");
    const removed = removeDatabaseColumn(typed, model.columns[0]?.id ?? "");

    expect(renamed.columns.find((column) => column.id === "col-status")?.name).toBe("State");
    expect(typed.columns.find((column) => column.id === "col-status")?.type).toBe("checkbox");
    expect(removed.columns.some((column) => column.id === model.columns[0]?.id)).toBe(false);
  });

  it(``, async () => {
    const model = createDefaultDatabaseModel("db", "Database");
    const withRow = addDatabaseRow(model, "row-extra");
    const edited = editDatabaseCell(withRow, "row-extra", model.columns[0]?.id ?? "", "Alpha");
    const removed = removeDatabaseRow(edited, "row-extra");

    expect(
      edited.rows.find((row) => row.id === "row-extra")?.cells[model.columns[0]?.id ?? ""],
    ).toBe("Alpha");
    expect(removed.rows.some((row) => row.id === "row-extra")).toBe(false);
  });

  it(``, async () => {
    const model = createDefaultDatabaseModel("db", "Database");
    const withoutRows = removeDatabaseRow(model, model.rows[0]?.id ?? "");

    expect(withoutRows.rows).toEqual([]);
    expect(withoutRows.rowOrder).toEqual([]);
    expect(getDatabaseStats(withoutRows).rowCount).toBe(0);
  });

  it(``, async () => {
    const model = editDatabaseCell(
      createDefaultDatabaseModel("db", "Database"),
      "row-1",
      "notes",
      "Keep this note",
    );
    const updated = updateDatabaseDetails(model, {
      title: "Research Database",
      description: "Provider-backed research table",
    });

    expect(updated.title).toBe("Research Database");
    expect(updated.description).toBe("Provider-backed research table");
    expect(updated.rows[0]?.cells.notes).toBe("Keep this note");
  });

  it(``, async () => {
    const validation = validateDatabaseModel({
      columns: [
        { id: "name", name: "Name", type: "text" },
        { id: "name", name: "Duplicate", type: "text" },
      ],
      rows: [
        { id: "row-1", title: "One", cells: { name: "One" } },
        { id: "row-1", title: "Duplicate", cells: { name: "Duplicate" } },
      ],
      rowOrder: ["missing-row", "row-1"],
    });

    expect(validation.model.columns).toHaveLength(1);
    expect(validation.model.rows).toHaveLength(1);
    expect(validation.model.rowOrder).toEqual(["row-1"]);
    expect(validation.issues).toEqual(
      expect.arrayContaining([
        "Removed duplicate database columns.",
        "Removed duplicate database rows.",
        "Removed stale row order entries.",
      ]),
    );
  });

  it(``, async () => {
    const provider = createProvider();
    const item = await provider.createItem({
      title: "Tasks DB",
      category: "databases",
      type: "database",
      metadata: { database: toDatabaseMetadata(createDefaultDatabaseModel("db", "Tasks DB")) },
    });
    const model = addDatabaseColumn(
      normalizeDatabaseModel(item.metadata.database, item.id, item.title),
      { id: "col-priority", name: "Priority", type: "text" },
    );

    await provider.updateItem(item.id, { metadata: { database: toDatabaseMetadata(model) } });

    expect(
      normalizeDatabaseModel(
        (await provider.getItem(item.id))?.metadata.database,
        item.id,
        item.title,
      ).columns.some((column) => column.id === "col-priority"),
    ).toBe(true);
  });

  it(``, async () => {
    const provider = createProvider();
    const item = await provider.createItem({
      title: "People DB",
      category: "databases",
      type: "database",
      metadata: { database: toDatabaseMetadata(createDefaultDatabaseModel("db", "People DB")) },
    });
    const model = normalizeDatabaseModel(item.metadata.database, item.id, item.title);

    const result = await ensureDatabaseRowPage(provider, item, model, model.rows[0]?.id ?? "");

    expect(result.page.parentId).toBe(item.id);
    expect(result.page.metadata.databaseRow).toBe(true);
    expect(result.model.rows[0]?.pageId).toBe(result.page.id);
    expect((await provider.getItem(result.page.id))?.title).toBe(result.page.title);
  });

  it(``, async () => {
    const columns = [
      { id: "name", name: "Name", type: "text" as const },
      { id: "category", name: "Category", type: "text" as const },
    ];
    const rows = [
      {
        id: "row-1",
        title: "Apple",
        cells: { name: "Apple", category: "Fruit" },
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "row-2",
        title: "Banana",
        cells: { name: "Banana", category: "Fruit" },
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "row-3",
        title: "Carrot",
        cells: { name: "Carrot", category: "Vegetable" },
        createdAt: "",
        updatedAt: "",
      },
    ];

    // Filter by Fruit
    const filtered1 = filterAndSortRows(rows, columns, "category", "fruit", null, null);
    expect(filtered1).toHaveLength(2);
    expect(filtered1.map((r) => r.id)).toEqual(["row-1", "row-2"]);

    // Filter by apple
    const filtered2 = filterAndSortRows(rows, columns, "name", "APPLE", null, null);
    expect(filtered2).toHaveLength(1);
    expect(filtered2[0]?.id).toBe("row-1");

    // Filter with no matches
    const filtered3 = filterAndSortRows(rows, columns, "name", "Donut", null, null);
    expect(filtered3).toHaveLength(0);
  });

  it(``, async () => {
    const columns = [
      { id: "name", name: "Name", type: "text" as const },
      { id: "age", name: "Age", type: "number" as const },
    ];
    const rows = [
      {
        id: "row-1",
        title: "Charlie",
        cells: { name: "Charlie", age: 30 },
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "row-2",
        title: "Alice",
        cells: { name: "Alice", age: 25 },
        createdAt: "",
        updatedAt: "",
      },
      { id: "row-3", title: "Bob", cells: { name: "Bob", age: 35 }, createdAt: "", updatedAt: "" },
    ];

    // Sort by name asc
    const sortedNameAsc = filterAndSortRows(rows, columns, null, "", "name", "asc");
    expect(sortedNameAsc.map((r) => r.id)).toEqual(["row-2", "row-3", "row-1"]); // Alice, Bob, Charlie

    // Sort by name desc
    const sortedNameDesc = filterAndSortRows(rows, columns, null, "", "name", "desc");
    expect(sortedNameDesc.map((r) => r.id)).toEqual(["row-1", "row-3", "row-2"]); // Charlie, Bob, Alice

    // Sort by age asc
    const sortedAgeAsc = filterAndSortRows(rows, columns, null, "", "age", "asc");
    expect(sortedAgeAsc.map((r) => r.id)).toEqual(["row-2", "row-1", "row-3"]); // 25, 30, 35

    // Sort by age desc
    const sortedAgeDesc = filterAndSortRows(rows, columns, null, "", "age", "desc");
    expect(sortedAgeDesc.map((r) => r.id)).toEqual(["row-3", "row-1", "row-2"]); // 35, 30, 25
  });
});


