import {
  getCalendarGraphTargets,
  isCalendarEventItem,
  normalizeCalendarMetadataForItem,
} from "../calendar/calendar-event";
import { normalizeDocumentMetadataForItem } from "../documents/document-record";
import {
  getFinanceGraphTargets,
  isFinanceRecordItem,
  normalizeFinanceMetadataForItem,
} from "../finance/finance-record";
import {
  getGoalGraphTargets,
  isGoalRecordItem,
  normalizeGoalMetadataForItem,
} from "../goals/goal-record";
import {
  getInteractionGraphTargets,
  isInteractionRecordItem,
  normalizeInteractionMetadataForItem,
} from "../people/interaction-record";
import {
  getPersonGraphTargets,
  isPersonRecordItem,
  normalizePersonMetadataForItem,
} from "../people/person-record";
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
import {
  getTrackerGraphTargets,
  isTrackerRecordItem,
  normalizeTrackerMetadataForItem,
} from "../trackers/tracker-record";
import type {
  ItemCategory,
  ItemType,
  MizaanBlock,
  MizaanItem,
  MizaanRelation,
} from "../vault/types";
import { resolveWikiLinks } from "../wiki/wiki-links";

export type GraphNodeType =
  | "page"
  | "note"
  | "document"
  | "project"
  | "person"
  | "interaction"
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
  | "wiki-link"
  | "document-link"
  | "project-link"
  | "task-link"
  | "task-dependency"
  | "task-blocker"
  | "person-link"
  | "finance-link"
  | "calendar-link"
  | "tracker-link"
  | "goal-link"
  | "parent-child"
  | "template-created"
  | "page-link"
  | "database-row"
  | "unknown";

export type GraphScope = "global" | "local";

export type GraphNodeFilter =
  | "all"
  | "documents"
  | "pages"
  | "projects"
  | "people"
  | "finance"
  | "orphans"
  | "connected";

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

export interface GraphExportPayload {
  app: "Mizaan";
  format: "mizaan.graph.export.v1";
  exportedAt: string;
  scope: GraphScope;
  selectedItemId?: string;
  summary: GraphSummary;
  nodes: GraphNode[];
  edges: GraphEdge[];
  limitations: string[];
}

