import { describe, expect, it } from "vitest";

import type { MizaanItem } from "../vault/types";
import {
  createCalendarEventRecordInput,
  createDefaultCalendarEventMetadata,
  getCalendarEventDisplayFields,
  getCalendarEventStateSummary,
  getCalendarGraphTargets,
  getCalendarSearchMetadata,
  getEventsForAgendaRange,
  getEventsForDate,
  getEventsForMonth,
  isAllDayEvent,
  isCalendarEventItem,
  isInvalidCalendarRange,
  isTimedEvent,
  normalizeCalendarEventMetadata,
  normalizeCalendarEventStatus,
  normalizeCalendarEventType,
  updateCalendarEventMetadata,
} from "./calendar-event";

function item(input: Partial<MizaanItem> = {}): MizaanItem {
  return {
    id: input.id ?? "calendar-1",
    type: "calendar",
    category: "calendar",
    title: input.title ?? "Planning review",
    icon: "C",
    summary: input.summary ?? "",
    status: input.status ?? "Planned",
    tags: input.tags ?? ["event"],
    createdAt: "2026-06-04T00:00:00.000Z",
    updatedAt: "2026-06-04T00:00:00.000Z",
    properties: input.properties ?? {},
    attachedFiles: [],
    metadata: input.metadata ?? {},
    ...input,
  };
}

