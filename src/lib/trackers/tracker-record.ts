import type { CreateItemInput, MizaanItem, PropertyValue } from "../vault/types";

export const TRACKER_TYPE_VALUES = [
  "habit",
  "study",
  "health",
  "reading",
  "productivity",
  "finance",
  "custom",
] as const;

export type TrackerType = (typeof TRACKER_TYPE_VALUES)[number];

export const TRACKER_STATUS_VALUES = [
  "not-started",
  "active",
  "paused",
  "completed",
  "archived",
] as const;

export type TrackerStatus = (typeof TRACKER_STATUS_VALUES)[number];

export const TRACKER_FREQUENCY_VALUES = [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
  "custom",
] as const;

export type TrackerFrequency = (typeof TRACKER_FREQUENCY_VALUES)[number];

export interface TrackerCheckIn extends Record<string, PropertyValue> {
  id: string;
  date: string;
  value: number | null;
  unit: string;
  note: string;
  createdAt: string;
}

export interface TrackerMetadata extends Record<string, PropertyValue> {
  trackerTitle: string;
  trackerType: TrackerType;
  trackerStatus: TrackerStatus;
  frequency: TrackerFrequency;
  targetValue: number | null;
  targetValueInvalid: boolean;
  unit: string;
  currentValue: number | null;
  currentValueInvalid: boolean;
  startDate: string;
  endDate: string;
  notes: string;
  linkedProjectIds: string[];
  linkedTaskIds: string[];
  linkedPersonIds: string[];
  linkedDocumentIds: string[];
  linkedFinanceIds: string[];
  private: boolean;
  sensitive: boolean;
  fakeStreaks: false;
  reminderEngine: false;
  checkIns: TrackerCheckIn[];
  tags: string[];
}

export interface CreateTrackerRecordOptions {
  title?: string;
  type?: TrackerType | string;
  status?: TrackerStatus | string;
  frequency?: TrackerFrequency | string;
  targetValue?: string | number | null;
  unit?: string;
  currentValue?: string | number | null;
  startDate?: string;
  endDate?: string;
  notes?: string;
  private?: boolean;
  sensitive?: boolean;
  linkedProjectIds?: string[];
  linkedTaskIds?: string[];
  linkedPersonIds?: string[];
  linkedDocumentIds?: string[];
  linkedFinanceIds?: string[];
  tags?: string[];
  parentId?: string;
}

export interface TrackerGraphTarget {
  targetId: string;
  sourceField:
    | "linkedProjectIds"
    | "linkedTaskIds"
    | "linkedPersonIds"
    | "linkedDocumentIds"
    | "linkedFinanceIds";
  edgeType: "project-link" | "task-link" | "person-link" | "document-link" | "finance-link";
  label: string;
}

export interface TrackerTotals {
  recordCount: number;
  activeCount: number;
  pausedCount: number;
  completedCount: number;
  archivedCount: number;
  withTargetCount: number;
  checkInCount: number;
  privateFlagCount: number;
  sensitiveFlagCount: number;
  invalidNumberCount: number;
}

const TRACKER_TYPE_LABELS: Record<TrackerType, string> = {
  habit: "Habit",
  study: "Study",
  health: "Health",
  reading: "Reading",
  productivity: "Productivity",
  finance: "Finance",
  custom: "Custom",
};

const TRACKER_STATUS_LABELS: Record<TrackerStatus, string> = {
  "not-started": "Not started",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
};

const TRACKER_FREQUENCY_LABELS: Record<TrackerFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
  custom: "Custom",
};

const TRACKER_GRAPH_RELATION_FIELDS: Array<{
  field: TrackerGraphTarget["sourceField"];
  edgeType: TrackerGraphTarget["edgeType"];
  label: string;
}> = [
  { field: "linkedProjectIds", edgeType: "project-link", label: "Linked project" },
  { field: "linkedTaskIds", edgeType: "task-link", label: "Linked task" },
  { field: "linkedPersonIds", edgeType: "person-link", label: "Linked person" },
  { field: "linkedDocumentIds", edgeType: "document-link", label: "Linked document" },
  { field: "linkedFinanceIds", edgeType: "finance-link", label: "Linked finance" },
];

