import { describe, expect, it } from "vitest";

import type { MizaanBlock, MizaanItem, VaultSnapshot } from "../vault/types";
import { buildSearchResults, highlightMatches } from "./search-index";

function item(
  input: Partial<MizaanItem> & Pick<MizaanItem, "id" | "title" | "category" | "type">,
): MizaanItem {
  return {
    icon: "N",
    summary: "",
    status: "Active",
    tags: [],
    createdAt: "2026-05-31T00:00:00.000Z",
    updatedAt: "2026-05-31T00:00:00.000Z",
    properties: {},
    attachedFiles: [],
    metadata: {},
    ...input,
  };
}

function block(
  input: Partial<MizaanBlock> & Pick<MizaanBlock, "id" | "itemId" | "content">,
): MizaanBlock {
  return {
    type: "paragraph",
    order: 0,
    createdAt: "2026-05-31T00:00:00.000Z",
    updatedAt: "2026-05-31T00:00:00.000Z",
    ...input,
  };
}

function snapshot(items: MizaanItem[], blocks: MizaanBlock[] = []): VaultSnapshot {
  return {
    items,
    blocks,
    relations: [],
    providerInfo: {
      id: "test",
      name: "TestProvider",
      mode: "prototype-local",
      storageLabel: "test",
      warning: "test",
      capabilities: {
        itemCrud: true,
        blockCrud: true,
        relations: true,
        localStoragePrototype: true,
        portableFolder: false,
        sqlite: false,
        tauriFilesystem: false,
        markdownMirrors: false,
      },
    },
    health: {
      providerId: "test",
      itemCount: items.length,
      blockCount: blocks.length,
      relationCount: 0,
      archivedCount: 0,
      deletedCount: 0,
      portableVaultReady: false,
      sqliteReady: false,
      tauriReady: false,
      checkedAt: "2026-05-31T00:00:00.000Z",
      warnings: [],
    },
  };
}

describe("search index", () => {
  it("finds provider items by block content and returns the matching snippet", () => {
    const data = snapshot(
      [
        item({ id: "note-1", title: "Lecture Notes", category: "notes", type: "note" }),
        item({ id: "project-1", title: "Project Plan", category: "projects", type: "project" }),
      ],
      [
        block({
          id: "block-1",
          itemId: "note-1",
          content: "Photosynthesis converts light into chemical energy.",
        }),
      ],
    );

    const results = buildSearchResults(data, { query: "chemical energy" });

    expect(results).toHaveLength(1);
    expect(results[0].item.id).toBe("note-1");
    expect(results[0].matchedFields).toContain("block");
    expect(results[0].snippet).toContain("chemical energy");
  });

  it("applies category, status, and tag filters while preserving recent ordering", () => {
    const data = snapshot([
      item({
        id: "old-note",
        title: "Budget note",
        category: "notes",
        type: "note",
        status: "Draft",
        tags: ["finance"],
        updatedAt: "2026-05-20T00:00:00.000Z",
      }),
      item({
        id: "new-finance",
        title: "Budget review",
        category: "finance",
        type: "finance",
        status: "Active",
        tags: ["finance"],
        updatedAt: "2026-05-31T00:00:00.000Z",
      }),
      item({
        id: "archived-finance",
        title: "Budget archive",
        category: "finance",
        type: "finance",
        status: "Active",
        tags: ["finance"],
        archivedAt: "2026-05-31T00:00:00.000Z",
      }),
    ]);

    const results = buildSearchResults(data, {
      query: "budget",
      categories: ["finance"],
      statuses: ["Active"],
      tags: ["finance"],
    });

    expect(results.map((result) => result.item.id)).toEqual(["new-finance"]);
  });

  it("returns recent active items when the query is blank", () => {
    const data = snapshot([
      item({
        id: "older",
        title: "Older",
        category: "notes",
        type: "note",
        updatedAt: "2026-05-20T00:00:00.000Z",
      }),
      item({
        id: "newer",
        title: "Newer",
        category: "projects",
        type: "project",
        updatedAt: "2026-05-31T00:00:00.000Z",
      }),
    ]);

    expect(buildSearchResults(data, { query: "" }).map((result) => result.item.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("splits highlighted query matches for UI rendering", () => {
    expect(highlightMatches("Mizaan design principles", "design")).toEqual([
      { text: "Mizaan ", match: false },
      { text: "design", match: true },
      { text: " principles", match: false },
    ]);
  });
});
