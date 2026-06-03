import { describe, expect, it } from "vitest";

import {
  buildGlobalGraph,
  buildLocalGraph,
  getGraphNodeType,
  type GraphEdgeType,
} from "./graph-model";
import { createDefaultGoalMetadata } from "../goals/goal-record";
import { createDefaultTrackerMetadata } from "../trackers/tracker-record";
import type { ItemCategory, ItemType, MizaanItem, MizaanRelation } from "../vault/types";

function item(
  id: string,
  input: Partial<MizaanItem> & { category?: ItemCategory; type?: ItemType } = {},
): MizaanItem {
  const category = input.category ?? "notes";
  return {
    id,
    type: input.type ?? "note",
    category,
    title: input.title ?? id,
    icon: input.icon ?? id.slice(0, 1).toUpperCase(),
    summary: input.summary ?? "",
    status: input.status ?? "Active",
    tags: input.tags ?? [],
    createdAt: input.createdAt ?? "2026-06-01T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-06-01T00:00:00.000Z",
    archivedAt: input.archivedAt,
    deletedAt: input.deletedAt,
    parentId: input.parentId,
    properties: input.properties ?? {},
    attachedFiles: input.attachedFiles ?? [],
    metadata: input.metadata ?? {},
  };
}

function relation(input: Partial<MizaanRelation> & Pick<MizaanRelation, "sourceId" | "targetId">) {
  return {
    id: input.id ?? `${input.sourceId}-${input.targetId}`,
    sourceId: input.sourceId,
    targetId: input.targetId,
    relationType: input.relationType ?? "related",
    label: input.label ?? "Related",
    createdAt: input.createdAt ?? "2026-06-01T00:00:00.000Z",
    metadata: input.metadata ?? {},
  };
}

