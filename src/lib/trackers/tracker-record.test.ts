import { describe, expect, it } from "vitest";

import {
  TRACKER_FREQUENCY_VALUES,
  TRACKER_STATUS_VALUES,
  TRACKER_TYPE_VALUES,
  addTrackerCheckIn,
  computeTrackerTotals,
  createDefaultTrackerMetadata,
  createTrackerRecordInput,
  getTrackerDisplayFields,
  getTrackerGraphTargets,
  getTrackerPrivacySummary,
  getTrackerSearchMetadata,
  getTrackerStateSummary,
  isTrackerRecordItem,
  normalizeTrackerFrequency,
  normalizeTrackerMetadata,
  normalizeTrackerMetadataForItem,
  normalizeTrackerRelationIds,
  normalizeTrackerStatus,
  normalizeTrackerType,
  updateTrackerMetadata,
} from "./tracker-record";
import type { MizaanItem } from "../vault/types";

function item(input: Partial<MizaanItem> = {}): MizaanItem {
  return {
    id: input.id ?? "tracker-1",
    type: input.type ?? "tracker",
    category: input.category ?? "trackers",
    title: input.title ?? "Tracker item",
    icon: input.icon ?? "T",
    summary: input.summary ?? "",
    status: input.status ?? "Active",
    tags: input.tags ?? [],
    createdAt: input.createdAt ?? "2026-06-03T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-06-03T00:00:00.000Z",
    parentId: input.parentId,
    properties: input.properties ?? {},
    attachedFiles: input.attachedFiles ?? [],
    metadata: input.metadata ?? {},
  };
}

