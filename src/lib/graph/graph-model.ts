import { normalizeDocumentMetadataForItem } from "../documents/document-record";
import {
  getProjectGraphRelationTargets,
  isProjectRecordItem,
  normalizeProjectMetadataForItem,
} from "../projects/project-record";
import {
  getTaskGraphRelationTargets,
  isTaskRecordItem,
  normalizeTaskMetadataForItem,
} from "../tasks/task-record";
import type { ItemCategory, ItemType, MizaanItem, MizaanRelation } from "../vault/types";

export type GraphNodeType =
  | "page"
  | "note"
  | "document"
  | "project"
  | "person"
  | "finance"
  | "calendar"
  | "task"
  | "tracker"
  | "goal"
  | "database"
  | "template"
  | "space"
  | "unknown";

export type GraphEdgeType =
  | "relation"
  | "backlink"
  | "outgoing-link"
  | "document-link"
  | "project-link"
  | "task-link"
  | "person-link"
  | "finance-link"
  | "calendar-link"
  | "goal-link"
  | "parent-child"
  | "template-created"
  | "page-link"
  | "database-row"
  | "unknown";

export type GraphScope = "global" | "local";

export interface GraphNode {
  id: string;
  itemId: string;
  label: string;
  type: GraphNodeType;
  category: ItemCategory | string;
  status: string;
  route: string;
  isOrphan: boolean;
  isBlueprintOnly: boolean;
  metadataSummary: string;
  updatedAt?: string;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: GraphEdgeType;
  label: string;
  strength: number;
  sourceField: string;
  bidirectional: boolean;
  metadata: Record<string, string | number | boolean>;
}

export interface GraphSummary {
  nodeCount: number;
  edgeCount: number;
  orphanCount: number;
  typeCounts: Record<string, number>;
  edgeTypeCounts: Record<string, number>;
  relationSourceCounts: Record<string, number>;
  hasRelations: boolean;
  hasOnlyOrphans: boolean;
}

export interface GraphModel {
  scope: GraphScope;
  selectedItemId?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  summary: GraphSummary;
}

export interface BuildGraphInput {
  items: MizaanItem[];
  relations?: MizaanRelation[];
}

export interface BuildLocalGraphInput extends BuildGraphInput {
  selectedItemId: string;
}

const GRAPH_NODE_BY_TYPE: Partial<Record<ItemType, GraphNodeType>> = {
  note: "note",
  document: "document",
  project: "project",
  person: "person",
  finance: "finance",
  calendar: "calendar",
  task: "task",
  tracker: "tracker",
  database: "database",
  "database-row": "database",
  template: "template",
};

const GRAPH_NODE_BY_CATEGORY: Partial<Record<ItemCategory, GraphNodeType>> = {
  notes: "note",
  documents: "document",
  projects: "project",
  people: "person",
  finance: "finance",
  calendar: "calendar",
  tasks: "task",
  trackers: "tracker",
  databases: "database",
  templates: "template",
};

const DOCUMENT_RELATION_FIELDS: Array<{
  field: "linkedPageIds" | "linkedProjectIds" | "linkedPersonIds" | "linkedFinanceIds";
  type: GraphEdgeType;
  label: string;
}> = [
  { field: "linkedPageIds", type: "page-link", label: "Linked page" },
  { field: "linkedProjectIds", type: "project-link", label: "Linked project" },
  { field: "linkedPersonIds", type: "person-link", label: "Linked person" },
  { field: "linkedFinanceIds", type: "finance-link", label: "Linked finance" },
];

export function buildGlobalGraph({ items, relations = [] }: BuildGraphInput): GraphModel {
  const activeItems = activeGraphItems(items);
  const itemById = new Map(activeItems.map((item) => [item.id, item]));
  const edges = buildEdges(activeItems, itemById, relations);
  const nodes = markOrphanNodes(activeItems.map(toGraphNode), edges);

  return createGraphModel("global", nodes, edges);
}

export function buildLocalGraph({
  selectedItemId,
  items,
  relations = [],
}: BuildLocalGraphInput): GraphModel {
  const global = buildGlobalGraph({ items, relations });
  if (!global.nodes.some((node) => node.id === selectedItemId)) {
    return createGraphModel("local", [], [], selectedItemId);
  }

  const localNodeIds = new Set<string>([selectedItemId]);
  for (const edge of global.edges) {
    if (edge.sourceId !== selectedItemId && edge.targetId !== selectedItemId) continue;
    localNodeIds.add(edge.sourceId);
    localNodeIds.add(edge.targetId);
  }

  const edges = global.edges.filter(
    (edge) => localNodeIds.has(edge.sourceId) && localNodeIds.has(edge.targetId),
  );
  const nodes = markOrphanNodes(
    global.nodes
      .filter((node) => localNodeIds.has(node.id))
      .map((node) => ({ ...node, isOrphan: false })),
    edges,
  );

  return createGraphModel("local", nodes, edges, selectedItemId);
}

export function getGraphNodeType(item: Pick<MizaanItem, "category" | "type">): GraphNodeType {
  return GRAPH_NODE_BY_TYPE[item.type] ?? GRAPH_NODE_BY_CATEGORY[item.category] ?? "unknown";
}

function activeGraphItems(items: MizaanItem[]) {
  return items.filter((item) => !item.archivedAt && !item.deletedAt);
}