export function createDefaultTrackerMetadata(input: Record<string, unknown> = {}): TrackerMetadata {
  return normalizeTrackerMetadata({
    trackerTitle: "Untitled tracker",
    trackerType: "habit",
    trackerStatus: "not-started",
    frequency: "daily",
    targetValue: null,
    targetValueInvalid: false,
    unit: "",
    currentValue: null,
    currentValueInvalid: false,
    startDate: "",
    endDate: "",
    notes: "",
    linkedProjectIds: [],
    linkedTaskIds: [],
    linkedPersonIds: [],
    linkedDocumentIds: [],
    linkedFinanceIds: [],
    private: false,
    sensitive: false,
    fakeStreaks: false,
    reminderEngine: false,
    checkIns: [],
    tags: [],
    ...input,
  });
}

export function normalizeTrackerMetadata(input: unknown): TrackerMetadata {
  const source = isRecord(input) ? input : {};
  const normalized: Record<string, PropertyValue> = {};

  for (const [key, value] of Object.entries(source)) {
    const safeValue = toPropertyValue(value);
    if (safeValue !== undefined) normalized[key] = safeValue;
  }

  const targetValue = normalizeNumber(source.targetValue);
  const currentValue = normalizeNumber(source.currentValue);
  const targetValueInvalid =
    source.targetValue === undefined || source.targetValue === null || source.targetValue === ""
      ? normalizeBoolean(source.targetValueInvalid)
      : isInvalidNumber(source.targetValue);
  const currentValueInvalid =
    source.currentValue === undefined || source.currentValue === null || source.currentValue === ""
      ? normalizeBoolean(source.currentValueInvalid)
      : isInvalidNumber(source.currentValue);

  return {
    ...normalized,
    trackerTitle: normalizeString(source.trackerTitle) || "Untitled tracker",
    trackerType:
      source.trackerType === undefined ? "habit" : normalizeTrackerType(source.trackerType),
    trackerStatus:
      source.trackerStatus === undefined
        ? "not-started"
        : normalizeTrackerStatus(source.trackerStatus),
    frequency:
      source.frequency === undefined ? "daily" : normalizeTrackerFrequency(source.frequency),
    targetValue,
    targetValueInvalid,
    unit: normalizeString(source.unit),
    currentValue,
    currentValueInvalid,
    startDate: normalizeDateString(source.startDate),
    endDate: normalizeDateString(source.endDate),
    notes: normalizeString(source.notes),
    linkedProjectIds: normalizeTrackerRelationIds(source.linkedProjectIds),
    linkedTaskIds: normalizeTrackerRelationIds(source.linkedTaskIds),
    linkedPersonIds: normalizeTrackerRelationIds(source.linkedPersonIds),
    linkedDocumentIds: normalizeTrackerRelationIds(source.linkedDocumentIds),
    linkedFinanceIds: normalizeTrackerRelationIds(source.linkedFinanceIds),
    private: normalizeBoolean(source.private),
    sensitive: normalizeBoolean(source.sensitive),
    fakeStreaks: false,
    reminderEngine: false,
    checkIns: normalizeCheckIns(source.checkIns, normalizeString(source.unit)),
    tags: normalizeStringArray(source.tags),
  };
}

export function updateTrackerMetadata(
  current: unknown,
  patch: Record<string, unknown>,
): TrackerMetadata {
  return normalizeTrackerMetadata({ ...normalizeTrackerMetadata(current), ...patch });
}

