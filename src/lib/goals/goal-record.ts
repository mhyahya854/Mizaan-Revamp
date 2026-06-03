import type { CreateItemInput, MizaanItem, PropertyValue } from "../vault/types";

export const GOAL_STATUS_VALUES = [
  "not-started",
  "active",
  "paused",
  "completed",
  "archived",
] as const;

export type GoalStatus = (typeof GOAL_STATUS_VALUES)[number];

export const GOAL_HORIZON_VALUES = [
  "short-term",
  "medium-term",
  "long-term",
  "lifetime",
  "custom",
] as const;

export type GoalHorizon = (typeof GOAL_HORIZON_VALUES)[number];

export const GOAL_PRIORITY_VALUES = ["none", "low", "medium", "high", "urgent"] as const;

export type GoalPriority = (typeof GOAL_PRIORITY_VALUES)[number];

export interface GoalMetadata extends Record<string, PropertyValue> {
  goalTitle: string;
  goalStatus: GoalStatus;
  goalHorizon: GoalHorizon;
  targetDate: string;
  progressValue: number | null;
  progressValueInvalid: boolean;
  progressUnit: string;
  priority: GoalPriority;
  linkedProjectIds: string[];
  linkedTaskIds: string[];
  linkedTrackerIds: string[];
  linkedPersonIds: string[];
  linkedDocumentIds: string[];
  linkedFinanceIds: string[];
  notes: string;
  private: boolean;
  sensitive: boolean;
  fakeProgressHistory: false;
  reminderEngine: false;
  tags: string[];
}

export interface CreateGoalRecordOptions {
  title?: string;
  status?: GoalStatus | string;
  horizon?: GoalHorizon | string;
  targetDate?: string;
  progressValue?: string | number | null;
  progressUnit?: string;
  priority?: GoalPriority | string;
  linkedProjectIds?: string[];
  linkedTaskIds?: string[];
  linkedTrackerIds?: string[];
  linkedPersonIds?: string[];
  linkedDocumentIds?: string[];
  linkedFinanceIds?: string[];
  notes?: string;
  private?: boolean;
  sensitive?: boolean;
  tags?: string[];
  parentId?: string;
}

export interface GoalGraphTarget {
  targetId: string;
  sourceField:
    | "linkedProjectIds"
    | "linkedTaskIds"
    | "linkedTrackerIds"
    | "linkedPersonIds"
    | "linkedDocumentIds"
    | "linkedFinanceIds";
  edgeType:
    | "project-link"
    | "task-link"
    | "tracker-link"
    | "person-link"
    | "document-link"
    | "finance-link";
  label: string;
}

export interface GoalTotals {
  recordCount: number;
  activeCount: number;
  pausedCount: number;
  completedCount: number;
  archivedCount: number;
  overdueCount: number;
  highPriorityCount: number;
  privateFlagCount: number;
  sensitiveFlagCount: number;
  invalidProgressCount: number;
}

const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  "not-started": "Not started",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
};

const GOAL_HORIZON_LABELS: Record<GoalHorizon, string> = {
  "short-term": "Short-term",
  "medium-term": "Medium-term",
  "long-term": "Long-term",
  lifetime: "Lifetime",
  custom: "Custom",
};

const GOAL_PRIORITY_LABELS: Record<GoalPriority, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const GOAL_GRAPH_RELATION_FIELDS: Array<{
  field: GoalGraphTarget["sourceField"];
  edgeType: GoalGraphTarget["edgeType"];
  label: string;
}> = [
  { field: "linkedProjectIds", edgeType: "project-link", label: "Linked project" },
  { field: "linkedTaskIds", edgeType: "task-link", label: "Linked task" },
  { field: "linkedTrackerIds", edgeType: "tracker-link", label: "Linked tracker" },
  { field: "linkedPersonIds", edgeType: "person-link", label: "Linked person" },
  { field: "linkedDocumentIds", edgeType: "document-link", label: "Linked document" },
  { field: "linkedFinanceIds", edgeType: "finance-link", label: "Linked finance" },
];

