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
  it(``, async () => {
    const provider = new LocalStorageVaultProvider({
      storage: createMemoryStorage(),
      now: () => "2026-05-31T00:00:00.000Z",
    });

    const items = (await provider.getSnapshot()).items;

    expect(items.some((item) => item?.id === "space-calendar")).toBe(false);
    expect(
      items.some((item) => item.category === "calendar" && item.metadata.promotedAsSpace === true),
    ).toBe(false);
  });

  it(``, async () => {
    const provider = createProvider();

    const item = await provider.createItem({
      title: "Lecture Notes",
      category: "notes",
      type: "note",
      icon: "N",
    });
    const block = await provider.createBlock(item?.id, { type: "paragraph", content: "Initial" });

    await provider.updateItem(item?.id, { title: "Renamed Lecture Notes" });
    await provider.updateBlock(block.id, { content: "Updated block text" });

    expect((await provider.getItem(item?.id))?.title).toBe("Renamed Lecture Notes");
    expect(await (await provider.getBlocks(item?.id))[0]?.content).toBe("Updated block text");
  });

  it(``, async () => {
    const provider = createProvider();
    const source = await provider.createItem({
      title: "Project",
      category: "projects",
      type: "project",
    });
    const target = await provider.createItem({
      title: "Document",
      category: "documents",
      type: "document",
    });

    await provider.createRelation({
      sourceId: source.id,
      targetId: target.id,
      relationType: "project_to_document",
      label: "Reference",
    });

    expect(await provider.listRelations({ sourceId: source.id })).toHaveLength(1);
    expect(await provider.listRelations({ targetId: target.id })).toHaveLength(1);
  });

  it(``, async () => {
    const provider = createProvider();
    const item = await provider.createItem({
      title: "Archive me",
      category: "notes",
      type: "note",
    });

    await provider.archiveItem(item?.id);
    expect((await provider.getItem(item?.id))?.archivedAt).toBe("2026-05-29T00:00:00.000Z");

    await provider.restoreItem(item?.id);
    expect((await provider.getItem(item?.id))?.archivedAt).toBeUndefined();
    expect((await provider.getItem(item?.id))?.deletedAt).toBeUndefined();
  });

  it(``, async () => {
    const provider = createProvider();
    const existing = await provider.createItem({
      title: "Existing",
      category: "notes",
      type: "note",
    });

    await provider.restoreSnapshotData({
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

    expect((await provider.getItem(existing.id))?.title).toBe("Existing from archive");
    expect((await provider.getItem("archive-note"))?.metadata.custom).toBe("kept");
    expect(await (await provider.getBlocks("archive-note"))[0]?.id).toBe("archive-block");
  });

  it(``, async () => {
    const provider = createProvider();
    const existing = await provider.createItem({
      title: "Existing",
      category: "notes",
      type: "note",
    });

    await expect(
      provider.restoreSnapshotData({ mode: "replace", items: [], blocks: [], relations: [] }),
    ).rejects.toThrow(/requires explicit confirmation/i);

    await provider.restoreSnapshotData({
      mode: "replace",
      confirmedReplace: true,
      items: [],
      blocks: [],
      relations: [],
    });

    expect(await provider.getItem(existing.id)).toBeUndefined();
    expect((await provider.getSnapshot()).items).toHaveLength(0);
  });
});
