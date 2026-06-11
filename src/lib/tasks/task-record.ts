import type { CreateItemInput, MizaanItem, PropertyValue } from "../vault/types";

export const TASK_STATUS_VALUES = [
  "todo",
  "in-progress",
  "waiting",
  "blocked",
  "done",
  "archived",
] as const;

export type TaskStatus = (typeof TASK_STATUS_VALUES)[number];

export const TASK_PRIORITY_VALUES = ["none", "low", "medium", "high", "urgent"] as const;

export type TaskPriority = (typeof TASK_PRIORITY_VALUES)[number];

export interface TaskMetadata extends Record<string, PropertyValue> {
  taskTitle: string;
  taskStatus: TaskStatus;
  taskPriority: TaskPriority;
  taskStartDate: string;
  taskDueDate: string;
  taskCompletedAt: string;
  taskProjectId: string;
  category: "tasks";
  notes: string;
  linkedPageIds: string[];
  linkedDocumentIds: string[];
  linkedPersonIds: string[];
  linkedFinanceIds: string[];
  linkedCalendarEventIds: string[];
}

export interface CreateTaskRecordOptions {
  title?: string;
  status?: TaskStatus | string;
  priority?: TaskPriority | string;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  projectId?: string;
  tags?: string[];
  notes?: string;
}

export interface TaskGraphRelationTarget {
  targetId: string;
  sourceField:
    | "taskProjectId"
    | "linkedPageIds"
    | "linkedDocumentIds"
    | "linkedPersonIds"
    | "linkedFinanceIds"
    | "linkedCalendarEventIds";
  edgeType:
    | "project-link"
    | "page-link"
    | "document-link"
    | "person-link"
    | "finance-link"
    | "calendar-link";
  label: string;
}

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  "in-progress": "In progress",
  waiting: "Waiting",
  blocked: "Blocked",
  done: "Done",
  archived: "Archived",
};

const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const TASK_GRAPH_RELATION_FIELDS: Array<{
  field: Exclude<TaskGraphRelationTarget["sourceField"], "taskProjectId">;
  edgeType: TaskGraphRelationTarget["edgeType"];
  label: string;
}> = [
  { field: "linkedPageIds", edgeType: "page-link", label: "Linked page" },
  { field: "linkedDocumentIds", edgeType: "document-link", label: "Linked document" },
  { field: "linkedPersonIds", edgeType: "person-link", label: "Linked person" },
  { field: "linkedFinanceIds", edgeType: "finance-link", label: "Linked finance" },
  {
    field: "linkedCalendarEventIds",
    edgeType: "calendar-link",
    label: "Linked calendar event",
  },
];

export function createDefaultTaskMetadata(input: Record<string, unknown> = {}): TaskMetadata {
  return normalizeTaskMetadata({
    taskTitle: "Untitled task",
    taskStatus: "todo",
    taskPriority: "none",
    taskStartDate: "",
    taskDueDate: "",
    taskCompletedAt: "",
    taskProjectId: "",
    category: "tasks",
    notes: "",
    linkedPageIds: [],
    linkedDocumentIds: [],
    linkedPersonIds: [],
    linkedFinanceIds: [],
    linkedCalendarEventIds: [],
    ...input,
  });
}

export function normalizeTaskMetadata(input: unknown): TaskMetadata {
  const source = isRecord(input) ? input : {};
  const normalized: Record<string, PropertyValue> = {};

  for (const [key, value] of Object.entries(source)) {
    const safeValue = toPropertyValue(value);
    if (safeValue !== undefined) normalized[key] = safeValue;
  }

  const rawTitle = normalizeString(source.taskTitle);

  return {
    ...normalized,
    taskTitle: rawTitle || "Untitled task",
    taskStatus: source.taskStatus === undefined ? "todo" : normalizeTaskStatus(source.taskStatus),
    taskPriority:
      source.taskPriority === undefined ? "none" : normalizeTaskPriority(source.taskPriority),
    taskStartDate: normalizeDateString(source.taskStartDate),
    taskDueDate: normalizeDateString(source.taskDueDate),
    taskCompletedAt: normalizeDateString(source.taskCompletedAt),
    taskProjectId: normalizeTaskProjectId(source.taskProjectId),
    category: "tasks",
    notes: normalizeString(source.notes),
    linkedPageIds: normalizeTaskRelationIds(source.linkedPageIds),
    linkedDocumentIds: normalizeTaskRelationIds(source.linkedDocumentIds),
    linkedPersonIds: normalizeTaskRelationIds(source.linkedPersonIds),
    linkedFinanceIds: normalizeTaskRelationIds(source.linkedFinanceIds),
    linkedCalendarEventIds: normalizeTaskRelationIds(source.linkedCalendarEventIds),
  };
}

export function updateTaskMetadata(current: unknown, patch: Record<string, unknown>): TaskMetadata {
  const currentMetadata = normalizeTaskMetadata(current);
  return normalizeTaskMetadata({ ...currentMetadata, ...patch });
}

export function createTaskRecordInput(options: CreateTaskRecordOptions = {}): CreateItemInput {
  const title = normalizeString(options.title) || "Untitled task";
  const tags = uniqueStrings(["task", ...(options.tags ?? [])]);
  const metadata = createDefaultTaskMetadata({
    taskTitle: title,
    taskStatus: options.status ?? "todo",
    taskPriority: options.priority ?? "none",
    taskStartDate: options.startDate ?? "",
    taskDueDate: options.dueDate ?? "",
    taskCompletedAt: options.completedAt ?? "",
    taskProjectId: options.projectId ?? "",
    notes: options.notes ?? "",
  });

  return {
    title,
    category: "tasks",
    type: "task",
    icon: "T",
    summary: metadata.notes || "Local task record with provider-backed metadata.",
    status: getTaskStatusLabel(metadata.taskStatus),
    tags,
    parentId: metadata.taskProjectId || undefined,
    properties: {
      status: getTaskStatusLabel(metadata.taskStatus),
      priority: getTaskPriorityLabel(metadata.taskPriority),
      dueDate: metadata.taskDueDate,
      projectId: metadata.taskProjectId,
    },
    attachedFiles: [],
    metadata,
  };
}

