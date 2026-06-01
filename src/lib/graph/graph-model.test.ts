import { describe, expect, it } from "vitest";

import {
  buildGlobalGraph,
  buildLocalGraph,
  getGraphNodeType,
  type GraphEdgeType,
} from "./graph-model";
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
    ["people", "person", "person"],
    ["finance", "finance", "finance"],
    ["calendar", "calendar", "calendar"],
    ["trackers", "tracker", "tracker"],
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
});
