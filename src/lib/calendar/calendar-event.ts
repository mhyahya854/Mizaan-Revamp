import type { CreateItemInput, MizaanItem, PropertyValue } from "../vault/types";
import type { GraphEdgeType } from "../graph/graph-model";

export type CalendarViewMode = "month" | "week" | "day" | "agenda";

export const CALENDAR_EVENT_TYPE_VALUES = [
  "event",
  "task-deadline",
  "project-milestone",
  "bill-due",
  "appointment",
  "class",
  "study",
  "personal",
  "finance",
  "reminder-note",
  "unknown",
] as const;

export const CALENDAR_EVENT_STATUS_VALUES = [
  "planned",
  "confirmed",
  "tentative",
  "completed",
  "cancelled",
  "archived",
] as const;

export type CalendarEventType = (typeof CALENDAR_EVENT_TYPE_VALUES)[number];
export type CalendarEventStatus = (typeof CALENDAR_EVENT_STATUS_VALUES)[number];

export interface CalendarEventMetadata {
  eventTitle: string;
  eventType: CalendarEventType;
  eventStatus: CalendarEventStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  location: string;
  notes: string;
  linkedProjectIds: string[];
  linkedTaskIds: string[];
  linkedPersonIds: string[];
  linkedDocumentIds: string[];
  linkedFinanceIds: string[];
  private: boolean;
  sensitive: boolean;
  calendarEvent: true;
  calendarCoreModule: true;
  schemaVersion: 2;
  recurrenceEngine: false;
  reminderEngine: false;
  nativeNotifications: false;
  [key: string]: PropertyValue;
}

export interface CalendarEventDraft {
  title: string;
  date?: string;
  endDate?: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  summary?: string;
  tag?: string;
  type?: unknown;
  status?: unknown;
  allDay?: boolean;
  location?: string;
  notes?: string;
  linkedProjectIds?: unknown;
  linkedTaskIds?: unknown;
  linkedPersonIds?: unknown;
  linkedDocumentIds?: unknown;
  linkedFinanceIds?: unknown;
  private?: boolean;
  sensitive?: boolean;
}

export interface NormalizedCalendarEvent {
  item: MizaanItem;
  metadata: CalendarEventMetadata;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  tag: string;
  status: string;
  eventType: CalendarEventType;
  eventStatus: CalendarEventStatus;
  invalidRange: boolean;
}

export interface CalendarDayModel {
  dateKey: string;
  date: Date;
  allDayEvents: NormalizedCalendarEvent[];
  timedEvents: NormalizedCalendarEvent[];
}

export interface CalendarGraphTarget {
  targetId: string;
  edgeType: GraphEdgeType;
  sourceField: keyof Pick<
    CalendarEventMetadata,
    | "linkedProjectIds"
    | "linkedTaskIds"
    | "linkedPersonIds"
    | "linkedDocumentIds"
    | "linkedFinanceIds"
  >;
  label: string;
}

const TYPE_LABELS: Record<CalendarEventType, string> = {
  event: "Event",
  "task-deadline": "Task deadline",
  "project-milestone": "Project milestone",
  "bill-due": "Bill due",
  appointment: "Appointment",
  class: "Class",
  study: "Study",
  personal: "Personal",
  finance: "Finance",
  "reminder-note": "Reminder note",
  unknown: "Unknown",
};

const STATUS_LABELS: Record<CalendarEventStatus, string> = {
  planned: "Planned",
  confirmed: "Confirmed",
  tentative: "Tentative",
  completed: "Completed",
  cancelled: "Cancelled",
  archived: "Archived",
};

const TYPE_ALIASES: Record<string, CalendarEventType> = {
  event: "event",
  "task deadline": "task-deadline",
  "task-deadline": "task-deadline",
  deadline: "task-deadline",
  "project milestone": "project-milestone",
  "project-milestone": "project-milestone",
  milestone: "project-milestone",
  "bill due": "bill-due",
  "bill-due": "bill-due",
  appointment: "appointment",
  class: "class",
  study: "study",
  personal: "personal",
  finance: "finance",
  "reminder note": "reminder-note",
  "reminder-note": "reminder-note",
  unknown: "unknown",
};

const STATUS_ALIASES: Record<string, CalendarEventStatus> = {
  planned: "planned",
  scheduled: "planned",
  confirmed: "confirmed",
  tentative: "tentative",
  "in progress": "tentative",
  completed: "completed",
  done: "completed",
  cancelled: "cancelled",
  canceled: "cancelled",
  archived: "archived",
};