describe("graph model", () => {
  it("creates graph nodes from active provider items with deterministic routes", () => {
    const graph = buildGlobalGraph({
      items: [
        item("note-1", { title: "Note" }),
        item("trash-1", { deletedAt: "2026-06-01T00:00:00.000Z" }),
      ],
      relations: [],
    });

    expect(graph.nodes).toHaveLength(1);
    expect(graph.nodes[0]).toMatchObject({
      id: "note-1",
      itemId: "note-1",
      label: "Note",
      route: "/page/note-1",
      type: "note",
      isOrphan: true,
      isBlueprintOnly: false,
    });
  });

  it.each([
    ["documents", "document", "document"],
    ["notes", "note", "note"],
    ["projects", "project", "project"],
    ["tasks", "task", "task"],
    ["people", "person", "person"],
    ["people", "interaction", "interaction"],
    ["finance", "finance", "finance"],
    ["calendar", "calendar", "calendar"],
    ["trackers", "tracker", "tracker"],
    ["goals", "goal", "goal"],
    ["databases", "database", "database"],
    ["templates", "template", "template"],
  ] satisfies Array<[ItemCategory, ItemType, ReturnType<typeof getGraphNodeType>]>)(
    "maps %s/%s items to %s graph nodes",
    (category, type, expected) => {
      expect(getGraphNodeType(item(`${category}-1`, { category, type }))).toBe(expected);
    },
  );

  it("handles unknown categories safely", () => {
    expect(
      getGraphNodeType(
        item("unknown-1", {
          category: "unknown" as ItemCategory,
          type: "unknown" as ItemType,
        }),
      ),
    ).toBe("unknown");
  });

  it("creates edges from document linkedPageIds and ignores invalid targets", () => {
    const graph = buildGlobalGraph({
      items: [
        item("doc-1", {
          category: "documents",
          type: "document",
          metadata: { linkedPageIds: ["page-1", "missing-page"] },
        }),
        item("page-1"),
      ],
      relations: [],
    });

    expect(graph.edges).toHaveLength(1);
    expect(graph.edges[0]).toMatchObject({
      id: "doc-1->page-1:page-link",
      sourceId: "doc-1",
      targetId: "page-1",
      type: "page-link",
      sourceField: "linkedPageIds",
      label: "Linked page",
    });
  });

  it.each([
    ["linkedProjectIds", "project-1", "project-link", "Linked project"],
    ["linkedPersonIds", "person-1", "person-link", "Linked person"],
    ["linkedFinanceIds", "finance-1", "finance-link", "Linked finance"],
  ] satisfies Array<[string, string, GraphEdgeType, string]>)(
    "creates edges from document %s",
    (field, targetId, edgeType, label) => {
      const graph = buildGlobalGraph({
        items: [
          item("doc-1", {
            category: "documents",
            type: "document",
            metadata: { [field]: [targetId] },
          }),
          item(targetId),
        ],
        relations: [],
      });

      expect(graph.edges).toHaveLength(1);
      expect(graph.edges[0]).toMatchObject({
        sourceId: "doc-1",
        targetId,
        type: edgeType,
        sourceField: field,
        label,
      });
    },
  );

  it("dedupes duplicate document relation IDs and duplicate provider edges", () => {
    const graph = buildGlobalGraph({
      items: [
        item("doc-1", {
          category: "documents",
          type: "document",
          metadata: { linkedPageIds: ["page-1", "page-1"] },
        }),
        item("page-1"),
      ],
      relations: [
        relation({ id: "rel-1", sourceId: "page-1", targetId: "doc-1" }),
        relation({ id: "rel-2", sourceId: "page-1", targetId: "doc-1" }),
      ],
    });

    expect(graph.edges.map((edge) => edge.id).sort()).toEqual([
      "doc-1->page-1:page-link",
      "page-1->doc-1:relation",
    ]);
  });

  it("marks orphan nodes and computes global graph summary", () => {
    const graph = buildGlobalGraph({
      items: [item("source"), item("target"), item("orphan")],
      relations: [relation({ sourceId: "source", targetId: "target" })],
    });

    expect(graph.nodes.find((node) => node.id === "orphan")?.isOrphan).toBe(true);
    expect(graph.nodes.find((node) => node.id === "source")?.isOrphan).toBe(false);
    expect(graph.summary).toMatchObject({
      nodeCount: 3,
      edgeCount: 1,
      orphanCount: 1,
      hasRelations: true,
      hasOnlyOrphans: false,
    });
    expect(graph.summary.typeCounts.note).toBe(3);
    expect(graph.summary.edgeTypeCounts.relation).toBe(1);
    expect(graph.summary.relationSourceCounts["provider-relations"]).toBe(1);
  });

  it("builds a local graph around the selected item and excludes unrelated nodes", () => {
    const graph = buildLocalGraph({
      selectedItemId: "center",
      items: [item("center"), item("outgoing"), item("incoming"), item("unrelated")],
      relations: [
        relation({ sourceId: "center", targetId: "outgoing" }),
        relation({ sourceId: "incoming", targetId: "center" }),
      ],
    });

    expect(graph.scope).toBe("local");
    expect(graph.selectedItemId).toBe("center");
    expect(graph.nodes.map((node) => node.id).sort()).toEqual(["center", "incoming", "outgoing"]);
    expect(graph.edges).toHaveLength(2);
  });

  it("handles empty item arrays and items with no edges without creating fake edges", () => {
    const emptyGraph = buildGlobalGraph({ items: [], relations: [] });
    const orphanGraph = buildGlobalGraph({ items: [item("only")], relations: [] });

    expect(emptyGraph.summary).toMatchObject({
      nodeCount: 0,
      edgeCount: 0,
      orphanCount: 0,
      hasRelations: false,
      hasOnlyOrphans: false,
    });
    expect(orphanGraph.edges).toEqual([]);
    expect(orphanGraph.summary.hasOnlyOrphans).toBe(true);
  });

  it("creates parent-child edges from real parentId hierarchy", () => {
    const graph = buildGlobalGraph({
      items: [item("parent"), item("child", { parentId: "parent" })],
      relations: [],
    });

    expect(graph.edges[0]).toMatchObject({
      id: "parent->child:parent-child",
      sourceId: "parent",
      targetId: "child",
      type: "parent-child",
      sourceField: "parentId",
      bidirectional: false,
    });
  });

  it("creates project-task edges from project linkedTaskIds", () => {
    const graph = buildGlobalGraph({
      items: [
        item("project-1", {
          category: "projects",
          type: "project",
          metadata: { linkedTaskIds: ["task-1"] },
        }),
        item("task-1", { category: "tasks", type: "task" }),
      ],
      relations: [],
    });

    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "project-1->task-1:task-link",
        sourceId: "project-1",
        targetId: "task-1",
        type: "task-link",
        sourceField: "linkedTaskIds",
        label: "Linked task",
      }),
    );
  });

  it("creates task-project edges from taskProjectId", () => {
    const graph = buildGlobalGraph({
      items: [
        item("project-1", { category: "projects", type: "project" }),
        item("task-1", {
          category: "tasks",
          type: "task",
          metadata: { taskProjectId: "project-1" },
        }),
      ],
      relations: [],
    });

    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "task-1->project-1:project-link",
        sourceId: "task-1",
        targetId: "project-1",
        type: "project-link",
        sourceField: "taskProjectId",
        label: "Project",
      }),
    );
  });

  it("creates project-document edges from project linkedDocumentIds", () => {
    const graph = buildGlobalGraph({
      items: [
        item("project-1", {
          category: "projects",
          type: "project",
          metadata: { linkedDocumentIds: ["doc-1"] },
        }),
        item("doc-1", { category: "documents", type: "document" }),
      ],
      relations: [],
    });

    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "project-1->doc-1:document-link",
        sourceId: "project-1",
        targetId: "doc-1",
        type: "document-link",
        sourceField: "linkedDocumentIds",
      }),
    );
  });

  it("dedupes duplicate project/task relation IDs and ignores invalid targets", () => {
    const graph = buildGlobalGraph({
      items: [
        item("project-1", {
          category: "projects",
          type: "project",
          metadata: { linkedTaskIds: ["task-1", "task-1", "bad id", "missing-task"] },
        }),
        item("task-1", {
          category: "tasks",
          type: "task",
          metadata: { taskProjectId: "project-1", linkedDocumentIds: ["missing-doc"] },
        }),
      ],
      relations: [],
    });

    expect(graph.edges.map((edge) => edge.id).sort()).toEqual([
      "project-1->task-1:task-link",
      "task-1->project-1:project-link",
    ]);
  });

  it("creates person-project and person-task edges from person metadata", () => {
    const graph = buildGlobalGraph({
      items: [
        item("person-1", {
          category: "people",
          type: "person",
          metadata: {
            linkedProjectIds: ["project-1"],
            linkedTaskIds: ["task-1"],
            linkedDocumentIds: ["doc-1"],
          },
        }),
        item("project-1", { category: "projects", type: "project" }),
        item("task-1", { category: "tasks", type: "task" }),
        item("doc-1", { category: "documents", type: "document" }),
      ],
      relations: [],
    });

    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "person-1->project-1:project-link",
        sourceId: "person-1",
        targetId: "project-1",
        type: "project-link",
        sourceField: "linkedProjectIds",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "person-1->task-1:task-link",
        sourceId: "person-1",
        targetId: "task-1",
        type: "task-link",
        sourceField: "linkedTaskIds",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "person-1->doc-1:document-link",
        sourceId: "person-1",
        targetId: "doc-1",
        type: "document-link",
        sourceField: "linkedDocumentIds",
      }),
    );
  });

  it("creates project-person and task-person edges from existing linkedPersonIds metadata", () => {
    const graph = buildGlobalGraph({
      items: [
        item("person-1", { category: "people", type: "person" }),
        item("project-1", {
          category: "projects",
          type: "project",
          metadata: { linkedPersonIds: ["person-1"] },
        }),
        item("task-1", {
          category: "tasks",
          type: "task",
          metadata: { linkedPersonIds: ["person-1"] },
        }),
      ],
      relations: [],
    });

    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "project-1->person-1:person-link",
        sourceId: "project-1",
        targetId: "person-1",
        type: "person-link",
        sourceField: "linkedPersonIds",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "task-1->person-1:person-link",
        sourceId: "task-1",
        targetId: "person-1",
        type: "person-link",
        sourceField: "linkedPersonIds",
      }),
    );
  });

  it("creates interaction-person edges and recognizes interaction nodes", () => {
    const graph = buildGlobalGraph({
      items: [
        item("person-1", { category: "people", type: "person" }),
        item("interaction-1", {
          category: "people",
          type: "interaction",
          metadata: {
            personId: "person-1",
            linkedProjectIds: ["project-1"],
          },
        }),
        item("project-1", { category: "projects", type: "project" }),
      ],
      relations: [],
    });

    expect(graph.nodes.find((node) => node.id === "interaction-1")?.type).toBe("interaction");
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "interaction-1->person-1:person-link",
        sourceId: "interaction-1",
        targetId: "person-1",
        type: "person-link",
        sourceField: "personId",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "interaction-1->project-1:project-link",
        sourceId: "interaction-1",
        targetId: "project-1",
        type: "project-link",
        sourceField: "linkedProjectIds",
      }),
    );
  });

  it("dedupes duplicate person/interaction relation IDs and ignores invalid targets", () => {
    const graph = buildGlobalGraph({
      items: [
        item("person-1", {
          category: "people",
          type: "person",
          metadata: { linkedProjectIds: ["project-1", "project-1", "bad id", "missing"] },
        }),
        item("interaction-1", {
          category: "people",
          type: "interaction",
          metadata: { personId: "person-1", linkedProjectIds: ["missing-project"] },
        }),
        item("project-1", { category: "projects", type: "project" }),
      ],
      relations: [],
    });

    expect(graph.edges.map((edge) => edge.id).sort()).toEqual([
      "interaction-1->person-1:person-link",
      "person-1->project-1:project-link",
    ]);
  });

  it("creates finance metadata edges to local documents, projects, people, tasks, and calendar items", () => {
    const graph = buildGlobalGraph({
      items: [
        item("finance-1", {
          category: "finance",
          type: "finance",
          metadata: {
            linkedDocumentIds: ["doc-1"],
            linkedProjectIds: ["project-1"],
            linkedTaskIds: ["task-1"],
            linkedPersonIds: ["person-1"],
            linkedCalendarEventIds: ["calendar-1"],
          },
        }),
        item("doc-1", { category: "documents", type: "document" }),
        item("project-1", { category: "projects", type: "project" }),
        item("task-1", { category: "tasks", type: "task" }),
        item("person-1", { category: "people", type: "person" }),
        item("calendar-1", { category: "calendar", type: "calendar" }),
      ],
      relations: [],
    });

    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "finance-1->doc-1:document-link",
        sourceId: "finance-1",
        targetId: "doc-1",
        type: "document-link",
        sourceField: "linkedDocumentIds",
        metadata: expect.objectContaining({ relationSource: "finance-metadata" }),
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "finance-1->project-1:project-link",
        sourceField: "linkedProjectIds",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "finance-1->task-1:task-link",
        sourceField: "linkedTaskIds",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "finance-1->person-1:person-link",
        sourceField: "linkedPersonIds",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "finance-1->calendar-1:calendar-link",
        sourceField: "linkedCalendarEventIds",
      }),
    );
  });

  it("dedupes duplicate finance relation IDs and ignores invalid finance targets", () => {
    const graph = buildGlobalGraph({
      items: [
        item("finance-1", {
          category: "finance",
          type: "finance",
          metadata: {
            linkedDocumentIds: ["doc-1", "doc-1", "bad id", "missing-doc", 12],
          },
        }),
        item("doc-1", { category: "documents", type: "document" }),
      ],
      relations: [],
    });

    expect(graph.edges.map((edge) => edge.id)).toEqual(["finance-1->doc-1:document-link"]);
  });

  it("creates tracker metadata edges to projects, tasks, people, documents, and finance records", () => {
    const graph = buildGlobalGraph({
      items: [
        item("tracker-1", {
          category: "trackers",
          type: "tracker",
          metadata: createDefaultTrackerMetadata({
            linkedProjectIds: ["project-1"],
            linkedTaskIds: ["task-1"],
            linkedPersonIds: ["person-1"],
            linkedDocumentIds: ["doc-1"],
            linkedFinanceIds: ["finance-1"],
          }),
        }),
        item("project-1", { category: "projects", type: "project" }),
        item("task-1", { category: "tasks", type: "task" }),
        item("person-1", { category: "people", type: "person" }),
        item("doc-1", { category: "documents", type: "document" }),
        item("finance-1", { category: "finance", type: "finance" }),
      ],
      relations: [],
    });

    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "tracker-1->project-1:project-link",
        sourceId: "tracker-1",
        targetId: "project-1",
        type: "project-link",
        sourceField: "linkedProjectIds",
        metadata: expect.objectContaining({ relationSource: "tracker-metadata" }),
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "tracker-1->task-1:task-link",
        sourceField: "linkedTaskIds",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "tracker-1->person-1:person-link",
        sourceField: "linkedPersonIds",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "tracker-1->doc-1:document-link",
        sourceField: "linkedDocumentIds",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "tracker-1->finance-1:finance-link",
        sourceField: "linkedFinanceIds",
      }),
    );
  });

  it("creates goal metadata edges including tracker links", () => {
    const graph = buildGlobalGraph({
      items: [
        item("goal-1", {
          category: "goals",
          type: "goal",
          metadata: createDefaultGoalMetadata({
            linkedProjectIds: ["project-1"],
            linkedTaskIds: ["task-1"],
            linkedTrackerIds: ["tracker-1"],
            linkedPersonIds: ["person-1"],
            linkedDocumentIds: ["doc-1"],
            linkedFinanceIds: ["finance-1"],
          }),
        }),
        item("project-1", { category: "projects", type: "project" }),
        item("task-1", { category: "tasks", type: "task" }),
        item("tracker-1", { category: "trackers", type: "tracker" }),
        item("person-1", { category: "people", type: "person" }),
        item("doc-1", { category: "documents", type: "document" }),
        item("finance-1", { category: "finance", type: "finance" }),
      ],
      relations: [],
    });

    expect(graph.nodes.find((node) => node.id === "goal-1")?.type).toBe("goal");
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "goal-1->tracker-1:tracker-link",
        sourceId: "goal-1",
        targetId: "tracker-1",
        type: "tracker-link",
        sourceField: "linkedTrackerIds",
        metadata: expect.objectContaining({ relationSource: "goal-metadata" }),
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "goal-1->project-1:project-link",
        sourceField: "linkedProjectIds",
      }),
    );
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        id: "goal-1->finance-1:finance-link",
        sourceField: "linkedFinanceIds",
      }),
    );
  });
});
