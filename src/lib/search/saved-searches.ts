import type {
  CreateItemInput,
  ItemCategory,
  ItemType,
  MizaanItem,
  PropertyValue,
} from "../vault/types";

export type SavedSearchSelect<T extends string> = "all" | T;

export interface SavedSearchCriteria {
  query: string;
  category: SavedSearchSelect<ItemCategory>;
  type: SavedSearchSelect<ItemType>;
  status: string;
  tag: string;
}

export interface SavedSearchRecord {
  item: MizaanItem;
  criteria: SavedSearchCriteria;
  label: string;
  summary: string;
  key: string;
}

const SAVED_SEARCH_KIND = "mizaan-saved-search-v1";
const SAVED_SEARCH_TAG = "saved-search";

const ITEM_CATEGORIES = new Set<ItemCategory>([
  "notes",
  "documents",
  "projects",
  "tasks",
  "people",
  "finance",
  "calendar",
  "trackers",
  "goals",
  "databases",
  "templates",
]);

const ITEM_TYPES = new Set<ItemType>([
  "note",
  "document",
  "project",
  "task",
  "person",
  "interaction",
  "finance",
  "calendar",
  "tracker",
  "goal",
  "database",
  "database-row",
  "template",
]);

export function createSavedSearchRecordInput(criteria: SavedSearchCriteria): CreateItemInput {
  const normalized = normalizeSavedSearchCriteria(criteria);
  const summary = describeSavedSearchCriteria(normalized);
  const savedSearch: Record<string, PropertyValue> = {
    query: normalized.query,
    category: normalized.category,
    type: normalized.type,
    status: normalized.status,
    tag: normalized.tag,
  };

  return {
    title: buildSavedSearchTitle(normalized),
    category: "notes",
    type: "note",
    icon: "S",
    summary,
    status: "Saved search",
    tags: [SAVED_SEARCH_TAG],
    properties: {
      kind: "Saved search",
      scope: summary,
    },
    metadata: {
      mizaanKind: SAVED_SEARCH_KIND,
      savedSearch,
      sidebarHidden: true,
    },
  };
}

export function isSavedSearchItem(item: MizaanItem): boolean {
  return item.metadata.mizaanKind === SAVED_SEARCH_KIND;
}

export function listSavedSearchRecords(items: MizaanItem[]): SavedSearchRecord[] {
  return items
    .filter((item) => isSavedSearchItem(item) && !item.archivedAt && !item.deletedAt)
    .map((item) => {
      const criteria = getSavedSearchCriteria(item);
      return {
        item,
        criteria,
        label: item.title || buildSavedSearchTitle(criteria),
        summary: describeSavedSearchCriteria(criteria),
        key: getSavedSearchCriteriaKey(criteria),
      };
    })
    .sort((a, b) => b.item.updatedAt.localeCompare(a.item.updatedAt));
}

export function getSavedSearchCriteria(item: MizaanItem): SavedSearchCriteria {
  const raw = item.metadata.savedSearch;
  if (!isRecord(raw)) {
    return normalizeSavedSearchCriteria({
      query: "",
      category: "all",
      type: "all",
      status: "all",
      tag: "all",
    });
  }

  return normalizeSavedSearchCriteria({
    query: toText(raw.query),
    category: toCategory(raw.category),
    type: toItemType(raw.type),
    status: normalizeSelect(raw.status),
    tag: normalizeSelect(raw.tag),
  });
}

export function getSavedSearchCriteriaKey(criteria: SavedSearchCriteria): string {
  const normalized = normalizeSavedSearchCriteria(criteria);
  return [
    normalized.query.toLowerCase(),
    normalized.category,
    normalized.type,
    normalized.status.toLowerCase(),
    normalized.tag.toLowerCase(),
  ].join("|");
}

export function isSavedSearchCriteriaActive(criteria: SavedSearchCriteria): boolean {
  const normalized = normalizeSavedSearchCriteria(criteria);
  return Boolean(
    normalized.query ||
    normalized.category !== "all" ||
    normalized.type !== "all" ||
    normalized.status !== "all" ||
    normalized.tag !== "all",
  );
}

export function normalizeSavedSearchCriteria(criteria: SavedSearchCriteria): SavedSearchCriteria {
  return {
    query: criteria.query.trim(),
    category: criteria.category === "all" ? "all" : toCategory(criteria.category),
    type: criteria.type === "all" ? "all" : toItemType(criteria.type),
    status: normalizeSelect(criteria.status),
    tag: normalizeSelect(criteria.tag),
  };
}

export function describeSavedSearchCriteria(criteria: SavedSearchCriteria): string {
  const normalized = normalizeSavedSearchCriteria(criteria);
  const parts = [
    normalized.query ? `query "${normalized.query}"` : "",
    normalized.category !== "all" ? `category ${normalized.category}` : "",
    normalized.type !== "all" ? `type ${normalized.type}` : "",
    normalized.status !== "all" ? `status ${normalized.status}` : "",
    normalized.tag !== "all" ? `tag #${normalized.tag}` : "",
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : "all local items";
}

function buildSavedSearchTitle(criteria: SavedSearchCriteria): string {
  const normalized = normalizeSavedSearchCriteria(criteria);
  if (normalized.query) return `Search: ${normalized.query}`;
  return `Search: ${describeSavedSearchCriteria(normalized)}`;
}

function normalizeSelect(value: unknown): string {
  const text = toText(value);
  return text || "all";
}

function toCategory(value: unknown): SavedSearchSelect<ItemCategory> {
  const text = toText(value);
  if (text === "all") return "all";
  return ITEM_CATEGORIES.has(text as ItemCategory) ? (text as ItemCategory) : "all";
}

function toItemType(value: unknown): SavedSearchSelect<ItemType> {
  const text = toText(value);
  if (text === "all") return "all";
  return ITEM_TYPES.has(text as ItemType) ? (text as ItemType) : "all";
}

function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