describe("tracker record model", () => {
  it(``, async () => {
    const metadata = createDefaultTrackerMetadata();

    expect(metadata.trackerTitle).toBe("Untitled tracker");
    expect(metadata.trackerType).toBe("habit");
    expect(metadata.trackerStatus).toBe("not-started");
    expect(metadata.frequency).toBe("daily");
    expect(metadata.targetValue).toBeNull();
    expect(metadata.currentValue).toBeNull();
    expect(metadata.checkIns).toEqual([]);
    expect(metadata.fakeStreaks).toBe(false);
    expect(metadata.reminderEngine).toBe(false);
    expect(metadata.private).toBe(false);
    expect(metadata.sensitive).toBe(false);
  });

  it(``, async () => {
    expect(normalizeTrackerType("Study")).toBe("study");
    expect(normalizeTrackerType("not-real")).toBe("habit");
    expect(normalizeTrackerStatus("Completed")).toBe("completed");
    expect(normalizeTrackerStatus("not-real")).toBe("not-started");
    expect(normalizeTrackerFrequency("Weekly")).toBe("weekly");
    expect(normalizeTrackerFrequency("not-real")).toBe("custom");

    const metadata = normalizeTrackerMetadata({
      trackerTitle: "  Reading tracker  ",
      trackerType: "reading",
      trackerStatus: "active",
      frequency: "weekly",
      targetValue: "10",
      currentValue: "3.5",
      unit: " books ",
      startDate: "2026-06-01",
      endDate: "bad-date",
      notes: "  Read local-first notes  ",
      unknownSafeField: "kept",
    });

    expect(metadata.trackerTitle).toBe("Reading tracker");
    expect(metadata.targetValue).toBe(10);
    expect(metadata.currentValue).toBe(3.5);
    expect(metadata.unit).toBe("books");
    expect(metadata.startDate).toBe("2026-06-01");
    expect(metadata.endDate).toBe("");
    expect(metadata.notes).toBe("Read local-first notes");
    expect(metadata.unknownSafeField).toBe("kept");
  });

  it(``, async () => {
    const metadata = updateTrackerMetadata(
      {
        trackerTitle: "Old tracker",
        trackerStatus: "active",
        customSafeField: "kept",
      },
      {
        trackerTitle: "New tracker",
        trackerStatus: "paused",
      },
    );

    expect(metadata.trackerTitle).toBe("New tracker");
    expect(metadata.trackerStatus).toBe("paused");
    expect(metadata.customSafeField).toBe("kept");
  });

  it(``, async () => {
    expect(normalizeTrackerRelationIds(["project-1", " project-1 ", "bad id", "person:2"])).toEqual(
      ["project-1", "person:2"],
    );

    const metadata = normalizeTrackerMetadata({
      linkedProjectIds: ["project-1", "project-1"],
      linkedTaskIds: ["task-1"],
      linkedPersonIds: ["person-1"],
      linkedDocumentIds: ["doc-1"],
      linkedFinanceIds: ["finance-1"],
    });

    expect(getTrackerGraphTargets(metadata)).toEqual([
      {
        targetId: "project-1",
        sourceField: "linkedProjectIds",
        edgeType: "project-link",
        label: "Linked project",
      },
      {
        targetId: "task-1",
        sourceField: "linkedTaskIds",
        edgeType: "task-link",
        label: "Linked task",
      },
      {
        targetId: "person-1",
        sourceField: "linkedPersonIds",
        edgeType: "person-link",
        label: "Linked person",
      },
      {
        targetId: "doc-1",
        sourceField: "linkedDocumentIds",
        edgeType: "document-link",
        label: "Linked document",
      },
      {
        targetId: "finance-1",
        sourceField: "linkedFinanceIds",
        edgeType: "finance-link",
        label: "Linked finance",
      },
    ]);
  });

  it(``, async () => {
    const metadata = createDefaultTrackerMetadata({
      trackerTitle: "Study tracker",
      unit: "minutes",
      currentValue: "30",
    });
    const next = addTrackerCheckIn(
      metadata,
      { date: "2026-06-03", value: "45", note: "Pomodoro review" },
      { id: "check-1", createdAt: "2026-06-03T08:00:00.000Z" },
    );

    expect(metadata.checkIns).toEqual([]);
    expect(next.checkIns).toEqual([
      {
        id: "check-1",
        date: "2026-06-03",
        value: 45,
        unit: "minutes",
        note: "Pomodoro review",
        createdAt: "2026-06-03T08:00:00.000Z",
      },
    ]);
    expect(next.currentValue).toBe(45);
    expect(next.fakeStreaks).toBe(false);
  });

  it(``, async () => {
    const input = createTrackerRecordInput({
      title: "Study minutes",
      type: "study",
      status: "active",
      frequency: "weekly",
      targetValue: "300",
      unit: "minutes",
      parentId: "space-trackers",
      tags: ["university"],
    });

    expect(input).toMatchObject({
      title: "Study minutes",
      category: "trackers",
      type: "tracker",
      icon: "T",
      status: "Active",
      parentId: "space-trackers",
    });
    expect(input.tags).toEqual(["tracker", "study", "university"]);
    expect(input.properties?.streak).toBeUndefined();
    expect(input.metadata?.trackerTitle).toBe("Study minutes");
    expect(input.metadata?.targetValue).toBe(300);
  });

  it(``, async () => {
    expect(isTrackerRecordItem(item())).toBe(true);
    expect(
      isTrackerRecordItem(
        item({
          metadata: {
            promotedAsSpace: true,
            itemRole: "space",
          },
        }),
      ),
    ).toBe(false);

    const metadata = normalizeTrackerMetadataForItem(
      item({
        title: "Legacy tracker",
        status: "Active",
        tags: ["reading"],
      }),
    );

    expect(metadata.trackerTitle).toBe("Legacy tracker");
    expect(metadata.trackerStatus).toBe("active");
    expect(metadata.tags).toEqual(["reading"]);
  });

  it(``, async () => {
    const metadata = createDefaultTrackerMetadata({
      trackerTitle: "Quran reading",
      trackerType: "reading",
      trackerStatus: "active",
      frequency: "daily",
      targetValue: 30,
      currentValue: 12,
      unit: "pages",
      linkedProjectIds: ["project-1"],
      private: true,
    });

    expect(getTrackerDisplayFields(metadata)).toMatchObject({
      title: "Quran reading",
      typeLabel: "Reading",
      statusLabel: "Active",
      frequencyLabel: "Daily",
      progressLabel: "12 / 30 pages",
      relationCount: 1,
      private: true,
    });
    expect(getTrackerStateSummary(metadata)).toMatchObject({
      progressRatio: 0.4,
      checkInCount: 0,
      metadataOnlyPrivacy: true,
    });
    expect(getTrackerPrivacySummary(metadata).message).toContain("metadata only");
    expect(getTrackerSearchMetadata(metadata).progress).toContain("pages");
  });

  it(``, async () => {
    const records = [
      item({
        id: "tracker-active",
        metadata: createDefaultTrackerMetadata({
          trackerStatus: "active",
          targetValue: 10,
          currentValue: 5,
          checkIns: [{ id: "c1", date: "2026-06-03", value: 5, unit: "", note: "", createdAt: "" }],
        }),
      }),
      item({
        id: "tracker-complete",
        metadata: createDefaultTrackerMetadata({
          trackerStatus: "completed",
          targetValue: 10,
          currentValue: 10,
        }),
      }),
      item({
        id: "space-trackers",
        metadata: { promotedAsSpace: true, itemRole: "space" },
      }),
      item({
        id: "note-1",
        category: "notes",
        type: "note",
        metadata: { trackerStatus: "active" },
      }),
    ];

    expect(computeTrackerTotals(records)).toMatchObject({
      recordCount: 2,
      activeCount: 1,
      completedCount: 1,
      checkInCount: 1,
      withTargetCount: 2,
    });
  });

  it(``, async () => {
    expect(TRACKER_TYPE_VALUES).toContain("habit");
    expect(TRACKER_TYPE_VALUES).toContain("study");
    expect(TRACKER_TYPE_VALUES).toContain("custom");
    expect(TRACKER_STATUS_VALUES).toContain("paused");
    expect(TRACKER_STATUS_VALUES).toContain("completed");
    expect(TRACKER_FREQUENCY_VALUES).toContain("daily");
    expect(TRACKER_FREQUENCY_VALUES).toContain("custom");
  });
});