const RELATION_FIELDS: Array<{
  field: CalendarGraphTarget["sourceField"];
  edgeType: GraphEdgeType;
  label: string;
}> = [
  { field: "linkedProjectIds", edgeType: "project-link", label: "Linked project" },
  { field: "linkedTaskIds", edgeType: "task-link", label: "Linked task" },
  { field: "linkedPersonIds", edgeType: "person-link", label: "Linked person" },
  { field: "linkedDocumentIds", edgeType: "document-link", label: "Linked document" },
  { field: "linkedFinanceIds", edgeType: "finance-link", label: "Linked finance" },
];

export function createDefaultCalendarEventMetadata(
  options: Partial<CalendarEventMetadata> = {},
): CalendarEventMetadata {
  return normalizeCalendarEventMetadata({
    eventTitle: "",
    eventType: "event",
    eventStatus: "planned",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    allDay: true,
    location: "",
    notes: "",
    linkedProjectIds: [],
    linkedTaskIds: [],
    linkedPersonIds: [],
    linkedDocumentIds: [],
    linkedFinanceIds: [],
    private: false,
    sensitive: false,
    calendarEvent: true,
    calendarCoreModule: true,
    schemaVersion: 2,
    recurrenceEngine: false,
    reminderEngine: false,
    nativeNotifications: false,
    ...options,
  });
}

export function normalizeCalendarEventMetadata(input: unknown): CalendarEventMetadata {
  const source = isRecord(input) ? input : {};
  const startDate = normalizeDateString(source.startDate) || normalizeDateString(source.date);
  const endDate = normalizeDateString(source.endDate) || startDate;
  const normalizedStartTime = normalizeTimeString(source.startTime ?? source.time);
  const normalizedEndTime = normalizeTimeString(source.endTime);
  const allDay =
    typeof source.allDay === "boolean"
      ? source.allDay
      : !(normalizedStartTime || normalizedEndTime);
  const startTime = allDay ? "" : normalizedStartTime;
  const endTime = allDay ? "" : normalizedEndTime;

  return {
    ...source,
    eventTitle: normalizeString(source.eventTitle ?? source.title),
    eventType: normalizeCalendarEventType(source.eventType ?? source.type ?? source.tag),
    eventStatus: normalizeCalendarEventStatus(source.eventStatus ?? source.status),
    startDate,
    endDate,
    startTime,
    endTime,
    allDay,
    location: normalizeString(source.location),
    notes: normalizeString(source.notes ?? source.summary),
    linkedProjectIds: normalizeCalendarRelationIds(source.linkedProjectIds),
    linkedTaskIds: normalizeCalendarRelationIds(source.linkedTaskIds),
    linkedPersonIds: normalizeCalendarRelationIds(source.linkedPersonIds),
    linkedDocumentIds: normalizeCalendarRelationIds(source.linkedDocumentIds),
    linkedFinanceIds: normalizeCalendarRelationIds(source.linkedFinanceIds),
    private: source.private === true,
    sensitive: source.sensitive === true,
    calendarEvent: true,
    calendarCoreModule: true,
    schemaVersion: 2,
    recurrenceEngine: false,
    reminderEngine: false,
    nativeNotifications: false,
  };
}

export function updateCalendarEventMetadata(
  current: unknown,
  patch: Partial<CalendarEventMetadata> | Record<string, unknown>,
) {
  return normalizeCalendarEventMetadata({ ...(isRecord(current) ? current : {}), ...patch });
}

export function normalizeCalendarEventType(value: unknown): CalendarEventType {
  const key = normalizeString(value).toLowerCase();
  return TYPE_ALIASES[key] ?? "unknown";
}

export function normalizeCalendarEventStatus(value: unknown): CalendarEventStatus {
  const key = normalizeString(value).toLowerCase();
  return STATUS_ALIASES[key] ?? "planned";
}

export function normalizeCalendarRelationIds(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return Array.from(
    new Set(
      values
        .map((entry) => normalizeString(entry))
        .filter((entry) => /^[A-Za-z0-9_-]+$/.test(entry)),
    ),
  );
}

