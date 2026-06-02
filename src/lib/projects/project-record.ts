import type { CreateItemInput, MizaanItem, PropertyValue } from "../vault/types";

export const PROJECT_STATUS_VALUES = [
  "planning",
  "active",
  "paused",
  "blocked",
  "completed",
  "archived",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_VALUES)[number];

export const PROJECT_PRIORITY_VALUES = ["none", "low", "medium", "high", "urgent"] as const;

export type ProjectPriority = (typeof PROJECT_PRIORITY_VALUES)[number];

export interface ProjectMetadata extends Record<string, PropertyValue> {
  projectTitle: string;
  projectStatus: ProjectStatus;
  projectPriority: ProjectPriority;
  projectOwner: string;
  projectStartDate: string;
  projectDeadline: string;
  projectArea: string;
  projectDescription: string;
  category: "projects";
  notes: string;
  linkedTaskIds: string[];
  linkedDocumentIds: string[];
  linkedPersonIds: string[];
  linkedFinanceIds: string[];
  linkedCalendarEventIds: string[];
  linkedGoalIds: string[];
}

export interface CreateProjectRecordOptions {
  title?: string;
  status?: ProjectStatus | string;
  priority?: ProjectPriority | string;
  owner?: string;
  startDate?: string;
  deadline?: string;
  area?: string;
  description?: string;
  tags?: string[];
  notes?: string;
  parentId?: string;
}

export interface ProjectGraphRelationTarget {
  targetId: string;
  sourceField:
    | "linkedTaskIds"
    | "linkedDocumentIds"
    | "linkedPersonIds"
    | "linkedFinanceIds"
    | "linkedCalendarEventIds"
    | "linkedGoalIds";
  edgeType:
    | "task-link"
    | "document-link"
    | "person-link"
    | "finance-link"
    | "calendar-link"
    | "goal-link";
  label: string;
}

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  paused: "Paused",
  blocked: "Blocked",
  completed: "Completed",
  archived: "Archived",
};

const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const PROJECT_GRAPH_RELATION_FIELDS: Array<{
  field: ProjectGraphRelationTarget["sourceField"];
  edgeType: ProjectGraphRelationTarget["edgeType"];
  label: string;
}> = [
  { field: "linkedTaskIds", edgeType: "task-link", label: "Linked task" },
  { field: "linkedDocumentIds", edgeType: "document-link", label: "Linked document" },
  { field: "linkedPersonIds", edgeType: "person-link", label: "Linked person" },
  { field: "linkedFinanceIds", edgeType: "finance-link", label: "Linked finance" },
  {
    field: "linkedCalendarEventIds",
    edgeType: "calendar-link",
    label: "Linked calendar event",
  },
  { field: "linkedGoalIds", edgeType: "goal-link", label: "Linked goal" },
];

export function createDefaultProjectMetadata(input: Record<string, unknown> = {}): ProjectMetadata {
  return normalizeProjectMetadata({
    projectTitle: "Untitled project",
    projectStatus: "planning",
    projectPriority: "none",
    projectOwner: "",
    projectStartDate: "",
    projectDeadline: "",
    projectArea: "",
    projectDescription: "",
    category: "projects",
    notes: "",
    linkedTaskIds: [],
    linkedDocumentIds: [],
    linkedPersonIds: [],
    linkedFinanceIds: [],
    linkedCalendarEventIds: [],
    linkedGoalIds: [],
    ...input,
  });
}

export function normalizeProjectMetadata(input: unknown): ProjectMetadata {
  const source = isRecord(input) ? input : {};
  const normalized: Record<string, PropertyValue> = {};

  for (const [key, value] of Object.entries(source)) {
    const safeValue = toPropertyValue(value);
    if (safeValue !== undefined) normalized[key] = safeValue;
  }

  const rawTitle = normalizeString(source.projectTitle);

  return {
    ...normalized,
    projectTitle: rawTitle || "Untitled project",
    projectStatus:
      source.projectStatus === undefined
        ? "planning"
        : normalizeProjectStatus(source.projectStatus),
    projectPriority:
      source.projectPriority === undefined
        ? "none"
        : normalizeProjectPriority(source.projectPriority),
    projectOwner: normalizeString(source.projectOwner),
    projectStartDate: normalizeDateString(source.projectStartDate),
    projectDeadline: normalizeDateString(source.projectDeadline),
    projectArea: normalizeString(source.projectArea),
    projectDescription: normalizeString(source.projectDescription),
    category: "projects",
    notes: normalizeString(source.notes),
    linkedTaskIds: normalizeProjectRelationIds(source.linkedTaskIds),
    linkedDocumentIds: normalizeProjectRelationIds(source.linkedDocumentIds),
    linkedPersonIds: normalizeProjectRelationIds(source.linkedPersonIds),
    linkedFinanceIds: normalizeProjectRelationIds(source.linkedFinanceIds),
    linkedCalendarEventIds: normalizeProjectRelationIds(source.linkedCalendarEventIds),
    linkedGoalIds: normalizeProjectRelationIds(source.linkedGoalIds),
  };
}

export function updateProjectMetadata(
  current: unknown,
  patch: Record<string, unknown>,
): ProjectMetadata {
  const currentMetadata = normalizeProjectMetadata(current);
  return normalizeProjectMetadata({ ...currentMetadata, ...patch });
}

