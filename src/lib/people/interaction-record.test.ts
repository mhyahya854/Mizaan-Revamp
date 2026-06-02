import { describe, expect, it } from "vitest";

import {
  createDefaultInteractionMetadata,
  createInteractionRecordInput,
  getInteractionDisplayFields,
  getInteractionGraphTargets,
  getInteractionStateSummary,
  normalizeInteractionMetadata,
  normalizeInteractionRelationIds,
  normalizeInteractionStatus,
  normalizeInteractionType,
  updateInteractionMetadata,
} from "./interaction-record";

describe("interaction record model", () => {
  it("creates default interaction metadata", () => {
    const metadata = createDefaultInteractionMetadata();

    expect(metadata).toMatchObject({
      interactionTitle: "Untitled interaction",
      interactionType: "note",
      interactionStatus: "logged",
      personId: "",
      interactionDate: "",
      summary: "",
      followUpNeeded: false,
      followUpDate: "",
      notes: "",
      private: false,
      sensitive: false,
      category: "people",
    });
    expect(metadata.linkedProjectIds).toEqual([]);
    expect(metadata.linkedTaskIds).toEqual([]);
    expect(metadata.linkedDocumentIds).toEqual([]);
    expect(metadata.linkedCalendarEventIds).toEqual([]);
  });

  it("normalizes minimal interaction metadata", () => {
    const metadata = normalizeInteractionMetadata({
      interactionTitle: "  Coffee catch-up  ",
      interactionType: "meeting",
      interactionStatus: "follow-up-needed",
      personId: " person-1 ",
      interactionDate: "2026-06-02",
      followUpNeeded: "true",
      followUpDate: "2026-06-10",
    });

    expect(metadata.interactionTitle).toBe("Coffee catch-up");
    expect(metadata.interactionType).toBe("meeting");
    expect(metadata.interactionStatus).toBe("follow-up-needed");
    expect(metadata.personId).toBe("person-1");
    expect(metadata.interactionDate).toBe("2026-06-02");
    expect(metadata.followUpNeeded).toBe(true);
    expect(metadata.followUpDate).toBe("2026-06-10");
  });

  it("normalizes invalid interaction type and status safely", () => {
    expect(normalizeInteractionType("lunch")).toBe("other");
    expect(normalizeInteractionStatus("pending")).toBe("logged");
  });

  it("normalizes personId and date fields safely", () => {
    const metadata = normalizeInteractionMetadata({
      personId: "bad id",
      interactionDate: "not-a-date",
      followUpDate: "2026-06-30",
    });

    expect(metadata.personId).toBe("");
    expect(metadata.interactionDate).toBe("");
    expect(metadata.followUpDate).toBe("2026-06-30");
  });

  it("trims strings, normalizes booleans, and preserves unknown safe fields", () => {
    const metadata = normalizeInteractionMetadata({
      interactionTitle: "  Call  ",
      summary: "  Summary  ",
      notes: "  Notes  ",
      private: "true",
      sensitive: 1,
      customField: "keep",
      unsafeFunction: () => "drop",
    });

    expect(metadata.interactionTitle).toBe("Call");
    expect(metadata.summary).toBe("Summary");
    expect(metadata.notes).toBe("Notes");
    expect(metadata.private).toBe(true);
    expect(metadata.sensitive).toBe(true);
    expect(metadata.customField).toBe("keep");
    expect(metadata.unsafeFunction).toBeUndefined();
  });

  it("updates metadata while preserving unrelated fields", () => {
    const updated = updateInteractionMetadata(
      {
        interactionTitle: "Original",
        interactionType: "call",
        customField: "preserve",
      },
      {
        interactionTitle: "Updated",
        interactionStatus: "closed",
      },
    );

    expect(updated.interactionTitle).toBe("Updated");
    expect(updated.interactionType).toBe("call");
    expect(updated.interactionStatus).toBe("closed");
    expect(updated.customField).toBe("preserve");
  });

  it("dedupes relation IDs and removes invalid relation IDs", () => {
    const metadata = normalizeInteractionMetadata({
      linkedProjectIds: ["project-1", "project-1", "bad id"],
      linkedTaskIds: ["task-1", undefined, " task-2 "],
      linkedDocumentIds: ["doc-1", "doc-1"],
      linkedCalendarEventIds: ["event-1", "event/2"],
    });

    expect(metadata.linkedProjectIds).toEqual(["project-1"]);
    expect(metadata.linkedTaskIds).toEqual(["task-1", "task-2"]);
    expect(metadata.linkedDocumentIds).toEqual(["doc-1"]);
    expect(metadata.linkedCalendarEventIds).toEqual(["event-1"]);
    expect(normalizeInteractionRelationIds(["person-1", "person-1", "bad id"])).toEqual([
      "person-1",
    ]);
  });

  it("creates provider-compatible interaction item input", () => {
    const input = createInteractionRecordInput({
      title: "Call with Ada",
      type: "call",
      status: "follow-up-needed",
      personId: "person-1",
      interactionDate: "2026-06-02",
      summary: "Discussed research notes",
      followUpNeeded: true,
      followUpDate: "2026-06-09",
      tags: ["relationship"],
    });

    expect(input).toMatchObject({
      title: "Call with Ada",
      category: "people",
      type: "interaction",
      icon: "I",
      status: "Follow-up needed",
      parentId: "person-1",
      summary: "Discussed research notes",
    });
    expect(input.tags).toEqual(["interaction", "relationship"]);
    expect(input.properties).toMatchObject({
      interactionType: "Call",
      interactionStatus: "Follow-up needed",
      personId: "person-1",
      interactionDate: "2026-06-02",
      followUpDate: "2026-06-09",
      private: false,
      sensitive: false,
    });
    expect(input.metadata).toMatchObject({
      interactionTitle: "Call with Ada",
      interactionType: "call",
      interactionStatus: "follow-up-needed",
      personId: "person-1",
    });
  });

  it("derives display and state summaries from normalized metadata", () => {
    const metadata = normalizeInteractionMetadata({
      interactionTitle: "Meeting",
      interactionType: "meeting",
      interactionStatus: "follow-up-needed",
      personId: "person-1",
      followUpNeeded: true,
      linkedProjectIds: ["project-1"],
      linkedTaskIds: ["task-1"],
    });

    expect(getInteractionDisplayFields(metadata)).toMatchObject({
      title: "Meeting",
      typeLabel: "Meeting",
      statusLabel: "Follow-up needed",
      personId: "person-1",
      projectCount: 1,
      taskCount: 1,
    });
    expect(getInteractionStateSummary(metadata)).toMatchObject({
      typeLabel: "Meeting",
      statusLabel: "Follow-up needed",
      followUpNeeded: true,
      relationCount: 3,
      private: false,
      sensitive: false,
    });
  });

  it("extracts graph targets from person and linked relation IDs", () => {
    const targets = getInteractionGraphTargets({
      personId: "person-1",
      linkedProjectIds: ["project-1"],
      linkedTaskIds: ["task-1"],
      linkedDocumentIds: ["doc-1"],
      linkedCalendarEventIds: ["event-1"],
    });

    expect(targets).toEqual([
      {
        targetId: "person-1",
        sourceField: "personId",
        edgeType: "person-link",
        label: "Person",
      },
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
        targetId: "doc-1",
        sourceField: "linkedDocumentIds",
        edgeType: "document-link",
        label: "Linked document",
      },
      {
        targetId: "event-1",
        sourceField: "linkedCalendarEventIds",
        edgeType: "calendar-link",
        label: "Linked calendar event",
      },
    ]);
  });
});