export function createCalendarEventRecordInput(draft: CalendarEventDraft): CreateItemInput {
  const title = normalizeString(draft.title) || "Untitled event";
  const metadata = createDefaultCalendarEventMetadata({
    eventTitle: title,
    eventType: normalizeCalendarEventType(draft.type ?? draft.tag),
    eventStatus: normalizeCalendarEventStatus(draft.status),
    startDate: normalizeDateString(draft.startDate ?? draft.date),
    endDate: normalizeDateString(draft.endDate ?? draft.startDate ?? draft.date),
    startTime: draft.startTime ?? "",
    endTime: draft.endTime ?? "",
    allDay: draft.allDay ?? !draft.startTime,
    location: draft.location ?? "",
    notes: draft.notes ?? draft.summary ?? "",
    linkedProjectIds: normalizeCalendarRelationIds(draft.linkedProjectIds),
    linkedTaskIds: normalizeCalendarRelationIds(draft.linkedTaskIds),
    linkedPersonIds: normalizeCalendarRelationIds(draft.linkedPersonIds),
    linkedDocumentIds: normalizeCalendarRelationIds(draft.linkedDocumentIds),
    linkedFinanceIds: normalizeCalendarRelationIds(draft.linkedFinanceIds),
    private: draft.private === true,
    sensitive: draft.sensitive === true,
  });
  const status = getCalendarStatusLabel(metadata.eventStatus);

  return {
    title,
    category: "calendar",
    type: "calendar",
    icon: "C",
    summary: metadata.notes,
    status,
    tags: [metadata.eventType],
    properties: toCalendarProperties(metadata),
    metadata,
  };
}

export function createCalendarEventInput(draft: CalendarEventDraft): CreateItemInput {
  return createCalendarEventRecordInput(draft);
}

export function normalizeCalendarEvent(item: MizaanItem): NormalizedCalendarEvent {
  const metadata = normalizeCalendarEventMetadata({
    ...item.metadata,
    eventTitle: item.metadata.eventTitle ?? item.title,
    eventType: item.metadata.eventType ?? item.tags[0],
    eventStatus: item.metadata.eventStatus ?? item.status,
    startDate: item.metadata.startDate ?? item.properties.startDate ?? item.properties.date,
    endDate: item.metadata.endDate ?? item.properties.endDate ?? item.properties.date,
    startTime: item.metadata.startTime ?? item.properties.startTime ?? item.properties.time,
    endTime: item.metadata.endTime ?? item.properties.endTime,
    allDay: item.metadata.allDay ?? item.properties.allDay,
    location: item.metadata.location ?? item.properties.location,
    notes: item.metadata.notes ?? item.summary,
    private: item.metadata.private ?? item.properties.private,
    sensitive: item.metadata.sensitive ?? item.properties.sensitive,
  });

  return {
    item,
    metadata,
    startDate: metadata.startDate || formatDateKey(new Date()),
    endDate: metadata.endDate || metadata.startDate || formatDateKey(new Date()),
    startTime: metadata.startTime,
    endTime: metadata.endTime,
    allDay: metadata.allDay,
    tag: metadata.eventType === "unknown" && item.tags[0] ? item.tags[0] : metadata.eventType,
    status: getCalendarStatusLabel(metadata.eventStatus),
    eventType: metadata.eventType,
    eventStatus: metadata.eventStatus,
    invalidRange: isInvalidCalendarRange(metadata),
  };
}

export function normalizeCalendarMetadataForItem(item: MizaanItem) {
  return normalizeCalendarEvent(item).metadata;
}

export function isCalendarEventItem(item: MizaanItem): boolean {
  return (
    item.category === "calendar" &&
    item.type === "calendar" &&
    item.metadata.promotedAsSpace !== true &&
    item.metadata.deprecatedCoreModuleSpace !== true
  );
}

export function filterActiveCalendarEvents(items: MizaanItem[]) {
  return items
    .filter((item) => isCalendarEventItem(item) && !item.archivedAt && !item.deletedAt)
    .map(normalizeCalendarEvent);
}