export function createDefaultGoalMetadata(input: Record<string, unknown> = {}): GoalMetadata {
  return normalizeGoalMetadata({
    goalTitle: "Untitled goal",
    goalStatus: "not-started",
    goalHorizon: "short-term",
    targetDate: "",
    progressValue: null,
    progressValueInvalid: false,
    progressUnit: "",
    priority: "none",
    linkedProjectIds: [],
    linkedTaskIds: [],
    linkedTrackerIds: [],
    linkedPersonIds: [],
    linkedDocumentIds: [],
    linkedFinanceIds: [],
    notes: "",
    private: false,
    sensitive: false,
    fakeProgressHistory: false,
    reminderEngine: false,
    tags: [],
    ...input,
  });
}

export function normalizeGoalMetadata(input: unknown): GoalMetadata {
  const source = isRecord(input) ? input : {};
  const normalized: Record<string, PropertyValue> = {};

  for (const [key, value] of Object.entries(source)) {
    const safeValue = toPropertyValue(value);
    if (safeValue !== undefined) normalized[key] = safeValue;
  }

  const progressValue = normalizeNumber(source.progressValue);
  const progressValueInvalid =
    source.progressValue === undefined ||
    source.progressValue === null ||
    source.progressValue === ""
      ? normalizeBoolean(source.progressValueInvalid)
      : isInvalidNumber(source.progressValue);

  return {
    ...normalized,
    goalTitle: normalizeString(source.goalTitle) || "Untitled goal",
    goalStatus:
      source.goalStatus === undefined ? "not-started" : normalizeGoalStatus(source.goalStatus),
    goalHorizon:
      source.goalHorizon === undefined ? "short-term" : normalizeGoalHorizon(source.goalHorizon),
    targetDate: normalizeDateString(source.targetDate),
    progressValue,
    progressValueInvalid,
    progressUnit: normalizeString(source.progressUnit),
    priority: source.priority === undefined ? "none" : normalizeGoalPriority(source.priority),
    linkedProjectIds: normalizeGoalRelationIds(source.linkedProjectIds),
    linkedTaskIds: normalizeGoalRelationIds(source.linkedTaskIds),
    linkedTrackerIds: normalizeGoalRelationIds(source.linkedTrackerIds),
    linkedPersonIds: normalizeGoalRelationIds(source.linkedPersonIds),
    linkedDocumentIds: normalizeGoalRelationIds(source.linkedDocumentIds),
    linkedFinanceIds: normalizeGoalRelationIds(source.linkedFinanceIds),
    notes: normalizeString(source.notes),
    private: normalizeBoolean(source.private),
    sensitive: normalizeBoolean(source.sensitive),
    fakeProgressHistory: false,
    reminderEngine: false,
    tags: normalizeStringArray(source.tags),
  };
}

export function updateGoalMetadata(current: unknown, patch: Record<string, unknown>): GoalMetadata {
  return normalizeGoalMetadata({ ...normalizeGoalMetadata(current), ...patch });
}