export function createProjectRecordInput(
  options: CreateProjectRecordOptions = {},
): CreateItemInput {
  const title = normalizeString(options.title) || "Untitled project";
  const tags = uniqueStrings(["project", ...(options.tags ?? [])]);
  const metadata = createDefaultProjectMetadata({
    projectTitle: title,
    projectStatus: options.status ?? "planning",
    projectPriority: options.priority ?? "none",
    projectOwner: options.owner ?? "",
    projectStartDate: options.startDate ?? "",
    projectDeadline: options.deadline ?? "",
    projectArea: options.area ?? "",
    projectDescription: options.description ?? "",
    notes: options.notes ?? "",
  });

  return {
    title,
    category: "projects",
    type: "project",
    icon: "P",
    summary: metadata.projectDescription || "Local project record with provider-backed metadata.",
    status: getProjectStatusLabel(metadata.projectStatus),
    tags,
    parentId: options.parentId,
    properties: {
      status: getProjectStatusLabel(metadata.projectStatus),
      priority: getProjectPriorityLabel(metadata.projectPriority),
      deadline: metadata.projectDeadline,
      area: metadata.projectArea,
    },
    attachedFiles: [],
    metadata,
  };
}

export function isProjectRecordItem(
  item: Pick<MizaanItem, "category" | "type" | "metadata">,
): boolean {
  return (
    item.category === "projects" &&
    item.type === "project" &&
    item.metadata.promotedAsSpace !== true &&
    item.metadata.itemRole !== "space"
  );
}

export function normalizeProjectMetadataForItem(
  item: Pick<MizaanItem, "title" | "status" | "tags" | "metadata">,
): ProjectMetadata {
  return normalizeProjectMetadata({
    projectTitle: item.title,
    projectStatus: item.status,
    tags: item.tags,
    ...item.metadata,
  });
}

export function normalizeProjectStatus(value: unknown): ProjectStatus {
  const normalized = normalizeString(value).toLowerCase();
  if (normalized === "in-progress" || normalized === "in progress") return "active";
  return normalizeEnum(value, PROJECT_STATUS_VALUES, "planning");
}

export function normalizeProjectPriority(value: unknown): ProjectPriority {
  return normalizeEnum(value, PROJECT_PRIORITY_VALUES, "none");
}

export function normalizeProjectRelationIds(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [];
  return uniqueStrings(
    values.flatMap((entry) => {
      const normalized = normalizeString(entry);
      if (!isValidItemId(normalized)) return [];
      return [normalized];
    }),
  );
}

export function getProjectDisplayFields(metadataInput: unknown) {
  const metadata = normalizeProjectMetadata(metadataInput);
  return {
    title: metadata.projectTitle,
    statusLabel: getProjectStatusLabel(metadata.projectStatus),
    priorityLabel: getProjectPriorityLabel(metadata.projectPriority),
    owner: metadata.projectOwner,
    area: metadata.projectArea,
    startDate: metadata.projectStartDate,
    deadline: metadata.projectDeadline,
    description: metadata.projectDescription,
    notes: metadata.notes,
    taskCount: metadata.linkedTaskIds.length,
    documentCount: metadata.linkedDocumentIds.length,
    personCount: metadata.linkedPersonIds.length,
    financeCount: metadata.linkedFinanceIds.length,
    calendarEventCount: metadata.linkedCalendarEventIds.length,
    goalCount: metadata.linkedGoalIds.length,
    relationCount: getProjectGraphRelationTargets(metadata).length,
  };
}

export function getProjectStateSummary(
  metadataInput: unknown,
  linkedTasks: Array<Pick<MizaanItem, "id" | "status" | "metadata">> = [],
) {
  const metadata = normalizeProjectMetadata(metadataInput);
  const linkedTaskIds = new Set(metadata.linkedTaskIds);
  const realLinkedTasks = linkedTasks.filter((task) => linkedTaskIds.has(task.id));
  const completedTaskCount = realLinkedTasks.filter(isCompletedTaskItem).length;
  const hasComputedProgress = realLinkedTasks.length > 0;

  return {
    statusLabel: getProjectStatusLabel(metadata.projectStatus),
    priorityLabel: getProjectPriorityLabel(metadata.projectPriority),
    linkedTaskCount: metadata.linkedTaskIds.length,
    completedTaskCount,
    relationCount: getProjectGraphRelationTargets(metadata).length,
    hasComputedProgress,
    completionPercent: hasComputedProgress
      ? Math.round((completedTaskCount / realLinkedTasks.length) * 100)
      : null,
  };
}

export function getProjectGraphRelationTargets(
  metadataInput: unknown,
): ProjectGraphRelationTarget[] {
  const metadata = normalizeProjectMetadata(metadataInput);

  return PROJECT_GRAPH_RELATION_FIELDS.flatMap(({ field, edgeType, label }) =>
    metadata[field].map((targetId) => ({
      targetId,
      sourceField: field,
      edgeType,
      label,
    })),
  );
}

export function getProjectStatusLabel(status: ProjectStatus): string {
  return PROJECT_STATUS_LABELS[status];
}

export function getProjectPriorityLabel(priority: ProjectPriority): string {
  return PROJECT_PRIORITY_LABELS[priority];
}

function isCompletedTaskItem(task: Pick<MizaanItem, "status" | "metadata">): boolean {
  const metadataStatus = isRecord(task.metadata) ? normalizeString(task.metadata.taskStatus) : "";
  return metadataStatus === "done" || normalizeString(task.status).toLowerCase() === "done";
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

function normalizeDateString(value: unknown): string {
  const normalized = normalizeString(value);
  if (!normalized) return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
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
