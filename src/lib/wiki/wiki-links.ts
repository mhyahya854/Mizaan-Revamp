import type { MizaanBlock, MizaanItem } from "../vault/types";

export interface WikiLinkMatch {
  raw: string;
  targetTitle: string;
  normalizedTitle: string;
}

export interface ResolvedWikiLink {
  id: string;
  source: MizaanItem;
  target: MizaanItem;
  block: MizaanBlock;
  blockId: string;
  raw: string;
  targetTitle: string;
  normalizedTitle: string;
}

const WIKI_LINK_PATTERN = /\[\[([^[\]]*?)\]\]/g;

export function normalizeWikiLinkTitle(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function extractWikiLinkMatches(content: string): WikiLinkMatch[] {
  const matches: WikiLinkMatch[] = [];
  for (const match of content.matchAll(WIKI_LINK_PATTERN)) {
    const raw = match[0];
    const targetTitle = (match[1] ?? "").split("|")[0].trim().replace(/\s+/g, " ");
    const normalizedTitle = normalizeWikiLinkTitle(targetTitle);
    if (!normalizedTitle) continue;
    matches.push({ raw, targetTitle, normalizedTitle });
  }
  return matches;
}

export function buildWikiLinkTitleIndex(items: MizaanItem[]): Map<string, MizaanItem> {
  const candidates = new Map<string, MizaanItem | null>();
  const activeItems = items
    .filter((item) => !item.archivedAt && !item.deletedAt)
    .sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id));

  for (const item of activeItems) {
    const key = normalizeWikiLinkTitle(item.title);
    if (!key) continue;
    if (candidates.has(key)) {
      candidates.set(key, null);
      continue;
    }
    candidates.set(key, item);
  }

  const index = new Map<string, MizaanItem>();
  for (const [key, item] of candidates) {
    if (item) index.set(key, item);
  }
  return index;
}

export function resolveWikiLinks(items: MizaanItem[], blocks: MizaanBlock[]): ResolvedWikiLink[] {
  const titleIndex = buildWikiLinkTitleIndex(items);
  const sourceById = new Map(
    items.filter((item) => !item.archivedAt && !item.deletedAt).map((item) => [item.id, item]),
  );
  const byId = new Map<string, ResolvedWikiLink>();

  const orderedBlocks = blocks
    .filter((block) => block.content.includes("[["))
    .sort(
      (a, b) => a.itemId.localeCompare(b.itemId) || a.order - b.order || a.id.localeCompare(b.id),
    );

  for (const block of orderedBlocks) {
    const source = sourceById.get(block.itemId);
    if (!source) continue;

    for (const match of extractWikiLinkMatches(block.content)) {
      const target = titleIndex.get(match.normalizedTitle);
      if (!target || target.id === source.id) continue;

      const id = `${source.id}->${target.id}:wiki-link`;
      if (byId.has(id)) continue;
      byId.set(id, {
        id,
        source,
        target,
        block,
        blockId: block.id,
        raw: match.raw,
        targetTitle: match.targetTitle,
        normalizedTitle: match.normalizedTitle,
      });
    }
  }

  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}
