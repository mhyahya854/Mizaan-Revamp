export interface SimpleTableColumn {
  id: string;
  name: string;
}

export interface SimpleTableRow {
  id: string;
  cells: Record<string, string>;
}

export interface SimpleTableData {
  columns: SimpleTableColumn[];
  rows: SimpleTableRow[];
}

const DEFAULT_COLUMNS: SimpleTableColumn[] = [
  { id: "col-1", name: "Column 1" },
  { id: "col-2", name: "Column 2" },
];

const DEFAULT_ROWS: SimpleTableRow[] = [
  { id: "row-1", cells: { "col-1": "", "col-2": "" } },
  { id: "row-2", cells: { "col-1": "", "col-2": "" } },
];

export function createDefaultTableData(): SimpleTableData {
  return {
    columns: DEFAULT_COLUMNS.map((column) => ({ ...column })),
    rows: DEFAULT_ROWS.map((row) => ({ id: row.id, cells: { ...row.cells } })),
  };
}

export function normalizeTableData(input: unknown): SimpleTableData {
  const parsed = typeof input === "string" ? parseTableString(input) : input;
  if (!isRecord(parsed)) return createDefaultTableData();

  const columns = Array.isArray(parsed.columns)
    ? parsed.columns.flatMap((entry, index): SimpleTableColumn[] => {
        if (!isRecord(entry)) return [];
        const id = toNonEmptyString(entry.id, `col-${index + 1}`);
        return [{ id, name: toNonEmptyString(entry.name, `Column ${index + 1}`) }];
      })
    : [];
  const safeColumns = columns.length ? uniqueColumns(columns) : createDefaultTableData().columns;
  const rows = Array.isArray(parsed.rows)
    ? parsed.rows.flatMap((entry, index): SimpleTableRow[] => {
        if (!isRecord(entry)) return [];
        return [
          {
            id: toNonEmptyString(entry.id, `row-${index + 1}`),
            cells: normalizeCells(entry.cells, safeColumns),
          },
        ];
      })
    : [];

  return {
    columns: safeColumns,
    rows: rows.length
      ? uniqueRows(rows, safeColumns)
      : createDefaultTableData().rows.map((row) => normalizeRow(row, safeColumns)),
  };
}

export function serializeTableData(table: SimpleTableData) {
  return JSON.stringify(normalizeTableData(table));
}

export function addTableColumn(
  table: SimpleTableData,
  name = "New column",
  id = createTableId("col"),
) {
  const normalized = normalizeTableData(table);
  const column = { id, name: name.trim() || "New column" };
  return {
    columns: [...normalized.columns, column],
    rows: normalized.rows.map((row) => ({
      ...row,
      cells: { ...row.cells, [column.id]: "" },
    })),
  };
}

export function removeTableColumn(table: SimpleTableData, columnId: string) {
  const normalized = normalizeTableData(table);
  if (normalized.columns.length <= 1) return normalized;
  const columns = normalized.columns.filter((column) => column.id !== columnId);
  if (columns.length === normalized.columns.length) return normalized;
  return {
    columns,
    rows: normalized.rows.map((row) => {
      const cells = { ...row.cells };
      delete cells[columnId];
      return normalizeRow({ ...row, cells }, columns);
    }),
  };
}

export function renameTableColumn(table: SimpleTableData, columnId: string, name: string) {
  const normalized = normalizeTableData(table);
  return {
    ...normalized,
    columns: normalized.columns.map((column) =>
      column.id === columnId ? { ...column, name: name.trim() || "Untitled" } : column,
    ),
  };
}

export function addTableRow(table: SimpleTableData, id = createTableId("row")) {
  const normalized = normalizeTableData(table);
  return {
    ...normalized,
    rows: [
      ...normalized.rows,
      {
        id,
        cells: Object.fromEntries(normalized.columns.map((column) => [column.id, ""])),
      },
    ],
  };
}

export function removeTableRow(table: SimpleTableData, rowId: string) {
  const normalized = normalizeTableData(table);
  if (normalized.rows.length <= 1) return normalized;
  const rows = normalized.rows.filter((row) => row.id !== rowId);
  return { ...normalized, rows: rows.length ? rows : normalized.rows };
}

export function editTableCell(
  table: SimpleTableData,
  rowId: string,
  columnId: string,
  value: string,
) {
  const normalized = normalizeTableData(table);
  return {
    ...normalized,
    rows: normalized.rows.map((row) =>
      row.id === rowId ? { ...row, cells: { ...row.cells, [columnId]: value } } : row,
    ),
  };
}

function parseTableString(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed) return createDefaultTableData();
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const lines = trimmed.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return createDefaultTableData();
    const rows = lines.map((line) => line.split("\t"));
    const width = Math.max(...rows.map((row) => row.length), 1);
    const columns = Array.from({ length: width }, (_, index) => ({
      id: `col-${index + 1}`,
      name: `Column ${index + 1}`,
    }));
    return {
      columns,
      rows: rows.map((row, index) => ({
        id: `row-${index + 1}`,
        cells: Object.fromEntries(
          columns.map((column, columnIndex) => [column.id, row[columnIndex] ?? ""]),
        ),
      })),
    };
  }
}

function normalizeCells(input: unknown, columns: SimpleTableColumn[]) {
  const source = isRecord(input) ? input : {};
  return Object.fromEntries(columns.map((column) => [column.id, toStringValue(source[column.id])]));
}

function normalizeRow(row: SimpleTableRow, columns: SimpleTableColumn[]): SimpleTableRow {
  return { id: row.id, cells: normalizeCells(row.cells, columns) };
}

function uniqueColumns(columns: SimpleTableColumn[]) {
  const seen = new Set<string>();
  return columns.filter((column) => {
    if (seen.has(column.id)) return false;
    seen.add(column.id);
    return true;
  });
}

function uniqueRows(rows: SimpleTableRow[], columns: SimpleTableColumn[]) {
  const seen = new Set<string>();
  return rows
    .filter((row) => {
      if (seen.has(row.id)) return false;
      seen.add(row.id);
      return true;
    })
    .map((row) => normalizeRow(row, columns));
}

function createTableId(prefix: string) {
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

function toStringValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}
