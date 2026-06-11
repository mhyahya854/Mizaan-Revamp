import { describe, expect, it } from "vitest";

import {
  createDefaultPersonMetadata,
  createPersonRecordInput,
  getPersonDisplayFields,
  getPersonGraphTargets,
  getPersonPrivacySummary,
  getPersonSearchMetadata,
  getPersonStateSummary,
  isPersonPrivate,
  isPersonSensitive,
  normalizeFollowUpStatus,
  normalizePersonMetadata,
  normalizePersonRelationIds,
  normalizePreferredContactMethod,
  normalizeRelationshipStatus,
  normalizeRelationshipType,
  updatePersonMetadata,
} from "./person-record";

describe("person record model", () => {
  it(``, async () => {
    const metadata = createDefaultPersonMetadata();

    expect(metadata).toMatchObject({
      displayName: "Untitled person",
      legalName: "",
      preferredName: "",
      relationshipType: "unknown",
      relationshipStatus: "unknown",
      preferredContactMethod: "unknown",
      followUpStatus: "none",
      private: false,
      sensitive: false,
      category: "people",
    });
    expect(metadata.aliases).toEqual([]);
    expect(metadata.linkedProjectIds).toEqual([]);
    expect(metadata.linkedTaskIds).toEqual([]);
    expect(metadata.linkedDocumentIds).toEqual([]);
    expect(metadata.linkedFinanceIds).toEqual([]);
    expect(metadata.linkedCalendarEventIds).toEqual([]);
    expect(metadata.linkedGoalIds).toEqual([]);
    expect(metadata.tags).toEqual([]);
  });

  it(``, async () => {
    const metadata = normalizePersonMetadata({
      displayName: "  Ada Lovelace  ",
      relationshipType: "mentor",
      relationshipStatus: "follow-up",
      preferredContactMethod: "email",
      followUpStatus: "scheduled",
    });

    expect(metadata.displayName).toBe("Ada Lovelace");
    expect(metadata.relationshipType).toBe("mentor");
    expect(metadata.relationshipStatus).toBe("follow-up");
    expect(metadata.preferredContactMethod).toBe("email");
    expect(metadata.followUpStatus).toBe("scheduled");
  });

  it(``, async () => {
    expect(normalizeRelationshipType("coworker")).toBe("unknown");
    expect(normalizeRelationshipStatus("pending")).toBe("unknown");
    expect(normalizePreferredContactMethod("fax")).toBe("unknown");
    expect(normalizeFollowUpStatus("later")).toBe("none");
  });

  it(``, async () => {
    const metadata = normalizePersonMetadata({
      displayName: "  Yahya  ",
      legalName: "  Yahya M.  ",
      preferredName: "  Y  ",
      whereKnownFrom: "  University  ",
      organization: "  Mizaan  ",
      roleTitle: "  Builder  ",
      locationNote: "  Malaysia  ",
      primaryEmail: "  user@example.test  ",
      primaryPhone: "  +60 123  ",
      notes: "  Notes  ",
      context: "  Context  ",
      boundaries: "  Boundaries  ",
      aliases: [" Yahya ", "Yahya", "", " Y "],
      tags: [" crm ", "crm", " friend "],
    });

    expect(metadata.displayName).toBe("Yahya");
    expect(metadata.legalName).toBe("Yahya M.");
    expect(metadata.preferredName).toBe("Y");
    expect(metadata.whereKnownFrom).toBe("University");
    expect(metadata.organization).toBe("Mizaan");
    expect(metadata.roleTitle).toBe("Builder");
    expect(metadata.locationNote).toBe("Malaysia");
    expect(metadata.primaryEmail).toBe("user@example.test");
    expect(metadata.primaryPhone).toBe("+60 123");
    expect(metadata.notes).toBe("Notes");
    expect(metadata.context).toBe("Context");
    expect(metadata.boundaries).toBe("Boundaries");
    expect(metadata.aliases).toEqual(["Yahya", "Y"]);
    expect(metadata.tags).toEqual(["crm", "friend"]);
  });

  it(``, async () => {
    const metadata = normalizePersonMetadata({
      displayName: "Person",
      customString: "kept",
      customNumber: 7,
      customBoolean: true,
      customArray: ["a", 1, false],
      unsafeFunction: () => "drop",
    });

    expect(metadata.customString).toBe("kept");
    expect(metadata.customNumber).toBe(7);
    expect(metadata.customBoolean).toBe(true);
    expect(metadata.customArray).toEqual(["a", 1, false]);
    expect(metadata.unsafeFunction).toBeUndefined();
  });

  it(``, async () => {
    const updated = updatePersonMetadata(
      {
        displayName: "Original",
        relationshipType: "friend",
        customField: "preserve",
      },
      {
        displayName: "Updated",
        relationshipStatus: "close",
      },
    );

    expect(updated.displayName).toBe("Updated");
    expect(updated.relationshipType).toBe("friend");
    expect(updated.relationshipStatus).toBe("close");
    expect(updated.customField).toBe("preserve");
  });

  it(``, async () => {
    const metadata = normalizePersonMetadata({
      linkedProjectIds: ["project-1", "project-1", "bad id"],
      linkedTaskIds: ["task-1", undefined, " task-2 "],
      linkedDocumentIds: ["doc-1", "doc-1"],
      linkedFinanceIds: ["finance-1"],
      linkedCalendarEventIds: ["calendar-1", "calendar/2"],
      linkedGoalIds: ["goal-1"],
    });

    expect(metadata.linkedProjectIds).toEqual(["project-1"]);
    expect(metadata.linkedTaskIds).toEqual(["task-1", "task-2"]);
    expect(metadata.linkedDocumentIds).toEqual(["doc-1"]);
    expect(metadata.linkedFinanceIds).toEqual(["finance-1"]);
    expect(metadata.linkedCalendarEventIds).toEqual(["calendar-1"]);
    expect(metadata.linkedGoalIds).toEqual(["goal-1"]);
    expect(normalizePersonRelationIds(["person-1", "person-1", "bad id"])).toEqual(["person-1"]);
  });

  it(``, async () => {
    const metadata = normalizePersonMetadata({
      lastInteractionDate: "2026-06-01",
      nextFollowUpDate: "not-a-date",
      birthday: "2026-02-30",
      private: "true",
      sensitive: 1,
    });

    expect(metadata.lastInteractionDate).toBe("2026-06-01");
    expect(metadata.nextFollowUpDate).toBe("");
    expect(metadata.birthday).toBe("2026-02-30");
    expect(metadata.private).toBe(true);
    expect(metadata.sensitive).toBe(true);
    expect(isPersonPrivate(metadata)).toBe(true);
    expect(isPersonSensitive(metadata)).toBe(true);
  });

  it(``, async () => {
    const summary = getPersonPrivacySummary({ private: true, sensitive: true });

    expect(summary.private).toBe(true);
    expect(summary.sensitive).toBe(true);
    expect(summary.metadataOnly).toBe(true);
    expect(summary.encrypted).toBe(false);
    expect(summary.hiddenFromSearch).toBe(false);
    expect(summary.hiddenFromGraph).toBe(false);
    expect(summary.message).toContain("metadata only");
    expect(summary.message).toContain("not encrypted");
  });

  it(``, async () => {
    const input = createPersonRecordInput({
      displayName: "Ada Lovelace",
      relationshipType: "mentor",
      relationshipStatus: "follow-up",
      organization: "Analytical Engine",
      roleTitle: "Researcher",
      nextFollowUpDate: "2026-06-20",
      tags: ["math"],
    });

    expect(input).toMatchObject({
      title: "Ada Lovelace",
      category: "people",
      type: "person",
      icon: "U",
      status: "Follow-up",
    });
    expect(input.tags).toEqual(["person", "math"]);
    expect(input.properties).toMatchObject({
      relationshipType: "Mentor",
      relationshipStatus: "Follow-up",
      organization: "Analytical Engine",
      roleTitle: "Researcher",
      nextFollowUpDate: "2026-06-20",
      private: false,
      sensitive: false,
    });
    expect(input.metadata).toMatchObject({
      displayName: "Ada Lovelace",
      relationshipType: "mentor",
      relationshipStatus: "follow-up",
    });
  });

  it(``, async () => {
    const metadata = normalizePersonMetadata({
      displayName: "Ada",
      relationshipType: "friend",
      relationshipStatus: "active",
      preferredContactMethod: "message",
      whereKnownFrom: "School",
      organization: "Local group",
      linkedProjectIds: ["project-1"],
      linkedTaskIds: ["task-1"],
      private: true,
    });

    expect(getPersonDisplayFields(metadata)).toMatchObject({
      displayName: "Ada",
      relationshipTypeLabel: "Friend",
      relationshipStatusLabel: "Active",
      preferredContactMethodLabel: "Message",
      projectCount: 1,
      taskCount: 1,
      private: true,
    });
    expect(getPersonStateSummary(metadata)).toMatchObject({
      relationshipTypeLabel: "Friend",
      relationshipStatusLabel: "Active",
      followUpStatusLabel: "None",
      relationCount: 2,
      private: true,
    });
  });

  it(``, async () => {
    const targets = getPersonGraphTargets({
      linkedProjectIds: ["project-1", "project-1"],
      linkedTaskIds: ["task-1"],
      linkedDocumentIds: ["doc-1"],
      linkedFinanceIds: ["finance-1"],
      linkedCalendarEventIds: ["event-1"],
      linkedGoalIds: ["goal-1"],
    });

    expect(targets).toEqual([
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
        targetId: "finance-1",
        sourceField: "linkedFinanceIds",
        edgeType: "finance-link",
        label: "Linked finance",
      },
      {
        targetId: "event-1",
        sourceField: "linkedCalendarEventIds",
        edgeType: "calendar-link",
        label: "Linked calendar event",
      },
      {
        targetId: "goal-1",
        sourceField: "linkedGoalIds",
        edgeType: "goal-link",
        label: "Linked goal",
      },
    ]);
  });

  it(``, async () => {
    const search = getPersonSearchMetadata({
      displayName: "Ada Lovelace",
      legalName: "Augusta Ada King",
      preferredName: "Ada",
      aliases: ["Countess"],
      relationshipType: "mentor",
      relationshipStatus: "active",
      whereKnownFrom: "Research circle",
      organization: "Analytical Engine",
      roleTitle: "Mathematician",
      notes: "Graph and computation context",
      context: "Important local contact context",
    });

    expect(search.names).toEqual(["Ada Lovelace", "Augusta Ada King", "Ada", "Countess"]);
    expect(search.relationship).toContain("mentor");
    expect(search.relationship).toContain("active");
    expect(search.context).toContain("Research circle");
    expect(search.context).toContain("Analytical Engine");
    expect(search.notes).toContain("Graph and computation context");
    expect(search.privacy).toContain("metadata-only");
  });
});
