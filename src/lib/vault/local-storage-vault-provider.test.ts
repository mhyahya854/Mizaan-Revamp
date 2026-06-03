import { describe, expect, it } from "vitest";

import { LocalStorageVaultProvider, createMemoryStorage } from "./local-storage-vault-provider";

function createProvider() {
  let sequence = 0;
  return new LocalStorageVaultProvider({
    storage: createMemoryStorage(),
    now: () => "2026-05-29T00:00:00.000Z",
    idFactory: (prefix) => `${prefix}-${++sequence}`,
    seedOnEmpty: false,
  });
}

describe("LocalStorageVaultProvider", () => {
  it("does not seed Calendar as a promoted page because Calendar is a core module", () => {
    const provider = new LocalStorageVaultProvider({
      storage: createMemoryStorage(),
      now: () => "2026-05-31T00:00:00.000Z",
    });

    const items = provider.getSnapshot().items;

    expect(items.some((item) => item.id === "space-calendar")).toBe(false);
    expect(
      items.some((item) => item.category === "calendar" && item.metadata.promotedAsSpace === true),
    ).toBe(false);
  });

  it("persists item title and block updates through the provider", () => {
    const provider = createProvider();

    const item = provider.createItem({
      title: "Lecture Notes",
      category: "notes",
      type: "note",
      icon: "N",
    });
    const block = provider.createBlock(item.id, { type: "paragraph", content: "Initial" });

    provider.updateItem(item.id, { title: "Renamed Lecture Notes" });
    provider.updateBlock(block.id, { content: "Updated block text" });

    expect(provider.getItem(item.id)?.title).toBe("Renamed Lecture Notes");
    expect(provider.getBlocks(item.id)[0]?.content).toBe("Updated block text");
  });

  it("stores relations and exposes incoming and outgoing directions", () => {
    const provider = createProvider();
    const source = provider.createItem({ title: "Project", category: "projects", type: "project" });
    const target = provider.createItem({
      title: "Document",
      category: "documents",
      type: "document",
    });

    provider.createRelation({
      sourceId: source.id,
      targetId: target.id,
      relationType: "project_to_document",
      label: "Reference",
    });

    expect(provider.listRelations({ sourceId: source.id })).toHaveLength(1);
    expect(provider.listRelations({ targetId: target.id })).toHaveLength(1);
  });

  it("archives and restores items without deleting local data", () => {
    const provider = createProvider();
    const item = provider.createItem({ title: "Archive me", category: "notes", type: "note" });

    provider.archiveItem(item.id);
    expect(provider.getItem(item.id)?.archivedAt).toBe("2026-05-29T00:00:00.000Z");

    provider.restoreItem(item.id);
    expect(provider.getItem(item.id)?.archivedAt).toBeUndefined();
    expect(provider.getItem(item.id)?.deletedAt).toBeUndefined();
  });

  it("restores snapshot data by merge while preserving archive IDs", () => {
    const provider = createProvider();
    const existing = provider.createItem({ title: "Existing", category: "notes", type: "note" });

    provider.restoreSnapshotData({
      mode: "merge",
      items: [
        { ...existing, title: "Existing from archive" },
        {
          id: "archive-note",
          type: "note",
          category: "notes",
          title: "Archive note",
          icon: "N",
          summary: "",
          status: "Active",
          tags: [],
          createdAt: "2026-05-29T00:00:00.000Z",
          updatedAt: "2026-05-29T00:00:00.000Z",
          properties: {},
          attachedFiles: [],
          metadata: { custom: "kept" },
        },
      ],
      blocks: [
        {
          id: "archive-block",
          itemId: "archive-note",
          type: "paragraph",
          content: "Restored block",
          order: 0,
          createdAt: "2026-05-29T00:00:00.000Z",
          updatedAt: "2026-05-29T00:00:00.000Z",
        },
      ],
      relations: [],
    });

    expect(provider.getItem(existing.id)?.title).toBe("Existing from archive");
    expect(provider.getItem("archive-note")?.metadata.custom).toBe("kept");
    expect(provider.getBlocks("archive-note")[0]?.id).toBe("archive-block");
  });

  it("blocks replace snapshot restore until explicit confirmation is supplied", () => {
    const provider = createProvider();
    const existing = provider.createItem({ title: "Existing", category: "notes", type: "note" });

    expect(() =>
      provider.restoreSnapshotData({
        mode: "replace",
        items: [],
        blocks: [],
        relations: [],
      }),
    ).toThrow(/requires explicit confirmation/i);

    provider.restoreSnapshotData({
      mode: "replace",
      confirmedReplace: true,
      items: [],
      blocks: [],
      relations: [],
    });

    expect(provider.getItem(existing.id)).toBeUndefined();
    expect(provider.getSnapshot().items).toHaveLength(0);
  });
});
