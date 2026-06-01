import type { CreateItemInput, MizaanItem, PropertyValue } from "../vault/types";

export const DOCUMENT_KIND_VALUES = [
  "general",
  "pdf",
  "image",
  "office",
  "text",
  "markdown",
  "receipt",
  "invoice",
  "identity",
  "contract",
  "certificate",
  "reference",
  "unknown",
] as const;

export type DocumentKind = (typeof DOCUMENT_KIND_VALUES)[number];

export const DOCUMENT_STATUS_VALUES = [
  "metadata-only",
  "active",
  "reference",
  "needs-review",
  "archived",
  "missing-file",
] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUS_VALUES)[number];

export const DOCUMENT_IMPORT_STATE_VALUES = [
  "record-only",
  "metadata-only",
  "planned-native-import",
  "unsupported-in-browser",
] as const;

export type DocumentImportState = (typeof DOCUMENT_IMPORT_STATE_VALUES)[number];

export const DOCUMENT_PREVIEW_STATE_VALUES = [
  "unavailable",
  "metadata-only",
  "planned",
  "unsupported",
] as const;

export type DocumentPreviewState = (typeof DOCUMENT_PREVIEW_STATE_VALUES)[number];

export const DOCUMENT_STORAGE_STATE_VALUES = [
  "browser-record",
  "metadata-only",
  "future-vault-file",
  "missing-file",
] as const;

export type DocumentStorageState = (typeof DOCUMENT_STORAGE_STATE_VALUES)[number];

export interface DocumentMetadata extends Record<string, PropertyValue> {
  documentTitle: string;
  documentKind: DocumentKind;
  documentStatus: DocumentStatus;
  documentSource: string;
  documentDate: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileExtension: string;
  importState: DocumentImportState;
  previewState: DocumentPreviewState;
  storageState: DocumentStorageState;
  category: "documents";
  tags: string[];
  notes: string;
  linkedPageIds: string[];
  linkedProjectIds: string[];
  linkedPersonIds: string[];
  linkedFinanceIds: string[];
}

export interface CreateDocumentRecordOptions {
  title?: string;
  kind?: DocumentKind | string;
  status?: DocumentStatus | string;
  source?: string;
  documentDate?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string | number;
  fileExtension?: string;
  tags?: string[];
  notes?: string;
}

const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  general: "General",
  pdf: "PDF",
  image: "Image",
  office: "Office",
  text: "Text",
  markdown: "Markdown",
  receipt: "Receipt",
  invoice: "Invoice",
  identity: "Identity",
  contract: "Contract",
  certificate: "Certificate",
  reference: "Reference",
  unknown: "Unknown",
};

const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  "metadata-only": "Metadata-only",
  active: "Active",
  reference: "Reference",
  "needs-review": "Needs review",
  archived: "Archived",
  "missing-file": "Missing file",
};

const DOCUMENT_IMPORT_LABELS: Record<DocumentImportState, string> = {
  "record-only": "Record only",
  "metadata-only": "Metadata only",
  "planned-native-import": "Planned native import",
  "unsupported-in-browser": "Unsupported in browser",
};

const DOCUMENT_PREVIEW_LABELS: Record<DocumentPreviewState, string> = {
  unavailable: "Unavailable",
  "metadata-only": "Metadata only",
  planned: "Planned",
  unsupported: "Unsupported",
};

const DOCUMENT_STORAGE_LABELS: Record<DocumentStorageState, string> = {
  "browser-record": "Browser record",
  "metadata-only": "Metadata only",
  "future-vault-file": "Future vault file",
  "missing-file": "Missing file",
};

export function createDefaultDocumentMetadata(
  input: Record<string, unknown> = {},
): DocumentMetadata {
  return normalizeDocumentMetadata({
    documentTitle: "Untitled document",
    documentKind: "general",
    documentStatus: "metadata-only",
    documentSource: "",
    documentDate: "",
    fileName: "",
    fileType: "",
    fileSize: "",
    fileExtension: "",
    importState: "record-only",
    previewState: "unavailable",
    storageState: "browser-record",
    category: "documents",
    tags: [],
    notes: "",
    linkedPageIds: [],
    linkedProjectIds: [],
    linkedPersonIds: [],
    linkedFinanceIds: [],
    ...input,
  });
}

