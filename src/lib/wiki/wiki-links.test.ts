import { describe, expect, it } from "vitest";

import type { MizaanBlock, MizaanItem } from "../vault/types";
import {
  buildWikiLinkTitleIndex,
  extractWikiLinkMatches,
  normalizeWikiLinkTitle,
  resolveWikiLinks,
} from "./wiki-links";

function item(id: string, title: string, input: Partial<MizaanItem> = {}): MizaanItem {
  return {
    id,
    type: input.type ?? "note",
    category: input.category ?? "notes",
    title,
    icon: input.icon,
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

function block(input: Partial<MizaanBlock> & Pick<MizaanBlock, "itemId" | "content">): MizaanBlock {
  return {
    id: input.id ?? `${input.itemId}-block`,
    itemId: input.itemId,
    type: input.type ?? "paragraph",
    content: input.content,
    order: input.order ?? 0,
    checked: input.checked,
    createdAt: input.createdAt ?? "2026-06-01T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-06-01T00:00:00.000Z",
  };
}

describe("wiki link helpers", () => {
  it("normalizes page titles for stable matching", () => {
    expect(normalizeWikiLinkTitle("  Target   Page  ")).toBe("target page");
  });

  it("extracts bracket links and ignores empty targets", () => {
    expect(
      extractWikiLinkMatches("See [[ Target Page | alias ]] plus [[]] and [[Second]]"),
    ).toEqual([
      {
        raw: "[[ Target Page | alias ]]",
        targetTitle: "Target Page",
        normalizedTitle: "target page",
      },
      {
        raw: "[[Second]]",
        targetTitle: "Second",
        normalizedTitle: "second",
      },
    ]);
  });

  it("does not index archived, deleted, or ambiguous duplicate page titles", () => {
    const index = buildWikiLinkTitleIndex([
      item("active", "Active Page"),
      item("archived", "Archived Page", { archivedAt: "2026-06-01T00:00:00.000Z" }),
      item("deleted", "Deleted Page", { deletedAt: "2026-06-01T00:00:00.000Z" }),
      item("duplicate-a", "Duplicate"),
      item("duplicate-b", " duplicate "),
    ]);

    expect(index.get("active page")?.id).toBe("active");
    expect(index.has("archived page")).toBe(false);
    expect(index.has("deleted page")).toBe(false);
    expect(index.has("duplicate")).toBe(false);
  });

  it("resolves unique source-to-target wiki links from block content", () => {
    const source = item("source", "Source");
    const target = item("target", "Target Page");
    const links = resolveWikiLinks(
      [source, target, item("other", "Other")],
      [
        block({
          id: "block-1",
          itemId: source.id,
          content: "See [[Target Page]] and [[Missing Page]] and duplicate [[target page|again]].",
        }),
        block({
          id: "block-2",
          itemId: source.id,
          content: "Self links such as [[Source]] are ignored.",
          order: 1,
        }),
      ],
    );

    expect(links).toHaveLength(1);
    expect(links[0]).toMatchObject({
      id: "source->target:wiki-link",
      source,
      target,
      targetTitle: "Target Page",
      blockId: "block-1",
    });
    expect(links[0]?.block.id).toBe("block-1");
  });
});