export function createGoalRecordInput(options: CreateGoalRecordOptions = {}): CreateItemInput {
  const title = normalizeString(options.title) || "Untitled goal";
  const horizon = normalizeGoalHorizon(options.horizon ?? "short-term");
  const tags = uniqueStrings(["goal", horizon, ...(options.tags ?? [])]);
  const metadata = createDefaultGoalMetadata({
    goalTitle: title,
    goalStatus: options.status ?? "not-started",
    goalHorizon: horizon,
    targetDate: options.targetDate ?? "",
    progressValue: options.progressValue ?? null,
    progressUnit: options.progressUnit ?? "",
    priority: options.priority ?? "none",
    linkedProjectIds: options.linkedProjectIds ?? [],
    linkedTaskIds: options.linkedTaskIds ?? [],
    linkedTrackerIds: options.linkedTrackerIds ?? [],
    linkedPersonIds: options.linkedPersonIds ?? [],
    linkedDocumentIds: options.linkedDocumentIds ?? [],
    linkedFinanceIds: options.linkedFinanceIds ?? [],
    notes: options.notes ?? "",
    private: options.private ?? false,
    sensitive: options.sensitive ?? false,
    tags,
  });

  return {
    title: metadata.goalTitle,
    category: "goals",
    type: "goal",
    icon: "G",
    summary: metadata.notes || "Provider-backed local goal metadata record.",
    status: getGoalStatusLabel(metadata.goalStatus),
    tags,
    parentId: options.parentId,
    properties: {
      status: getGoalStatusLabel(metadata.goalStatus),
      horizon: getGoalHorizonLabel(metadata.goalHorizon),
      targetDate: metadata.targetDate,
      progressValue: metadata.progressValue,
      progressUnit: metadata.progressUnit,
      priority: getGoalPriorityLabel(metadata.priority),
      private: metadata.private,
      sensitive: metadata.sensitive,
    },
    attachedFiles: [],
    metadata,
  };
}

export function isGoalRecordItem(
  item: Pick<MizaanItem, "category" | "type" | "metadata">,
): boolean {
  return (
    item.category === "goals" &&
    item.type === "goal" &&
    item.metadata.promotedAsSpace !== true &&
    item.metadata.itemRole !== "space"
  );
}

export function normalizeGoalMetadataForItem(
  item: Pick<MizaanItem, "title" | "status" | "tags" | "metadata">,
): GoalMetadata {
  return normalizeGoalMetadata({
    goalTitle: item.title,
    goalStatus: item.status,
    tags: item.tags,
    ...item.metadata,
  });
}

export function normalizeGoalStatus(value: unknown): GoalStatus {
  return normalizeEnum(toSlug(value), GOAL_STATUS_VALUES, "not-started");
}

export function normalizeGoalHorizon(value: unknown): GoalHorizon {
  return normalizeEnum(toSlug(value), GOAL_HORIZON_VALUES, "custom");
}

export function normalizeGoalPriority(value: unknown): GoalPriority {
  return normalizeEnum(toSlug(value), GOAL_PRIORITY_VALUES, "none");
}

