import { describe, expect, it } from "vitest";

import type { MizaanItem, VaultSnapshot } from "../vault/types";
import { buildSearchResults } from "./search-index";
import {
  createSavedSearchRecordInput,
  getSavedSearchCriteriaKey,
  isSavedSearchItem,
  listSavedSearchRecords,
} from "./saved-searches";

function item(input: Partial<MizaanItem> & Pick<MizaanItem, "id" | "title">): MizaanItem {
  const base: MizaanItem = {
    id: input.id,
    title: input.title,
    icon: "N",
    category: "notes",
    type: "note",
    summary: "",
    status: "Active",
    tags: [],
    createdAt: "2026-06-11T00:00:00.000Z",
    updatedAt: "2026-06-11T00:00:00.000Z",
    properties: {},
    attachedFiles: [],
    metadata: {},
  };

  return {
    ...base,
    ...input,
  };
}

function snapshot(items: MizaanItem[]): VaultSnapshot {
  return {
    items,
    blocks: [],
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
      blockCount: 0,
      relationCount: 0,
      archivedCount: 0,
      deletedCount: 0,
      portableVaultReady: false,
      sqliteReady: false,
      tauriReady: false,
      checkedAt: "2026-06-11T00:00:00.000Z",
      warnings: [],
    },
  };
}

describe("saved searches", () => {
  it("creates provider-backed saved search items with normalized criteria", () => {
    const input = createSavedSearchRecordInput({
      query: "  weekly review  ",
      category: "tasks",
      type: "task",
      status: "blocked",
      tag: "urgent",
    });

    expect(input.category).toBe("notes");
    expect(input.type).toBe("note");
    expect(input.tags).toContain("saved-search");
    expect(input.metadata?.savedSearch).toEqual({
      query: "weekly review",
      category: "tasks",
      type: "task",
      status: "blocked",
      tag: "urgent",
    });
  });

  it("lists active saved search records and ignores archived records", () => {
    const first = item({
      ...createSavedSearchRecordInput({
        query: "blocked",
        category: "tasks",
        type: "task",
        status: "blocked",
        tag: "all",
      }),
      id: "saved-1",
      updatedAt: "2026-06-11T10:00:00.000Z",
    });
    const second = item({
      ...createSavedSearchRecordInput({
        query: "finance",
        category: "finance",
        type: "finance",
        status: "all",
        tag: "all",
      }),
      id: "saved-2",
      archivedAt: "2026-06-11T12:00:00.000Z",
    });

    expect(isSavedSearchItem(first)).toBe(true);
    expect(listSavedSearchRecords([second, first]).map((record) => record.item.id)).toEqual([
      "saved-1",
    ]);
  });

  it("uses stable keys for duplicate detection", () => {
    expect(
      getSavedSearchCriteriaKey({
        query: "Review",
        category: "tasks",
        type: "task",
        status: "active",
        tag: "all",
      }),
    ).toBe(
      getSavedSearchCriteriaKey({
        query: " review ",
        category: "tasks",
        type: "task",
        status: "active",
        tag: "all",
      }),
    );
  });

  it("does not return saved search records as ordinary search results", () => {
    const data = snapshot([
      item({ id: "note-1", title: "Weekly review note", category: "notes", type: "note" }),
      item({
        ...createSavedSearchRecordInput({
          query: "weekly review",
          category: "notes",
          type: "note",
          status: "all",
          tag: "all",
        }),
        id: "saved-1",
      }),
    ]);

    expect(
      buildSearchResults(data, { query: "weekly review" }).map((result) => result.item.id),
    ).toEqual(["note-1"]);
  });
});
