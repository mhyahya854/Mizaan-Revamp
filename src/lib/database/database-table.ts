import type { MizaanItem, PropertyValue, VaultProvider } from "../vault/types";

export type DatabaseColumnType = "text" | "number" | "select" | "checkbox" | "date";
export type DatabaseCellValue = string | number | boolean | null;

export interface DatabaseColumn {
  id: string;
  name: string;
  type: DatabaseColumnType;
  width?: number;
  options?: string[];
}

export interface DatabaseRow {
  id: string;
  title: string;
  pageId?: string;
  cells: Record<string, DatabaseCellValue>;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseModel {
  id: string;
  title: string;
  viewType: "table";
  columns: DatabaseColumn[];
  rows: DatabaseRow[];
  rowOrder: string[];
  createdAt: string;
  updatedAt: string;
  unsupportedFeatures: string[];
}

const DEFAULT_COLUMNS: DatabaseColumn[] = [
  { id: "title", name: "Name", type: "text", width: 220 },
  { id: "status", name: "Status", type: "select", options: ["Not started", "Active", "Done"] },
  { id: "notes", name: "Notes", type: "text", width: 280 },
];

export function createDefaultDatabaseModel(
  id = "database",
  title = "Basic Database",
): DatabaseModel {
  const timestamp = new Date().toISOString();
  const rows: DatabaseRow[] = [
    {
      id: "row-1",
      title: "New row",
      cells: { title: "New row", status: "Active", notes: "" },
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  return {
    id,
    title,
    viewType: "table",
    columns: DEFAULT_COLUMNS.map((column) => ({
      ...column,
      options: column.options ? [...column.options] : undefined,
    })),
    rows,
    rowOrder: rows.map((row) => row.id),
    createdAt: timestamp,
    updatedAt: timestamp,
    unsupportedFeatures: [],
  };
}

export function normalizeDatabaseModel(
  input: unknown,
  id = "database",
  title = "Basic Database",
): DatabaseModel {
  if (!isRecord(input)) return createDefaultDatabaseModel(id, title);

  const fallback = createDefaultDatabaseModel(id, title);
  const columns = Array.isArray(input.columns)
    ? input.columns.flatMap((entry, index): DatabaseColumn[] => {
        if (!isRecord(entry)) return [];
        return [
          {
            id: toNonEmptyString(entry.id, `property-${index + 1}`),
            name: toNonEmptyString(entry.name, `Property ${index + 1}`),
            type: normalizeColumnType(entry.type),
            width: typeof entry.width === "number" ? entry.width : undefined,
            options: Array.isArray(entry.options)
              ? entry.options.filter((option): option is string => typeof option === "string")
              : undefined,
          },
        ];
      })
    : [];
  const safeColumns = uniqueColumns(columns.length ? columns : fallback.columns);
  const rows = Array.isArray(input.rows)
    ? input.rows.flatMap((entry, index): DatabaseRow[] => {
        if (!isRecord(entry)) return [];
        return [
          normalizeRow(
            {
              id: toNonEmptyString(entry.id, `row-${index + 1}`),
              title: toNonEmptyString(entry.title, "Untitled row"),
              pageId: typeof entry.pageId === "string" ? entry.pageId : undefined,
              cells: isRecord(entry.cells) ? normalizeCells(entry.cells, safeColumns) : {},
              createdAt: toNonEmptyString(entry.createdAt, fallback.createdAt),
              updatedAt: toNonEmptyString(entry.updatedAt, fallback.updatedAt),
            },
            safeColumns,
          ),
        ];
      })
    : [];
  const safeRows = uniqueRows(rows.length ? rows : fallback.rows, safeColumns);
  const rowOrder = Array.isArray(input.rowOrder)
    ? input.rowOrder.filter((entry): entry is string => typeof entry === "string")
    : safeRows.map((row) => row.id);

  return {
    id: toNonEmptyString(input.id, id),
    title: toNonEmptyString(input.title, title),
    viewType: "table",
    columns: safeColumns,
    rows: sortRows(safeRows, rowOrder),
    rowOrder: rowOrder.length
      ? rowOrder.filter((rowId) => safeRows.some((row) => row.id === rowId))
      : safeRows.map((row) => row.id),
    createdAt: toNonEmptyString(input.createdAt, fallback.createdAt),
    updatedAt: toNonEmptyString(input.updatedAt, fallback.updatedAt),
    unsupportedFeatures: Array.isArray(input.unsupportedFeatures)
      ? input.unsupportedFeatures.filter((entry): entry is string => typeof entry === "string")
      : [],
  };
}

export function addDatabaseColumn(
  model: DatabaseModel,
  input: { id?: string; name?: string; type?: DatabaseColumnType } = {},
) {
  const normalized = normalizeDatabaseModel(model, model.id, model.title);
  const column: DatabaseColumn = {
    id: input.id ?? createDatabaseId("property"),
    name: input.name?.trim() || "New property",
    type: input.type ?? "text",
  };
  return touchModel({
    ...normalized,
    columns: [...normalized.columns, column],
    rows: normalized.rows.map((row) => ({
      ...row,
      cells: { ...row.cells, [column.id]: defaultCellValue(column.type) },
    })),
  });
}

export function removeDatabaseColumn(model: DatabaseModel, columnId: string) {
  const normalized = normalizeDatabaseModel(model, model.id, model.title);
  if (normalized.columns.length <= 1) return normalized;
  const columns = normalized.columns.filter((column) => column.id !== columnId);
  if (columns.length === normalized.columns.length) return normalized;
  return touchModel({
    ...normalized,
    columns,
    rows: normalized.rows.map((row) => {
      const cells = { ...row.cells };
      delete cells[columnId];
      return normalizeRow({ ...row, cells }, columns);
    }),
  });
}

export function renameDatabaseColumn(model: DatabaseModel, columnId: string, name: string) {
  const normalized = normalizeDatabaseModel(model, model.id, model.title);
  return touchModel({
    ...normalized,
    columns: normalized.columns.map((column) =>
      column.id === columnId ? { ...column, name: name.trim() || "Untitled" } : column,
    ),
  });
}

export function changeDatabaseColumnType(
  model: DatabaseModel,
  columnId: string,
  type: DatabaseColumnType,
) {
  const normalized = normalizeDatabaseModel(model, model.id, model.title);
  return touchModel({
    ...normalized,
    columns: normalized.columns.map((column) =>
      column.id === columnId ? { ...column, type } : column,
    ),
    rows: normalized.rows.map((row) => ({
      ...row,
      cells: { ...row.cells, [columnId]: coerceCellValue(row.cells[columnId], type) },
    })),
  });
}

export function addDatabaseRow(model: DatabaseModel, id = createDatabaseId("row")) {
  const normalized = normalizeDatabaseModel(model, model.id, model.title);
  const timestamp = new Date().toISOString();
  const row: DatabaseRow = {
    id,
    title: "New row",
    cells: Object.fromEntries(
      normalized.columns.map((column) => [column.id, defaultCellValue(column.type)]),
    ),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  if (normalized.columns[0]) row.cells[normalized.columns[0].id] = "New row";
  return touchModel({
    ...normalized,
    rows: [...normalized.rows, row],
    rowOrder: [...normalized.rowOrder, row.id],
  });
}

export function removeDatabaseRow(model: DatabaseModel, rowId: string) {
  const normalized = normalizeDatabaseModel(model, model.id, model.title);
  if (normalized.rows.length <= 1) return normalized;
  const rows = normalized.rows.filter((row) => row.id !== rowId);
  return touchModel({
    ...normalized,
    rows,
    rowOrder: normalized.rowOrder.filter((id) => id !== rowId),
  });
}

export function editDatabaseCell(
  model: DatabaseModel,
  rowId: string,
  columnId: string,
  value: DatabaseCellValue,
) {
  const normalized = normalizeDatabaseModel(model, model.id, model.title);
  const column = normalized.columns.find((entry) => entry.id === columnId);
  if (!column) return normalized;
  return touchModel({
    ...normalized,
    rows: normalized.rows.map((row) => {
      if (row.id !== rowId) return row;
      const cells = { ...row.cells, [columnId]: coerceCellValue(value, column.type) };
      return {
        ...row,
        title:
          columnId === normalized.columns[0]?.id
            ? String(cells[columnId] ?? "Untitled row")
            : row.title,
        cells,
        updatedAt: new Date().toISOString(),
      };
    }),
  });
}

export function ensureDatabaseRowPage(
  provider: VaultProvider,
  databaseItem: MizaanItem,
  model: DatabaseModel,
  rowId: string,
) {
  const normalized = normalizeDatabaseModel(model, databaseItem.id, databaseItem.title);
  const row = normalized.rows.find((entry) => entry.id === rowId) ?? normalized.rows[0];
  const existing = row?.pageId ? provider.getItem(row.pageId) : undefined;
  if (row && existing) return { page: existing, model: normalized };

  const title = rowTitle(row, normalized.columns);
  const page = provider.createItem({
    title,
    category: "databases",
    type: "database-row",
    icon: "R",
    parentId: databaseItem.id,
    summary: `Row page in ${databaseItem.title}`,
    status: "Active",
    metadata: {
      databaseRow: true,
      databaseId: databaseItem.id,
      rowId: row?.id ?? rowId,
    },
  });
  provider.createBlock(page.id, { type: "paragraph", content: `Row notes for ${title}` });
  provider.createRelation({
    sourceId: databaseItem.id,
    targetId: page.id,
    relationType: "database_to_row",
    label: "Database row",
  });

  const nextModel = touchModel({
    ...normalized,
    rows: normalized.rows.map((entry) =>
      entry.id === (row?.id ?? rowId) ? { ...entry, pageId: page.id, title } : entry,
    ),
  });
  provider.updateItem(databaseItem.id, { metadata: { database: toDatabaseMetadata(nextModel) } });
  return { page, model: nextModel };
}

export function toDatabaseMetadata(model: DatabaseModel): PropertyValue {
  return normalizeDatabaseModel(model, model.id, model.title) as unknown as PropertyValue;
}

function normalizeRow(row: DatabaseRow, columns: DatabaseColumn[]): DatabaseRow {
  return {
    ...row,
    title: row.title || rowTitle(row, columns),
    cells: normalizeCells(row.cells, columns),
  };
}

function normalizeCells(input: Record<string, unknown>, columns: DatabaseColumn[]) {
  return Object.fromEntries(
    columns.map((column) => [column.id, coerceCellValue(input[column.id], column.type)]),
  );
}

function sortRows(rows: DatabaseRow[], rowOrder: string[]) {
  const rowById = new Map(rows.map((row) => [row.id, row]));
  const ordered = rowOrder.flatMap((rowId) => {
    const row = rowById.get(rowId);
    if (!row) return [];
    rowById.delete(rowId);
    return [row];
  });
  return [...ordered, ...rowById.values()];
}

function uniqueColumns(columns: DatabaseColumn[]) {
  const seen = new Set<string>();
  return columns.filter((column) => {
    if (seen.has(column.id)) return false;
    seen.add(column.id);
    return true;
  });
}

function uniqueRows(rows: DatabaseRow[], columns: DatabaseColumn[]) {
  const seen = new Set<string>();
  return rows
    .filter((row) => {
      if (seen.has(row.id)) return false;
      seen.add(row.id);
      return true;
    })
    .map((row) => normalizeRow(row, columns));
}

function touchModel(model: DatabaseModel): DatabaseModel {
  return { ...model, updatedAt: new Date().toISOString() };
}

function rowTitle(row: DatabaseRow | undefined, columns: DatabaseColumn[]) {
  if (!row) return "New row";
  const firstColumn = columns[0];
  const firstValue = firstColumn ? row.cells[firstColumn.id] : undefined;
  return String(firstValue || row.title || "New row");
}

function normalizeColumnType(value: unknown): DatabaseColumnType {
  return value === "number" ||
    value === "select" ||
    value === "checkbox" ||
    value === "date" ||
    value === "text"
    ? value
    : "text";
}

function coerceCellValue(value: unknown, type: DatabaseColumnType): DatabaseCellValue {
  if (type === "checkbox") return Boolean(value);
  if (type === "number") {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
    return null;
  }
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return type === "text" ? String(value) : value;
  return String(value);
}

function defaultCellValue(type: DatabaseColumnType): DatabaseCellValue {
  if (type === "checkbox") return false;
  if (type === "number") return null;
  return "";
}

function createDatabaseId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNonEmptyString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
