import { describe, expect, it } from "vitest";

import type { MizaanItem } from "../vault/types";
import { createPageFromTemplate } from "../page/page-workspace";
import {
  LocalStorageVaultProvider,
  createMemoryStorage,
} from "../vault/local-storage-vault-provider";
import {
  createDefaultTaskMetadata,
  createTaskRecordInput,
  computeTaskTotals,
  getTaskDisplayFields,
  getTaskGraphRelationTargets,
  getTaskStateSummary,
  isTaskCompleted,
  isTaskOverdue,
  isTaskRecordItem,
  normalizeTaskMetadata,
  normalizeTaskPriority,
  normalizeTaskProjectId,
  normalizeTaskRelationIds,
  normalizeTaskStatus,
  updateTaskMetadata,
} from "./task-record";

describe("task metadata helpers", () => {
  it(``, async () => {
    const metadata = createDefaultTaskMetadata();

    expect(metadata).toMatchObject({
      taskTitle: "Untitled task",
      taskStatus: "todo",
      taskPriority: "none",
      taskStartDate: "",
      taskDueDate: "",
      taskCompletedAt: "",
      taskProjectId: "",
      category: "tasks",
      notes: "",
    });
    expect(metadata.linkedPageIds).toEqual([]);
    expect(metadata.linkedDocumentIds).toEqual([]);
    expect(metadata.linkedPersonIds).toEqual([]);
    expect(metadata.linkedFinanceIds).toEqual([]);
    expect(metadata.linkedCalendarEventIds).toEqual([]);
  });

  it(``, async () => {
    const metadata = normalizeTaskMetadata({ taskTitle: "  Call supplier  " });

    expect(metadata.taskTitle).toBe("Call supplier");
    expect(metadata.taskStatus).toBe("todo");
    expect(metadata.taskPriority).toBe("none");
    expect(metadata.taskDueDate).toBe("");
  });

  it(``, async () => {
    expect(normalizeTaskStatus("started")).toBe("todo");
    expect(normalizeTaskStatus("IN-PROGRESS")).toBe("in-progress");
    expect(normalizeTaskPriority("critical")).toBe("none");
    expect(normalizeTaskPriority("URGENT")).toBe("urgent");
  });

  it(``, async () => {
    const metadata = normalizeTaskMetadata({
      taskTitle: "  Draft proposal  ",
      notes: "  Needs real scope.  ",
      taskStartDate: " 2026-06-02 ",
      taskDueDate: "2026-06-10",
      taskCompletedAt: "not-a-date",
    });

    expect(metadata.taskTitle).toBe("Draft proposal");
    expect(metadata.notes).toBe("Needs real scope.");
    expect(metadata.taskStartDate).toBe("2026-06-02");
    expect(metadata.taskDueDate).toBe("2026-06-10");
    expect(metadata.taskCompletedAt).toBe("");
  });

  it(``, async () => {
    const metadata = normalizeTaskMetadata({
      taskTitle: "Known",
      retainedCustomField: "keep",
      retainedNested: { source: "manual" },
    });

    expect(metadata.retainedCustomField).toBe("keep");
    expect(metadata.retainedNested).toEqual({ source: "manual" });
  });

  it(``, async () => {
    const current = normalizeTaskMetadata({
      taskTitle: "Old",
      taskStatus: "todo",
      retainedCustomField: "keep",
    });

    const next = updateTaskMetadata(current, {
      taskStatus: "done",
      taskCompletedAt: "2026-06-12",
    });

    expect(next.taskTitle).toBe("Old");
    expect(next.taskStatus).toBe("done");
    expect(next.taskCompletedAt).toBe("2026-06-12");
    expect(next.retainedCustomField).toBe("keep");
  });

  it(``, async () => {
    expect(normalizeTaskProjectId(" project-1 ")).toBe("project-1");
    expect(normalizeTaskProjectId("bad id")).toBe("");
    expect(normalizeTaskRelationIds([" doc-1 ", "doc-1", "", "bad id", null])).toEqual(["doc-1"]);

    const metadata = normalizeTaskMetadata({
      taskProjectId: " project-1 ",
      linkedPageIds: ["page-1", "page-1", "bad id"],
      linkedDocumentIds: ["doc-1", undefined, "doc-1"],
      linkedPersonIds: ["person-1"],
      linkedFinanceIds: ["finance-1", " finance-2 "],
      linkedCalendarEventIds: ["calendar-1", "bad/id"],
    });

    expect(metadata.taskProjectId).toBe("project-1");
    expect(metadata.linkedPageIds).toEqual(["page-1"]);
    expect(metadata.linkedDocumentIds).toEqual(["doc-1"]);
    expect(metadata.linkedPersonIds).toEqual(["person-1"]);
    expect(metadata.linkedFinanceIds).toEqual(["finance-1", "finance-2"]);
    expect(metadata.linkedCalendarEventIds).toEqual(["calendar-1"]);
  });

  it(``, async () => {
    const done = normalizeTaskMetadata({ taskStatus: "done", taskDueDate: "2026-06-01" });
    const overdue = normalizeTaskMetadata({ taskStatus: "todo", taskDueDate: "2026-06-01" });
    const future = normalizeTaskMetadata({ taskStatus: "todo", taskDueDate: "2026-06-05" });

    expect(isTaskCompleted(done)).toBe(true);
    expect(isTaskCompleted(overdue)).toBe(false);
    expect(isTaskOverdue(overdue, "2026-06-02")).toBe(true);
    expect(isTaskOverdue(future, "2026-06-02")).toBe(false);
    expect(isTaskOverdue(done, "2026-06-02")).toBe(false);
  });

  it(``, async () => {
    const input = createTaskRecordInput({
      title: "Write methods section",
      status: "in-progress",
      priority: "high",
      dueDate: "2026-06-12",
      projectId: "project-1",
      tags: ["research"],
    });

    expect(input).toMatchObject({
      title: "Write methods section",
      category: "tasks",
      type: "task",
      icon: "T",
      status: "In progress",
      tags: ["task", "research"],
      parentId: "project-1",
    });
    expect(input.metadata).toMatchObject({
      taskTitle: "Write methods section",
      taskStatus: "in-progress",
      taskPriority: "high",
      taskDueDate: "2026-06-12",
      taskProjectId: "project-1",
    });
    expect(input.properties).toMatchObject({
      status: "In progress",
      priority: "High",
      dueDate: "2026-06-12",
      projectId: "project-1",
    });
  });

  it(``, async () => {
    expect(isTaskRecordItem(item({ id: "task-1", title: "Task" }))).toBe(true);
    expect(
      isTaskRecordItem(
        item({
          id: "note-1",
          title: "Note",
          category: "notes" as MizaanItem["category"],
          type: "note" as MizaanItem["type"],
        }),
      ),
    ).toBe(false);
  });

  it(``, async () => {
    const metadata = normalizeTaskMetadata({
      taskTitle: "Review",
      taskStatus: "waiting",
      taskPriority: "urgent",
      taskDueDate: "2026-06-01",
      taskProjectId: "project-1",
    });

    expect(getTaskDisplayFields(metadata)).toMatchObject({
      title: "Review",
      statusLabel: "Waiting",
      priorityLabel: "Urgent",
      dueDate: "2026-06-01",
      projectId: "project-1",
    });
    expect(getTaskStateSummary(metadata, "2026-06-02")).toMatchObject({
      completed: false,
      overdue: true,
      relationCount: 1,
    });
  });

  it(``, async () => {
    const metadata = normalizeTaskMetadata({
      taskProjectId: "project-1",
      linkedPageIds: ["page-1", "page-1"],
      linkedDocumentIds: ["doc-1"],
      linkedPersonIds: ["person-1"],
      linkedFinanceIds: ["finance-1"],
      linkedCalendarEventIds: ["calendar-1"],
    });

    expect(getTaskGraphRelationTargets(metadata)).toEqual([
      {
        targetId: "project-1",
        sourceField: "taskProjectId",
        edgeType: "project-link",
        label: "Project",
      },
      {
        targetId: "page-1",
        sourceField: "linkedPageIds",
        edgeType: "page-link",
        label: "Linked page",
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
    ]);
  });

  it(``, async () => {
    const input = createTaskRecordInput({
      title: "Literature review",
      status: "blocked",
      priority: "medium",
      dueDate: "2026-06-30",
      notes: "Waiting on local notes",
    });

    expect(JSON.stringify(input.metadata)).toContain("Literature review");
    expect(JSON.stringify(input.metadata)).toContain("blocked");
    expect(JSON.stringify(input.metadata)).toContain("medium");
    expect(JSON.stringify(input.metadata)).toContain("2026-06-30");
  });

  it(``, async () => {
    const records = [
      item({
        id: "task-1",
        title: "Linked overdue",
        status: "Todo",
        metadata: {
          taskStatus: "todo",
          taskPriority: "urgent",
          taskDueDate: "2026-06-01",
          taskProjectId: "project-1",
        },
      }),
      item({
        id: "task-2",
        title: "In progress",
        status: "In progress",
        metadata: {
          taskStatus: "in-progress",
          taskPriority: "medium",
          taskDueDate: "2026-06-10",
        },
      }),
      item({
        id: "task-3",
        title: "Done",
        status: "Done",
        metadata: {
          taskStatus: "done",
          taskCompletedAt: "2026-06-02",
        },
      }),
    ];

    expect(computeTaskTotals(records, "2026-06-02")).toMatchObject({
      recordCount: 3,
      linkedProjectCount: 1,
      unlinkedCount: 2,
      activeCount: 2,
      completedCount: 1,
      overdueCount: 1,
      highPriorityCount: 1,
      byStatus: {
        todo: 1,
        "in-progress": 1,
        waiting: 0,
        blocked: 0,
        done: 1,
        archived: 0,
      },
    });
  });

  it(``, async () => {
    const provider = new LocalStorageVaultProvider({
      storage: createMemoryStorage(),
      now: () => "2026-06-02T00:00:00.000Z",
      seedOnEmpty: false,
    });

    const task = await createPageFromTemplate(provider, "task-record");

    expect(task.category).toBe("tasks");
    expect(task.type).toBe("task");
    expect(task.status).toBe("Todo");
    expect(task.metadata.taskStatus).toBe("todo");
    expect(task.metadata.taskPriority).toBe("none");
    expect(task.metadata.taskProjectId).toBe("");
    expect((await provider.getBlocks(task.id)).some((block) => block.type === "callout")).toBe(
      true,
    );
  });
});

function item(input: Partial<MizaanItem> & Pick<MizaanItem, "id" | "title">): MizaanItem {
  return {
    type: "task",
    category: "tasks",
    icon: "T",
    summary: "",
    status: "Todo",
    tags: [],
    createdAt: "2026-06-02T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z",
    properties: {},
    attachedFiles: [],
    metadata: {},
    ...input,
  };
}
