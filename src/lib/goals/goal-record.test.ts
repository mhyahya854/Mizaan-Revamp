import { describe, expect, it } from "vitest";

import {
  GOAL_HORIZON_VALUES,
  GOAL_PRIORITY_VALUES,
  GOAL_STATUS_VALUES,
  computeGoalTotals,
  createDefaultGoalMetadata,
  createGoalRecordInput,
  getGoalDisplayFields,
  getGoalGraphTargets,
  getGoalPrivacySummary,
  getGoalSearchMetadata,
  getGoalStateSummary,
  isGoalRecordItem,
  normalizeGoalHorizon,
  normalizeGoalMetadata,
  normalizeGoalMetadataForItem,
  normalizeGoalPriority,
  normalizeGoalRelationIds,
  normalizeGoalStatus,
  updateGoalMetadata,
} from "./goal-record";
import type { MizaanItem } from "../vault/types";

function item(input: Partial<MizaanItem> = {}): MizaanItem {
  return {
    id: input.id ?? "goal-1",
    type: input.type ?? "goal",
    category: input.category ?? "goals",
    title: input.title ?? "Goal item",
    icon: input.icon ?? "G",
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

describe("goal record model", () => {
  it("creates default goal metadata without fake automation or progress history", () => {
    const metadata = createDefaultGoalMetadata();

    expect(metadata.goalTitle).toBe("Untitled goal");
    expect(metadata.goalStatus).toBe("not-started");
    expect(metadata.goalHorizon).toBe("short-term");
    expect(metadata.progressValue).toBeNull();
    expect(metadata.progressUnit).toBe("");
    expect(metadata.fakeProgressHistory).toBe(false);
    expect(metadata.reminderEngine).toBe(false);
    expect(metadata.private).toBe(false);
    expect(metadata.sensitive).toBe(false);
  });

  it("normalizes goal status, horizon, priority, progress, target date, and safe unknown fields", () => {
    expect(normalizeGoalStatus("Completed")).toBe("completed");
    expect(normalizeGoalStatus("not-real")).toBe("not-started");
    expect(normalizeGoalHorizon("Long Term")).toBe("long-term");
    expect(normalizeGoalHorizon("not-real")).toBe("custom");
    expect(normalizeGoalPriority("Urgent")).toBe("urgent");
    expect(normalizeGoalPriority("not-real")).toBe("none");

    const metadata = normalizeGoalMetadata({
      goalTitle: "  Degree plan  ",
      goalStatus: "active",
      goalHorizon: "long-term",
      targetDate: "2027-12-31",
      progressValue: "42.5",
      progressUnit: " credits ",
      priority: "high",
      notes: "  finish modules  ",
      unknownSafeField: "kept",
    });

    expect(metadata.goalTitle).toBe("Degree plan");
    expect(metadata.goalStatus).toBe("active");
    expect(metadata.goalHorizon).toBe("long-term");
    expect(metadata.targetDate).toBe("2027-12-31");
    expect(metadata.progressValue).toBe(42.5);
    expect(metadata.progressUnit).toBe("credits");
    expect(metadata.priority).toBe("high");
    expect(metadata.notes).toBe("finish modules");
    expect(metadata.unknownSafeField).toBe("kept");
  });

  it("updates metadata while preserving unrelated safe fields", () => {
    const metadata = updateGoalMetadata(
      {
        goalTitle: "Old goal",
        goalStatus: "active",
        customSafeField: "kept",
      },
      {
        goalTitle: "New goal",
        goalStatus: "paused",
      },
    );

    expect(metadata.goalTitle).toBe("New goal");
    expect(metadata.goalStatus).toBe("paused");
    expect(metadata.customSafeField).toBe("kept");
  });

  it("dedupes relation IDs and exposes graph targets including tracker links", () => {
    expect(normalizeGoalRelationIds(["tracker-1", " tracker-1 ", "bad id", "project:2"])).toEqual([
      "tracker-1",
      "project:2",
    ]);

    const metadata = normalizeGoalMetadata({
      linkedProjectIds: ["project-1", "project-1"],
      linkedTaskIds: ["task-1"],
      linkedTrackerIds: ["tracker-1"],
      linkedPersonIds: ["person-1"],
      linkedDocumentIds: ["doc-1"],
      linkedFinanceIds: ["finance-1"],
    });

    expect(getGoalGraphTargets(metadata)).toEqual([
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
        targetId: "tracker-1",
        sourceField: "linkedTrackerIds",
        edgeType: "tracker-link",
        label: "Linked tracker",
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

  it("creates provider-compatible goal input", () => {
    const input = createGoalRecordInput({
      title: "Finish degree",
      status: "active",
      horizon: "long-term",
      targetDate: "2027-12-31",
      progressValue: "24",
      progressUnit: "credits",
      priority: "high",
      parentId: "space-goals",
      tags: ["university"],
    });

    expect(input).toMatchObject({
      title: "Finish degree",
      category: "goals",
      type: "goal",
      icon: "G",
      status: "Active",
      parentId: "space-goals",
    });
    expect(input.tags).toEqual(["goal", "long-term", "university"]);
    expect(input.metadata?.goalTitle).toBe("Finish degree");
    expect(input.metadata?.progressValue).toBe(24);
  });

  it("detects goal records and normalizes older generic goal pages at read time", () => {
    expect(isGoalRecordItem(item())).toBe(true);
    expect(
      isGoalRecordItem(
        item({
          metadata: {
            promotedAsSpace: true,
            itemRole: "space",
          },
        }),
      ),
    ).toBe(false);

    const metadata = normalizeGoalMetadataForItem(
      item({
        title: "Legacy goal",
        status: "Active",
        tags: ["personal"],
      }),
    );

    expect(metadata.goalTitle).toBe("Legacy goal");
    expect(metadata.goalStatus).toBe("active");
    expect(metadata.tags).toEqual(["personal"]);
  });

  it("exposes display, state, privacy, and search metadata safely", () => {
    const metadata = createDefaultGoalMetadata({
      goalTitle: "Launch portfolio",
      goalStatus: "active",
      goalHorizon: "medium-term",
      targetDate: "2026-12-31",
      progressValue: 35,
      progressUnit: "%",
      priority: "high",
      linkedTrackerIds: ["tracker-1"],
      private: true,
    });

    expect(getGoalDisplayFields(metadata)).toMatchObject({
      title: "Launch portfolio",
      statusLabel: "Active",
      horizonLabel: "Medium-term",
      priorityLabel: "High",
      progressLabel: "35 %",
      relationCount: 1,
      private: true,
    });
    expect(getGoalStateSummary(metadata, "2027-01-01")).toMatchObject({
      overdue: true,
      relationCount: 1,
      metadataOnlyPrivacy: true,
    });
    expect(getGoalPrivacySummary(metadata).message).toContain("metadata only");
    expect(getGoalSearchMetadata(metadata).progress).toContain("35");
  });

  it("computes goal totals only from real active goal records", () => {
    const records = [
      item({
        id: "goal-active",
        metadata: createDefaultGoalMetadata({
          goalStatus: "active",
          priority: "high",
          targetDate: "2026-06-01",
        }),
      }),
      item({
        id: "goal-complete",
        metadata: createDefaultGoalMetadata({
          goalStatus: "completed",
          priority: "medium",
        }),
      }),
      item({
        id: "space-goals",
        metadata: { promotedAsSpace: true, itemRole: "space" },
      }),
      item({
        id: "note-1",
        category: "notes",
        type: "note",
        metadata: { goalStatus: "active" },
      }),
    ];

    expect(computeGoalTotals(records, "2026-06-03")).toMatchObject({
      recordCount: 2,
      activeCount: 1,
      completedCount: 1,
      overdueCount: 1,
      highPriorityCount: 1,
    });
  });

  it("keeps goal enum exports stable for UI option lists", () => {
    expect(GOAL_STATUS_VALUES).toContain("paused");
    expect(GOAL_STATUS_VALUES).toContain("completed");
    expect(GOAL_HORIZON_VALUES).toContain("short-term");
    expect(GOAL_HORIZON_VALUES).toContain("custom");
    expect(GOAL_PRIORITY_VALUES).toContain("urgent");
  });
});