export function getCalendarEventDisplayFields(metadataInput: unknown) {
  const metadata = normalizeCalendarEventMetadata(metadataInput);
  return {
    title: metadata.eventTitle || "Untitled event",
    typeLabel: getCalendarTypeLabel(metadata.eventType),
    statusLabel: getCalendarStatusLabel(metadata.eventStatus),
    dateLabel: buildDateLabel(metadata),
    timeLabel: metadata.allDay
      ? "All day"
      : `${metadata.startTime || "No start"}${metadata.endTime ? ` - ${metadata.endTime}` : ""}`,
    location: metadata.location,
    relationCount: RELATION_FIELDS.reduce(
      (count, field) => count + metadata[field.field].length,
      0,
    ),
    privacyLabel: getCalendarPrivacyLabel(metadata),
  };
}

export function getCalendarEventStateSummary(metadataInput: unknown) {
  const display = getCalendarEventDisplayFields(metadataInput);
  const metadata = normalizeCalendarEventMetadata(metadataInput);
  return {
    typeLabel: display.typeLabel,
    statusLabel: display.statusLabel,
    dateLabel: display.dateLabel,
    timeLabel: display.timeLabel,
    relationCount: display.relationCount,
    invalidRange: isInvalidCalendarRange(metadata),
    privacyLabel: display.privacyLabel,
    recurrenceEngine: false,
    reminderEngine: false,
    nativeNotifications: false,
  };
}

export function isAllDayEvent(metadataInput: unknown): boolean {
  return normalizeCalendarEventMetadata(metadataInput).allDay;
}

export function isTimedEvent(metadataInput: unknown): boolean {
  const metadata = normalizeCalendarEventMetadata(metadataInput);
  return !metadata.allDay && Boolean(metadata.startTime);
}

export function isInvalidCalendarRange(metadataInput: unknown): boolean {
  const metadata = normalizeCalendarEventMetadata(metadataInput);
  if (!metadata.startDate) return true;
  if (metadata.endDate && metadata.endDate < metadata.startDate) return true;
  if (
    !metadata.allDay &&
    metadata.endTime &&
    metadata.startTime &&
    (metadata.endDate || metadata.startDate) === metadata.startDate &&
    metadata.endTime < metadata.startTime
  ) {
    return true;
  }
  return false;
}

export function getEventsForDate(
  events: MizaanItem[] | NormalizedCalendarEvent[],
  dateKey: string,
) {
  return normalizeEventList(events)
    .filter((event) => eventOccursOnDate(event, dateKey))
    .sort(compareCalendarEvents);
}

export function getEventsForMonth(
  events: MizaanItem[] | NormalizedCalendarEvent[],
  year: number,
  month: number,
) {
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  return normalizeEventList(events)
    .filter((event) => event.startDate.startsWith(monthKey) || event.endDate.startsWith(monthKey))
    .sort(compareCalendarEvents);
}

export function getEventsForAgendaRange(
  events: MizaanItem[] | NormalizedCalendarEvent[],
  startDate: string,
  endDate: string,
) {
  return normalizeEventList(events)
    .filter((event) => event.startDate <= endDate && event.endDate >= startDate)
    .sort(compareCalendarEvents);
}