export function createTrackerRecordInput(
  options: CreateTrackerRecordOptions = {},
): CreateItemInput {
  const title = normalizeString(options.title) || "Untitled tracker";
  const trackerType = normalizeTrackerType(options.type ?? "habit");
  const tags = uniqueStrings(["tracker", trackerType, ...(options.tags ?? [])]);
  const metadata = createDefaultTrackerMetadata({
    trackerTitle: title,
    trackerType,
    trackerStatus: options.status ?? "not-started",
    frequency: options.frequency ?? "daily",
    targetValue: options.targetValue ?? null,
    unit: options.unit ?? "",
    currentValue: options.currentValue ?? null,
    startDate: options.startDate ?? "",
    endDate: options.endDate ?? "",
    notes: options.notes ?? "",
    private: options.private ?? false,
    sensitive: options.sensitive ?? false,
    linkedProjectIds: options.linkedProjectIds ?? [],
    linkedTaskIds: options.linkedTaskIds ?? [],
    linkedPersonIds: options.linkedPersonIds ?? [],
    linkedDocumentIds: options.linkedDocumentIds ?? [],
    linkedFinanceIds: options.linkedFinanceIds ?? [],
    tags,
  });

  return {
    title: metadata.trackerTitle,
    category: "trackers",
    type: "tracker",
    icon: "T",
    summary: metadata.notes || "Provider-backed local tracker metadata record.",
    status: getTrackerStatusLabel(metadata.trackerStatus),
    tags,
    parentId: options.parentId,
    properties: {
      trackerType: getTrackerTypeLabel(metadata.trackerType),
      status: getTrackerStatusLabel(metadata.trackerStatus),
      frequency: getTrackerFrequencyLabel(metadata.frequency),
      targetValue: metadata.targetValue,
      currentValue: metadata.currentValue,
      unit: metadata.unit,
      private: metadata.private,
      sensitive: metadata.sensitive,
    },
    attachedFiles: [],
    metadata,
  };
}

export function isTrackerRecordItem(
  item: Pick<MizaanItem, "category" | "type" | "metadata">,
): boolean {
  return (
    item.category === "trackers" &&
    item.type === "tracker" &&
    item.metadata.promotedAsSpace !== true &&
    item.metadata.itemRole !== "space"
  );
}

export function normalizeTrackerMetadataForItem(
  item: Pick<MizaanItem, "title" | "status" | "tags" | "metadata">,
): TrackerMetadata {
  return normalizeTrackerMetadata({
    trackerTitle: item.title,
    trackerStatus: item.status,
    tags: item.tags,
    ...item.metadata,
  });
}

export function addTrackerCheckIn(
  metadataInput: unknown,
  input: { date?: string; value?: string | number | null; unit?: string; note?: string },
  options: { id?: string; createdAt?: string } = {},
): TrackerMetadata {
  const metadata = normalizeTrackerMetadata(metadataInput);
  const createdAt = options.createdAt ?? new Date().toISOString();
  const value = normalizeNumber(input.value);
  const checkIn: TrackerCheckIn = {
    id: options.id ?? `check-${createdAt.replace(/[^A-Za-z0-9]/g, "")}`,
    date: normalizeDateString(input.date) || createdAt.slice(0, 10),
    value,
    unit: normalizeString(input.unit) || metadata.unit,
    note: normalizeString(input.note),
    createdAt,
  };

  return normalizeTrackerMetadata({
    ...metadata,
    currentValue: value ?? metadata.currentValue,
    checkIns: [...metadata.checkIns, checkIn],
  });
}

export function normalizeTrackerType(value: unknown): TrackerType {
  return normalizeEnum(toSlug(value), TRACKER_TYPE_VALUES, "habit");
}

export function normalizeTrackerStatus(value: unknown): TrackerStatus {
  return normalizeEnum(toSlug(value), TRACKER_STATUS_VALUES, "not-started");
}

export function normalizeTrackerFrequency(value: unknown): TrackerFrequency {
  return normalizeEnum(toSlug(value), TRACKER_FREQUENCY_VALUES, "custom");
}