export function normalizeDocumentMetadata(input: unknown): DocumentMetadata {
  const source = isRecord(input) ? input : {};
  const normalized: Record<string, PropertyValue> = {};

  for (const [key, value] of Object.entries(source)) {
    const safeValue = toPropertyValue(value);
    if (safeValue !== undefined) normalized[key] = safeValue;
  }

  const rawTitle = normalizeString(source.documentTitle);

  return {
    ...normalized,
    documentTitle: rawTitle || "Untitled document",
    documentKind:
      source.documentKind === undefined ? "general" : normalizeDocumentKind(source.documentKind),
    documentStatus:
      source.documentStatus === undefined
        ? "metadata-only"
        : normalizeDocumentStatus(source.documentStatus),
    documentSource: normalizeString(source.documentSource),
    documentDate: normalizeString(source.documentDate),
    fileName: normalizeString(source.fileName),
    fileType: normalizeString(source.fileType),
    fileSize: normalizeString(source.fileSize),
    fileExtension: normalizeFileExtension(source.fileExtension),
    importState:
      source.importState === undefined
        ? "record-only"
        : normalizeDocumentImportState(source.importState),
    previewState:
      source.previewState === undefined
        ? "unavailable"
        : normalizeDocumentPreviewState(source.previewState),
    storageState:
      source.storageState === undefined
        ? "browser-record"
        : normalizeDocumentStorageState(source.storageState),
    category: "documents",
    tags: normalizeStringArray(source.tags),
    notes: normalizeString(source.notes),
    linkedPageIds: normalizeDocumentRelationIds(source.linkedPageIds),
    linkedProjectIds: normalizeDocumentRelationIds(source.linkedProjectIds),
    linkedPersonIds: normalizeDocumentRelationIds(source.linkedPersonIds),
    linkedFinanceIds: normalizeDocumentRelationIds(source.linkedFinanceIds),
  };
}

export function updateDocumentMetadata(
  current: unknown,
  patch: Record<string, unknown>,
): DocumentMetadata {
  const currentMetadata = normalizeDocumentMetadata(current);
  return normalizeDocumentMetadata({ ...currentMetadata, ...patch });
}

export function createDocumentRecordInput(
  options: CreateDocumentRecordOptions = {},
): CreateItemInput {
  const title = normalizeString(options.title) || "Untitled document";
  const tags = uniqueStrings(["document", ...(options.tags ?? [])]);
  const metadata = createDefaultDocumentMetadata({
    documentTitle: title,
    documentKind: options.kind ?? "general",
    documentStatus: options.status ?? "metadata-only",
    documentSource: options.source ?? "",
    documentDate: options.documentDate ?? "",
    fileName: options.fileName ?? "",
    fileType: options.fileType ?? "",
    fileSize: options.fileSize ?? "",
    fileExtension: options.fileExtension ?? "",
    tags,
    notes: options.notes ?? "",
  });

  return {
    title,
    category: "documents",
    type: "document",
    icon: "D",
    summary: "Metadata-only document record. Real file import is planned for a native phase.",
    status: getDocumentStatusLabel(metadata.documentStatus),
    tags,
    properties: {
      status: getDocumentStatusLabel(metadata.documentStatus),
      documentKind: getDocumentKindLabel(metadata.documentKind),
      fileState: getDocumentStorageLabel(metadata.storageState),
    },
    attachedFiles: [],
    metadata,
  };
}

export function isDocumentRecordItem(
  item: Pick<MizaanItem, "category" | "type" | "metadata">,
): boolean {
  return (
    item.category === "documents" &&
    item.type === "document" &&
    item.metadata.promotedAsSpace !== true &&
    item.metadata.itemRole !== "space"
  );
}

export function normalizeDocumentMetadataForItem(
  item: Pick<MizaanItem, "title" | "tags" | "metadata">,
): DocumentMetadata {
  return normalizeDocumentMetadata({
    documentTitle: item.title,
    tags: item.tags,
    ...item.metadata,
  });
}

export function normalizeDocumentKind(value: unknown): DocumentKind {
  return normalizeEnum(value, DOCUMENT_KIND_VALUES, "unknown");
}

export function normalizeDocumentStatus(value: unknown): DocumentStatus {
  return normalizeEnum(value, DOCUMENT_STATUS_VALUES, "metadata-only");
}

export function normalizeDocumentImportState(value: unknown): DocumentImportState {
  return normalizeEnum(value, DOCUMENT_IMPORT_STATE_VALUES, "record-only");
}

export function normalizeDocumentPreviewState(value: unknown): DocumentPreviewState {
  return normalizeEnum(value, DOCUMENT_PREVIEW_STATE_VALUES, "unavailable");
}

export function normalizeDocumentStorageState(value: unknown): DocumentStorageState {
  return normalizeEnum(value, DOCUMENT_STORAGE_STATE_VALUES, "browser-record");
}