export function isTaskRecordItem(item: Pick<MizaanItem, "category" | "type">): boolean {
  return item.category === "tasks" && item.type === "task";
}

export function normalizeTaskMetadataForItem(
  item: Pick<MizaanItem, "title" | "status" | "tags" | "metadata" | "parentId">,
): TaskMetadata {
  return normalizeTaskMetadata({
    taskTitle: item.title,
    taskStatus: item.status,
    tags: item.tags,
    taskProjectId: item.parentId,
    ...item.metadata,
  });
}

export function normalizeTaskStatus(value: unknown): TaskStatus {
  return normalizeEnum(value, TASK_STATUS_VALUES, "todo");
}

export function normalizeTaskPriority(value: unknown): TaskPriority {
  return normalizeEnum(value, TASK_PRIORITY_VALUES, "none");
}

export function normalizeTaskProjectId(value: unknown): string {
  const normalized = normalizeString(value);
  return isValidItemId(normalized) ? normalized : "";
}

export function normalizeTaskRelationIds(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [];
  return uniqueStrings(
    values.flatMap((entry) => {
      const normalized = normalizeString(entry);
      if (!isValidItemId(normalized)) return [];
      return [normalized];
    }),
  );
}

export function getTaskDisplayFields(metadataInput: unknown) {
  const metadata = normalizeTaskMetadata(metadataInput);
  return {
    title: metadata.taskTitle,
    statusLabel: getTaskStatusLabel(metadata.taskStatus),
    priorityLabel: getTaskPriorityLabel(metadata.taskPriority),
    startDate: metadata.taskStartDate,
    dueDate: metadata.taskDueDate,
    completedAt: metadata.taskCompletedAt,
    projectId: metadata.taskProjectId,
    notes: metadata.notes,
    relationCount: getTaskGraphRelationTargets(metadata).length,
  };
}

export function getTaskStateSummary(metadataInput: unknown, today?: string) {
  const metadata = normalizeTaskMetadata(metadataInput);
  return {
    statusLabel: getTaskStatusLabel(metadata.taskStatus),
    priorityLabel: getTaskPriorityLabel(metadata.taskPriority),
    completed: isTaskCompleted(metadata),
    overdue: isTaskOverdue(metadata, today),
    relationCount: getTaskGraphRelationTargets(metadata).length,
  };
}

export function computeTaskTotals(
  items: Array<Pick<MizaanItem, "title" | "status" | "tags" | "metadata" | "parentId">>,
  today?: string,
) {
  const byStatus = TASK_STATUS_VALUES.reduce(
    (counts, status) => {
      counts[status] = 0;
      return counts;
    },
    {} as Record<TaskStatus, number>,
  );

  let linkedProjectCount = 0;
  let unlinkedCount = 0;
  let activeCount = 0;
  let completedCount = 0;
  let overdueCount = 0;
  let highPriorityCount = 0;

  for (const item of items) {
    const metadata = normalizeTaskMetadataForItem(item);
    byStatus[metadata.taskStatus] += 1;
    if (metadata.taskProjectId) linkedProjectCount += 1;
    else unlinkedCount += 1;
    if (metadata.taskStatus !== "done" && metadata.taskStatus !== "archived") activeCount += 1;
    if (isTaskCompleted(metadata)) completedCount += 1;
    if (isTaskOverdue(metadata, today)) overdueCount += 1;
    if (metadata.taskPriority === "high" || metadata.taskPriority === "urgent") {
      highPriorityCount += 1;
    }
  }

  return {
    recordCount: items.length,
    linkedProjectCount,
    unlinkedCount,
    activeCount,
    completedCount,
    overdueCount,
    highPriorityCount,
    byStatus,
  };
}

export function isTaskCompleted(metadataInput: unknown): boolean {
  const metadata = normalizeTaskMetadata(metadataInput);
  return metadata.taskStatus === "done" || Boolean(metadata.taskCompletedAt);
}

export function isTaskOverdue(metadataInput: unknown, today?: string): boolean {
  const metadata = normalizeTaskMetadata(metadataInput);
  if (isTaskCompleted(metadata)) return false;
  if (!metadata.taskDueDate) return false;

  const currentDate = normalizeDateString(today) || new Date().toISOString().slice(0, 10);
  return metadata.taskDueDate < currentDate;
}

export function getTaskGraphRelationTargets(metadataInput: unknown): TaskGraphRelationTarget[] {
  const metadata = normalizeTaskMetadata(metadataInput);
  const projectTarget: TaskGraphRelationTarget[] = metadata.taskProjectId
    ? [
        {
          targetId: metadata.taskProjectId,
          sourceField: "taskProjectId",
          edgeType: "project-link",
          label: "Project",
        },
      ]
    : [];

  return [
    ...projectTarget,
    ...TASK_GRAPH_RELATION_FIELDS.flatMap(({ field, edgeType, label }) =>
      metadata[field].map((targetId) => ({
        targetId,
        sourceField: field,
        edgeType,
        label,
      })),
    ),
  ];
}

export function getTaskStatusLabel(status: TaskStatus): string {
  return TASK_STATUS_LABELS[status];
}

export function getTaskPriorityLabel(priority: TaskPriority): string {
  return TASK_PRIORITY_LABELS[priority];
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