export function normalizeTrackerRelationIds(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [];
  return uniqueStrings(
    values.flatMap((entry) => {
      if (typeof entry !== "string") return [];
      const normalized = entry.trim();
      if (!isValidItemId(normalized)) return [];
      return [normalized];
    }),
  );
}

export function getTrackerDisplayFields(metadataInput: unknown) {
  const metadata = normalizeTrackerMetadata(metadataInput);
  return {
    title: metadata.trackerTitle,
    typeLabel: getTrackerTypeLabel(metadata.trackerType),
    statusLabel: getTrackerStatusLabel(metadata.trackerStatus),
    frequencyLabel: getTrackerFrequencyLabel(metadata.frequency),
    progressLabel: formatProgress(metadata),
    targetValue: metadata.targetValue,
    currentValue: metadata.currentValue,
    unit: metadata.unit,
    startDate: metadata.startDate,
    endDate: metadata.endDate,
    notes: metadata.notes,
    checkInCount: metadata.checkIns.length,
    projectCount: metadata.linkedProjectIds.length,
    taskCount: metadata.linkedTaskIds.length,
    personCount: metadata.linkedPersonIds.length,
    documentCount: metadata.linkedDocumentIds.length,
    financeCount: metadata.linkedFinanceIds.length,
    relationCount: getTrackerGraphTargets(metadata).length,
    private: metadata.private,
    sensitive: metadata.sensitive,
  };
}

export function getTrackerStateSummary(metadataInput: unknown) {
  const metadata = normalizeTrackerMetadata(metadataInput);
  return {
    typeLabel: getTrackerTypeLabel(metadata.trackerType),
    statusLabel: getTrackerStatusLabel(metadata.trackerStatus),
    frequencyLabel: getTrackerFrequencyLabel(metadata.frequency),
    progressLabel: formatProgress(metadata),
    progressRatio: computeProgressRatio(metadata.currentValue, metadata.targetValue),
    checkInCount: metadata.checkIns.length,
    relationCount: getTrackerGraphTargets(metadata).length,
    metadataOnlyPrivacy: true,
    private: metadata.private,
    sensitive: metadata.sensitive,
    fakeStreaks: false,
    reminderEngine: false,
  };
}

export function getTrackerPrivacySummary(metadataInput: unknown) {
  const metadata = normalizeTrackerMetadata(metadataInput);
  return {
    private: metadata.private,
    sensitive: metadata.sensitive,
    metadataOnly: true,
    encrypted: false,
    hiddenFromSearch: false,
    hiddenFromGraph: false,
    message:
      "Private and sensitive flags are metadata only in this browser prototype; tracker content is not encrypted, locked, hidden from search, or hidden from graph.",
  };
}

export function getTrackerGraphTargets(metadataInput: unknown): TrackerGraphTarget[] {
  const metadata = normalizeTrackerMetadata(metadataInput);

  return TRACKER_GRAPH_RELATION_FIELDS.flatMap(({ field, edgeType, label }) =>
    metadata[field].map((targetId) => ({
      targetId,
      sourceField: field,
      edgeType,
      label,
    })),
  );
}

export function getTrackerSearchMetadata(metadataInput: unknown) {
  const metadata = normalizeTrackerMetadata(metadataInput);
  return {
    title: metadata.trackerTitle,
    type: [metadata.trackerType, metadata.trackerStatus, metadata.frequency].join(" "),
    progress: [metadata.currentValue, metadata.targetValue, metadata.unit]
      .filter(notBlank)
      .join(" "),
    dates: [metadata.startDate, metadata.endDate].filter(Boolean).join(" "),
    notes: metadata.notes,
    checkIns: metadata.checkIns
      .map((entry) => [entry.date, entry.value, entry.unit, entry.note].filter(notBlank).join(" "))
      .join(" "),
    relations: getTrackerGraphTargets(metadata)
      .map((target) => target.targetId)
      .join(" "),
    privacy: `metadata-only private:${metadata.private} sensitive:${metadata.sensitive}`,
    tags: metadata.tags.join(" "),
  };
}