export function getCalendarSearchMetadata(metadataInput: unknown): string {
  const metadata = normalizeCalendarEventMetadata(metadataInput);
  return [
    metadata.eventTitle,
    metadata.eventType,
    getCalendarTypeLabel(metadata.eventType),
    metadata.eventStatus,
    getCalendarStatusLabel(metadata.eventStatus),
    metadata.startDate,
    metadata.endDate,
    metadata.startTime,
    metadata.endTime,
    metadata.location,
    metadata.notes,
    metadata.linkedProjectIds.join(" "),
    metadata.linkedTaskIds.join(" "),
    metadata.linkedPersonIds.join(" "),
    metadata.linkedDocumentIds.join(" "),
    metadata.linkedFinanceIds.join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}

export function getCalendarGraphTargets(metadataInput: unknown): CalendarGraphTarget[] {
  const metadata = normalizeCalendarEventMetadata(metadataInput);
  return RELATION_FIELDS.flatMap(({ field, edgeType, label }) =>
    metadata[field].map((targetId) => ({ targetId, edgeType, sourceField: field, label })),
  );
}

export function getCalendarTypeLabel(type: CalendarEventType) {
  return TYPE_LABELS[type];
}

export function getCalendarStatusLabel(status: CalendarEventStatus) {
  return STATUS_LABELS[status];
}

export function toCalendarProperties(metadataInput: unknown) {
  const metadata = normalizeCalendarEventMetadata(metadataInput);
  return {
    date: metadata.startDate,
    time: metadata.startTime,
    startDate: metadata.startDate,
    endDate: metadata.endDate || metadata.startDate,
    startTime: metadata.startTime,
    endTime: metadata.endTime,
    allDay: metadata.allDay,
    eventType: getCalendarTypeLabel(metadata.eventType),
    status: getCalendarStatusLabel(metadata.eventStatus),
    location: metadata.location,
    private: metadata.private,
    sensitive: metadata.sensitive,
  };
}

export function getCalendarDateRange(
  mode: CalendarViewMode,
  currentDate: Date,
): CalendarDayModel[] {
  if (mode === "agenda") return [];
  if (mode === "day") return [createEmptyDay(currentDate)];

  const cells: CalendarDayModel[] = [];
  const start =
    mode === "week"
      ? startOfWeek(currentDate)
      : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  if (mode === "week") {
    for (let offset = 0; offset < 7; offset += 1) {
      cells.push(createEmptyDay(addDays(start, offset)));
    }
    return cells;
  }

  const firstDayIndex = start.getDay();
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  for (let offset = 0; offset < 42; offset += 1) {
    cells.push(createEmptyDay(addDays(monthStart, offset - firstDayIndex)));
  }
  return cells;
}

export function buildCalendarDayModel(
  events: MizaanItem[] | NormalizedCalendarEvent[],
  dateKey: string,
): CalendarDayModel {
  const matching = getEventsForDate(events, dateKey);
  return {
    dateKey,
    date: parseDateKey(dateKey),
    allDayEvents: matching.filter((event) => event.allDay),
    timedEvents: matching.filter((event) => !event.allDay),
  };
}

export function buildCalendarDays(
  mode: CalendarViewMode,
  currentDate: Date,
  events: NormalizedCalendarEvent[],
) {
  return getCalendarDateRange(mode, currentDate).map((day) =>
    buildCalendarDayModel(events, day.dateKey),
  );
}

export function buildAgendaEvents(events: NormalizedCalendarEvent[]) {
  return [...events].sort(compareCalendarEvents);
}

export function shiftCalendarDate(mode: CalendarViewMode, currentDate: Date, direction: -1 | 1) {
  if (mode === "day" || mode === "agenda") return addDays(currentDate, direction);
  if (mode === "week") return addDays(currentDate, direction * 7);
  return new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
}

export function buildCalendarRangeLabel(mode: CalendarViewMode, currentDate: Date) {
  if (mode === "day") {
    return currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  if (mode === "week") {
    const start = startOfWeek(currentDate);
    const end = addDays(start, 6);
    return `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  if (mode === "agenda") return "Agenda";
  return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeEventList(events: MizaanItem[] | NormalizedCalendarEvent[]) {
  return events.map((event) => ("item" in event ? event : normalizeCalendarEvent(event)));
}

function eventOccursOnDate(event: NormalizedCalendarEvent, dateKey: string) {
  return event.startDate <= dateKey && event.endDate >= dateKey;
}

function compareCalendarEvents(a: NormalizedCalendarEvent, b: NormalizedCalendarEvent) {
  if (a.startDate !== b.startDate) return a.startDate.localeCompare(b.startDate);
  if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
  if (a.startTime !== b.startTime) return a.startTime.localeCompare(b.startTime);
  return a.item.title.localeCompare(b.item.title);
}

function createEmptyDay(date: Date): CalendarDayModel {
  return { date, dateKey: formatDateKey(date), allDayEvents: [], timedEvents: [] };
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function startOfWeek(date: Date) {
  return addDays(date, -date.getDay());
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function buildDateLabel(metadata: CalendarEventMetadata) {
  if (!metadata.startDate) return "No date";
  if (!metadata.endDate || metadata.endDate === metadata.startDate) return metadata.startDate;
  return `${metadata.startDate} to ${metadata.endDate}`;
}

function getCalendarPrivacyLabel(metadata: CalendarEventMetadata) {
  if (metadata.private && metadata.sensitive) return "Private, sensitive metadata flags only";
  if (metadata.private) return "Private metadata flag only";
  if (metadata.sensitive) return "Sensitive metadata flag only";
  return "No privacy metadata flags";
}

function normalizeDateString(value: unknown) {
  const text = normalizeString(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function normalizeTimeString(value: unknown) {
  const text = normalizeString(value);
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(text) ? text : "";
}

function normalizeString(value: unknown) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    ? String(value).trim()
    : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
