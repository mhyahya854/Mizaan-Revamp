import type { CreateItemInput, MizaanItem } from "../vault/types";

export type CalendarViewMode = "month" | "week" | "day" | "agenda";

export interface CalendarEventDraft {
  title: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  summary?: string;
  tag?: string;
  status?: string;
  allDay?: boolean;
}

export interface NormalizedCalendarEvent {
  item: MizaanItem;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  tag: string;
  status: string;
}

export interface CalendarDayModel {
  dateKey: string;
  date: Date;
  allDayEvents: NormalizedCalendarEvent[];
  timedEvents: NormalizedCalendarEvent[];
}

export function createCalendarEventInput(draft: CalendarEventDraft): CreateItemInput {
  const title = draft.title.trim() || "Untitled event";
  const startDate = draft.date;
  const endDate = draft.endDate || draft.date;
  const allDay = draft.allDay ?? !draft.startTime;
  const startTime = allDay ? "" : draft.startTime || "";
  const endTime = allDay ? "" : draft.endTime || "";
  const tag = draft.tag || "other";
  const status = draft.status || "Scheduled";

  return {
    title,
    category: "calendar",
    type: "calendar",
    icon: "C",
    summary: draft.summary ?? "",
    status,
    tags: [tag],
    properties: {
      date: startDate,
      time: startTime,
      startDate,
      endDate,
      startTime,
      endTime,
      allDay,
    },
    metadata: {
      calendarEvent: true,
      calendarCoreModule: true,
      schemaVersion: 1,
    },
  };
}

export function normalizeCalendarEvent(item: MizaanItem): NormalizedCalendarEvent {
  const startDate =
    stringProperty(item, "startDate") || stringProperty(item, "date") || formatDateKey(new Date());
  const endDate = stringProperty(item, "endDate") || startDate;
  const startTime = stringProperty(item, "startTime") || stringProperty(item, "time");
  const endTime = stringProperty(item, "endTime");
  const explicitAllDay = item.properties.allDay;
  const allDay = typeof explicitAllDay === "boolean" ? explicitAllDay : !startTime;

  return {
    item,
    startDate,
    endDate,
    startTime: allDay ? "" : startTime,
    endTime: allDay ? "" : endTime,
    allDay,
    tag: item.tags[0] || "other",
    status: item.status || "Scheduled",
  };
}

export function filterActiveCalendarEvents(items: MizaanItem[]) {
  return items
    .filter((item) => item.category === "calendar" && !item.archivedAt && !item.deletedAt)
    .filter((item) => item.metadata.promotedAsSpace !== true)
    .filter((item) => item.metadata.deprecatedCoreModuleSpace !== true)
    .map(normalizeCalendarEvent);
}

export function getCalendarDateRange(
  mode: CalendarViewMode,
  currentDate: Date,
): CalendarDayModel[] {
  if (mode === "agenda") return [];

  if (mode === "day") {
    return [createEmptyDay(currentDate)];
  }

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
  const normalized = events.map((event) =>
    "item" in event ? event : normalizeCalendarEvent(event),
  );
  const matching = normalized
    .filter((event) => eventOccursOnDate(event, dateKey))
    .sort(compareCalendarEvents);

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
  if (mode === "day" || mode === "agenda") {
    return addDays(currentDate, direction);
  }
  if (mode === "week") {
    return addDays(currentDate, direction * 7);
  }
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

  if (mode === "agenda") {
    return "Agenda";
  }

  return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function stringProperty(item: MizaanItem, key: string) {
  const value = item.properties[key];
  return typeof value === "string" ? value : "";
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
  return {
    date,
    dateKey: formatDateKey(date),
    allDayEvents: [],
    timedEvents: [],
  };
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
