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
  it("creates and normalizes a default database model", () => {
    const model = normalizeDatabaseModel(undefined, "db-1", "Reading List");

    expect(model.id).toBe("db-1");
    expect(model.title).toBe("Reading List");
    expect(model.viewType).toBe("table");
    expect(model.columns.length).toBeGreaterThan(1);
    expect(model.rows.length).toBeGreaterThan(0);
    expect(model.unsupportedFeatures).toEqual([]);
  });

  it("normalizes malformed database metadata safely", () => {
    const model = normalizeDatabaseModel({ columns: "bad", rows: false }, "db-2", "Broken");

    expect(model.columns.length).toBeGreaterThan(0);
    expect(model.rows.length).toBeGreaterThan(0);
  });

  it("preserves an explicit empty database row state and computes table stats", () => {
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

  it("adds, removes, renames, and changes basic columns", () => {
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

  it("adds, removes, and edits rows", () => {
    const model = createDefaultDatabaseModel("db", "Database");
    const withRow = addDatabaseRow(model, "row-extra");
    const edited = editDatabaseCell(withRow, "row-extra", model.columns[0]?.id ?? "", "Alpha");
    const removed = removeDatabaseRow(edited, "row-extra");

    expect(
      edited.rows.find((row) => row.id === "row-extra")?.cells[model.columns[0]?.id ?? ""],
    ).toBe("Alpha");
    expect(removed.rows.some((row) => row.id === "row-extra")).toBe(false);
  });

  it("allows deleting the final row so the database can show an empty table state", () => {
    const model = createDefaultDatabaseModel("db", "Database");
    const withoutRows = removeDatabaseRow(model, model.rows[0]?.id ?? "");

    expect(withoutRows.rows).toEqual([]);
    expect(withoutRows.rowOrder).toEqual([]);
    expect(getDatabaseStats(withoutRows).rowCount).toBe(0);
  });

  it("updates database title and description metadata without losing table data", () => {
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

  it("reports validation repairs for duplicate columns and stale row order entries", () => {
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

  it("persists database metadata through the provider", () => {
    const provider = createProvider();
    const item = provider.createItem({
      title: "Tasks DB",
      category: "databases",
      type: "database",
      metadata: { database: toDatabaseMetadata(createDefaultDatabaseModel("db", "Tasks DB")) },
    });
    const model = addDatabaseColumn(
      normalizeDatabaseModel(item.metadata.database, item.id, item.title),
      { id: "col-priority", name: "Priority", type: "text" },
    );

    provider.updateItem(item.id, { metadata: { database: toDatabaseMetadata(model) } });

    expect(
      normalizeDatabaseModel(
        provider.getItem(item.id)?.metadata.database,
        item.id,
        item.title,
      ).columns.some((column) => column.id === "col-priority"),
    ).toBe(true);
  });

  it("creates a database row page only when opening the row is requested", () => {
    const provider = createProvider();
    const item = provider.createItem({
      title: "People DB",
      category: "databases",
      type: "database",
      metadata: { database: toDatabaseMetadata(createDefaultDatabaseModel("db", "People DB")) },
    });
    const model = normalizeDatabaseModel(item.metadata.database, item.id, item.title);

    const result = ensureDatabaseRowPage(provider, item, model, model.rows[0]?.id ?? "");

    expect(result.page.parentId).toBe(item.id);
    expect(result.page.metadata.databaseRow).toBe(true);
    expect(result.model.rows[0]?.pageId).toBe(result.page.id);
    expect(provider.getItem(result.page.id)?.title).toBe(result.page.title);
  });
});