export function computeTrackerTotals(items: MizaanItem[]): TrackerTotals {
  const records = items
    .filter(
      (candidate) =>
        isTrackerRecordItem(candidate) && !candidate.archivedAt && !candidate.deletedAt,
    )
    .map(normalizeTrackerMetadataForItem);

  return {
    recordCount: records.length,
    activeCount: records.filter((metadata) => metadata.trackerStatus === "active").length,
    pausedCount: records.filter((metadata) => metadata.trackerStatus === "paused").length,
    completedCount: records.filter((metadata) => metadata.trackerStatus === "completed").length,
    archivedCount: records.filter((metadata) => metadata.trackerStatus === "archived").length,
    withTargetCount: records.filter((metadata) => metadata.targetValue !== null).length,
    checkInCount: sumBy(records, (metadata) => metadata.checkIns.length),
    privateFlagCount: records.filter((metadata) => metadata.private).length,
    sensitiveFlagCount: records.filter((metadata) => metadata.sensitive).length,
    invalidNumberCount: records.filter(
      (metadata) => metadata.targetValueInvalid || metadata.currentValueInvalid,
    ).length,
  };
}

export function getTrackerTypeLabel(type: TrackerType): string {
  return TRACKER_TYPE_LABELS[type];
}

export function getTrackerStatusLabel(status: TrackerStatus): string {
  return TRACKER_STATUS_LABELS[status];
}

export function getTrackerFrequencyLabel(frequency: TrackerFrequency): string {
  return TRACKER_FREQUENCY_LABELS[frequency];
}

function formatProgress(metadata: TrackerMetadata) {
  const unit = metadata.unit ? ` ${metadata.unit}` : "";
  if (metadata.currentValue === null && metadata.targetValue === null) return "No value recorded";
  if (metadata.targetValue === null) return `${metadata.currentValue ?? 0}${unit}`;
  return `${metadata.currentValue ?? 0} / ${metadata.targetValue}${unit}`;
}

function computeProgressRatio(current: number | null, target: number | null) {
  if (current === null || target === null || target <= 0) return null;
  return Math.max(0, Math.min(1, current / target));
}

function normalizeCheckIns(value: unknown, fallbackUnit: string): TrackerCheckIn[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const date = normalizeDateString(entry.date);
    const createdAt = normalizeString(entry.createdAt) || `${date}T00:00:00.000Z`;
    if (!date) return [];
    return [
      {
        id: normalizeString(entry.id) || `check-${createdAt.replace(/[^A-Za-z0-9]/g, "")}`,
        date,
        value: normalizeNumber(entry.value),
        unit: normalizeString(entry.unit) || fallbackUnit,
        note: normalizeString(entry.note),
        createdAt,
      },
    ];
  });
}

function normalizeEnum<const T extends readonly string[]>(
  value: string,
  allowed: T,
  fallback: T[number],
): T[number] {
  return allowed.includes(value) ? value : fallback;
}

function normalizeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/,/g, "");
  if (!normalized) return null;
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function isInvalidNumber(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return false;
  return normalizeNumber(value) === null;
}

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value).trim();
  return "";
}

function normalizeDateString(value: unknown): string {
  const normalized = normalizeString(value);
  if (!normalized) return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return uniqueStrings(value.map(normalizeString).filter(Boolean));
}

function normalizeBoolean(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  return false;
}

function uniqueStrings(values: string[]): string[] {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
}

function isValidItemId(value: string): boolean {
  return /^[A-Za-z0-9._:-]+$/.test(value);
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

function toSlug(value: unknown) {
  return normalizeString(value).toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");
}

function sumBy<T>(values: T[], getValue: (value: T) => number) {
  return values.reduce((total, value) => total + getValue(value), 0);
}

function notBlank(value: unknown) {
  return value !== null && value !== undefined && value !== "";
}