export interface BuildGraphInput {
  items: MizaanItem[];
  blocks?: MizaanBlock[];
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
  interaction: "interaction",
  finance: "finance",
  calendar: "calendar",
  task: "task",
  tracker: "tracker",
  goal: "goal",
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
  goals: "goal",
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

export function buildGlobalGraph({
  items,
  blocks = [],
  relations = [],
}: BuildGraphInput): GraphModel {
  const activeItems = activeGraphItems(items);
  const itemById = new Map(activeItems.map((item) => [item.id, item]));
  const edges = buildEdges(activeItems, itemById, relations, blocks);
  const nodes = markOrphanNodes(activeItems.map(toGraphNode), edges);

  return createGraphModel("global", nodes, edges);
}

export function buildLocalGraph({
  selectedItemId,
  items,
  blocks = [],
  relations = [],
}: BuildLocalGraphInput): GraphModel {
  const global = buildGlobalGraph({ items, blocks, relations });
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

export function filterGraphNodes(
  nodes: GraphNode[],
  {
    filter = "all",
    query = "",
  }: {
    filter?: GraphNodeFilter;
    query?: string;
  },
) {
  const normalizedQuery = query.trim().toLowerCase();
  return nodes.filter(
    (node) =>
      graphNodeMatchesFilter(node, filter) &&
      (!normalizedQuery || graphNodeMatchesQuery(node, normalizedQuery)),
  );
}

export function createGraphExportPayload(
  graph: GraphModel,
  exportedAt = new Date().toISOString(),
): GraphExportPayload {
  return {
    app: "Mizaan",
    format: "mizaan.graph.export.v1",
    exportedAt,
    scope: graph.scope,
    ...(graph.selectedItemId ? { selectedItemId: graph.selectedItemId } : {}),
    summary: cloneGraphSummary(graph.summary),
    nodes: graph.nodes.map(cloneGraphNode).sort(sortById),
    edges: graph.edges.map(cloneGraphEdge).sort(sortById),
    limitations: [
      "This is a browser JSON export of the current provider graph model.",
      "It is not a native vault backup, portable folder mirror, image export, PDF export, clustering export, or semantic graph export.",
      "Manual canvas nodes, saved layouts, embeddings, and local AI graph data are not included.",
    ],
  };
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
  blocks: MizaanBlock[],
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

  for (const link of resolveWikiLinks(items, blocks)) {
    addEdge({
      sourceId: link.source.id,
      targetId: link.target.id,
      type: "wiki-link",
      label: "Wiki link",
      strength: 1,
      sourceField: "blockContent",
      bidirectional: false,
      metadata: {
        relationSource: "wiki-links",
        blockId: link.blockId,
        targetTitle: link.targetTitle,
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

  for (const personItem of items.filter(isPersonRecordItem)) {
    const metadata = normalizePersonMetadataForItem(personItem);
    for (const target of getPersonGraphTargets(metadata)) {
      addEdge({
        sourceId: personItem.id,
        targetId: target.targetId,
        type: target.edgeType,
        label: target.label,
        strength: 1,
        sourceField: target.sourceField,
        bidirectional: false,
        metadata: {
          relationSource: "person-metadata",
        },
      });
    }
  }

  for (const interactionItem of items.filter(isInteractionRecordItem)) {
    const metadata = normalizeInteractionMetadataForItem(interactionItem);
    for (const target of getInteractionGraphTargets(metadata)) {
      addEdge({
        sourceId: interactionItem.id,
        targetId: target.targetId,
        type: target.edgeType,
        label: target.label,
        strength: 1,
        sourceField: target.sourceField,
        bidirectional: false,
        metadata: {
          relationSource: "interaction-metadata",
        },
      });
    }
  }

  for (const financeItem of items.filter(isFinanceRecordItem)) {
    const metadata = normalizeFinanceMetadataForItem(financeItem);
    for (const target of getFinanceGraphTargets(metadata)) {
      addEdge({
        sourceId: financeItem.id,
        targetId: target.targetId,
        type: target.edgeType,
        label: target.label,
        strength: 1,
        sourceField: target.sourceField,
        bidirectional: false,
        metadata: {
          relationSource: "finance-metadata",
        },
      });
    }
  }

  for (const calendarItem of items.filter(isCalendarEventItem)) {
    const metadata = normalizeCalendarMetadataForItem(calendarItem);
    for (const target of getCalendarGraphTargets(metadata)) {
      addEdge({
        sourceId: calendarItem.id,
        targetId: target.targetId,
        type: target.edgeType,
        label: target.label,
        strength: 1,
        sourceField: target.sourceField,
        bidirectional: false,
        metadata: {
          relationSource: "calendar-metadata",
        },
      });
    }
  }

  for (const trackerItem of items.filter(isTrackerRecordItem)) {
    const metadata = normalizeTrackerMetadataForItem(trackerItem);
    for (const target of getTrackerGraphTargets(metadata)) {
      addEdge({
        sourceId: trackerItem.id,
        targetId: target.targetId,
        type: target.edgeType,
        label: target.label,
        strength: 1,
        sourceField: target.sourceField,
        bidirectional: false,
        metadata: {
          relationSource: "tracker-metadata",
        },
      });
    }
  }

  for (const goalItem of items.filter(isGoalRecordItem)) {
    const metadata = normalizeGoalMetadataForItem(goalItem);
    for (const target of getGoalGraphTargets(metadata)) {
      addEdge({
        sourceId: goalItem.id,
        targetId: target.targetId,
        type: target.edgeType,
        label: target.label,
        strength: 1,
        sourceField: target.sourceField,
        bidirectional: false,
        metadata: {
          relationSource: "goal-metadata",
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

function graphNodeMatchesFilter(node: GraphNode, filter: GraphNodeFilter) {
  switch (filter) {
    case "documents":
      return node.type === "document";
    case "pages":
      return node.type === "note" || node.type === "page";
    case "projects":
      return node.type === "project";
    case "people":
      return node.type === "person" || node.type === "interaction";
    case "finance":
      return node.type === "finance";
    case "orphans":
      return node.isOrphan;
    case "connected":
      return !node.isOrphan;
    case "all":
    default:
      return true;
  }
}

function graphNodeMatchesQuery(node: GraphNode, normalizedQuery: string) {
  return [
    node.label,
    node.type,
    node.category,
    node.status,
    node.route,
    node.itemId,
    node.metadataSummary,
  ].some((value) => value.toLowerCase().includes(normalizedQuery));
}

function cloneGraphNode(node: GraphNode): GraphNode {
  return { ...node };
}

function cloneGraphEdge(edge: GraphEdge): GraphEdge {
  return {
    ...edge,
    metadata: sortRecord(edge.metadata),
  };
}

function cloneGraphSummary(summary: GraphSummary): GraphSummary {
  return {
    ...summary,
    typeCounts: sortRecord(summary.typeCounts),
    edgeTypeCounts: sortRecord(summary.edgeTypeCounts),
    relationSourceCounts: sortRecord(summary.relationSourceCounts),
  };
}

function sortRecord<T>(record: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
}

function sortById<T extends { id: string }>(a: T, b: T) {
  return a.id.localeCompare(b.id);
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
