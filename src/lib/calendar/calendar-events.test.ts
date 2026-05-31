import { describe, expect, it } from "vitest";

import {
  buildCalendarDayModel,
  buildCalendarRangeLabel,
  createCalendarEventInput,
  getCalendarDateRange,
  normalizeCalendarEvent,
} from "./calendar-events";
import {
  LocalStorageVaultProvider,
  createMemoryStorage,
} from "../vault/local-storage-vault-provider";

function createProvider() {
  let sequence = 0;
  return new LocalStorageVaultProvider({
    storage: createMemoryStorage(),
    now: () => "2026-05-31T06:00:00.000Z",
    idFactory: (prefix) => `${prefix}-${++sequence}`,
    seedOnEmpty: false,
  });
}

describe("calendar event model", () => {
  it("creates provider input for timed events without promoting Calendar as a page", () => {
    const input = createCalendarEventInput({
      title: "Planning review",
      date: "2026-06-02",
      startTime: "09:30",
      endTime: "10:15",
      summary: "Review the next Mizaan phase.",
      tag: "work",
      status: "Scheduled",
      allDay: false,
    });

    expect(input.category).toBe("calendar");
    expect(input.type).toBe("calendar");
    expect(input.parentId).toBeUndefined();
    expect(input.icon).toBe("C");
    expect(input.properties).toMatchObject({
      date: "2026-06-02",
      startDate: "2026-06-02",
      endDate: "2026-06-02",
      startTime: "09:30",
      endTime: "10:15",
      allDay: false,
    });
    expect(input.metadata).toMatchObject({
      calendarEvent: true,
      calendarCoreModule: true,
    });
  });

  it("normalizes legacy date/time events into the new event metadata shape", () => {
    const provider = createProvider();
    const event = provider.createItem({
      title: "Legacy review",
      category: "calendar",
      type: "calendar",
      properties: { date: "2026-05-29", time: "14:00" },
      tags: ["review"],
      status: "Scheduled",
    });

    const normalized = normalizeCalendarEvent(event);

    expect(normalized.startDate).toBe("2026-05-29");
    expect(normalized.endDate).toBe("2026-05-29");
    expect(normalized.startTime).toBe("14:00");
    expect(normalized.endTime).toBe("");
    expect(normalized.allDay).toBe(false);
    expect(normalized.tag).toBe("review");
  });

  it("builds a day model with all-day events first and timed events sorted by start time", () => {
    const provider = createProvider();
    const allDay = provider.createItem(
      createCalendarEventInput({
        title: "All day review",
        date: "2026-06-02",
        summary: "",
        tag: "review",
        status: "Scheduled",
        allDay: true,
      }),
    );
    const late = provider.createItem(
      createCalendarEventInput({
        title: "Late event",
        date: "2026-06-02",
        startTime: "16:00",
        summary: "",
        tag: "work",
        status: "Scheduled",
        allDay: false,
      }),
    );
    const early = provider.createItem(
      createCalendarEventInput({
        title: "Early event",
        date: "2026-06-02",
        startTime: "08:00",
        summary: "",
        tag: "work",
        status: "Scheduled",
        allDay: false,
      }),
    );

    const model = buildCalendarDayModel([late, allDay, early], "2026-06-02");

    expect(model.allDayEvents.map((event) => event.item.title)).toEqual(["All day review"]);
    expect(model.timedEvents.map((event) => event.item.title)).toEqual([
      "Early event",
      "Late event",
    ]);
  });

  it("creates a single-day date range and readable day label", () => {
    const date = new Date(2026, 5, 2);

    expect(getCalendarDateRange("day", date).map((entry) => entry.dateKey)).toEqual(["2026-06-02"]);
    expect(buildCalendarRangeLabel("day", date)).toBe("Tuesday, June 2, 2026");
  });
});
