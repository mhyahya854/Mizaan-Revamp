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

export const TASK_RECURRENCE_VALUES = [
  "none",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "custom",
] as const;

export type TaskRecurrence = (typeof TASK_RECURRENCE_VALUES)[number];

export interface TaskMetadata extends Record<string, PropertyValue> {
  taskTitle: string;
  taskStatus: TaskStatus;
  taskPriority: TaskPriority;
  taskStartDate: string;
  taskDueDate: string;
  taskCompletedAt: string;
  taskProjectId: string;
  taskRecurrence: TaskRecurrence;
  taskRecurrenceAnchorDate: string;
  taskRecurrenceEndsOn: string;
  taskRecurrenceNote: string;
  taskReminderDate: string;
  taskReminderTime: string;
  taskReminderNote: string;
  recurrenceEngine: false;
  reminderEngine: false;
  nativeNotificationEngine: false;
  calendarSchedulingEngine: false;
  category: "tasks";
  notes: string;
  linkedPageIds: string[];
  linkedDocumentIds: string[];
  linkedPersonIds: string[];
  linkedFinanceIds: string[];
  linkedCalendarEventIds: string[];
  dependsOnTaskIds: string[];
  blockingTaskIds: string[];
}

export interface CreateTaskRecordOptions {
  title?: string;
  status?: TaskStatus | string;
  priority?: TaskPriority | string;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  projectId?: string;
  recurrence?: TaskRecurrence | string;
  recurrenceAnchorDate?: string;
  recurrenceEndsOn?: string;
  recurrenceNote?: string;
  reminderDate?: string;
  reminderTime?: string;
  reminderNote?: string;
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
    | "linkedCalendarEventIds"
    | "dependsOnTaskIds"
    | "blockingTaskIds";
  edgeType:
    | "project-link"
    | "page-link"
    | "document-link"
    | "person-link"
    | "finance-link"
    | "calendar-link"
    | "task-dependency"
    | "task-blocker";
  label: string;
}

export type TaskTimelineBucket = "Scheduled" | "Overdue" | "Completed" | "Unscheduled";