export function normalizeDocumentRelationIds(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [];
  return uniqueStrings(
    values.flatMap((entry) => {
      const normalized = normalizeString(entry);
      if (!normalized || !/^[A-Za-z0-9._:-]+$/.test(normalized)) return [];
      return [normalized];
    }),
  );
}

export function getDocumentDisplayFields(metadataInput: unknown) {
  const metadata = normalizeDocumentMetadata(metadataInput);
  return {
    title: metadata.documentTitle,
    kindLabel: getDocumentKindLabel(metadata.documentKind),
    statusLabel: getDocumentStatusLabel(metadata.documentStatus),
    importLabel: getDocumentImportLabel(metadata.importState),
    previewLabel: getDocumentPreviewLabel(metadata.previewState),
    storageLabel: getDocumentStorageLabel(metadata.storageState),
    fileName: metadata.fileName || "No file name recorded",
    fileType: metadata.fileType || metadata.fileExtension || "No file type recorded",
    source: metadata.documentSource || "No source recorded",
    documentDate: metadata.documentDate || "No date recorded",
    notes: metadata.notes,
    relationCount:
      metadata.linkedPageIds.length +
      metadata.linkedProjectIds.length +
      metadata.linkedPersonIds.length +
      metadata.linkedFinanceIds.length,
  };
}

export function getDocumentStateSummary(metadataInput: unknown) {
  const metadata = normalizeDocumentMetadata(metadataInput);
  return {
    importLabel: getDocumentImportLabel(metadata.importState),
    previewLabel: getDocumentPreviewLabel(metadata.previewState),
    storageLabel: getDocumentStorageLabel(metadata.storageState),
    metadataOnly: isDocumentMetadataOnly(metadata),
    importAvailable: isDocumentImportAvailable(metadata),
    previewAvailable: isDocumentPreviewAvailable(metadata),
    unsupportedReason: getDocumentUnsupportedReason(metadata),
  };
}

export function isDocumentMetadataOnly(metadataInput: unknown): boolean {
  const metadata = normalizeDocumentMetadata(metadataInput);
  return (
    metadata.documentStatus === "metadata-only" ||
    metadata.importState === "record-only" ||
    metadata.storageState === "browser-record" ||
    metadata.storageState === "metadata-only"
  );
}

export function isDocumentPreviewAvailable(_metadataInput: unknown): boolean {
  return false;
}

export function isDocumentImportAvailable(_metadataInput: unknown): boolean {
  return false;
}

export function getDocumentKindLabel(kind: DocumentKind): string {
  return DOCUMENT_KIND_LABELS[kind];
}

export function getDocumentStatusLabel(status: DocumentStatus): string {
  return DOCUMENT_STATUS_LABELS[status];
}

export function getDocumentImportLabel(state: DocumentImportState): string {
  return DOCUMENT_IMPORT_LABELS[state];
}

export function getDocumentPreviewLabel(state: DocumentPreviewState): string {
  return DOCUMENT_PREVIEW_LABELS[state];
}

export function getDocumentStorageLabel(state: DocumentStorageState): string {
  return DOCUMENT_STORAGE_LABELS[state];
}

export function getDocumentUnsupportedReason(metadataInput: unknown): string {
  const metadata = normalizeDocumentMetadata(metadataInput);
  const parts = [
    "File import is planned for a later native filesystem phase.",
    "Preview is unavailable in this browser prototype.",
    "OCR and thumbnails are not implemented.",
  ];

  if (metadata.storageState === "browser-record" || metadata.storageState === "metadata-only") {
    parts.push("This record stores metadata only in the current provider.");
  }

  return parts.join(" ");
}

function normalizeEnum<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
): T[number] {
  const normalized = normalizeString(value).toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value).trim();
  return "";
}

function normalizeFileExtension(value: unknown): string {
  return normalizeString(value).replace(/^\.+/, "").toLowerCase();
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return uniqueStrings(value.map(normalizeString).filter(Boolean));
}

function uniqueStrings(values: string[]): string[] {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toPropertyValue(value: unknown): PropertyValue | undefined {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    const arrayValue = value.flatMap((entry) => {
      const safeValue = toPropertyValue(entry);
      return safeValue === undefined ? [] : [safeValue];
    });
    return arrayValue;
  }
  if (isRecord(value)) {
    const result: Record<string, PropertyValue> = {};
    for (const [key, entry] of Object.entries(value)) {
      const safeValue = toPropertyValue(entry);
      if (safeValue !== undefined) result[key] = safeValue;
    }
    return result;
  }
  return undefined;
}
