import { describe, expect, it } from "vitest";

import {
  MIZAAN_ARCHIVE_APP_NAME,
  MIZAAN_ARCHIVE_SCHEMA_VERSION,
  MIZAAN_ARCHIVE_VERSION,
} from "./vault-archive";
import { createVaultHealthSummary, getVaultHealthScore } from "./vault-health";
import type { MizaanBlock, MizaanItem, MizaanRelation, VaultSnapshot } from "./types";

function makeItem(id: string, overrides: Partial<MizaanItem> = {}): MizaanItem {
  const base: MizaanItem = {
    id,
    type: "note",
    title: `Item ${id}`,
    category: "notes",
    tags: [],
    icon: "FileText",
    createdAt: "2026-06-04T00:00:00.000Z",
    updatedAt: "2026-06-04T00:00:00.000Z",
    properties: {},
    attachedFiles: [],
    metadata: {},
  };

  return {
    ...base,
    ...overrides,
    tags: overrides.tags ?? base.tags,
    properties: overrides.properties ?? base.properties,
    attachedFiles: overrides.attachedFiles ?? base.attachedFiles,
    metadata: overrides.metadata ?? base.metadata,
  };
}

function makeSnapshot(overrides: Partial<VaultSnapshot> = {}): VaultSnapshot {
  const items = overrides.items ?? [];
  const blocks = overrides.blocks ?? [];
  const relations = overrides.relations ?? [];

  return {
    providerInfo: {
      id: "browser-local-storage",
      name: "Browser localStorage",
      mode: "prototype-local",
      storageLabel: "Browser localStorage",
      warning: "Browser prototype provider",
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
      providerId: "browser-local-storage",
      checkedAt: "2026-06-04T00:00:00.000Z",
      itemCount: items.length,
      blockCount: blocks.length,
      relationCount: relations.length,
      archivedCount: 0,
      deletedCount: 0,
      portableVaultReady: false,
      sqliteReady: false,
      tauriReady: false,
      warnings: [],
    },
    items,
    blocks,
    relations,
    ...overrides,
  };
}

describe("createVaultHealthSummary", () => {
  it(``, async () => {
    const snapshot = makeSnapshot({
      items: [
        makeItem("doc-1", { category: "documents" }),
        makeItem("task-1", { category: "tasks", archivedAt: "2026-06-04T00:00:00.000Z" }),
        makeItem("person-1", { category: "people", deletedAt: "2026-06-04T00:00:00.000Z" }),
      ],
    });

    const summary = createVaultHealthSummary(snapshot, {
      checkedAt: "2026-06-04T01:00:00.000Z",
    });

    expect(summary.checkedAt).toBe("2026-06-04T01:00:00.000Z");
    expect(summary.counts.items).toBe(3);
    expect(summary.counts.categories.documents).toBe(1);
    expect(summary.counts.categories.tasks).toBe(1);
    expect(summary.counts.categories.people).toBe(1);
    expect(summary.counts.archived).toBe(1);
    expect(summary.counts.deleted).toBe(1);
    expect(summary.emptyVault).toBe(false);
    expect(summary.archiveSupport).toMatchObject({
      appName: MIZAAN_ARCHIVE_APP_NAME,
      archiveVersion: MIZAAN_ARCHIVE_VERSION,
      schemaVersion: MIZAAN_ARCHIVE_SCHEMA_VERSION,
      browserJsonExport: true,
      archiveValidation: true,
      restorePreview: true,
      safeMerge: true,
      guardedReplace: true,
      nativeBackup: false,
      sqliteBackup: false,
      encryptedBackup: false,
      portableVaultBackup: false,
    });
  });

  it(``, async () => {
    const blocks: MizaanBlock[] = [
      {
        id: "block-1",
        itemId: "doc-1",
        type: "paragraph",
        content: "In vault",
        order: 0,
        createdAt: "2026-06-04T00:00:00.000Z",
        updatedAt: "2026-06-04T00:00:00.000Z",
      },
      {
        id: "block-1",
        itemId: "missing-item",
        type: "paragraph",
        content: "Orphan",
        order: 1,
        createdAt: "2026-06-04T00:00:00.000Z",
        updatedAt: "2026-06-04T00:00:00.000Z",
      },
    ];
    const relations: MizaanRelation[] = [
      {
        id: "rel-1",
        sourceId: "doc-1",
        targetId: "missing-target",
        relationType: "mentions",
        label: "Mentions",
        createdAt: "2026-06-04T00:00:00.000Z",
        metadata: {},
      },
      {
        id: "rel-1",
        sourceId: "missing-source",
        targetId: "doc-1",
        relationType: "mentions",
        label: "Mentions",
        createdAt: "2026-06-04T00:00:00.000Z",
        metadata: {},
      },
    ];
    const snapshot = makeSnapshot({
      items: [
        makeItem("doc-1", {
          metadata: {
            linkedPersonIds: ["missing-person"],
            taskProjectId: "missing-project",
          },
        }),
        makeItem("doc-1", { category: "documents" }),
      ],
      blocks,
      relations,
    });

    const summary = createVaultHealthSummary(snapshot);

    expect(summary.duplicateItemIds).toEqual(["doc-1"]);
    expect(summary.duplicateBlockIds).toEqual(["block-1"]);
    expect(summary.duplicateRelationIds).toEqual(["rel-1"]);
    expect(summary.orphanBlockIds).toEqual(["block-1"]);
    expect(summary.orphanRelationIds).toEqual(["rel-1"]);
    expect(summary.invalidMetadataCount).toBe(2);
    expect(summary.invalidMetadataReferences).toEqual([
      { itemId: "doc-1", field: "linkedPersonIds", targetId: "missing-person" },
      { itemId: "doc-1", field: "taskProjectId", targetId: "missing-project" },
    ]);
    expect(summary.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "duplicate-item-id",
        "duplicate-block-id",
        "duplicate-relation-id",
        "orphan-block",
        "orphan-relation",
        "invalid-metadata-reference",
      ]),
    );
    expect(getVaultHealthScore(summary)).toBe("attention");
  });

  it(``, async () => {
    const summary = createVaultHealthSummary(makeSnapshot());

    expect(summary.emptyVault).toBe(true);
    expect(summary.counts.items).toBe(0);
    expect(summary.issues).toEqual([
      {
        code: "empty-vault",
        severity: "info",
        message: "No vault items are currently stored in the browser prototype.",
      },
    ]);
    expect(getVaultHealthScore(summary)).toBe("empty");
  });
});