export interface TaskTimelineEntry<T> {
  item: T;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string;
  endDate: string;
  dueDate: string;
  completedAt: string;
  projectId: string;
  durationDays: number;
  hasSchedule: boolean;
  completed: boolean;
  overdue: boolean;
  bucket: TaskTimelineBucket;
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

const TASK_RECURRENCE_LABELS: Record<TaskRecurrence, string> = {
  none: "None",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
  custom: "Custom",
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
  { field: "dependsOnTaskIds", edgeType: "task-dependency", label: "Depends on task" },
  { field: "blockingTaskIds", edgeType: "task-blocker", label: "Blocks task" },
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
    taskRecurrence: "none",
    taskRecurrenceAnchorDate: "",
    taskRecurrenceEndsOn: "",
    taskRecurrenceNote: "",
    taskReminderDate: "",
    taskReminderTime: "",
    taskReminderNote: "",
    recurrenceEngine: false,
    reminderEngine: false,
    nativeNotificationEngine: false,
    calendarSchedulingEngine: false,
    category: "tasks",
    notes: "",
    linkedPageIds: [],
    linkedDocumentIds: [],
    linkedPersonIds: [],
    linkedFinanceIds: [],
    linkedCalendarEventIds: [],
    dependsOnTaskIds: [],
    blockingTaskIds: [],
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
    taskRecurrence:
      source.taskRecurrence === undefined ? "none" : normalizeTaskRecurrence(source.taskRecurrence),
    taskRecurrenceAnchorDate: normalizeDateString(source.taskRecurrenceAnchorDate),
    taskRecurrenceEndsOn: normalizeDateString(source.taskRecurrenceEndsOn),
    taskRecurrenceNote: normalizeString(source.taskRecurrenceNote),
    taskReminderDate: normalizeDateString(source.taskReminderDate),
    taskReminderTime: normalizeTimeString(source.taskReminderTime),
    taskReminderNote: normalizeString(source.taskReminderNote),
    recurrenceEngine: false,
    reminderEngine: false,
    nativeNotificationEngine: false,
    calendarSchedulingEngine: false,
    category: "tasks",
    notes: normalizeString(source.notes),
    linkedPageIds: normalizeTaskRelationIds(source.linkedPageIds),
    linkedDocumentIds: normalizeTaskRelationIds(source.linkedDocumentIds),
    linkedPersonIds: normalizeTaskRelationIds(source.linkedPersonIds),
    linkedFinanceIds: normalizeTaskRelationIds(source.linkedFinanceIds),
    linkedCalendarEventIds: normalizeTaskRelationIds(source.linkedCalendarEventIds),
    dependsOnTaskIds: normalizeTaskRelationIds(source.dependsOnTaskIds),
    blockingTaskIds: normalizeTaskRelationIds(source.blockingTaskIds),
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
    taskRecurrence: options.recurrence ?? "none",
    taskRecurrenceAnchorDate: options.recurrenceAnchorDate ?? "",
    taskRecurrenceEndsOn: options.recurrenceEndsOn ?? "",
    taskRecurrenceNote: options.recurrenceNote ?? "",
    taskReminderDate: options.reminderDate ?? "",
    taskReminderTime: options.reminderTime ?? "",
    taskReminderNote: options.reminderNote ?? "",
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
      recurrence: getTaskRecurrenceLabel(metadata.taskRecurrence),
      reminder: getTaskReminderLabel(metadata),
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

export function normalizeTaskRecurrence(value: unknown): TaskRecurrence {
  return normalizeEnum(value, TASK_RECURRENCE_VALUES, "none");
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
    recurrenceLabel: getTaskRecurrenceLabel(metadata.taskRecurrence),
    recurrenceAnchorDate: metadata.taskRecurrenceAnchorDate,
    recurrenceEndsOn: metadata.taskRecurrenceEndsOn,
    recurrenceNote: metadata.taskRecurrenceNote,
    reminderLabel: getTaskReminderLabel(metadata),
    reminderDate: metadata.taskReminderDate,
    reminderTime: metadata.taskReminderTime,
    reminderNote: metadata.taskReminderNote,
    calendarLinkCount: metadata.linkedCalendarEventIds.length,
    calendarLinkLabel: getTaskCalendarLinkLabel(metadata),
    dependencyCount: getTaskDependencyCount(metadata),
    dependencyLabel: getTaskDependencyLabel(metadata),
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
    recurring: metadata.taskRecurrence !== "none",
    recurrenceLabel: getTaskRecurrenceLabel(metadata.taskRecurrence),
    hasReminderMetadata: hasTaskReminderMetadata(metadata),
    reminderLabel: getTaskReminderLabel(metadata),
    calendarLinked: metadata.linkedCalendarEventIds.length > 0,
    calendarLinkLabel: getTaskCalendarLinkLabel(metadata),
    hasDependencyMetadata: getTaskDependencyCount(metadata) > 0,
    dependencyLabel: getTaskDependencyLabel(metadata),
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
  let recurringCount = 0;
  let reminderMetadataCount = 0;
  let calendarLinkedCount = 0;
  let dependencyMetadataCount = 0;

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
    if (metadata.taskRecurrence !== "none") recurringCount += 1;
    if (hasTaskReminderMetadata(metadata)) reminderMetadataCount += 1;
    if (metadata.linkedCalendarEventIds.length > 0) calendarLinkedCount += 1;
    if (getTaskDependencyCount(metadata) > 0) dependencyMetadataCount += 1;
  }

  return {
    recordCount: items.length,
    linkedProjectCount,
    unlinkedCount,
    activeCount,
    completedCount,
    overdueCount,
    highPriorityCount,
    recurringCount,
    reminderMetadataCount,
    calendarLinkedCount,
    dependencyMetadataCount,
    byStatus,
  };
}

export function groupTaskRecordsByStatus<
  T extends Pick<MizaanItem, "title" | "status" | "tags" | "metadata" | "parentId">,
>(items: T[]): Record<TaskStatus, T[]> {
  const groups = TASK_STATUS_VALUES.reduce(
    (result, status) => {
      result[status] = [];
      return result;
    },
    {} as Record<TaskStatus, T[]>,
  );

  for (const item of items) {
    const metadata = normalizeTaskMetadataForItem(item);
    groups[metadata.taskStatus].push(item);
  }

  return groups;
}

export function createTaskTimelineEntries<
  T extends Pick<MizaanItem, "title" | "status" | "tags" | "metadata" | "parentId">,
>(items: T[], today?: string): Array<TaskTimelineEntry<T>> {
  return items
    .map((item) => {
      const metadata = normalizeTaskMetadataForItem(item);
      const completed = isTaskCompleted(metadata);
      const overdue = isTaskOverdue(metadata, today);
      const startDate = metadata.taskStartDate || metadata.taskDueDate || metadata.taskCompletedAt;
      const rawEndDate = metadata.taskDueDate || metadata.taskCompletedAt || metadata.taskStartDate;
      const endDate = startDate && rawEndDate && rawEndDate < startDate ? startDate : rawEndDate;
      const hasSchedule = Boolean(startDate || endDate);
      const bucket: TaskTimelineBucket = completed
        ? "Completed"
        : overdue
          ? "Overdue"
          : hasSchedule
            ? "Scheduled"
            : "Unscheduled";

      return {
        item,
        title: metadata.taskTitle,
        status: metadata.taskStatus,
        priority: metadata.taskPriority,
        startDate,
        endDate,
        dueDate: metadata.taskDueDate,
        completedAt: metadata.taskCompletedAt,
        projectId: metadata.taskProjectId,
        durationDays: startDate && endDate ? getInclusiveDateSpanDays(startDate, endDate) : 0,
        hasSchedule,
        completed,
        overdue,
        bucket,
      };
    })
    .sort((a, b) => {
      const aSort = a.startDate || a.endDate || "9999-12-31";
      const bSort = b.startDate || b.endDate || "9999-12-31";
      if (aSort !== bSort) return aSort.localeCompare(bSort);
      if (a.endDate !== b.endDate) return a.endDate.localeCompare(b.endDate);
      return a.title.localeCompare(b.title);
    });
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

export function getTaskRecurrenceLabel(recurrence: TaskRecurrence): string {
  return TASK_RECURRENCE_LABELS[recurrence];
}

function hasTaskReminderMetadata(metadata: TaskMetadata): boolean {
  return Boolean(
    metadata.taskReminderDate || metadata.taskReminderTime || metadata.taskReminderNote,
  );
}

function getTaskReminderLabel(metadata: TaskMetadata): string {
  if (!hasTaskReminderMetadata(metadata)) return "None";
  return [metadata.taskReminderDate, metadata.taskReminderTime].filter(Boolean).join(" ") || "Note";
}

function getTaskCalendarLinkLabel(metadata: TaskMetadata): string {
  const count = metadata.linkedCalendarEventIds.length;
  if (count === 0) return "None";
  if (count === 1) return "1 event link";
  return `${count} event links`;
}

function getTaskDependencyCount(metadata: TaskMetadata): number {
  return metadata.dependsOnTaskIds.length + metadata.blockingTaskIds.length;
}

function getTaskDependencyLabel(metadata: TaskMetadata): string {
  const count = getTaskDependencyCount(metadata);
  if (count === 0) return "None";
  if (count === 1) return "1 task link";
  return `${count} task links`;
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

function getInclusiveDateSpanDays(startDate: string, endDate: string): number {
  const start = Date.parse(`${startDate}T00:00:00.000Z`);
  const end = Date.parse(`${endDate}T00:00:00.000Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 1;
  return Math.max(1, Math.floor((end - start) / 86_400_000) + 1);
}

function normalizeDateString(value: unknown): string {
  const normalized = normalizeString(value);
  if (!normalized) return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
}

function normalizeTimeString(value: unknown): string {
  const normalized = normalizeString(value);
  if (!normalized) return "";
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(normalized) ? normalized : "";
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