export function normalizeGoalRelationIds(value: unknown): string[] {
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

export function getGoalDisplayFields(metadataInput: unknown) {
  const metadata = normalizeGoalMetadata(metadataInput);
  return {
    title: metadata.goalTitle,
    statusLabel: getGoalStatusLabel(metadata.goalStatus),
    horizonLabel: getGoalHorizonLabel(metadata.goalHorizon),
    priorityLabel: getGoalPriorityLabel(metadata.priority),
    progressLabel: formatProgress(metadata),
    targetDate: metadata.targetDate,
    progressValue: metadata.progressValue,
    progressUnit: metadata.progressUnit,
    notes: metadata.notes,
    projectCount: metadata.linkedProjectIds.length,
    taskCount: metadata.linkedTaskIds.length,
    trackerCount: metadata.linkedTrackerIds.length,
    personCount: metadata.linkedPersonIds.length,
    documentCount: metadata.linkedDocumentIds.length,
    financeCount: metadata.linkedFinanceIds.length,
    relationCount: getGoalGraphTargets(metadata).length,
    private: metadata.private,
    sensitive: metadata.sensitive,
  };
}

export function getGoalStateSummary(metadataInput: unknown, today?: string) {
  const metadata = normalizeGoalMetadata(metadataInput);
  return {
    statusLabel: getGoalStatusLabel(metadata.goalStatus),
    horizonLabel: getGoalHorizonLabel(metadata.goalHorizon),
    priorityLabel: getGoalPriorityLabel(metadata.priority),
    progressLabel: formatProgress(metadata),
    overdue: isGoalOverdue(metadata, today),
    relationCount: getGoalGraphTargets(metadata).length,
    metadataOnlyPrivacy: true,
    private: metadata.private,
    sensitive: metadata.sensitive,
    fakeProgressHistory: false,
    reminderEngine: false,
  };
}

export function getGoalPrivacySummary(metadataInput: unknown) {
  const metadata = normalizeGoalMetadata(metadataInput);
  return {
    private: metadata.private,
    sensitive: metadata.sensitive,
    metadataOnly: true,
    encrypted: false,
    hiddenFromSearch: false,
    hiddenFromGraph: false,
    message:
      "Private and sensitive flags are metadata only in this browser prototype; goal content is not encrypted, locked, hidden from search, or hidden from graph.",
  };
}

export function getGoalGraphTargets(metadataInput: unknown): GoalGraphTarget[] {
  const metadata = normalizeGoalMetadata(metadataInput);

  return GOAL_GRAPH_RELATION_FIELDS.flatMap(({ field, edgeType, label }) =>
    metadata[field].map((targetId) => ({
      targetId,
      sourceField: field,
      edgeType,
      label,
    })),
  );
}

export function getGoalSearchMetadata(metadataInput: unknown) {
  const metadata = normalizeGoalMetadata(metadataInput);
  return {
    title: metadata.goalTitle,
    type: [metadata.goalStatus, metadata.goalHorizon, metadata.priority].join(" "),
    progress: [metadata.progressValue, metadata.progressUnit].filter(notBlank).join(" "),
    dates: metadata.targetDate,
    notes: metadata.notes,
    relations: getGoalGraphTargets(metadata)
      .map((target) => target.targetId)
      .join(" "),
    privacy: `metadata-only private:${metadata.private} sensitive:${metadata.sensitive}`,
    tags: metadata.tags.join(" "),
  };
}

export function computeGoalTotals(items: MizaanItem[], today?: string): GoalTotals {
  const records = items
    .filter(
      (candidate) => isGoalRecordItem(candidate) && !candidate.archivedAt && !candidate.deletedAt,
    )
    .map(normalizeGoalMetadataForItem);

  return {
    recordCount: records.length,
    activeCount: records.filter((metadata) => metadata.goalStatus === "active").length,
    pausedCount: records.filter((metadata) => metadata.goalStatus === "paused").length,
    completedCount: records.filter((metadata) => metadata.goalStatus === "completed").length,
    archivedCount: records.filter((metadata) => metadata.goalStatus === "archived").length,
    overdueCount: records.filter((metadata) => isGoalOverdue(metadata, today)).length,
    highPriorityCount: records.filter(
      (metadata) => metadata.priority === "high" || metadata.priority === "urgent",
    ).length,
    privateFlagCount: records.filter((metadata) => metadata.private).length,
    sensitiveFlagCount: records.filter((metadata) => metadata.sensitive).length,
    invalidProgressCount: records.filter((metadata) => metadata.progressValueInvalid).length,
  };
}

export function isGoalOverdue(metadataInput: unknown, today?: string): boolean {
  const metadata = normalizeGoalMetadata(metadataInput);
  if (!metadata.targetDate) return false;
  if (metadata.goalStatus === "completed" || metadata.goalStatus === "archived") return false;
  const currentDate = normalizeDateString(today) || new Date().toISOString().slice(0, 10);
  return metadata.targetDate < currentDate;
}

export function getGoalStatusLabel(status: GoalStatus): string {
  return GOAL_STATUS_LABELS[status];
}

export function getGoalHorizonLabel(horizon: GoalHorizon): string {
  return GOAL_HORIZON_LABELS[horizon];
}

export function getGoalPriorityLabel(priority: GoalPriority): string {
  return GOAL_PRIORITY_LABELS[priority];
}

function formatProgress(metadata: GoalMetadata) {
  if (metadata.progressValue === null) return "No progress recorded";
  const unit = metadata.progressUnit ? ` ${metadata.progressUnit}` : "";
  return `${metadata.progressValue}${unit}`;
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

function notBlank(value: unknown) {
  return value !== null && value !== undefined && value !== "";
}
