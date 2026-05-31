import type {
  ItemCategory,
  ItemType,
  MizaanBlock,
  MizaanItem,
  VaultSnapshot,
} from "../vault/types";

export type SearchMatchField =
  | "title"
  | "summary"
  | "status"
  | "tag"
  | "category"
  | "type"
  | "property"
  | "block"
  | "recent";

export interface SearchCriteria {
  query: string;
  categories?: ItemCategory[];
  statuses?: string[];
  tags?: string[];
  types?: ItemType[];
  limit?: number;
}

export interface SearchHighlightPart {
  text: string;
  match: boolean;
}

export interface SearchResult {
  item: MizaanItem;
  matchedFields: SearchMatchField[];
  snippet: string;
  score: number;
}

const DEFAULT_LIMIT = 40;

export function buildSearchResults(
  snapshot: VaultSnapshot,
  criteria: SearchCriteria,
): SearchResult[] {
  const query = normalize(criteria.query);
  const blocksByItem = groupBlocksByItem(snapshot.blocks);
  const limit = criteria.limit ?? DEFAULT_LIMIT;

  return snapshot.items
    .filter((item) => !item.archivedAt && !item.deletedAt)
    .filter((item) => matchesFilters(item, criteria))
    .flatMap((item): SearchResult[] => {
      const blocks = blocksByItem.get(item.id) ?? [];
      const match = query ? findMatch(item, blocks, query) : undefined;
      if (query && !match) return [];

      return [
        {
          item,
          matchedFields: match?.fields ?? ["recent"],
          snippet: match?.snippet ?? fallbackSnippet(item, blocks),
          score: match?.score ?? 0,
        },
      ];
    })
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return b.item.updatedAt.localeCompare(a.item.updatedAt);
    })
    .slice(0, limit);
}

export function highlightMatches(text: string, query: string): SearchHighlightPart[] {
  if (!query.trim()) return [{ text, match: false }];

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();
  const parts: SearchHighlightPart[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const index = normalizedText.indexOf(normalizedQuery, cursor);
    if (index === -1) {
      parts.push({ text: text.slice(cursor), match: false });
      break;
    }
    if (index > cursor) {
      parts.push({ text: text.slice(cursor, index), match: false });
    }
    parts.push({ text: text.slice(index, index + normalizedQuery.length), match: true });
    cursor = index + normalizedQuery.length;
  }

  return parts.filter((part) => part.text.length > 0);
}

function findMatch(item: MizaanItem, blocks: MizaanBlock[], query: string) {
  const fields: SearchMatchField[] = [];
  let score = 0;
  let snippet = "";

  const candidates: Array<{ field: SearchMatchField; value: string; score: number }> = [
    { field: "title", value: item.title, score: 80 },
    { field: "summary", value: item.summary ?? "", score: 50 },
    { field: "status", value: item.status ?? "", score: 30 },
    { field: "category", value: item.category, score: 25 },
    { field: "type", value: item.type, score: 25 },
    { field: "tag", value: item.tags.join(" "), score: 35 },
    { field: "property", value: stringifySearchableValues(item.properties), score: 20 },
    { field: "property", value: stringifySearchableValues(item.metadata), score: 15 },
    { field: "block", value: blocks.map((block) => block.content).join(" "), score: 45 },
  ];

  for (const candidate of candidates) {
    if (!normalize(candidate.value).includes(query)) continue;
    fields.push(candidate.field);
    score += candidate.score;
    if (!snippet) snippet = buildSnippet(candidate.value, query);
  }

  if (!fields.length) return undefined;
  return { fields: uniqueFields(fields), snippet, score };
}

function matchesFilters(item: MizaanItem, criteria: SearchCriteria) {
  if (criteria.categories?.length && !criteria.categories.includes(item.category)) return false;
  if (criteria.types?.length && !criteria.types.includes(item.type)) return false;
  if (criteria.statuses?.length && !criteria.statuses.includes(item.status ?? "")) return false;
  if (criteria.tags?.length && !criteria.tags.some((tag) => item.tags.includes(tag))) return false;
  return true;
}

function groupBlocksByItem(blocks: MizaanBlock[]) {
  const byItem = new Map<string, MizaanBlock[]>();
  for (const block of blocks) {
    const list = byItem.get(block.itemId) ?? [];
    list.push(block);
    byItem.set(block.itemId, list);
  }
  return byItem;
}

function fallbackSnippet(item: MizaanItem, blocks: MizaanBlock[]) {
  return (
    item.summary ||
    blocks.find((block) => block.content.trim())?.content ||
    item.status ||
    item.category
  );
}

function buildSnippet(value: string, query: string) {
  const source = value.trim().replace(/\s+/g, " ");
  const index = normalize(source).indexOf(query);
  if (index === -1) return source.slice(0, 140);
  const start = Math.max(index - 48, 0);
  const end = Math.min(index + query.length + 72, source.length);
  const prefix = start > 0 ? "... " : "";
  const suffix = end < source.length ? " ..." : "";
  return `${prefix}${source.slice(start, end)}${suffix}`;
}

function stringifySearchableValues(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(stringifySearchableValues).join(" ");
  if (typeof value === "object")
    return Object.values(value).map(stringifySearchableValues).join(" ");
  return "";
}

function uniqueFields(fields: SearchMatchField[]) {
  return fields.filter((field, index) => fields.indexOf(field) === index);
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
