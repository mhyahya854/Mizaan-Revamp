// @ts-nocheck
import { describe, expect, it } from "vitest";

import type { MizaanItem } from "../vault/types";
import { createPageFromTemplate } from "../page/page-workspace";
import {
  LocalStorageVaultProvider,
  createMemoryStorage,
} from "../vault/local-storage-vault-provider";
import {
  createDefaultProjectMetadata,
  createProjectRecordInput,
  getProjectDisplayFields,
  getProjectGraphRelationTargets,
  getProjectStateSummary,
  isProjectRecordItem,
  normalizeProjectMetadata,
  normalizeProjectPriority,
  normalizeProjectRelationIds,
  normalizeProjectStatus,
  updateProjectMetadata,
} from "./project-record";

describe("project metadata helpers", () => {
  it(``, async () => {
    const metadata = createDefaultProjectMetadata();

    expect(metadata).toMatchObject({
      projectTitle: "Untitled project",
      projectStatus: "planning",
      projectPriority: "none",
      projectOwner: "",
      projectStartDate: "",
      projectDeadline: "",
      projectArea: "",
      projectDescription: "",
      category: "projects",
      notes: "",
    });
    expect(metadata.linkedTaskIds).toEqual([]);
    expect(metadata.linkedDocumentIds).toEqual([]);
    expect(metadata.linkedPersonIds).toEqual([]);
    expect(metadata.linkedFinanceIds).toEqual([]);
    expect(metadata.linkedCalendarEventIds).toEqual([]);
    expect(metadata.linkedGoalIds).toEqual([]);
  });

  it(``, async () => {
    const metadata = normalizeProjectMetadata({ projectTitle: "  Renovation  " });

    expect(metadata.projectTitle).toBe("Renovation");
    expect(metadata.projectStatus).toBe("planning");
    expect(metadata.projectPriority).toBe("none");
    expect(metadata.projectDeadline).toBe("");
  });

  it(``, async () => {
    expect(normalizeProjectStatus("started")).toBe("planning");
    expect(normalizeProjectStatus("in-progress")).toBe("active");
    expect(normalizeProjectStatus("ACTIVE")).toBe("active");
    expect(normalizeProjectPriority("critical")).toBe("none");
    expect(normalizeProjectPriority("HIGH")).toBe("high");
  });

  it(``, async () => {
    const metadata = normalizeProjectMetadata({
      projectTitle: "  Study plan  ",
      projectOwner: "  Yahya  ",
      projectArea: "  Personal  ",
      projectDescription: "  Finish the scoped work.  ",
      projectStartDate: " 2026-06-02 ",
      projectDeadline: "not-a-date",
      notes: "  Keep this local.  ",
    });

    expect(metadata.projectTitle).toBe("Study plan");
    expect(metadata.projectOwner).toBe("Yahya");
    expect(metadata.projectArea).toBe("Personal");
    expect(metadata.projectDescription).toBe("Finish the scoped work.");
    expect(metadata.projectStartDate).toBe("2026-06-02");
    expect(metadata.projectDeadline).toBe("");
    expect(metadata.notes).toBe("Keep this local.");
  });

  it(``, async () => {
    const metadata = normalizeProjectMetadata({
      projectTitle: "Known",
      retainedCustomField: "keep",
      retainedNested: { source: "manual" },
    });

    expect(metadata.retainedCustomField).toBe("keep");
    expect(metadata.retainedNested).toEqual({ source: "manual" });
  });

  it(``, async () => {
    const current = normalizeProjectMetadata({
      projectTitle: "Old",
      projectStatus: "active",
      retainedCustomField: "keep",
    });

    const next = updateProjectMetadata(current, {
      projectPriority: "urgent",
      projectDeadline: "2026-08-01",
    });

    expect(next.projectTitle).toBe("Old");
    expect(next.projectStatus).toBe("active");
    expect(next.projectPriority).toBe("urgent");
    expect(next.projectDeadline).toBe("2026-08-01");
    expect(next.retainedCustomField).toBe("keep");
  });

  it(``, async () => {
    expect(
      normalizeProjectRelationIds([" task-1 ", "task-1", "", "bad id", "doc-1", null]),
    ).toEqual(["task-1", "doc-1"]);

    const metadata = normalizeProjectMetadata({
      linkedTaskIds: ["task-1", "task-1", "bad id"],
      linkedDocumentIds: ["doc-1", undefined, "doc-1"],
      linkedPersonIds: ["person-1"],
      linkedFinanceIds: ["finance-1", " finance-2 "],
      linkedCalendarEventIds: ["calendar-1", "bad/id"],
      linkedGoalIds: ["goal-1", "goal-1"],
    });

    expect(metadata.linkedTaskIds).toEqual(["task-1"]);
    expect(metadata.linkedDocumentIds).toEqual(["doc-1"]);
    expect(metadata.linkedPersonIds).toEqual(["person-1"]);
    expect(metadata.linkedFinanceIds).toEqual(["finance-1", "finance-2"]);
    expect(metadata.linkedCalendarEventIds).toEqual(["calendar-1"]);
    expect(metadata.linkedGoalIds).toEqual(["goal-1"]);
  });

  it(``, async () => {
    const input = createProjectRecordInput({
      title: "Research Sprint",
      status: "active",
      priority: "high",
      deadline: "2026-09-10",
      area: "Study",
      tags: ["research"],
    });

    expect(input).toMatchObject({
      title: "Research Sprint",
      category: "projects",
      type: "project",
      icon: "P",
      status: "Active",
      tags: ["project", "research"],
    });
    expect(input.metadata).toMatchObject({
      projectTitle: "Research Sprint",
      projectStatus: "active",
      projectPriority: "high",
      projectDeadline: "2026-09-10",
      projectArea: "Study",
    });
    expect(input.properties).toMatchObject({
      status: "Active",
      priority: "High",
      deadline: "2026-09-10",
      area: "Study",
    });
  });

  it(``, async () => {
    const record = item({ id: "project-1", title: "Project" });
    const space = item({
      id: "space-projects",
      title: "Projects",
      metadata: { promotedAsSpace: true, itemRole: "space" },
    });

    expect(isProjectRecordItem(record)).toBe(true);
    expect(isProjectRecordItem(space)).toBe(false);
  });

  it(``, async () => {
    const metadata = normalizeProjectMetadata({
      projectTitle: "Launch",
      projectStatus: "blocked",
      projectPriority: "urgent",
      linkedTaskIds: ["task-1", "task-2"],
    });

    expect(getProjectDisplayFields(metadata)).toMatchObject({
      title: "Launch",
      statusLabel: "Blocked",
      priorityLabel: "Urgent",
      taskCount: 2,
    });
    expect(getProjectStateSummary(metadata)).toMatchObject({
      relationCount: 2,
      linkedTaskCount: 2,
      completedTaskCount: 0,
      hasComputedProgress: false,
    });
  });

  it(``, async () => {
    const metadata = normalizeProjectMetadata({
      linkedTaskIds: ["task-1", "task-1"],
      linkedDocumentIds: ["doc-1"],
      linkedPersonIds: ["person-1"],
      linkedFinanceIds: ["finance-1"],
      linkedCalendarEventIds: ["calendar-1"],
      linkedGoalIds: ["goal-1"],
    });

    expect(getProjectGraphRelationTargets(metadata)).toEqual([
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
        targetId: "person-1",
        sourceField: "linkedPersonIds",
        edgeType: "person-link",
        label: "Linked person",
      },
      {
        targetId: "finance-1",
        sourceField: "linkedFinanceIds",
        edgeType: "finance-link",
        label: "Linked finance",
      },
      {
        targetId: "calendar-1",
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
    const input = createProjectRecordInput({
      title: "Capstone Build",
      status: "paused",
      priority: "medium",
      area: "University",
      description: "Local project metadata search proof",
    });

    expect(JSON.stringify(input.metadata)).toContain("Capstone Build");
    expect(JSON.stringify(input.metadata)).toContain("paused");
    expect(JSON.stringify(input.metadata)).toContain("medium");
    expect(JSON.stringify(input.metadata)).toContain("University");
  });

  it(``, async () => {
    const provider = new LocalStorageVaultProvider({
      storage: createMemoryStorage(),
      now: () => "2026-06-02T00:00:00.000Z",
      seedOnEmpty: false,
    });

    const project = await createPageFromTemplate(provider, "research-project");

    expect(project.category).toBe("projects");
    expect(project.type).toBe("project");
    expect(project.status).toBe("Planning");
    expect(project.metadata.projectStatus).toBe("planning");
    expect(project.metadata.projectPriority).toBe("medium");
    expect(project.metadata.projectArea).toBe("Research");
    expect((await provider.getBlocks(project.id)).some((block) => block.type === "heading1")).toBe(true);
  });
});

function item(input: Partial<MizaanItem> & Pick<MizaanItem, "id" | "title">): MizaanItem {
  return {
    type: "project",
    category: "projects",
    icon: "P",
    summary: "",
    status: "Active",
    tags: [],
    createdAt: "2026-06-02T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z",
    properties: {},
    attachedFiles: [],
    metadata: {},
    ...input,
  };
}