function toGraphNode(item: MizaanItem): GraphNode {
  return {
    id: item.id,
    itemId: item.id,
    label: item.title || "Untitled",
    type: getGraphNodeType(item),
    category: item.category,
    status: item.status ?? "No status",
    route: `/page/${item.id}`,
    isOrphan: true,
    isBlueprintOnly: item.metadata.blueprintOnly === true || item.metadata.futureOnly === true,
    metadataSummary: item.summary || item.tags.join(", ") || item.status || "",
    updatedAt: item.updatedAt,
  };
}

function buildEdges(
  items: MizaanItem[],
  itemById: Map<string, MizaanItem>,
  relations: MizaanRelation[],
): GraphEdge[] {
  const byId = new Map<string, GraphEdge>();

  function addEdge(edge: Omit<GraphEdge, "id">) {
    if (edge.sourceId === edge.targetId) return;
    if (!itemById.has(edge.sourceId) || !itemById.has(edge.targetId)) return;
    const id = `${edge.sourceId}->${edge.targetId}:${edge.type}`;
    if (byId.has(id)) return;
    byId.set(id, { ...edge, id });
  }

  for (const relation of relations) {
    addEdge({
      sourceId: relation.sourceId,
      targetId: relation.targetId,
      type: edgeTypeForProviderRelation(relation),
      label: relation.label || relation.relationType || "Related",
      strength: 1,
      sourceField: "providerRelation",
      bidirectional: relation.metadata.bidirectional === true,
      metadata: {
        relationId: relation.id,
        relationType: relation.relationType,
        relationSource: "provider-relations",
      },
    });
  }

  for (const documentItem of items.filter(
    (item) => item.category === "documents" && item.type === "document",
  )) {
    const metadata = normalizeDocumentMetadataForItem(documentItem);
    for (const { field, type, label } of DOCUMENT_RELATION_FIELDS) {
      for (const targetId of metadata[field]) {
        addEdge({
          sourceId: documentItem.id,
          targetId,
          type,
          label,
          strength: 1,
          sourceField: field,
          bidirectional: false,
          metadata: {
            relationSource: "document-metadata",
          },
        });
      }
    }
  }

  for (const projectItem of items.filter(isProjectRecordItem)) {
    const metadata = normalizeProjectMetadataForItem(projectItem);
    for (const target of getProjectGraphRelationTargets(metadata)) {
      addEdge({
        sourceId: projectItem.id,
        targetId: target.targetId,
        type: target.edgeType,
        label: target.label,
        strength: 1,
        sourceField: target.sourceField,
        bidirectional: false,
        metadata: {
          relationSource: "project-metadata",
        },
      });
    }
  }

  for (const taskItem of items.filter(isTaskRecordItem)) {
    const metadata = normalizeTaskMetadataForItem(taskItem);
    for (const target of getTaskGraphRelationTargets(metadata)) {
      addEdge({
        sourceId: taskItem.id,
        targetId: target.targetId,
        type: target.edgeType,
        label: target.label,
        strength: 1,
        sourceField: target.sourceField,
        bidirectional: false,
        metadata: {
          relationSource: "task-metadata",
        },
      });
    }
  }

  for (const child of items) {
    if (!child.parentId) continue;
    addEdge({
      sourceId: child.parentId,
      targetId: child.id,
      type: "parent-child",
      label: "Parent page",
      strength: 1,
      sourceField: "parentId",
      bidirectional: false,
      metadata: {
        relationSource: "parent-hierarchy",
      },
    });
  }

  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function edgeTypeForProviderRelation(relation: MizaanRelation): GraphEdgeType {
  if (relation.relationType === "parent_child") return "parent-child";
  if (relation.relationType === "database_to_row") return "database-row";
  return "relation";
}

function markOrphanNodes(nodes: GraphNode[], edges: GraphEdge[]): GraphNode[] {
  const connected = new Set<string>();
  for (const edge of edges) {
    connected.add(edge.sourceId);
    connected.add(edge.targetId);
  }

  return nodes
    .map((node) => ({ ...node, isOrphan: !connected.has(node.id) }))
    .sort((a, b) => a.label.localeCompare(b.label) || a.id.localeCompare(b.id));
}

function createGraphModel(
  scope: GraphScope,
  nodes: GraphNode[],
  edges: GraphEdge[],
  selectedItemId?: string,
): GraphModel {
  return {
    scope,
    selectedItemId,
    nodes,
    edges,
    summary: summarizeGraph(nodes, edges),
  };
}

function summarizeGraph(nodes: GraphNode[], edges: GraphEdge[]): GraphSummary {
  const typeCounts = countBy(nodes, (node) => node.type);
  const edgeTypeCounts = countBy(edges, (edge) => edge.type);
  const relationSourceCounts = countBy(edges, (edge) =>
    String(edge.metadata.relationSource ?? edge.sourceField),
  );
  const orphanCount = nodes.filter((node) => node.isOrphan).length;

  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    orphanCount,
    typeCounts,
    edgeTypeCounts,
    relationSourceCounts,
    hasRelations: edges.length > 0,
    hasOnlyOrphans: nodes.length > 0 && orphanCount === nodes.length,
  };
}

function countBy<T>(values: T[], getKey: (value: T) => string) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = getKey(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}