describe("calendar event metadata", () => {
  it(``, async () => {
    expect(createDefaultCalendarEventMetadata({ eventTitle: "  Class review  " })).toMatchObject({
      eventTitle: "Class review",
      eventType: "event",
      eventStatus: "planned",
      allDay: true,
      private: false,
      sensitive: false,
      recurrenceEngine: false,
      reminderEngine: false,
      nativeNotifications: false,
    });
  });

  it(``, async () => {
    const metadata = normalizeCalendarEventMetadata({
      eventType: "bad",
      eventStatus: "bad",
      startDate: "not-a-date",
      endDate: "2026-06-02",
      startTime: "99:99",
      endTime: "10:00",
      location: "  Library  ",
      notes: "  Bring notes  ",
      extraSafe: "preserved",
    });

    expect(metadata.eventType).toBe("unknown");
    expect(metadata.eventStatus).toBe("planned");
    expect(metadata.startDate).toBe("");
    expect(metadata.endDate).toBe("2026-06-02");
    expect(metadata.startTime).toBe("");
    expect(metadata.endTime).toBe("10:00");
    expect(metadata.location).toBe("Library");
    expect(metadata.notes).toBe("Bring notes");
    expect(metadata.extraSafe).toBe("preserved");
  });

  it(``, async () => {
    expect(normalizeCalendarEventType("Study")).toBe("study");
    expect(normalizeCalendarEventType("nonsense")).toBe("unknown");
    expect(normalizeCalendarEventStatus("Cancelled")).toBe("cancelled");
    expect(normalizeCalendarEventStatus("nonsense")).toBe("planned");

    const allDay = normalizeCalendarEventMetadata({ startDate: "2026-06-04", allDay: true });
    const timed = normalizeCalendarEventMetadata({
      startDate: "2026-06-04",
      startTime: "09:00",
      endTime: "10:00",
      allDay: false,
    });

    expect(isAllDayEvent(allDay)).toBe(true);
    expect(isTimedEvent(timed)).toBe(true);
    expect(isInvalidCalendarRange({ startDate: "2026-06-05", endDate: "2026-06-04" })).toBe(true);
    expect(
      isInvalidCalendarRange({ startDate: "2026-06-04", startTime: "11:00", endTime: "10:00" }),
    ).toBe(true);
  });

  it(``, async () => {
    const metadata = normalizeCalendarEventMetadata({
      linkedProjectIds: ["project-1", "project-1", "bad id"],
      linkedTaskIds: ["task-1", "", "task/2"],
      linkedPersonIds: ["person-1"],
      linkedDocumentIds: ["doc-1"],
      linkedFinanceIds: ["finance-1"],
    });

    expect(metadata.linkedProjectIds).toEqual(["project-1"]);
    expect(metadata.linkedTaskIds).toEqual(["task-1"]);
    expect(metadata.linkedPersonIds).toEqual(["person-1"]);
    expect(metadata.linkedDocumentIds).toEqual(["doc-1"]);
    expect(metadata.linkedFinanceIds).toEqual(["finance-1"]);
  });

  it(``, async () => {
    const metadata = updateCalendarEventMetadata(
      { eventTitle: "Before", customKey: "keep", linkedProjectIds: ["project-1"] },
      { eventTitle: "After", linkedProjectIds: ["project-1", "project-2"] },
    );

    expect(metadata.eventTitle).toBe("After");
    expect(metadata.customKey).toBe("keep");
    expect(metadata.linkedProjectIds).toEqual(["project-1", "project-2"]);
  });

  it(``, async () => {
    const input = createCalendarEventRecordInput({
      title: "Budget appointment",
      type: "finance",
      status: "confirmed",
      startDate: "2026-06-10",
      startTime: "08:30",
      endTime: "09:15",
      allDay: false,
      location: "Bank branch",
      notes: "Bring document",
      linkedFinanceIds: ["finance-1"],
      private: true,
      sensitive: true,
    });

    expect(input).toMatchObject({
      title: "Budget appointment",
      category: "calendar",
      type: "calendar",
      icon: "C",
      status: "Confirmed",
      tags: ["finance"],
    });
    expect(input.properties).toMatchObject({
      startDate: "2026-06-10",
      startTime: "08:30",
      endTime: "09:15",
      allDay: false,
      location: "Bank branch",
      private: true,
      sensitive: true,
    });
    expect(input.metadata).toMatchObject({
      eventTitle: "Budget appointment",
      eventType: "finance",
      eventStatus: "confirmed",
      linkedFinanceIds: ["finance-1"],
    });
  });

  it(``, async () => {
    const events = [
      item({
        id: "one",
        metadata: createDefaultCalendarEventMetadata({
          eventTitle: "One",
          startDate: "2026-06-04",
          endDate: "2026-06-05",
        }),
      }),
      item({
        id: "two",
        metadata: createDefaultCalendarEventMetadata({
          eventTitle: "Two",
          startDate: "2026-07-01",
        }),
      }),
    ];

    expect(getEventsForDate(events, "2026-06-05").map((event) => event.item.id)).toEqual(["one"]);
    expect(getEventsForMonth(events, 2026, 6).map((event) => event.item.id)).toEqual(["one"]);
    expect(
      getEventsForAgendaRange(events, "2026-06-01", "2026-06-30").map((event) => event.item.id),
    ).toEqual(["one"]);
  });

  it(``, async () => {
    const metadata = createDefaultCalendarEventMetadata({
      eventTitle: "Private finance review",
      eventType: "finance",
      eventStatus: "archived",
      startDate: "2026-06-04",
      location: "Home office",
      notes: "Metadata only",
      linkedProjectIds: ["project-1"],
      linkedTaskIds: ["task-1"],
      linkedPersonIds: ["person-1"],
      linkedDocumentIds: ["doc-1"],
      linkedFinanceIds: ["finance-1"],
      private: true,
      sensitive: true,
    });

    expect(getCalendarSearchMetadata(metadata)).toContain("Private finance review");
    expect(getCalendarGraphTargets(metadata)).toEqual([
      {
        targetId: "project-1",
        edgeType: "project-link",
        sourceField: "linkedProjectIds",
        label: "Linked project",
      },
      {
        targetId: "task-1",
        edgeType: "task-link",
        sourceField: "linkedTaskIds",
        label: "Linked task",
      },
      {
        targetId: "person-1",
        edgeType: "person-link",
        sourceField: "linkedPersonIds",
        label: "Linked person",
      },
      {
        targetId: "doc-1",
        edgeType: "document-link",
        sourceField: "linkedDocumentIds",
        label: "Linked document",
      },
      {
        targetId: "finance-1",
        edgeType: "finance-link",
        sourceField: "linkedFinanceIds",
        label: "Linked finance",
      },
    ]);
    expect(getCalendarEventDisplayFields(metadata).relationCount).toBe(5);
    expect(getCalendarEventStateSummary(metadata)).toMatchObject({
      statusLabel: "Archived",
      typeLabel: "Finance",
      relationCount: 5,
      privacyLabel: "Private, sensitive metadata flags only",
    });
  });

  it(``, async () => {
    expect(isCalendarEventItem(item())).toBe(true);
    expect(isCalendarEventItem(item({ metadata: { promotedAsSpace: true } }))).toBe(false);
  });
});

